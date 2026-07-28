import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import MarkdownContent from '../components/MarkdownContent.jsx'
import { profile, sections } from '../data.js'

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-meta">
          <span>Portfolio / 2026</span>
          <span className="location"><MapPin size={14} /> {profile.location}</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">{profile.role}</p>
          <h1 id="hero-title">
            {profile.heroLine1}<br />
            {profile.heroLine2}<span className="accent-dot">。</span>
          </h1>
        </div>

        <div className="hero-bottom">
          <p>{profile.intro}</p>
          <a className="scroll-cue" href="#work">
            浏览内容 <ArrowDownRight size={18} />
          </a>
        </div>
      </section>

      <section className="about" aria-labelledby="about-title">
        <div className="about-heading">
          <p className="eyebrow">About / Profile</p>
          <h2 id="about-title">个人介绍</h2>
        </div>
        <MarkdownContent className="about-copy">{profile.content}</MarkdownContent>
      </section>

      <section className="section-list" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow" id="work-title">Selected work</p>
          <p>三个方向，一条持续展开的路径。</p>
        </div>

        <div className="module-grid">
          {sections.map((section) => (
            <Link
              className={`module-card accent-${section.accent}`}
              to={section.to}
              key={section.to}
            >
              <div className="module-top">
                <span>{section.index}</span>
                <ArrowUpRight size={24} strokeWidth={1.5} />
              </div>
              <div className="module-copy">
                <p>{section.english}</p>
                <h2>{section.title}</h2>
                <span>{section.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="statement">
        <p className="eyebrow">Working principles</p>
        <blockquote>
          “{profile.principle}”
        </blockquote>
      </section>
    </>
  )
}
