import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { SITE } from '../config/site.js'
import './Navbar.css'

// Home and Shop are real routes, so they use react-router's Link.
// About lives on the homepage as a section, so it's a plain hash link.
// Instagram is external. Cart is rendered separately below since its
// label needs to include the live item count.
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', href: '/#about' },
  { label: 'Instagram', href: SITE.instagram.url, external: true },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const closeMenu = () => setIsOpen(false)

  const cartLabel = itemCount > 0 ? `Cart (${itemCount})` : 'Cart'

  const cartAriaLabel = `View cart, ${itemCount} item${
    itemCount === 1 ? '' : 's'
  }`

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link
          to="/"
          className="navbar__wordmark"
          onClick={closeMenu}
        >
          Zelorà
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <ul>
            {navLinks.map((link) =>
              link.to ? (
                <li key={link.label}>
                  <Link to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={
                      link.external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}

            <li>
              <Link
                to="/cart"
                aria-label={cartAriaLabel}
              >
                {cartLabel}
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`navbar__mobile ${
          isOpen ? 'is-open' : ''
        }`}
        aria-label="Mobile"
        hidden={!isOpen}
      >
        <ul>
          {navLinks.map((link) =>
            link.to ? (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={
                    link.external
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ),
          )}

          <li>
            <Link
              to="/cart"
              onClick={closeMenu}
              aria-label={cartAriaLabel}
            >
              {cartLabel}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar