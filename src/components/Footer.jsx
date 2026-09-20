import { Link } from 'react-router-dom'
import { useUI } from '../i18n/useLocalizedContent'
import './Footer.css'

// TODO: replace with the real profile URLs.
const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Facebook', href: '#' },
]

function Footer() {
  const t = useUI()
  const year = new Date().getFullYear()

  const NAV_LINKS = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.residence, href: '/residence' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
    { label: t.nav.collaboration, href: '/collaboration' },
  ]

  // Only entries with a real destination. "Careers" was dropped: there is no
  // careers page, and a link that goes nowhere is worse than no link.
  const RESOURCE_LINKS = [
    { label: t.footerResourceLinks.realisations, href: '/residence' },
    { label: t.footerResourceLinks.apartments, href: '/residence/le-bosquet' },
    { label: t.footerResourceLinks.press, href: '/contact?sujet=presse' },
    { label: t.footerResourceLinks.partner, href: '/collaboration' },
  ]

  const LEGAL_LINKS = [
    { label: t.footerLegalLinks.mentions, href: '/legal/mentions-legales' },
    { label: t.footerLegalLinks.privacy, href: '/legal/confidentialite' },
    { label: t.footerLegalLinks.terms, href: '/legal/cgu' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer" data-nav-tone="dark">
      <div className="footer-cta">
        <div className="footer-cta-inner">
          <h2 className="footer-cta-title">
            {t.footerCtaTitle}
            <br />
            {t.footerCtaTitleLine2}
          </h2>
          <Link className="footer-cta-btn" to="/contact?sujet=visite">
            <span>{t.bookCall}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="footer-logo" to="/">
              Batimedaf
            </Link>
            <p className="footer-tagline">{t.footerTagline}</p>

            <ul className="footer-social">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-col" aria-label="Navigation">
            <h3 className="footer-col-title">{t.footerNavTitle}</h3>
            <ul className="footer-links">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Resources">
            <h3 className="footer-col-title">{t.footerResourcesTitle}</h3>
            <ul className="footer-links">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h3 className="footer-col-title">{t.footerContactTitle}</h3>
            <ul className="footer-contact">
              <li>
                <a href="tel:+33100000000">+33 1 00 00 00 00</a>
              </li>
              <li>
                <a href="mailto:contact@batimedaf.com">contact@batimedaf.com</a>
              </li>
              <li>
                <address>
                  12 avenue des Bâtisseurs
                  <br />
                  75008 Paris, France
                </address>
              </li>
            </ul>

            <form
              className="footer-newsletter"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="footer-newsletter-label" htmlFor="footer-email">
                {t.footerNewsletterLabel}
              </label>
              <div className="footer-newsletter-row">
                <input
                  id="footer-email"
                  type="email"
                  placeholder={t.footerNewsletterPlaceholder}
                  className="footer-newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="footer-newsletter-btn"
                  aria-label={t.subscribe}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} Batimedaf. {t.footerCopyright}
          </p>

          <ul className="footer-legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="footer-to-top"
            onClick={scrollToTop}
            aria-label={t.scrollToTop}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 12.5V3.5M3.5 8 8 3.5 12.5 8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
