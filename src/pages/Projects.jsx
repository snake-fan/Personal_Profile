import { Github } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { profile, projects } from '../data.js'

export default function Projects() {
  return (
    <section className="inner-page">
      <PageHeader
        eyebrow="Selected / Projects"
        title="项目"
        description="一些从真实问题出发的实践：先理解约束，再寻找恰到好处的解决方式。"
        count={projects.length}
      />

      <div className="project-grid">
        {projects.map((project) => (
          <article className={`project-card accent-${project.accent}`} key={project.title}>
            <div className="project-card-top">
              <span className="project-number">{project.number}</span>
              <span className="project-status">{project.status}</span>
            </div>
            <div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <ul className="project-stack" aria-label="项目技术">
              {project.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <a className="github-callout" href={profile.github} target="_blank" rel="noreferrer">
        <span><Github size={20} /> 更多代码与实验</span>
        <span>访问 GitHub ↗</span>
      </a>
    </section>
  )
}
