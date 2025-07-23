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