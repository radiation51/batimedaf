import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './ScrollStory.css'

const TEXT_TRANSITION_MS = 650
const TEXT_STAGGER_MS = 150
const BG_TRANSITION_MS = 1100

function ScrollStory() {
  const content = useLocalizedContent()
  const slides = content.home.story.slides

  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(null)
  const lastIndexRef = useRef(0)
  const timeoutRef = useRef(null)

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

      const scrollableDistance = rect.height - viewportHeight
      if (scrollableDistance <= 0) {
        el.style.setProperty('--expand', rect.top <= 0 ? '1' : '0')
        setActiveIndex(rect.top <= 0 ? slides.length - 1 : 0)
        return
      }

      // How far the section has travelled toward the top of the viewport:
      // 0 when its top edge is a screen away, 1 when it is pinned. Smoothstep
      // rather than a plain ramp, so the panel eases out of its narrow state
      // and settles into full width instead of snapping at either end.
      const entry = 1 - Math.min(Math.max(rect.top / viewportHeight, 0), 1)
      const eased = entry * entry * (3 - 2 * entry)
      el.style.setProperty('--expand', eased.toFixed(4))

      const raw = (0 - rect.top) / scrollableDistance
      const clamped = Math.min(Math.max(raw, 0), 1)
      const index = Math.min(
        slides.length - 1,
        Math.round(clamped * (slides.length - 1)),
      )

      setActiveIndex(index)
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
  }, [slides.length])

  useEffect(() => {
    if (activeIndex === lastIndexRef.current) return

    setPreviousIndex(lastIndexRef.current)
    lastIndexRef.current = activeIndex

    // Keep the outgoing layers mounted until the slowest animation (the
    // background crossfade) has finished, otherwise the old image pops out.
    clearTimeout(timeoutRef.current)
    const totalDuration = Math.max(
      TEXT_TRANSITION_MS + TEXT_STAGGER_MS,
      BG_TRANSITION_MS,
    )
    timeoutRef.current = setTimeout(() => {
      setPreviousIndex(null)
    }, totalDuration)

    return () => clearTimeout(timeoutRef.current)
  }, [activeIndex])

  const slide = slides[activeIndex]
  const prevSlide = previousIndex !== null ? slides[previousIndex] : null

  return (
    <section
      className="story"
      ref={sectionRef}
      data-nav-tone="dark"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="story-sticky">
        <div className="story-bg-layer">
          {prevSlide && (
            <div
              className="story-bg story-bg--exit"
              key={`bg-exit-${previousIndex}`}
              style={{
                backgroundImage: `url(${normalizeImage(prevSlide.image).src})`,
                ...imageVars(prevSlide.image),
              }}
              aria-hidden="true"
            />
          )}
          <div
            className="story-bg story-bg--enter"
            key={`bg-${activeIndex}`}
            style={{
              backgroundImage: `url(${normalizeImage(slide.image).src})`,
              ...imageVars(slide.image),
            }}
          />
        </div>

        <div className="story-overlay" />

        <div className="story-content">
          <div className="roll-mask roll-mask--title">
            {prevSlide && (
              <h2
                className="story-title roll-text roll-text--exit"
                key={`title-exit-${previousIndex}`}
                aria-hidden="true"
              >
                {prevSlide.title}
              </h2>
            )}
            <h2
              className="story-title roll-text roll-text--enter"
              key={`title-${activeIndex}`}
            >
              {slide.title}
            </h2>
          </div>

          <div className="roll-mask roll-mask--description">
            {prevSlide && (
              <p
                className="story-description roll-text roll-text--exit"
                key={`desc-exit-${previousIndex}`}
                aria-hidden="true"
              >
                {prevSlide.description}
              </p>
            )}
            <p
              className="story-description roll-text roll-text--enter"
              key={`desc-${activeIndex}`}
            >
              {slide.description}
            </p>
          </div>
        </div>

        <div className="story-progress">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`story-progress-dot${i === activeIndex ? ' is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScrollStory
