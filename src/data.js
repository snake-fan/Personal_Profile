export const profile = {
  name: 'Snake Fan',
  initials: 'SF',
  role: 'Researcher · Developer · Writer',
  intro: '在研究、工程与写作之间，持续探索值得被解决的问题。',
  location: 'Shanghai, China',
  github: 'https://github.com/snake-fan',
}

export const sections = [
  {
    index: '01',
    title: '论文',
    english: 'Papers',
    description: '研究问题、方法与结论，以及仍在继续的思考。',
    to: '/papers',
    accent: 'blue',
  },
  {
    index: '02',
    title: '项目',
    english: 'Projects',
    description: '从想法到实现，记录有用、可靠且有温度的产品。',
    to: '/projects',
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

// 以下为示例内容，可直接替换成你的真实论文。
export const papers = [
  {
    year: '2025',
    type: 'Conference Paper',
    title: '面向复杂任务的人机协作框架：设计、评估与反思',
    authors: 'Snake Fan · Collaborators',
    venue: 'International Conference on Human-Centered Computing',
    tags: ['Human-AI Interaction', 'Evaluation'],
  },
  {
    year: '2024',
    type: 'Journal Article',
    title: '从原型到长期使用：交互系统中的信任形成',
    authors: 'Snake Fan · Collaborators',
    venue: 'Journal of Interactive Systems',
    tags: ['Trust', 'Longitudinal Study'],
  },
  {
    year: '2024',
    type: 'Workshop Paper',
    title: '让研究可复现：轻量化实验工作流的设计',
    authors: 'Snake Fan',
    venue: 'Workshop on Open Research Practices',
    tags: ['Open Science', 'Workflow'],
  },
]

// 以下为示例内容，可直接替换成你的真实项目。
export const projects = [
  {
    number: '01',
    title: 'Research Atlas',
    description: '把散落的论文、批注与研究问题组织成一张可检索、可追踪的知识地图。',
    status: '持续迭代',
    stack: ['React', 'TypeScript', 'Local-first'],
    accent: 'blue',
  },
  {
    number: '02',
    title: 'Signal Lab',
    description: '用于快速验证交互假设的实验工具集，让原型、观察和结论保持在同一条链路上。',
    status: '实验项目',
    stack: ['Python', 'Data Viz', 'Research'],
    accent: 'green',
  },
  {
    number: '03',
    title: 'Paper Trail',
    description: '一个小而专注的写作空间，帮助技术笔记从片段逐渐生长为完整文章。',
    status: '开源',
    stack: ['Vite', 'Markdown', 'GitHub'],
    accent: 'orange',
  },
]

// 以下为示例内容，可直接替换成你的真实文章。
export const posts = [
  {
    date: '2025.06.18',
    readTime: '8 min',
    title: '先定义问题，再选择工具',
    excerpt: '技术选型不是工具之间的赛跑，而是对约束、成本与长期维护方式的共同判断。',
    category: '工程实践',
  },
  {
    date: '2025.04.02',
    readTime: '6 min',
    title: '构建个人研究系统的一年',
    excerpt: '从收集信息到形成观点，一个真正有效的系统应该减少摩擦，而不是增加仪式。',
    category: '工作方法',
  },
  {
    date: '2025.01.12',
    readTime: '5 min',
    title: '为什么我开始写技术博客',
    excerpt: '写作迫使模糊的经验变得具体，也让一次解决问题的过程拥有更长的生命周期。',
    category: '随笔',
  },
]
