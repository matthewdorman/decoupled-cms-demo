import { DrupalArticle, DrupalEvent, DrupalApiResponse } from '../types';

const DRUPAL_BASE_URL = 'https://drupalize.me/jsonapi';

class DrupalApiService {
  private async fetchFromDrupal<T>(endpoint: string): Promise<DrupalApiResponse<T>> {
    try {
      const response = await fetch(`${DRUPAL_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Drupal API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Drupal API fetch error:', error);
      throw error;
    }
  }

  async getArticles(limit: number = 10): Promise<DrupalArticle[]> {
    try {
      // Using Drupalize.me's JSON API endpoint for articles
      const response = await fetch(`${DRUPAL_BASE_URL}/node/article?page[limit]=${limit}&include=field_image`);
      const data = await response.json();
      
      // Return the JSON API formatted data
      return data.data?.map((item: any) => ({
        id: item.id,
        type: 'node--article',
        attributes: {
          title: item.attributes.title,
          body: {
            value: item.attributes.body?.value || '',
            format: 'basic_html',
            processed: item.attributes.body?.processed || item.attributes.body?.value || ''
          },
          created: item.attributes.created,
          changed: item.attributes.changed || item.attributes.created,
          field_image: item.attributes.field_image
        }
      })) || [];
    } catch (error) {
      console.error('Error fetching Drupal articles:', error);
      // Return mock data for demo purposes
      return this.getMockArticles();
    }
  }

  async getEvents(limit: number = 10): Promise<DrupalEvent[]> {
    try {
      // Mock events since we don't have a real events endpoint
      return this.getMockEvents();
    } catch (error) {
      console.error('Error fetching Drupal events:', error);
      return this.getMockEvents();
    }
  }

  private getMockArticles(): DrupalArticle[] {
    return [
      {
        id: '1',
        type: 'node--article',
        attributes: {
          title: 'Building Modern Drupal Sites with JSON API',
          body: {
            value: 'Discover how to leverage Drupal\'s powerful JSON API to create modern, decoupled web applications. This comprehensive guide covers everything from basic setup to advanced relationship handling.',
            format: 'basic_html',
            processed: '<p>Discover how to leverage Drupal\'s powerful JSON API to create modern, decoupled web applications. This comprehensive guide covers everything from basic setup to advanced relationship handling.</p><p>The JSON API module in Drupal core provides a standardized way to expose your content as JSON, making it easy to build React, Vue, or Angular frontends that consume your Drupal content.</p>'
          },
          created: '2024-01-15T10:00:00Z',
          changed: '2024-01-15T10:00:00Z'
        }
      },
      {
        id: '2',
        type: 'node--article',
        attributes: {
          title: 'Mastering Entity Relationships in Drupal JSON API',
          body: {
            value: 'Learn how to work with complex entity relationships using Drupal\'s JSON API. From simple references to nested includes, this article covers all the techniques you need.',
            format: 'basic_html',
            processed: '<p>Learn how to work with complex entity relationships using Drupal\'s JSON API. From simple references to nested includes, this article covers all the techniques you need.</p><p>Understanding how to properly structure your API calls with includes and sparse fieldsets can dramatically improve your application\'s performance while maintaining clean, predictable data structures.</p>'
          },
          created: '2024-01-10T14:30:00Z',
          changed: '2024-01-10T14:30:00Z'
        }
      },
      {
        id: '3',
        type: 'node--article',
        attributes: {
          title: 'Drupal as a Headless CMS: Performance Best Practices',
          body: {
            value: 'Optimize your headless Drupal setup for maximum performance. This guide covers caching strategies, query optimization, and frontend integration patterns.',
            format: 'basic_html',
            processed: '<p>Optimize your headless Drupal setup for maximum performance. This guide covers caching strategies, query optimization, and frontend integration patterns.</p><p>From Redis caching to CDN integration, learn how to scale your decoupled Drupal architecture to handle high-traffic scenarios while maintaining fast response times.</p>'
          },
          created: '2024-01-05T09:15:00Z',
          changed: '2024-01-05T09:15:00Z'
        }
      }
    ];
  }

  private getMockEvents(): DrupalEvent[] {
    return [
      {
        id: '101',
        type: 'node--event',
        attributes: {
          title: 'DrupalCon 2024: Decoupled Architecture Workshop',
          body: {
            value: 'Join us for an intensive workshop on building decoupled applications with Drupal.',
            format: 'basic_html',
            processed: '<p>Join us for an intensive workshop on building decoupled applications with Drupal.</p>'
          },
          field_event_date: '2024-03-15T13:00:00Z',
          field_location: 'Portland Convention Center',
          created: '2024-01-20T08:00:00Z'
        }
      },
      {
        id: '102',
        type: 'node--event',
        attributes: {
          title: 'JSON API Deep Dive Webinar',
          body: {
            value: 'Learn advanced techniques for working with Drupal JSON API in this online session.',
            format: 'basic_html',
            processed: '<p>Learn advanced techniques for working with Drupal JSON API in this online session.</p>'
          },
          field_event_date: '2024-02-28T16:00:00Z',
          field_location: 'Online',
          created: '2024-01-18T12:00:00Z'
        }
      }
    ];
  }
}

export const drupalApi = new DrupalApiService();