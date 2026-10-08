import { supabase, MESSAGES_TABLE } from './supabase'

/**
 * Messages sent from the contact form, read in the admin's "Messages" page.
 *
 * With Supabase they go to the `contact_messages` table: visitors may add a
 * row but never read one back (see supabase/schema.sql). Without it they stay
 * in this browser's localStorage — enough to try the form and the inbox
 * locally, invisible to anyone else.
 */

const LOCAL_KEY = 'batimedaf:messages'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? []
  } catch {
    return []
  }
}

function writeLocal(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
}

/** Turns a Supabase error into something the admin can act on. */
function explain(error) {
  if (/fetch|network|load failed/i.test(error.message)) {
    return 'Base de données injoignable. Si le projet Supabase est en pause, relancez-le depuis supabase.com.'
  }
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return 'La table des messages n’existe pas encore : exécutez supabase/schema.sql dans Supabase.'
  }
  return error.message
}

/** Sends one message from the contact form. Throws if it was not stored. */
export async function sendMessage({ name, email, phone, subject, about, message }) {
  const row = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject,
    about: about ?? '',
    message: message.trim(),
  }

  if (!supabase) {
    writeLocal([
      {
        ...row,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_read: false,
        is_done: false,
      },
      ...readLocal(),
    ])
    return
  }

  // No `.select()`: visitors are not allowed to read the row back.
  const { error } = await supabase.from(MESSAGES_TABLE).insert(row)
  if (error) throw new Error(explain(error))
}

/** Every message, newest first. */
export async function listMessages() {
  if (!supabase) return readLocal()

  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw new Error(explain(error))
  return data
}

export async function updateMessage(id, patch) {
  if (!supabase) {
    writeLocal(readLocal().map((m) => (m.id === id ? { ...m, ...patch } : m)))
    return
  }
  const { error } = await supabase.from(MESSAGES_TABLE).update(patch).eq('id', id)
  if (error) throw new Error(explain(error))
}

export async function deleteMessage(id) {
  if (!supabase) {
    writeLocal(readLocal().filter((m) => m.id !== id))
    return
  }
  const { error } = await supabase.from(MESSAGES_TABLE).delete().eq('id', id)
  if (error) throw new Error(explain(error))
}
