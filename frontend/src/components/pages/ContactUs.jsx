import Header from '../layout/Header'
import Footer from '../layout/Footer'
import '../../styles/ContactUs.css'

export default function ContactUs() {

  const openDirections = () => {
    const address = '6387 Camp Bowie Blvd. Suite B294 Fort Worth, Texas 76116'
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank')
  }

  return (
    <div className="contact-section">
      <Header />
      
      <div className="contact-container">
        {/* Hero Section */}
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with Angel Convenience Mart</p>
        </div>

        <div>
          {/* Contact Info & Map */}
          <div className="contact-info-wrapper">
            {/* Contact Info Cards */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h3>Location</h3>
                  <p>Angel Convenience Mart LLC</p>
                  <p>6387 Camp Bowie Blvd. Suite B294</p>
                  <p>Fort Worth, Texas 76116</p>
                  <button onClick={openDirections} className="directions-btn">
                    📍 Get Directions
                  </button>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p>Call us anytime during business hours</p>
                  <a href="tel:682-466-1475" className="contact-link">682-466-1475</a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📧</div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>Drop us an email and we'll respond soon</p>
                  <a href="mailto:shopangelmart@gmail.com" className="contact-link">shopangelmart@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="map-container">
              <h2>Find Us on the Map</h2>
              <div className="map-wrapper">
                <iframe
                  title="Angel Convenience Mart Location"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '12px' }}
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.5268937369023!2d-97.40769!3d32.73569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8646b7e0c5b5b5b5%3A0x5c5c5c5c5c5c5c5c!2s6387%20Camp%20Bowie%20Blvd%20%23B294%2C%20Fort%20Worth%2C%20TX%2076116!5e0!3m2!1sen!2sus!4v1234567890"
                ></iframe>
              </div>
              <button onClick={openDirections} className="full-width-btn">
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}