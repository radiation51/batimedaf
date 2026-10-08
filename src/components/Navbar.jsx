import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FullMenu from './FullMenu'
import LangSwitch from './LangSwitch'
import { useUI } from '../i18n/useLocalizedContent'
import { useNavLinks } from '../hooks/useNavLinks'
import './Navbar.css'

function Navbar() {
  const t = useUI()
  const links = useNavLinks()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Any navigation closes the menu.
  useEffect(() => setMenuOpen(false), [pathname])

  const isCurrent = (href) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <Link className="nav-logo" to="/">
            Batimedaf
          </Link>

          <nav className="nav-links" aria-label={t.mainMenu}>
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link${isCurrent(link.href) ? ' is-current' : ''}`}
                aria-current={isCurrent(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-tools">
            <LangSwitch className="nav-lang" />
            <Link className="nav-cta" to="/contact?sujet=visite">
              {t.bookCall}
            </Link>
            <button
              type="button"
              className="nav-menu-btn"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              {t.menu}
            </button>
          </div>
        </div>
      </header>

      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

export default Navbar
