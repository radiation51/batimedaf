import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import LangSwitch from './LangSwitch'
import { useNavLinks } from '../hooks/useNavLinks'
import './FullMenu.css'

// TODO: replace with the real profile URLs.
const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Facebook', href: '#' },
]

/** The menu on narrow screens: a full sheet of paper over the page. */
function FullMenu({ open, onClose }) {
  const t = useUI()
  const contact = useLocalizedContent().contact
  const links = useNavLinks()

  // The sheet is opaque, but without this the page underneath keeps
  // scrolling with the wheel or a swipe, invisibly.
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      className={`menu${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="wrap menu-top">
        <Link className="nav-logo" to="/" onClick={onClose}>
          Batimedaf
        </Link>
        <button type="button" className="menu-close" onClick={onClose}>
          {t.close}
        </button>
      </div>

      <nav className="wrap menu-nav" aria-label={t.mainMenu}>
        <ol className="menu-links">
          {links.map((link, i) => (
            <li key={link.href}>
              <Link to={link.href} onClick={onClose}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu-label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="wrap menu-foot">
        <div>
          <span className="label">{t.menuTitleContact}</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
        </div>
        <div>
          <span className="label">{t.menuTitleFollow}</span>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href}>
              {s.label}
            </a>
          ))}
        </div>
        <LangSwitch className="menu-lang" />
      </div>
    </div>
  )
}

export default FullMenu
