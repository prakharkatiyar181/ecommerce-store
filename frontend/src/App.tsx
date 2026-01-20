import { useState, lazy, Suspense } from 'react'
import { Header } from './components/common/Header'
import { Toast } from './components/common/Toast'
import { ProductGrid } from './components/product/ProductGrid'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { useCart } from './hooks/useCart'
import { useAdmin } from './hooks/useAdmin'

// Lazy load heavy components - faster initial page load
const CartModal = lazy(() => import('./components/cart/CartModal').then(module => ({ default: module.CartModal })))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })))

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
        <Suspense fallback={<LoadingSpinner />}>
          <AdminDashboard statistics={statistics} />
        </Suspense>
      )}

      {/* Only load cart when opened */}
      {showCart && (
        <Suspense fallback={null}>
          <CartModal
            cart={cart}
            products={products}
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
