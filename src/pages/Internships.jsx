import PageHeader from '../components/PageHeader.jsx'
import MarkdownContent from '../components/MarkdownContent.jsx'
import { internships } from '../data.js'

export default function Internships() {
  return (
    <section className="inner-page">
      <PageHeader
        eyebrow="Experience / Internships"
        title="实习经历"
        description="在真实业务与研究场景中，把问题拆开、把系统搭起，也把经验沉淀下来。"
        count={internships.length}
      />

      <div className="internship-list">
        {internships.map((internship, index) => (
          <article className="internship-item" key={internship.slug}>
            <div className="internship-meta">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{internship.period}</span>
            </div>

            <div className="internship-main">
              <p className="item-kicker">{internship.organization}</p>
              <h2>{internship.role}</h2>
              {internship.summary && (
                <p className="internship-summary">{internship.summary}</p>
              )}
              <MarkdownContent className="internship-body">
                {internship.content}
              </MarkdownContent>
              {internship.tags?.length > 0 && (
                <ul className="tag-list" aria-label="实习相关技术">
                  {internship.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

