import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import './Intro.css'

function Intro() {
  const content = useLocalizedContent()
  const intro = content.home.intro
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const words = intro.description.split(' ')

  useEffect(() => {
    let ticking = false

    const compute = () => {
      const el = sectionRef.current
      ticking = false
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 0

      if (!viewportHeight) return

      // The section is a tall scroll track with a pinned inner panel: progress
      // runs from the moment it fills the screen to just before it leaves.
      const scrollableDistance = rect.height - viewportHeight
      if (scrollableDistance <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0)
        return
      }

      const raw = (0 - rect.top) / scrollableDistance
      setProgress(Math.min(Math.max(raw, 0), 1))
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <section className="intro" ref={sectionRef} data-nav-tone="light">
      <div className="intro-sticky">
        <div className="intro-inner">
          <div className="intro-logo">{intro.logo}</div>

          <p className="intro-description">
            {words.map((word, i) => {
              // Strictly sequential wipe: one word colours at a time.
              const wordProgress = Math.min(
                Math.max(progress * words.length - i, 0),
                1,
              )
              return (
                <span
                  key={i}
                  className="intro-word"
                  style={{ '--w': wordProgress }}
                >
                  {word}{' '}
                </span>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Intro
