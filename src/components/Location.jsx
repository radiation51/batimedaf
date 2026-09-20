import { Link } from 'react-router-dom'
import { PlaceMap } from './Place'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import './Location.css'

const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function Location() {
  const content = useLocalizedContent()
  const t = useUI()
  const contact = content.contact
  const residences = content.residences

  const { ref, ready } = useReveal([contact.address])
  // The address is authored on two lines; the map query wants one.
  const address = contact.address.replace(/\n/g, ', ')

  return (
    <section
      className={`loc${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="loc-wrap">
        <span className="loc-eyebrow" data-reveal>
          {t.localisation}
        </span>
        <h2 className="loc-title" data-reveal style={{ '--d': '60ms' }}>
          {t.visitUs}
        </h2>

        <div className="loc-grid">
          <div data-reveal style={{ '--d': '100ms' }}>
            <PlaceMap address={address} title="Batimedaf" />
          </div>

          <div className="loc-info">
            <dl className="loc-details" data-reveal style={{ '--d': '160ms' }}>
              <div>
                <dt>{t.offices}</dt>
                <dd className="loc-pre">{contact.address}</dd>
              </div>
              <div>
                <dt>{t.hours}</dt>
                <dd className="loc-pre">{contact.hours}</dd>
              </div>
              <div>
                <dt>{t.phone}</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t.email}</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
            </dl>

            <div className="loc-block" data-reveal style={{ '--d': '220ms' }}>
              <h3 className="loc-mini-title">{t.ourResidences}</h3>
              <ul className="loc-residences">
                {residences.map((residence) => (
                  <li key={residence.slug}>
                    <Link to={`/residence/${residence.slug}`}>
                      <span className="loc-res-name">{residence.name}</span>
                      <span className="loc-res-place">{residence.location}</span>
                      <span className="loc-res-arrow">
                        <Arrow size={15} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
