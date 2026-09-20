import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocalizedApartment, useUI } from '../i18n/useLocalizedContent'
import Lightbox from '../components/Lightbox'
import { PlaceMap, TransportList, NearbyList } from '../components/Place'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import '../styles/page.css'
import './ApartmentDetail.css'

// Internal sentinel for "no filter" — decoupled from the translated label
// (t.all) shown in the UI, so the comparison never breaks on a language switch.
const ALL = '__all__'

const Arrow = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function ApartmentDetail() {
  const { slug, apartmentId } = useParams()
  const match = useLocalizedApartment(slug, apartmentId)
  const t = useUI()

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

  // The apartment ships one photograph; the residence gallery fills out the
  // strip. A per-apartment `gallery` takes precedence when the data has one.
  // The apartment ships one photograph; the residence gallery fills out the
  // grid. When that photograph is already in the gallery, the gallery entry
  // wins — it carries the room it belongs to.
  const apartmentSrc = normalizeImage(apartment.image).src
  const inGallery = residence.gallery.some(
    (g) => normalizeImage(g.image).src === apartmentSrc,
  )
  const shots = (
    apartment.gallery?.length > 0
      ? apartment.gallery
      : [
          ...(inGallery
            ? []
            : [
                {
                  image: apartment.image,
                  alt: `${apartment.type} — ${residence.name}`,
                  category: t.categoryLivingRoom,
                },
              ]),
          ...residence.gallery,
        ]
  ).map((shot) => ({ ...shot, category: shot.category ?? t.other }))

  const rooms = [...new Set(shots.map((shot) => shot.category))]
  const visibleShots =
    room === ALL ? shots : shots.filter((shot) => shot.category === room)

  // Rendered twice: above the grid, and inside the viewer's toolbar.
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
          <span className="ap-room-count">
            {option === ALL
              ? shots.length
              : shots.filter((s) => s.category === option).length}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <main className={`pg ap${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Visual + copy ---------- */}
      <section className="ap-main" data-nav-tone="light">
        <div className="ap-wrap ap-cols">
          <div className="ap-gallery">
            {rooms.length > 1 && <div data-reveal>{roomFilter}</div>}

            {/* Images: a plain grid, two per line. */}
            <ul className="ap-shots" data-reveal>
              {visibleShots.map((shot, i) => {
                const shotImg = normalizeImage(shot.image)
                return (
                  <li key={shotImg.src}>
                    <button
                      type="button"
                      className="ap-shot"
                      onClick={() => setLightbox(i)}
                      aria-label={`${t.enlarge} : ${shot.alt}`}
                      data-cursor={t.enlarge}
                    >
                      <img
                        src={shotImg.src}
                        alt={shot.alt}
                        loading="lazy"
                        decoding="async"
                        style={imageVars(shot.image)}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Holds its place while the images scroll past. */}
          <aside className="ap-card" data-reveal style={{ '--d': '100ms' }}>
            <Link to={`/residence/${residence.slug}`} className="ap-back">
              <span className="ap-back-icon">
                <Arrow size={13} />
              </span>
              {t.backToResidence}
            </Link>

            <span className="ap-card-ref">{residence.name}</span>
            <h1 className="ap-card-title">
              <span className="pg-mask">
                <span className="pg-mask-inner">{apartment.type}</span>
              </span>
            </h1>

            <p className="ap-card-lead">{apartment.description}</p>

            <h2 className="ap-mini-title">{t.amenities}</h2>
            <ul className="ap-features">
              {apartment.features.map((feature, i) => (
                <li key={feature}>
                  <span className="ap-feature-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="ap-actions">
              <Link className="ap-btn" to="/contact?sujet=visite">
                {t.organizeVisit}
                <Arrow size={16} />
              </Link>
              <Link className="ap-btn ap-btn--ghost" to="/contact">
                {t.askQuestion}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Location ---------- */}
      <section className="ap-place" data-nav-tone="light">
        <div className="ap-wrap">
          <span className="pg-eyebrow ap-place-eyebrow" data-reveal>
            {t.localisation}
          </span>

          <p className="ap-place-lead" data-reveal>
            {residence.place.summary}
          </p>

          <div className="ap-place-grid">
            <div data-reveal>
              <PlaceMap address={residence.place.address} title={residence.name} />
            </div>

            <div className="ap-place-info">
              <div data-reveal style={{ '--d': '80ms' }}>
                <h2 className="pl-mini-title">{t.transports}</h2>
                <TransportList transports={residence.place.transports} />
              </div>

              <div data-reveal style={{ '--d': '160ms' }}>
                <h2 className="pl-mini-title">{t.nearby}</h2>
                <NearbyList items={residence.place.nearby} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Other apartments ---------- */}
      {others.length > 0 && (
        <section className="pg-block" data-nav-tone="light">
          <div className="ap-wrap">
            <span className="pg-eyebrow pg-eyebrow--top" data-reveal>
              {t.alsoAvailable}
            </span>

            <ul className="ap-others">
              {others.map((other, i) => (
                <li key={other.id} data-reveal style={{ '--d': `${i * 70}ms` }}>
                  <Link
                    className="ap-other"
                    to={`/residence/${residence.slug}/${other.id}`}
                  >
                    <span className="ap-other-media">
                      <img
                        src={normalizeImage(other.image).src}
                        alt=""
                        style={imageVars(other.image)}
                      />
                    </span>
                    <span className="ap-other-type">{other.type}</span>
                    <span className="ap-other-facts">
                      {[Number(other.surface) > 0 && `${other.surface} m²`, other.outdoor]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
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
