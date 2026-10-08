import { useUI } from '../i18n/useLocalizedContent'

/** The pages listed in the bar, the menu and the footer. */
export function useNavLinks() {
  const t = useUI()
  return [
    { label: t.nav.home, href: '/' },
    { label: t.nav.residence, href: '/residence' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.collaboration, href: '/collaboration' },
    { label: t.nav.contact, href: '/contact' },
  ]
}
