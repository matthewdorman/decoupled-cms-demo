import { WordPressPost, WordPressEvent } from '../types';

const WORDPRESS_BASE_URL = 'https://wptavern.com/wp-json/wp/v2';

class WordPressApiService {
  private async fetchFromWordPress<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${WORDPRESS_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('WordPress API fetch error:', error);
      throw error;
    }
  }

  async getPosts(limit: number = 10): Promise<WordPressPost[]> {
    try {
      const posts = await this.fetchFromWordPress<WordPressPost[]>(`/posts?per_page=${limit}&_embed`);
      return posts;
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      // Return mock data for demo purposes
      return this.getMockPosts();
    }
  }

  async getEvents(limit: number = 10): Promise<WordPressEvent[]> {
    try {
      // Most WordPress sites don't have events endpoint, so we'll use mock data
      return this.getMockEvents();
    } catch (error) {
      console.error('Error fetching WordPress events:', error);
      return this.getMockEvents();
    }
  }

  private getMockPosts(): WordPressPost[] {
    return [
      {
        id: 1,
        title: {
          rendered: 'Building Headless WordPress with REST API'
        },
        content: {
          rendered: '<p>Discover how to create powerful decoupled applications using WordPress REST API for content management.</p>'
        },
        excerpt: {
          rendered: '<p>Discover how to create powerful decoupled applications using WordPress REST API...</p>'
        },
        date: '2024-01-16T11:00:00',
        modified: '2024-01-16T11:00:00',
        featured_media: 0,
        categories: [1],
        tags: [1, 2]
      },
      {
        id: 2,
        title: {
          rendered: 'WordPress REST API Authentication Strategies'
        },
        content: {
          rendered: '<p>Learn different approaches to secure your WordPress REST API endpoints and protect your content.</p>'
        },
        excerpt: {
          rendered: '<p>Learn different approaches to secure your WordPress REST API endpoints...</p>'
        },
        date: '2024-01-12T15:45:00',
        modified: '2024-01-12T15:45:00',
        featured_media: 0,
        categories: [2],
        tags: [2, 3]
      },
      {
        id: 3,
        title: {
          rendered: 'Custom Post Types in WordPress REST API'
        },
        content: {
          rendered: '<p>Extend your WordPress REST API with custom post types and fields for richer content structures.</p>'
        },
        excerpt: {
          rendered: '<p>Extend your WordPress REST API with custom post types and fields...</p>'
        },
        date: '2024-01-08T09:30:00',
        modified: '2024-01-08T09:30:00',
        featured_media: 0,
        categories: [1, 2],
        tags: [1, 3]
      }
    ];
  }

  private getMockEvents(): WordPressEvent[] {
    return [
      {
        id: 201,
        title: {
          rendered: 'WordCamp 2024: Headless WordPress Track'
        },
        content: {
          rendered: '<p>Explore the latest trends in headless WordPress development at this year\'s WordCamp.</p>'
        },
        date: '2024-01-22T10:00:00',
        acf: {
          event_date: '2024-04-20T10:00:00',
          location: 'San Francisco Marriott'
        }
      },
      {
        id: 202,
        title: {
          rendered: 'REST API Masterclass'
        },
        content: {
          rendered: '<p>Master the WordPress REST API in this comprehensive online workshop.</p>'
        },
        date: '2024-01-19T14:00:00',
        acf: {
          event_date: '2024-03-10T14:00:00',
          location: 'Virtual Event'
        }
      }
    ];
  }
}

export const wordpressApi = new WordPressApiService();