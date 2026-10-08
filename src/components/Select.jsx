import { useEffect, useId, useRef, useState } from 'react'
import './Select.css'

/**
 * A dropdown drawn in the site's own style. A native <select> opens a
 * system list (blue highlight on Windows) that CSS cannot reach, so this is
 * a button and a listbox, used with the mouse or the keyboard (arrows,
 * Home/End, Enter, Escape) like the native one.
 *
 * `labelId` is the id of the field's visible label; any other prop (the
 * admin's edit tag) goes on the button.
 */
function Select({ id, labelId, value, options, onChange, ...rest }) {
  const [open, setOpen] = useState(false)
  // The option the keyboard or the pointer is on while the list is open.
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const button = useRef(null)
  const list = useRef(null)
  const listId = useId()
  const selected = Math.max(0, options.indexOf(value))

  // A press anywhere else closes the list.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (open) list.current?.focus()
  }, [open])

  const show = () => {
    setActive(selected)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    button.current?.focus()
  }

  const pick = (i) => {
    onChange(options[i])
    close()
  }

  const onButtonKey = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      show()
    }
  }

  const onListKey = (e) => {
    const last = options.length - 1
    const moves = {
      ArrowDown: () => setActive((a) => Math.min(a + 1, last)),
      ArrowUp: () => setActive((a) => Math.max(a - 1, 0)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      ' ': () => pick(active),
      Escape: close,
    }
    if (moves[e.key]) {
      e.preventDefault()
      moves[e.key]()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className={`sel${open ? ' is-open' : ''}`} ref={root}>
      <button
        id={id}
        ref={button}
        type="button"
        className="sel-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onButtonKey}
        {...rest}
      >
        {value}
      </button>

      {open && (
        <ul
          id={listId}
          ref={list}
          className="sel-list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
        >
          {options.map((option, i) => (
            <li
              key={i}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === selected}
              className={i === active ? 'is-active' : undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              {option}
              {i === selected && (
                <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true">
                  <path d="M1 5l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
