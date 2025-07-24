import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Database, Globe, Zap, Server } from 'lucide-react';
import { CodeExample } from '../components/CodeExample';

type ExampleCategory = 'drupal-api' | 'wordpress-api' | 'graphql' | 'php-extensions' | 'comparison';

export const CodeExamplesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ExampleCategory>('drupal-api');

  const categories = [
    { id: 'drupal-api' as ExampleCategory, name: 'Drupal JSON API', icon: Database, color: 'teal' },
    { id: 'wordpress-api' as ExampleCategory, name: 'WordPress REST API', icon: Globe, color: 'teal' },
    { id: 'graphql' as ExampleCategory, name: 'GraphQL', icon: Zap, color: 'teal' },
    { id: 'php-extensions' as ExampleCategory, name: 'PHP Extensions', icon: Server, color: 'teal' },
    { id: 'comparison' as ExampleCategory, name: 'API Comparison', icon: Code2, color: 'navy' }
  ];

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
      title: 'WooCommerce Products API',
      language: 'JavaScript',
      description: 'Fetch products from WooCommerce REST API with full product details.',
      code: `// Fetch products from WooCommerce API
const fetchWooCommerceProducts = async (limit = 10) => {
  const response = await fetch(
    \`https://example.com/wp-json/wc/v3/products?per_page=\${limit}&status=publish\`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa('consumer_key:consumer_secret')
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const products = await response.json();
  
  return products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    on_sale: product.on_sale,
    description: product.description,
    short_description: product.short_description,
    images: product.images,
    categories: product.categories,
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity
  }));
};

// Create an order
const createWooCommerceOrder = async (orderData) => {
  const response = await fetch(
    'https://example.com/wp-json/wc/v3/orders',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('consumer_key:consumer_secret')
      },
      body: JSON.stringify({
        payment_method: 'bacs',
        payment_method_title: 'Direct Bank Transfer',
        set_paid: false,
        billing: orderData.billing,
        shipping: orderData.shipping,
        line_items: orderData.line_items,
        shipping_lines: [
          {
            method_id: 'flat_rate',
            method_title: 'Flat Rate',
            total: '10.00'
          }
        ]
      })
    }
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

  const graphqlExamples = [
    {
      title: 'Drupal GraphQL Query',
      language: 'GraphQL',
      description: 'GraphQL query for fetching articles from Drupal with the GraphQL module.',
      code: `# GraphQL query for Drupal articles
query GetArticles($limit: Int = 10) {
  nodeQuery(
    filter: {
      conditions: [
        { field: "type", value: "article" }
        { field: "status", value: "1" }
      ]
    }
    limit: $limit
    sort: [{ field: "created", direction: DESC }]
  ) {
    entities {
      ... on NodeArticle {
        nid
        title
        body {
          processed
        }
        created
        fieldImage {
          alt
          url
        }
        fieldTags {
          entity {
            ... on TaxonomyTermTags {
              name
            }
          }
        }
        author {
          displayName
        }
      }
    }
  }
}`
    },
    {
      title: 'WordPress GraphQL with WPGraphQL',
      language: 'GraphQL',
      description: 'GraphQL query for WordPress using the WPGraphQL plugin.',
      code: `# GraphQL query for WordPress posts
query GetPosts($first: Int = 10) {
  posts(first: $first, where: { status: PUBLISH }) {
    nodes {
      id
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
}`
    },
    {
      title: 'GraphQL Client Implementation',
      language: 'JavaScript',
      description: 'JavaScript client for making GraphQL requests to both Drupal and WordPress.',
      code: `// GraphQL client for both Drupal and WordPress
class GraphQLClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async query(query, variables = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(\`GraphQL request failed: \${response.status}\`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(\`GraphQL errors: \${result.errors.map(e => e.message).join(', ')}\`);
    }

    return result.data;
  }
}

// Usage examples
const drupalClient = new GraphQLClient('https://example.com/graphql');
const wordpressClient = new GraphQLClient('https://example.com/graphql');

// Fetch Drupal articles
const drupalQuery = \`
  query GetArticles($limit: Int!) {
    nodeQuery(filter: {conditions: [{field: "type", value: "article"}]}, limit: $limit) {
      entities {
        ... on NodeArticle {
          nid
          title
          body { processed }
          created
        }
      }
    }
  }
\`;

const drupalArticles = await drupalClient.query(drupalQuery, { limit: 5 });

// Fetch WordPress posts
const wordpressQuery = \`
  query GetPosts($first: Int!) {
    posts(first: $first) {
      nodes {
        id
        title
        content
        date
      }
    }
  }
\`;

const wordpressPosts = await wordpressClient.query(wordpressQuery, { first: 5 });`
    }
  ];

  const phpExamples = [
    {
      title: 'Drupal Custom Module - API Extension',
      language: 'PHP',
      description: 'Custom Drupal module that extends the JSON API with additional endpoints.',
      code: `<?php
// custom_api.module

use Drupal\\Core\\Routing\\RouteMatchInterface;

/**
 * Implements hook_help().
 */
function custom_api_help($route_name, RouteMatchInterface $route_match) {
  switch ($route_name) {
    case 'help.page.custom_api':
      return '<p>' . t('Custom API extensions for JSON API.') . '</p>';
  }
}

// custom_api.routing.yml
custom_api.articles_enhanced:
  path: '/api/articles/enhanced'
  defaults:
    _controller: '\\Drupal\\custom_api\\Controller\\ArticleController::getEnhancedArticles'
  requirements:
    _permission: 'access content'
  methods: [GET]

// src/Controller/ArticleController.php
<?php

namespace Drupal\\custom_api\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Drupal\\node\\Entity\\Node;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

class ArticleController extends ControllerBase {

  /**
   * Returns enhanced article data with computed fields.
   */
  public function getEnhancedArticles() {
    $query = \\Drupal::entityQuery('node')
      ->condition('type', 'article')
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->range(0, 10);
    
    $nids = $query->execute();
    $nodes = Node::loadMultiple($nids);
    
    $articles = [];
    foreach ($nodes as $node) {
      $articles[] = [
        'id' => $node->id(),
        'title' => $node->getTitle(),
        'body' => $node->get('body')->processed,
        'created' => $node->getCreatedTime(),
        'author' => $node->getOwner()->getDisplayName(),
        'read_time' => $this->calculateReadTime($node->get('body')->value),
        'word_count' => str_word_count(strip_tags($node->get('body')->value)),
        'tags' => $this->getTags($node),
      ];
    }
    
    return new JsonResponse([
      'data' => $articles,
      'meta' => [
        'count' => count($articles),
        'generated' => date('c'),
      ]
    ]);
  }
  
  private function calculateReadTime($text) {
    $word_count = str_word_count(strip_tags($text));
    return ceil($word_count / 200); // Assuming 200 words per minute
  }
  
  private function getTags($node) {
    $tags = [];
    if ($node->hasField('field_tags') && !$node->get('field_tags')->isEmpty()) {
      foreach ($node->get('field_tags')->referencedEntities() as $tag) {
        $tags[] = $tag->getName();
      }
    }
    return $tags;
  }
}`
    },
    {
      title: 'WordPress Plugin - REST API Extension',
      language: 'PHP',
      description: 'WordPress plugin that extends the REST API with custom endpoints and fields.',
      code: `<?php
/**
 * Plugin Name: Custom API Extensions
 * Description: Extends WordPress REST API with custom endpoints
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class CustomAPIExtensions {
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_custom_endpoints']);
        add_action('rest_api_init', [$this, 'add_custom_fields']);
    }
    
    /**
     * Register custom REST API endpoints
     */
    public function register_custom_endpoints() {
        // Enhanced posts endpoint
        register_rest_route('custom/v1', '/posts/enhanced', [
            'methods' => 'GET',
            'callback' => [$this, 'get_enhanced_posts'],
            'permission_callback' => '__return_true',
            'args' => [
                'per_page' => [
                    'default' => 10,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
        
        // Analytics endpoint
        register_rest_route('custom/v1', '/analytics', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_analytics'],
            'permission_callback' => 'current_user_can',
            'permission_callback_args' => ['manage_options'],
        ]);
    }
    
    /**
     * Add custom fields to existing endpoints
     */
    public function add_custom_fields() {
        // Add read time to posts
        register_rest_field('post', 'read_time', [
            'get_callback' => [$this, 'get_read_time'],
            'schema' => [
                'description' => 'Estimated reading time in minutes',
                'type' => 'integer',
            ],
        ]);
        
        // Add word count to posts
        register_rest_field('post', 'word_count', [
            'get_callback' => [$this, 'get_word_count'],
            'schema' => [
                'description' => 'Total word count',
                'type' => 'integer',
            ],
        ]);
    }
    
    /**
     * Enhanced posts endpoint callback
     */
    public function get_enhanced_posts($request) {
        $per_page = $request->get_param('per_page');
        
        $posts = get_posts([
            'numberposts' => $per_page,
            'post_status' => 'publish',
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => 'featured',
                    'value' => '1',
                    'compare' => '='
                ],
                [
                    'key' => 'featured',
                    'compare' => 'NOT EXISTS'
                ]
            ]
        ]);
        
        $enhanced_posts = [];
        foreach ($posts as $post) {
            $enhanced_posts[] = [
                'id' => $post->ID,
                'title' => get_the_title($post->ID),
                'content' => apply_filters('the_content', $post->post_content),
                'excerpt' => get_the_excerpt($post->ID),
                'date' => $post->post_date,
                'author' => get_the_author_meta('display_name', $post->post_author),
                'featured_image' => get_the_post_thumbnail_url($post->ID, 'large'),
                'categories' => wp_get_post_categories($post->ID, ['fields' => 'names']),
                'tags' => wp_get_post_tags($post->ID, ['fields' => 'names']),
                'read_time' => $this->calculate_read_time($post->post_content),
                'word_count' => str_word_count(strip_tags($post->post_content)),
                'is_featured' => get_post_meta($post->ID, 'featured', true) === '1',
                'view_count' => (int) get_post_meta($post->ID, 'view_count', true),
            ];
        }
        
        return rest_ensure_response([
            'posts' => $enhanced_posts,
            'meta' => [
                'total' => count($enhanced_posts),
                'generated' => current_time('c'),
            ]
        ]);
    }
    
    /**
     * Calculate reading time
     */
    private function calculate_read_time($content) {
        $word_count = str_word_count(strip_tags($content));
        return ceil($word_count / 200); // 200 words per minute
    }
    
    /**
     * Get read time for REST field
     */
    public function get_read_time($post) {
        return $this->calculate_read_time($post['content']['rendered']);
    }
    
    /**
     * Get word count for REST field
     */
    public function get_word_count($post) {
        return str_word_count(strip_tags($post['content']['rendered']));
    }
    
    /**
     * Site analytics endpoint
     */
    public function get_site_analytics($request) {
        return rest_ensure_response([
            'total_posts' => wp_count_posts()->publish,
            'total_pages' => wp_count_posts('page')->publish,
            'total_comments' => wp_count_comments()->approved,
            'total_users' => count_users()['total_users'],
            'recent_activity' => $this->get_recent_activity(),
        ]);
    }
    
    private function get_recent_activity() {
        return [
            'recent_posts' => get_posts(['numberposts' => 5, 'fields' => 'ids']),
            'recent_comments' => get_comments(['number' => 5, 'fields' => 'ids']),
        ];
    }
}

// Initialize the plugin
new CustomAPIExtensions();

// Add custom post meta for view tracking
add_action('wp_head', function() {
    if (is_single()) {
        $post_id = get_the_ID();
        $current_views = (int) get_post_meta($post_id, 'view_count', true);
        update_post_meta($post_id, 'view_count', $current_views + 1);
    }
});`
    },
    {
      title: 'Drupal Event Subscriber for API Modifications',
      language: 'PHP',
      description: 'Drupal event subscriber that modifies JSON API responses dynamically.',
      code: `<?php
// src/EventSubscriber/JsonApiSubscriber.php

namespace Drupal\\custom_api\\EventSubscriber;

use Drupal\\jsonapi\\Events\\Events;
use Drupal\\jsonapi\\Events\\EntityLoadedEvent;
use Symfony\\Component\\EventDispatcher\\EventSubscriberInterface;

/**
 * Event subscriber for JSON API modifications.
 */
class JsonApiSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      Events::ENTITY_LOADED => 'onEntityLoaded',
    ];
  }

  /**
   * Modifies entities when loaded via JSON API.
   */
  public function onEntityLoaded(EntityLoadedEvent $event) {
    $entity = $event->getEntity();
    
    // Only modify article nodes
    if ($entity->getEntityTypeId() === 'node' && $entity->bundle() === 'article') {
      // Add computed fields
      $this->addComputedFields($entity);
    }
  }

  /**
   * Adds computed fields to the entity.
   */
  private function addComputedFields($entity) {
    // Add read time calculation
    if ($entity->hasField('body') && !$entity->get('body')->isEmpty()) {
      $body_text = $entity->get('body')->value;
      $word_count = str_word_count(strip_tags($body_text));
      $read_time = ceil($word_count / 200);
      
      // Store as temporary data (not saved to database)
      $entity->computed_read_time = $read_time;
      $entity->computed_word_count = $word_count;
    }
    
    // Add view count from custom table
    $view_count = \\Drupal::database()
      ->select('node_view_count', 'nvc')
      ->fields('nvc', ['count'])
      ->condition('nid', $entity->id())
      ->execute()
      ->fetchField();
    
    $entity->computed_view_count = $view_count ?: 0;
  }
}

// services.yml
services:
  custom_api.jsonapi_subscriber:
    class: Drupal\\custom_api\\EventSubscriber\\JsonApiSubscriber
    tags:
      - { name: event_subscriber }`
    }
  ];

  const comparisonExamples = [
    {
      title: 'API Response Structure Comparison',
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
    },
    {
      title: 'GraphQL vs REST Comparison',
      language: 'JavaScript',
      description: 'Comparing GraphQL and REST API approaches for the same data.',
      code: `// REST API - Multiple requests needed
const fetchArticleWithAuthorAndTags = async (articleId) => {
  // 1. Fetch article
  const articleResponse = await fetch(\`/api/articles/\${articleId}\`);
  const article = await articleResponse.json();
  
  // 2. Fetch author
  const authorResponse = await fetch(\`/api/users/\${article.author_id}\`);
  const author = await authorResponse.json();
  
  // 3. Fetch tags
  const tagsResponse = await fetch(\`/api/articles/\${articleId}/tags\`);
  const tags = await tagsResponse.json();
  
  return { ...article, author, tags };
};

// GraphQL - Single request
const fetchArticleWithAuthorAndTags = async (articleId) => {
  const query = \`
    query GetArticle($id: ID!) {
      article(id: $id) {
        id
        title
        content
        author {
          name
          email
        }
        tags {
          name
          slug
        }
      }
    }
  \`;
  
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id: articleId } })
  });
  
  const { data } = await response.json();
  return data.article;
};`
    }
  ];

  const getExamplesForCategory = (category: ExampleCategory) => {
    switch (category) {
      case 'drupal-api':
        return drupalExamples;
      case 'wordpress-api':
        return wordpressExamples;
      case 'graphql':
        return graphqlExamples;
      case 'php-extensions':
        return phpExamples;
      case 'comparison':
        return comparisonExamples;
      default:
        return [];
    }
  };

  const activeExamples = getExamplesForCategory(activeCategory);
  const activeConfig = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-brand-light-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-red to-brand-teal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Code Examples</h1>
              <p className="text-white/80 mt-2">
                Interactive code snippets for API integration and platform extensions
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? category.color === 'red' 
                        ? 'bg-brand-red text-white shadow-md'
                        : 'bg-brand-teal/10 text-brand-red shadow-md'
                      : 'bg-white text-brand-text-gray hover:bg-brand-light-gray hover:text-brand-navy shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Content */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {activeConfig && (
              <>
                <div className="p-2 bg-brand-teal/10 rounded-lg">
                  <activeConfig.icon className="w-6 h-6 text-brand-teal" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-red">{activeConfig.name}</h2>
                  <p className="text-brand-text-gray">
                    {activeCategory === 'drupal-api' && 'Code snippets for working with Drupal\'s JSON API'}
                    {activeCategory === 'wordpress-api' && 'Code snippets for working with WordPress REST API'}
                    {activeCategory === 'graphql' && 'GraphQL queries and implementations for both platforms'}
                    {activeCategory === 'php-extensions' && 'PHP code for extending Drupal and WordPress APIs'}
                    {activeCategory === 'comparison' && 'Direct comparison of API patterns and structures'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-6">
          {activeExamples.map((example, index) => (
            <CodeExample
              key={`${activeCategory}-${index}`}
              title={example.title}
              language={example.language}
              code={example.code}
              description={example.description}
            />
          ))}
        </div>

        {/* Presentation Tips */}
        <div className="mt-12 bg-brand-teal/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-red mb-3">💡 Presentation Tips</h3>
          <div className="text-sm text-brand-text-gray space-y-2">
            <p>• Use the category tabs to focus on specific topics during your presentation</p>
            <p>• Click the copy button to quickly grab code snippets for live demos</p>
            <p>• The examples progress from basic to advanced within each category</p>
            <p>• GraphQL examples show modern alternatives to traditional REST APIs</p>
            <p>• PHP extensions demonstrate how to customize each platform's API behavior</p>
          </div>
        </div>
      </main>
    </div>
  );
};