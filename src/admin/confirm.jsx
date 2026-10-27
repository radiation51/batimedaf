import { useEffect, useState } from 'react'
import './confirm.css'

/* The dialog on screen, set by <ConfirmHost> while it is mounted. */
let show = null

/**
 * Asks a yes/no question in the admin's own dialog and resolves with the
 * answer. The browser's confirm() is not used: some embedded browsers answer
 * "no" at once without showing anything, which silently blocked every
 * guarded button.
 */
export function confirmAsk(message, { yes = 'Confirmer', danger = false } = {}) {
  return new Promise((resolve) => {
    if (show) show({ message, yes, danger, resolve })
    else resolve(window.confirm(message))
  })
}

/** Renders the dialog asked for by confirmAsk. Mounted once, at the admin root. */
export function ConfirmHost() {
  const [asking, setAsking] = useState(null)

  useEffect(() => {
    show = setAsking
    return () => {
      show = null
    }
  }, [])

  const answer = (value) => {
    asking?.resolve(value)
    setAsking(null)
  }

  // Échap says no; nothing else on the page reacts to the keys meanwhile.
  useEffect(() => {
    if (!asking) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        asking.resolve(false)
        setAsking(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [asking])

  if (!asking) return null

  return (
    <div className="cf-backdrop" data-editor-ui onClick={() => answer(false)}>
      <div
        className="cf"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmation"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="cf-message">{asking.message}</p>
        <div className="cf-buttons">
          <button type="button" className="cf-no" onClick={() => answer(false)}>
            Annuler
          </button>
          <button
            type="button"
            className={`cf-yes${asking.danger ? ' is-danger' : ''}`}
            onClick={() => answer(true)}
            autoFocus
          >
            {asking.yes}
          </button>
        </div>
      </div>
    </div>
  )
}
