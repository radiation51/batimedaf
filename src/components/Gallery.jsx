import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './Gallery.css'

function Gallery() {
  const content = useLocalizedContent()
  const { eyebrow, title, images } = content.home.gallery

  const sectionRef = useRef(null)
  // The hidden start state is only applied once JS is running, so the gallery
  // still renders normally if IntersectionObserver never fires.
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const root = sectionRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return

    setAnimated(true)

    const targets = root.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // reveal once, then stop watching
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )

    targets.forEach((el) => observer.observe(el))

    // Safety net: the reveal starts from opacity 0, so if the observer never
    // reports (odd viewports, restored scroll position, embedded contexts)
    // the gallery would stay invisible. Force it visible after a beat.
    const fallback = setTimeout(() => {
      targets.forEach((el) => el.classList.add('is-visible'))
    }, 2500)

    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [images])

  return (
    <section
      className={`gallery${animated ? ' is-animated' : ''}`}
      ref={sectionRef}
      data-nav-tone="dark"
    >
      <div className="gallery-inner">
        <header className="gallery-header">
          <span className="gallery-eyebrow" data-reveal>
            {eyebrow}
          </span>
          <h2 className="gallery-title" data-reveal>
            {title}
          </h2>
        </header>
      </div>

      <div className="gallery-marquee" data-reveal>
        {/* The list is rendered twice so the track can loop seamlessly: the
            animation shifts it by exactly one copy and restarts. */}
        <div className="gallery-track">
          {[0, 1].map((copy) =>
            images.map((item) => {
              const img = normalizeImage(item.image)
              return (
                <figure
                  className="gallery-item"
                  key={`${copy}-${img.src}`}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                >
                  <div className="gallery-media">
                    <img
                      src={img.src}
                      alt={copy === 1 ? '' : item.alt}
                      loading="lazy"
                      decoding="async"
                      style={imageVars(item.image)}
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="gallery-caption">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }),
          )}
        </div>
      </div>
    </section>
  )
}

export default Gallery
