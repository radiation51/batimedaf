import { useEffect, useState } from 'react'

/**
 * For a page that opens on a photo filling the window: while the element
 * under `ref` shows, the bar lies over it with no paper of its own (see
 * "Over photos" in Navbar.css); once the photo has gone up behind the bar,
 * the bar takes its paper back. The bar stays at the top of the window
 * throughout.
 */
export function useBarOver(ref) {
  const [over, setOver] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    // Gone by once no more than the bar's height of it is left on screen.
    const observer = new IntersectionObserver(([entry]) => setOver(entry.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.nav = over ? 'over fixed' : 'fixed'
    return () => delete root.dataset.nav
  }, [over])
}
