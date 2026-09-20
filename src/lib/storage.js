import { supabase, MEDIA_BUCKET } from './supabase'

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

export const canUseStorage = () => Boolean(supabase)

/**
 * Sends an already-prepared data URI to the bucket and returns its public URL.
 * Throws with a readable message so the panel can fall back to inline storage
 * and say why.
 */
export async function uploadImage(dataUri, originalName = 'image') {
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
