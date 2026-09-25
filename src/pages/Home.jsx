import Hero from '../components/Hero.jsx'
import FeaturedCollection from '../components/FeaturedCollection.jsx'
import BrandIntro from '../components/BrandIntro.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

function Home() {
  useDocumentTitle('Zelorà — Where ideas turn into style.')

  return (
    <>
      <Hero />
      <FeaturedCollection />
      <BrandIntro />
    </>
  )
}

export default Home
