import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMessages, updateMessage, deleteMessage } from '../lib/messages'
import { usePageMeta } from '../hooks/usePageMeta'
import './Inbox.css'

/**
 * The admin's home page: requests sent from the site's contact form.
 * "Modification" opens the visual editor.
 */

// New messages show up without reloading the page.
const REFRESH_MS = 60_000

const FILTERS = [
  ['todo', 'À traiter', (m) => !m.is_done],
  ['done', 'Traités', (m) => m.is_done],
  ['all', 'Tous', () => true],
]

const timeFormat = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
const yearFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const fullFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' })

const sameDay = (a, b) => a.toDateString() === b.toDateString()

/** 'Aujourd’hui, 14:32', 'Hier, 09:05', '12 oct.' or '12 oct. 2025'. */
function when(iso) {
  const date = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (sameDay(date, now)) return `Aujourd’hui, ${timeFormat.format(date)}`
  if (sameDay(date, yesterday)) return `Hier, ${timeFormat.format(date)}`
  return date.getFullYear() === now.getFullYear()
    ? dayFormat.format(date)
    : yearFormat.format(date)
}

function Inbox({ onSignOut }) {
  const [messages, setMessages] = useState(null) // null while loading
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('todo')
  const [openId, setOpenId] = useState(null)

  const unread = messages?.filter((m) => !m.is_read).length ?? 0
  usePageMeta({ title: unread ? `(${unread}) Messages` : 'Messages' })

  const load = useCallback(async () => {
    try {
      setMessages(await listMessages())
      setError('')
    } catch (e) {
      setError(e.message)
      setMessages((current) => current ?? [])
    }
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(load, REFRESH_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load])

  /** Applies a change on screen at once, then stores it. */
  const change = async (id, patch) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)))
    try {
      await updateMessage(id, patch)
    } catch (e) {
      setError(e.message)
      load()
    }
  }

  const open = (message) => {
    setOpenId(message.id)
    if (!message.is_read) change(message.id, { is_read: true })
  }

  const remove = async (message) => {
    if (!window.confirm(`Supprimer définitivement le message de ${message.name} ?`)) return
    setOpenId(null)
    setMessages((list) => list.filter((m) => m.id !== message.id))
    try {
      await deleteMessage(message.id)
    } catch (e) {
      setError(e.message)
      load()
    }
  }

  const list = messages ?? []
  const [, , matches] = FILTERS.find(([key]) => key === filter)
  const shown = list.filter(matches)
  const current = list.find((m) => m.id === openId) ?? null

  return (
    <div className="ib">
      <header className="ib-head">
        <span className="ib-brand">
          BATIMEDAF <span>Administration</span>
        </span>
        <nav className="ib-nav">
          <a className="ib-link" href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </a>
          <button type="button" className="ib-link" onClick={onSignOut}>
            Se déconnecter
          </button>
          <Link className="ib-edit" to="/admin/modification">
            Modification du site
          </Link>
        </nav>
      </header>

      <main className="ib-main">
        <div className="ib-top">
          <div>
            <h1>Messages</h1>
            <p className="ib-sub">
              Les demandes envoyées depuis la page Contact du site.
              {unread > 0 && (
                <strong>
                  {' '}
                  {unread} nouveau{unread > 1 ? 'x' : ''}.
                </strong>
              )}
            </p>
          </div>
          <button type="button" className="ib-refresh" onClick={load}>
            Actualiser
          </button>
        </div>

        <div className="ib-filters" role="tablist" aria-label="Filtrer les messages">
          {FILTERS.map(([key, label, test]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`ib-filter${filter === key ? ' is-on' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
              <span className="ib-count">{list.filter(test).length}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="ib-error" role="alert">
            {error}
          </p>
        )}

        <div className={`ib-layout${current ? ' has-open' : ''}`}>
          <ul className="ib-list" aria-busy={messages === null}>
            {messages === null && <li className="ib-empty">Chargement…</li>}
            {messages !== null && shown.length === 0 && (
              <li className="ib-empty">
                {filter === 'todo'
                  ? 'Aucun message à traiter.'
                  : 'Aucun message ici pour l’instant.'}
              </li>
            )}
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`ib-item${m.id === openId ? ' is-open' : ''}${m.is_read ? '' : ' is-new'}`}
                  onClick={() => open(m)}
                >
                  <span className="ib-item-top">
                    <span className="ib-item-name">{m.name}</span>
                    <span className="ib-item-date">{when(m.created_at)}</span>
                  </span>
                  <span className="ib-item-subject">
                    {[m.subject, m.about].filter(Boolean).join(' · ')}
                  </span>
                  <span className="ib-item-text">{m.message}</span>
                </button>
              </li>
            ))}
          </ul>

          <section className="ib-detail" aria-live="polite">
            {current ? (
              <>
                <button
                  type="button"
                  className="ib-back"
                  onClick={() => setOpenId(null)}
                >
                  ← Tous les messages
                </button>

                <p className="ib-detail-date">{fullFormat.format(new Date(current.created_at))}</p>
                <h2>{current.name}</h2>

                <dl className="ib-facts">
                  <div>
                    <dt>E-mail</dt>
                    <dd>
                      <a href={`mailto:${current.email}`}>{current.email}</a>
                    </dd>
                  </div>
                  {current.phone && (
                    <div>
                      <dt>Téléphone</dt>
                      <dd>
                        <a href={`tel:${current.phone.replace(/\s/g, '')}`}>{current.phone}</a>
                      </dd>
                    </div>
                  )}
                  {current.subject && (
                    <div>
                      <dt>Sujet</dt>
                      <dd>{current.subject}</dd>
                    </div>
                  )}
                  {current.about && (
                    <div>
                      <dt>Concerne</dt>
                      <dd>{current.about}</dd>
                    </div>
                  )}
                </dl>

                <p className="ib-message">{current.message}</p>

                <div className="ib-actions">
                  <a
                    className="ib-primary"
                    href={`mailto:${current.email}?subject=${encodeURIComponent(
                      `Re: ${current.subject || 'Votre message'}`,
                    )}`}
                  >
                    Répondre par e-mail
                  </a>
                  {current.phone && (
                    <a className="ib-secondary" href={`tel:${current.phone.replace(/\s/g, '')}`}>
                      Appeler
                    </a>
                  )}
                  <button
                    type="button"
                    className="ib-secondary"
                    onClick={() => change(current.id, { is_done: !current.is_done })}
                  >
                    {current.is_done ? 'Remettre à traiter' : 'Marquer comme traité'}
                  </button>
                  <button
                    type="button"
                    className="ib-delete"
                    onClick={() => remove(current)}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            ) : (
              <p className="ib-placeholder">
                Sélectionnez un message pour le lire.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Inbox
