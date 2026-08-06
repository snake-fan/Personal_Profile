---
title: Ray 的 python 进程资源管理
date: 2026-08-06
readTime: 8 min
category: 工程实践
excerpt: 从逻辑资源账本、worker 复用到子进程管理，理解 Ray 如何调度任务，以及资源声明与真实硬件消耗之间的差异。
---

# Ray 的资源管理与任务调度机制

Ray 可以理解为一个运行在 Python 程序之上的分布式任务调度框架。

它的主要作用是：

1. 接收 Python 程序提交的计算任务；
2. 根据任务声明的 CPU、GPU 等资源需求进行调度；
3. 将任务交给合适的 worker 进程执行；
4. 管理任务之间的数据传递；
5. 将执行结果返回给主程序。

需要注意的是，Ray 管理的核心对象是**任务和 worker**，而不是直接控制物理 CPU 或 GPU。

---

## 1. Ray 的资源声明是一套逻辑账本

在 Ray 中，可以为一个任务声明它需要多少 CPU 和 GPU：

```python
import ray

@ray.remote(num_cpus=2, num_gpus=1)
def process_video():
    ...
```

这里表示：

```text
process_video 任务在调度时需要：

2 个逻辑 CPU 资源
1 个逻辑 GPU 资源
```

当任务被提交时，Ray 会检查当前的资源账本。

如果资源足够，Ray 就从账本中扣除相应资源，并允许任务开始执行；如果资源不足，任务就会等待，直到其他任务结束并归还资源。

整体过程可以理解为：

```text
提交任务
   ↓
读取任务声明的资源需求
   ↓
检查 Ray 的资源账本
   ↓
资源足够：允许任务运行
资源不足：任务等待
   ↓
任务结束
   ↓
归还逻辑资源
```

---

## 2. 逻辑资源不等于物理资源配额

这是使用 Ray 时最需要注意的一点：

> Ray 的资源声明本质上是并发调度账本，而不是实际的物理资源配额。

例如：

```python
@ray.remote(num_cpus=1)
def task_a():
    ...
```

Ray 只会在资源账本中记录：

```text
task_a 占用 1 个逻辑 CPU
```

但这并不意味着操作系统会严格限制该任务只能使用一个物理 CPU 核。

如果 `task_a` 内部启动了多个线程，或者调用了会自动并行计算的 NumPy、OpenCV、PyTorch、FFmpeg 等库，它实际上可能消耗多个 CPU 核。

反过来，一个任务即使声明：

```python
@ray.remote(num_cpus=5)
def task_b():
    ...
```

它也可能因为主要在等待磁盘、网络或 GPU，实际只使用很少的 CPU 算力。

因此可能出现两种情况。

### 2.1 逻辑资源已经耗尽，但物理资源仍然空闲

例如，一个任务声明占用 5 个 CPU，但实际只使用 0.5 个 CPU。

Ray 仍然会认为这 5 个逻辑 CPU 已经被占用，因此其他任务可能继续等待，即使机器的真实 CPU 利用率并不高。

```text
Ray 账本：CPU 已全部分配
真实硬件：CPU 利用率较低
```

### 2.2 逻辑资源仍有剩余，但物理资源已经过载

例如，多个任务都只声明占用 1 个 CPU，但每个任务内部都启动了大量线程。

此时 Ray 的账本可能仍显示有可用 CPU，但真实机器已经达到 100% CPU 利用率。

```text
Ray 账本：仍有可用 CPU
真实硬件：CPU 已经满载
```

因此，在为任务声明资源时，需要根据任务的实际计算行为进行估算，而不能只根据函数数量或进程数量分配。

---

## 3. Ray 如何执行 Python 任务

Ray 程序通常包含两类进程：

```text
主 Python 进程
    ↓
Ray worker 进程
```

主 Python 进程负责提交任务：

```python
result_ref = process_video.remote()
```

真正执行 `process_video` 的通常是 Ray 管理的 worker 进程。

Ray 会根据资源账本，为任务寻找一个合适的 worker：

```text
Python 主程序提交任务
        ↓
Ray 检查资源需求
        ↓
资源足够
        ↓
找到或启动 worker
        ↓
worker 执行任务
        ↓
返回结果
```

需要注意的是：

> Ray 不一定为每次 `.remote()` 调用都创建一个新的 Python 进程。

普通任务通常会复用已经启动的 worker 进程。一个 worker 执行完当前任务后，还可以继续执行其他任务。

所以更准确的说法是：

> Ray 根据资源账本决定任务何时可以运行，并把任务分配给合适的 worker 进程。

---

## 4. Ray 中的子进程管理

Ray worker 内部也可以继续启动其他程序或子进程，例如：

```python
import subprocess
import ray

@ray.remote(num_cpus=4, num_gpus=1)
def run_inference():
    subprocess.run(
        ["python", "inference.py"],
        check=True,
    )
```

此时进程关系大致是：

```text
主 Python 进程
    ↓
Ray worker 进程
    ↓
inference.py 子进程
```

Ray 的资源账本只知道外层任务声明了：

```text
4 个 CPU
1 个 GPU
```

Ray 不会自动分析 `inference.py`：

- 启动了多少线程；
- 启动了多少子进程；
- 实际占用了多少 CPU；
- 实际使用了多少显存；
- 是否又调用了其他并行计算库。

因此，如果 Ray 任务内部还会启动 FFmpeg、模型推理进程、多进程数据加载器或其他程序，就需要提前估算它们的总体资源需求。

否则可能出现：

```text
声明资源过多：
Ray 认为没有资源，任务大量排队，但硬件仍然空闲。

声明资源过少：
Ray 同时放行过多任务，导致 CPU、内存、显存或磁盘 IO 过载。
```

---

## 5. CPU 和 GPU 的分配方式并不完全相同

### 5.1 CPU

CPU 资源主要用于 Ray 的逻辑记账和并发控制。

例如：

```python
@ray.remote(num_cpus=2)
def task():
    ...
```

表示 Ray 调度该任务时，要预留两个逻辑 CPU 单位。

但 Ray 默认不会严格把这个 worker 绑定到两个固定的物理 CPU 核，也不会强制限制任务最多只能使用两个核心。

真实 CPU 使用量最终由以下因素决定：

- 任务代码；
- 线程数量；
- 子进程数量；
- NumPy、OpenCV、PyTorch 等库的线程配置；
- 操作系统的进程调度。

### 5.2 GPU

GPU 除了进行逻辑记账外，Ray 通常还会为 worker 设置：

```bash
CUDA_VISIBLE_DEVICES
```

例如，任务被分配到物理 GPU 1：

```bash
CUDA_VISIBLE_DEVICES=1
```

这样，该 worker 以及它启动的子进程通常只能看到这张 GPU。

但是，Ray 仍然不会自动限制：

- GPU 显存使用量；
- GPU 核心计算比例；
- 单个任务能够占用多少 GPU 时间。

因此：

```python
@ray.remote(num_gpus=0.5)
def task():
    ...
```

只表示 Ray 允许两个这样的任务共享一张 GPU，并不代表每个任务一定只使用一半显存或一半算力。

---

## 6. 手动声明 Ray 的逻辑资源

假设机器实际上只有 8 个 CPU 核，但希望 Ray 最多允许 16 个申请 `1 CPU` 的任务同时运行，可以手动将逻辑 CPU 数量设置为 16：

```python
import ray

ray.init(
    num_cpus=16,
    num_gpus=1,
    object_store_memory=20 * 1024**3,
)
```

这里各个参数的含义是：

```text
num_cpus=16
Ray 的资源账本中登记 16 个逻辑 CPU。

num_gpus=1
Ray 的资源账本中登记 1 个逻辑 GPU。

object_store_memory=20 * 1024**3
为 Ray 的对象存储预留约 20 GB 内存。
```

其中，`object_store_memory` 用于存放任务之间传递的数据对象，并不代表任务可使用的普通进程内存。

设置 `num_cpus=16` 后，如果每个任务声明：

```python
@ray.remote(num_cpus=1)
def task():
    ...
```

Ray 最多可以同时放行 16 个这样的任务。

但是机器仍然只有 8 个物理 CPU 核：

```text
Ray 逻辑资源：16 CPU
真实硬件资源：8 CPU 核
```

这些任务最终仍然由操作系统调度到原来的 8 个物理核心上执行。

因此，手动扩大逻辑 CPU 数量只是提高任务并发度，并不会增加机器的实际计算能力。

这种方式更适合以下任务：

- 网络请求；
- 磁盘读取；
- 等待外部服务；
- CPU 使用率较低的任务；
- 大量时间处于阻塞状态的任务。

如果任务本身是持续占满 CPU 的计算任务，设置过高的逻辑 CPU 数量通常不会加速，反而可能带来：

- 上下文切换增加；
- 内存占用上升；
- CPU 缓存命中率下降；
- 多线程争抢；
- 系统整体性能下降。

---

## 7. 通过命令行指定逻辑 CPU 数量

除了在 Python 中使用 `ray.init()`，也可以在启动 Ray 服务时指定逻辑资源。

先停止原来的 Ray 实例：

```bash
ray stop --force
```

然后启动一个 head 节点，并声明 16 个逻辑 CPU：

```bash
ray start --head --num-cpus=16
```

Python 程序再连接到这个 Ray 实例：

```python
import ray

ray.init(address="auto")
```

此时资源数量由 `ray start` 时的参数决定。

不应在连接已有集群时再次通过 `ray.init(num_cpus=...)` 修改该节点的资源配置。需要修改时，通常应停止 Ray，然后使用新的资源参数重新启动。

---

## 8. 实际使用建议

为 Ray 任务声明资源时，应主要考虑任务的真实运行行为。

例如，一个视频处理任务可能包含：

```text
视频解码
OpenCV 图像处理
模型推理
数据加载线程
FFmpeg 子进程
结果编码
```

即使外层看起来只是一个 Python 函数，它内部也可能消耗多个 CPU 核、GPU 显存和大量内存。

因此，资源声明最好根据实际监控结果进行调整：

```text
先运行少量任务
    ↓
观察 CPU、GPU、内存和显存使用情况
    ↓
确定单个任务的大致资源需求
    ↓
设置 num_cpus 和 num_gpus
    ↓
再逐步提高并发数量
```

可以重点观察：

```bash
htop
nvidia-smi
ray status
ray summary tasks
ray summary actors
ray memory
```

---

## 9. 总结

Ray 的资源管理可以概括为：

```text
任务声明资源需求
        ↓
Ray 根据逻辑资源账本决定任务是否可以运行
        ↓
Ray 将任务交给 worker 进程
        ↓
worker 执行 Python 代码或启动其他子进程
        ↓
任务结束后归还逻辑资源
```

其中最重要的是：

> Ray 的 CPU 和 GPU 声明主要用于任务调度和并发控制，而不是严格的物理资源隔离。

`num_cpus=2` 不代表任务一定会使用两个 CPU 核，也不代表任务最多只能使用两个 CPU 核。

`num_gpus=1` 表示 Ray 会为任务预留一份 GPU 资源，并通常将一个真实 GPU 设备暴露给该 worker，但不会自动限制显存和 GPU 算力比例。

因此，合理使用 Ray 的关键并不是简单地把逻辑资源设置得越大越好，而是根据任务的实际 CPU、GPU、内存和 IO 使用情况，为每个任务设置合理的资源声明。
