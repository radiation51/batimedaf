import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import Inbox from '../admin/Inbox'
import VisualEditor from '../admin/VisualEditor'
import './Admin.css'

/* Password used when Supabase is not configured — local editing only. */
const LOCAL_PASSWORD = '1234'

/* With Supabase, everyone shares one administrator account and only types the
   password. The e-mail is never asked for: it is this identifier, which never
   receives any message. To change the password, change it on that account in
   Supabase (Authentication → Users). Supabase requires at least 6 characters. */
const ADMIN_EMAIL = 'admin@batimedaf.netlify.app'

/* ---------------- Login ---------------- */

function Login({ onLocalUnlock }) {
  const { signIn, isSupabaseConfigured } = useContent()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      if (password === LOCAL_PASSWORD) onLocalUnlock()
      else setError('Mot de passe incorrect.')
      return
    }

    setBusy(true)
    const { error: authError } = await signIn(ADMIN_EMAIL, password)
    setBusy(false)
    if (authError) {
      setError(
        /invalid login/i.test(authError)
          ? 'Mot de passe incorrect.'
          : /fetch|network|load failed/i.test(authError)
            ? 'Impossible de joindre la base de données. Le projet Supabase est peut-être en pause : relancez-le depuis supabase.com.'
            : authError,
      )
    }
  }

  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <span className="ad-login-brand">BATIMEDAF</span>
        <h1>Administration</h1>
        <p className="ad-login-sub">
          {isSupabaseConfigured
            ? 'Entrez le mot de passe administrateur.'
            : 'Mode local : les modifications restent sur cet appareil.'}
        </p>

        <label className="ad-field">
          <span className="ad-field-label">Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="ad-error">{error}</p>}

        <button type="submit" className="ad-primary" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>

        <Link to="/" className="ad-login-back">
          Retour au site
        </Link>
      </form>
    </div>
  )
}

/* ---------------- Admin ---------------- */

/**
 * Login, then the Messages page (contact requests). From there, the
 * "Modification" page shows the site itself, edited in place.
 */
function Admin() {
  usePageMeta({ title: 'Administration', noindex: true })

  const { session, isSupabaseConfigured, signOut } = useContent()
  const [localUnlocked, setLocalUnlocked] = useState(false)

  const authed = isSupabaseConfigured ? Boolean(session) : localUnlocked

  if (!authed) return <Login onLocalUnlock={() => setLocalUnlocked(true)} />

  const leave = () => {
    signOut()
    setLocalUnlocked(false)
  }

  return (
    <Routes>
      <Route index element={<Inbox onSignOut={leave} />} />
      <Route path="modification/*" element={<VisualEditor onSignOut={leave} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default Admin
