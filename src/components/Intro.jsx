import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { useEdit } from '../content/editable'
import './Intro.css'

/** The house's statement, set large and quiet beside its signature. */
function Intro() {
  const intro = useLocalizedContent().home.intro
  const edit = useEdit(['home', 'intro'])
  const { ref, ready } = useReveal([intro.description])

  return (
    <section
      className={`sec intro${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="wrap split">
        <div className="split-aside">
          <span className="label" {...edit('logo')}>
            {intro.logo}
          </span>
        </div>
        <p className="split-main intro-text" data-reveal {...edit('description')}>
          {intro.description}
        </p>
      </div>
    </section>
  )
}

export default Intro
