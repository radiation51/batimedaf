import { useRef, useState } from 'react'
import { useContent } from '../content/ContentContext'
import { newImage, normalizeImage } from '../lib/imageStyle'
import { storeImage } from '../lib/storage'
import ImageField from './ImageField'
import { confirmAsk } from './confirm'

/** "Les Jardins d'Hydra" → "les-jardins-d-hydra", made unique among `taken`. */
export function uniqueSlug(name, taken, fallback = 'residence') {
  const base =
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || fallback
  let slug = base
  for (let n = 2; taken.includes(slug); n++) slug = `${base}-${n}`
  return slug
}

const STATUSES = ['Disponible', 'Dernière opportunité', 'Sur demande', 'Vendu']
const ROOMS = ['Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Extérieur', 'Autre']

/* What each form asks: [key, label, required, kind, example]. */
const RESIDENCE_FIELDS = [
  ['name', 'Nom de la résidence', true, 'text', 'Ex. Les Jardins d’Hydra'],
  ['tagline', 'Accroche', true, 'text', 'Ex. Vivre au cœur de la verdure'],
  ['location', 'Lieu', true, 'text', 'Ex. Hydra — Alger'],
  ['count', 'Nombre de logements', true, 'text', 'Ex. 24 appartements'],
  ['delivery', 'Livraison', true, 'text', 'Ex. 2027'],
  ['description', 'Description courte', true, 'textarea', 'Deux lignes pour présenter la résidence.'],
  ['presentation', 'Présentation détaillée', false, 'textarea', 'Le texte d’ouverture de la page.'],
]

const APARTMENT_FIELDS = [
  ['type', 'Type', true, 'text', 'Ex. F4, Duplex, 3 pièces'],
  ['reference', 'Référence', false, 'text', 'Ex. D-41'],
  ['surface', 'Surface (m²)', true, 'number', 'Ex. 112'],
  ['floor', 'Étage', true, 'text', 'Ex. 4ᵉ étage'],
  ['orientation', 'Exposition', false, 'text', 'Ex. Sud-Est'],
  ['outdoor', 'Extérieur', false, 'text', 'Ex. Terrasse 24 m²'],
  ['status', 'Statut', true, 'select', ''],
  ['description', 'Description', true, 'textarea', 'Ce qui fait cet appartement, en deux ou trois lignes.'],
  ['features', 'Prestations (une par ligne)', false, 'textarea', 'Ex. Suite parentale\nParking inclus'],
]

/* Shown on the page while a field is still empty, so the preview reads. */
const RESIDENCE_STAND_INS = {
  name: 'Nouvelle résidence',
  tagline: 'Accroche à compléter',
  location: 'Lieu à compléter',
  count: 'Nombre de logements',
  delivery: 'à venir',
  description: 'Description à compléter.',
  presentation: 'Présentation de la résidence à compléter.',
}

const APARTMENT_STAND_INS = {
  type: 'Nouvel appartement',
  description: 'Description à compléter.',
}

/** The apartment put in the draft while its form is being filled in. */
export const draftApartment = (id, image) => ({
  id,
  reference: 'NOUVEAU',
  type: APARTMENT_STAND_INS.type,
  surface: 0,
  floor: '',
  orientation: '',
  outdoor: '',
  price: 0,
  status: STATUSES[0],
  image,
  description: APARTMENT_STAND_INS.description,
  features: [],
  gallery: [],
})

// A number field (the surface) counts only with a value above zero.
const filled = (value, kind) =>
  kind === 'number' ? Number(value) > 0 : Boolean(String(value ?? '').trim())

/**
 * The photos of the new entry: one main photo (required), then as many more
 * as wanted, each with the room it shows for an apartment.
 */
function PhotosField({ main, extras, withRooms, onMain, onExtras }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const addFiles = async (files) => {
    if (!files?.length) return
    setBusy(true)
    setError('')
    const added = []
    for (const file of files) {
      try {
        const stored = await storeImage(file)
        added.push({ image: newImage(stored.src), category: ROOMS[0] })
        if (stored.error) setError(stored.error)
      } catch (e) {
        setError(e.message)
      }
    }
    onExtras([...extras, ...added])
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="ve-create-photos">
      <ImageField label="Photo principale *" value={main} onChange={onMain} />

      <span className="ad-field-label">
        Autres photos <span className="ve-optional">(facultatif)</span>
      </span>
      <ul className="ve-create-shots">
        {extras.map((shot, i) => (
          <li key={i}>
            <img src={normalizeImage(shot.image).src} alt="" />
            {withRooms && (
              <select
                value={shot.category}
                onChange={(e) =>
                  onExtras(extras.map((s, j) => (j === i ? { ...s, category: e.target.value } : s)))
                }
                aria-label="Pièce"
              >
                {ROOMS.map((room) => (
                  <option key={room}>{room}</option>
                ))}
              </select>
            )}
            <button
              type="button"
              className="ve-chip ve-chip--danger"
              onClick={() => onExtras(extras.filter((_, j) => j !== i))}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="ve-chip"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? 'Ajout…' : '+ Ajouter des photos'}
      </button>
      {error && <p className="ad-image-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles([...e.target.files])}
      />
    </div>
  )
}

/** One residence or apartment to pick, with its photo and a short line. */
function Choice({ image, title, detail, onPick }) {
  return (
    <li>
      <button type="button" onClick={onPick}>
        <img src={normalizeImage(image).src} alt="" />
        <span>
          <strong>{title}</strong>
          <small>{detail}</small>
        </span>
      </button>
    </li>
  )
}

const countOf = (r) => `${r.apartments.length} appartement${r.apartments.length > 1 ? 's' : ''}`

/**
 * Taking an apartment (or a whole residence) out: the residence first, then
 * the apartment, then a plain yes in the panel itself, no browser dialog.
 * Saved at once, like an addition.
 */
function RemovePanel({ creating, setCreating, goTo, requestSave }) {
  const { content, removeApartment, removeResidence } = useContent()
  const [slug, setSlug] = useState(creating.slug)
  const [id, setId] = useState(creating.id)
  const wholeResidence = creating.kind === 'remove-residence'

  const residence = content.residences.find((r) => r.slug === slug)
  const apartment = residence?.apartments.find((a) => a.id === id)
  const step = !residence ? 'residence' : wholeResidence || apartment ? 'confirm' : 'apartment'
  const close = () => setCreating(null)

  const confirm = () => {
    if (wholeResidence) {
      goTo('/residence')
      removeResidence(slug)
    } else {
      goTo(`/residence/${slug}`)
      removeApartment(slug, id)
    }
    setCreating(null)
    requestSave()
  }

  const what = wholeResidence
    ? `La résidence « ${residence?.name} » et ses ${residence?.apartments.length} appartements vont être retirés du site.`
    : `L’appartement « ${apartment?.type}${apartment?.reference ? ` (${apartment.reference})` : ''} » de ${residence?.name} va être retiré du site.`

  return (
    <aside className="ve-drawer ad" data-editor-ui aria-label="Supprimer">
      <div className="ve-drawer-head">
        <div>
          <span className="ve-drawer-kicker">
            {wholeResidence ? 'Supprimer une résidence' : 'Supprimer un appartement'}
          </span>
          <h2 className="ve-drawer-title">
            {step === 'residence'
              ? 'Dans quelle résidence ?'
              : step === 'apartment'
                ? 'Quel appartement ?'
                : 'Confirmer la suppression'}
          </h2>
        </div>
        <button type="button" className="ve-x" onClick={close} aria-label="Fermer">
          ×
        </button>
      </div>

      {step === 'residence' && (
        <ul className="ve-create-choices">
          {content.residences.map((r) => (
            <Choice
              key={r.slug}
              image={r.image}
              title={r.name}
              detail={countOf(r)}
              onPick={() => setSlug(r.slug)}
            />
          ))}
        </ul>
      )}

      {step === 'apartment' && (
        <>
          {residence.apartments.length === 0 ? (
            <p className="ve-create-note">{residence.name} n’a aucun appartement.</p>
          ) : (
            <ul className="ve-create-choices">
              {residence.apartments.map((a) => (
                <Choice
                  key={a.id}
                  image={a.image}
                  title={a.type}
                  detail={[a.reference, Number(a.surface) > 0 && `${a.surface} m²`, a.status]
                    .filter(Boolean)
                    .join(' · ')}
                  onPick={() => setId(a.id)}
                />
              ))}
            </ul>
          )}
          <button
            type="button"
            className="ve-chip ve-create-back"
            onClick={() => setSlug(undefined)}
          >
            ← Autre résidence
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <p className="ve-create-note">
            {what} La suppression est enregistrée tout de suite.
          </p>
          <div className="ve-create-buttons">
            <button
              type="button"
              className="ve-chip"
              onClick={() => (wholeResidence ? close() : setId(undefined))}
            >
              {wholeResidence ? 'Annuler' : '← Retour'}
            </button>
            <button type="button" className="ve-save ve-save--danger" onClick={confirm}>
              Supprimer
            </button>
          </div>
        </>
      )}
    </aside>
  )
}

/** The add form, or the delete panel when that is what was asked. */
function CreatePanel(props) {
  return props.creating.kind.startsWith('remove') ? (
    <RemovePanel {...props} />
  ) : (
    <AddPanel {...props} />
  )
}

/**
 * The form for a new residence or a new apartment. The entry is already in
 * the draft, with stand-in texts, so the page behind shows it as it fills
 * in; "Ajouter" stays off until every required field and the main photo are
 * there, and the draft cannot be saved meanwhile. Cancelling takes the entry
 * out again.
 */
function AddPanel({ creating, setCreating, goTo, requestSave }) {
  const { content, setPath, insertItem, removeResidence, removeApartment } = useContent()
  const [values, setValues] = useState({ status: STATUSES[0] })
  const [main, setMain] = useState(null)
  const [extras, setExtras] = useState([])

  const isResidence = creating.kind === 'residence'
  const ri = content.residences.findIndex((r) => r.slug === creating.slug)
  const residence = content.residences[ri]
  const ai = residence?.apartments.findIndex((a) => a.id === creating.id) ?? -1

  const fields = isResidence ? RESIDENCE_FIELDS : APARTMENT_FIELDS
  const missing = [
    ...fields
      .filter(([key, , required, kind]) => required && !filled(values[key], kind))
      .map(([, label]) => label),
    ...(main ? [] : ['Photo principale']),
  ]
  const touched = Object.keys(values).length > 1 || main || extras.length

  /* ---- Writing the form into the draft ---- */

  const residencePath = (...rest) => ['residences', ri, ...rest]
  const apartmentPath = (...rest) => ['residences', ri, 'apartments', ai, ...rest]

  const writeResidence = (key, value) => {
    const shown = value?.trim() ? value : RESIDENCE_STAND_INS[key]
    const next = { ...values, [key]: value }
    if (key === 'location') {
      setPath(residencePath('location'), shown)
      setPath(residencePath('place', 'address'), shown)
    }
    if (['count', 'location', 'delivery'].includes(key)) {
      setPath(residencePath('meta'), [
        next.count?.trim() || RESIDENCE_STAND_INS.count,
        next.location?.trim() || RESIDENCE_STAND_INS.location,
        `Livraison ${next.delivery?.trim() || RESIDENCE_STAND_INS.delivery}`,
      ])
    }
    if (['name', 'tagline', 'description', 'presentation'].includes(key)) {
      setPath(residencePath(key), shown)
    }
  }

  const writeApartment = (key, value) => {
    if (key === 'surface') setPath(apartmentPath('surface'), Number(value) || 0)
    else if (key === 'features')
      setPath(
        apartmentPath('features'),
        value.split('\n').map((line) => line.trim()).filter(Boolean),
      )
    else setPath(apartmentPath(key), value?.trim() ? value : (APARTMENT_STAND_INS[key] ?? ''))
  }

  const change = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (isResidence) writeResidence(key, value)
    else writeApartment(key, value)
  }

  const writePhotos = (nextMain, nextExtras) => {
    if (isResidence) {
      if (nextMain) setPath(residencePath('image'), nextMain)
      const shots = [
        ...(nextMain ? [{ image: nextMain, alt: '', category: 'Extérieur' }] : []),
        ...nextExtras.map((s) => ({ image: s.image, alt: '', category: 'Extérieur' })),
      ]
      if (shots.length) setPath(residencePath('gallery'), shots)
    } else {
      if (nextMain) setPath(apartmentPath('image'), nextMain)
      setPath(apartmentPath('gallery'), [
        ...(nextMain ? [{ image: nextMain, alt: '', category: ROOMS[0] }] : []),
        ...nextExtras.map((s) => ({ image: s.image, alt: '', category: s.category })),
      ])
    }
  }

  /* ---- Steps ---- */

  const pickResidence = (r, index) => {
    const id = `nouveau-${Date.now().toString(36)}`
    insertItem(['residences', index, 'apartments'], r.apartments.length, draftApartment(id, r.image))
    setCreating({ kind: 'apartment', slug: r.slug, id })
    goTo(`/residence/${r.slug}`)
    setTimeout(
      () => document.getElementById('appartements')?.scrollIntoView({ behavior: 'smooth' }),
      400,
    )
  }

  const cancel = async () => {
    if (
      touched &&
      !(await confirmAsk('Abandonner cet ajout ? Ce qui a été rempli sera perdu.', {
        yes: 'Abandonner',
        danger: true,
      }))
    )
      return
    if (isResidence && residence) {
      removeResidence(creating.slug)
      goTo('/residence')
    } else if (creating.id && ai >= 0) {
      removeApartment(creating.slug, creating.id)
      goTo(`/residence/${creating.slug}`)
    }
    setCreating(null)
  }

  const finish = () => {
    if (missing.length) return
    if (isResidence) {
      const slug = uniqueSlug(
        values.name,
        content.residences.filter((r) => r.slug !== creating.slug).map((r) => r.slug),
      )
      setPath(residencePath('slug'), slug)
      goTo(`/residence/${slug}`)
    } else {
      const id = uniqueSlug(
        values.type,
        residence.apartments.filter((a) => a.id !== creating.id).map((a) => a.id),
        'appartement',
      )
      setPath(apartmentPath('id'), id)
      setPath(apartmentPath('reference'), values.reference?.trim() || id.toUpperCase())
      goTo(`/residence/${creating.slug}/${id}`)
    }
    setCreating(null)
    requestSave()
  }

  /* ---- Render ---- */

  const choosing = !isResidence && !creating.id
  // An undo can take the entry out from under the form.
  const lost = !choosing && (ri < 0 || (!isResidence && ai < 0))

  return (
    <aside className="ve-drawer ad" data-editor-ui aria-label="Ajouter">
      <div className="ve-drawer-head">
        <div>
          <span className="ve-drawer-kicker">
            {isResidence ? 'Nouvelle résidence' : 'Nouvel appartement'}
          </span>
          <h2 className="ve-drawer-title">
            {choosing
              ? 'Dans quelle résidence ?'
              : isResidence
                ? values.name?.trim() || 'Nouvelle résidence'
                : `${values.type?.trim() || 'Appartement'} · ${residence?.name ?? ''}`}
          </h2>
        </div>
        <button type="button" className="ve-x" onClick={cancel} aria-label="Annuler l’ajout">
          ×
        </button>
      </div>

      {lost && (
        <p className="ve-create-note">
          L’ajout a été annulé.{' '}
          <button type="button" className="ve-chip" onClick={() => setCreating(null)}>
            Fermer
          </button>
        </p>
      )}

      {choosing && (
        <ul className="ve-create-choices">
          {content.residences.map((r, i) => (
            <li key={r.slug}>
              <button type="button" onClick={() => pickResidence(r, i)}>
                <img src={normalizeImage(r.image).src} alt="" />
                <span>
                  <strong>{r.name}</strong>
                  <small>
                    {r.apartments.length} appartement{r.apartments.length > 1 ? 's' : ''}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!choosing && !lost && (
        <>
          <p className="ve-create-note">
            La page derrière montre {isResidence ? 'la résidence' : 'l’appartement'} au fur et à
            mesure. Les champs marqués * sont obligatoires, les autres sont facultatifs.
          </p>

          {fields.map(([key, label, required, kind, example]) => (
            <label className="ad-field" key={key}>
              <span className="ad-field-label">
                {label}
                {required ? ' *' : <span className="ve-optional"> (facultatif)</span>}
              </span>
              {kind === 'textarea' ? (
                <textarea
                  rows={key === 'features' ? 4 : 3}
                  value={values[key] ?? ''}
                  placeholder={example}
                  onChange={(e) => change(key, e.target.value)}
                />
              ) : kind === 'select' ? (
                <select value={values[key]} onChange={(e) => change(key, e.target.value)}>
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={kind}
                  min={kind === 'number' ? 1 : undefined}
                  value={values[key] ?? ''}
                  placeholder={example}
                  onChange={(e) => change(key, e.target.value)}
                />
              )}
            </label>
          ))}

          <PhotosField
            main={main}
            extras={extras}
            withRooms={!isResidence}
            onMain={(next) => {
              setMain(next)
              writePhotos(next, extras)
            }}
            onExtras={(next) => {
              setExtras(next)
              writePhotos(main, next)
            }}
          />

          <div className="ve-create-foot">
            {missing.length > 0 && (
              <p className="ve-create-missing">À remplir : {missing.join(', ')}</p>
            )}
            <div className="ve-create-buttons">
              <button type="button" className="ve-chip" onClick={cancel}>
                Annuler
              </button>
              <button
                type="button"
                className="ve-save"
                disabled={missing.length > 0}
                onClick={finish}
              >
                {isResidence ? 'Ajouter la résidence' : 'Ajouter l’appartement'}
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

export default CreatePanel
