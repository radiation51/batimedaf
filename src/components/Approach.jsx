import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { useEdit } from '../content/editable'
import './Approach.css'

/**
 * "Notre approche" on the home page, kept short: the client's principles in
 * a row on the paper, each with its line. The full statement lives on the
 * about page.
 */
function Approach() {
  const content = useLocalizedContent()
  const t = useUI()
  const approach = content.home.approach
  const edit = useEdit(['home', 'approach'])
  const { ref, ready } = useReveal([approach.principles.length])

  return (
    <section className={`sec apr${ready ? ' is-ready' : ''}`} ref={ref} data-nav-tone="light">
      <div className="wrap">
        <span className="label apr-label">{t.approachEyebrow}</span>

        <ol className="apr-cols">
          {approach.principles.map((p, i) => (
            <li key={i} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <h3 className="apr-title" {...edit('principles', i, 'title')}>
                {p.title}
              </h3>
              <p className="apr-text" {...edit('principles', i, 'text')}>
                {p.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Approach
