// Drupal JSON API Types
export interface DrupalArticle {
  id: string;
  type: string;
  attributes: {
    title: string;
    body?: {
      value: string;
      format: string;
      processed: string;
    };
    created: string;
    changed: string;
    field_image?: {
      alt: string;
      title: string;
      width: number;
      height: number;
    };
  };
  relationships?: {
    field_tags?: {
      data: Array<{
        type: string;
        id: string;
      }>;
    };
  };
}

export interface DrupalEvent {
  id: string;
  type: string;
  attributes: {
    title: string;
    body?: {
      value: string;
      format: string;
      processed: string;
    };
    field_event_date?: string;
    field_location?: string;
    created: string;
  };
}

// WordPress REST API Types
export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressEvent {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  acf?: {
    event_date?: string;
    location?: string;
  };
  meta?: {
    event_date?: string;
    location?: string;
  };
}

// API Response Types
export interface DrupalApiResponse<T> {
  data: T[];
  included?: any[];
  links?: {
    next?: {
      href: string;
    };
    prev?: {
      href: string;
    };
  };
}

export interface WordPressApiResponse<T> extends Array<T> {}

// WooCommerce Types
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  stock_status: string;
  stock_quantity: number;
  manage_stock: boolean;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  image: string;
}

export interface WooCommerceOrder {
  id: number;
  status: string;
  total: string;
  billing: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
    name: string;
    price: string;
  }>;
  date_created: string;
  order_key: string;
  payment_method: string;
}