# Personal Profile

一个使用 React + Vite 构建的简约个人网站，包含论文、项目和技术博客三个独立页面，并内置 GitHub Pages 自动部署工作流。

## 本地运行

```bash
npm install
npm run dev
```

执行 `npm run build` 可以在 `dist` 目录生成生产版本。

## 修改个人内容

网站中的姓名、简介、论文、项目和文章都集中在 `src/data.js`。修改这个文件即可更新主要内容，无需调整页面结构。

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库的 `main` 分支。
2. 打开仓库的 **Settings → Pages**。
3. 将 **Build and deployment → Source** 设为 **GitHub Actions**。
4. 之后每次推送到 `main`，`.github/workflows/deploy.yml` 都会自动构建并发布网站。

工作流会根据 GitHub 仓库名自动设置资源路径，因此仓库改名后也不需要手动修改 Vite 配置。
