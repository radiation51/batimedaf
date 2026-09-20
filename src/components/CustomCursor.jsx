import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

/**
 * A dot-and-ring cursor that replaces the system pointer on precise/hover
 * capable devices only (desktop with a mouse). Touch and coarse-pointer
 * devices — where there is no hover concept — keep the native cursor and
 * never mount the listeners at all.
 *
 * Any `<a>`/`<button>` grows the ring; an element carrying `data-cursor="…"`
 * additionally shows that string as a label inside it (used for "Voir" on
 * residence panels and gallery thumbnails, hinting they are clickable
 * without adding visible chrome to the imagery itself).
 */
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [variant, setVariant] = useState('default') // default | link | label

  useEffect(() => {
    const capable = window.matchMedia?.(
      '(hover: hover) and (pointer: fine)',
    )?.matches
    if (!capable) return
    setEnabled(true)

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches

    document.body.classList.add('cc-active')

    // Ring position lags the raw pointer with a lerp for a soft, weighted
    // feel; the dot itself is pinned exactly to the cursor every frame.
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pointer.x, y: pointer.y }
    let frame

    const tick = () => {
      const ease = reduced ? 1 : 0.18
      ring.x += (pointer.x - ring.x) * ease
      ring.y += (pointer.y - ring.y) * ease
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const handleMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }

    const handleOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], [data-cursor]')
      if (!target) return
      const text = target.getAttribute('data-cursor')
      if (text) {
        setLabel(text)
        setVariant('label')
      } else {
        setVariant('link')
      }
    }

    const handleOut = (e) => {
      const target = e.target.closest('a, button, [role="button"], [data-cursor]')
      if (!target) return
      const to = e.relatedTarget
      if (to && target.contains(to)) return
      setVariant('default')
      setLabel('')
    }

    const handleLeave = () => document.body.classList.add('cc-hidden')
    const handleEnter = () => document.body.classList.remove('cc-hidden')
    const handleDown = () => document.body.classList.add('cc-pressed')
    const handleUp = () => document.body.classList.remove('cc-pressed')

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, true)
    document.addEventListener('mouseout', handleOut, true)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)

    return () => {
      cancelAnimationFrame(frame)
      document.body.classList.remove('cc-active', 'cc-hidden', 'cc-pressed')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver, true)
      document.removeEventListener('mouseout', handleOut, true)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className={`cc-dot${variant !== 'default' ? ' cc-dot--hidden' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`cc-ring cc-ring--${variant}`}
        aria-hidden="true"
      >
        {variant === 'label' && <span className="cc-label">{label}</span>}
      </div>
    </>
  )
}

export default CustomCursor
