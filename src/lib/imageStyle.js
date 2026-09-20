/**
 * Every image field in the content tree is `{ src, x, y, zoom }`:
 * `src` is the picture, `x`/`y` (0–100) are the focal point (what stays
 * centered when the box crops it), and `zoom` (>= 1) enlarges beyond the
 * default fit. This lets the admin choose the crop instead of the site
 * always centering the image and hoping for the best.
 */
export const DEFAULT_IMAGE = { src: '', x: 50, y: 50, zoom: 1 }

/** A freshly-authored image, centered with no zoom until someone crops it. */
export const newImage = (src) => ({ src, x: 50, y: 50, zoom: 1 })

/** Accepts the new object shape and, for safety, a bare src string. */
export function normalizeImage(value) {
  if (!value) return { ...DEFAULT_IMAGE }
  if (typeof value === 'string') return { ...DEFAULT_IMAGE, src: value }
  return { ...DEFAULT_IMAGE, ...value }
}

/**
 * CSS custom properties carrying the crop. Spread into an element's inline
 * `style` alongside whatever else it needs (backgroundImage, animationDelay…).
 * Every stylesheet reads these with a `50%` / `1` fallback, so an image with
 * no crop set behaves exactly like today (centered, no zoom).
 */
export function imageVars(value) {
  const { x, y, zoom } = normalizeImage(value)
  return {
    '--pos-x': `${x}%`,
    '--pos-y': `${y}%`,
    '--zoom': zoom,
  }
}

/** True for a dedicated image sub-object — the admin renders these as one
 * cropping widget instead of recursing into src/x/y/zoom as separate fields. */
export function hasImageShape(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof value.src === 'string' &&
      'x' in value &&
      'y' in value &&
      'zoom' in value,
  )
}
