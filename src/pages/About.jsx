import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal, useCountUp } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './About.css'

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

function Figure({ figure, active, index }) {
  const value = useCountUp(figure.value, active)
  return (
    <div className="ab-figure" data-reveal style={{ '--d': `${index * 90}ms` }}>
      <span className="ab-figure-value">{value.toLocaleString('fr-FR')}</span>
      <span className="ab-figure-label">{figure.label}</span>
    </div>
  )
}

function About() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.about
  const residences = content.residences

  usePageMeta({ title: t.nav.about, description: c.intro })

  const { ref: pageRef, ready } = useReveal([c])

  const figuresRef = useRef(null)
  const [figuresActive, setFiguresActive] = useState(false)

  useEffect(() => {
    const el = figuresRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setFiguresActive(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFiguresActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    const fallback = setTimeout(() => setFiguresActive(true), 2500)
    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return (
    <main className={`ab${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- I. Ouverture — texte seul, aucune image ---------- */}
      <header className="ab-open" data-nav-tone="light">
        <div className="ab-wrap ab-open-inner">
          <span className="ab-kicker" data-reveal>
            {c.kicker}
          </span>

          <h1 className="ab-open-title">
            {c.titleLines.map((line, i) => (
              <span className="ab-mask" key={line}>
                <span
                  className="ab-mask-inner"
                  style={{ '--md': `${0.25 + i * 0.12}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="ab-open-sub" data-reveal style={{ '--d': '520ms' }}>
            {t.aboutSub}
          </p>

          <span className="ab-scroll-cue" data-reveal style={{ '--d': '700ms' }}>
            <span className="ab-scroll-line" aria-hidden="true">
              <span />
            </span>
            {t.scrollCue}
          </span>
        </div>
      </header>

      {/* ---------- II. Méthode ---------- */}
      <section className="ab-method" data-nav-tone="light">
        <div className="ab-wrap">
          <span className="ab-eyebrow" data-reveal>
            {t.methodEyebrow}
          </span>

          <ol className="ab-rules">
            {c.principles.map((principle, i) => (
              <li key={principle.title} data-reveal style={{ '--d': `${i * 90}ms` }}>
                <span className="ab-rule-num">0{i + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- III. Réalisations — les deux programmes en avant ---------- */}
      <section className="ab-showcase" data-nav-tone="dark">
        <div className="ab-wrap">
          <span className="ab-kicker ab-showcase-kicker" data-reveal>
            {t.realisationsEyebrow}
          </span>
          <h2 className="ab-showcase-title" data-reveal style={{ '--d': '80ms' }}>
            {t.realisationsTitle}
          </h2>

          <div className="ab-showcase-grid">
            {residences.map((residence, i) => (
              <Link
                key={residence.slug}
                to={`/residence/${residence.slug}`}
                className="ab-showcase-card"
                data-reveal
                style={{ '--d': `${180 + i * 120}ms` }}
              >
                <span className="ab-showcase-media">
                  <img
                    src={normalizeImage(residence.image).src}
                    alt=""
                    loading="lazy"
                    style={imageVars(residence.image)}
                  />
                </span>
                <span className="ab-showcase-body">
                  <span className="ab-showcase-num">0{i + 1}</span>
                  <span className="ab-showcase-name">{residence.name}</span>
                  <span className="ab-showcase-tagline">{residence.tagline}</span>
                  <span className="ab-showcase-meta">
                    {residence.meta.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </span>
                  <span className="ab-showcase-cta">
                    {t.discover}
                    <Arrow size={15} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- IV. Portrait ---------- */}
      <section className="ab-portrait" data-nav-tone="dark">
        <div className="ab-wrap ab-portrait-grid">
          <div className="ab-portrait-media" data-reveal>
            <img
              src={normalizeImage(c.image).src}
              alt=""
              loading="lazy"
              style={imageVars(c.image)}
            />
          </div>
          <div className="ab-portrait-copy">
            <span className="ab-eyebrow" data-reveal>
              {t.atelierEyebrow}
            </span>
            <h2 className="ab-portrait-title" data-reveal style={{ '--d': '80ms' }}>
              {t.atelierTitle}
            </h2>
            <p data-reveal style={{ '--d': '160ms' }}>
              {t.atelierText}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- V. Chiffres ---------- */}
      <section className="ab-figures" ref={figuresRef} data-nav-tone="light">
        <div className="ab-wrap ab-figures-grid">
          {c.figures.map((figure, i) => (
            <Figure key={figure.label} figure={figure} index={i} active={figuresActive} />
          ))}
        </div>
      </section>

      {/* ---------- VI. Sortie ---------- */}
      <section className="ab-cta" data-nav-tone="dark">
        <div className="ab-wrap ab-cta-inner">
          <h2 className="ab-cta-title" data-reveal>
            {c.ctaTitle}
          </h2>
          <Link
            className="ab-cta-btn"
            to="/residence"
            data-reveal
            style={{ '--d': '120ms' }}
          >
            {c.ctaLabel}
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About
