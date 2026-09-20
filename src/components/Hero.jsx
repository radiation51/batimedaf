import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './Hero.css'

const SLIDE_MS = 5000

function Hero() {
  const content = useLocalizedContent()
  const t = useUI()
  const hero = content.home.hero
  const slides = hero.images?.length ? hero.images : [hero.image].filter(Boolean)

  const parallaxRef = useRef(null)
  const [active, setActive] = useState(0)

  // Scroll parallax: applied to a wrapping layer so it never fights the
  // per-slide zoom, which animates each image's own transform independently.
  useEffect(() => {
    let ticking = false

    const compute = () => {
      ticking = false
      const y = window.scrollY || 0
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 0
      if (!viewportHeight || !parallaxRef.current) return

      const progress = Math.min(Math.max(y / viewportHeight, 0), 1)
      parallaxRef.current.style.transform = `translateY(${progress * 60}px)`
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Advances the carousel every 5s. Paused while the tab is hidden, so a
  // backgrounded tab doesn't silently burn through every slide at once.
  useEffect(() => {
    if (slides.length < 2) return

    const tick = () =>
      setActive((i) => (i + 1) % slides.length)

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
  }, [slides.length])

  return (
    <section className="hero" data-nav-tone="dark" data-nav-bare>
      <div className="hero-parallax" ref={parallaxRef}>
        {slides.map((slide, i) => {
          const img = normalizeImage(slide)
          return (
            <div
              key={i}
              className={`hero-slide${i === active ? ' is-active' : ''}`}
              style={{
                backgroundImage: `url(${img.src})`,
                ...imageVars(img),
                // Evenly offsets each slide's zoom cycle so they aren't all
                // at the same zoom level when the carousel swaps to them.
                animationDelay: `${-(i * (22 / slides.length))}s`,
              }}
            />
          )
        })}
      </div>
      <div className="hero-overlay" />

      {slides.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label={t.slides}>
          {slides.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={t.slideLabel(i + 1)}
              className={`hero-dot${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}

      <div className="hero-content">
        <h1 className="hero-title">{hero.title}</h1>
        <p className="hero-description">{hero.description}</p>
        <div className="hero-actions">
          <button type="button" className="hero-btn hero-btn--primary">
            {hero.primaryCta}
          </button>
          <button type="button" className="hero-btn hero-btn--secondary">
            {hero.secondaryCta}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
