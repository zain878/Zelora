import zeloraLogo from '../assets/brand/zelora-logo.png'
import './BrandIntro.css'

function BrandIntro() {
  return (
    <section id="about" className="brand-intro">
      <div className="container brand-intro__inner">
        <div className="brand-intro__image">
          <img
            src={zeloraLogo}
            alt="Zelorà logo"
          />
        </div>

        <div className="brand-intro__text">
          <h2 className="section-heading">About Zelorà</h2>
          <p>
            Zelorà began as a simple idea: that personal style shouldn't be
            confined to one category. We design across fashion, bridal,
            casual wear and jewelry, treating each as part of the same
            wardrobe rather than separate worlds.
          </p>
          <p>
            Every piece is considered from first sketch to finish, with an
            emphasis on quality materials, honest construction and details
            that last beyond a season. We're just getting started — thank you
            for being here early.
          </p>
        </div>
      </div>
    </section>
  )
}

export default BrandIntro
