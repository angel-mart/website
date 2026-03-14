import { useState } from 'react'
import { useApp } from '../../context/useApp'

export default function Header({ search, onSearch, onReset }) {
  const { userData, cartTotal, cartCount, toggleTheme, setCartOpen, goOverlay, currentUser } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header>
        <div className="logo-box" onClick={onReset}>
          <img src="assets/logo.png" className="logo-img" alt="Angel Mart" />
          <span className="logo-text">Angel Mart</span>
        </div>

        <input
          type="text"
          className="search-bar desktop-search"
          placeholder="Search products..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />

        <div className="header-actions desktop-actions">
          <button className="theme-btn" onClick={toggleTheme}>🌓</button>
          <img
            src={userData?.photo || 'assets/logo.png'}
            className="profile-btn"
            alt="profile"
            onClick={() => goOverlay(currentUser ? 'profile' : 'login')}
          />
          <button className="cart-trigger" onClick={() => setCartOpen(true)}>
            🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>} ${cartTotal.toFixed(2)}
          </button>
        </div>

        <div className="mobile-header-actions">
          <button className="cart-trigger" onClick={() => setCartOpen(true)}>
            🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>} ${cartTotal.toFixed(2)}
          </button>
          <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <input
          type="text"
          className="search-bar mobile-search"
          placeholder="Search products..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        <div className="mobile-menu-row">
          <button className="theme-btn" onClick={toggleTheme}>🌓</button>
          <img
            src={userData?.photo || 'assets/logo.png'}
            className="profile-btn"
            alt="profile"
            onClick={() => { goOverlay(currentUser ? 'profile' : 'login'); setMenuOpen(false) }}
          />
        </div>
      </div>
    </>
  )
}
