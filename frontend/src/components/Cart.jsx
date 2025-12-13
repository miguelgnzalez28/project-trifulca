import React, { useState } from 'react'

// Componente interno para manejar imágenes con fallback
const ProductImage = ({ item }) => {
  const [imageError, setImageError] = useState(false)
  const productImage = item.images?.[0] || item.image || null

  if (productImage && !imageError) {
    return (
      <img
        src={productImage}
        alt={item.name}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }
  return <span className="text-3xl">⚽</span>
}

const Cart = ({ cart, isOpen, onClose, onRemoveItem, onUpdateQuantity }) => {
  if (!isOpen) return null

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price * (item.customization?.quantity || 1))
  }, 0)

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return

    let message = '*PEDIDO ULTIMATE KITS*%0A%0A'
    
    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*%0A`
      message += `   Precio: $${item.price}%0A`
      message += `   Talla: ${item.customization?.size}%0A`
      message += `   Versión: ${item.customization?.version}%0A`
      message += `   Mangas: ${item.customization?.sleeve}%0A`
      if (item.customization?.name) message += `   Nombre: ${item.customization.name}%0A`
      if (item.customization?.number) message += `   Dorsal: ${item.customization.number}%0A`
      message += `   Cantidad: ${item.customization?.quantity || 1}%0A`
      message += `   Subtotal: $${(item.price * (item.customization?.quantity || 1)).toFixed(2)}%0A%0A`
    })

    message += `*TOTAL: $${totalPrice.toFixed(2)}*`

    const whatsappNumber = '584146266306'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-dark-grey p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Carrito de Compras</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gold transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-dark-grey mb-2">Tu carrito está vacío</h3>
              <p className="text-medium-grey">Agrega algunos productos para comenzar</p>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="bg-light-grey rounded-lg p-4 border-2 border-light-grey-dark hover:border-primary-red transition-colors duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden relative">
                        <ProductImage item={item} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-grey mb-2 truncate">{item.name}</h3>
                        <div className="text-sm text-medium-grey space-y-1 mb-2">
                          <div>Talla: <span className="font-semibold">{item.customization?.size}</span></div>
                          <div>Versión: {item.customization?.version}</div>
                          <div>Mangas: {item.customization?.sleeve}</div>
                          {item.customization?.name && <div>Nombre: {item.customization.name}</div>}
                          {item.customization?.number && <div>Dorsal: #{item.customization.number}</div>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary-red">
                            ${item.price} x {item.customization?.quantity || 1}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-light-grey-dark text-dark-grey rounded-lg flex items-center justify-center hover:bg-medium-grey hover:text-white transition-colors duration-300 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-dark-grey">
                              {item.customization?.quantity || 1}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-light-grey-dark text-dark-grey rounded-lg flex items-center justify-center hover:bg-medium-grey hover:text-white transition-colors duration-300 font-bold"
                            >
                              +
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="w-8 h-8 bg-primary-red text-white rounded-lg flex items-center justify-center hover:bg-primary-red-dark transition-colors duration-300 ml-2 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-light-grey-dark pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-dark-grey">Total:</span>
                  <span className="text-3xl font-bold text-primary-red">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-light-grey text-dark-grey py-3 px-6 rounded-lg font-bold border-2 border-light-grey-dark hover:bg-light-grey-dark transition-colors duration-300"
                >
                  Seguir Comprando
                </button>
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="flex-1 bg-action-green hover:bg-action-green-dark text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
