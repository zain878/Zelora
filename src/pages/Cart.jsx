import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { parsePrice, formatPrice } from '../utils/price.js'
import { handleImageError } from '../utils/image.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './Cart.css'

function Cart() {
  useDocumentTitle('Your Cart — Zelorà')
  const { items, increment, decrement, removeItem, clearCart, total } =
    useCart()

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container cart-page__empty">
          <h1 className="section-heading">Your cart is empty</h1>
          <p className="section-subtext">
            Browse the collection and add a piece you love.
          </p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="section-heading">Your cart</h1>
          <p className="section-subtext">
            Review your pieces before checking out.
          </p>
        </div>

        <ul className="cart-list">
          {items.map((item) => {
            const lineTotal = parsePrice(item.price) * item.quantity
            return (
              <li key={item.id} className="cart-list__item">
                <Link to={`/shop/${item.id}`} className="cart-list__image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImageError}
                  />
                </Link>

                <div className="cart-list__info">
                  <Link to={`/shop/${item.id}`} className="cart-list__name">
                    {item.name}
                  </Link>
                  <p className="cart-list__category">{item.category}</p>
                  <p className="cart-list__price">{item.price}</p>
                </div>

                <div className="cart-list__stepper">
                  <button
                    type="button"
                    onClick={() => decrement(item.id)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    –
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increment(item.id)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <p className="cart-list__subtotal">{formatPrice(lineTotal)}</p>

                <button
                  type="button"
                  className="cart-list__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>

        <div className="cart-page__summary">
          <button
            type="button"
            className="cart-page__clear"
            onClick={clearCart}
          >
            Clear cart
          </button>

          <div className="cart-page__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="cart-page__actions">
          <Link to="/shop" className="back-link">
            Continue shopping
          </Link>
          <Link to="/checkout" className="btn-primary">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cart
