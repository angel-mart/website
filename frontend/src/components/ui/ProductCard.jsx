import { useApp } from '../../context/useApp'

export default function ProductCard({ product, isFull }) {
  const { cart, updateCart } = useApp()
  const qty = cart[product.Product_Name] || 0
  const imgName = product.Product_Name.replace(/\//g, '_')

  return (
    <div className={`card${isFull ? ' card-full' : ''}`}>
      <div className="img-box">
        <img
          src={`assets/${imgName}.png`}
          onError={e => { e.target.src = 'assets/logo.png' }}
          alt={product.Product_Name}
        />
      </div>
      <div className="product-name">{product.Product_Name}</div>
      <b className="product-price">{product.Price}</b>
      {qty > 0 ? (
        <div className="blinkit-counter">
          <button className="blinkit-btn" onClick={() => updateCart(product.Product_Name, -1)}>-</button>
          <span>{qty}</span>
          <button className="blinkit-btn" onClick={() => updateCart(product.Product_Name, 1)}>+</button>
        </div>
      ) : (
        <button className="add-initial" onClick={() => updateCart(product.Product_Name, 1)}>+ ADD</button>
      )}
    </div>
  )
}
