import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './NotFound.css'

function NotFound() {
  useDocumentTitle('Page Not Found — Zelorà')

  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <p className="not-found__eyebrow">404</p>
        <h1 className="section-heading">Page not found</h1>
        <p className="section-subtext">
          The page you're looking for doesn't exist, or may have moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
