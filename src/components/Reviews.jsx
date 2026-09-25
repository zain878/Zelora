import { useEffect, useState } from 'react'
import { fetchApprovedReviews, submitReview } from '../services/reviews.js'
import './Reviews.css'

const initialForm = { name: '', rating: 0, review: '' }

function StarRating({ rating }) {
  return (
    <span className="reviews__stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value} aria-hidden="true">
          {value <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

function Reviews({ productId, productName }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadReviews() {
      setIsLoading(true)
      setLoadError(false)

      const { data, error } = await fetchApprovedReviews(productId)

      if (!isMounted) return

      if (error) {
        console.error('Failed to load reviews:', error)
        setLoadError(true)
      } else {
        setReviews(data || [])
      }
      setIsLoading(false)
    }

    loadReviews()

    return () => {
      isMounted = false
    }
  }, [productId])

  const updateField = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const setRating = (value) => {
    setForm((prev) => ({ ...prev, rating: value }))
    setErrors((prev) => ({ ...prev, rating: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    }
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      nextErrors.rating = 'Please choose a rating from 1 to 5.'
    }
    if (!form.review.trim()) {
      nextErrors.review = 'Please write a short review.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Guards against double-clicks/double taps triggering a second insert.
    if (isSubmitting) return

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    const { error } = await submitReview({
      productId,
      productName,
      customerName: form.name.trim(),
      rating: Number(form.rating),
      review: form.review.trim(),
    })

    setIsSubmitting(false)

    if (error) {
      // Keep the customer's entered information so they don't have to
      // retype anything — only the error message changes.
      console.error('Review submission failed:', error)
      setSubmitError(
        "We couldn't submit your review just now. Please check your connection and try again.",
      )
      return
    }

    setForm(initialForm)
    setSubmitted(true)
  }

  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews__header">
          <h2 className="section-heading">Reviews</h2>
          <p className="section-subtext">
            What customers are saying about this piece.
          </p>
        </div>

        {isLoading && <p className="reviews__status">Loading reviews…</p>}

        {!isLoading && loadError && (
          <p className="reviews__status">
            We couldn't load reviews right now. Please try again later.
          </p>
        )}

        {!isLoading && !loadError && reviews.length === 0 && (
          <p className="reviews__status">
            No reviews yet — be the first to share your thoughts.
          </p>
        )}

        {!isLoading && !loadError && reviews.length > 0 && (
          <ul className="reviews__list">
            {reviews.map((item) => (
              <li key={item.id} className="reviews__item">
                <StarRating rating={item.rating} />
                <p className="reviews__text">{item.review}</p>
                <p className="reviews__author">{item.customer_name}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="reviews__form-wrap">
          <h3 className="reviews__form-title">Leave a review</h3>

          {submitted ? (
            <p className="reviews__confirmation">
              Thank you for your review. It has been submitted and will
              appear after approval.
            </p>
          ) : (
            <form className="reviews__form" onSubmit={handleSubmit} noValidate>
              <div className="review-field">
                <label className="review-field__label" htmlFor="review-name">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? 'review-name-error' : undefined
                  }
                />
                {errors.name && (
                  <p className="review-field__error" id="review-name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="review-field">
                <span
                  className="review-field__label"
                  id="review-rating-label"
                >
                  Rating <span aria-hidden="true">*</span>
                </span>
                <div
                  className="reviews__star-picker"
                  role="radiogroup"
                  aria-labelledby="review-rating-label"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === value}
                      aria-label={`${value} star${value > 1 ? 's' : ''}`}
                      className={`reviews__star-button ${
                        value <= form.rating ? 'is-filled' : ''
                      }`}
                      onClick={() => setRating(value)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="review-field__error">{errors.rating}</p>
                )}
              </div>

              <div className="review-field">
                <label className="review-field__label" htmlFor="review-text">
                  Review <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="review-text"
                  rows="4"
                  value={form.review}
                  onChange={updateField('review')}
                  aria-invalid={Boolean(errors.review)}
                  aria-describedby={
                    errors.review ? 'review-text-error' : undefined
                  }
                />
                {errors.review && (
                  <p className="review-field__error" id="review-text-error">
                    {errors.review}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="review-field__error-summary" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Reviews
