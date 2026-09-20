import { useState } from 'react'

/**
 * Single-open accordion shared by the About values and the Contact FAQ.
 * `defaultOpen` takes an index, or -1 to start fully collapsed.
 */
function Accordion({ items, defaultOpen = -1, numbered = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <ul className="pg-acc">
      {items.map((item, i) => (
        // The reveal observer adds `is-visible` to this <li> imperatively, so
        // React must never rewrite its className — otherwise toggling an item
        // wipes that class and the reveal styles hide it again. The open state
        // therefore lives on the inner wrapper instead.
        <li key={item.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
          <div className={`pg-acc-item${open === i ? ' is-open' : ''}`}>
            <button
              type="button"
              className="pg-acc-head"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {numbered && (
                <span className="pg-acc-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <span className="pg-acc-title">{item.title}</span>
              <span className="pg-acc-sign" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
            <div className="pg-acc-panel">
              <p className={numbered ? '' : 'is-flush'}>{item.text}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Accordion
