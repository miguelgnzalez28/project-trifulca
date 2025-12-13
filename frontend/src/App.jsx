import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import TopSalesSection from './components/TopSalesSection'
import ProductGrid from './components/ProductGrid'
import ProductDetail from './components/ProductDetail'
import FAQ from './components/FAQ'
import Cart from './components/Cart'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AdminPanel from './components/AdminPanel'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleAddToCart = (product, customization) => {
    const cartItem = {
      ...product,
      customization,
      id: Date.now()
    }
    setCart([...cart, cartItem])
    setSelectedProduct(null)
    
    // Mostrar notificación de éxito
    alert('¡Producto agregado al carrito!')
  }

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const handleUpdateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = (item.customization?.quantity || 1) + change
        if (newQuantity < 1) return item
        return {
          ...item,
          customization: {
            ...item.customization,
            quantity: newQuantity
          }
        }
      }
      return item
    }))
  }

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    
    // Limpiar carrito al cerrar sesión (opcional - puedes comentar esta línea si quieres mantener el carrito)
    // setCart([])
    
    // Mostrar mensaje de confirmación
    alert('Sesión cerrada correctamente. ¡Hasta pronto!')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cart={cart} 
        onCartClick={handleCartClick}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onAdminClick={() => setShowAdmin(true)}
        onLogout={handleLogout}
      />
      <main>
        <HeroBanner />
        <TopSalesSection onProductSelect={setSelectedProduct} />
        <ProductGrid onProductSelect={setSelectedProduct} />
        <FAQ />
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </main>
      <Footer />
      
      {/* Carrito */}
      <Cart 
        cart={cart}
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin Panel */}
      {showAdmin && user?.is_admin && (
        <AdminPanel
          user={user}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}

export default App
