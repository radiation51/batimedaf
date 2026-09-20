import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../i18n/useLocalizedContent'
import './FullMenu.css'

// TODO: replace with the real profile URLs.
const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Facebook', href: '#' },
]

function FullMenu({ open, onClose }) {
  const t = useUI()
  const LINKS = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.residence, href: '/residence' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
    { label: t.nav.collaboration, href: '/collaboration' },
  ]
  // The overlay is opaque, but without this the page underneath keeps
  // scrolling with the wheel/trackpad — invisible until the menu closes and
  // the reader lands somewhere they never scrolled to themselves.
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
    <div className={`full-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="full-menu-columns">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`full-menu-col full-menu-col--${i}`} />
        ))}
      </div>

      <button
        type="button"
        className="full-menu-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <span />
        <span />
      </button>

      <div className="full-menu-content">
        <nav className="full-menu-nav" aria-label={t.mainMenu}>
          <ul className="full-menu-links">
            {LINKS.map((link, i) => {
              const inner = (
                <>
                  <span className="full-menu-index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="full-menu-label">{link.label}</span>
                  <svg
                    className="full-menu-arrow"
                    width="22"
                    height="22"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )

              return (
                <li key={link.label} style={{ '--i': i }}>
                  {/* Routed pages use Link; pages that don't exist yet stay
                      plain anchors — <Link to="#"> would resolve "#" against
                      the current route and navigate somewhere wrong. */}
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} onClick={onClose}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={link.href} onClick={onClose}>
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="full-menu-aside" style={{ '--i': LINKS.length }}>
          <div className="full-menu-block">
            <h3 className="full-menu-block-title">{t.menuTitleContact}</h3>
            <a
              className="full-menu-contact"
              href="mailto:contact@batimedaf.com"
            >
              contact@batimedaf.com
            </a>
            <a className="full-menu-contact" href="tel:+33100000000">
              +33 1 00 00 00 00
            </a>
          </div>

          <div className="full-menu-block">
            <h3 className="full-menu-block-title">{t.menuTitleStudio}</h3>
            <address className="full-menu-address">
              12 avenue des Bâtisseurs
              <br />
              75008 Paris, France
            </address>
          </div>

          <div className="full-menu-block">
            <h3 className="full-menu-block-title">{t.menuTitleFollow}</h3>
            <ul className="full-menu-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullMenu
