import Hero from '../components/Hero'
import Intro from '../components/Intro'
import ScrollStory from '../components/ScrollStory'
import Location from '../components/Location'
import Gallery from '../components/Gallery'

function Home() {
  return (
    <>
      <Hero />
      {/* Reserves the scroll space the fixed hero occupies. */}
      <div className="hero-spacer" />
      <Intro />
      <ScrollStory />
      <Location />
      <Gallery />
    </>
  )
}

export default Home
