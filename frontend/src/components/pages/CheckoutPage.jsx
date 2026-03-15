import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { useApp } from '../../context/useApp'
import CloverPayment from '../ui/CloverPayment'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const CHARGE_URL          = import.meta.env.VITE_CHARGE_FUNCTION_URL
const STORE_ADDRESS       = 'Angel Mart Store — In-Store Pickup, Texas'

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const { currentUser, userData, cart, fullData, clearCart, deliveryInfo } = useApp()

  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [placed, setPlaced]     = useState(false)
  const [payError, setPayError] = useState('')

  // Holds the tokenize function injected by CloverPayment once SDK is ready
  const cloverRef = useRef(null)

  useEffect(() => {
    if (userData) setName(userData.name || '')
  }, [userData])

  const items = Object.keys(cart).map(itemName => {
    const product = fullData.find(p => p.Product_Name === itemName)
    if (!product) return null
    return { name: itemName, qty: cart[itemName], price: parseFloat(String(product.Price).replace('$', '').replace(/,/g, '')) }
  }).filter(Boolean)

  const subtotal     = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const amountCents  = Math.round(subtotal * 100)
  const displayAddress = deliveryInfo?.mode === 'delivery' ? (deliveryInfo.address || '') : STORE_ADDRESS

  const placeOrder = async () => {
    setPayError('')
    if (!name.trim())       { setPayError('Please enter your name.');         return }
    if (!phone.trim())      { setPayError('Please enter your phone number.'); return }
    if (items.length === 0) { setPayError('Your cart is empty.');             return }

    setLoading(true)

    // 1️⃣  Tokenize card via Clover iFrame SDK
    const tokenizeFn = cloverRef.current
    if (!tokenizeFn) {
      setPayError('Payment form is not ready yet. Please wait a moment and try again.')
      setLoading(false)
      return
    }

    const token = await tokenizeFn()
    if (!token) { setLoading(false); return }   // onError already set payError

    const orderId = '#AM-' + Date.now().toString(36).toUpperCase().slice(-6)

    // 2️⃣  Charge via Firebase Cloud Function
    try {
      const chargeRes = await fetch(CHARGE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          amountCents,
          orderId,
          customerName: name,
          email: currentUser?.email || '',
        }),
      })

      const chargeData = await chargeRes.json()

      if (!chargeRes.ok || !chargeData.success) {
        setPayError(chargeData.error || 'Payment was declined. Please try a different card.')
        setLoading(false)
        return
      }

      // 3️⃣  Payment succeeded — send confirmation email
      const baseUrl = window.location.origin
      const templateParams = {
        order_id:      orderId,
        customer_name: name,
        phone,
        email:         currentUser?.email || '',
        to_email:      `database.anglemart@gmail.com,${currentUser?.email || ''}`,
        address:       displayAddress,
        orders: items.map(i => ({
          name:      i.name,
          image_url: `${baseUrl}/assets/${i.name.replace(/\//g, '_')}.png`,
          units:     String(i.qty),
          price:     `$${(i.price * i.qty).toFixed(2)}`,
        })),
        cost: { total: `$${subtotal.toFixed(2)}` },
      }

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      clearCart()
      setPlaced(true)

    } catch (err) {
      console.error('Order error:', err)
      setPayError('Something went wrong. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="section-full" style={{ textAlign: 'center', padding: '0 5%' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontWeight: 900, letterSpacing: 2, marginBottom: 12 }}>ORDER PLACED!</h2>
        <p style={{ opacity: 0.6, marginBottom: 8, fontSize: 15 }}>Payment confirmed. Confirmation sent to</p>
        <p style={{ fontWeight: 700, marginBottom: 30 }}>{currentUser?.email}</p>
        <button className="login-btn" style={{ padding: '16px 48px', fontSize: 14 }} onClick={() => navigate('/')}>
          BACK TO STORE
        </button>
      </div>
    )
  }

  // ── Checkout form ────────────────────────────────────────────────────────
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="checkout-title">CHECKOUT</h2>
        <span />
      </div>

      <div className="checkout-body">

        {/* ── Customer Details ── */}
        <div className="checkout-card">
          <div className="checkout-card-title">📋 Your Details</div>
          <div className="log-input-group">
            <label className="log-label">FULL NAME</label>
            <input type="text" className="log-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="log-input-group">
            <label className="log-label">PHONE NUMBER</label>
            <input type="tel" className="log-field" placeholder="+1 (000) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="log-input-group">
            <label className="log-label">EMAIL</label>
            <input type="email" className="log-field" value={currentUser?.email || ''} disabled style={{ opacity: 0.55 }} />
          </div>
          <div className="log-input-group">
            <label className="log-label">{deliveryInfo?.mode === 'delivery' ? '🚚 DELIVERY ADDRESS' : '📍 PICKUP ADDRESS'}</label>
            <input type="text" className="log-field" value={displayAddress} disabled style={{ opacity: 0.7 }} />
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="checkout-card">
          <div className="checkout-card-title">🧾 Order Summary</div>
          <div className="checkout-items-list">
            {items.map(item => {
              const imgName = item.name.replace(/\//g, '_')
              return (
                <div key={item.name} className="checkout-item-row">
                  <img
                    src={`assets/${imgName}.png`}
                    onError={e => { e.target.src = 'assets/logo.png' }}
                    className="checkout-item-thumb"
                    alt={item.name}
                  />
                  <div className="checkout-item-meta">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-unit">${item.price.toFixed(2)} × {item.qty}</div>
                  </div>
                  <div className="checkout-item-total">${(item.price * item.qty).toFixed(2)}</div>
                </div>
              )
            })}
          </div>
          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span style={{ opacity: 0.5 }}>Delivery</span>
              <span style={{ opacity: 0.5 }}>Calculated at door</span>
            </div>
            <div className="checkout-grand-total">
              <span>TOTAL</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Payment — Clover Hosted iFrame ── */}
        <div className="checkout-card">
          <div className="checkout-card-title">💳 Payment</div>
          <p className="clover-card-subtitle">Enter your card details below</p>
          <CloverPayment
            disabled={loading}
            onReady={(tokenizeFn) => { cloverRef.current = tokenizeFn }}
            onError={(msg) => setPayError(msg)}
          />
        </div>

        {/* ── Error banner ── */}
        {payError && (
          <div className="checkout-pay-error">
            ⚠️ {payError}
          </div>
        )}

        {/* ── Place Order button ── */}
        <button
          className="login-btn place-order-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading
            ? <><span className="pay-spinner" /> PROCESSING PAYMENT…</>
            : `💳 PAY & PLACE ORDER · $${subtotal.toFixed(2)}`
          }
        </button>

        <p className="checkout-disclaimer">
          By placing your order you agree to our terms. Your card will be charged immediately.
          Order details will be sent to your email.
        </p>
      </div>
    </div>
  )
}
