import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocalizedResidence, useUI } from '../i18n/useLocalizedContent'
import Arrow from '../components/Arrow'
import Amenities from '../components/Amenities'
import Lightbox from '../components/Lightbox'
import ResidenceGallery from '../components/ResidenceGallery'
import PlaceSection from '../components/PlaceSection'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeImage, imageVars } from '../lib/imageStyle'
import { useEdit, useResidencePath } from '../content/editable'
import './ResidenceDetail.css'

const pad = (n) => String(n).padStart(2, '0')

function ResidenceDetail() {
  const { slug } = useParams()
  const residence = useLocalizedResidence(slug)
  const t = useUI()
  const residencePath = useResidencePath(slug)
  const edit = useEdit(residencePath)

  // Called before the early return below: hooks must run on every render.
  usePageMeta({
    title: residence ? residence.name : t.residence,
    description: residence?.description,
  })

  const { ref: pageRef, ready } = useReveal([slug])

  // Index of the gallery image shown full screen, or null.
  const [lightbox, setLightbox] = useState(null)

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

  // The page's contents, listed under the cover. Buttons rather than
  // #anchors: the admin's preview would read a hash link as a page change.
  const chapters = [
    ['prestations', t.amenities],
    ['appartements', t.availableApartments],
    ['localisation', t.localisation],
    ['galerie', t.gallery],
  ]
  const jumpTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className={`rd${ready ? ' is-ready' : ''}`} ref={pageRef}>
      {/* ---------- Cover ---------- */}
      <header className="rd-head" data-nav-tone="light">
        <div className="wrap">
          <Link to="/residence" className="back">
            <Arrow size={16} />
            {t.allResidences}
          </Link>

          <div className="rd-head-grid">
            <div className="rd-head-title">
              <span className="label" {...edit('tagline')}>
                {residence.tagline}
              </span>
              <h1 className="d1 rd-name" {...edit('name')}>
                {residence.name}
              </h1>
            </div>
            <p className="rd-place" {...edit('location')}>
              {residence.location}
            </p>
          </div>
        </div>

        <div className="rd-cover-frame">
          <div
            className="rd-cover"
            style={{
              backgroundImage: `url(${normalizeImage(residence.image).src})`,
              ...imageVars(residence.image),
            }}
            {...edit('image')}
          />
        </div>

        <nav className="wrap rd-contents" aria-label={t.contents}>
          {chapters.map(([id, label], i) => (
            <button key={id} type="button" onClick={() => jumpTo(id)}>
              <span className="num">{pad(i + 1)}</span>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ---------- Amenities ---------- */}
      <section className="sec rd-sec" id="prestations" data-nav-tone="light">
        {/* Label on top, then text and amenities across the whole width. */}
        <div className="wrap">
          <span className="label rd-prestations-label">{t.prestationsEyebrow}</span>
          {residence.presentation && (
            <p className="rd-lead" data-reveal {...edit('presentation')}>
              {residence.presentation}
            </p>
          )}
          <Amenities
            items={residence.features}
            editPath={[...residencePath, 'features']}
          />
        </div>
      </section>

      {/* ---------- Apartments ---------- */}
      <section
        className="sec sec--deep rd-sec"
        id="appartements"
        data-nav-tone="light"
      >
        <div className="wrap">
          <div className="split rd-apts-head">
            <div className="split-aside">
              <span className="label">
                {t.apartmentsEyebrowPrefix}
                {t.availableApartments}
              </span>
            </div>
            <p className="split-main d3" data-reveal>
              {apartments.length} {t.lots}
              {surfaceRange && <span className="rd-range"> · {surfaceRange}</span>}
            </p>
          </div>

          <ul className="rd-lots">
            {apartments.map((apartment, i) => (
              <li key={apartment.id} data-reveal>
                <Link
                  to={`/residence/${residence.slug}/${apartment.id}`}
                  className="rd-lot"
                >
                  <span className="plate rd-lot-media">
                    <img
                      src={normalizeImage(apartment.image).src}
                      alt=""
                      loading="lazy"
                      style={imageVars(apartment.image)}
                      {...edit('apartments', i, 'image')}
                    />
                  </span>

                  <span className="rd-lot-num num">{pad(i + 1)}</span>

                  <span className="rd-lot-body">
                    <span
                      className="d3 rd-lot-type"
                      {...edit('apartments', i, 'type')}
                    >
                      {apartment.type}
                    </span>

                    <span className="rd-lot-facts">
                      {Number(apartment.surface) > 0 && (
                        <span {...edit('apartments', i, 'surface')}>
                          {apartment.surface} m²
                        </span>
                      )}
                      {apartment.floor && (
                        <span {...edit('apartments', i, 'floor')}>
                          {apartment.floor}
                        </span>
                      )}
                      {apartment.orientation && (
                        <span {...edit('apartments', i, 'orientation')}>
                          {apartment.orientation}
                        </span>
                      )}
                      {apartment.outdoor && (
                        <span {...edit('apartments', i, 'outdoor')}>
                          {apartment.outdoor}
                        </span>
                      )}
                    </span>

                    {apartment.description && (
                      <span
                        className="rd-lot-desc"
                        {...edit('apartments', i, 'description')}
                      >
                        {apartment.description}
                      </span>
                    )}
                  </span>

                  <span className="rd-lot-cta">
                    {t.seeLot}
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Location ---------- */}
      <PlaceSection
        residence={residence}
        residencePath={residencePath}
        label={t.localisationEyebrow}
        id="localisation"
      />

      {/* ---------- Gallery ---------- */}
      <section className="sec rd-sec rd-gallery" id="galerie" data-nav-tone="light">
        <div className="wrap">
          <ResidenceGallery
            label={t.galerieEyebrow}
            shots={residence.gallery}
            onOpen={setLightbox}
            editImage={(i) => edit('gallery', i, 'image')}
          />
        </div>
      </section>

      {/* ---------- Invitation ---------- */}
      <section className="band" data-nav-tone="dark">
        <div className="wrap band-inner">
          <h2 className="d2 band-title">
            {t.wantToVisit} {residence.name}&nbsp;?
          </h2>
          <Link
            className="btn btn--light"
            to={`/contact?sujet=visite&bien=${encodeURIComponent(residence.name)}`}
          >
            {t.bookCall}
            <Arrow />
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
