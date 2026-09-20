import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import '../styles/page.css'
import './Contact.css'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function Contact() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.contact
  const [params] = useSearchParams()

  usePageMeta({ title: t.nav.contact, description: c.sub })

  const { ref: pageRef, ready } = useReveal([c])
  const [form, setForm] = useState({ ...EMPTY, subject: c.subjects[0] })
  const [sent, setSent] = useState(false)

  // Links such as /contact?sujet=visite arrive from the residence pages.
  useEffect(() => {
    if (params.get('sujet') === 'visite') {
      const match = c.subjects.find((s) => /visite/i.test(s))
      if (match) setForm((f) => ({ ...f, subject: match }))
    }
  }, [params, c.subjects])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire to a real endpoint (form service or Supabase function).
    setSent(true)
  }

  return (
    <main className={`pg ct${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* The form sits in the first screen: no scrolling to reach it. */}
      <section className="ct-top" data-nav-tone="light">
        <div className="pg-wrap ct-cols">
          <div className="ct-aside">
            <span className="pg-eyebrow ct-kicker">{c.kicker}</span>
            <h1 className="ct-title">
              <span className="pg-mask">
                <span className="pg-mask-inner">{c.title}</span>
              </span>
            </h1>
            <p className="ct-sub">{c.sub}</p>

            <dl className="ct-details">
              <div>
                <dt>{t.phone}</dt>
                <dd>
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>
                </dd>
              </div>
              <div>
                <dt>{t.email}</dt>
                <dd>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </dd>
              </div>
              <div>
                <dt>{t.address}</dt>
                <dd className="ct-pre">{c.address}</dd>
              </div>
              <div>
                <dt>{t.hours}</dt>
                <dd className="ct-pre">{c.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="ct-form-card">
            {sent ? (
              <div className="ct-sent" role="status">
                <h2>{t.formSentTitle}</h2>
                <p>{t.formSentThanks(form.name.split(' ')[0] || '')}</p>
                <button
                  type="button"
                  className="ct-reset"
                  onClick={() => {
                    setForm({ ...EMPTY, subject: c.subjects[0] })
                    setSent(false)
                  }}
                >
                  {t.formWriteAnother}
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit} noValidate={false}>
                <div className="ct-field">
                  <label htmlFor="ct-name">{t.formName}</label>
                  <input
                    id="ct-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>

                <div className="ct-row">
                  <div className="ct-field">
                    <label htmlFor="ct-email">{t.formEmail}</label>
                    <input
                      id="ct-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-phone">{t.formPhone}</label>
                    <input
                      id="ct-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={set('phone')}
                    />
                  </div>
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-subject">{t.formSubject}</label>
                  <select
                    id="ct-subject"
                    value={form.subject}
                    onChange={set('subject')}
                  >
                    {c.subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-message">{t.formMessage}</label>
                  <textarea
                    id="ct-message"
                    rows="5"
                    required
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                <button type="submit" className="ct-submit">
                  {t.formSend}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <p className="ct-legal">{t.formLegal}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="pg-block" data-nav-tone="light">
        <div className="pg-wrap pg-split">
          <div className="pg-split-aside">
            <span className="pg-eyebrow" data-reveal>
              {c.faqTitle}
            </span>
          </div>
          <div>
            <Accordion items={c.faq} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
