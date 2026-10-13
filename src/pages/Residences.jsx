import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedContent, useUI } from '../i18n/useLocalizedContent'
import { usePageMeta } from '../hooks/usePageMeta'
import { useEdit } from '../content/editable'
import './Residences.css'

// The 3D models are loaded on demand, so three.js stays out of the other pages.
const MaquetteCards = lazy(() => import('../maquette/MaquetteViews'))

/**
 * The residences chooser: a full-screen page with no bar or footer (see
 * App.jsx) and its own way back home. Each residence stands as an
 * architectural model on a ground of its own colour; pointing at it
 * separates its storeys, the taken ones in grey.
 */
function Residences() {
  const content = useLocalizedContent()
  const t = useUI()
  const residences = content.residences
  const edit = useEdit(['residences'])

  usePageMeta({
    title: t.ourResidencesHeading,
    description: content.about.intro,
  })

  return (
    <main className="residences" data-nav-tone="light">
      <h1 className="residences-heading">{t.ourResidencesHeading}</h1>

      <Link to="/" className="residences-back" aria-label={t.backToHome}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M12.5 8h-9M7.5 12.5 3 8l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <Suspense fallback={null}>
        <MaquetteCards residences={residences} edit={edit} t={t} />
      </Suspense>
    </main>
  )
}

export default Residences
