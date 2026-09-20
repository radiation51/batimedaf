import { Link } from 'react-router-dom'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './Residences.css'

function Residences() {
  const content = useLocalizedContent()
  const t = useUI()
  const RESIDENCES = content.residences

  usePageMeta({
    title: t.ourResidencesHeading,
    description: content.about.intro,
  })

  return (
    <main className="residences" data-nav-tone="dark">
      <h1 className="residences-heading">{t.ourResidencesHeading}</h1>

      <Link to="/" className="residences-back" aria-label={t.backToHome}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M12.5 8h-9M7.5 12.5 3 8l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div className="residences-split">
        {RESIDENCES.map((residence) => (
          <Link
            key={residence.slug}
            to={`/residence/${residence.slug}`}
            className="residence-panel"
            data-cursor={t.cursorView}
          >
            <div
              className="residence-bg"
              style={{
                backgroundImage: `url(${normalizeImage(residence.image).src})`,
                ...imageVars(residence.image),
              }}
            />
            <div className="residence-overlay" />

            <div className="residence-content">
              <span className="residence-tagline">{residence.tagline}</span>
              <h2 className="residence-name">{residence.name}</h2>
              <p className="residence-description">{residence.description}</p>

              <ul className="residence-meta">
                {residence.meta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <span className="residence-cta">
                {t.discover}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Residences
