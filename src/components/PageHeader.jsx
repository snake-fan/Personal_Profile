import { Link } from 'react-router-dom'

export default function PageHeader({ eyebrow, title, description, count }) {
  return (
    <header className="page-header">
      <Link className="back-link" to="/">
        ← 返回首页
      </Link>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <span className="page-count" aria-label={`${count} 项内容`}>
          {String(count).padStart(2, '0')}
        </span>
      </div>
      <p className="page-description">{description}</p>
    </header>
  )
}
