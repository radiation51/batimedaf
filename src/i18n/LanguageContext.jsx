import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'batimedaf:lang'
const LanguageContext = createContext(null)

function loadInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    /* localStorage unavailable — fall through to the default. */
  }
  return 'fr'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* Nothing to persist to — the toggle still works for this session. */
    }
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'fr' ? 'en' : 'fr'))
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

const noop = () => {}

/**
 * Pins a subtree to one language. The admin's visual editor shows French:
 * the only language the admin edits.
 */
export function FixedLanguage({ lang, children }) {
  const value = useMemo(() => ({ lang, setLang: noop, toggleLang: noop }), [lang])
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside a LanguageProvider')
  return ctx
}
