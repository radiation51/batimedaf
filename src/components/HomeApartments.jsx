import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './HomeApartments.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The apartments named in `home.apartments.list` ('slug/id'), each read from
 * its residence: photo, type and description are the apartment's own, so the
 * card and the apartment page never disagree.
 */
function HomeApartments() {
  const content = useLocalizedContent()
  const t = useUI()
  const { eyebrow, title, list } = content.home.apartments
  const edit = useEdit(['home', 'apartments'])
  const editResidences = useEdit(['residences'])

  const cards = list
    .map((ref) => {
      const [slug, id] = ref.split('/')
      const ri = content.residences.findIndex((r) => r.slug === slug)
      const residence = content.residences[ri]
      const ai = residence ? residence.apartments.findIndex((a) => a.id === id) : -1
      return ai < 0 ? null : { residence, apartment: residence.apartments[ai], ri, ai }
    })
    .filter(Boolean)

  const { ref, ready } = useReveal([cards.length])

  return (
    <section
      className={`sec sec--deep hap${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="wrap">
        <div className="split hap-head">
          <div className="split-aside">
            <span className="label" {...edit('eyebrow')}>
              {eyebrow}
            </span>
          </div>
          <h2 className="split-main d2" {...edit('title')}>
            {title}
          </h2>
        </div>

        <ul className="hap-list">
          {cards.map(({ residence, apartment, ri, ai }, i) => {
            const field = (...rest) => editResidences(ri, 'apartments', ai, ...rest)
            return (
              <li key={`${residence.slug}/${apartment.id}`} className="hap-item" data-reveal>
                <Link
                  to={`/residence/${residence.slug}/${apartment.id}`}
                  className="hap-link"
                >
                  <span className="plate hap-media">
                    <img
                      src={normalizeImage(apartment.image).src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={imageVars(apartment.image)}
                      {...field('image')}
                    />
                  </span>

                  <span className="hap-body">
                    <span className="num hap-num">{pad(i + 1)}</span>
                    <span className="hap-text">
                      <span className="d3 hap-name" {...field('type')}>
                        {apartment.type}
                      </span>
                      <span className="hap-meta">
                        <span>{residence.name}</span>
                        {Number(apartment.surface) > 0 && (
                          <span {...field('surface')}>{apartment.surface} m²</span>
                        )}
                        {apartment.outdoor && (
                          <span {...field('outdoor')}>{apartment.outdoor}</span>
                        )}
                      </span>
                      <span className="hap-desc" {...field('description')}>
                        {apartment.description}
                      </span>
                      <span className="tlink hap-cta">
                        {t.seeApartment}
                        <Arrow size={16} />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default HomeApartments
