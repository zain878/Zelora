import { useState } from 'react'
import products from '../data/products.js'
import CategoryFilter from '../components/CategoryFilter.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './Shop.css'

function Shop() {
  useDocumentTitle('Shop — Zelorà')
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <section className="shop">
      <div className="container">
        <div className="shop__header">
          <h1 className="section-heading">The collection</h1>
          <p className="section-subtext">
            Browse the full range across fashion, bridal, casual and
            jewelry — a working edit that grows with the brand.
          </p>
        </div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        <div className="shop__grid">
          <ProductGrid products={visibleProducts} />
        </div>
      </div>
    </section>
  )
}

export default Shop
