import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import CustomCursor from './components/CustomCursor'
import Admin from './pages/Admin'
import { siteRoutes } from './siteRoutes'
import './App.css'

// Must stay in step with PageTransition.css: 0.5s travel + 0.16s max stagger.
const PHASE_MS = 680

function App() {
  const location = useLocation()
  // The route actually rendered. It lags behind `location` so the outgoing
  // page stays on screen until the columns have covered it.
  const [displayLocation, setDisplayLocation] = useState(location)
  const [phase, setPhase] = useState('idle')
  const timers = useRef([])
  // Tracked in a ref rather than read from `displayLocation`: swapping the
  // page mid-transition would otherwise re-run this effect, and its cleanup
  // would cancel the pending "idle" timer — leaving the overlay in `reveal`,
  // where pointer-events:auto silently swallows every click on the site.
  const pendingPath = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname === pendingPath.current) return
    pendingPath.current = location.pathname

    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('cover')

    timers.current.push(
      // Swap the page while it is hidden behind the columns.
      setTimeout(() => {
        setDisplayLocation(location)
        window.scrollTo(0, 0)
        // The navbar re-reads what is behind it; a route change fires no
        // scroll event, so tell it explicitly.
        window.dispatchEvent(new CustomEvent('page:swapped'))
        setPhase('reveal')
      }, PHASE_MS),
      setTimeout(() => setPhase('idle'), PHASE_MS * 2),
    )

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [location])

  // The residences split-screen is a full-viewport chooser: no bar, no footer,
  // nothing to scroll past — it carries its own back-to-home control instead.
  const isSplitScreen = displayLocation.pathname === '/residence'
  // The admin panel is its own shell: no site chrome around it.
  const isAdmin = displayLocation.pathname.startsWith('/admin')
  const hideChrome = isSplitScreen || isAdmin

  return (
    <>
      <PageTransition phase={phase} />
      {!isAdmin && <CustomCursor />}
      {!hideChrome && <Navbar />}
      <Routes location={displayLocation}>
        {siteRoutes}
        {/* The visual editor previews the site pages below /admin. */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  )
}

export default App
