import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import products from '../data/products.js'
import Reviews from '../components/Reviews.jsx'
import { useCart } from '../context/CartContext.jsx'
import { handleImageError } from '../utils/image.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()

  const product = products.find((item) => String(item.id) === id)

  useDocumentTitle(product ? `${product.name} — Zelorà` : 'Piece Not Found — Zelorà')

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <section className="product-detail">
        <div className="container product-detail__not-found">
          <h1 className="section-heading">Piece not found</h1>
          <p className="section-subtext">
            We couldn't find that item in the collection.
          </p>
          <Link to="/shop" className="back-link">
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  const adjustQuantity = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta))
    setAdded(false)
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
  }

  return (
    <>
      <section className="product-detail">
        <div className="container">
          <Link to="/shop" className="back-link">
            Back to shop
          </Link>

          <div className="product-detail__layout">
            <div className="product-detail__image">
              <img
                src={product.image}
                alt={product.name}
                onError={handleImageError}
              />
            </div>

            <div className="product-detail__info">
              <p className="product-detail__category">{product.category}</p>
              <h1 className="product-detail__name">{product.name}</h1>
              <p className="product-detail__price">{product.price}</p>

              <p className="product-detail__description">
                {product.description}
              </p>

              <p className="product-detail__availability">
                {product.available ? 'In stock' : 'Currently unavailable'}
              </p>

              {product.available ? (
                <div className="product-detail__cart-controls">
                  <div className="product-detail__stepper">
                    <button
                      type="button"
                      onClick={() => adjustQuantity(-1)}
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </button>
                </div>
              ) : (
                <button type="button" className="btn-primary" disabled>
                  Add to cart
                </button>
              )}

              {added && (
                <p className="product-detail__added" role="status">
                  Added to cart. <Link to="/cart">View cart</Link> or keep
                  browsing.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Reviews productId={product.id} productName={product.name} />
    </>
  )
}

export default ProductDetail
