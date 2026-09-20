import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { prepareImage, dataUriBytes, formatBytes } from '../lib/image'
import { uploadImage, canUseStorage } from '../lib/storage'
import { normalizeImage, hasImageShape, DEFAULT_IMAGE } from '../lib/imageStyle'
import { usePageMeta } from '../hooks/usePageMeta'
import './Admin.css'

/* Password used when Supabase is not configured — local editing only. */
const LOCAL_PASSWORD = '1234'

/* With Supabase, everyone shares one administrator account and only types a
   password. Supabase wants an e-mail and at least 6 characters, so both are
   added here: the account in Supabase is ADMIN_EMAIL with the password
   "<code typed>" + ADMIN_PASSWORD_SUFFIX (e.g. 1234-batimedaf). To change the
   code, change that password in Supabase (Authentication → Users). */
const ADMIN_EMAIL = 'admin@batimedaf.netlify.app'
const ADMIN_PASSWORD_SUFFIX = '-batimedaf'

/* Sidebar → content sections. */
const PAGES = [
  { key: 'home', label: 'Accueil' },
  { key: 'about', label: 'À propos' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'contact', label: 'Contact' },
]

const LABELS = {
  hero: 'Hero',
  intro: 'Introduction',
  story: 'Sections défilantes',
  gallery: 'Galerie',
  title: 'Titre',
  titleLines: 'Lignes du titre',
  description: 'Description',
  text: 'Texte',
  image: 'Image',
  images: 'Images',
  src: 'Image',
  alt: 'Texte alternatif',
  caption: 'Légende',
  primaryCta: 'Bouton principal',
  secondaryCta: 'Bouton secondaire',
  eyebrow: 'Sur-titre',
  kicker: 'Sur-titre',
  sub: 'Sous-titre',
  slides: 'Diapositives',
  figures: 'Chiffres clés',
  milestones: 'Étapes',
  principles: 'Principes',
  profiles: 'Profils',
  criteria: 'Critères',
  commitments: 'Engagements',
  steps: 'Étapes',
  faq: 'Questions fréquentes',
  subjects: 'Sujets du formulaire',
  phone: 'Téléphone',
  email: 'Email',
  address: 'Adresse',
  hours: 'Horaires',
  value: 'Valeur',
  label: 'Libellé',
  year: 'Année',
  headline: 'Accroche',
  apartments: 'Appartements',
  features: 'Prestations',
  specs: 'Caractéristiques',
  stats: 'Chiffres',
  place: 'Localisation',
  transports: 'Transports',
  nearby: 'À proximité',
  presentation: 'Présentation',
  summary: 'Résumé',
  body: 'Paragraphes',
  meta: 'Étiquettes',
  tagline: 'Accroche',
  location: 'Localisation',
  name: 'Nom',
  reference: 'Référence',
  surface: 'Surface (m²)',
  floor: 'Étage',
  orientation: 'Orientation',
  outdoor: 'Extérieur',
  type: 'Typologie',
  line: 'Ligne',
  detail: 'Détail',
  updated: 'Mise à jour',
  ctaTitle: 'Titre du bloc final',
  ctaLabel: 'Bouton du bloc final',
  timelineTitle: 'Titre du parcours',
  commitmentsTitle: 'Titre des engagements',
  stepsTitle: 'Titre des étapes',
  faqTitle: 'Titre de la FAQ',
  figureValue: 'Chiffre',
  figureLabel: 'Légende du chiffre',
}

/* Fields the site no longer displays, so there is nothing to edit. They stay
   in the data untouched — the editor simply skips them. */
const HIDDEN_KEYS = new Set(['price', 'status'])

const labelFor = (key) =>
  LABELS[key] ?? String(key).charAt(0).toUpperCase() + String(key).slice(1)

const isLongText = (key, value) =>
  typeof value === 'string' &&
  (value.length > 90 || /description|text|summary|intro|address|hours/i.test(key))

/* ---------------- Field primitives ---------------- */

function TextField({ label, value, onChange, long }) {
  return (
    <label className="ad-field">
      <span className="ad-field-label">{label}</span>
      {long ? (
        <textarea
          rows={Math.min(8, Math.ceil(String(value).length / 60) + 1)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="ad-field">
      <span className="ad-field-label">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

/* Past this, a single picture eats a meaningful share of the ~5 MB
   localStorage budget the whole site shares. */
const HEAVY_IMAGE_BYTES = 700 * 1024

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
      // Always downscale first: it keeps the upload small, and it is the only
      // thing standing between a phone photo and the localStorage quota when
      // there is no bucket to send it to.
      const { dataUri, width, height } = await prepareImage(file)
      const bytes = dataUriBytes(dataUri)
      const size = `${width ? `${width}×${height} · ` : ''}${formatBytes(bytes)}`

      // A new picture resets the crop — the old x/y/zoom was chosen for a
      // different photo and would frame this one arbitrarily.
      if (canUseStorage()) {
        try {
          const url = await uploadImage(dataUri, file.name)
          onChange({ ...DEFAULT_IMAGE, src: url })
          setNote(`${file.name} · ${size} · envoyé sur Supabase`)
          return
        } catch (uploadError) {
          // Keep the picture rather than losing the edit, and say what
          // happened: inline images are only visible to this browser.
          onChange({ ...DEFAULT_IMAGE, src: dataUri })
          setNote(`${file.name} · ${size} · conservé localement`)
          setError(`Envoi Supabase impossible : ${uploadError.message}`)
          return
        }
      }

      onChange({ ...DEFAULT_IMAGE, src: dataUri })
      setNote(
        `${file.name} · ${size}` +
          (bytes > HEAVY_IMAGE_BYTES
            ? ' — image lourde, le stockage local est limité.'
            : ''),
      )
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
              {busy ? 'Traitement…' : 'Téléverser une image'}
            </button>
            {isUploaded && (
              <button
                type="button"
                className="ad-remove"
                onClick={() => {
                  onChange({ ...DEFAULT_IMAGE })
                  setNote('')
                }}
              >
                Retirer
              </button>
            )}
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

/**
 * Renders any node of the content tree: primitives become fields, objects
 * recurse, arrays become add/remove lists. One editor covers every page, so
 * new content shows up in the panel without extra code.
 */
function Node({ value, path, keyName, setPath, pushItem, removeItem, moveItem, depth = 0 }) {
  if (hasImageShape(value)) {
    return (
      <ImageField
        label={labelFor(keyName)}
        value={value}
        onChange={(v) => setPath(path, v)}
      />
    )
  }

  if (typeof value === 'string') {
    return (
      <TextField
        label={labelFor(keyName)}
        value={value}
        long={isLongText(keyName, value)}
        onChange={(v) => setPath(path, v)}
      />
    )
  }

  if (typeof value === 'number') {
    return (
      <NumberField
        label={labelFor(keyName)}
        value={value}
        onChange={(v) => setPath(path, v)}
      />
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="ad-field ad-check">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => setPath(path, e.target.checked)}
        />
        <span>{labelFor(keyName)}</span>
      </label>
    )
  }

  if (Array.isArray(value)) {
    const template = () => {
      const sample = value[0]
      if (typeof sample === 'string') return ''
      if (typeof sample === 'number') return 0
      if (hasImageShape(sample)) return { ...DEFAULT_IMAGE }
      if (sample && typeof sample === 'object') {
        // A blank copy of the existing shape, so the new row edits like the others.
        return Object.fromEntries(
          Object.entries(sample).map(([k, v]) => [
            k,
            hasImageShape(v) ? { ...DEFAULT_IMAGE } :
            typeof v === 'string' ? '' : typeof v === 'number' ? 0 : Array.isArray(v) ? [] : v,
          ]),
        )
      }
      return ''
    }

    return (
      <fieldset className="ad-group ad-list">
        <legend>{labelFor(keyName)}</legend>

        {value.map((item, i) => (
          <div className="ad-list-item" key={i}>
            <div className="ad-list-head">
              <span className="ad-list-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="ad-list-actions">
                <button
                  type="button"
                  className="ad-move"
                  disabled={i === 0}
                  onClick={() => moveItem(path, i, -1)}
                  aria-label="Monter"
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="ad-move"
                  disabled={i === value.length - 1}
                  onClick={() => moveItem(path, i, 1)}
                  aria-label="Descendre"
                  title="Descendre"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="ad-remove"
                  onClick={() => removeItem(path, i)}
                >
                  Supprimer
                </button>
              </div>
            </div>
            <Node
              value={item}
              path={[...path, i]}
              keyName={keyName}
              setPath={setPath}
              pushItem={pushItem}
              removeItem={removeItem}
              moveItem={moveItem}
              depth={depth + 1}
            />
          </div>
        ))}

        <button
          type="button"
          className="ad-add"
          onClick={() => pushItem(path, template())}
        >
          + Ajouter
        </button>
      </fieldset>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <fieldset className={`ad-group${depth === 0 ? ' ad-group--top' : ''}`}>
        {depth > 0 && <legend>{labelFor(keyName)}</legend>}
        {Object.entries(value)
          .filter(([k]) => !HIDDEN_KEYS.has(k))
          .map(([k, v]) => (
            <Node
              key={k}
              value={v}
              path={[...path, k]}
              keyName={k}
              setPath={setPath}
              pushItem={pushItem}
              removeItem={removeItem}
              moveItem={moveItem}
              depth={depth + 1}
            />
          ))}
      </fieldset>
    )
  }

  return null
}

/* ---------------- Login ---------------- */

function Login({ onLocalUnlock }) {
  const { signIn, isSupabaseConfigured } = useContent()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      if (password === LOCAL_PASSWORD) onLocalUnlock()
      else setError('Mot de passe incorrect.')
      return
    }

    setBusy(true)
    const { error: authError } = await signIn(
      ADMIN_EMAIL,
      password + ADMIN_PASSWORD_SUFFIX,
    )
    setBusy(false)
    if (authError) {
      setError(
        /invalid login/i.test(authError) ? 'Mot de passe incorrect.' : authError,
      )
    }
  }

  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <span className="ad-login-brand">BATIMEDAF</span>
        <h1>Administration</h1>
        <p className="ad-login-sub">
          {isSupabaseConfigured
            ? 'Entrez le mot de passe administrateur.'
            : 'Mode local : les modifications restent sur cet appareil.'}
        </p>

        <label className="ad-field">
          <span className="ad-field-label">Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="ad-error">{error}</p>}

        <button type="submit" className="ad-primary" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>

        <Link to="/" className="ad-login-back">
          Retour au site
        </Link>
      </form>
    </div>
  )
}

/* ---------------- Panel ---------------- */

function Admin() {
  usePageMeta({ title: 'Administration', noindex: true })

  const {
    content,
    session,
    isSupabaseConfigured,
    status,
    saveState,
    storageError,
    signOut,
    setPath,
    pushItem,
    removeItem,
    moveItem,
    addApartment,
    removeApartment,
    reset,
  } = useContent()

  const [localUnlocked, setLocalUnlocked] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(true)
  const [view, setView] = useState({ kind: 'page', key: 'home' })
  const [residenceSlug, setResidenceSlug] = useState(
    content.residences[0]?.slug ?? '',
  )
  // 'home' (galerie « Nos appartements ») ou le slug d'une résidence.
  const [galleryTarget, setGalleryTarget] = useState('home')

  const authed = isSupabaseConfigured ? Boolean(session) : localUnlocked

  const residenceIndex = useMemo(
    () => content.residences.findIndex((r) => r.slug === residenceSlug),
    [content.residences, residenceSlug],
  )
  const residence = content.residences[residenceIndex]

  const galleryResidenceIndex = useMemo(
    () => content.residences.findIndex((r) => r.slug === galleryTarget),
    [content.residences, galleryTarget],
  )
  const galleryResidence = content.residences[galleryResidenceIndex]

  if (!authed) return <Login onLocalUnlock={() => setLocalUnlocked(true)} />

  const saveLabel = {
    idle: isSupabaseConfigured ? 'Synchronisé' : 'Enregistré localement',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    error: 'Échec de l’enregistrement',
  }[saveState]

  return (
    <div className="ad">
      {/* ---------- Sidebar ---------- */}
      <aside className="ad-side">
        <Link to="/" className="ad-brand">
          BATIMEDAF
        </Link>

        <nav className="ad-nav">
          <button
            type="button"
            className={`ad-nav-btn ad-nav-parent${pagesOpen ? ' is-open' : ''}`}
            onClick={() => setPagesOpen((o) => !o)}
            aria-expanded={pagesOpen}
          >
            Pages
            <span className="ad-caret" aria-hidden="true" />
          </button>

          {pagesOpen && (
            <ul className="ad-sub">
              {PAGES.map((page) => (
                <li key={page.key}>
                  <button
                    type="button"
                    className={`ad-nav-btn ad-nav-sub${
                      view.kind === 'page' && view.key === page.key
                        ? ' is-active'
                        : ''
                    }`}
                    onClick={() => setView({ kind: 'page', key: page.key })}
                  >
                    {page.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className={`ad-nav-btn${view.kind === 'residence' ? ' is-active' : ''}`}
            onClick={() => setView({ kind: 'residence' })}
          >
            Résidences
          </button>

          <button
            type="button"
            className={`ad-nav-btn${view.kind === 'galleries' ? ' is-active' : ''}`}
            onClick={() => setView({ kind: 'galleries' })}
          >
            Galeries
          </button>

          <button
            type="button"
            className={`ad-nav-btn${view.kind === 'contact' ? ' is-active' : ''}`}
            onClick={() => setView({ kind: 'contact' })}
          >
            Contact
          </button>
        </nav>

        <div className="ad-side-foot">
          {storageError && (
            <p className="ad-storage-warning">
              Stockage local saturé : les dernières modifications ne sont pas
              conservées. Retirez ou allégez une image.
            </p>
          )}
          <span className={`ad-status ad-status--${saveState}`}>{saveLabel}</span>
          <span className="ad-mode">
            {isSupabaseConfigured
              ? status === 'remote'
                ? 'Supabase connecté'
                : 'Supabase indisponible'
              : 'Stockage local'}
          </span>
          <button
            type="button"
            className="ad-ghost"
            onClick={() => {
              if (
                window.confirm(
                  'Réinitialiser tout le contenu du site aux valeurs par défaut ?',
                )
              ) {
                reset()
              }
            }}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="ad-ghost"
            onClick={() => {
              signOut()
              setLocalUnlocked(false)
            }}
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="ad-main">
        {view.kind === 'page' && (
          <>
            <header className="ad-head">
              <h1>{PAGES.find((p) => p.key === view.key)?.label}</h1>
              <p>Modifiez les textes et les images de cette page.</p>
            </header>
            <Node
              value={content[view.key]}
              path={[view.key]}
              keyName={view.key}
              setPath={setPath}
              pushItem={pushItem}
              removeItem={removeItem}
              moveItem={moveItem}
            />
          </>
        )}

        {view.kind === 'contact' && (
          <>
            <header className="ad-head">
              <h1>Contact</h1>
              <p>Coordonnées, sujets du formulaire et questions fréquentes.</p>
            </header>
            <Node
              value={content.contact}
              path={['contact']}
              keyName="contact"
              setPath={setPath}
              pushItem={pushItem}
              removeItem={removeItem}
              moveItem={moveItem}
            />
          </>
        )}

        {view.kind === 'galleries' && (
          <>
            <header className="ad-head">
              <h1>Galeries</h1>
              <p>Choisissez, recadrez et réordonnez les photos d’une galerie.</p>
            </header>

            <div className="ad-tabs">
              <button
                type="button"
                className={`ad-tab${galleryTarget === 'home' ? ' is-active' : ''}`}
                onClick={() => setGalleryTarget('home')}
              >
                Accueil
              </button>
              {content.residences.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  className={`ad-tab${galleryTarget === r.slug ? ' is-active' : ''}`}
                  onClick={() => setGalleryTarget(r.slug)}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {galleryTarget === 'home' ? (
              <Node
                value={content.home.gallery}
                path={['home', 'gallery']}
                keyName="gallery"
                setPath={setPath}
                pushItem={pushItem}
                removeItem={removeItem}
                moveItem={moveItem}
              />
            ) : (
              galleryResidence && (
                <Node
                  value={galleryResidence.gallery}
                  path={['residences', galleryResidenceIndex, 'gallery']}
                  keyName="gallery"
                  setPath={setPath}
                  pushItem={pushItem}
                  removeItem={removeItem}
                  moveItem={moveItem}
                />
              )
            )}
          </>
        )}

        {view.kind === 'residence' && residence && (
          <>
            <header className="ad-head">
              <h1>Résidences</h1>
              <p>Descriptif, prestations, localisation et appartements.</p>
            </header>

            <div className="ad-tabs">
              {content.residences.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  className={`ad-tab${r.slug === residenceSlug ? ' is-active' : ''}`}
                  onClick={() => setResidenceSlug(r.slug)}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <Node
              value={residence}
              path={['residences', residenceIndex]}
              keyName="residence"
              setPath={setPath}
              pushItem={pushItem}
              removeItem={removeItem}
              moveItem={moveItem}
            />

            <div className="ad-apt-actions">
              <button
                type="button"
                className="ad-primary"
                onClick={() => addApartment(residence.slug)}
              >
                + Ajouter un appartement
              </button>
              {residence.apartments.length > 0 && (
                <button
                  type="button"
                  className="ad-ghost"
                  onClick={() => {
                    const last = residence.apartments.at(-1)
                    if (
                      window.confirm(
                        `Supprimer l’appartement ${last.reference} ?`,
                      )
                    ) {
                      removeApartment(residence.slug, last.id)
                    }
                  }}
                >
                  Supprimer le dernier appartement
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Admin
