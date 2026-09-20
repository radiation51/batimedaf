import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import '../styles/page.css'
import './Collaboration.css'

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

function Collaboration() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.collaboration

  usePageMeta({
    title: t.nav.collaboration,
    description: c.title,
  })

  const { ref: pageRef, ready } = useReveal([c])
  const [active, setActive] = useState(0)
  const profile = c.profiles[active]

  return (
    <main className={`pg co${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Profile selector ---------- */}
      <header className="co-head" data-nav-tone="light">
        <div className="pg-wrap">
          <span className="pg-eyebrow co-kicker">{c.kicker}</span>
          <h1 className="co-title">
            <span className="pg-mask">
              <span className="pg-mask-inner">{c.title}</span>
            </span>
          </h1>

          <div className="co-tabs" role="tablist" aria-label={t.profilesAriaLabel}>
            {c.profiles.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`co-tab-${item.id}`}
                aria-selected={active === i}
                aria-controls={`co-panel-${item.id}`}
                className={`co-tab${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="co-tab-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ---------- Selected profile ---------- */}
      <section
        className="co-panel"
        role="tabpanel"
        id={`co-panel-${profile.id}`}
        aria-labelledby={`co-tab-${profile.id}`}
        data-nav-tone="light"
      >
        {/* The key restarts the entry animation whenever the profile changes. */}
        <div className="pg-wrap co-panel-grid" key={profile.id}>
          <div className="co-panel-copy">
            <h2 className="co-headline">{profile.headline}</h2>
            <p className="co-text">{profile.text}</p>

            <h3 className="co-mini-title">{t.whatWeLookFor}</h3>
            <ul className="co-criteria">
              {profile.criteria.map((criterion, i) => (
                <li key={criterion} style={{ '--i': i }}>
                  <span className="co-check" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.5 5 9l4.5-6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {criterion}
                </li>
              ))}
            </ul>

            <Link className="co-btn" to="/contact?sujet=collaboration">
              {t.apply}
              <Arrow />
            </Link>
          </div>

          <div className="co-panel-media">
            <div className="co-media-frame">
              <img
                src={normalizeImage(profile.image).src}
                alt=""
                style={imageVars(profile.image)}
              />
            </div>
            <div className="co-figure">
              <span className="co-figure-value">{profile.figureValue}</span>
              <span className="co-figure-label">{profile.figureLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Commitments ---------- */}
      <section className="pg-block" data-nav-tone="light">
        <div className="pg-wrap pg-split">
          <div className="pg-split-aside">
            <span className="pg-eyebrow" data-reveal>
              {t.commitmentsEyebrow}
            </span>
          </div>
          <div>
            <h2 className="pg-lead" data-reveal>
              {c.commitmentsTitle}
            </h2>

            <ul className="co-commitments">
              {c.commitments.map((item, i) => (
                <li key={item.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="pg-block" data-nav-tone="light">
        <div className="pg-wrap pg-split">
          <div className="pg-split-aside">
            <span className="pg-eyebrow" data-reveal>
              {t.stepsEyebrowPrefix}
              {c.stepsTitle}
            </span>
          </div>
          <div>
            <ol className="co-steps">
              {c.steps.map((step, i) => (
                <li key={step.title} data-reveal style={{ '--d': `${i * 80}ms` }}>
                  <span className="co-step-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pg-cta" data-nav-tone="dark">
        <div className="pg-wrap pg-cta-inner">
          <h2 className="pg-cta-title" data-reveal>
            {t.collabCtaTitle}
          </h2>
          <Link
            className="pg-cta-btn"
            to="/contact?sujet=collaboration"
            data-reveal
            style={{ '--d': '120ms' }}
          >
            {t.collabCtaButton}
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Collaboration
