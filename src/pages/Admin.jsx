import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import Inbox from '../admin/Inbox'
import VisualEditor from '../admin/VisualEditor'
import './Admin.css'

/* With Supabase, everyone shares one administrator account and only types the
   password. The e-mail is never asked for: it is this identifier, which never
   receives any message. To change the password, change it on that account in
   Supabase (Authentication → Users). Supabase requires at least 6 characters. */
const ADMIN_EMAIL = 'admin@batimedaf.netlify.app'

/* ---------------- Login ---------------- */

/**
 * Without Supabase (the site running on a developer's computer), there is no
 * account to check and nothing to protect: edits and requests stay in this
 * browser. A local password only got mistaken for the real one, so the
 * preview just says what it is and lets the admin in.
 */
function LocalEntry({ onEnter }) {
  return (
    <div className="ad-login">
      <div className="ad-login-card">
        <span className="ad-login-brand">BATIMEDAF</span>
        <h1>Administration</h1>
        <p className="ad-login-sub">
          Aperçu sur cet ordinateur : l’administration n’est pas reliée à la
          base de données. Les modifications et les demandes restent dans ce
          navigateur, rien n’est publié.
        </p>
        <p className="ad-login-sub">
          Votre mot de passe administrateur sert sur le site en ligne.
        </p>

        <button type="button" className="ad-primary" onClick={onEnter}>
          Entrer dans l’aperçu
        </button>

        <Link to="/" className="ad-login-back">
          Retour au site
        </Link>
      </div>
    </div>
  )
}

function Login() {
  const { signIn } = useContent()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
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
        <p className="ad-login-sub">Entrez le mot de passe administrateur.</p>

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
 * Login, then the "Demandes" page (contact requests). From there, the
 * "Modification" page shows the site itself, edited in place.
 */
function Admin() {
  usePageMeta({ title: 'Administration', noindex: true })

  const { session, isSupabaseConfigured, signOut } = useContent()
  const [localUnlocked, setLocalUnlocked] = useState(false)

  const authed = isSupabaseConfigured ? Boolean(session) : localUnlocked

  if (!authed) {
    return isSupabaseConfigured ? (
      <Login />
    ) : (
      <LocalEntry onEnter={() => setLocalUnlocked(true)} />
    )
  }

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
