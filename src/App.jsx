import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import { siteRoutes } from './siteRoutes'

function App() {
  const { pathname } = useLocation()

  // A new page starts at its top. Instant, not smooth: gliding up through
  // the previous page would be a scroll animation nobody asked for.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

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
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  )
}

export default App
