import Arrow from './Arrow'
import { useUI } from '../i18n/useLocalizedContent'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './ResidenceGallery.css'

/* Photographs on the page; the viewer holds the rest. */
const SHOWN = 5

/**
 * The residence page gallery as a mosaic: one large photograph and four
 * small ones, plus a link opening every photograph in the viewer. Any
 * photograph opens the viewer through `onOpen(index)`; `editImage(i)` returns
 * the admin's click-to-edit tags (the editor's photo panel lists the whole
 * series, hidden ones included).
 */
function ResidenceGallery({ label, shots, onOpen, editImage }) {
  const t = useUI()

  return (
    <>
      <div className="rg-head">
        <span className="label">{label}</span>
        {shots.length > SHOWN && (
          <button type="button" className="tlink" onClick={() => onOpen(0)}>
            {t.allPhotos} ({shots.length})
            <Arrow size={16} />
          </button>
        )}
      </div>

      <ul className="rg">
        {shots.slice(0, SHOWN).map((shot, i) => (
          <li key={i} data-reveal>
            <button
              type="button"
              className="plate rg-shot"
              onClick={() => onOpen(i)}
              aria-label={`${t.enlarge}${shot.alt ? ` : ${shot.alt}` : ''}`}
            >
              <img
                src={normalizeImage(shot.image).src}
                alt={shot.alt ?? ''}
                loading="lazy"
                decoding="async"
                style={imageVars(shot.image)}
                {...editImage(i)}
              />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ResidenceGallery
