import { WooCommerceProduct, WooCommerceOrder, CartItem } from '../types';

const WOOCOMMERCE_BASE_URL = 'https://www.thecrucible.org/wp-json/wc/v3';

class WooCommerceApiService {
  private async fetchFromWooCommerce<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${WOOCOMMERCE_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('WooCommerce API fetch error:', error);
      throw error;
    }
  }

  async getProducts(limit: number = 10): Promise<WooCommerceProduct[]> {
    try {
      const products = await this.fetchFromWooCommerce<WooCommerceProduct[]>(`/products?per_page=${limit}&status=publish`);
      return products;
    } catch (error) {
      console.error('Error fetching WooCommerce products:', error);
      // Return mock data for demo purposes
      return this.getMockProducts();
    }
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    try {
      const product = await this.fetchFromWooCommerce<WooCommerceProduct>(`/products/${id}`);
      return product;
    } catch (error) {
      console.error('Error fetching WooCommerce product:', error);
      // Return mock product
      const mockProducts = this.getMockProducts();
      return mockProducts.find(p => p.id === id) || mockProducts[0];
    }
  }

  async createOrder(orderData: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    try {
      // In a real implementation, this would create an actual order
      // For demo purposes, we'll simulate the response
      const mockOrder: WooCommerceOrder = {
        id: Math.floor(Math.random() * 10000),
        status: 'pending',
        total: orderData.total || '0',
        billing: orderData.billing || {},
        shipping: orderData.shipping || {},
        line_items: orderData.line_items || [],
        date_created: new Date().toISOString(),
        order_key: `wc_order_${Date.now()}`,
        payment_method: orderData.payment_method || 'demo'
      };
      
      return mockOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  private getMockProducts(): WooCommerceProduct[] {
    return [
      {
        id: 1,
        name: 'Woodworking Create Lab',
        slug: 'woodworking-create-lab',
        description: '<p>Learn the fundamentals of woodworking in our fully equipped workshop. This hands-on class covers essential techniques, safety protocols, and tool usage.</p><p>Perfect for beginners looking to start their woodworking journey or intermediate makers wanting to refine their skills.</p>',
        short_description: 'Learn the fundamentals of woodworking in our fully equipped workshop.',
        price: '295.00',
        regular_price: '295.00',
        sale_price: '',
        on_sale: false,
        status: 'publish',
        featured: true,
        catalog_visibility: 'visible',
        stock_status: 'instock',
        stock_quantity: 12,
        manage_stock: true,
        images: [
          {
            id: 1,
            src: 'https://images.pexels.com/photos/175709/pexels-photo-175709.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt: 'Woodworking workshop with tools and materials'
          }
        ],
        categories: [
          {
            id: 1,
            name: 'Workshops',
            slug: 'workshops'
          },
          {
            id: 2,
            name: 'Woodworking',
            slug: 'woodworking'
          }
        ],
        attributes: [
          {
            id: 1,
            name: 'Duration',
            options: ['4 hours']
          },
          {
            id: 2,
            name: 'Skill Level',
            options: ['Beginner to Intermediate']
          }
        ]
      },
      {
        id: 2,
        name: 'Metalworking Fundamentals',
        slug: 'metalworking-fundamentals',
        description: '<p>Discover the art of metalworking with our comprehensive fundamentals course. Learn welding, cutting, and shaping techniques using professional-grade equipment.</p><p>This course covers safety procedures, material selection, and basic fabrication methods.</p>',
        short_description: 'Discover the art of metalworking with our comprehensive fundamentals course.',
        price: '350.00',
        regular_price: '350.00',
        sale_price: '',
        on_sale: false,
        status: 'publish',
        featured: false,
        catalog_visibility: 'visible',
        stock_status: 'instock',
        stock_quantity: 8,
        manage_stock: true,
        images: [
          {
            id: 2,
            src: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt: 'Metalworking tools and sparks from welding'
          }
        ],
        categories: [
          {
            id: 1,
            name: 'Workshops',
            slug: 'workshops'
          },
          {
            id: 3,
            name: 'Metalworking',
            slug: 'metalworking'
          }
        ],
        attributes: [
          {
            id: 1,
            name: 'Duration',
            options: ['6 hours']
          },
          {
            id: 2,
            name: 'Skill Level',
            options: ['Beginner']
          }
        ]
      },
      {
        id: 3,
        name: 'Ceramics & Pottery Workshop',
        slug: 'ceramics-pottery-workshop',
        description: '<p>Explore the ancient art of ceramics and pottery in our well-equipped studio. Learn hand-building techniques, wheel throwing, and glazing methods.</p><p>All materials and firing included. Take home your finished pieces!</p>',
        short_description: 'Explore the ancient art of ceramics and pottery in our well-equipped studio.',
        price: '225.00',
        regular_price: '275.00',
        sale_price: '225.00',
        on_sale: true,
        status: 'publish',
        featured: true,
        catalog_visibility: 'visible',
        stock_status: 'instock',
        stock_quantity: 15,
        manage_stock: true,
        images: [
          {
            id: 3,
            src: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt: 'Hands shaping clay on pottery wheel'
          }
        ],
        categories: [
          {
            id: 1,
            name: 'Workshops',
            slug: 'workshops'
          },
          {
            id: 4,
            name: 'Ceramics',
            slug: 'ceramics'
          }
        ],
        attributes: [
          {
            id: 1,
            name: 'Duration',
            options: ['3 hours']
          },
          {
            id: 2,
            name: 'Skill Level',
            options: ['All Levels']
          }
        ]
      }
    ];
  }
}

export const woocommerceApi = new WooCommerceApiService();