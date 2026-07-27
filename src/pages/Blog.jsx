import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { posts } from '../data.js'

export default function Blog() {
  return (
    <section className="inner-page">
      <PageHeader
        eyebrow="Notes / Tech Blog"
        title="技术博客"
        description="把实践中的选择、失误和方法写下来，让经验成为可以被复用的知识。"
        count={posts.length}
      />

      <div className="post-list">
        {posts.map((post, index) => (
          <article className="post-item" key={post.title}>
            <div className="post-date">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <div className="post-copy">
              <p className="item-kicker">{post.category}</p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
            <span className="post-arrow" aria-hidden="true">
              <ArrowUpRight size={24} strokeWidth={1.5} />
            </span>
            <span className="post-number">{String(index + 1).padStart(2, '0')}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
