import { Link } from 'react-router-dom'
import products from '../data/products.js'
import { handleImageError } from '../utils/image.js'
import './FeaturedCollection.css'

const featuredProducts = products.filter((product) => product.featured)

function FeaturedCollection() {
  return (
    <section id="selected" className="featured">
      <div className="container">
        <div className="featured__header">
          <h2 className="section-heading">Selected pieces</h2>
          <p className="section-subtext">
            A small edit from across the collection, spanning fashion,
            bridal, casual and jewelry.
          </p>
          <Link to="/shop" className="featured__link">
            View the full shop
          </Link>
        </div>

        <ul className="featured__grid">
          {featuredProducts.map((product) => (
            <li key={product.id} className="featured__item">
              <Link to={`/shop/${product.id}`}>
                <div className="featured__image">
                  <img src={product.image} alt={product.name} onError={handleImageError} />
                </div>
                <p className="featured__name">{product.name}</p>
                <p className="featured__category">{product.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FeaturedCollection
