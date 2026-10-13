import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
import Home from './pages/Home'

/* Every page but the home is its own file, loaded when it is first opened
   (and fetched ahead while the browser is idle, see prefetchPages), so the
   first visit only downloads the home. */
const loaders = {
  residences: () => import('./pages/Residences'),
  residenceDetail: () => import('./pages/ResidenceDetail'),
  apartmentDetail: () => import('./pages/ApartmentDetail'),
  about: () => import('./pages/About'),
  contact: () => import('./pages/Contact'),
  collaboration: () => import('./pages/Collaboration'),
  legal: () => import('./pages/Legal'),
  // The 3D models of the residences page.
  maquettes: () => import('./maquette/MaquetteViews'),
}

const Residences = lazy(loaders.residences)
const ResidenceDetail = lazy(loaders.residenceDetail)
const ApartmentDetail = lazy(loaders.apartmentDetail)
const About = lazy(loaders.about)
const Contact = lazy(loaders.contact)
const Collaboration = lazy(loaders.collaboration)
const Legal = lazy(loaders.legal)

const page = (Page) => (
  <Suspense fallback={null}>
    <Page />
  </Suspense>
)

/**
 * Downloads the other pages in the background once the first page is shown
 * and the browser has nothing else to do, so moving around the site is
 * instant. Skipped when the visitor asked to save data.
 */
export function prefetchPages() {
  if (navigator.connection?.saveData) return
  const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1500))
  idle(() => Object.values(loaders).forEach((load) => load().catch(() => {})))
}

/* The public pages, shared by the site itself and the admin's visual editor,
   which renders the same pages around a draft of the content. */
export const siteRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={page(About)} />
    <Route path="/contact" element={page(Contact)} />
    <Route path="/collaboration" element={page(Collaboration)} />
    <Route path="/legal/:doc" element={page(Legal)} />
    <Route path="/residence" element={page(Residences)} />
    <Route path="/residence/:slug" element={page(ResidenceDetail)} />
    <Route path="/residence/:slug/:apartmentId" element={page(ApartmentDetail)} />
  </>
)
