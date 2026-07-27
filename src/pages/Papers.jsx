import PageHeader from '../components/PageHeader.jsx'
import { papers } from '../data.js'

export default function Papers() {
  return (
    <section className="inner-page">
      <PageHeader
        eyebrow="Research / Papers"
        title="论文"
        description="关注人与技术如何协作，以及我们应该怎样观察、评估并解释这种关系。"
        count={papers.length}
      />

      <div className="paper-list">
        {papers.map((paper, index) => (
          <article className="paper-item" key={paper.title}>
            <div className="paper-index">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{paper.year}</span>
            </div>
            <div className="paper-main">
              <p className="item-kicker">{paper.type}</p>
              <h2>{paper.title}</h2>
              <p className="paper-authors">{paper.authors}</p>
              <p className="paper-venue">{paper.venue}</p>
              <ul className="tag-list" aria-label="论文主题">
                {paper.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
