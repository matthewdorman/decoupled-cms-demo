import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useWooCommerceProducts, useCart } from '../hooks/useWooCommerce';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { CheckoutForm } from './CheckoutForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { WooCommerceProduct, WooCommerceOrder } from '../types';

export const ECommerceSection: React.FC = () => {
  const { products, loading, error } = useWooCommerceProducts(6);
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WooCommerceProduct | null>(null);
  const [orderComplete, setOrderComplete] = useState<WooCommerceOrder | null>(null);

  const handleAddToCart = (product: WooCommerceProduct) => {
    addToCart(product);
    // Show a brief success message or animation
    setTimeout(() => {
      // Could add a toast notification here
    }, 100);
  };

  const handleViewDetails = (product: WooCommerceProduct) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order: WooCommerceOrder) => {
    setOrderComplete(order);
    setIsCheckoutOpen(false);
    clearCart();
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-teal/10 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">WooCommerce Store</h2>
            <p className="text-brand-text-gray">Products from The Crucible's WooCommerce API</p>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

      {/* Order Success Message */}
      {orderComplete && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">Order Placed Successfully! 🎉</h3>
          <p className="text-green-700 text-sm">
            Order #{orderComplete.id} has been created. Total: {formatPrice(orderComplete.total)}
          </p>
          <button
            onClick={() => setOrderComplete(null)}
            className="mt-2 text-green-600 hover:text-green-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* API Information */}
      <div className="mt-8 p-4 bg-brand-light-gray rounded-lg">
        <h3 className="text-sm font-semibold text-brand-navy mb-2">WooCommerce API Details</h3>
        <div className="text-xs text-brand-text-gray space-y-1">
          <p><strong>Endpoint:</strong> https://www.thecrucible.org/wp-json/wc/v3/products</p>
          <p><strong>Features:</strong> Product catalog, cart management, checkout flow</p>
          <p><strong>Data Structure:</strong> WooCommerce REST API format with product attributes, pricing, and inventory</p>
          <p><strong>Demo Mode:</strong> Checkout is simulated - no actual payments are processed</p>
        </div>
      </div>

      {/* Cart Sidebar */}
      <Cart
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Checkout Form */}
      <CheckoutForm
        cart={cart}
        onOrderComplete={handleOrderComplete}
        onClose={() => setIsCheckoutOpen(false)}
        isOpen={isCheckoutOpen}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProduct(null)} />
          
          <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-brand-navy">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-brand-text-gray hover:text-brand-navy"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.images[0]?.src || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={selectedProduct.name}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-brand-teal">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.on_sale && (
                      <span className="ml-2 text-lg text-brand-text-gray line-through">
                        {formatPrice(selectedProduct.regular_price)}
                      </span>
                    )}
                  </div>
                  
                  <div 
                    className="prose prose-sm mb-6"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                  />
                  
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-brand-teal text-white py-3 rounded-lg hover:bg-brand-teal/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};