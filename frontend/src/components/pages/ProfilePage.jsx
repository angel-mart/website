import { useState, useEffect } from 'react'
import { useApp } from '../../context/useApp'

export default function ProfilePage() {
  const { currentUser, userData, saveProfile, logout, goOverlay } = useApp()
  const [name, setName]       = useState('')
  const [address, setAddress] = useState('')
  const [photo, setPhoto]     = useState('assets/logo.png')

  useEffect(() => {
    if (userData) {
      setName(userData.name || '')
      setAddress(userData.address || '')
      setPhoto(userData.photo || 'assets/logo.png')
    }
  }, [userData])

  const updatePhoto = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setPhoto(e.target.result)
      saveProfile({ photo: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    saveProfile({ name, address, photo })
    alert('Profile updated!')
  }

  return (
    <div className="profile-logs-section">
      <div style={{ maxWidth: 500, width: '100%' }}>
        <div
          className="back-link"
          onClick={() => goOverlay('none')}
        >
          ← Back to Store
        </div>

        <div className="profile-card-beast">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={photo} className="p-img-large" alt="profile" />
              <label className="p-edit-btn">
                📸
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => updatePhoto(e.target.files[0])}
                />
              </label>
            </div>
            <h2 style={{ marginTop: 15, fontWeight: 900, letterSpacing: 1 }}>MY PROFILE</h2>
          </div>

          <div className="log-input-group">
            <label className="log-label">FULL NAME</label>
            <input type="text" className="log-field" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="log-input-group">
            <label className="log-label">EMAIL</label>
            <input type="text" className="log-field" value={currentUser?.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>

          <div className="log-input-group">
            <label className="log-label">DELIVERY ADDRESS</label>
            <textarea className="log-field" rows={2} value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <button className="login-btn" style={{ width: '100%', marginTop: 30, padding: 18 }} onClick={save}>
            SAVE CHANGES
          </button>
          <button
            className="login-btn"
            style={{ width: '100%', background: '#ff4444', color: '#fff', marginTop: 15, padding: 15, fontSize: 12 }}
            onClick={logout}
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}
