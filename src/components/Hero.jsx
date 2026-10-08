import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './Hero.css'

const SLIDE_MS = 6000

const pad = (n) => String(n).padStart(2, '0')

/**
 * The cover of the site, set like the opening spread of a book: the title
 * large on the paper, the pitch beside it, then one wide photograph whose
 * slides cross-fade in place. Nothing zooms, drifts or overlaps.
 */
function Hero() {
  const content = useLocalizedContent()
  const t = useUI()
  const hero = content.home.hero
  const edit = useEdit(['home', 'hero'])
  const slides = hero.images?.length ? hero.images : [hero.image].filter(Boolean)

  const [active, setActive] = useState(0)
  // Clamped: the admin can delete the slide that is on screen.
  const shown = Math.min(active, Math.max(slides.length - 1, 0))

  // Advances every 6s. Paused while the tab is hidden, and restarted after
  // a manual choice so the picked slide gets its full time.
  useEffect(() => {
    if (slides.length < 2) return

    const tick = () => setActive((i) => (i + 1) % slides.length)
    let timer = setInterval(tick, SLIDE_MS)

    const onVisibility = () => {
      clearInterval(timer)
      if (document.visibilityState === 'visible') {
        timer = setInterval(tick, SLIDE_MS)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [slides.length, active])

  return (
    <section className="hero" data-nav-tone="light">
      <div className="wrap hero-head">
        <h1 className="d1 hero-title" {...edit('title')}>
          {hero.title}
        </h1>

        <div className="hero-aside">
          <p className="hero-description" {...edit('description')}>
            {hero.description}
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/residence" {...edit('primaryCta')}>
              {hero.primaryCta}
              <Arrow />
            </Link>
            <Link className="tlink" to="/contact" {...edit('secondaryCta')}>
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="hero-media">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide${i === shown ? ' is-active' : ''}`}
              {...(hero.images?.length ? edit('images', i) : edit('image'))}
              style={{
                backgroundImage: `url(${normalizeImage(slide).src})`,
                ...imageVars(slide),
              }}
            />
          ))}
        </div>

        {slides.length > 1 && (
          <div className="hero-foot">
            <div className="hero-steps" role="tablist" aria-label={t.slides}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === shown}
                  aria-label={t.slideLabel(i + 1)}
                  className={`hero-step${i === shown ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
