import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './Residences.css'

const WORDS = {
  fr: { see: 'Voir la résidence', available: 'Appartements disponibles' },
  en: { see: 'View the residence', available: 'Available apartments' },
}

/** The status pill's colour: free, last one, or on request. */
const statusClass = (status) =>
  /disponible|available/i.test(status) ? 'is-free' : /dernière|last/i.test(status) ? 'is-last' : 'is-ask'

/**
 * The residences side by side, each a photo filling the window, with its name
 * and key figures (homes, place, delivery) on it; the apartments with their
 * status and one clear way in show when the pointer comes onto it.
 */
function Residences() {
  const content = useLocalizedContent()
  const t = useUI()
  const { lang } = useLanguage()
  const words = WORDS[lang] ?? WORDS.fr
  const residences = content.residences
  const edit = useEdit(['residences'])

  // The bar lives outside the page: while we are here, it lies over the photos.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.nav = 'over'
    return () => delete root.dataset.nav
  }, [])

  usePageMeta({
    title: t.ourResidencesHeading,
    description: content.about.summary,
  })

  return (
    <main className="residences" data-nav-tone="light">
      <header className="residences-head">
        <h1>{t.ourResidencesHeading}</h1>
      </header>

      <div className="rs-cards" style={{ '--n': residences.length }}>
        {residences.map((r, i) => (
          <article key={r.slug} className="rs-card">
            <Link to={`/residence/${r.slug}`} className="rs-photo" aria-label={r.name}>
              <img
                src={normalizeImage(r.image).src}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                style={imageVars(r.image)}
                {...edit(i, 'image')}
              />
            </Link>

            <div className="rs-info">
              <h2 className="rs-name" {...edit(i, 'name')}>
                {r.name}
              </h2>
              <p className="rs-facts">
                {r.meta.map((item, j) => (
                  <span key={j} {...edit(i, 'meta', j)}>
                    {item}
                  </span>
                ))}
              </p>

              <div className="rs-more">
                <div className="rs-apartments">
                  <span className="rs-apartments-title">{words.available}</span>
                  <ul>
                    {r.apartments.map((a, j) => (
                      <li key={a.id}>
                        <Link to={`/residence/${r.slug}/${a.id}`} className="rs-apartment">
                          <span className="rs-apartment-type" {...edit(i, 'apartments', j, 'type')}>
                            {a.type}
                          </span>
                          <span className="rs-apartment-size">{a.surface > 0 ? `${a.surface} m²` : ''}</span>
                          <span
                            className={`rs-status ${statusClass(a.status)}`}
                            {...edit(i, 'apartments', j, 'status')}
                          >
                            {a.status}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/residence/${r.slug}`} className="btn rs-btn">
                  {words.see}
                  <Arrow />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Residences
