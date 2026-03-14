import { useApp } from '../../context/useApp'

export default function CartSidebar({ onCheckout }) {
  const { cart, fullData, updateCart, cartTotal, setCartOpen } = useApp()

  const items = Object.keys(cart).map(name => {
    const product = fullData.find(p => p.Product_Name === name)
    return product
      ? { name, qty: cart[name], price: parseFloat(product.Price.replace('$', '')) }
      : null
  }).filter(Boolean)

  return (
    <div className="cart-sidebar">
      <div className="cart-sidebar-header">
        <h2>Your Cart</h2>
        <button className="cart-close-btn" onClick={() => setCartOpen(false)}>×</button>
      </div>

      {items.length === 0 && (
        <div className="cart-empty">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <p>Your cart is empty</p>
          <span>Add some items to get started</span>
        </div>
      )}

      <div className="cart-items-list">
        {items.map(item => {
          const imgName = item.name.replace(/\//g, '_')
          return (
            <div key={item.name} className="sidebar-item">
              <img
                src={`assets/${imgName}.png`}
                onError={e => { e.target.src = 'assets/logo.png' }}
                className="sidebar-item-img"
                alt={item.name}
              />
              <div className="sidebar-item-info">
                <div className="sidebar-item-name">{item.name}</div>
                <div className="sidebar-item-price">${item.price.toFixed(2)}</div>
              </div>
              <div className="sidebar-counter">
                <button className="sidebar-btn" onClick={() => updateCart(item.name, -1)}>−</button>
                <span>{item.qty}</span>
                <button className="sidebar-btn" onClick={() => updateCart(item.name, 1)}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      {items.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="login-btn" style={{ width: '100%', marginTop: 16, height: 56 }} onClick={onCheckout}>
            CHECKOUT · ${cartTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  )
}
