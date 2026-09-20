import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Null until both env vars are set (see .env.example). Everything that uses
 * this must handle the null case, so the site keeps working on localStorage
 * alone before Supabase is configured.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

export const isSupabaseConfigured = Boolean(supabase)

// Single row holding the whole content tree.
export const CONTENT_TABLE = 'site_content'
export const CONTENT_ROW_ID = 'main'

// Public bucket holding pictures uploaded from the admin panel.
export const MEDIA_BUCKET = 'media'
