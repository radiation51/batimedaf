/**
 * Client-side image preparation for the admin panel.
 *
 * There is no upload backend: pictures are stored inline in the content tree
 * (localStorage, and Supabase when configured). A phone photograph is several
 * megabytes and would blow past the ~5 MB localStorage quota on its own, so
 * every file is downscaled and re-encoded before it is kept.
 */

export const MAX_EDGE = 1920
export const TARGET_TYPE = 'image/webp'
export const QUALITY = 0.92

/** Rough byte size of a data URI, without decoding it. */
export const dataUriBytes = (uri) =>
  Math.round(((uri.length - (uri.indexOf(',') + 1)) * 3) / 4)

export const formatBytes = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
    : `${Math.round(bytes / 1024)} Ko`

function readAsDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Fichier image illisible.'))
    img.src = src
  })
}

/**
 * Returns a data URI for `file`, downscaled to MAX_EDGE on its long side and
 * re-encoded. Falls back to JPEG where WebP is unavailable, and to the
 * original bytes if the canvas is unusable (a tainted or oversized canvas).
 */
export async function prepareImage(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Ce fichier n’est pas une image.')
  }

  const original = await readAsDataUri(file)

  // SVG has no pixels to resample; keep it as authored.
  if (file.type === 'image/svg+xml') {
    return { dataUri: original, width: null, height: null }
  }

  const img = await loadImage(original)
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return { dataUri: original, width: img.width, height: img.height }

  ctx.drawImage(img, 0, 0, width, height)

  let encoded = canvas.toDataURL(TARGET_TYPE, QUALITY)
  // Browsers that cannot encode WebP hand back a PNG, which is far larger
  // than the JPEG we would rather have.
  if (!encoded.startsWith(`data:${TARGET_TYPE}`)) {
    encoded = canvas.toDataURL('image/jpeg', QUALITY)
  }

  // Re-encoding a small, already-optimised file can make it bigger.
  const dataUri = encoded.length < original.length ? encoded : original

  return { dataUri, width, height }
}
