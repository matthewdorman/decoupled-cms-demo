import { DrupalArticle, DrupalEvent, DrupalApiResponse } from '../types';

const DRUPAL_BASE_URL = 'https://drupalsite.ddev.site';
const DRUPAL_JSONAPI_URL = `${DRUPAL_BASE_URL}/jsonapi`;

class DrupalApiService {
  private authToken: string | null = null;
  private tokenExpiry: number | null = null;
  private sessionCookie: string | null = null;

  async authenticate(username: string, password: string): Promise<boolean> {
    try {
      // First, get a CSRF token
      const csrfResponse = await fetch(`${DRUPAL_BASE_URL}/session/token`, {
        credentials: 'include',
        headers: {
          'Accept': 'text/plain'
        }
      });
      const csrfToken = await csrfResponse.text();

      // Then authenticate with the login endpoint
      const response = await fetch(`${DRUPAL_BASE_URL}/user/login?_format=json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: username,
          pass: password
        })
      });

      if (response.ok) {
        // Get a fresh CSRF token for authenticated requests
        const tokenResponse = await fetch(`${DRUPAL_BASE_URL}/session/token`, {
          credentials: 'include',
          headers: {
            'Accept': 'text/plain'
          }
        });
        this.authToken = await tokenResponse.text();
        // Set token expiry to 1 hour from now (typical Drupal session)
        this.tokenExpiry = Date.now() + (60 * 60 * 1000);
        
        // Store session info
        localStorage.setItem('drupal_auth_token', this.authToken);
        localStorage.setItem('drupal_auth_expiry', this.tokenExpiry.toString());
        
        console.log('Authentication successful, token stored');
        return true;
      }
      console.error('Authentication failed:', response.status, response.statusText);
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  logout() {
    // Clear server session
    fetch(`${DRUPAL_BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(() => {
      // Ignore errors on logout
    });
    
    // Clear local state
    this.authToken = null;
    this.tokenExpiry = null;
    this.sessionCookie = null;
    localStorage.removeItem('drupal_auth_token');
    localStorage.removeItem('drupal_auth_expiry');
  }

  isAuthenticated(): boolean {
    // Try to restore from localStorage if not in memory
    if (!this.authToken && !this.tokenExpiry) {
      const storedToken = localStorage.getItem('drupal_auth_token');
      const storedExpiry = localStorage.getItem('drupal_auth_expiry');
      
      if (storedToken && storedExpiry) {
        this.authToken = storedToken;
        this.tokenExpiry = parseInt(storedExpiry);
      }
    }
    
    if (!this.authToken || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token has expired
    if (Date.now() > this.tokenExpiry) {
      this.logout();
      return false;
    }
    
    return true;
  }

  private async fetchFromDrupal<T>(endpoint: string): Promise<DrupalApiResponse<T>> {
    try {
      const response = await fetch(`${DRUPAL_JSONAPI_URL}${endpoint}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Drupal API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Drupal API fetch error:', error);
      throw error;
    }
  }

  private async postToDrupal<T>(endpoint: string, data: any): Promise<T> {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      // Get a fresh CSRF token before making the request
      const tokenResponse = await fetch(`${DRUPAL_BASE_URL}/session/token`, {
        credentials: 'include',
        headers: {
          'Accept': 'text/plain'
        }
      });
      const freshToken = await tokenResponse.text();
      this.authToken = freshToken;

      const response = await fetch(`${DRUPAL_JSONAPI_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'X-CSRF-Token': freshToken,
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('POST request failed:', response.status, errorText);
        
        // Parse JSON API error response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors && errorData.errors[0]) {
            const error = errorData.errors[0];
            errorMessage = error.detail || error.title || errorMessage;
          }
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        // Only logout on authentication errors, not permission errors
        if (response.status === 401) {
          console.error('Authentication failed, logging out');
          this.logout();
        } else if (response.status === 403) {
          console.error('Permission denied:', errorMessage);
        }
        
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Drupal POST error:', error);
      throw error;
    }
  }

  private async patchToDrupal<T>(endpoint: string, data: any): Promise<T> {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      // Get a fresh CSRF token before making the request
      const tokenResponse = await fetch(`${DRUPAL_BASE_URL}/session/token`, {
        credentials: 'include',
        headers: {
          'Accept': 'text/plain'
        }
      });
      const freshToken = await tokenResponse.text();
      this.authToken = freshToken;

      const response = await fetch(`${DRUPAL_JSONAPI_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'X-CSRF-Token': freshToken,
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PATCH request failed:', response.status, errorText);
        console.error('Request headers:', {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'X-CSRF-Token': freshToken.substring(0, 20) + '...',
          'credentials': 'include'
        });
        
        // Parse JSON API error response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors && errorData.errors[0]) {
            const error = errorData.errors[0];
            errorMessage = error.detail || error.title || errorMessage;
          }
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        // Only logout on authentication errors, not permission errors
        if (response.status === 401) {
          console.error('Authentication failed, logging out');
          this.logout();
        } else if (response.status === 403) {
          console.error('Permission denied:', errorMessage);
        }
        
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Drupal PATCH error:', error);
      throw error;
    }
  }

  async createArticle(title: string, body: string): Promise<DrupalArticle> {
    const articleData = {
      data: {
        type: 'node--article',
        attributes: {
          title,
          body: {
            value: body,
            format: 'full_html',
            summary: ''
          },
          status: true
        }
      }
    };

    const response = await this.postToDrupal<{ data: any }>('/node/article', articleData);
    return this.formatArticleFromResponse(response.data);
  }

  async updateArticle(id: string, title: string, body: string): Promise<DrupalArticle> {
    // First, get the current article to preserve the existing format
    let existingFormat = 'full_html';
    try {
      const currentData = await this.fetchFromDrupal(`/node/article/${id}`);
      if (currentData.data && currentData.data.attributes.body) {
        existingFormat = currentData.data.attributes.body.format || 'full_html';
      }
    } catch (error) {
      console.warn('Could not fetch existing article format, using full_html');
    }

    const articleData = {
      data: {
        type: 'node--article',
        id,
        attributes: {
          title,
          body: {
            value: body,
            format: existingFormat,
            summary: ''
          }
        }
      }
    };

    const response = await this.patchToDrupal<{ data: any }>(`/node/article/${id}`, articleData);
    return this.formatArticleFromResponse(response.data);
  }

  private formatArticleFromResponse(item: any): DrupalArticle {
    return {
      id: item.id,
      type: 'node--article',
      attributes: {
        title: item.attributes.title,
        body: {
          value: item.attributes.body?.value || '',
          format: item.attributes.body?.format || 'full_html',
          processed: item.attributes.body?.processed || item.attributes.body?.value || ''
        },
        created: item.attributes.created,
        changed: item.attributes.changed || item.attributes.created,
        field_image: item.attributes.field_image
      }
    };
  }

  async getArticle(id: string): Promise<DrupalArticle | null> {
    try {
      const data = await this.fetchFromDrupal(`/node/article/${id}`);
      return data.data ? this.formatArticleFromResponse(data.data) : null;
    } catch (error) {
      console.error('Error fetching Drupal article:', error);
      // Try to find in mock data
      const mockArticles = this.getMockArticles();
      return mockArticles.find(article => article.id === id) || null;
    }
  }

  async getEvent(id: string): Promise<DrupalEvent | null> {
    try {
      const data = await this.fetchFromDrupal(`/node/event/${id}`);
      return data.data || null;
    } catch (error) {
      console.error('Error fetching Drupal event:', error);
      // Try to find in mock data
      const mockEvents = this.getMockEvents();
      return mockEvents.find(event => event.id === id) || null;
    }
  }

  async getArticles(limit: number = 10): Promise<DrupalArticle[]> {
    try {
      const data = await this.fetchFromDrupal(`/node/article?page[limit]=${limit}&include=field_image`);
      
      // Return the JSON API formatted data
      return data.data?.map((item: any) => this.formatArticleFromResponse(item)) || [];
    } catch (error) {
      console.error('Error fetching Drupal articles:', error);
      console.warn('Local Drupal site not accessible or CORS blocked. Using demonstration data.');
      return this.getMockArticles();
    }
  }

  async getEvents(limit: number = 10): Promise<DrupalEvent[]> {
    try {
      const data = await this.fetchFromDrupal(`/node/event?page[limit]=${limit}`);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Drupal events:', error);
      console.warn('CORS restrictions prevent live API access. Using demonstration data.');
      return this.getMockEvents();
    }
  }

  private getMockArticles(): DrupalArticle[] {
    return [
      {
        id: '1',
        type: 'node--article',
        attributes: {
          title: 'Building Modern Drupal Sites with JSON API [CORS BLOCKED - DEMO DATA]',
          body: {
            value: 'CORS restrictions prevent live API access, so this demonstrates the JSON API structure. Discover how to leverage Drupal\'s powerful JSON API to create modern, decoupled web applications.',
            format: 'basic_html',
            processed: '<p><em>CORS restrictions prevent live API access, so this demonstrates the JSON API structure.</em></p><p>Discover how to leverage Drupal\'s powerful JSON API to create modern, decoupled web applications. This comprehensive guide covers everything from basic setup to advanced relationship handling.</p><p>The JSON API module in Drupal core provides a standardized way to expose your content as JSON, making it easy to build React, Vue, or Angular frontends that consume your Drupal content.</p>'
          },
          created: '2024-01-15T10:00:00Z',
          changed: '2024-01-15T10:00:00Z'
        }
      },
      {
        id: '2',
        type: 'node--article',
        attributes: {
          title: 'Mastering Entity Relationships in Drupal JSON API [CORS BLOCKED - DEMO DATA]',
          body: {
            value: 'CORS restrictions prevent live API access. Learn how to work with complex entity relationships using Drupal\'s JSON API.',
            format: 'basic_html',
            processed: '<p><em>CORS restrictions prevent live API access.</em></p><p>Learn how to work with complex entity relationships using Drupal\'s JSON API. From simple references to nested includes, this article covers all the techniques you need.</p><p>Understanding how to properly structure your API calls with includes and sparse fieldsets can dramatically improve your application\'s performance while maintaining clean, predictable data structures.</p>'
          },
          created: '2024-01-10T14:30:00Z',
          changed: '2024-01-10T14:30:00Z'
        }
      },
      {
        id: '3',
        type: 'node--article',
        attributes: {
          title: 'Drupal as a Headless CMS: Performance Best Practices [CORS BLOCKED - DEMO DATA]',
          body: {
            value: 'CORS restrictions prevent live API access. Optimize your headless Drupal setup for maximum performance.',
            format: 'basic_html',
            processed: '<p><em>CORS restrictions prevent live API access.</em></p><p>Optimize your headless Drupal setup for maximum performance. This guide covers caching strategies, query optimization, and frontend integration patterns.</p><p>From Redis caching to CDN integration, learn how to scale your decoupled Drupal architecture to handle high-traffic scenarios while maintaining fast response times.</p>'
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
          title: 'DrupalCon 2024: Decoupled Architecture Workshop [CORS BLOCKED - DEMO DATA]',
          body: {
            value: 'CORS restrictions prevent live API access. Join us for an intensive workshop on building decoupled applications with Drupal.',
            format: 'basic_html',
            processed: '<p><em>CORS restrictions prevent live API access.</em></p><p>Join us for an intensive workshop on building decoupled applications with Drupal.</p>'
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
          title: 'JSON API Deep Dive Webinar [CORS BLOCKED - DEMO DATA]',
          body: {
            value: 'CORS restrictions prevent live API access. Learn advanced techniques for working with Drupal JSON API in this online session.',
            format: 'basic_html',
            processed: '<p><em>CORS restrictions prevent live API access.</em></p><p>Learn advanced techniques for working with Drupal JSON API in this online session.</p>'
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