import React from 'react';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import { WooCommerceProduct } from '../types';

interface ProductCardProps {
  product: WooCommerceProduct;
  onAddToCart: (product: WooCommerceProduct) => void;
  onViewDetails: (product: WooCommerceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.images[0]?.src || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-48 object-cover"
        />
        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-brand-red text-white px-2 py-1 rounded text-xs font-medium">
            Sale
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-brand-teal text-white p-1 rounded">
            <Star className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-brand-navy line-clamp-2">
            {product.name}
          </h3>
          <div className="text-right">
            {product.on_sale ? (
              <div>
                <span className="text-lg font-bold text-brand-red">
                  {formatPrice(product.sale_price)}
                </span>
                <div className="text-sm text-brand-text-gray line-through">
                  {formatPrice(product.regular_price)}
                </div>
              </div>
            ) : (
              <span className="text-lg font-bold text-brand-navy">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <p className="text-brand-text-gray text-sm mb-4 line-clamp-2">
          {stripHtml(product.short_description)}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.categories.slice(0, 2).map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-brand-teal/10 text-brand-navy text-xs rounded"
            >
              <Tag className="w-3 h-3" />
              {category.name}
            </span>
          ))}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs px-2 py-1 rounded ${
            product.stock_status === 'instock'
              ? 'bg-green-100 text-green-800'
              : 'bg-brand-red/10 text-brand-red'
          }`}>
            {product.stock_status === 'instock' 
              ? `${product.stock_quantity} in stock`
              : 'Out of stock'
            }
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 px-4 py-2 border border-brand-teal text-brand-teal rounded hover:bg-brand-teal hover:text-white transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock_status !== 'instock'}
            className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};