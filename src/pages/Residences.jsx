import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './Residences.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * The residences chooser: a full-screen split with no bar or footer (see
 * App.jsx) and its own way back home. Each residence waits behind a door
 * left ajar; pointing at it swings the door open onto its photograph. On a
 * phone, with nothing to point with, the door facing the reader stands open
 * and the others close: scrolling down closes the one above and opens the
 * next, scrolling up does the reverse.
 */
function Residences() {
  const content = useLocalizedContent()
  const t = useUI()
  const residences = content.residences
  const edit = useEdit(['residences'])
  const doorsRef = useRef(null)
  // The door facing the reader on a phone, by index, or null.
  const [facing, setFacing] = useState(null)

  useEffect(() => {
    const root = doorsRef.current
    // Phones only: stacked doors and no pointer. Wider touch screens show
    // both doors side by side and leave them open (see the CSS).
    if (!root || !window.matchMedia('(hover: none) and (max-width: 900px)').matches) {
      return
    }

    let frame = 0
    // The door whose middle is nearest the middle of the screen.
    const update = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let nearest = null
      let best = Infinity
      root.querySelectorAll('.door').forEach((door, i) => {
        const box = door.getBoundingClientRect()
        const distance = Math.abs((box.top + box.bottom) / 2 - middle)
        if (distance < best) {
          best = distance
          nearest = i
        }
      })
      setFacing(nearest)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [residences.length])

  usePageMeta({
    title: t.ourResidencesHeading,
    description: content.about.intro,
  })

  return (
    <main className="residences" data-nav-tone="light">
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

      <div className="doors" ref={doorsRef}>
        {residences.map((residence, i) => (
          <Link
            key={residence.slug}
            to={`/residence/${residence.slug}`}
            className={`door${facing === i ? ' is-open' : ''}`}
          >
            {/* The doorway: an ink frame, the room behind, the door on its
                hinges, ink and clay in turn. */}
            <span className="door-way">
              <span className="plate door-room">
                <img
                  src={normalizeImage(residence.image).src}
                  alt=""
                  style={imageVars(residence.image)}
                  {...edit(i, 'image')}
                />
              </span>
              <span
                className={`door-leaf${i % 2 ? ' door-leaf--clay' : ''}`}
                aria-hidden="true"
              >
                <span className="door-handle" />
              </span>
            </span>

            <span className="door-text">
              <span className="door-num">{pad(i + 1)}</span>
              <span className="door-tagline" {...edit(i, 'tagline')}>
                {residence.tagline}
              </span>
              <span className="door-name" {...edit(i, 'name')}>
                {residence.name}
              </span>
              <span className="door-meta">
                {residence.meta.map((item, j) => (
                  <span key={j} {...edit(i, 'meta', j)}>
                    {item}
                  </span>
                ))}
              </span>
              <span className="door-cta">
                {t.discover}
                <Arrow size={16} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Residences
