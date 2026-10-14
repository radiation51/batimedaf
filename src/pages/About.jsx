import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './About.css'

/**
 * Who Batimedaf is, plainly: one sentence, one photo, the approach in the
 * client's own words (shared with the home page), the residences, and an
 * invitation to come and see one.
 */
function About() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.about
  const approach = content.home.approach
  const residences = content.residences
  const edit = useEdit(['about'])
  const editApproach = useEdit(['home', 'approach'])
  const editResidences = useEdit(['residences'])

  usePageMeta({ title: t.nav.about, description: c.summary })

  const { ref: pageRef, ready } = useReveal([c])

  return (
    <main className={`ab${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Opening ---------- */}
      <header className="wrap ab-head" data-nav-tone="light">
        <span className="label" {...edit('kicker')}>
          {c.kicker}
        </span>
        <div className="ab-head-grid">
          <h1 className="d2 ab-heading" {...edit('heading')}>
            {c.heading}
          </h1>
          <p className="body ab-summary" {...edit('summary')}>
            {c.summary}
          </p>
        </div>
        <div className="plate ab-cover">
          <img
            src={normalizeImage(c.cover).src}
            alt=""
            fetchPriority="high"
            style={imageVars(c.cover)}
            {...edit('cover')}
          />
        </div>
      </header>

      {/* ---------- Approach ---------- */}
      <section className="sec" data-nav-tone="light">
        <div className="wrap split">
          <div className="split-aside split-aside--sticky">
            <span className="label" {...edit('approachLabel')}>
              {c.approachLabel}
            </span>
          </div>
          <div className="split-main">
            <p className="lead ab-statement" data-reveal {...editApproach('statement')}>
              {approach.statement}
            </p>
            <p className="body ab-approach-text" data-reveal {...editApproach('text')}>
              {approach.text}
            </p>
            <dl className="ab-principles">
              {approach.principles.map((principle, i) => (
                <div key={i} className="ab-principle" data-reveal>
                  <dt {...editApproach('principles', i, 'title')}>{principle.title}</dt>
                  <dd {...editApproach('principles', i, 'text')}>{principle.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Residences ---------- */}
      <section className="sec sec--deep" data-nav-tone="light">
        <div className="wrap">
          <span className="label" {...edit('residencesLabel')}>
            {c.residencesLabel}
          </span>
          <ul className="ab-residences">
            {residences.map((r, i) => (
              <li key={r.slug} className="ab-residence" data-reveal>
                <Link to={`/residence/${r.slug}`} className="plate ab-residence-photo" aria-label={r.name}>
                  <img
                    src={normalizeImage(r.image).src}
                    alt=""
                    loading="lazy"
                    style={imageVars(r.image)}
                    {...editResidences(i, 'image')}
                  />
                </Link>
                <div className="ab-residence-text">
                  <h2 className="d3" {...editResidences(i, 'name')}>
                    {r.name}
                  </h2>
                  <p className="ab-residence-tagline" {...editResidences(i, 'tagline')}>
                    {r.tagline}
                  </p>
                  <p className="ab-residence-meta">
                    {r.meta.map((item, j) => (
                      <span key={j} {...editResidences(i, 'meta', j)}>
                        {item}
                      </span>
                    ))}
                  </p>
                  <Link className="tlink" to={`/residence/${r.slug}`}>
                    {t.discover}
                    <Arrow />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Invitation ---------- */}
      <section className="band" data-nav-tone="dark">
        <div className="wrap band-inner">
          <h2 className="d2 band-title" {...edit('visitTitle')}>
            {c.visitTitle}
          </h2>
          <Link className="btn btn--light" to="/contact?sujet=visite">
            {t.bookCall}
            <Arrow />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About
