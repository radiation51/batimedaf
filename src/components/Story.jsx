import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit } from '../content/editable'
import './Story.css'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const roman = (i) => ROMAN[i] ?? String(i + 1)

/** The approach in four chapters, side by side on the ink ground. */
function Story() {
  const content = useLocalizedContent()
  const t = useUI()
  const slides = content.home.story.slides
  const edit = useEdit(['home', 'story', 'slides'])
  const { ref, ready } = useReveal([slides.length])

  return (
    <section
      className={`sec sec--dark story${ready ? ' is-ready' : ''}`}
      ref={ref}
      data-nav-tone="dark"
    >
      <div className="wrap">
        <span className="label story-label">{t.approachEyebrow}</span>

        <ol className="story-list">
          {slides.map((slide, i) => (
            <li key={i} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <span className="plate story-media">
                <img
                  src={normalizeImage(slide.image).src}
                  alt=""
                  loading="lazy"
                  style={imageVars(slide.image)}
                  {...edit(i, 'image')}
                />
              </span>
              <span className="num story-num">{roman(i)}</span>
              <h3 className="story-title" {...edit(i, 'title')}>
                {slide.title}
              </h3>
              <p className="story-text" {...edit(i, 'description')}>
                {slide.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Story
