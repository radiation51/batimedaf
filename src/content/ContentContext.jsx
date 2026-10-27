import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DEFAULT_CONTENT } from './defaults'
import {
  getSupabase,
  readPublicRow,
  isSupabaseConfigured,
  CONTENT_TABLE,
  CONTENT_ROW_ID,
} from '../lib/supabase'

const STORAGE_KEY = 'batimedaf:content'
const SAVE_DEBOUNCE_MS = 800

const ContentContext = createContext(null)

const isObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v)

/**
 * Saved content over the defaults, object by object at every depth: a
 * section or field added to the defaults later (home.apartments,
 * home.intro.words) still shows up under an older save, while everything the
 * save holds wins. Lists are taken whole from the save.
 */
function withDefaults(saved, defaults = DEFAULT_CONTENT) {
  const merged = { ...defaults, ...saved }
  for (const [key, value] of Object.entries(defaults)) {
    if (isObject(value) && isObject(saved[key])) {
      merged[key] = withDefaults(saved[key], value)
    }
  }
  return merged
}

/** Returns a copy of `root` with `path` set to `value`. */
function applyPath(root, path, value) {
  const clone = Array.isArray(root) ? [...root] : { ...root }
  let node = clone
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const child = node[key]
    node[key] = Array.isArray(child) ? [...child] : { ...child }
    node = node[key]
  }
  node[path[path.length - 1]] = value
  return clone
}

const listAt = (root, path) => path.reduce((acc, k) => acc[k], root)

/**
 * Every edit the admin can make, bound to the state that holds the tree:
 * the stored content, or the visual editor's unsaved draft.
 *
 * `update(change, key)` applies `change(prev)`; `key` names the field a
 * setPath touched, so the draft can fold a burst of typing into one undo step.
 */
function createMutations(update) {
  return {
    updateSection: (section, patch) =>
      update((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...patch },
      })),

    /**
     * Sets a value anywhere in the tree from a path such as
     * ['home', 'hero', 'title'] or ['about', 'milestones', 2, 'year'].
     */
    setPath: (path, value) =>
      update((prev) => applyPath(prev, path, value), path.join('.')),

    pushItem: (path, item) =>
      update((prev) => applyPath(prev, path, [...listAt(prev, path), item])),

    /** Inserts `item` so that it ends up at `index`. */
    insertItem: (path, index, item) =>
      update((prev) => {
        const next = [...listAt(prev, path)]
        next.splice(index, 0, item)
        return applyPath(prev, path, next)
      }),

    removeItem: (path, index) =>
      update((prev) =>
        applyPath(
          prev,
          path,
          listAt(prev, path).filter((_, i) => i !== index),
        ),
      ),

    /** Swaps the item at `index` with its neighbour at `index + delta`. */
    moveItem: (path, index, delta) =>
      update((prev) => {
        const list = listAt(prev, path)
        const target = index + delta
        if (target < 0 || target >= list.length) return prev
        const next = [...list]
        ;[next[index], next[target]] = [next[target], next[index]]
        return applyPath(prev, path, next)
      }),

    updateResidence: (slug, patch) =>
      update((prev) => ({
        ...prev,
        residences: prev.residences.map((r) =>
          r.slug === slug ? { ...r, ...patch } : r,
        ),
      })),

    updateApartment: (slug, id, patch) =>
      update((prev) => ({
        ...prev,
        residences: prev.residences.map((r) =>
          r.slug !== slug
            ? r
            : {
                ...r,
                apartments: r.apartments.map((a) =>
                  a.id === id ? { ...a, ...patch } : a,
                ),
              },
        ),
      })),

    addApartment: (slug) => {
      const id = `nouveau-${Date.now().toString(36)}`
      update((prev) => ({
        ...prev,
        residences: prev.residences.map((r) =>
          r.slug !== slug
            ? r
            : {
                ...r,
                apartments: [
                  ...r.apartments,
                  {
                    id,
                    reference: 'NOUVEAU',
                    type: '3 pièces',
                    surface: 70,
                    floor: '1ᵉʳ étage',
                    orientation: 'Sud',
                    outdoor: 'Balcon',
                    price: 500000,
                    status: 'Disponible',
                    image: r.image,
                    description: 'Description à compléter.',
                    features: ['Prestation à compléter'],
                  },
                ],
              },
        ),
      }))
      return id
    },

    removeApartment: (slug, id) =>
      update((prev) => ({
        ...prev,
        residences: prev.residences.map((r) =>
          r.slug !== slug
            ? r
            : { ...r, apartments: r.apartments.filter((a) => a.id !== id) },
        ),
      })),

    /**
     * A new residence named `name` at `/residence/<slug>`, with every section
     * of the page in place, stand-in texts and no apartment yet: the admin's
     * form fills it in. The first residence's cover stands in as its photo.
     */
    addResidence: (slug, name) =>
      update((prev) => {
        const model = prev.residences[0]
        const residence = {
          slug,
          name,
          tagline: 'Accroche à compléter',
          description: 'Description à compléter.',
          meta: ['Nombre de logements', 'Lieu à compléter', 'Livraison à venir'],
          image: model.image,
          location: 'Lieu à compléter',
          presentation: 'Présentation de la résidence à compléter.',
          intro: '',
          body: [],
          specs: [],
          features: ['Prestation à compléter'],
          stats: [],
          place: {
            address: 'Adresse à compléter',
            summary: 'Le quartier, en quelques mots.',
            transports: [{ line: 'Bus', detail: 'À compléter' }],
            nearby: ['Commerces & commodités — À proximité'],
          },
          apartments: [],
          gallery: [{ image: model.image, alt: '', category: 'Extérieur' }],
        }
        return { ...prev, residences: [...prev.residences, residence] }
      }),

    /** Removes a residence, and the home page's picks among its apartments. */
    removeResidence: (slug) =>
      update((prev) => ({
        ...prev,
        residences: prev.residences.filter((r) => r.slug !== slug),
        home: {
          ...prev.home,
          apartments: {
            ...prev.home.apartments,
            list: prev.home.apartments.list.filter((ref) => !ref.startsWith(`${slug}/`)),
          },
        },
      })),
  }
}

/** Local copy: the offline cache, and the whole store when Supabase is off. */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONTENT
    return withDefaults(JSON.parse(raw))
  } catch {
    return DEFAULT_CONTENT
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadLocal)
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState(
    isSupabaseConfigured ? 'loading' : 'local',
  )
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const [storageError, setStorageError] = useState(false)
  // Signing in is only for the admin: visitors never load the auth client.
  const [authWanted, setAuthWanted] = useState(() =>
    window.location.pathname.startsWith('/admin'),
  )

  // Skips the save that would otherwise fire from the initial server fetch.
  const hydratedRef = useRef(false)
  const saveTimer = useRef(null)

  /* ---------------- Auth ---------------- */

  useEffect(() => {
    if (!isSupabaseConfigured || !authWanted) return
    let cancelled = false
    let sub = null
    getSupabase().then((supabase) => {
      if (cancelled) return
      supabase.auth.getSession().then(({ data }) => {
        if (!cancelled) setSession(data.session)
      })
      sub = supabase.auth.onAuthStateChange((_e, s) => setSession(s)).data
    })
    return () => {
      cancelled = true
      sub?.subscription.unsubscribe()
    }
  }, [authWanted])

  /** Called by the admin pages: starts the sign-in session. */
  const requestAuth = useCallback(() => setAuthWanted(true), [])

  /* ---------------- Initial read ---------------- */

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    ;(async () => {
      // A plain request: reading needs no client library.
      let data = null
      let error = null
      try {
        data = await readPublicRow(CONTENT_TABLE, CONTENT_ROW_ID, 'data')
      } catch (e) {
        error = e
      }

      if (cancelled) return

      if (error) {
        // Unreachable or table missing: fall back to the local copy rather
        // than showing an empty site.
        console.warn('[content] lecture Supabase impossible :', error.message)
        setStatus('error')
        hydratedRef.current = true
        return
      }

      if (data?.data) {
        // Merge so content added to the defaults later still shows up.
        setContent(withDefaults(data.data))
      }
      setStatus('remote')
      hydratedRef.current = true
    })()

    return () => {
      cancelled = true
    }
  }, [])

  /* ---------------- Persist ---------------- */

  // Always keep a local copy: offline cache, and the only store without Supabase.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
      setStorageError(false)
    } catch {
      // Quota exceeded, usually a large uploaded image. Surfaced in the admin
      // panel: silently dropping the save would look like the edit worked.
      setStorageError(true)
    }
  }, [content])

  // Push to Supabase, debounced so typing doesn't hammer the database.
  useEffect(() => {
    if (!isSupabaseConfigured || !session) return
    if (!hydratedRef.current) return

    clearTimeout(saveTimer.current)
    setSaveState('saving')

    saveTimer.current = setTimeout(async () => {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from(CONTENT_TABLE)
        .upsert({ id: CONTENT_ROW_ID, data: content, updated_at: new Date() })

      if (error) {
        console.warn('[content] écriture Supabase impossible :', error.message)
        setSaveState('error')
      } else {
        setSaveState('saved')
      }
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(saveTimer.current)
  }, [content, session])

  /* ---------------- Mutations ---------------- */

  const mutations = useMemo(
    () => createMutations((change) => setContent(change)),
    [],
  )

  const replaceAll = useCallback((next) => setContent(next), [])

  const reset = useCallback(() => {
    setContent(DEFAULT_CONTENT)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing to clear */
    }
  }, [])

  /* ---------------- Auth actions ---------------- */

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase n’est pas configuré.' }
    setAuthWanted(true)
    const supabase = await getSupabase()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = await getSupabase()
    if (supabase) await supabase.auth.signOut()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      content,
      status,
      saveState,
      storageError,
      session,
      isSupabaseConfigured,
      signIn,
      signOut,
      requestAuth,
      ...mutations,
      replaceAll,
      reset,
    }),
    [
      content,
      status,
      saveState,
      storageError,
      session,
      signIn,
      signOut,
      requestAuth,
      mutations,
      replaceAll,
      reset,
    ],
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

/* Undo steps kept by the visual editor. */
const HISTORY_LIMIT = 100
/* Edits of one field closer together than this (typing, dragging a crop)
   make a single undo step. */
const MERGE_MS = 1000

/**
 * Wraps the admin's visual editor: everything inside reads and edits a draft
 * copy of the content, and nothing reaches the site (or Supabase) until
 * `save()` hands the draft to the real store. Every edit can be undone and
 * redone.
 */
export function DraftContentProvider({ children }) {
  const stored = useContext(ContentContext)
  // Whole drafts, before and after the current one. The tree is copied on
  // write, so a snapshot shares every branch an edit did not touch.
  // `last` is the field and time of the latest edit, to merge a burst.
  const [history, setHistory] = useState(() => ({
    draft: stored.content,
    past: [],
    future: [],
    last: null,
  }))
  // The stored content the draft started from: an edit makes them differ.
  const [base, setBase] = useState(stored.content)
  const { draft } = history
  const dirty = draft !== base

  // While nothing is pending, follow the store, e.g. the Supabase read
  // finishing after the editor opened on the local copy.
  if (!dirty && stored.content !== base) {
    setBase(stored.content)
    setHistory({ draft: stored.content, past: [], future: [], last: null })
  }

  /** Applies a change as a new undo step, or extends the step in progress
      when the same field was edited a moment ago. */
  const edit = useCallback((change, key = null) => {
    const at = Date.now()
    setHistory((h) => {
      const next = change(h.draft)
      if (next === h.draft) return h
      const extend =
        key !== null && h.last?.key === key && at - h.last.at < MERGE_MS
      return {
        draft: next,
        past: extend ? h.past : [...h.past, h.draft].slice(-HISTORY_LIMIT),
        future: [],
        last: { key, at },
      }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory((h) =>
      h.past.length
        ? {
            draft: h.past[h.past.length - 1],
            past: h.past.slice(0, -1),
            future: [h.draft, ...h.future],
            last: null,
          }
        : h,
    )
  }, [])

  const redo = useCallback(() => {
    setHistory((h) =>
      h.future.length
        ? {
            draft: h.future[0],
            past: [...h.past, h.draft],
            future: h.future.slice(1),
            last: null,
          }
        : h,
    )
  }, [])

  const mutations = useMemo(() => createMutations(edit), [edit])
  const { replaceAll: commit } = stored

  const save = useCallback(() => {
    commit(draft)
    setBase(draft)
  }, [commit, draft])

  // Both undoable, like any other edit.
  const discard = useCallback(() => edit(() => base), [edit, base])
  const reset = useCallback(() => edit(() => DEFAULT_CONTENT), [edit])
  const replaceAll = useCallback((next) => edit(() => next), [edit])

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const value = useMemo(
    () => ({
      ...stored,
      ...mutations,
      content: draft,
      replaceAll,
      reset,
      dirty,
      save,
      discard,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [stored, mutations, draft, replaceAll, reset, dirty, save, discard, undo, redo, canUndo, canRedo],
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside a ContentProvider')
  return ctx
}

export function useResidence(slug) {
  const { content } = useContent()
  return content.residences.find((r) => r.slug === slug) ?? null
}

export function useApartment(slug, apartmentId) {
  const residence = useResidence(slug)
  if (!residence) return null
  const apartment = residence.apartments.find((a) => a.id === apartmentId)
  return apartment ? { residence, apartment } : null
}
