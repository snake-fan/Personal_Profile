import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / Not found</p>
      <h1>这里暂时没有内容。</h1>
      <p>你访问的页面可能已经移动，或者还没有被创建。</p>
      <Link to="/">返回首页 →</Link>
    </section>
  )
}
