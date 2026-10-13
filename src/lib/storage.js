import { getSupabase, isSupabaseConfigured, MEDIA_BUCKET } from './supabase'
import { prepareImage, dataUriBytes, formatBytes } from './image'

/**
 * Uploads pictures from the admin panel to Supabase Storage.
 *
 * Without Supabase the panel keeps images inline in the content tree, which
 * only survives in the editor's own browser and eats the localStorage quota.
 * With Supabase they become ordinary public URLs that every visitor sees.
 */

const EXTENSIONS = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

/** Keeps the stored filename readable and safe for a URL path. */
function slugify(name) {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'image'
  )
}

export const canUseStorage = () => isSupabaseConfigured

/**
 * Sends an already-prepared data URI to the bucket and returns its public URL.
 * Throws with a readable message so the panel can fall back to inline storage
 * and say why.
 */
export async function uploadImage(dataUri, originalName = 'image') {
  const supabase = await getSupabase()
  if (!supabase) throw new Error('Supabase n’est pas configuré.')

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('Connectez-vous pour téléverser vers Supabase.')
  }

  // The prepared picture is a data URI; the bucket wants the bytes.
  const blob = await (await fetch(dataUri)).blob()
  const extension = EXTENSIONS[blob.type] ?? 'bin'
  // Date prefix keeps uploads ordered and collision-free without a lookup.
  const path = `${Date.now()}-${slugify(originalName)}.${extension}`

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: blob.type, upsert: false })

  if (error) {
    // The most common cause by far is the bucket not existing yet.
    throw new Error(
      /not found/i.test(error.message)
        ? `Bucket « ${MEDIA_BUCKET} » introuvable — exécutez supabase/schema.sql.`
        : error.message,
    )
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('URL publique indisponible.')
  return data.publicUrl
}

/* Past this, a single picture eats a meaningful share of the ~5 MB
   localStorage budget the whole site shares. */
const HEAVY_IMAGE_BYTES = 700 * 1024

/**
 * Turns a picked file into an image `src`: downscaled, then sent to the
 * bucket when there is one. Resolves to `{ src, note, error }`, where
 * `error` says why the picture was kept inline after a failed upload.
 * Throws when the file is not a usable image.
 */
export async function storeImage(file) {
  // Always downscale first: it keeps the upload small, and it is the only
  // thing standing between a phone photo and the localStorage quota when
  // there is no bucket to send it to.
  const { dataUri, width, height } = await prepareImage(file)
  const bytes = dataUriBytes(dataUri)
  const size = `${width ? `${width}×${height} · ` : ''}${formatBytes(bytes)}`

  if (canUseStorage()) {
    try {
      const url = await uploadImage(dataUri, file.name)
      return { src: url, note: `${file.name} · ${size} · envoyé sur Supabase` }
    } catch (uploadError) {
      // Keep the picture rather than losing the edit, and say what
      // happened: inline images are only visible to this browser.
      return {
        src: dataUri,
        note: `${file.name} · ${size} · conservé localement`,
        error: `Envoi Supabase impossible : ${uploadError.message}`,
      }
    }
  }

  return {
    src: dataUri,
    note:
      `${file.name} · ${size}` +
      (bytes > HEAVY_IMAGE_BYTES
        ? ' — image lourde, le stockage local est limité.'
        : ''),
  }
}
