import { useContent } from '../content/ContentContext'
import { useLanguage } from './LanguageContext'
import { CONTENT_EN } from './content.en'
import { UI } from './ui'

/**
 * The CMS (admin panel, Supabase) only ever holds French content. English is
 * a hand-maintained static mirror swapped in wholesale when `lang === 'en'`
 * — so an admin edit always shows up in French, and English stays a
 * professionally translated snapshot rather than a half-updated guess.
 */
export function useLocalizedContent() {
  const { content: frContent } = useContent()
  const { lang } = useLanguage()
  return lang === 'en' ? CONTENT_EN : frContent
}

export function useLocalizedResidence(slug) {
  const content = useLocalizedContent()
  return content.residences.find((r) => r.slug === slug) ?? null
}

export function useLocalizedApartment(slug, apartmentId) {
  const residence = useLocalizedResidence(slug)
  if (!residence) return null
  const apartment = residence.apartments.find((a) => a.id === apartmentId)
  return apartment ? { residence, apartment } : null
}

/** Static UI chrome (nav, buttons, section labels) for the current language. */
export function useUI() {
  const { lang } = useLanguage()
  return UI[lang]
}
