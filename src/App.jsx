import { useNavigate, Routes, Route } from 'react-router-dom'
import './App.css'
import { AppProvider } from './context/AppContext.jsx'
import { useApp } from './context/useApp'
import StorePage    from './components/pages/StorePage'
import CheckoutPage from './components/pages/CheckoutPage'
import ProfilePage  from './components/pages/ProfilePage'
import LoginPage    from './components/auth/LoginPage'
import SetupPage    from './components/auth/SetupPage'
import LocationPage from './components/auth/LocationPage'
import CartSidebar  from './components/ui/CartSidebar'
import TermsPage    from './components/pages/TermsPage'

function AppShell() {
  const navigate = useNavigate()
  const {
    overlay, goOverlay,
    cartOpen, setCartOpen,
    currentUser,
    setDeliveryInfo, setLocationDone,
  } = useApp()

  const handleCheckout = () => {
    setCartOpen(false)
    if (!currentUser) {
      goOverlay('login')
    } else {
      goOverlay('location')
    }
  }

  return (
    <div>
      {/* ── Store is always rendered ── */}
      <StorePage />

      {/* ── Overlays ── */}
      {overlay === 'profile' && (
        <div className="modal-fullscreen"><ProfilePage /></div>
      )}
      {overlay === 'login' && (
        <div className="modal-fullscreen"><LoginPage /></div>
      )}
      {overlay === 'setup' && (
        <div className="modal-fullscreen"><SetupPage /></div>
      )}
      {overlay === 'location' && (
        <div className="modal-fullscreen">
          <LocationPage
            onDone={(info) => {
              setDeliveryInfo(info)
              setLocationDone(true)
              goOverlay('none')
              navigate('/checkout')
            }}
          />
        </div>
      )}

      {/* ── Cart Sidebar ── */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} />
          <CartSidebar onCheckout={handleCheckout} />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/checkout" element={<ProtectedCheckout />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<AppShell />} />
      </Routes>
    </AppProvider>
  )
}

function ProtectedCheckout() {
  const { currentUser } = useApp()
  return currentUser
    ? <CheckoutPage />
    : <div className="modal-fullscreen"><LoginPage /></div>
}

export default App
