import { Link, useParams } from 'react-router-dom'
import MarkdownContent from '../components/MarkdownContent.jsx'
import { formatDate } from '../lib/markdown.js'
import { posts } from '../data.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    return (
      <section className="not-found">
        <p className="eyebrow">404 / Post not found</p>
        <h1>没有找到这篇文章。</h1>
        <Link to="/blog">← 返回博客</Link>
      </section>
    )
  }

  return (
    <article className="article-page">
      <header className="article-header">
        <Link className="back-link" to="/blog">← 返回博客</Link>
        <p className="eyebrow">{post.category} / {formatDate(post.date)}</p>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <MarkdownContent className="article-body">{post.content}</MarkdownContent>
    </article>
  )
}

