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
  supabase,
  isSupabaseConfigured,
  CONTENT_TABLE,
  CONTENT_ROW_ID,
} from '../lib/supabase'

const STORAGE_KEY = 'batimedaf:content'
const SAVE_DEBOUNCE_MS = 800

const ContentContext = createContext(null)

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
    setPath: (path, value) => update((prev) => applyPath(prev, path, value)),

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
  }
}

/** Local copy: the offline cache, and the whole store when Supabase is off. */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONTENT
    return { ...DEFAULT_CONTENT, ...JSON.parse(raw) }
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

  // Skips the save that would otherwise fire from the initial server fetch.
  const hydratedRef = useRef(false)
  const saveTimer = useRef(null)

  /* ---------------- Auth ---------------- */

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  /* ---------------- Initial read ---------------- */

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    ;(async () => {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('data')
        .eq('id', CONTENT_ROW_ID)
        .maybeSingle()

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
        setContent({ ...DEFAULT_CONTENT, ...data.data })
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
    if (!supabase || !session) return
    if (!hydratedRef.current) return

    clearTimeout(saveTimer.current)
    setSaveState('saving')

    saveTimer.current = setTimeout(async () => {
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

  const mutations = useMemo(() => createMutations(setContent), [])

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
    if (!supabase) return { error: 'Supabase n’est pas configuré.' }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
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
      mutations,
      replaceAll,
      reset,
    ],
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

/**
 * Wraps the admin's visual editor: everything inside reads and edits a draft
 * copy of the content, and nothing reaches the site (or Supabase) until
 * `save()` hands the draft to the real store.
 */
export function DraftContentProvider({ children }) {
  const stored = useContext(ContentContext)
  const [draft, setDraft] = useState(stored.content)
  // The stored content the draft started from: an edit makes them differ.
  const [base, setBase] = useState(stored.content)
  const dirty = draft !== base

  // While nothing is pending, follow the store, e.g. the Supabase read
  // finishing after the editor opened on the local copy.
  if (!dirty && stored.content !== base) {
    setBase(stored.content)
    setDraft(stored.content)
  }

  const mutations = useMemo(() => createMutations(setDraft), [])
  const { replaceAll: commit } = stored

  const save = useCallback(() => {
    commit(draft)
    setBase(draft)
  }, [commit, draft])

  const discard = useCallback(() => setDraft(base), [base])
  const reset = useCallback(() => setDraft(DEFAULT_CONTENT), [])

  const value = useMemo(
    () => ({
      ...stored,
      ...mutations,
      content: draft,
      replaceAll: setDraft,
      reset,
      dirty,
      save,
      discard,
    }),
    [stored, mutations, draft, reset, dirty, save, discard],
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
