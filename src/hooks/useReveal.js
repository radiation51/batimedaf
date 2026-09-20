import { useEffect, useRef, useState } from 'react'

/**
 * Reveals every [data-reveal] element inside the returned ref as it scrolls
 * into view.
 *
 * The hidden start state is only applied once JS is running (`ready`), so the
 * content still renders if the observer is unavailable, and a timeout forces
 * everything visible if the observer never reports — otherwise a page that
 * starts at opacity 0 could stay blank for good.
 *
 * ⚠️ Never put [data-reveal] on an element whose className React also
 * controls: re-rendering would wipe the `is-visible` class this adds.
 */
export function useReveal(deps = []) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return

    setReady(true)

    const targets = root.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    targets.forEach((el) => observer.observe(el))

    const fallback = setTimeout(() => {
      targets.forEach((el) => el.classList.add('is-visible'))
    }, 2500)

    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ref, ready }
}

/**
 * Counts from 0 up to `target` once `active` turns true.
 * Honours prefers-reduced-motion by jumping straight to the final value.
 */
export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches

    if (reduced || !target) {
      setValue(target)
      return
    }

    let frame
    let done = false
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo: fast at first, settling gently on the final figure
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else done = true
    }

    frame = requestAnimationFrame(tick)

    // rAF is paused in background tabs. Without this the figure could stay
    // stuck at 0 — a wrong number is worse than an unanimated one.
    const safety = setTimeout(() => {
      if (!done) setValue(target)
    }, duration + 400)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(safety)
    }
  }, [target, active, duration])

  return value
}
