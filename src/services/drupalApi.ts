import { DrupalArticle, DrupalEvent, DrupalApiResponse } from '../types';

const DRUPAL_BASE_URL = 'https://www.drupal.org/api-d7';

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
      // Using Drupal.org's API as an example - in real implementation you'd use JSON API format
      const response = await fetch(`${DRUPAL_BASE_URL}/node.json?type=page&limit=${limit}`);
      const data = await response.json();
      
      // Transform the data to match our expected format
      return data.list?.map((item: any) => ({
        id: item.nid,
        type: 'node--article',
        attributes: {
          title: item.title,
          body: {
            value: item.body || '',
            format: 'basic_html',
            processed: item.body || ''
          },
          created: item.created,
          changed: item.changed || item.created
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
          title: 'Getting Started with Drupal JSON API',
          body: {
            value: 'Learn how to build decoupled applications using Drupal as a headless CMS with JSON API.',
            format: 'basic_html',
            processed: '<p>Learn how to build decoupled applications using Drupal as a headless CMS with JSON API.</p>'
          },
          created: '2024-01-15T10:00:00Z',
          changed: '2024-01-15T10:00:00Z'
        }
      },
      {
        id: '2',
        type: 'node--article',
        attributes: {
          title: 'Advanced JSON API Relationships',
          body: {
            value: 'Explore complex data relationships and includes in Drupal JSON API responses.',
            format: 'basic_html',
            processed: '<p>Explore complex data relationships and includes in Drupal JSON API responses.</p>'
          },
          created: '2024-01-10T14:30:00Z',
          changed: '2024-01-10T14:30:00Z'
        }
      },
      {
        id: '3',
        type: 'node--article',
        attributes: {
          title: 'Performance Optimization for Headless Drupal',
          body: {
            value: 'Best practices for optimizing performance in decoupled Drupal architectures.',
            format: 'basic_html',
            processed: '<p>Best practices for optimizing performance in decoupled Drupal architectures.</p>'
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