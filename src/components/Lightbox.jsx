import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { normalizeImage } from '../lib/imageStyle'
import { useUI } from '../i18n/useLocalizedContent'
import './Lightbox.css'

const Arrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Full-screen image viewer shared by the residence and apartment pages.
 *
 * `index` is controlled by the caller so the gallery it came from stays the
 * single source of truth; `toolbar` renders above the image, for pages that
 * keep their filter reachable while the viewer is open.
 */
function Lightbox({ shots, index, onIndex, onClose, toolbar, label }) {
  const t = useUI()
  // Read inside the key handler, which must not re-bind on every render.
  const stateRef = useRef({ shots, index })
  stateRef.current = { shots, index }

  useEffect(() => {
    const onKey = (e) => {
      const { shots: list, index: i } = stateRef.current
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onIndex((i + 1) % list.length)
      else if (e.key === 'ArrowLeft') onIndex((i - 1 + list.length) % list.length)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onIndex])

  const shot = shots[index]
  if (!shot) return null

  const step = (delta) => (e) => {
    e.stopPropagation()
    onIndex((index + delta + shots.length) % shots.length)
  }

  // Rendered into <body>: the page wrapper creates a stacking context at
  // z-index 1, which would trap the viewer underneath the navbar.
  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={label ?? t.gallery}
      onClick={onClose}
    >
      {/* Controls sit above the backdrop but must not close it when used. */}
      <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
        {toolbar}
        <button
          type="button"
          className="lb-close"
          aria-label={t.lightboxClose}
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m4 4 8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
        {/* Full, uncropped photo — the admin's crop only shapes the
            thumbnail, not the viewer that exists to show the whole thing. */}
        <img src={normalizeImage(shot.image).src} alt={shot.alt} />
        <figcaption>
          <span>{shot.alt}</span>
          <span className="lb-count">
            {index + 1} / {shots.length}
          </span>
        </figcaption>
      </figure>

      {shots.length > 1 && (
        <>
          <button
            type="button"
            className="lb-nav lb-prev"
            aria-label={t.lightboxPrev}
            onClick={step(-1)}
          >
            <Arrow />
          </button>
          <button
            type="button"
            className="lb-nav lb-next"
            aria-label={t.lightboxNext}
            onClick={step(1)}
          >
            <Arrow />
          </button>
        </>
      )}
    </div>,
    document.body,
  )
}

export default Lightbox
