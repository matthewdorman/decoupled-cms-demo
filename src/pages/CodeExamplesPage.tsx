import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Database, Globe } from 'lucide-react';
import { CodeExample } from '../components/CodeExample';

export const CodeExamplesPage: React.FC = () => {
  const drupalExamples = [
    {
      title: 'Fetch Articles from Drupal JSON API',
      language: 'JavaScript',
      description: 'Basic example of fetching articles using Drupal\'s JSON API with includes for related data.',
      code: `// Fetch articles with related image data
const fetchDrupalArticles = async (limit = 10) => {
  const response = await fetch(
    \`https://drupalize.me/jsonapi/node/article?page[limit]=\${limit}&include=field_image\`
  );
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  
  // JSON API format: data is always an array
  return data.data.map(article => ({
    id: article.id,
    title: article.attributes.title,
    body: article.attributes.body?.processed || '',
    created: article.attributes.created,
    image: article.relationships?.field_image?.data
  }));
};

// Usage
fetchDrupalArticles(5)
  .then(articles => console.log('Articles:', articles))
  .catch(error => console.error('Error:', error));`
    },
    {
      title: 'Drupal JSON API with Relationships',
      language: 'JavaScript',
      description: 'Advanced example showing how to work with entity relationships and included data.',
      code: `// Fetch articles with taxonomy terms and author information
const fetchArticlesWithRelationships = async () => {
  const response = await fetch(
    'https://drupalize.me/jsonapi/node/article?' +
    'include=field_tags,uid&' +
    'fields[node--article]=title,body,created,field_tags,uid&' +
    'fields[taxonomy_term--tags]=name&' +
    'fields[user--user]=display_name'
  );
  
  const data = await response.json();
  
  // Process included data
  const included = data.included || [];
  const getIncluded = (type, id) => 
    included.find(item => item.type === type && item.id === id);
  
  return data.data.map(article => ({
    id: article.id,
    title: article.attributes.title,
    body: article.attributes.body?.processed,
    created: article.attributes.created,
    tags: article.relationships?.field_tags?.data?.map(tag => 
      getIncluded('taxonomy_term--tags', tag.id)?.attributes.name
    ).filter(Boolean) || [],
    author: getIncluded('user--user', 
      article.relationships?.uid?.data?.id
    )?.attributes.display_name
  }));
};`
    },
    {
      title: 'React Hook for Drupal Content',
      language: 'TypeScript',
      description: 'Custom React hook for managing Drupal content with loading states and error handling.',
      code: `import { useState, useEffect } from 'react';

interface DrupalArticle {
  id: string;
  title: string;
  body: string;
  created: string;
}

export const useDrupalArticles = (limit: number = 10) => {
  const [articles, setArticles] = useState<DrupalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          \`https://drupalize.me/jsonapi/node/article?page[limit]=\${limit}\`
        );
        
        if (!response.ok) {
          throw new Error(\`Failed to fetch: \${response.status}\`);
        }
        
        const data = await response.json();
        
        const processedArticles = data.data.map((item: any) => ({
          id: item.id,
          title: item.attributes.title,
          body: item.attributes.body?.processed || '',
          created: item.attributes.created
        }));
        
        setArticles(processedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  return { articles, loading, error };
};`
    }
  ];

  const wordpressExamples = [
    {
      title: 'Fetch Posts from WordPress REST API',
      language: 'JavaScript',
      description: 'Basic example of fetching posts using WordPress REST API with embedded media.',
      code: `// Fetch posts with embedded featured media
const fetchWordPressPosts = async (limit = 10) => {
  const response = await fetch(
    \`https://wptavern.com/wp-json/wp/v2/posts?per_page=\${limit}&_embed\`
  );
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const posts = await response.json();
  
  // WordPress REST API returns array directly
  return posts.map(post => ({
    id: post.id,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    categories: post._embedded?.['wp:term']?.[0] || []
  }));
};

// Usage
fetchWordPressPosts(5)
  .then(posts => console.log('Posts:', posts))
  .catch(error => console.error('Error:', error));`
    },
    {
      title: 'WordPress API with Custom Fields',
      language: 'JavaScript',
      description: 'Example showing how to work with Advanced Custom Fields (ACF) in WordPress REST API.',
      code: `// Fetch posts with ACF custom fields
const fetchPostsWithCustomFields = async () => {
  const response = await fetch(
    'https://example.com/wp-json/wp/v2/posts?' +
    'per_page=10&' +
    '_embed&' +
    'acf_format=standard'
  );
  
  const posts = await response.json();
  
  return posts.map(post => ({
    id: post.id,
    title: post.title.rendered,
    content: post.content.rendered,
    date: post.date,
    // ACF fields are available in the 'acf' property
    customFields: {
      eventDate: post.acf?.event_date,
      location: post.acf?.location,
      price: post.acf?.price,
      gallery: post.acf?.gallery || []
    },
    // Or in meta fields depending on setup
    meta: {
      eventDate: post.meta?.event_date,
      location: post.meta?.location
    }
  }));
};

// Fetch specific custom post type (e.g., events)
const fetchEvents = async () => {
  const response = await fetch(
    'https://example.com/wp-json/wp/v2/events?per_page=10&_embed'
  );
  
  return await response.json();
};`
    },
    {
      title: 'React Hook for WordPress Content',
      language: 'TypeScript',
      description: 'Custom React hook for managing WordPress content with loading states and error handling.',
      code: `import { useState, useEffect } from 'react';

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export const useWordPressPosts = (limit: number = 10) => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          \`https://wptavern.com/wp-json/wp/v2/posts?per_page=\${limit}&_embed\`
        );
        
        if (!response.ok) {
          throw new Error(\`Failed to fetch: \${response.status}\`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
};`
    }
  ];

  const comparisonExamples = [
    {
      title: 'API Response Comparison',
      language: 'JSON',
      description: 'Side-by-side comparison of how the same content looks in both APIs.',
      code: `// Drupal JSON API Response Structure
{
  "data": [
    {
      "id": "123",
      "type": "node--article",
      "attributes": {
        "title": "My Article",
        "body": {
          "value": "Raw content...",
          "processed": "<p>Processed HTML...</p>"
        },
        "created": "2024-01-15T10:00:00Z"
      },
      "relationships": {
        "field_tags": {
          "data": [
            { "type": "taxonomy_term--tags", "id": "456" }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "id": "456",
      "type": "taxonomy_term--tags",
      "attributes": {
        "name": "Technology"
      }
    }
  ]
}

// WordPress REST API Response Structure
[
  {
    "id": 123,
    "title": {
      "rendered": "My Article"
    },
    "content": {
      "rendered": "<p>Processed HTML...</p>"
    },
    "date": "2024-01-15T10:00:00",
    "categories": [1, 2],
    "_embedded": {
      "wp:term": [
        [
          {
            "id": 1,
            "name": "Technology"
          }
        ]
      ]
    }
  }
]`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Code Examples</h1>
              <p className="text-white/90 mt-2">
                Interactive code snippets showing how to integrate with both APIs
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Drupal Examples */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Drupal JSON API Examples</h2>
              <p className="text-gray-600">Code snippets for working with Drupal's JSON API</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {drupalExamples.map((example, index) => (
              <CodeExample
                key={index}
                title={example.title}
                language={example.language}
                code={example.code}
                description={example.description}
              />
            ))}
          </div>
        </section>

        {/* WordPress Examples */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">WordPress REST API Examples</h2>
              <p className="text-gray-600">Code snippets for working with WordPress REST API</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {wordpressExamples.map((example, index) => (
              <CodeExample
                key={index}
                title={example.title}
                language={example.language}
                code={example.code}
                description={example.description}
              />
            ))}
          </div>
        </section>

        {/* Comparison Examples */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Code2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">API Comparison</h2>
              <p className="text-gray-600">Direct comparison of response structures</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {comparisonExamples.map((example, index) => (
              <CodeExample
                key={index}
                title={example.title}
                language={example.language}
                code={example.code}
                description={example.description}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};