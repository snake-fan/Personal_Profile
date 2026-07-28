---
title: docker 部署
date: 2026-07-28
readTime: 8 min
category: 工程实践
excerpt: 通过 docker 进行项目打包部署
---

# 为什么要用 Docker 部署，Docker 到底是个什么东西

首先明确一下 docker 的定位，他介于 虚拟机 和 真机部署 之间。

可以简单的将操作系统分为两个部分
```
操作系统
├── 内核
└── 用户空间
```

docker 就是具有完整用户空间，但不具备操作系统内核的定位，他的环境独立，但是必须依靠宿主机的操作系统内核进行启动。

这给了它这几个优点：
1. 轻量化，并不具备厚重的内核，可以压缩 image 体积
2. 环境隔离，每个程序模块可以单独配置环境，并在打包 image 时写好，在 docker 内网进行通信
3. 单个操作系统可以启动多个 container 实例，来实现程序各个模块独立运行

# Docker 的几个核心概念

## Dockerfile
首先从最基本的概念讲起，打包docker 的第一步就是在项目目录下创建一个 `Dockerfile` 文件，例如：
```
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

> Dockefile 用来描述：应该在什么基础环境上，执行哪些操作，最终构建出什么样的镜像。

这里很像一个命令集，实际上就是一个构建镜像的声明式步骤，在 build image 的时候会根据这里的声明进行执行

> 这里有一个小 tips，docker 构建 image 的时候，是采用一层一层进行构造的，这样的优势是，如果重新 build，那么前面层级的步骤中的文件内容没有改变，就可以复用缓存

有了这个 `Dockerfile` 之后，就可以用 docker engine 的命令来 build image 了，例如：
```
docker build -t my-app .
```

这里的 -t 代表 tag，. 代表以那个目录为根目录进行构建

之后启动只需要用以下命令即可：
```
docker run -d \
  --name my-app-container \
  -p 8000:8000 \
  my-app
```

## Docker Compose

> Dockerfile 负责描述“一个镜像怎么构建”，Compose 负责描述“整个项目有哪些容器，以及这些容器怎么一起运行”。

`compose.yaml` 通常作为组织整个项目的 docker 的文件，放在整个项目的根目录下，统一配置应用的各个模块。

例如:
```
services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cognion_db
      POSTGRES_USER: cognion
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://cognion:password@database:5432/cognion_db
    depends_on:
      - database

  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

这里可以把整个应用的各个模块对应的 docker 配置打包在一起，后续只需要
```
docker compose up -d --build
```
compose 会按照文件描述构建镜像、创建网络、创建容器，并启动整套服务。

具体的字段意思这里不多说，就强调几个关键点。

### service

这里每个 service 一般对应一个 docker container，可以通过 image 进行构建，也可以通过 build + context 进行构建，这里的 context 是包含 Dockerfile 的文件目录，去那里自动创建 image。

还要强调一点，各个容器之间通过 service 底下配置的名称进行通信，例如`DATABASE_URL: postgresql://cognion:password@database:5432/cognion_db` 就是引用了 `database` 这个 service。

### volumes

这个东西主要用于挂载文件目录，防止在停止 container 服务时，数据跟着一起丢失，具体使用案例：
```
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

# 总结

整个 Docker 部署流程可以概括为：

```
Dockerfile
    ↓ docker build
Image
    ↓ docker run
Container
```

Dockerfile 是镜像的构建说明书，Image 是包含代码、运行时和依赖的只读模板，Container 则是基于镜像创建出来的运行实例。

当项目中只有一个服务时，可以直接使用 `docker build` 和 `docker run` 完成部署；当项目包含前端、后端、数据库等多个模块时，则可以使用 Docker Compose，将各个服务的镜像、端口、环境变量、网络关系和数据卷统一写入 `compose.yaml`，再通过一条命令启动整套应用。

```
docker compose up -d --build
```

总而言之：
- Dockerfile 决定镜像怎么构建
- Image 决定容器里有什么
- Container 是真正运行的服务实例
- Compose 负责组织和管理多个容器
- Volume 负责保存需要持久化的数据