import { useEffect, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit, useEditMode } from '../content/editable'
import './Intro.css'

const WORD_MS = 3200

/**
 * The house's statement: "Chaque <word> est pensée." where the word steps
 * through ligne, matière, lumière, each with its photograph beside it, and
 * the full statement set small underneath. On each change the old word's
 * letters lift away and the new ones rise into place one after another,
 * while the new photo is uncovered from the bottom up. The admin's
 * editor holds it still and shows every word and photo at once, so each can
 * be clicked.
 */
function Intro() {
  const intro = useLocalizedContent().home.intro
  const edit = useEdit(['home', 'intro'])
  const still = useEditMode()
  const { ref, ready } = useReveal([intro.description])
  const words = intro.words ?? []

  // `prev` is the word leaving; null until the first change, so nothing
  // animates on arrival.
  const [{ active, prev }, setStep] = useState({ active: 0, prev: null })
  // Clamped: the admin can delete the word that is on screen.
  const shown = Math.min(active, Math.max(words.length - 1, 0))

  useEffect(() => {
    if (still || words.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(
      () => setStep((s) => ({ active: (s.active + 1) % words.length, prev: s.active })),
      WORD_MS,
    )
    return () => clearInterval(timer)
  }, [words.length, still])

  const stateOf = (i) => {
    if (still || i === shown) return ' is-on'
    if (i === prev) return ' is-past'
    return ''
  }

  return (
    <section
      className={`sec intro${prev !== null ? ' is-moving' : ''}${
        ready ? ' is-ready' : ''
      }`}
      ref={ref}
      data-nav-tone="light"
    >
      <div className="wrap intro-grid">
        <div className="intro-body">
          <span className="label" {...edit('logo')}>
            {intro.logo}
          </span>

          <p className="intro-say">
            <span className="intro-sr">
              {intro.before} {words[shown]?.word} {intro.after}
            </span>
            <span aria-hidden="true">
              <span {...edit('before')}>{intro.before}</span>{' '}
              {/* Every word holds the same slot and ends its line, so the
                  sentence never jumps and a short word leaves no gap. */}
              <span className={`intro-words${still ? ' is-still' : ''}`}>
                {words.map((item, i) => (
                  <em key={i} className={stateOf(i).trim() || undefined} {...edit('words', i, 'word')}>
                    {still
                      ? item.word
                      : [...item.word].map((ch, j) => (
                          <span key={j} className="intro-ch" style={{ '--i': j }}>
                            {ch === ' ' ? ' ' : ch}
                          </span>
                        ))}
                  </em>
                ))}
              </span>
              <br />
              <span {...edit('after')}>{intro.after}</span>
            </span>
          </p>

          <p className="intro-text" data-reveal {...edit('description')}>
            {intro.description}
          </p>
        </div>

        <div className={`intro-photo${still ? ' is-still' : ''}`}>
          {words.map((item, i) => (
            <img
              key={i}
              className={`intro-frame${stateOf(i)}`}
              src={normalizeImage(item.image).src}
              alt=""
              // Below the cover: fetched only as the reader scrolls near.
              loading="lazy"
              decoding="async"
              {...edit('words', i, 'image')}
              style={imageVars(item.image)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Intro
