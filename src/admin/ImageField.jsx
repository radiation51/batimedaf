import { useRef, useState } from 'react'
import { storeImage, canUseStorage } from '../lib/storage'
import { normalizeImage, DEFAULT_IMAGE } from '../lib/imageStyle'

/** Percentage position (0–100) of a pointer event within `el`'s box. */
function percentInBox(el, clientX, clientY) {
  const rect = el.getBoundingClientRect()
  return {
    x: Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))),
    y: Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100))),
  }
}

/**
 * Crop control: drag on the preview to move the focal point (what stays
 * centered when a section crops this picture tighter than the source), and
 * the slider to zoom in past the default fit. Every page that shows this
 * image reads the same x/y/zoom back, so the choice made here is the choice
 * the visitor sees — no page re-crops it its own way.
 */
function CropControl({ img, onChange }) {
  const frameRef = useRef(null)
  const [holding, setHolding] = useState(false)

  const moveTo = (clientX, clientY) => {
    if (!frameRef.current) return
    onChange(percentInBox(frameRef.current, clientX, clientY))
  }

  return (
    <div className="ad-crop-wrap">
      <div
        className="ad-crop"
        ref={frameRef}
        onMouseDown={(e) => {
          setHolding(true)
          moveTo(e.clientX, e.clientY)
        }}
        onMouseMove={(e) => {
          if (holding) moveTo(e.clientX, e.clientY)
        }}
        onMouseUp={() => setHolding(false)}
        onMouseLeave={() => setHolding(false)}
        role="slider"
        aria-label="Centre de l’image"
        aria-valuetext={`${img.x}%, ${img.y}%`}
      >
        <div
          className="ad-crop-image"
          style={{
            backgroundImage: `url(${img.src})`,
            backgroundPosition: `${img.x}% ${img.y}%`,
            transform: `scale(${img.zoom})`,
            transformOrigin: `${img.x}% ${img.y}%`,
          }}
        />
        <span
          className="ad-crop-marker"
          style={{ left: `${img.x}%`, top: `${img.y}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="ad-crop-hint">
        Cliquez ou glissez sur l’image pour choisir ce qui reste visible
        quand elle est recadrée.
      </p>

      <label className="ad-zoom-row">
        <span className="ad-field-label">Zoom</span>
        <input
          type="range"
          min="1"
          max="2.5"
          step="0.05"
          value={img.zoom}
          onChange={(e) => onChange({ zoom: Number(e.target.value) })}
        />
        <span className="ad-zoom-value">{img.zoom.toFixed(2)}×</span>
      </label>
    </div>
  )
}

/** One picture: replace it (file, drop or URL), then crop and zoom it. */
function ImageField({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [dragging, setDragging] = useState(false)

  const img = normalizeImage(value)
  const patch = (fields) => onChange({ ...img, ...fields })

  const accept = async (file) => {
    if (!file) return
    setError('')
    setNote('')
    setBusy(true)
    try {
      const stored = await storeImage(file)
      // A new picture resets the crop — the old x/y/zoom was chosen for a
      // different photo and would frame this one arbitrarily.
      onChange({ ...DEFAULT_IMAGE, src: stored.src })
      setNote(stored.note)
      if (stored.error) setError(stored.error)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
      // Let the same file be picked again after a failure.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const isUploaded = img.src.startsWith('data:')

  return (
    <div className="ad-field ad-image-field">
      <span className="ad-field-label">{label}</span>

      {img.src && <CropControl img={img} onChange={patch} />}

      <div
        className={`ad-image-row${dragging ? ' is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          accept(e.dataTransfer.files?.[0])
        }}
      >
        <span className="ad-thumb">
          {img.src ? <img src={img.src} alt="" /> : null}
        </span>

        <div className="ad-image-main">
          <input
            type="url"
            value={isUploaded ? '' : img.src}
            placeholder={isUploaded ? 'Image téléversée' : 'https://…'}
            onChange={(e) => {
              setNote('')
              setError('')
              // A pasted URL is a different picture too: reset the crop.
              onChange({ ...DEFAULT_IMAGE, src: e.target.value })
            }}
          />

          <div className="ad-image-actions">
            <button
              type="button"
              className="ad-upload"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? 'Traitement…' : 'Changer l’image'}
            </button>
            <span className="ad-image-hint">
              ou glissez un fichier ici
              {canUseStorage() ? '' : ' · stockage local'}
            </span>
          </div>

          {note && <p className="ad-image-note">{note}</p>}
          {error && <p className="ad-image-error">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}

export default ImageField
