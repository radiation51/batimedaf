import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useNavLinks } from '../hooks/useNavLinks'
import { useEdit } from '../content/editable'
import './Footer.css'

// TODO: replace with the real profile URLs.
const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Facebook', href: '#' },
]

function Footer() {
  const t = useUI()
  const contact = useLocalizedContent().contact
  const edit = useEdit(['contact'])
  const navLinks = useNavLinks()
  const year = new Date().getFullYear()

  // Only entries with a real destination.
  const resourceLinks = [
    { label: t.footerResourceLinks.realisations, href: '/residence' },
    { label: t.footerResourceLinks.apartments, href: '/residence/le-bosquet' },
    { label: t.footerResourceLinks.press, href: '/contact?sujet=presse' },
    { label: t.footerResourceLinks.partner, href: '/collaboration' },
  ]

  const legalLinks = [
    { label: t.footerLegalLinks.mentions, href: '/legal/mentions-legales' },
    { label: t.footerLegalLinks.privacy, href: '/legal/confidentialite' },
    { label: t.footerLegalLinks.terms, href: '/legal/cgu' },
  ]

  return (
    <footer className="ft" data-nav-tone="dark">
      <div className="wrap">
        <div className="ft-cta">
          <h2 className="d2 ft-cta-title">
            {t.footerCtaTitle} {t.footerCtaTitleLine2}
          </h2>
          <Link className="btn btn--light" to="/contact?sujet=visite">
            {t.bookCall}
            <Arrow />
          </Link>
        </div>

        <div className="ft-cols">
          <div className="ft-brand">
            <Link className="ft-logo" to="/">
              Batimedaf
            </Link>
            <p className="ft-tagline">{t.footerTagline}</p>
            <ul className="ft-social" aria-label={t.menuTitleFollow}>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="ft-col" aria-label={t.footerNavTitle}>
            <h3 className="label">{t.footerNavTitle}</h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft-col" aria-label={t.footerResourcesTitle}>
            <h3 className="label">{t.footerResourcesTitle}</h3>
            <ul>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-col ft-col--wide">
            <h3 className="label">{t.footerContactTitle}</h3>
            <ul>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  {...edit('phone')}
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} {...edit('email')}>
                  {contact.email}
                </a>
              </li>
              <li>
                <address {...edit('address')}>{contact.address}</address>
              </li>
            </ul>
          </div>

        </div>

        <div className="ft-bottom">
          <p>
            © {year} Batimedaf. {t.footerCopyright}
          </p>
          <ul className="ft-legal">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="ft-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t.toTop}
            <Arrow size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
