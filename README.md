# Personal Profile

基于 React、Vite 和 Markdown 的个人网站。网站内容统一存放在根目录的 `data` 中，页面通过 Vite 的 `import.meta.glob` 在构建时读取 Markdown，不需要维护额外的 JavaScript 数据列表。

## 内容目录

```text
data/
├── profile/
│   └── about.md
├── blog/
│   └── article-slug.md
├── internships/
│   └── company-slug.md
└── papers/
    └── paper-slug.md
```

每个文件由 YAML 风格的 front matter 和 Markdown 正文组成。文件名会作为内容的 URL slug，例如 `data/blog/why-i-write.md` 对应 `/blog/why-i-write`。

博客字段：`title`、`date`、`readTime`、`category`、`excerpt`。

实习字段：`organization`、`role`、`period`、`location`、`summary`、`tags`、`order`。

论文字段：`title`、`year`、`type`、`authors`、`venue`、`tags`、`order`。

数组使用行内形式，例如：

```md
---
title: 示例文章
date: 2026-07-28
tags: [React, Markdown]
---

这里开始写 Markdown 正文。
```

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```
