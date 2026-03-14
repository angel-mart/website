import Header from '../layout/Header'
import Footer from '../layout/Footer'
import '../../styles/AboutUs.css'

export default function AboutUs() {
  return (
    <div className="about-section">
      <Header />
      
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>About Angel Convenience Mart</h1>
          <p>Your trusted neighborhood convenience store in Fort Worth, Texas</p>
        </div>

        <div className="about-content">
          {/* About Info */}
          <div className="about-info-wrapper">
            {/* Our Story */}
            <div className="about-section-card">
              <h2>🏪 Our Story</h2>
              <p>
                Angel Convenience Mart is a locally-owned convenience store committed to serving the Fort Worth community with quality products and exceptional customer service. Since our opening, we've been dedicated to providing fast, reliable service for all your everyday needs.
              </p>
              <p>
                Whether you're looking for groceries, meal deals, beverages, or health and wellness products, we have you covered with a carefully curated selection of items that meet the needs of our diverse community.
              </p>
            </div>

            {/* Our Mission */}
            <div className="about-section-card">
              <h2>🎯 Our Mission</h2>
              <p>
                To be the most convenient and trusted neighborhood store, offering quality products at fair prices with outstanding customer service. We believe in supporting our local community and making a positive difference in the lives of our customers.
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="about-section-card">
              <h2>✨ Why Choose Us</h2>
              <ul className="about-list">
                <li>Wide selection of quality products</li>
                <li>Competitive and fair pricing</li>
                <li>Fast and reliable service</li>
                <li>Convenient online ordering and delivery</li>
                <li>Responsible alcohol service (TABC compliant)</li>
                <li>Customer-focused approach</li>
                <li>Locally-owned and operated</li>
              </ul>
            </div>

            {/* Product Categories */}
            <div className="about-section-card">
              <h2>🛒 What We Offer</h2>
              <div className="categories-grid">
                <div className="category-item">
                  <span className="category-emoji">🥬</span>
                  <span className="category-name">Groceries</span>
                </div>
                <div className="category-item">
                  <span className="category-emoji">🍻</span>
                  <span className="category-name">Alcohol</span>
                </div>
                <div className="category-item">
                  <span className="category-emoji">🛁</span>
                  <span className="category-name">Consumer Products</span>
                </div>
                <div className="category-item">
                  <span className="category-emoji">💊</span>
                  <span className="category-name">Health & Wellness</span>
                </div>
                <div className="category-item">
                  <span className="category-emoji">🍕</span>
                  <span className="category-name">Meal Deals</span>
                </div>
              </div>
            </div>

            {/* Commitment to Community */}
            <div className="about-section-card">
              <h2>🤝 Our Commitment</h2>
              <p>
                We are committed to responsible alcohol service and comply with all Texas Alcoholic Beverage Commission (TABC) regulations. We take pride in serving our customers responsibly and promoting a safe community.
              </p>
              <p>
                Angel Convenience Mart values your privacy and data security. We only collect information necessary to process your orders and improve your shopping experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}