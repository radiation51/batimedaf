import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Arrow from './Arrow'
import { normalizeImage } from '../lib/imageStyle'
import { useUI } from '../i18n/useLocalizedContent'
import './Lightbox.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Full-screen image viewer shared by the galleries.
 *
 * `index` is controlled by the caller so the gallery it came from stays the
 * single source of truth; `toolbar` renders in the top bar, for pages that
 * keep their filter reachable while the viewer is open. The caption reads
 * `shot[captionKey]`, falling back to the alt text.
 */
function Lightbox({ shots, index, onIndex, onClose, toolbar, label, captionKey = 'alt' }) {
  const t = useUI()
  // Read inside the key handler, which must not re-bind on every render.
  const stateRef = useRef({ shots, index })
  useEffect(() => {
    stateRef.current = { shots, index }
  })

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

  const caption = shot[captionKey] || shot.alt
  const step = (delta) => () =>
    onIndex((index + delta + shots.length) % shots.length)

  // Rendered into <body>, above the sticky bar and every page layer.
  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={label ?? t.gallery}>
      <div className="lb-bar">
        <span className="lb-count">
          {pad(index + 1)} / {pad(shots.length)}
        </span>
        <div className="lb-tools">{toolbar}</div>
        <button type="button" className="lb-close" onClick={onClose}>
          {t.lightboxClose}
        </button>
      </div>

      {/* A click on the empty stage closes, a click on the photo does not. */}
      <div className="lb-stage" onClick={onClose}>
        {/* Full, uncropped photo: the admin's crop only shapes thumbnails. */}
        <img
          src={normalizeImage(shot.image).src}
          alt={shot.alt ?? ''}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="lb-foot">
        <p className="lb-caption">{caption}</p>
        {shots.length > 1 && (
          <div className="lb-nav">
            <button
              type="button"
              className="lb-prev"
              aria-label={t.lightboxPrev}
              onClick={step(-1)}
            >
              <Arrow size={22} />
            </button>
            <button
              type="button"
              aria-label={t.lightboxNext}
              onClick={step(1)}
            >
              <Arrow size={22} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Lightbox
