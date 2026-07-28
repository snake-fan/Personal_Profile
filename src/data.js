import { parseMarkdown } from './lib/markdown.js'

// Vite 会在构建时读取 data 目录中的所有 Markdown，并将原文交给前端解析。
// 新增或删除 Markdown 文件后，无需再维护 JavaScript 数据列表。
const markdownFiles = import.meta.glob('../data/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const documents = Object.entries(markdownFiles).map(([path, source]) =>
  parseMarkdown(source, path),
)

function fromDirectory(directory) {
  return documents.filter((document) =>
    document.sourcePath.includes(`/data/${directory}/`),
  )
}

function byOrder(left, right) {
  return (left.order ?? Number.MAX_SAFE_INTEGER) -
    (right.order ?? Number.MAX_SAFE_INTEGER)
}

export const profile = fromDirectory('profile')[0] ?? {}

export const posts = fromDirectory('blog').sort((left, right) =>
  String(right.date).localeCompare(String(left.date)),
)

export const internships = fromDirectory('internships').sort(byOrder)

export const papers = fromDirectory('papers').sort((left, right) => {
  if (left.order != null || right.order != null) return byOrder(left, right)
  return String(right.year).localeCompare(String(left.year))
})

export const sections = [
  {
    index: '01',
    title: '论文',
    english: 'Papers',
    description: '研究问题、方法与结论，以及仍在继续的探索。',
    to: '/papers',
    accent: 'blue',
  },
  {
    index: '02',
    title: '实习',
    english: 'Internships',
    description: '在真实业务与研究场景中，记录实践、协作与成长。',
    to: '/internships',
    accent: 'green',
  },
  {
    index: '03',
    title: '技术博客',
    english: 'Tech Blog',
    description: '关于技术实践、工具选择与工作方法的长期笔记。',
    to: '/blog',
    accent: 'orange',
  },
]
