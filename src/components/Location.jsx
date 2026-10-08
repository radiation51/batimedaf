import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { PlaceMap } from './Place'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { useEdit } from '../content/editable'
import './Location.css'

function Location() {
  const content = useLocalizedContent()
  const t = useUI()
  const contact = content.contact
  const residences = content.residences
  const edit = useEdit([])

  const { ref, ready } = useReveal([contact.address])
  // The address is authored on two lines; the map query wants one.
  const address = contact.address.replace(/\n/g, ', ')

  return (
    <section
      className={`sec sec--deep loc${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="wrap loc-grid">
        <div className="loc-info">
          <span className="label">{t.localisation}</span>
          <h2 className="d2 loc-title">{t.visitUs}</h2>

          <dl className="loc-details">
            <div>
              <dt className="label">{t.offices}</dt>
              <dd {...edit('contact', 'address')}>{contact.address}</dd>
            </div>
            <div>
              <dt className="label">{t.hours}</dt>
              <dd {...edit('contact', 'hours')}>{contact.hours}</dd>
            </div>
            <div>
              <dt className="label">{t.phone}</dt>
              <dd>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  {...edit('contact', 'phone')}
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">{t.email}</dt>
              <dd>
                <a href={`mailto:${contact.email}`} {...edit('contact', 'email')}>
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>

          <ul className="loc-residences">
            {residences.map((residence, i) => (
              <li key={residence.slug}>
                <Link to={`/residence/${residence.slug}`}>
                  <span className="loc-res-name" {...edit('residences', i, 'name')}>
                    {residence.name}
                  </span>
                  <span
                    className="loc-res-place"
                    {...edit('residences', i, 'location')}
                  >
                    {residence.location}
                  </span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="loc-map" data-reveal>
          <PlaceMap address={address} title="Batimedaf" />
        </div>
      </div>
    </section>
  )
}

export default Location
