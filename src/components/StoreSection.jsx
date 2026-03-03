import { useState, useEffect, useRef, useCallback } from 'react'
import { API_URL } from '../firebase'

const BATCH_SIZE = 12

export default function StoreSection({
  currentUser,
  userData,
  cart,
  updateCart,
  fullData,
  setFullData,
  theme,
  toggleTheme,
  onProfile,
  onCartOpen,
}) {
  const [currentCat, setCurrentCat] = useState('ALL')
  const [filteredData, setFilteredData] = useState([])
  const [displayedCount, setDisplayedCount] = useState(0)
  const [search, setSearch] = useState('')
  const [renderedItems, setRenderedItems] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [pendingCat, setPendingCat] = useState(null)
  const catSliderRef = useRef(null)
  const sentinelRef = useRef(null)

  // Fetch products once
  useEffect(() => {
    if (fullData.length === 0) {
      fetch(API_URL)
        .then(r => r.json())
        .then(data => {
          setFullData(data)
          setFilteredData(data)
        })
    } else {
      setFilteredData(fullData)
    }
  }, [])

  // Sync filteredData when fullData loads
  useEffect(() => {
    if (fullData.length > 0 && filteredData.length === 0 && search === '' && currentCat === 'ALL') {
      setFilteredData(fullData)
    }
  }, [fullData])

  // Rebuild rendered items when filteredData or displayedCount changes
  useEffect(() => {
    if (search === '' && currentCat === 'ALL') {
      // Show category tiles
      const cats = [...new Set(fullData.map(i => i.Category).filter(Boolean))]
      setRenderedItems(cats.map(cat => ({ _type: 'category', cat })))
    } else {
      setRenderedItems(filteredData.slice(0, displayedCount))
    }
  }, [filteredData, displayedCount, fullData, search, currentCat])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < filteredData.length) {
          setDisplayedCount(prev => prev + BATCH_SIZE)
        }
      },
      { threshold: 0.1 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [displayedCount, filteredData.length])

  const filterByCat = useCallback((cat) => {
    setCurrentCat(cat)
    setDisplayedCount(BATCH_SIZE)
    setSearch('')
    if (cat === 'ALL') {
      setFilteredData(fullData)
    } else {
      setFilteredData(fullData.filter(p => p.Category === cat))
    }
  }, [fullData])

  const handleSearch = (q) => {
    setSearch(q)
    setDisplayedCount(BATCH_SIZE)
    if (q === '') {
      setFilteredData(currentCat === 'ALL' ? [...fullData] : fullData.filter(p => p.Category === currentCat))
    } else {
      setFilteredData(fullData.filter(p => p.Product_Name.toLowerCase().includes(q.toLowerCase())))
    }
  }

  const categories = ['ALL', ...new Set(fullData.map(i => i.Category).filter(Boolean))]

  const cartTotal = Object.entries(cart).reduce((sum, [name, qty]) => {
    const product = fullData.find(p => p.Product_Name === name)
    if (product) sum += parseFloat(product.Price.replace('$', '')) * qty
    return sum
  }, 0)

  return (
    <div className="store-section">
      <header>
        <div className="logo-box" onClick={() => { setCurrentCat('ALL'); setSearch(''); setFilteredData(fullData) }}>
          <img src="assets/logo.png" className="logo-img" alt="Angel Mart" />
          <span className="logo-text">Angel Mart</span>
        </div>

        {/* Desktop search */}
        <input
          type="text"
          className="search-bar desktop-search"
          placeholder="Search Database..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />

        {/* Desktop actions */}
        <div className="header-actions desktop-actions">
          <button className="theme-btn" onClick={toggleTheme}>🌓</button>
          <img
            src={userData?.photo || 'assets/logo.png'}
            className="profile-btn"
            alt="profile"
            onClick={onProfile}
          />
          <button className="cart-trigger" onClick={onCartOpen}>
            🛒 ${cartTotal.toFixed(2)}
          </button>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="mobile-header-actions">
          <button className="cart-trigger" onClick={onCartOpen}>
            🛒 ${cartTotal.toFixed(2)}
          </button>
          <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <input
          type="text"
          className="search-bar mobile-search"
          placeholder="Search Database..."
          value={search}
          onChange={e => { handleSearch(e.target.value); }}
        />
        <div className="mobile-menu-row">
          <button className="theme-btn" onClick={toggleTheme}>🌓</button>
          <img
            src={userData?.photo || 'assets/logo.png'}
            className="profile-btn"
            alt="profile"
            onClick={() => { onProfile(); setMenuOpen(false) }}
          />
          </div>
      </div>

      <div className="nav-wrapper">
        <button
          className="scroll-btn"
          onClick={() => catSliderRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}
        >
          ‹
        </button>
        <div className="category-nav" ref={catSliderRef}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-slide-btn${cat === currentCat ? ' active' : ''}`}
              onClick={() => filterByCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          className="scroll-btn"
          onClick={() => catSliderRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}
        >
          ›
        </button>
      </div>

      <div className="amazon-grid-layout">
        {renderedItems.map((item, idx) => {
          const isFull = (idx + 1) % 5 === 0
          const cardClass = `card${isFull ? ' card-full' : ''}`
          if (item._type === 'category') {
            const isAlcohol = item.cat.toLowerCase() === 'alcohol'
            return (
              <div
                key={item.cat}
                className={cardClass}
                onClick={() => {
                  if (isAlcohol && !ageVerified) {
                    setPendingCat(item.cat)
                  } else {
                    filterByCat(item.cat)
                  }
                }}
              >
                <div className="img-box">
                  <img
                    src={`assets/${item.cat}.png`}
                    onError={e => { e.target.src = 'assets/logo.png' }}
                    alt={item.cat}
                  />
                </div>
                <b>{item.cat}</b>
              </div>
            )
          }
          const p = item
          const qty = cart[p.Product_Name] || 0
          const imgName = p.Product_Name.replace(/\//g, '_')
          return (
            <div key={p.Product_Name + idx} className={cardClass}>
              <div className="img-box">
                <img
                  src={`assets/${imgName}.png`}
                  onError={e => { e.target.src = 'assets/logo.png' }}
                  alt={p.Product_Name}
                />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, minHeight: 40 }}>{p.Product_Name}</div>
              <b style={{ fontSize: 18, margin: '10px 0', display: 'block' }}>{p.Price}</b>
              {qty > 0 ? (
                <div className="blinkit-counter">
                  <button className="blinkit-btn" onClick={() => updateCart(p.Product_Name, -1)}>-</button>
                  <span>{qty}</span>
                  <button className="blinkit-btn" onClick={() => updateCart(p.Product_Name, 1)}>+</button>
                </div>
              ) : (
                <button className="add-initial" onClick={() => updateCart(p.Product_Name, 1)}>+ ADD</button>
              )}
            </div>
          )
        })}
      </div>

      <div id="sentinel" ref={sentinelRef} />

      <footer>
        <p className="footer-text">
          A PROTOTYPE | SITE UNDER CONSTRUCTION BY{' '}
          <span className="footer-highlight">NOTZIE STUDIOS</span>
        </p>
        <p className="footer-text" style={{ marginTop: 15, fontSize: 9 }}>
          FT. <span className="footer-highlight">YASH RAJ</span>
        </p>
      </footer>

      {/* Age Gate */}
      {pendingCat && (
        <div className="age-gate-overlay">
          <div className="age-gate-modal">
            <div className="age-gate-icon">🍺</div>
            <h2 className="age-gate-title">Age Verification</h2>
            <p className="age-gate-desc">
              This section contains alcohol products.<br />
              You must be 21 or older to continue.
            </p>
            <button
              className="age-gate-btn age-gate-yes"
              onClick={() => {
                setAgeVerified(true)
                filterByCat(pendingCat)
                setPendingCat(null)
              }}
            >
              ✅ I'm 21+ Years Old
            </button>
            <button
              className="age-gate-btn age-gate-no"
              onClick={() => setPendingCat(null)}
            >
              ❌ No, I'm Not
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
