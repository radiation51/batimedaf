import { useState } from 'react'
import { useEdit } from '../content/editable'

/**
 * Single-open accordion, used by the Contact FAQ. Styled in index.css.
 * `defaultOpen` takes an index, or -1 to start fully collapsed.
 * `editPath` is where `items` lives in the content, for the admin editor.
 */
function Accordion({ items, defaultOpen = -1, numbered = true, editPath = null }) {
  const [open, setOpen] = useState(defaultOpen)
  const edit = useEdit(editPath)

  return (
    <ul className="acc">
      {items.map((item, i) => (
        // The reveal observer adds `is-visible` to this <li> imperatively, so
        // React must never rewrite its className — the open state therefore
        // lives on the inner wrapper instead.
        <li key={i} data-reveal style={{ '--d': `${i * 60}ms` }}>
          <div className={`acc-item${open === i ? ' is-open' : ''}`}>
            <button
              type="button"
              className="acc-head"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {numbered ? (
                <span className="num acc-num">{String(i + 1).padStart(2, '0')}</span>
              ) : (
                <span />
              )}
              <span className="acc-title" {...edit(i, 'title')}>
                {item.title}
              </span>
              <span className="acc-sign" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
            <div className="acc-panel">
              <p className={numbered ? 'is-indented' : undefined} {...edit(i, 'text')}>
                {item.text}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Accordion
