import { useLanguage } from '../i18n/LanguageContext'

/** FR · EN, the current language in ink and the other one faded. Styled in
 * Navbar.css; the menu uses it too. */
function LangSwitch({ className = '' }) {
  const { lang, toggleLang } = useLanguage()
  return (
    <button
      type="button"
      className={`lang ${className}`}
      onClick={toggleLang}
      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className={lang === 'fr' ? 'is-on' : undefined}>FR</span>
      <span className={lang === 'en' ? 'is-on' : undefined}>EN</span>
    </button>
  )
}

export default LangSwitch
