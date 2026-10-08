import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './About.css'

const pad = (n) => String(n).padStart(2, '0')

function About() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.about
  const residences = content.residences
  const edit = useEdit(['about'])
  const editRoot = useEdit()

  usePageMeta({ title: t.nav.about, description: c.intro })

  const { ref: pageRef, ready } = useReveal([c])

  return (
    <main className={`ab${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Opening: words only ---------- */}
      <header className="wrap ab-open" data-nav-tone="light">
        <span className="label" {...edit('kicker')}>
          {c.kicker}
        </span>
        <h1 className="d1 ab-title">
          {c.titleLines.map((line, i) => (
            <span className="ab-line" key={i} {...edit('titleLines', i)}>
              {line}
            </span>
          ))}
        </h1>
        <p className="lead ab-sub">{t.aboutSub}</p>
      </header>

      {/* ---------- Method ---------- */}
      <section className="sec ab-method" data-nav-tone="light">
        <div className="wrap split">
          <div className="split-aside">
            <span className="label">{t.methodEyebrow}</span>
          </div>
          <ol className="split-main ab-rules">
            {c.principles.map((principle, i) => (
              <li key={i} data-reveal style={{ '--d': `${(i % 2) * 90}ms` }}>
                <span className="num">{pad(i + 1)}</span>
                <h2 className="ab-rule-title" {...edit('principles', i, 'title')}>
                  {principle.title}
                </h2>
                <p className="body" {...edit('principles', i, 'text')}>
                  {principle.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Programmes ---------- */}
      <section className="sec sec--dark" data-nav-tone="dark">
        <div className="wrap">
          <div className="split ab-show-head">
            <div className="split-aside">
              <span className="label">{t.realisationsEyebrow}</span>
            </div>
            <h2 className="split-main d2" data-reveal>
              {t.realisationsTitle}
            </h2>
          </div>

          <ul className="ab-show">
            {residences.map((residence, i) => (
              <li key={residence.slug} data-reveal style={{ '--d': `${i * 120}ms` }}>
                <Link to={`/residence/${residence.slug}`} className="ab-show-card">
                  <span className="plate ab-show-media">
                    <img
                      src={normalizeImage(residence.image).src}
                      alt=""
                      loading="lazy"
                      style={imageVars(residence.image)}
                      {...editRoot('residences', i, 'image')}
                    />
                  </span>
                  <span className="ab-show-body">
                    <span className="num ab-show-num">{pad(i + 1)}</span>
                    <span className="ab-show-text">
                      <span
                        className="d3 ab-show-name"
                        {...editRoot('residences', i, 'name')}
                      >
                        {residence.name}
                      </span>
                      <span
                        className="ab-show-tagline"
                        {...editRoot('residences', i, 'tagline')}
                      >
                        {residence.tagline}
                      </span>
                      <span className="ab-show-meta">
                        {residence.meta.map((item, j) => (
                          <span key={j} {...editRoot('residences', i, 'meta', j)}>
                            {item}
                          </span>
                        ))}
                      </span>
                    </span>
                    <Arrow size={22} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Studio ---------- */}
      <section className="sec" data-nav-tone="light">
        <div className="wrap ab-studio">
          <div className="plate ab-studio-media" data-reveal>
            <img
              src={normalizeImage(c.image).src}
              alt=""
              loading="lazy"
              style={imageVars(c.image)}
              {...edit('image')}
            />
          </div>
          <div className="ab-studio-copy">
            <span className="label">{t.atelierEyebrow}</span>
            <h2 className="d3 ab-studio-title" data-reveal>
              {t.atelierTitle}
            </h2>
            <p className="body" data-reveal>
              {t.atelierText}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Invitation ---------- */}
      <section className="band" data-nav-tone="dark">
        <div className="wrap band-inner">
          <h2 className="d2 band-title" {...edit('ctaTitle')}>
            {c.ctaTitle}
          </h2>
          <Link className="btn btn--light" to="/residence" {...edit('ctaLabel')}>
            {c.ctaLabel}
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About
