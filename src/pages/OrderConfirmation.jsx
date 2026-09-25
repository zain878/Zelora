import { useLocation, Link } from 'react-router-dom'
import { parsePrice, formatPrice } from '../utils/price.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { SITE } from '../config/site.js'
import './OrderConfirmation.css'

function OrderConfirmation() {
  useDocumentTitle('Order Confirmed — Zelorà')
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <section className="order-confirmation">
        <div className="container order-confirmation__empty">
          <h1 className="section-heading">No order to show</h1>
          <p className="section-subtext">
            We couldn't find a recent order request. If you just placed one,
            it may have been lost on refresh — please check the details and
            try again.
          </p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="order-confirmation">
      <div className="container order-confirmation__inner">
        <p className="order-confirmation__eyebrow">Order received</p>
        <h1 className="order-confirmation__heading">
          Thank you for your order. 🤍
        </h1>
        <p className="order-confirmation__body">
          Your order request has been received. We'll contact you shortly to
          confirm the details.
        </p>

        <ul className="order-confirmation__items">
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                {formatPrice(parsePrice(item.price) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="order-confirmation__summary">
          <div>
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{order.customer.fullName}</dd>
          </div>
          <div>
            <dt>City</dt>
            <dd>{order.delivery.city}</dd>
          </div>
        </dl>

        <div className="order-confirmation__actions">
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <a
            href={SITE.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="order-confirmation__whatsapp"
          >
            Questions? Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default OrderConfirmation
