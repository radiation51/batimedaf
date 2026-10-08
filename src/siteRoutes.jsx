import { Route } from 'react-router-dom'
import Home from './pages/Home'
import Residences from './pages/Residences'
import ResidenceDetail from './pages/ResidenceDetail'
import ApartmentDetail from './pages/ApartmentDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Collaboration from './pages/Collaboration'
import Legal from './pages/Legal'

/* The public pages, shared by the site itself and the admin's visual editor,
   which renders the same pages around a draft of the content. */
export const siteRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/collaboration" element={<Collaboration />} />
    <Route path="/legal/:doc" element={<Legal />} />
    <Route path="/residence" element={<Residences />} />
    <Route path="/residence/:slug" element={<ResidenceDetail />} />
    <Route path="/residence/:slug/:apartmentId" element={<ApartmentDetail />} />
  </>
)
