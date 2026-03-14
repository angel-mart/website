import { useState } from 'react'
import { useApp } from '../../context/useApp'

// step: 'ask' | 'verify' | 'warn'
export default function CheckoutAgeGate({ onPass, onCancel }) {
  const { cart, fullData, saveCart } = useApp()
  const [step, setStep] = useState('ask')

  // Find alcohol items currently in the cart
  const alcoholItems = Object.keys(cart).filter(name => {
    const product = fullData.find(p => p.Product_Name === name)
    return product?.Category?.toLowerCase() === 'alcohol'
  })

  const removeAlcoholAndProceed = () => {
    const updated = { ...cart }
    alcoholItems.forEach(name => delete updated[name])
    saveCart(updated)
    onPass()
  }

  // ── STEP: ask ──────────────────────────────────────
  if (step === 'ask') return (
    <div className="age-gate-screen">
      <div className="age-gate-card">
        <img src="assets/logo.png" className="age-gate-logo" alt="Angel Mart" />
        <h2 className="age-gate-title">AGE VERIFICATION</h2>
        <p className="age-gate-sub">Required before checkout</p>
        <div className="age-gate-divider" />
        <p className="age-gate-question">Are you 21 or older?</p>
        <p className="age-gate-notice">
          Some items in your cart may require you to be 21+ to purchase.
        </p>
        <div className="age-gate-actions">
          <button className="age-gate-yes" onClick={() => setStep('verify')}>
            Yes, I'm 21+
          </button>
          <button className="age-gate-no" onClick={() => setStep('warn')}>
            No, I'm not
          </button>
        </div>
        <button className="age-gate-back-link" onClick={onCancel}>
          ← Back to cart
        </button>
      </div>
    </div>
  )

  // ── STEP: verify ───────────────────────────────────
  if (step === 'verify') return (
    <div className="age-gate-screen">
      <div className="age-gate-card">
        <div className="age-gate-verify-icon">✅</div>
        <h2 className="age-gate-title">CONFIRM YOUR AGE</h2>
        <div className="age-gate-divider" />
        <p className="age-gate-notice" style={{ marginBottom: 8 }}>
          By confirming, you certify that you are <strong>21 years of age or older</strong> and legally
          permitted to purchase alcohol in Texas.
        </p>
        <p className="age-gate-notice" style={{ fontSize: 12, opacity: 0.7 }}>
          A valid government-issued photo ID will be required at delivery or pickup.
        </p>
        <div className="age-gate-actions" style={{ marginTop: 28 }}>
          <button className="age-gate-yes" onClick={onPass}>
            I Confirm — I Am 21+
          </button>
          <button className="age-gate-no" onClick={() => setStep('ask')}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )

  // ── STEP: warn ─────────────────────────────────────
  if (step === 'warn') return (
    <div className="age-gate-screen">
      <div className="age-gate-card">
        <div className="age-gate-verify-icon">⚠️</div>
        <h2 className="age-gate-title">ALCOHOL ITEMS</h2>
        <div className="age-gate-divider" />
        <p className="age-gate-notice">
          The following items will be <strong>removed from your cart</strong> before proceeding:
        </p>

        {alcoholItems.length === 0 ? (
          <p className="age-gate-notice" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            ✓ No alcohol items in your cart. You're good to go!
          </p>
        ) : (
          <ul className="age-gate-warn-list">
            {alcoholItems.map(name => (
              <li key={name} className="age-gate-warn-item">
                <img
                  src={`assets/${name.replace(/\//g, '_')}.png`}
                  onError={e => { e.target.src = 'assets/logo.png' }}
                  className="age-gate-warn-img"
                  alt={name}
                />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="age-gate-notice" style={{ marginTop: 16 }}>
          Are you sure you want to continue?
        </p>

        <div className="age-gate-actions">
          <button className="age-gate-yes" onClick={removeAlcoholAndProceed}>
            Yes, Remove &amp; Continue
          </button>
          <button className="age-gate-no" onClick={() => setStep('ask')}>
            Go Back
          </button>
        </div>
        <button className="age-gate-back-link" onClick={onCancel}>
          ← Back to cart
        </button>
      </div>
    </div>
  )
}
