import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './HomeResidences.css'

const pad = (n) => String(n).padStart(2, '0')

/** The programmes on the home page: one wide plate, one tall, side by side. */
function HomeResidences() {
  const content = useLocalizedContent()
  const t = useUI()
  const residences = content.residences
  const edit = useEdit(['residences'])
  const { ref, ready } = useReveal([residences.length])

  return (
    <section
      className={`sec hres${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="wrap">
        <div className="hres-head">
          <span className="label">{t.ourResidences}</span>
          <Link className="tlink" to="/residence">
            {t.allResidences}
          </Link>
        </div>

        <ul className="hres-list">
          {residences.map((residence, i) => (
            <li key={residence.slug} className="hres-item" data-reveal>
              <Link to={`/residence/${residence.slug}`} className="hres-link">
                <span className="plate hres-media">
                  <img
                    src={normalizeImage(residence.image).src}
                    alt=""
                    loading="lazy"
                    style={imageVars(residence.image)}
                    {...edit(i, 'image')}
                  />
                </span>

                <span className="hres-body">
                  <span className="num hres-num">{pad(i + 1)}</span>
                  <span className="hres-text">
                    <span className="d3 hres-name" {...edit(i, 'name')}>
                      {residence.name}
                    </span>
                    <span className="hres-tagline" {...edit(i, 'tagline')}>
                      {residence.tagline}
                    </span>
                    <span className="hres-meta">
                      {residence.meta.map((item, j) => (
                        <span key={j} {...edit(i, 'meta', j)}>
                          {item}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="hres-arrow">
                    <Arrow size={22} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HomeResidences
