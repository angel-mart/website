import { useEffect, useRef, useState } from 'react'

const CLOVER_SDK_URL = import.meta.env.VITE_CLOVER_ENV === 'production'
  ? 'https://checkout.clover.com/sdk.js'
  : 'https://checkout.sandbox.dev.clover.com/sdk.js'

const PUBLIC_KEY = import.meta.env.VITE_CLOVER_PUBLIC_KEY || ''

/**
 * CloverPayment
 *
 * Props:
 *   onReady(tokenizeFn)  — called once the SDK is loaded; tokenizeFn() returns a token or null
 *   onError(msg)         — called on tokenization or init errors
 *   disabled             — visually disables the form while parent is processing
 */
export default function CloverPayment({ onReady, onError, disabled }) {
  const cloverRef  = useRef(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [cardErrors, setCardErrors] = useState({})

  // ── Load Clover SDK script once ──────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById('clover-sdk')) {
      if (window.Clover) initClover()
      return
    }
    const script   = document.createElement('script')
    script.id      = 'clover-sdk'
    script.src     = CLOVER_SDK_URL
    script.async   = true
    script.onload  = () => initClover()
    script.onerror = () => onError?.('Failed to load Clover SDK. Check your internet connection.')
    document.head.appendChild(script)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function initClover() {
    if (!PUBLIC_KEY) {
      console.warn('[Clover] VITE_CLOVER_PUBLIC_KEY is not set in .env.local')
      onError?.('Payment key is missing. Contact support.')
      return
    }
    try {
      const clover   = new window.Clover(PUBLIC_KEY)
      cloverRef.current = clover
      const elements = clover.elements()

      // Mount the four secure hosted iFrame fields
      const cardNumber = elements.create('CARD_NUMBER')
      const cardDate   = elements.create('CARD_DATE')
      const cardCvv    = elements.create('CARD_CVV')
      const cardPostal = elements.create('CARD_POSTAL_CODE')

      cardNumber.mount('#clover-card-number')
      cardDate.mount('#clover-card-date')
      cardCvv.mount('#clover-card-cvv')
      cardPostal.mount('#clover-card-postal')

      // Real-time validation feedback
      ;[
        [cardNumber, 'cardNumber'],
        [cardDate,   'cardDate'],
        [cardCvv,    'cardCvv'],
        [cardPostal, 'cardPostal'],
      ].forEach(([el, key]) => {
        el.addEventListener('change', (ev) => {
          setCardErrors(prev => ({ ...prev, [key]: ev.error?.message ?? null }))
        })
      })

      setSdkReady(true)

      // Expose the tokenize function to the parent
      onReady?.(async () => {
        try {
          const result = await cloverRef.current.createToken()
          if (result.errors && Object.keys(result.errors).length > 0) {
            onError?.(Object.values(result.errors).join(' '))
            return null
          }
          if (!result.token) {
            onError?.('Could not create a payment token. Please check your card details.')
            return null
          }
          return result.token
        } catch (err) {
          console.error('[Clover] createToken error:', err)
          onError?.('Card tokenization failed. Please try again.')
          return null
        }
      })

    } catch (err) {
      console.error('[Clover] Init error:', err)
      onError?.('Payment form failed to initialize.')
    }
  }

  return (
    <div className={`clover-payment-wrap${disabled ? ' clover-disabled' : ''}`}>

      <div className="clover-row clover-row--full">
        <label className="log-label">CARD NUMBER</label>
        <div id="clover-card-number" className="clover-field" />
        {cardErrors.cardNumber && <span className="clover-error">{cardErrors.cardNumber}</span>}
      </div>

      <div className="clover-row clover-row--split">
        <div className="clover-col">
          <label className="log-label">EXPIRY DATE</label>
          <div id="clover-card-date" className="clover-field" />
          {cardErrors.cardDate && <span className="clover-error">{cardErrors.cardDate}</span>}
        </div>
        <div className="clover-col">
          <label className="log-label">CVV</label>
          <div id="clover-card-cvv" className="clover-field" />
          {cardErrors.cardCvv && <span className="clover-error">{cardErrors.cardCvv}</span>}
        </div>
      </div>

      <div className="clover-row clover-row--full">
        <label className="log-label">ZIP / POSTAL CODE</label>
        <div id="clover-card-postal" className="clover-field" />
        {cardErrors.cardPostal && <span className="clover-error">{cardErrors.cardPostal}</span>}
      </div>

      {!sdkReady && (
        <div className="clover-loading">
          <span className="clover-spinner" /> Loading secure payment form…
        </div>
      )}

      <div className="clover-secure-badge">
        🔒 Payments processed securely by <strong>Clover</strong>. Card data never touches our servers.
      </div>
    </div>
  )
}
