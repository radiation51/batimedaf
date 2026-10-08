import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, Routes } from 'react-router-dom'
import { ArrowClockwise, ArrowCounterClockwise, Trash } from '@phosphor-icons/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { siteRoutes } from '../siteRoutes'
import { DraftContentProvider, useContent } from '../content/ContentContext'
import { FixedLanguage } from '../i18n/LanguageContext'
import { EditModeProvider, parsePath, valueAt } from '../content/editable'
import { hasImageShape, newImage, normalizeImage } from '../lib/imageStyle'
import { storeImage } from '../lib/storage'
import ImageField from './ImageField'
import './VisualEditor.css'

/**
 * The admin's "Modification" page: the real site, rendered from a draft of
 * the content, where clicking a text or a picture edits it in place. Nothing
 * is published until "Enregistrer".
 *
 * Pages tag what they display with `data-edit` (see content/editable.js);
 * this file only finds the tag under the pointer and edits that path.
 */

/* The editor's own chrome: clicks there are never taken for clicks on the page. */
const UI = '[data-editor-ui]'

/* Where the admin mounts this page; the preview's routes match below it. */
const BASE = '/admin/modification'

/* Lists whose items are not added, moved or deleted from a text: the
   residences, and the apartments, which have their own toolbar buttons. */
const FIXED_LISTS = new Set(['residences', 'apartments'])

/* Lists of photos: the image panel lists them so photos can be added,
   reordered and removed. */
const PHOTO_LISTS = new Set(['images', 'gallery'])

/* Photo details that the page does not always show, edited next to the photo. */
const PHOTO_DETAILS = [
  ['caption', 'Légende'],
  ['alt', 'Description de la photo'],
  ['category', 'Pièce (filtre des photos)'],
]

const LABELS = {
  title: 'Titre',
  image: 'Image',
  images: 'Photo',
  gallery: 'Photo',
  titleLines: 'Ligne du titre',
  description: 'Description',
  text: 'Texte',
  logo: 'Logo',
  primaryCta: 'Bouton principal',
  secondaryCta: 'Bouton secondaire',
  eyebrow: 'Sur-titre',
  kicker: 'Sur-titre',
  sub: 'Sous-titre',
  caption: 'Légende',
  alt: 'Description de la photo',
  phone: 'Téléphone',
  email: 'E-mail',
  address: 'Adresse',
  hours: 'Horaires',
  value: 'Chiffre',
  label: 'Libellé',
  headline: 'Accroche',
  tagline: 'Accroche',
  name: 'Nom',
  location: 'Localisation',
  meta: 'Étiquette',
  features: 'Prestation',
  criteria: 'Critère',
  nearby: 'À proximité',
  subjects: 'Sujets du formulaire',
  type: 'Typologie',
  surface: 'Surface (m²)',
  floor: 'Étage',
  orientation: 'Orientation',
  outdoor: 'Extérieur',
  presentation: 'Présentation',
  summary: 'Résumé',
  line: 'Mode de transport',
  detail: 'Détail',
  ctaTitle: 'Titre du bloc final',
  ctaLabel: 'Bouton du bloc final',
  commitmentsTitle: 'Titre des engagements',
  stepsTitle: 'Titre des étapes',
  faqTitle: 'Titre de la FAQ',
  figureValue: 'Chiffre',
  figureLabel: 'Légende du chiffre',
  faq: 'Question',
  slides: 'Diapositive',
  principles: 'Principe',
  commitments: 'Engagement',
  steps: 'Étape',
  profiles: 'Profil',
  figures: 'Chiffre clé',
  transports: 'Transport',
}

const HINTS = {
  line: 'Bus, Tramway, Métro ou Voiture — ou une ligne : « Ligne 9 », « RER C ».',
  detail: 'Le tiret « — » sépare le lieu du temps de trajet.',
  nearby: 'Le tiret « — » sépare le lieu de la distance.',
  subjects: 'Un sujet par ligne.',
}

const lastKey = (path) => path.findLast((part) => typeof part === 'string')

function labelFor(path) {
  const last = path[path.length - 1]
  if (typeof last === 'number') {
    return `${LABELS[lastKey(path)] ?? 'Élément'} ${last + 1}`
  }
  return LABELS[last] ?? last
}

const keyOf = (path) => path.join('.')

/**
 * The list an edited path belongs to: the innermost array on the path,
 * unless it is one of FIXED_LISTS. `rest` is the path inside the item.
 */
function listContext(content, path) {
  for (let k = path.length - 1; k >= 0; k--) {
    if (typeof path[k] !== 'number') continue
    const listPath = path.slice(0, k)
    if (FIXED_LISTS.has(listPath[listPath.length - 1])) return null
    return {
      listPath,
      index: path[k],
      rest: path.slice(k + 1),
      length: valueAt(content, listPath).length,
    }
  }
  return null
}

/** A copy of a list item, safe to insert next to the original. */
function copyOf(item) {
  const copy = structuredClone(item)
  // An id names a tab or a link: two items must never share one.
  if (copy && typeof copy.id === 'string') {
    copy.id = `${copy.id}-${Date.now().toString(36)}`
  }
  return copy
}

/**
 * What the delete button does to the selected path: remove the list item it
 * belongs to (a feature, a FAQ question, a photo…) or, for a lone text,
 * empty it. Photo captions and descriptions are only emptied: removing them
 * should not take the photo along. Null when there is nothing to delete.
 */
function deletionFor(content, path) {
  const value = valueAt(content, path)
  const list = listContext(content, path)
  const isDetail = PHOTO_DETAILS.some(([key]) => key === path[path.length - 1])

  if (list && !isDetail && list.length > 1) {
    return {
      label: `Supprimer : ${labelFor([...list.listPath, list.index])}`,
      run: ({ removeItem }) => removeItem(list.listPath, list.index),
    }
  }
  if (typeof value === 'string' && value) {
    return { label: 'Effacer ce texte', run: ({ setPath }) => setPath(path, '') }
  }
  if (typeof value === 'number' && value) {
    return { label: 'Effacer ce chiffre', run: ({ setPath }) => setPath(path, 0) }
  }
  return null
}

/* ---------------- Preview pages ---------------- */

function pageExists(content, pathname) {
  const [section, slug, apartmentId] = pathname.split('/').filter(Boolean)
  if (section !== 'residence' || !slug) return true
  const residence = content.residences.find((r) => r.slug === slug)
  if (!residence) return false
  return !apartmentId || residence.apartments.some((a) => a.id === apartmentId)
}

/** Where to go when the page shown stops existing (an apartment deleted). */
function fallbackFor(content, pathname) {
  const slug = pathname.split('/').filter(Boolean)[1]
  return content.residences.some((r) => r.slug === slug)
    ? { pathname: `/residence/${slug}`, search: '' }
    : { pathname: '/', search: '' }
}

function pageGroups(content) {
  return [
    {
      label: 'Pages',
      pages: [
        ['/', 'Accueil'],
        ['/residence', 'Résidences'],
        ['/about', 'À propos'],
        ['/collaboration', 'Collaboration'],
        ['/contact', 'Contact'],
      ],
    },
    ...content.residences.map((r) => ({
      label: r.name,
      pages: [
        [`/residence/${r.slug}`, `${r.name} — la résidence`],
        ...r.apartments.map((a) => [
          `/residence/${r.slug}/${a.id}`,
          `Appartement ${a.type} · ${a.reference}`,
        ]),
      ],
    })),
  ]
}

/* ---------------- Finding what is under the pointer ---------------- */

function isShown(el) {
  const style = getComputedStyle(el)
  return style.visibility !== 'hidden' && Number(style.opacity) > 0.1
}

const INTERACTIVE =
  'a[href], button, input, select, textarea, label, [role="tab"], [role="button"]'

const hasOwnText = (el) =>
  [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())

/**
 * The tagged element under a point. Looks through decorative layers (a
 * hero photo sits under a darkening veil) but stops at anything else the
 * visitor would click or read, such as a link or a fixed label, and stays
 * within the section under the pointer: the home hero is fixed behind every
 * later section, and must not answer clicks aimed at them.
 */
function editTargetAt(x, y) {
  const stack = document.elementsFromPoint(x, y)
  if (!stack.length || stack[0].closest(UI)) return null

  const section = stack[0].closest('[data-nav-tone]')
  for (const el of stack) {
    if (section ? !section.contains(el) : el !== stack[0]) break
    const hit = el.closest('[data-edit]')
    // Skips the hidden slides of a carousel, stacked under the visible one.
    if (hit && isShown(hit)) return hit
    if (el.matches(INTERACTIVE) || hasOwnText(el)) return null
  }
  return null
}

/** The element showing `key` now: `el` if it still does, else a fresh lookup. */
function resolve(el, key) {
  if (el?.isConnected && (!key || el.getAttribute('data-edit') === key)) {
    return el
  }
  return key ? document.querySelector(`[data-edit="${CSS.escape(key)}"]`) : null
}

/** Calls `place(rect)` every frame with where the element is on screen. */
function useFollow(el, key, place) {
  const placeRef = useRef(place)
  useLayoutEffect(() => {
    placeRef.current = place
  })

  useLayoutEffect(() => {
    let frame
    const tick = () => {
      const target = resolve(el, key)
      placeRef.current(target ? target.getBoundingClientRect() : null)
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [el, key])
}

function Outline({ el, editKey, variant, tag }) {
  const ref = useRef(null)

  useFollow(el, editKey, (rect) => {
    const node = ref.current
    if (!node) return
    if (!rect || (!rect.width && !rect.height)) {
      node.style.opacity = '0'
      return
    }
    node.style.opacity = '1'
    node.style.transform = `translate(${rect.left - 4}px, ${rect.top - 4}px)`
    node.style.width = `${rect.width + 8}px`
    node.style.height = `${rect.height + 8}px`
  })

  return (
    <div ref={ref} className={`ve-outline ve-outline--${variant}`} aria-hidden="true">
      {tag && <span className="ve-outline-tag">{tag}</span>}
    </div>
  )
}

/* ---------------- Text editor (popover) ---------------- */

const GAP = 10
// Room kept free above the bottom toolbar.
const TOOLBAR_ROOM = 88

function placePopover(node, rect) {
  if (!node) return
  if (!rect) {
    node.style.visibility = 'hidden'
    return
  }
  const { offsetWidth: w, offsetHeight: h } = node
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight

  let top = rect.bottom + GAP
  if (top + h > vh - TOOLBAR_ROOM && rect.top - GAP - h > GAP) {
    top = rect.top - GAP - h
  }
  top = Math.max(GAP, Math.min(top, vh - h - GAP))
  const left = Math.max(GAP, Math.min(rect.left, vw - w - GAP))

  node.style.visibility = 'visible'
  node.style.transform = `translate(${left}px, ${top}px)`
}

function TextEditor({ selection, onClose, onDone, onSelect }) {
  const { content, setPath, insertItem, removeItem, moveItem } = useContent()
  const path = useMemo(() => parsePath(selection.key), [selection.key])
  const value = valueAt(content, path)
  const popRef = useRef(null)
  const fieldRef = useRef(null)

  useFollow(selection.el, selection.key, (rect) =>
    placePopover(popRef.current, rect),
  )

  // Not autoFocus: that runs before the popover is placed and made visible,
  // and a hidden field cannot take focus.
  useLayoutEffect(() => {
    fieldRef.current?.focus()
  }, [])

  const isNumber = typeof value === 'number'
  const isLines = Array.isArray(value)

  // Grow the textarea with its text instead of scrolling inside it.
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field || isNumber) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight + 2}px`
  }, [value, isNumber])

  const close = () => {
    // Blank lines left in a one-per-line list would show as empty entries.
    if (isLines && value.some((line) => !line.trim())) {
      setPath(path, value.filter((line) => line.trim()))
    }
    onClose()
  }

  // "Terminé" closes and saves; × and Échap only close.
  const done = () => {
    close()
    onDone()
  }

  const list = listContext(content, path)
  const itemKey = (index) => keyOf([...list.listPath, index, ...list.rest])

  const field = isNumber ? (
    <input
      ref={fieldRef}
      className="ve-pop-input"
      type="number"
      value={value}
      onChange={(e) =>
        setPath(path, e.target.value === '' ? 0 : Number(e.target.value))
      }
    />
  ) : (
    <textarea
      ref={fieldRef}
      className="ve-pop-input"
      rows={1}
      value={isLines ? value.join('\n') : value}
      onFocus={(e) => {
        const end = e.target.value.length
        e.target.setSelectionRange(end, end)
      }}
      onChange={(e) =>
        setPath(path, isLines ? e.target.value.split('\n') : e.target.value)
      }
    />
  )

  return (
    <div
      ref={popRef}
      className="ve-pop"
      data-editor-ui
      role="dialog"
      aria-label={`Modifier : ${labelFor(path)}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          close()
        }
      }}
    >
      <div className="ve-pop-head">
        <span className="ve-pop-label">{labelFor(path)}</span>
        <button type="button" className="ve-x" onClick={close} aria-label="Fermer">
          ×
        </button>
      </div>

      {typeof value === 'string' || isNumber || isLines ? (
        field
      ) : (
        <p className="ve-pop-hint">Ce contenu ne se modifie pas ici.</p>
      )}

      {HINTS[lastKey(path)] && (
        <p className="ve-pop-hint">{HINTS[lastKey(path)]}</p>
      )}

      <div className="ve-pop-foot">
        {list && (
          <div className="ve-pop-items" role="group" aria-label="Élément de la liste">
            <button
              type="button"
              className="ve-chip"
              disabled={list.index === 0}
              onClick={() => {
                moveItem(list.listPath, list.index, -1)
                onSelect(itemKey(list.index - 1))
              }}
              title="Placer avant"
              aria-label="Placer avant"
            >
              ↑
            </button>
            <button
              type="button"
              className="ve-chip"
              disabled={list.index === list.length - 1}
              onClick={() => {
                moveItem(list.listPath, list.index, 1)
                onSelect(itemKey(list.index + 1))
              }}
              title="Placer après"
              aria-label="Placer après"
            >
              ↓
            </button>
            <button
              type="button"
              className="ve-chip"
              onClick={() => {
                const item = valueAt(content, [...list.listPath, list.index])
                insertItem(list.listPath, list.index + 1, copyOf(item))
                onSelect(itemKey(list.index + 1))
              }}
            >
              Dupliquer
            </button>
            <button
              type="button"
              className="ve-chip ve-chip--danger"
              disabled={list.length <= 1}
              onClick={() => {
                removeItem(list.listPath, list.index)
                onClose()
              }}
            >
              Supprimer
            </button>
          </div>
        )}
        <button
          type="button"
          className="ve-done"
          onClick={done}
          title="Fermer et enregistrer"
        >
          Terminé
        </button>
      </div>
    </div>
  )
}

/* ---------------- Image panel (drawer) ---------------- */

function setIn(target, path, value) {
  let node = target
  for (const key of path.slice(0, -1)) node = node[key]
  node[path[path.length - 1]] = value
}

function ImagePanel({ selection, onClose, onDone, onSelect }) {
  const { content, setPath, insertItem, removeItem, moveItem } = useContent()
  const path = parsePath(selection.key)
  const value = valueAt(content, path)
  const fileRef = useRef(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  const context = listContext(content, path)
  const list =
    context && PHOTO_LISTS.has(lastKey(context.listPath)) ? context : null
  const items = list ? valueAt(content, list.listPath) : []
  const item = list ? items[list.index] : null
  const itemPath = list ? [...list.listPath, list.index] : null
  const imageOf = (entry) =>
    normalizeImage(list.rest.length ? valueAt(entry, list.rest) : entry)
  const keyAt = (index) => keyOf([...list.listPath, index, ...list.rest])

  const details =
    item && !hasImageShape(item)
      ? PHOTO_DETAILS.filter(([key]) => typeof item[key] === 'string')
      : []

  const addPhoto = async (file) => {
    if (!file) return
    setAdding(true)
    setAddError('')
    try {
      const stored = await storeImage(file)
      let entry = newImage(stored.src)
      if (list.rest.length) {
        // Same shape as its neighbours, with this picture and blank texts.
        entry = copyOf(item)
        setIn(entry, list.rest, newImage(stored.src))
        for (const [key] of PHOTO_DETAILS) {
          if (key !== 'category' && typeof entry[key] === 'string') entry[key] = ''
        }
      }
      insertItem(list.listPath, list.index + 1, entry)
      onSelect(keyAt(list.index + 1))
      if (stored.error) setAddError(stored.error)
    } catch (e) {
      setAddError(e.message)
    } finally {
      setAdding(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <aside className="ve-drawer ad" data-editor-ui aria-label="Modifier l’image">
      <div className="ve-drawer-head">
        <div>
          <span className="ve-drawer-kicker">
            {list ? `Photo ${list.index + 1} sur ${list.length}` : 'Image'}
          </span>
          <h2 className="ve-drawer-title">{labelFor(path)}</h2>
        </div>
        <div className="ve-drawer-actions">
          <button
            type="button"
            className="ve-done"
            onClick={() => {
              onClose()
              onDone()
            }}
            title="Fermer et enregistrer"
          >
            Terminé
          </button>
          <button type="button" className="ve-x" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
      </div>

      {hasImageShape(value) && (
        <ImageField
          key={selection.key}
          label="Photo"
          value={value}
          onChange={(next) => setPath(path, next)}
        />
      )}

      {details.map(([key, label]) => (
        <label className="ad-field" key={key}>
          <span className="ad-field-label">{label}</span>
          <input
            type="text"
            value={item[key]}
            onChange={(e) => setPath([...itemPath, key], e.target.value)}
          />
        </label>
      ))}

      {list && (
        <section className="ve-photos">
          <div className="ve-photos-head">
            <span className="ad-field-label">Toutes les photos de cette série</span>
            <div className="ve-photos-actions">
              <button
                type="button"
                className="ve-chip"
                disabled={list.index === 0}
                onClick={() => {
                  moveItem(list.listPath, list.index, -1)
                  onSelect(keyAt(list.index - 1))
                }}
                title="Placer avant"
                aria-label="Placer avant"
              >
                ←
              </button>
              <button
                type="button"
                className="ve-chip"
                disabled={list.index === list.length - 1}
                onClick={() => {
                  moveItem(list.listPath, list.index, 1)
                  onSelect(keyAt(list.index + 1))
                }}
                title="Placer après"
                aria-label="Placer après"
              >
                →
              </button>
              <button
                type="button"
                className="ve-chip ve-chip--danger"
                disabled={list.length <= 1}
                onClick={() => {
                  removeItem(list.listPath, list.index)
                  onSelect(keyAt(Math.min(list.index, list.length - 2)))
                }}
              >
                Retirer
              </button>
            </div>
          </div>

          <ul className="ve-photo-grid">
            {items.map((entry, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`ve-photo${i === list.index ? ' is-active' : ''}`}
                  onClick={() => onSelect(keyAt(i))}
                  aria-label={`Photo ${i + 1}`}
                  aria-pressed={i === list.index}
                >
                  <img src={imageOf(entry).src} alt="" />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="ve-photo ve-photo--add"
                onClick={() => fileRef.current?.click()}
                disabled={adding}
              >
                {adding ? '…' : '+ Ajouter'}
              </button>
            </li>
          </ul>
          {addError && <p className="ad-image-error">{addError}</p>}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => addPhoto(e.target.files?.[0])}
          />
        </section>
      )}
    </aside>
  )
}

/* ---------------- Toolbar ---------------- */

function Toolbar({
  page,
  onPage,
  mode,
  onMode,
  onClearSelection,
  onSignOut,
  shifted,
  hasSelection,
  deletion,
  onDelete,
  onSave,
  justSaved,
}) {
  const {
    content,
    dirty,
    discard,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
    saveState,
    storageError,
    isSupabaseConfigured,
    status,
    addApartment,
    removeApartment,
  } = useContent()
  const [menuOpen, setMenuOpen] = useState(false)

  const groups = useMemo(() => pageGroups(content), [content])
  const known = groups.some((g) => g.pages.some(([p]) => p === page.pathname))
  const [section, slug, apartmentId] = page.pathname.split('/').filter(Boolean)
  const onResidence = section === 'residence' && slug && !apartmentId
  const onApartment = section === 'residence' && apartmentId

  let statusText
  let tone = 'idle'
  if (dirty) {
    statusText = 'Modifications non enregistrées'
    tone = 'dirty'
  } else if (saveState === 'saving') {
    statusText = 'Enregistrement…'
    tone = 'saving'
  } else if (saveState === 'error') {
    statusText = 'Échec de l’enregistrement'
    tone = 'error'
  } else if (saveState === 'saved' || justSaved) {
    statusText = 'Enregistré'
    tone = 'saved'
  } else {
    statusText = 'Cliquez sur un texte ou une image'
  }

  return (
    <div className={`ve-bar${shifted ? ' is-shifted' : ''}`} data-editor-ui>
      <Link
        to="/admin"
        className="ve-bar-back"
        onClick={(e) => {
          if (
            dirty &&
            !window.confirm(
              'Des modifications ne sont pas enregistrées. Revenir aux demandes quand même ?',
            )
          ) {
            e.preventDefault()
          }
        }}
        title="Revenir aux demandes"
      >
        ← Demandes
      </Link>
      <span className="ve-bar-brand">Modification</span>

      <label className="ve-bar-page">
        <span className="ve-sr">Page affichée</span>
        <select
          value={known ? page.pathname : ''}
          onChange={(e) => onPage(e.target.value)}
        >
          {!known && (
            <option value="" disabled>
              Autre page
            </option>
          )}
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.pages.map(([path, label]) => (
                <option key={path} value={path}>
                  {label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="ve-seg" role="group" aria-label="Mode">
        <button
          type="button"
          className={mode === 'edit' ? 'is-on' : ''}
          aria-pressed={mode === 'edit'}
          onClick={() => onMode('edit')}
          title="Cliquer sur un texte ou une image pour le modifier"
        >
          Modifier
        </button>
        <button
          type="button"
          className={mode === 'browse' ? 'is-on' : ''}
          aria-pressed={mode === 'browse'}
          onClick={() => onMode('browse')}
          title="Utiliser le site normalement : liens, onglets, questions…"
        >
          Naviguer
        </button>
      </div>

      <div className="ve-tools" role="group" aria-label="Historique et suppression">
        <button
          type="button"
          className="ve-tool"
          disabled={!canUndo}
          onClick={undo}
          title="Annuler la dernière modification (Ctrl + Z)"
          aria-label="Annuler la dernière modification"
        >
          <ArrowCounterClockwise size={17} weight="bold" />
        </button>
        <button
          type="button"
          className="ve-tool"
          disabled={!canRedo}
          onClick={redo}
          title="Rétablir (Ctrl + Y)"
          aria-label="Rétablir"
        >
          <ArrowClockwise size={17} weight="bold" />
        </button>
        <button
          type="button"
          className="ve-tool ve-tool--danger"
          disabled={!deletion}
          onClick={onDelete}
          title={
            deletion
              ? `${deletion.label} (Suppr)`
              : hasSelection
                ? 'Cet élément ne se supprime pas : modifiez-le ou remplacez-le'
                : 'Sélectionnez un texte ou une image à supprimer'
          }
          aria-label={deletion ? deletion.label : 'Supprimer la sélection'}
        >
          <Trash size={17} weight="bold" />
        </button>
      </div>

      {onResidence && (
        <button
          type="button"
          className="ve-bar-btn"
          onClick={() => onPage(`/residence/${slug}/${addApartment(slug)}`)}
        >
          + Appartement
        </button>
      )}
      {onApartment && (
        <button
          type="button"
          className="ve-bar-btn ve-bar-btn--danger"
          onClick={() => {
            if (window.confirm('Supprimer cet appartement ?')) {
              onPage(`/residence/${slug}`)
              removeApartment(slug, apartmentId)
            }
          }}
        >
          Supprimer l’appartement
        </button>
      )}

      <span className={`ve-status ve-status--${tone}`} role="status">
        {statusText}
      </span>

      {dirty && (
        <button
          type="button"
          className="ve-bar-btn"
          onClick={() => {
            if (window.confirm('Annuler toutes les modifications non enregistrées ?')) {
              onClearSelection()
              discard()
            }
          }}
          title="Revenir à la dernière version enregistrée"
        >
          Tout annuler
        </button>
      )}
      <button
        type="button"
        className="ve-save"
        disabled={!dirty}
        onClick={onSave}
        title="Ctrl + S"
      >
        Enregistrer
      </button>

      <div className="ve-more">
        <button
          type="button"
          className="ve-bar-btn ve-more-btn"
          aria-expanded={menuOpen}
          aria-label="Plus d’options"
          onClick={() => setMenuOpen((open) => !open)}
        >
          •••
        </button>
        {menuOpen && (
          <div className="ve-menu" onClick={() => setMenuOpen(false)}>
            <p className="ve-menu-note">
              {isSupabaseConfigured
                ? status === 'remote'
                  ? 'En ligne : Supabase connecté'
                  : 'Supabase indisponible'
                : 'Mode local : les modifications restent sur cet appareil'}
            </p>
            <a href="/" target="_blank" rel="noreferrer">
              Voir le site publié ↗
            </a>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Remettre tout le contenu du site tel qu’il était à l’origine ? Rien ne change en ligne tant que vous n’avez pas cliqué sur Enregistrer.',
                  )
                ) {
                  onClearSelection()
                  reset()
                }
              }}
            >
              Revenir au contenu d’origine
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  !dirty ||
                  window.confirm(
                    'Des modifications ne sont pas enregistrées. Se déconnecter quand même ?',
                  )
                ) {
                  onSignOut()
                }
              }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      {storageError && (
        <p className="ve-bar-warning">
          Stockage local saturé : les dernières modifications ne sont pas
          conservées. Retirez ou allégez une image.
        </p>
      )}
    </div>
  )
}

/* ---------------- Editor ---------------- */

function Editor({ onSignOut }) {
  const store = useContent()
  const { content, dirty, save, undo, redo } = store
  const [page, setPage] = useState({ pathname: '/', search: '' })
  const [mode, setMode] = useState('edit')
  const [selected, setSelected] = useState(null) // { key, el }
  const [hovered, setHovered] = useState(null)

  // A page whose apartment was just deleted (or discarded) must not render:
  // the detail pages redirect when their data is missing, which would take
  // the whole admin with them.
  if (!pageExists(content, page.pathname)) {
    setPage(fallbackFor(content, page.pathname))
  }

  // Without Supabase there is no save round-trip to report: confirm briefly.
  const [justSaved, setJustSaved] = useState(false)
  const [saveRequest, setSaveRequest] = useState(0)
  const handledSave = useRef(0)
  const requestSave = useCallback(() => setSaveRequest((n) => n + 1), [])

  // Saving runs after the render that applies the edits made along with the
  // request (blank lines a list drops on "Terminé"), so they are stored too.
  useEffect(() => {
    if (saveRequest === handledSave.current) return
    handledSave.current = saveRequest
    if (dirty) {
      save()
      setJustSaved(true)
    }
  }, [saveRequest, dirty, save])

  useEffect(() => {
    if (!justSaved) return
    const timer = setTimeout(() => setJustSaved(false), 2500)
    return () => clearTimeout(timer)
  }, [justSaved])

  const goTo = useCallback((pathname, search = '') => {
    setSelected(null)
    setHovered(null)
    setPage({ pathname, search })
  }, [])

  const selectedValue = selected
    ? valueAt(content, parsePath(selected.key))
    : undefined
  // A deleted item, or one undone: nothing left to edit.
  const selection = selectedValue === undefined ? null : selected
  const selectedIsImage = selection && hasImageShape(selectedValue)

  const deletion = selection ? deletionFor(content, parsePath(selection.key)) : null
  const deleteSelected = () => {
    if (!deletion) return
    deletion.run(store)
    setSelected(null)
  }

  // Read by the document listeners, which are bound once.
  const live = useRef({})
  useLayoutEffect(() => {
    live.current = { mode, content, requestSave, goTo, undo, redo, deleteSelected }
  })

  /* Classes for the editor's styles: see VisualEditor.css. */
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('ve-editing')
    return () => root.classList.remove('ve-editing', 've-edit-mode')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('ve-edit-mode', mode === 'edit')
  }, [mode])

  useEffect(() => {
    window.scrollTo(0, 0)
    // The navbar re-reads the section behind it on this event.
    window.dispatchEvent(new CustomEvent('page:swapped'))
  }, [page])

  /* Everything shows at once: the scroll-reveal animations would hide
     whatever has not been scrolled past yet, including a just-added item. */
  useEffect(() => {
    let frame = 0
    const revealAll = () => {
      frame = 0
      document
        .querySelectorAll('[data-reveal]:not(.is-visible)')
        .forEach((el) => el.classList.add('is-visible'))
    }
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(revealAll)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    revealAll()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  /* Pointer and keyboard. Bound on the document, in the capture phase, so
     the editor decides before the page's own handlers run. */
  useEffect(() => {
    let frame = 0
    let pointer = null

    const track = () => {
      frame = 0
      const editing = live.current.mode === 'edit'
      setHovered(editing && pointer ? editTargetAt(pointer.x, pointer.y) : null)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(track)
    }
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }

    const onMouseDown = (e) => {
      if (live.current.mode !== 'edit' || e.target.closest?.(UI)) return
      // No text selection, focus or native dropdown on what is about to be edited.
      if (editTargetAt(e.clientX, e.clientY)) e.preventDefault()
    }

    const onClick = (e) => {
      const target = e.target
      if (!(target instanceof Element) || target.closest(UI)) return
      const link = target.closest('a[href]')
      // detail 0: a click from the keyboard, with no pointer position.
      const hit =
        live.current.mode === 'edit' && e.detail > 0
          ? editTargetAt(e.clientX, e.clientY)
          : null

      if (hit) {
        const key = hit.getAttribute('data-edit')
        const isImage = hasImageShape(valueAt(live.current.content, parsePath(key)))
        // Text inside a button (a tab, a FAQ question) still lets the button
        // react: the tab opens while its label is being edited.
        if (link || isImage || !hit.closest('button')) {
          e.preventDefault()
          e.stopPropagation()
        }
        setSelected({ key, el: hit })
        return
      }

      if (link) {
        // Links move the preview, never the admin. The page's own handlers
        // still run (a menu closes), but the link itself goes nowhere.
        e.preventDefault()
        const url = new URL(link.href)
        if (url.origin === window.location.origin) {
          live.current.goTo(url.pathname, url.search)
        }
        return
      }

      if (live.current.mode === 'edit') setSelected(null)
    }

    // The contact and newsletter forms must not send anything from here.
    const onSubmit = (e) => {
      if (e.target.closest?.(UI)) return
      e.preventDefault()
      e.stopPropagation()
    }

    const onKey = (e) => {
      const key = e.key.toLowerCase()
      const command = e.ctrlKey || e.metaKey
      // In a text field, Suppr deletes characters, not the selection.
      const typing = e.target.closest?.('input, textarea, select, [contenteditable]')

      if (command && key === 's') {
        e.preventDefault()
        live.current.requestSave()
      } else if (command && key === 'z' && !e.shiftKey) {
        e.preventDefault()
        live.current.undo()
      } else if (command && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault()
        live.current.redo()
      } else if (key === 'delete' && !typing) {
        e.preventDefault()
        live.current.deleteSelected()
      } else if (e.key === 'Escape') {
        setSelected(null)
      }
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Closing the tab with unsaved work asks first.
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const location = useMemo(
    () => ({
      pathname: page.pathname === '/' ? BASE : BASE + page.pathname,
      search: page.search,
      hash: '',
      state: null,
      key: 'preview',
    }),
    [page],
  )

  const hoverKey = hovered?.getAttribute('data-edit')
  const hoverIsImage =
    hoverKey && hasImageShape(valueAt(content, parsePath(hoverKey)))

  // The residences chooser is a full-screen page with no bar or footer.
  const bare = page.pathname === '/residence'
  const select = (key) => setSelected({ key, el: null })

  return (
    <>
      <EditModeProvider value={mode === 'edit'}>
        {!bare && <Navbar />}
        <Routes location={location}>{siteRoutes}</Routes>
        {!bare && <Footer />}
      </EditModeProvider>

      {mode === 'edit' && hovered && hoverKey !== selection?.key && (
        <Outline
          el={hovered}
          variant="hover"
          tag={hoverIsImage ? 'Changer l’image' : 'Modifier le texte'}
        />
      )}

      {selection && (
        <Outline el={selection.el} editKey={selection.key} variant="selected" />
      )}

      {selection && !selectedIsImage && (
        <TextEditor
          key={selection.key}
          selection={selection}
          onClose={() => setSelected(null)}
          onDone={requestSave}
          onSelect={select}
        />
      )}

      {selection && selectedIsImage && (
        <ImagePanel
          selection={selection}
          onClose={() => setSelected(null)}
          onDone={requestSave}
          onSelect={select}
        />
      )}

      <Toolbar
        page={page}
        onPage={(path) => goTo(path)}
        mode={mode}
        onMode={(next) => {
          setMode(next)
          setSelected(null)
          setHovered(null)
        }}
        onClearSelection={() => setSelected(null)}
        onSignOut={onSignOut}
        shifted={Boolean(selectedIsImage)}
        hasSelection={Boolean(selection)}
        deletion={deletion}
        onDelete={deleteSelected}
        onSave={requestSave}
        justSaved={justSaved}
      />
    </>
  )
}

function VisualEditor({ onSignOut }) {
  return (
    <DraftContentProvider>
      <FixedLanguage lang="fr">
        <Editor onSignOut={onSignOut} />
      </FixedLanguage>
    </DraftContentProvider>
  )
}

export default VisualEditor
