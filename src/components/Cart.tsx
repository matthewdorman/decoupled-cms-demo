import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen,
  onClose
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-teal" />
              <h2 className="text-lg font-semibold text-brand-navy">
                Shopping Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-brand-light-gray rounded"
            >
              <X className="w-5 h-5 text-brand-text-gray" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-brand-text-gray mx-auto mb-4" />
                <p className="text-brand-text-gray">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-brand-navy text-sm">
                        {item.name}
                      </h3>
                      <p className="text-brand-teal font-semibold">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-brand-light-gray rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 bg-brand-light-gray rounded text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-brand-light-gray rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => onRemoveItem(item.product_id)}
                          className="ml-auto p-1 hover:bg-brand-red/10 rounded text-brand-red"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-brand-navy">Total:</span>
                <span className="text-xl font-bold text-brand-teal">
                  {formatPrice(getTotal().toString())}
                </span>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-brand-teal text-white py-3 rounded-lg hover:bg-brand-teal/90 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};