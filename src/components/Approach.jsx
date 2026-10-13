import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { useEdit } from '../content/editable'
import './Approach.css'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const roman = (i) => ROMAN[i] ?? String(i + 1)

/**
 * "Notre approche", on the ink ground: the client's statement of how they
 * work, then their principles side by side. Words only, no photographs.
 */
function Approach() {
  const content = useLocalizedContent()
  const t = useUI()
  const approach = content.home.approach
  const edit = useEdit(['home', 'approach'])
  const { ref, ready } = useReveal([approach.principles.length])

  return (
    <section
      className={`sec sec--dark apr${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="dark"
    >
      <div className="wrap">
        <span className="label apr-label">{t.approachEyebrow}</span>

        <div className="apr-head">
          <p className="apr-statement" data-reveal {...edit('statement')}>
            {approach.statement}
          </p>
          <p className="apr-text" data-reveal {...edit('text')}>
            {approach.text}
          </p>
        </div>

        <ol className="apr-cols">
          {approach.principles.map((p, i) => (
            <li key={i} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <span className="num apr-num">{roman(i)}</span>
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
