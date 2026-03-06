import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import AgeGateModal from '../ui/AgeGateModal'

export default function Footer() {
    const { fullData, filterByCatRef } = useApp()
    const [pendingCat, setPendingCat] = useState(null)
    const [ageVerified, setAgeVerified] = useState(false)

    const categories = [...new Set(fullData.map(i => i.Category).filter(Boolean))].sort()

    const doFilter = (cat) => {
        if (filterByCatRef.current) {
            filterByCatRef.current(cat)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleCatClick = (cat) => {
        const isAlcohol = cat.toLowerCase() === 'alcohol'
        if (isAlcohol && !ageVerified) {
            setPendingCat(cat)
        } else {
            doFilter(cat)
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
                        <li><span className="footer-link-plain">📍 Angel Convenience Mart LLC, 6387 Camp Bowie Blvd. Suite B294 Fort Worth, Texas 76116</span></li>
                        <li><span className="footer-link-plain">📞 Call Us: <a className='footer-link-plain' href="tel:682-466-1475">682-466-1475</a></span></li>
                        <li><span className='footer-link-plain'>📧 Email: <a className='footer-link-plain' href="mailto:shopangelmart@gmail.com">shopangelmart@gmail.com</a></span></li>
                        <li><span className="footer-link-plain">🔞 21+ to purchase alcohol</span></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <span className="footer-text">
                    © 2026 <span className="footer-highlight">ANGEL MART</span> · All rights reserved.
                </span>
            </div>
            {pendingCat && (
                <AgeGateModal
                    onConfirm={() => { setAgeVerified(true); doFilter(pendingCat); setPendingCat(null) }}
                    onDeny={() => setPendingCat(null)}
                />
            )}
        </footer>
    )
}
