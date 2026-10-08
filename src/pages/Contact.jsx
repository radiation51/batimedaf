import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import Arrow from '../components/Arrow'
import Select from '../components/Select'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { sendMessage } from '../lib/messages'
import { useEdit } from '../content/editable'
import './Contact.css'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  // Honeypot: hidden from people, filled in by spam bots.
  website: '',
}

/** 'Organiser une visite' → 'organiser une visite', for loose matching. */
const fold = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Contact() {
  const content = useLocalizedContent()
  const t = useUI()
  const c = content.contact
  const edit = useEdit(['contact'])
  const [params] = useSearchParams()

  usePageMeta({ title: t.nav.contact, description: c.sub })

  const { ref: pageRef, ready } = useReveal([c])
  const [form, setForm] = useState({ ...EMPTY, subject: c.subjects[0] })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  // Links such as /contact?sujet=visite pick the matching subject (visite,
  // collaboration, presse… in either language).
  useEffect(() => {
    const wanted = fold(params.get('sujet') ?? '').slice(0, 5)
    if (!wanted) return
    const match = c.subjects.find((s) => fold(s).includes(wanted))
    if (match) setForm((f) => ({ ...f, subject: match }))
  }, [params, c.subjects])

  // The residence or apartment the visitor came from, shown to the admin.
  const about = params.get('bien') ?? ''

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    // A bot filled the hidden field: thank it and store nothing.
    if (form.website) {
      setSent(true)
      return
    }

    setSending(true)
    setFailed(false)
    try {
      await sendMessage({ ...form, about })
      setSent(true)
    } catch (error) {
      console.warn('[contact] envoi impossible :', error.message)
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className={`ct${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* The form sits in the first screen: no scrolling to reach it. */}
      <section className="ct-top" data-nav-tone="light">
        <div className="wrap ct-cols">
          <div className="ct-aside">
            <span className="label" {...edit('kicker')}>
              {c.kicker}
            </span>
            <h1 className="d2 ct-title" {...edit('title')}>
              {c.title}
            </h1>
            <p className="ct-sub" {...edit('sub')}>
              {c.sub}
            </p>

            <dl className="ct-details">
              <div>
                <dt className="label">{t.phone}</dt>
                <dd>
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} {...edit('phone')}>
                    {c.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">{t.email}</dt>
                <dd>
                  <a href={`mailto:${c.email}`} {...edit('email')}>
                    {c.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">{t.address}</dt>
                <dd {...edit('address')}>{c.address}</dd>
              </div>
              <div>
                <dt className="label">{t.hours}</dt>
                <dd {...edit('hours')}>{c.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="ct-form-col">
            {sent ? (
              <div className="ct-sent" role="status">
                <h2 className="d3">{t.formSentTitle}</h2>
                <p>{t.formSentThanks(form.name.split(' ')[0] || '')}</p>
                <button
                  type="button"
                  className="tlink"
                  onClick={() => {
                    setForm({ ...EMPTY, subject: c.subjects[0] })
                    setSent(false)
                  }}
                >
                  {t.formWriteAnother}
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit}>
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
                  <label id="ct-subject-label" htmlFor="ct-subject">
                    {t.formSubject}
                  </label>
                  <Select
                    id="ct-subject"
                    labelId="ct-subject-label"
                    value={form.subject}
                    options={c.subjects}
                    onChange={(subject) => setForm((f) => ({ ...f, subject }))}
                    {...edit('subjects')}
                  />
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-message">{t.formMessage}</label>
                  <textarea
                    id="ct-message"
                    rows="6"
                    required
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                <input
                  className="ct-trap"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={set('website')}
                />

                {failed && (
                  <p className="ct-error" role="alert">
                    {t.formError(c.email)}
                  </p>
                )}

                <div className="ct-submit-row">
                  <button type="submit" className="btn" disabled={sending}>
                    {sending ? t.formSending : t.formSend}
                    <Arrow />
                  </button>
                  <p className="ct-legal">{t.formLegal}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sec sec--deep" data-nav-tone="light">
        <div className="wrap split">
          <div className="split-aside split-aside--sticky">
            <span className="label" {...edit('faqTitle')}>
              {c.faqTitle}
            </span>
          </div>
          <div className="split-main">
            <Accordion items={c.faq} editPath={['contact', 'faq']} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
