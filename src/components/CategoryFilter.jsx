import './CategoryFilter.css'

const categories = ['All', 'Fashion', 'Traditional', 'Casual','Sketches']

function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-filter__button ${
            active === category ? 'is-active' : ''
          }`}
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
