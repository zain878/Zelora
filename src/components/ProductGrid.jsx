import { Link } from 'react-router-dom'
import { handleImageError } from '../utils/image.js'
import './ProductGrid.css'

function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="product-grid__empty">No pieces in this category yet.</p>
  }

  return (
    <ul className="product-grid">
      {products.map((product) => (
        <li key={product.id} className="product-grid__item">
          <Link to={`/shop/${product.id}`} className="product-grid__link">
            <div className="product-grid__image">
              <img src={product.image} alt={product.name} onError={handleImageError} />
            </div>
            <div className="product-grid__meta">
              <p className="product-grid__name">{product.name}</p>
              <p className="product-grid__category">{product.category}</p>
              <div className="product-grid__price-row">
                <span className="product-grid__price">{product.price}</span>
                {!product.available && (
                  <span className="product-grid__availability">
                    Currently unavailable
                  </span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
