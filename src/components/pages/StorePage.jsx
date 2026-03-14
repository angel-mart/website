import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import Header from '../layout/Header'
import CategoryNav from '../layout/CategoryNav'
import PriceRangeFilter from '../ui/PriceRangeFilter'
import Footer from '../layout/Footer'
import ProductCard from '../ui/ProductCard'
import CategoryCard from '../ui/CategoryCard'
import LocationImg from "../../assets/Location.png"

export default function StorePage() {
  const {
    currentCat, search, renderedItems,
    categories, sentinelRef,
    filterByCat, handleSearch, resetToHome,
    minPrice, maxPrice, priceRange, setPriceRange,
  } = useProducts()

  return (
    <div className="store-section">
      <Header search={search} onSearch={handleSearch} onReset={resetToHome} />
      <CategoryNav categories={categories} currentCat={currentCat} onSelect={filterByCat} />
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <div className={`amazon-grid-layout ${currentCat === 'ALL' ? 'amazon-grid-layout--all' : 'amazon-grid-layout--cat'}`}>
        {renderedItems.map((item, idx) => {
          const isFull = currentCat === 'ALL' && (idx + 1) % 5 === 0
          if (item._type === 'category') {
            return (
              <CategoryCard
                key={item.cat}
                cat={item.cat}
                isFull={isFull}
                onClick={() => filterByCat(item.cat)}
              />
            )
          }
          return <ProductCard key={item.Product_Name + idx} product={item} isFull={isFull} />
        })}
      </div>

      <div className='amazon-grid-layout'>
        <Link to="/location">
          <div className="card category-card card-full">
            <div className="img-box">
              <img
                src={LocationImg}
                onError={e => { e.target.src = 'assets/logo.png' }}
                alt="Location"
                className='category-logo'
              />
            </div>
            <b className="category-label product-name">Location</b>
          </div>
        </Link>
      </div>

      <div id="sentinel" ref={sentinelRef} />
      <Footer />
    </div>
  )
}
