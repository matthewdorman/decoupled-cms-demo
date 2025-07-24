import React, { useState } from 'react';
import { CreditCard, User, MapPin, X } from 'lucide-react';
import { CartItem, WooCommerceOrder } from '../types';
import { woocommerceApi } from '../services/woocommerceApi';

interface CheckoutFormProps {
  cart: CartItem[];
  onOrderComplete: (order: WooCommerceOrder) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  onOrderComplete,
  onClose,
  isOpen
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    billing: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_1: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US'
    },
    shipping: {
      first_name: '',
      last_name: '',
      address_1: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US'
    },
    payment_method: 'demo',
    same_as_billing: true
  });

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

  const handleInputChange = (section: 'billing' | 'shipping', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        billing: formData.billing,
        shipping: formData.same_as_billing ? formData.billing : formData.shipping,
        line_items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })),
        total: getTotal().toString(),
        payment_method: formData.payment_method
      };

      const order = await woocommerceApi.createOrder(orderData);
      onOrderComplete(order);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-brand-navy">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-light-gray rounded"
            >
              <X className="w-5 h-5 text-brand-text-gray" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Order Summary */}
              <div className="lg:order-2">
                <div className="bg-brand-light-gray rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.product_id} className="flex justify-between">
                        <div>
                          <span className="text-brand-navy">{item.name}</span>
                          <span className="text-brand-text-gray ml-2">× {item.quantity}</span>
                        </div>
                        <span className="text-brand-navy font-medium">
                          {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-brand-navy">
                      <span>Total:</span>
                      <span className="text-brand-teal">{formatPrice(getTotal().toString())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="lg:order-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Billing Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-brand-teal" />
                      <h3 className="text-lg font-semibold text-brand-navy">Billing Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.billing.first_name}
                        onChange={(e) => handleInputChange('billing', 'first_name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.billing.last_name}
                        onChange={(e) => handleInputChange('billing', 'last_name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.billing.email}
                        onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent md:col-span-2"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.billing.phone}
                        onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.billing.address_1}
                        onChange={(e) => handleInputChange('billing', 'address_1', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent md:col-span-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.billing.city}
                        onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.billing.state}
                        onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.billing.postcode}
                        onChange={(e) => handleInputChange('billing', 'postcode', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-brand-teal" />
                      <h3 className="text-lg font-semibold text-brand-navy">Payment Method</h3>
                    </div>
                    
                    <div className="p-4 bg-brand-teal/5 rounded-lg">
                      <p className="text-brand-navy text-sm">
                        <strong>Demo Mode:</strong> This is a demonstration checkout. No actual payment will be processed.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-teal text-white py-4 rounded-lg hover:bg-brand-teal/90 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Place Order - ${formatPrice(getTotal().toString())}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};