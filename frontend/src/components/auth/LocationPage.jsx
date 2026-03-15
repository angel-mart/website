import { useState } from 'react'

export default function LocationPage({ onDone }) {
  const [selectedMode, setSelectedMode] = useState('')
  const [address, setAddress]           = useState('')

  const proceed = () => {
    if (selectedMode === 'delivery') {
      const addr = address.toLowerCase()
      if (!addr.includes('tx') && !addr.includes('texas')) {
        alert('Delivery is available in Texas only.')
        return
      }
    }
    onDone({ mode: selectedMode, address: selectedMode === 'delivery' ? address : '' })
  }

  return (
    <section className="section-full">
      <div className="modal-container">
        <h2 style={{ marginBottom: 6, fontWeight: 900, letterSpacing: 1 }}>How would you like to receive your order?</h2>
        <p style={{ opacity: 0.5, fontSize: 13, marginBottom: 28 }}>Choose pickup or delivery</p>

        <div className={`loc-option${selectedMode === 'instore' ? ' active' : ''}`} onClick={() => setSelectedMode('instore')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: 16, marginBottom: 4 }}>📍 In-Store Pickup</h4>
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                <a href="https://maps.app.goo.gl/svPyY3Trr8PZ4AVS8" target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }}>
                  View on Google Maps →
                </a>
              </p>
            </div>
            <input type="radio" readOnly checked={selectedMode === 'instore'} />
          </div>
        </div>

        <div className={`loc-option${selectedMode === 'delivery' ? ' active' : ''}`} onClick={() => setSelectedMode('delivery')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: 16, marginBottom: 4 }}>🚚 Texas Delivery</h4>
              <p style={{ fontSize: 12, opacity: 0.6 }}>Within 25 miles radius from store</p>
            </div>
            <input type="radio" readOnly checked={selectedMode === 'delivery'} />
          </div>
          {selectedMode === 'delivery' && (
            <input
              type="text"
              className="log-field"
              style={{ marginTop: 14, fontSize: 13 }}
              placeholder="Enter your Texas address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          )}
        </div>

        <button
          className="login-btn loc-continue-btn"
          style={{ width: '100%', marginTop: 20 }}
          disabled={!selectedMode}
          onClick={proceed}
        >
          CONTINUE TO CHECKOUT →
        </button>
      </div>
    </section>
  )
}
