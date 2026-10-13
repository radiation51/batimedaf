import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import Arrow from '../components/Arrow'
import { useLanguage } from '../i18n/LanguageContext'
import { RESIDENCES } from '../data/residences'
import Maquette from './Maquette'
import './MaquetteViews.css'

/* The residences as 3D models side by side on /residence, each standing on
   a ground of its own colour, with its name and the way in. Loaded only on
   that page (see Residences.jsx). */

const pad = (n) => String(n).padStart(2, '0')

const LABELS = {
  fr: {
    free: 'Disponible',
    taken: 'Occupé',
  },
  en: {
    free: 'Available',
    taken: 'Taken',
  },
}

// A content copy saved before these fields existed falls back to the
// shipped data.
const shipped = (residence) => RESIDENCES.find((r) => r.slug === residence.slug)

/* Storeys already taken (0 = ground floor). */
const takenOf = (residence) => residence.floorsTaken ?? shipped(residence)?.floorsTaken ?? []

/* The residence's colour, and the pale ground made from it. */
const colourOf = (residence) => residence.color ?? shipped(residence)?.color ?? '#8f4a30'
// Same hue, much lighter, so the ground reads as that colour without
// competing with the building.
const groundOf = (colour) => {
  const srgb = THREE.SRGBColorSpace
  const hsl = new THREE.Color(colour).getHSL({}, srgb)
  return `#${new THREE.Color().setHSL(hsl.h, Math.min(0.42, hsl.s), 0.72, srgb).getHexString()}`
}

function MaquetteCards({ residences, edit, t }) {
  const { lang } = useLanguage()
  const labels = LABELS[lang] ?? LABELS.fr
  const navigate = useNavigate()

  return (
    <div className="mqc">
      {residences.map((residence, i) => {
        const colour = colourOf(residence)
        return (
          <article key={residence.slug} className="mqc-card" style={{ '--res-accent': colour }}>
            <div className="mqc-stage">
              <Maquette
                residence={residence}
                taken={takenOf(residence)}
                lang={lang}
                labels={labels}
                ground={groundOf(colour)}
                onOpen={() => navigate(`/residence/${residence.slug}`)}
              />
            </div>

            <Link to={`/residence/${residence.slug}`} className="mqc-caption">
              <span className="mqc-num">{pad(i + 1)}</span>
              <span className="mqc-name" {...edit(i, 'name')}>
                {residence.name}
              </span>
              <span className="mqc-tagline" {...edit(i, 'tagline')}>
                {residence.tagline}
              </span>
              <span className="mqc-meta">
                {residence.meta.map((item, j) => (
                  <span key={j} {...edit(i, 'meta', j)}>
                    {item}
                  </span>
                ))}
              </span>
              <span className="mqc-cta">
                {t.discover}
                <Arrow size={16} />
              </span>
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export default MaquetteCards
