import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useApp } from '../../context/useApp'

export default function SetupPage() {
  const { currentUser, goOverlay } = useApp()
  const [name, setName]           = useState('')
  const [address, setAddress]     = useState('')
  const [preview, setPreview]     = useState('assets/logo.png')
  const [base64Photo, setBase64Photo] = useState('')

  const previewImg = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => { setPreview(e.target.result); setBase64Photo(e.target.result) }
    reader.readAsDataURL(file)
  }

  const completeSetup = async () => {
    if (!currentUser) return
    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        name: name || currentUser.displayName || 'User',
        email: currentUser.email,
        address,
        photo: base64Photo || currentUser.photoURL || 'assets/logo.png',
        cart: {},
      },
      { merge: true }
    )
    goOverlay('location')
  }

  return (
    <section className="section-full">
      <div className="modal-container">
        <h2 style={{ marginBottom: 8, fontWeight: 900, letterSpacing: 2 }}>SETUP YOUR PROFILE</h2>
        <p style={{ opacity: 0.5, fontSize: 13, marginBottom: 25 }}>Just a few details to get started</p>

        <div style={{ margin: '0 0 20px' }}>
          <img src={preview} className="p-img-large" alt="preview" />
        </div>

        <label className="login-btn" style={{ background: 'var(--card-bg)', color: 'var(--text)', marginBottom: 15, border: '1.5px solid var(--border)', fontSize: 12, cursor: 'pointer' }}>
          📸 CHOOSE PHOTO
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => previewImg(e.target.files[0])} />
        </label>

        <input
          type="text"
          className="log-field"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <textarea
          className="log-field"
          style={{ height: 90, marginBottom: 20 }}
          placeholder="Texas Delivery Address (optional)"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button className="login-btn" style={{ width: '100%', padding: 18 }} onClick={completeSetup}>
          CONTINUE →
        </button>
      </div>
    </section>
  )
}
