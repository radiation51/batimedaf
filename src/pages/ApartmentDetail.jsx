import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocalizedApartment, useUI } from '../i18n/useLocalizedContent'
import Arrow from '../components/Arrow'
import Lightbox from '../components/Lightbox'
import PlaceSection from '../components/PlaceSection'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit, useResidencePath } from '../content/editable'
import './ApartmentDetail.css'

// Internal sentinel for "no filter" — decoupled from the translated label
// (t.all) shown in the UI, so the comparison never breaks on a language switch.
const ALL = '__all__'

const pad = (n) => String(n).padStart(2, '0')

function ApartmentDetail() {
  const { slug, apartmentId } = useParams()
  const match = useLocalizedApartment(slug, apartmentId)
  const t = useUI()
  const residencePath = useResidencePath(slug)
  const edit = useEdit()

  // Hooks run before the early return: their order must never change.
  usePageMeta({
    title: match
      ? `${match.apartment.type} · ${match.residence.name}`
      : t.apartment,
    description: match?.apartment.description,
  })

  // Room filter above the images.
  const [room, setRoom] = useState(ALL)
  // Index into the *filtered* images, or null when the viewer is closed.
  const [lightbox, setLightbox] = useState(null)

  const { ref: pageRef, ready } = useReveal([slug, apartmentId, room])

  // Moving to another apartment keeps this component mounted, so the filter
  // must be cleared by hand — the next apartment may not have that room, and
  // the grid would come up empty.
  useEffect(() => {
    setRoom(ALL)
    setLightbox(null)
  }, [slug, apartmentId])

  if (!match) return <Navigate to="/residence" replace />

  const { residence, apartment } = match
  const others = residence.apartments.filter((a) => a.id !== apartment.id)

  // Content paths, for the admin editor's click-to-edit tags.
  const apartmentPath = (id) => [
    ...residencePath,
    'apartments',
    residence.apartments.findIndex((a) => a.id === id),
  ]
  const ownPath = apartmentPath(apartment.id)

  // Tells the admin which apartment a visit request is about.
  const contactAbout = encodeURIComponent(
    `${residence.name} — ${apartment.type} (${apartment.reference})`,
  )

  // The apartment's own gallery when it has one; otherwise its photograph
  // followed by the residence gallery. When that photograph is already in
  // the gallery, the gallery entry wins — it carries the room it belongs to.
  const apartmentSrc = normalizeImage(apartment.image).src
  const inGallery = residence.gallery.some(
    (g) => normalizeImage(g.image).src === apartmentSrc,
  )
  const shots = (
    apartment.gallery?.length > 0
      ? apartment.gallery.map((shot, i) => ({
          ...shot,
          editPath: [...ownPath, 'gallery', i, 'image'],
        }))
      : [
          ...(inGallery
            ? []
            : [
                {
                  image: apartment.image,
                  alt: `${apartment.type} — ${residence.name}`,
                  category: t.categoryLivingRoom,
                  editPath: [...ownPath, 'image'],
                },
              ]),
          ...residence.gallery.map((shot, i) => ({
            ...shot,
            editPath: [...residencePath, 'gallery', i, 'image'],
          })),
        ]
  ).map((shot) => ({ ...shot, category: shot.category ?? t.other }))

  const rooms = [...new Set(shots.map((shot) => shot.category))]
  const visibleShots =
    room === ALL ? shots : shots.filter((shot) => shot.category === room)

  // The facts that are filled in, in reading order.
  const facts = [
    ['surface', t.factSurface, Number(apartment.surface) > 0 && `${apartment.surface} m²`],
    ['floor', t.factFloor, apartment.floor],
    ['orientation', t.factOrientation, apartment.orientation],
    ['outdoor', t.factOutdoor, apartment.outdoor],
  ].filter(([, , value]) => value)

  // Rendered twice: above the images, and inside the viewer's top bar.
  const roomFilter = (
    <div className="ap-rooms">
      {[ALL, ...rooms].map((option) => (
        <button
          key={option}
          type="button"
          className={`ap-room${room === option ? ' is-active' : ''}`}
          onClick={() => {
            setRoom(option)
            // The filtered list changes under it; start from its first image.
            if (lightbox !== null) setLightbox(0)
          }}
          aria-pressed={room === option}
        >
          {option === ALL ? t.all : option}
          <sup>
            {option === ALL
              ? shots.length
              : shots.filter((s) => s.category === option).length}
          </sup>
        </button>
      ))}
    </div>
  )

  return (
    <main className={`ap${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Particulars + photographs ---------- */}
      <section className="ap-main" data-nav-tone="light">
        <div className="wrap ap-cols">
          {/* Holds its place while the photographs scroll past. */}
          <aside className="ap-info">
            <Link to={`/residence/${residence.slug}`} className="back">
              <Arrow size={16} />
              {t.backToResidence}
            </Link>

            <span className="label ap-residence" {...edit(...residencePath, 'name')}>
              {residence.name}
            </span>
            <h1 className="d2 ap-title" {...edit(...ownPath, 'type')}>
              {apartment.type}
            </h1>

            <p className="ap-lead" {...edit(...ownPath, 'description')}>
              {apartment.description}
            </p>

            {facts.length > 0 && (
              <dl className="ap-facts">
                {facts.map(([key, label, value]) => (
                  <div key={key}>
                    <dt className="label">{label}</dt>
                    <dd {...edit(...ownPath, key)}>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <h2 className="label ap-features-title">{t.amenities}</h2>
            <ul className="ap-features">
              {apartment.features.map((feature, i) => (
                <li key={i}>
                  <span className="num">{pad(i + 1)}</span>
                  <span {...edit(...ownPath, 'features', i)}>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="ap-actions">
              <Link
                className="btn"
                to={`/contact?sujet=visite&bien=${contactAbout}`}
              >
                {t.organizeVisit}
                <Arrow />
              </Link>
              <Link className="tlink" to={`/contact?bien=${contactAbout}`}>
                {t.askQuestion}
              </Link>
            </div>
          </aside>

          <div className="ap-gallery">
            {rooms.length > 1 && roomFilter}

            <ul className="ap-shots">
              {visibleShots.map((shot, i) => (
                <li key={`${room}-${i}`}>
                  <button
                    type="button"
                    className="plate ap-shot"
                    onClick={() => setLightbox(i)}
                    aria-label={`${t.enlarge} : ${shot.alt}`}
                  >
                    <img
                      src={normalizeImage(shot.image).src}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                      style={imageVars(shot.image)}
                      {...edit(...shot.editPath)}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Location ---------- */}
      <PlaceSection
        residence={residence}
        residencePath={residencePath}
        label={t.localisation}
        deep
        titleTag="h2"
      />

      {/* ---------- Other apartments ---------- */}
      {others.length > 0 && (
        <section className="sec" data-nav-tone="light">
          <div className="wrap">
            <span className="label ap-others-label">{t.alsoAvailable}</span>

            <ul className="ap-others">
              {others.map((other) => (
                <li key={other.id} data-reveal>
                  <Link
                    className="ap-other"
                    to={`/residence/${residence.slug}/${other.id}`}
                  >
                    <span className="plate ap-other-media">
                      <img
                        src={normalizeImage(other.image).src}
                        alt=""
                        loading="lazy"
                        style={imageVars(other.image)}
                        {...edit(...apartmentPath(other.id), 'image')}
                      />
                    </span>
                    <span className="ap-other-text">
                      <span
                        className="ap-other-type"
                        {...edit(...apartmentPath(other.id), 'type')}
                      >
                        {other.type}
                      </span>
                      <span className="ap-other-facts">
                        {[Number(other.surface) > 0 && `${other.surface} m²`, other.outdoor]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {lightbox !== null && (
        <Lightbox
          shots={visibleShots}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
          toolbar={rooms.length > 1 ? roomFilter : null}
        />
      )}
    </main>
  )
}

export default ApartmentDetail
