import { Link } from 'react-router-dom'
import zeloraLogo from '../assets/brand/zelora-logo.png'
import './Hero.css'

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__text">
        <p className="hero__categories">Fashion • Bridal • Casual • Jewelry</p>
        <h1 className="hero__heading">Where ideas turn into style. ✨</h1>
        <p className="hero__body">
          Zelorà is a fashion and lifestyle house built on a simple belief: a
          good idea deserves to be worn well. Explore pieces made for
          everyday life and the moments that matter most.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore Collection
        </Link>
      </div>

      <div className="hero__image">
        <img
          src={zeloraLogo}
          alt="Zelorà logo"
        />
      </div>
    </section>
  )
}

export default Hero
