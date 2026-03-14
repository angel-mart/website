import Alcohol from '../../assets/Alcohol.png'
import Groceries from '../../assets/Groceries.png'
import Consumer_Products from '../../assets/Consumer_Products.png'
import HealthWellness from '../../assets/HealthWellness.png'
import MealDeals from '../../assets/MealDeals.png'

const logoMap = {
  Groceries: Groceries,
  Alcohol: Alcohol,
  'Consumer Products': Consumer_Products,
  'Health & Wellness': HealthWellness,
  'Meal Deals': MealDeals,
}

export default function CategoryCard({ cat, isFull, onClick }) {
  const logoSrc = logoMap[cat] || 'assets/logo.png'

  return (
    <div className={`card category-card${isFull ? ' card-full' : ''}`} onClick={onClick}>
      <div className="img-box">
        <img
          src={logoSrc}
          onError={e => { e.target.src = 'assets/logo.png' }}
          alt={cat}
          className='category-logo'
        />
      </div>
      <b className="category-label">{cat}</b>
    </div>
  )
}
