import { Link } from 'react-router-dom'
import { useApp } from '../../context/useApp'

export default function Footer() {
    const { fullData, filterByCatRef } = useApp()

    const categories = [...new Set(fullData.map(i => i.Category).filter(Boolean))].sort()

    const handleCatClick = (cat) => {
        if (filterByCatRef.current) {
            filterByCatRef.current(cat)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <footer className="site-footer">
            <div className="footer-inner">

                {/* Brand column */}
                <div className="footer-brand">
                    <img src="assets/logo.png" className="footer-logo" alt="Angel Mart" />
                    <span className="footer-highlight">ANGEL MART</span>
                    <p className="footer-tagline">Texas's finest selection of beer,<br />wine, spirits &amp; more.</p>
                </div>

                {/* Category links */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Shop by Category</h4>
                    <ul className="footer-links">
                        {categories.map(cat => (
                            <li key={cat}>
                                <button className="footer-cat-btn" onClick={() => handleCatClick(cat)}>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Info column */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Info</h4>
                    <ul className="footer-links">
                        <li><Link to="/terms" className="footer-link">Terms &amp; Conditions</Link></li>
                        <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                        <li><Link to="/about" className="footer-link">About Us</Link></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <span className="footer-highlight">
                    ©2026 ANGEL CONVENIENCE MART LLC · All rights reserved.
                </span>
            </div>
        </footer>
    )
}
