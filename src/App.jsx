import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { prefetchPages, siteRoutes } from './siteRoutes'

// The admin is only for the client's team: visitors never download it.
const Admin = lazy(() => import('./pages/Admin'))

function App() {
  const { pathname } = useLocation()

  // A new page starts at its top. Instant, not smooth: gliding up through
  // the previous page would be a scroll animation nobody asked for.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // Once the first page is up, the others download quietly in the background.
  useEffect(() => {
    if (!window.location.pathname.startsWith('/admin')) prefetchPages()
  }, [])

  // The residences split-screen is a full-viewport chooser: no bar, no footer,
  // nothing to scroll past — it carries its own back-to-home control instead.
  const isSplitScreen = pathname === '/residence'
  // The admin panel is its own shell: no site chrome around it.
  const isAdmin = pathname.startsWith('/admin')
  const hideChrome = isSplitScreen || isAdmin

  return (
    <>
      {!hideChrome && <Navbar />}
      <Routes>
        {siteRoutes}
        {/* The visual editor previews the site pages below /admin. */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  )
}

export default App
