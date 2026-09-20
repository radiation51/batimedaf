import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocalizedResidence, useUI } from '../i18n/useLocalizedContent'
import Amenities from '../components/Amenities'
import Lightbox from '../components/Lightbox'
import { PlaceMap, TransportList, NearbyList } from '../components/Place'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import './ResidenceDetail.css'

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


function ResidenceDetail() {
  const { slug } = useParams()
  const residence = useLocalizedResidence(slug)
  const t = useUI()

  // Called before the early return below: hooks must run on every render.
  usePageMeta({
    title: residence ? residence.name : t.residence,
    description: residence?.description,
  })

  const { ref: pageRef, ready } = useReveal([slug])
  const heroBgRef = useRef(null)
  const heroZoom = residence ? normalizeImage(residence.image).zoom : 1

  // Index of the gallery image shown full screen, or null.
  const [lightbox, setLightbox] = useState(null)

  // Hero parallax: the image drifts slower than the page. The base 1.08
  // scale is headroom for that drift, not the admin's own crop zoom — the
  // two multiply so a picture zoomed in the crop tool stays zoomed here.
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const el = heroBgRef.current
      if (!el) return
      const y = window.scrollY || 0
      el.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1.08 * heroZoom})`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug, heroZoom])

  // A different residence means a different gallery: never keep an index.
  useEffect(() => setLightbox(null), [slug])

  if (!residence) return <Navigate to="/residence" replace />

  const apartments = residence.apartments

  // A unit whose surface isn't filled in yet (0) must not skew the range.
  const surfaces = apartments.map((a) => Number(a.surface)).filter((s) => s > 0)
  const minSurface = Math.min(...surfaces)
  const maxSurface = Math.max(...surfaces)
  const surfaceRange = !surfaces.length
    ? ''
    : minSurface === maxSurface
      ? `${minSurface} m²`
      : `${minSurface} à ${maxSurface} m²`

  return (
    <main className={`rd${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Hero ---------- */}
      <header className="rd-hero" data-nav-tone="dark">
        <div
          className="rd-hero-bg"
          ref={heroBgRef}
          style={{
            backgroundImage: `url(${normalizeImage(residence.image).src})`,
            ...imageVars(residence.image),
          }}
        />
        <div className="rd-hero-veil" />

        <div className="rd-hero-inner">
          <Link to="/residence" className="rd-back">
            <span className="rd-back-icon">
              <Arrow size={13} />
            </span>
            {t.allResidences}
          </Link>

          <div className="rd-hero-text">
            <span className="rd-hero-tagline">{residence.tagline}</span>
            <h1 className="rd-hero-name">
              <span className="rd-mask">
                <span className="rd-mask-inner">{residence.name}</span>
              </span>
            </h1>
            <p className="rd-hero-place">{residence.location}</p>
          </div>
        </div>

        <span className="rd-scroll-cue" aria-hidden="true">
          <span />
        </span>
      </header>

      {/* ---------- Amenities ---------- */}
      <section className="rd-block" id="prestations" data-nav-tone="light">
        <div className="rd-wrap">
          <Amenities items={residence.features} />

          {residence.presentation && (
            <div className="rd-presentation" data-reveal>
              <span className="rd-eyebrow" data-reveal>
                {t.prestationsEyebrow}
              </span>
              <p className="rd-text">{residence.presentation}</p>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Apartments ---------- */}
      <section className="rd-block rd-apts" id="appartements" data-nav-tone="light">
        <div className="rd-wrap">
          <div className="rd-apts-head">
            <span className="rd-eyebrow" data-reveal>
              {t.apartmentsEyebrowPrefix}
              {t.availableApartments}
            </span>

            <p className="rd-apts-summary" data-reveal style={{ '--d': '60ms' }}>
              {residence.apartments.length} {t.lots}
              {surfaceRange && ` · ${surfaceRange}`}
            </p>
          </div>

          <ul className="rd-cards">
            {apartments.map((apartment, i) => (
              <li
                key={apartment.id}
                data-reveal
                style={{ '--d': `${(i % 3) * 90}ms` }}
              >
                <Link
                  to={`/residence/${residence.slug}/${apartment.id}`}
                  className="rd-card"
                >
                  <span className="rd-card-media">
                    <img
                      src={normalizeImage(apartment.image).src}
                      alt=""
                      loading="lazy"
                      style={imageVars(apartment.image)}
                    />
                  </span>

                  <span className="rd-card-body">
                    <span className="rd-card-top">
                      <span className="rd-card-type">{apartment.type}</span>
                    </span>

                    <span className="rd-card-facts">
                      {Number(apartment.surface) > 0 && (
                        <span>
                          <b>{apartment.surface}</b> m²
                        </span>
                      )}
                      {apartment.floor && <span>{apartment.floor}</span>}
                      {apartment.orientation && <span>{apartment.orientation}</span>}
                      {apartment.outdoor && <span>{apartment.outdoor}</span>}
                    </span>

                    <span className="rd-card-foot">
                      <span className="rd-card-cta">{t.seeLot}</span>
                      <span className="rd-card-arrow">
                        <Arrow size={16} />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Location ---------- */}
      <section className="rd-block rd-place" id="localisation" data-nav-tone="light">
        <div className="rd-wrap">
          <span className="rd-eyebrow rd-eyebrow--top" data-reveal>
            {t.localisationEyebrow}
          </span>

          <p className="rd-place-lead" data-reveal>
            {residence.place.summary}
          </p>

          <div className="rd-place-layout">
            {/* The map holds its position while the lists scroll past it. */}
            <div className="rd-map-col" data-reveal>
              <PlaceMap address={residence.place.address} title={residence.name} />
            </div>

            <div className="rd-place-info">
              <div className="rd-place-block" data-reveal style={{ '--d': '80ms' }}>
                <h3 className="pl-mini-title">{t.transports}</h3>
                <TransportList transports={residence.place.transports} />
              </div>

              <div className="rd-place-block" data-reveal style={{ '--d': '160ms' }}>
                <h3 className="pl-mini-title">{t.nearby}</h3>
                <NearbyList items={residence.place.nearby} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="rd-block rd-gallery" id="galerie" data-nav-tone="light">
        <div className="rd-wrap">
          <span className="rd-eyebrow rd-eyebrow--top" data-reveal>
            {t.galerieEyebrow}
          </span>
        </div>

        {/* Full-bleed: the strip runs edge to edge, outside the page gutter. */}
        <div className="rd-marquee" data-reveal>
          {/* Rendered twice so the track loops seamlessly — the animation
              shifts it by exactly one copy and restarts. */}
          <div className="rd-track">
            {[0, 1].map((copy) =>
              residence.gallery.map((shot, i) => {
                const shotImg = normalizeImage(shot.image)
                return (
                  <figure
                    className="rd-slide"
                    key={`${copy}-${shotImg.src}`}
                    aria-hidden={copy === 1 ? 'true' : undefined}
                  >
                    <button
                      type="button"
                      className="rd-shot"
                      onClick={() => setLightbox(i)}
                      tabIndex={copy === 1 ? -1 : undefined}
                      aria-label={`${t.enlarge} : ${shot.alt}`}
                      data-cursor={t.enlarge}
                    >
                      <img
                        src={shotImg.src}
                        alt={copy === 1 ? '' : shot.alt}
                        loading="lazy"
                        decoding="async"
                        style={imageVars(shot.image)}
                      />
                    </button>
                    <figcaption>{shot.alt}</figcaption>
                  </figure>
                )
              }),
            )}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="rd-cta" data-nav-tone="dark">
        <div className="rd-wrap rd-cta-inner">
          <h2 className="rd-cta-title" data-reveal>
            {t.wantToVisit}
            <br />
            {residence.name}&nbsp;?
          </h2>
          <Link className="rd-cta-btn" to="/contact?sujet=visite" data-reveal style={{ '--d': '120ms' }}>
            {t.bookCall}
            <Arrow size={16} />
          </Link>
        </div>
      </section>

      {lightbox !== null && (
        <Lightbox
          shots={residence.gallery}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  )
}

export default ResidenceDetail
