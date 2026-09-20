import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FullMenu from './FullMenu'
import { useLanguage } from '../i18n/LanguageContext'
import './Navbar.css'

function Navbar() {
  const headerRef = useRef(null)
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, toggleLang } = useLanguage()
  // Tone of whatever is actually painted behind the bar, plus whether that
  // section wants the bar left transparent (the hero does).
  const [tone, setTone] = useState('dark')
  const [bare, setBare] = useState(true)
  // Tucked away while scrolling down, brought back when scrolling up.
  const [tucked, setTucked] = useState(false)
  // At the very top of any page the bar stays transparent.
  const [atTop, setAtTop] = useState(true)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const header = headerRef.current
      if (!header) return

      // Direction tracking runs first: the hit-test below bails out early in
      // some cases, and hiding must not depend on that succeeding.
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      setAtTop(scrollY <= 8)

      const delta = scrollY - lastScrollRef.current
      // Ignore sub-pixel jitter and elastic overscroll bounce.
      if (Math.abs(delta) > 6) {
        if (scrollY <= 80) {
          setTucked(false) // always visible at the top of the page
        } else {
          setTucked(delta > 0)
        }
        lastScrollRef.current = scrollY
      }

      const rect = header.getBoundingClientRect()
      const y = Math.max(1, rect.height / 2)
      const x =
        (document.documentElement.clientWidth || window.innerWidth || 0) / 2
      if (!x) return

      // Hit-test the stack under the middle of the bar. This reads what is
      // really on screen, so it stays correct for the fixed hero, the sticky
      // story section, and any future section order.
      for (const el of document.elementsFromPoint(x, y)) {
        if (header.contains(el)) continue
        const section = el.closest('[data-nav-tone]')
        if (!section) continue

        setTone(section.getAttribute('data-nav-tone') === 'light' ? 'light' : 'dark')
        setBare(section.hasAttribute('data-nav-bare'))
        return
      }
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    // The first read can land before images/fonts settle or before the
    // browser restores a saved scroll position, so re-read once they do.
    window.addEventListener('load', handleScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    // Fired once the page transition swaps the route behind the overlay.
    window.addEventListener('page:swapped', handleScroll)
    return () => {
      window.removeEventListener('load', handleScroll)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('page:swapped', handleScroll)
    }
    // Re-read on navigation: the new page has different sections behind the
    // bar, and a route change fires no scroll event.
  }, [pathname])

  return (
    <>
      <header
        ref={headerRef}
        className={`navbar${menuOpen ? ' is-hidden' : ''}${tone === 'light' ? ' is-on-light' : ''}${bare || atTop ? '' : ' is-solid'}${tucked && !menuOpen ? ' is-tucked' : ''}`}
      >
        <div className="navbar-inner">
          <Link className="navbar-logo" to="/">
            Batimedaf
          </Link>

          <div className="navbar-actions">
            <button
              type="button"
              className="navbar-btn navbar-btn--lang"
              onClick={toggleLang}
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <span className="lang-current">{lang.toUpperCase()}</span>
            </button>

            <button type="button" className="navbar-btn navbar-btn--cta">
              Book a call
            </button>

            <button
              type="button"
              className={`navbar-btn navbar-btn--burger${menuOpen ? ' is-open' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="burger-lines">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

export default Navbar
