import { useRef } from 'react'

export default function CategoryNav({ categories, currentCat, onSelect }) {
  const sliderRef = useRef(null)

  return (
    <div className="nav-wrapper">
      <button className="scroll-btn" onClick={() => sliderRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}>‹</button>
      <div className="category-nav" ref={sliderRef}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-slide-btn${cat === currentCat ? ' active' : ''}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <button className="scroll-btn" onClick={() => sliderRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}>›</button>
    </div>
  )
}
