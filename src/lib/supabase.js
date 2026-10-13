const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * False until both env vars are set (see .env.example). Everything that
 * talks to Supabase must handle that case, so the site keeps working on
 * localStorage alone before Supabase is configured.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

let client = null

/**
 * The Supabase client, downloaded the first time something needs it (the
 * admin, the contact form, a photo upload), so visitors browsing the site
 * never load it. Resolves to null when Supabase is not configured.
 */
export function getSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    }),
  )
  return client
}

/**
 * One row of a publicly readable table, over plain HTTP: what every visitor
 * needs (the site's content) without the client library. Null if the row
 * does not exist; throws when the database cannot be reached.
 */
export async function readPublicRow(table, id, columns = '*') {
  const query = `id=eq.${encodeURIComponent(id)}&select=${encodeURIComponent(columns)}`
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey, Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const rows = await response.json()
  return rows[0] ?? null
}

// Single row holding the whole content tree.
export const CONTENT_TABLE = 'site_content'
export const CONTENT_ROW_ID = 'main'

// Messages sent from the contact form: visitors write, admins read.
export const MESSAGES_TABLE = 'contact_messages'

// Public bucket holding pictures uploaded from the admin panel.
export const MEDIA_BUCKET = 'media'
