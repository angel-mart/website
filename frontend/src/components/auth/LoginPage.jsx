import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth'
import { auth, provider } from '../../firebase'
import { useApp } from '../../context/useApp'

export default function LoginPage() {
  const { goOverlay } = useApp()
  const [isRegMode, setIsRegMode] = useState(false)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    try {
      if (isRegMode) {
        const r = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(r.user)
        alert('Check your email to verify your account!')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section className="section-full">
      <div className="modal-container">
        <button className="back-link" style={{ marginBottom: 20 }} onClick={() => goOverlay('none')}>
          ← Back to Store
        </button>
        {/* <img src="assets/logo.png" style={{ height: 70, marginBottom: 20 }} alt="logo" /> */}
        <h1 style={{ marginBottom: 8, letterSpacing: 3, fontWeight: 900, fontSize: 22 }}>
          {isRegMode ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </h1>
        <p style={{ opacity: 0.5, fontSize: 13, marginBottom: 30 }}>
          {isRegMode ? 'Join Angel Mart' : 'Sign in to checkout'}
        </p>

        <input
          type="email"
          className="log-field"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <input
          type="password"
          className="log-field"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ marginBottom: 20 }}
        />

        <button className="login-btn" style={{ width: '100%', padding: 18 }} onClick={handleAuth} disabled={loading}>
          {loading ? 'PLEASE WAIT...' : isRegMode ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button className="google-btn" onClick={loginWithGoogle}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/40px-Google_%22G%22_logo.svg.png"
            width={20} alt="Google"
          />
          Continue with Google
        </button>

        <p style={{ marginTop: 25, fontSize: 13, cursor: 'pointer', opacity: 0.7 }} onClick={() => setIsRegMode(m => !m)}>
          {isRegMode ? 'Already have an account? ' : "Don't have an account? "}
          <b style={{ textDecoration: 'underline', opacity: 1, color: 'var(--text)' }}>
            {isRegMode ? 'Sign In' : 'Create one'}
          </b>
        </p>
      </div>
    </section>
  )
}
