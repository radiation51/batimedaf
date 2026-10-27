import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit, useEditMode } from '../content/editable'
import { useBarOver } from '../hooks/useBarOver'
import './Hero.css'

const SLIDE_MS = 6000

const pad = (n) => String(n).padStart(2, '0')

/**
 * The cover of the site: one photograph filling the first screen, the bar
 * lying on it without its paper, its slides cross-fading in place, with the
 * title, the actions and the slide numbers set on it. Everything is visible
 * on arrival; nothing zooms or drifts.
 */
function Hero() {
  const content = useLocalizedContent()
  const t = useUI()
  const hero = content.home.hero
  const edit = useEdit(['home', 'hero'])
  const slides = hero.images?.length ? hero.images : [hero.image].filter(Boolean)
  const ref = useRef(null)
  useBarOver(ref)

  // `reached` is the furthest slide shown so far: photos load one ahead of
  // it, so the first screen only waits for the first photo.
  const [{ active, reached }, setStep] = useState({ active: 0, reached: 0 })
  const go = (i) => setStep((s) => ({ active: i, reached: Math.max(s.reached, i) }))
  const editing = useEditMode()
  // Clamped: the admin can delete the slide that is on screen.
  const shown = Math.min(active, Math.max(slides.length - 1, 0))

  // Advances every 6s. Paused while the tab is hidden, and restarted after
  // a manual choice so the picked slide gets its full time.
  useEffect(() => {
    if (slides.length < 2) return

    const tick = () =>
      setStep((s) => {
        const next = (s.active + 1) % slides.length
        return { active: next, reached: Math.max(s.reached, next) }
      })
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
    <section className="hero" ref={ref} data-nav-tone="dark">
      <div className="hero-media">
        {slides.map((slide, i) =>
          editing || i <= reached + 1 ? (
            <img
              key={i}
              className={`hero-slide${i === shown ? ' is-active' : ''}`}
              src={normalizeImage(slide).src}
              alt=""
              fetchPriority={i === 0 ? 'high' : 'low'}
              {...(hero.images?.length ? edit('images', i) : edit('image'))}
              style={imageVars(slide)}
            />
          ) : null,
        )}
      </div>

      <div className="wrap hero-over">
        <h1 className="d1 hero-title" {...edit('title')}>
          {hero.title}
        </h1>
        {/* Says at once whose site this is and where. */}
        {hero.sub && (
          <p className="label hero-sub" {...edit('sub')}>
            {hero.sub}
          </p>
        )}

        <div className="hero-foot">
          <div className="hero-actions">
            <Link className="btn btn--light" to="/residence" {...edit('primaryCta')}>
              {hero.primaryCta}
              <Arrow />
            </Link>
            <Link className="tlink" to="/contact" {...edit('secondaryCta')}>
              {hero.secondaryCta}
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="hero-steps" role="tablist" aria-label={t.slides}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === shown}
                  aria-label={t.slideLabel(i + 1)}
                  className={`hero-step${i === shown ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
