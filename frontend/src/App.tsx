import { useState } from 'react'
import { Header } from './components/common/Header'
import { Toast } from './components/common/Toast'
import { ProductGrid } from './components/product/ProductGrid'
import { CartModal } from './components/cart/CartModal'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { useCart } from './hooks/useCart'
import { useAdmin } from './hooks/useAdmin'

function App() {
  const [showCart, setShowCart] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const {
    products,
    cart,
    loading,
    message,
    setMessage,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout
  } = useCart()

  const { statistics, loadStatistics } = useAdmin()

  const handleToggleAdmin = () => {
    setShowAdmin(!showAdmin)
    if (!showAdmin) {
      loadStatistics()
    }
  }

  const handleCheckout = (discountCode: string) => {
    checkout(discountCode)
    setShowCart(false)
  }

  return (
    <div>
      <Toast message={message} onClose={() => setMessage({ type: '', text: '' })} />

      <Header
        showAdmin={showAdmin}
        cartItemCount={cartItemCount}
        onToggleAdmin={handleToggleAdmin}
        onOpenCart={() => setShowCart(true)}
      />

      {!showAdmin ? (
        <div className="container">
          <h1>Products</h1>
          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={addToCart}
          />
        </div>
      ) : (
        <AdminDashboard statistics={statistics} />
      )}

      <CartModal
        cart={cart}
        products={products}
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}

export default App
