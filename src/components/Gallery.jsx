import { useState } from 'react'
import Lightbox from './Lightbox'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit, useEditMode } from '../content/editable'
import './Gallery.css'

const pad = (n) => String(n).padStart(2, '0')

/* The shapes the photographs are cut to, in turn: an arch, a landscape, a
   round, an upright. */
const SHAPES = ['arch', 'land', 'round', 'tall']

/**
 * The home page gallery: a slow band of photographs crossing the page,
 * bottom-aligned like a street of façades. The list is drawn twice so the
 * band loops without a seam; the copy is hidden from assistive tech.
 * Hovering pauses it, a click opens the viewer. Reduced motion and the
 * admin's editor get one still row that scrolls by hand instead.
 */
function Gallery() {
  const { eyebrow, title, images } = useLocalizedContent().home.reel
  const edit = useEdit(['home', 'reel'])
  const still = useEditMode()
  const t = useUI()
  // Index of the photograph shown full screen, or null.
  const [open, setOpen] = useState(null)

  const row = (copy) => (
    <ul className="reel-row" aria-hidden={copy || undefined}>
      {images.map((shot, i) => (
        <li key={i} className={`reel-item reel-item--${SHAPES[i % SHAPES.length]}`}>
          <button
            type="button"
            className="plate reel-shot"
            onClick={() => setOpen(i)}
            tabIndex={copy ? -1 : undefined}
            aria-label={`${t.enlarge}${shot.alt ? ` : ${shot.alt}` : ''}`}
          >
            <img
              src={normalizeImage(shot.image).src}
              alt={copy ? '' : (shot.alt ?? '')}
              loading="lazy"
              decoding="async"
              style={imageVars(shot.image)}
              {...(copy ? {} : edit('images', i, 'image'))}
            />
          </button>
          <p className="caption">
            <span className="num">{pad(i + 1)}</span>
            {shot.caption && (
              <span {...(copy ? {} : edit('images', i, 'caption'))}>
                {shot.caption}
              </span>
            )}
          </p>
        </li>
      ))}
    </ul>
  )

  return (
    <section className="sec reel" data-nav-tone="light">
      <div className="wrap">
        <div className="split reel-head">
          <div className="split-aside">
            <span className="label" {...edit('eyebrow')}>
              {eyebrow}
            </span>
          </div>
          <h2 className="split-main d2" {...edit('title')}>
            {title}
          </h2>
        </div>
      </div>

      <div className={`reel-view${still ? ' is-still' : ''}`}>
        <div
          className="reel-track"
          style={{ '--reel-duration': `${images.length * 9}s` }}
        >
          {row(false)}
          {!still && row(true)}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          shots={images}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          captionKey="caption"
        />
      )}
    </section>
  )
}

export default Gallery
