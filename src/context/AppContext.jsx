import { useState, useEffect, useRef } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { AppContext } from './AppContext.js'

export function AppProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData]       = useState(null)
  const [authReady, setAuthReady]     = useState(false)   // true once first auth check done

  // ── Age verification (reset every page load) ─────────
  const [ageChecked, setAgeChecked] = useState(false)  // has the gate been answered?
  const [isAdult, setIsAdult]       = useState(false)  // did they say yes?

  const confirmAge  = () => { setAgeChecked(true); setIsAdult(true) }
  const denyAge     = () => { setAgeChecked(true); setIsAdult(false) }

  // ── Overlay / modal routing ───────────────────────────
  // 'none' | 'login' | 'setup' | 'location' | 'profile'
  const [overlay, setOverlay]         = useState('none')
  const overlayRef                    = useRef('none')
  const goOverlay = (s) => { overlayRef.current = s; setOverlay(s) }

  // ── Cart ──────────────────────────────────────────────
  const [cart, setCart]               = useState({})
  const [cartOpen, setCartOpen]       = useState(false)

  // ── Products (shared so store & checkout both use same cache) ──
  const [fullData, setFullData]       = useState([])

  // ── Store navigation ref — useProducts registers its filterByCat here ──
  const filterByCatRef = useRef(null)

  // ── Theme ─────────────────────────────────────────────
  const [theme, setTheme]             = useState(() => localStorage.getItem('theme') || 'light')

  // ── Delivery / location ───────────────────────────────
  const [deliveryInfo, setDeliveryInfo] = useState({ mode: '', address: '' })
  const [locationDone, setLocationDone] = useState(false)

  // ── Apply theme ───────────────────────────────────────
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // ── Auth listener ─────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const ud = snap.data()
          setCart(ud.cart || {})
          setUserData(ud)
          if (overlayRef.current === 'login') goOverlay('location')
        } else {
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || 'User',
            email: user.email,
            photo: user.photoURL || 'assets/logo.png',
            cart: {},
          })
          goOverlay('setup')
        }
      } else {
        setCurrentUser(null)
        setUserData(null)
        if (['login', 'setup', 'location'].includes(overlayRef.current)) {
          goOverlay('none')
        }
      }
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  // ── Cart helpers ──────────────────────────────────────
  const updateCart = (name, delta) => {
    setCart(prev => {
      const updated = { ...prev }
      updated[name] = (updated[name] || 0) + delta
      if (updated[name] <= 0) delete updated[name]
      if (currentUser) {
        updateDoc(doc(db, 'users', currentUser.uid), { cart: updated }).catch(() => {})
      }
      return updated
    })
  }

  const clearCart = () => {
    setCart({})
    if (currentUser) {
      updateDoc(doc(db, 'users', currentUser.uid), { cart: {} }).catch(() => {})
    }
  }

  const cartTotal = Object.entries(cart).reduce((sum, [name, qty]) => {
    const product = fullData.find(p => p.Product_Name === name)
    if (product) sum += parseFloat(product.Price.replace('$', '')) * qty
    return sum
  }, 0)

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0)

  // ── Auth helpers ──────────────────────────────────────
  const logout = () => signOut(auth)

  const saveProfile = async (updates) => {
    if (!currentUser) return
    await updateDoc(doc(db, 'users', currentUser.uid), updates)
    setUserData(prev => ({ ...prev, ...updates }))
  }

  return (
    <AppContext.Provider value={{
      // age gate
      ageChecked, isAdult, confirmAge, denyAge,
      // auth
      currentUser, userData, authReady, logout, saveProfile,
      // overlay
      overlay, goOverlay,
      // cart
      cart, updateCart, clearCart, cartTotal, cartCount,
      cartOpen, setCartOpen,
      // products
      fullData, setFullData,
      filterByCatRef,
      // theme
      theme, toggleTheme,
      // delivery
      deliveryInfo, setDeliveryInfo,
      locationDone, setLocationDone,
    }}>
      {children}
    </AppContext.Provider>
  )
}
