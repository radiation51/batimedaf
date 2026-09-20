import { createContext, useCallback, useContext, useEffect, useState } from 'react'

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

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside a LanguageProvider')
  return ctx
}
