import { useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './Collaboration.css'

const pad = (n) => String(n).padStart(2, '0')

function Collaboration() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.collaboration
  const edit = useEdit(['collaboration'])

  usePageMeta({
    title: t.nav.collaboration,
    description: c.title,
  })

  const { ref: pageRef, ready } = useReveal([c])
  const [active, setActive] = useState(0)
  // Clamped: the admin can delete the profile that is selected.
  const shown = Math.min(active, c.profiles.length - 1)
  const profile = c.profiles[shown]

  return (
    <main className={`co${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* The head and the chosen profile share the first screen. */}
      <div className="co-first">
        {/* ---------- "You are…" and the profiles to choose from ---------- */}
        <header className="wrap co-head" data-nav-tone="light">
          <span className="label" {...edit('kicker')}>
            {c.kicker}
          </span>
          <h1 className="d1 co-title" {...edit('title')}>
            {c.title}
          </h1>

          <div className="co-tabs" role="tablist" aria-label={t.profilesAriaLabel}>
            {c.profiles.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`co-tab-${item.id}`}
                aria-selected={shown === i}
                aria-controls={`co-panel-${item.id}`}
                className={`co-tab${shown === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="num">{pad(i + 1)}</span>
                <span {...edit('profiles', i, 'label')}>{item.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* ---------- The chosen profile ---------- */}
        <section
          className="co-panel"
          role="tabpanel"
          id={`co-panel-${profile.id}`}
          aria-labelledby={`co-tab-${profile.id}`}
          data-nav-tone="light"
        >
          {/* The key restarts the fade whenever the profile changes. */}
          <div className="wrap co-panel-grid" key={profile.id}>
            <div className="co-copy">
              <h2 className="d3 co-headline" {...edit('profiles', shown, 'headline')}>
                {profile.headline}
              </h2>
              <p className="body co-text" {...edit('profiles', shown, 'text')}>
                {profile.text}
              </p>

              <h3 className="label co-mini-title">{t.whatWeLookFor}</h3>
              <ul className="co-criteria">
                {profile.criteria.map((criterion, i) => (
                  <li key={i}>
                    <span className="num">{pad(i + 1)}</span>
                    <span {...edit('profiles', shown, 'criteria', i)}>{criterion}</span>
                  </li>
                ))}
              </ul>

              <Link className="btn" to="/contact?sujet=collaboration">
                {t.apply}
                <Arrow />
              </Link>
            </div>

            <figure className="co-media">
              <span className="plate co-media-frame">
                <img
                  src={normalizeImage(profile.image).src}
                  alt=""
                  style={imageVars(profile.image)}
                  {...edit('profiles', shown, 'image')}
                />
              </span>
              <figcaption className="co-figure">
                <span
                  className="co-figure-value"
                  {...edit('profiles', shown, 'figureValue')}
                >
                  {profile.figureValue}
                </span>
                <span
                  className="co-figure-label"
                  {...edit('profiles', shown, 'figureLabel')}
                >
                  {profile.figureLabel}
                </span>
              </figcaption>
            </figure>
          </div>
        </section>
      </div>

      {/* ---------- Commitments ---------- */}
      <section className="sec sec--deep" data-nav-tone="light">
        <div className="wrap split">
          <div className="split-aside">
            <span className="label">{t.commitmentsEyebrow}</span>
          </div>
          <div className="split-main">
            <h2 className="d3 co-commit-title" data-reveal {...edit('commitmentsTitle')}>
              {c.commitmentsTitle}
            </h2>
            <ul className="co-commitments">
              {c.commitments.map((item, i) => (
                <li key={i} data-reveal style={{ '--d': `${(i % 2) * 90}ms` }}>
                  <h3 {...edit('commitments', i, 'title')}>{item.title}</h3>
                  <p className="body" {...edit('commitments', i, 'text')}>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="sec" data-nav-tone="light">
        <div className="wrap split">
          <div className="split-aside">
            <span className="label" {...edit('stepsTitle')}>
              {t.stepsEyebrowPrefix}
              {c.stepsTitle}
            </span>
          </div>
          <ol className="split-main co-steps">
            {c.steps.map((step, i) => (
              <li key={i} data-reveal style={{ '--d': `${i * 90}ms` }}>
                <span className="co-step-num">{pad(i + 1)}</span>
                <h3 {...edit('steps', i, 'title')}>{step.title}</h3>
                <p className="body" {...edit('steps', i, 'text')}>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Invitation ---------- */}
      <section className="band" data-nav-tone="dark">
        <div className="wrap band-inner">
          <h2 className="d2 band-title">{t.collabCtaTitle}</h2>
          <Link className="btn btn--light" to="/contact?sujet=collaboration">
            {t.collabCtaButton}
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Collaboration
