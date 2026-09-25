import { Link } from 'react-router-dom'
import { SITE } from '../config/site.js'
import './Footer.css'

const year = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__wordmark">Zelorà</p>
          <p className="footer__tagline">Where ideas turn into style.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/shop">Shop</Link>
            </li>

            <li>
              <a href="/#about">About</a>
            </li>
          </ul>
        </nav>

        <div className="footer__social">
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          <a
            href={SITE.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {year} Zelorà. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer