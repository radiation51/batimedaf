import Hero from '../components/Hero'
import Intro from '../components/Intro'
import HomeResidences from '../components/HomeResidences'
import HomeApartments from '../components/HomeApartments'
import Approach from '../components/Approach'
import Gallery from '../components/Gallery'
import Location from '../components/Location'

function Home() {
  return (
    <main className="home">
      <Hero />
      <Intro />
      <HomeResidences />
      <HomeApartments />
      <Approach />
      <Gallery />
      <Location />
    </main>
  )
}

export default Home
