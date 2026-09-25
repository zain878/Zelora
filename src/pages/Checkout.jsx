import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { parsePrice, formatPrice } from '../utils/price.js'
import { suggestEmailCorrection } from '../utils/email.js'
import { handleImageError } from '../utils/image.js'
import { submitOrder } from '../services/orders.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './Checkout.css'

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  notes: '',
  city: '',
  address: '',
}

function Checkout() {
  useDocumentTitle('Checkout — Zelorà')
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (items.length === 0) {
    return (
      <section className="checkout-page">
        <div className="container checkout-page__empty">
          <h1 className="section-heading">Your cart is empty</h1>
          <p className="section-subtext">
            Add something from the shop before checking out.
          </p>
          <Link to="/shop" className="btn-primary">
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  const emailSuggestion = form.email.trim()
    ? suggestEmailCorrection(form.email)
    : null

  const applyEmailSuggestion = () => {
    if (!emailSuggestion) return
    setForm((prev) => ({ ...prev, email: emailSuggestion }))
    setErrors((prev) => ({ ...prev, email: undefined }))
  }

  const updateField = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Please enter a phone or WhatsApp number.'
    }
    if (!form.city.trim()) {
      nextErrors.city = 'Please enter your city.'
    }
    if (!form.address.trim()) {
      nextErrors.address = 'Please enter your complete delivery address.'
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    } else if (emailSuggestion) {
      nextErrors.email = `Did you mean ${emailSuggestion}? Fix the address or use the suggestion below to continue.`
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Guards against double-clicks/double taps triggering a second order.
    if (isSubmitting) return

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const order = {
      items,
      total,
      customer: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      delivery: {
        city: form.city.trim(),
        address: form.address.trim(),
      },
      notes: form.notes.trim(),
    }

    setSubmitError('')
    setIsSubmitting(true)

    const { error } = await submitOrder(order)

    setIsSubmitting(false)

    if (error) {
      // Keep the cart AND the customer's entered information exactly as
      // they are so nothing has to be retyped — only the error changes.
      console.error('Checkout failed:', error)
      setSubmitError(
        "We couldn't submit your order just now. Please check your connection and try again.",
      )
      return
    }

    // Only clear the cart and move on once Supabase has actually
    // confirmed the order was stored.
    clearCart()
    navigate('/order-confirmation', { state: { order } })
  }

  const hasErrors = Object.keys(errors).some((key) => errors[key])

  return (
    <section className="checkout-page">
      <div className="container">
        <Link to="/cart" className="back-link">
          Back to cart
        </Link>

        <div className="checkout-page__header">
          <h1 className="section-heading">Checkout</h1>
          <p className="section-subtext">
            Share your details below and we'll reach out to confirm
            everything before it ships.
          </p>
        </div>

        <div className="checkout-page__layout">
          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Order summary</h2>

            <ul className="checkout-summary__list">
              {items.map((item) => {
                const lineTotal = parsePrice(item.price) * item.quantity
                return (
                  <li key={item.id} className="checkout-summary__item">
                    <div className="checkout-summary__image">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </div>
                    <div className="checkout-summary__info">
                      <p className="checkout-summary__name">{item.name}</p>
                      <p className="checkout-summary__meta">
                        Qty {item.quantity} · {item.price}
                      </p>
                    </div>
                    <p className="checkout-summary__line-total">
                      {formatPrice(lineTotal)}
                    </p>
                  </li>
                )
              })}
            </ul>

            <div className="checkout-summary__total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </aside>

          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <p className="checkout-form__required-note">
              Fields marked * are required.
            </p>

            {hasErrors && (
              <p className="checkout-form__error-summary" role="alert">
                Please check the highlighted fields below.
              </p>
            )}

            <div className="checkout-form__section">
              <h3 className="checkout-form__section-title">
                Customer information
              </h3>

              <div className="checkout-form__row">
                <div className="checkout-field">
                  <label htmlFor="fullName">
                    Full name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={updateField('fullName')}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? 'fullName-error' : undefined
                    }
                  />
                  {errors.fullName && (
                    <p className="checkout-field__error" id="fullName-error">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">
                    Phone / WhatsApp <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p className="checkout-field__error" id="phone-error">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="checkout-field__error" id="email-error">
                    {errors.email}
                  </p>
                )}
                {emailSuggestion && (
                  <p className="checkout-field__hint">
                    Did you mean{' '}
                    <button
                      type="button"
                      className="checkout-field__hint-action"
                      onClick={applyEmailSuggestion}
                    >
                      {emailSuggestion}
                    </button>
                    ?
                  </p>
                )}
              </div>
            </div>

            <div className="checkout-form__section">
              <h3 className="checkout-form__section-title">
                Delivery information
              </h3>

              <div className="checkout-field">
                <label htmlFor="city">
                  City <span aria-hidden="true">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={updateField('city')}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p className="checkout-field__error" id="city-error">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="address">
                  Complete delivery address <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="address"
                  rows="3"
                  value={form.address}
                  onChange={updateField('address')}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={
                    errors.address ? 'address-error' : undefined
                  }
                />
                {errors.address && (
                  <p className="checkout-field__error" id="address-error">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="checkout-form__section">
              <h3 className="checkout-form__section-title">
                Additional notes
              </h3>
              <div className="checkout-field">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  rows="3"
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Sizing preferences, delivery timing, or anything else we should know."
                />
              </div>
            </div>

            {submitError && (
              <p className="checkout-form__error-summary" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing order…' : 'Place order'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Checkout
