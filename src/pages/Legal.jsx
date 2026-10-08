import { Link, Navigate, useParams } from 'react-router-dom'
import { LEGAL_DOCS, LEGAL_SLUGS } from '../data/legal'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import './Legal.css'

function Legal() {
  const { doc } = useParams()
  const document = LEGAL_DOCS[doc]

  usePageMeta({
    title: document ? document.title : 'Informations légales',
    description: document?.intro,
  })

  const { ref: pageRef, ready } = useReveal([doc])

  if (!document) return <Navigate to="/" replace />

  return (
    <main className={`lg${ready ? ' is-ready' : ''}`} ref={pageRef}>
      <header className="wrap lg-head" data-nav-tone="light">
        <span className="label">Informations légales</span>
        <h1 className="d2 lg-title">{document.title}</h1>
        <p className="lg-updated">{document.updated}</p>
        <p className="lead lg-intro">{document.intro}</p>
      </header>

      <section className="sec lg-body" data-nav-tone="light">
        <div className="wrap lg-cols">
          {/* Sibling documents stay one click away. */}
          <nav className="lg-nav" aria-label="Documents légaux">
            <ul>
              {LEGAL_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/legal/${slug}`}
                    className={slug === doc ? 'is-current' : undefined}
                    aria-current={slug === doc ? 'page' : undefined}
                  >
                    {LEGAL_DOCS[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg-content">
            {document.sections.map((section, i) => (
              <article className="lg-section" key={section.title} data-reveal>
                <h2>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Legal
