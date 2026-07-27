import { Github } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { profile } from '../data.js'

const navItems = [
  { label: '首页', to: '/' },
  { label: '论文', to: '/papers' },
  { label: '项目', to: '/projects' },
  { label: '博客', to: '/blog' },
]

export default function Layout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <header className="site-header">
        <NavLink className="brand" to="/" aria-label={`${profile.name} 首页`}>
          <span className="brand-mark" aria-hidden="true">
            {profile.initials}
          </span>
          <span>{profile.name}</span>
        </NavLink>

        <nav className="main-nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="footer-note">研究 · 构建 · 写作</p>
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="访问 GitHub">
          <Github size={18} strokeWidth={1.8} />
          GitHub
        </a>
      </footer>
    </div>
  )
}
