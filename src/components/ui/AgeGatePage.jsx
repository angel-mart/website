import { useApp } from '../../context/useApp'

export default function AgeGatePage() {
  const { confirmAge, denyAge } = useApp()

  return (
    <div className="age-gate-screen">
      <div className="age-gate-card">
        <img src="assets/logo.png" className="age-gate-logo" alt="Angel Mart" />
        <h1 className="age-gate-title">ANGEL MART</h1>
        <p className="age-gate-sub">Texas's finest beer, wine &amp; spirits</p>

        <div className="age-gate-divider" />

        <p className="age-gate-question">Are you 21 or older?</p>
        <p className="age-gate-notice">You must be of legal drinking age to access alcohol products on this site.</p>

        <div className="age-gate-actions">
          <button className="age-gate-yes" onClick={confirmAge}>
            Yes, I'm 21+
          </button>
          <button className="age-gate-no" onClick={denyAge}>
            No, I'm not
          </button>
        </div>

        <p className="age-gate-legal">
          🔞 By entering, you agree to our{' '}
          <a href="/terms" className="age-gate-terms-link">Terms &amp; Conditions</a>.
          Please drink responsibly.
        </p>
      </div>
    </div>
  )
}
