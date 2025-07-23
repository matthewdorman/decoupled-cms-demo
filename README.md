# Decoupled CMS Demo

A React-based demonstration comparing Drupal JSON API and WordPress REST API integration patterns in decoupled (headless) architectures.

## Overview

This project showcases how to build modern frontend applications that consume content from different CMS platforms via their respective APIs. It demonstrates the differences in data structures, API patterns, and integration approaches between Drupal's JSON API and WordPress REST API.

## Features

- **Dual CMS Integration**: Side-by-side comparison of Drupal and WordPress APIs
- **Modern React Architecture**: Built with TypeScript, React Router, and Tailwind CSS
- **Content Management**: Articles and events from both platforms
- **Responsive Design**: Mobile-first design with beautiful UI components
- **Individual Content Pages**: Detailed views for each piece of content
- **Error Handling**: Graceful fallbacks and loading states
- **Type Safety**: Full TypeScript integration with proper API types

## API Endpoints

### Drupal JSON API

The Drupal integration uses the JSON API specification, which provides a standardized format for API responses.

#### Base URL
```
https://www.drupal.org/api-d7
```

#### Endpoints Used

| Endpoint | Method | Description | Response Format |
|----------|--------|-------------|-----------------|
| `/node.json?type=page&limit={limit}` | GET | Fetch articles/pages | JSON API format with `data` array |

**Example Response Structure:**
```json
{
  "list": [
    {
      "nid": "123",
      "title": "Article Title",
      "body": "Article content...",
      "created": "2024-01-15T10:00:00Z",
      "changed": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Transformed to JSON API Format:**
```json
{
  "id": "123",
  "type": "node--article",
  "attributes": {
    "title": "Article Title",
    "body": {
      "value": "Article content...",
      "format": "basic_html",
      "processed": "<p>Article content...</p>"
    },
    "created": "2024-01-15T10:00:00Z",
    "changed": "2024-01-15T10:00:00Z"
  }
}
```

#### Mock Data Endpoints

Since we're using Drupal.org's API as an example, the following content types use mock data:

- **Articles**: Demonstrates JSON API format with attributes and relationships
- **Events**: Shows event-specific fields like `field_event_date` and `field_location`

### WordPress REST API

The WordPress integration uses the standard REST API that comes built-in with WordPress.

#### Base URL
```
https://wptavern.com/wp-json/wp/v2
```

#### Endpoints Used

| Endpoint | Method | Description | Response Format |
|----------|--------|-------------|-----------------|
| `/posts?per_page={limit}&_embed` | GET | Fetch blog posts with embedded media | Array of post objects |

**Example Response Structure:**
```json
[
  {
    "id": 123,
    "title": {
      "rendered": "Post Title"
    },
    "content": {
      "rendered": "<p>Post content...</p>"
    },
    "excerpt": {
      "rendered": "<p>Post excerpt...</p>"
    },
    "date": "2024-01-16T11:00:00",
    "modified": "2024-01-16T11:00:00",
    "featured_media": 456,
    "categories": [1, 2],
    "tags": [3, 4],
    "_embedded": {
      "wp:featuredmedia": [
        {
          "source_url": "https://example.com/image.jpg",
          "alt_text": "Image description"
        }
      ]
    }
  }
]
```

#### Mock Data Endpoints

The following content types use mock data for demonstration:

- **Posts**: Shows WordPress REST API format with rendered HTML content
- **Events**: Demonstrates custom fields using ACF (Advanced Custom Fields) format

## API Integration Patterns

### Drupal JSON API Characteristics

1. **Standardized Format**: Follows JSON API specification (jsonapi.org)
2. **Consistent Structure**: All responses use `data`, `attributes`, and `relationships`
3. **Type Information**: Each resource includes explicit type information
4. **Relationship Handling**: Built-in support for including related resources
5. **Sparse Fieldsets**: Ability to request specific fields only

### WordPress REST API Characteristics

1. **RESTful Design**: Traditional REST endpoints with HTTP verbs
2. **Flexible Structure**: Direct property access on response objects
3. **Embedded Resources**: Use `_embed` parameter to include related data
4. **Custom Fields**: Support for custom fields via plugins like ACF
5. **Extensible**: Easy to add custom endpoints and modify responses

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContentCard.tsx     # Card component for articles/events
│   ├── DrupalSection.tsx   # Drupal content display
│   ├── ErrorMessage.tsx    # Error handling component
│   ├── Header.tsx          # Page header (deprecated)
│   ├── LoadingSpinner.tsx  # Loading state component
│   ├── Navigation.tsx      # Main navigation menu
│   └── WordPressSection.tsx # WordPress content display
├── hooks/               # Custom React hooks
│   ├── useDrupalContent.ts    # Drupal API integration
│   └── useWordPressContent.ts # WordPress API integration
├── pages/               # Route components
│   ├── ContentDetailPage.tsx  # Individual content pages
│   ├── DrupalPage.tsx        # Drupal platform page
│   ├── HomePage.tsx          # Landing page
│   └── WordPressPage.tsx     # WordPress platform page
├── services/            # API service layers
│   ├── drupalApi.ts        # Drupal API client
│   └── wordpressApi.ts     # WordPress API client
├── types/               # TypeScript type definitions
│   └── index.ts            # API response types
├── App.tsx              # Main application component
├── index.css            # Global styles (Tailwind)
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint with TypeScript rules

## API Error Handling

Both API integrations include comprehensive error handling:

1. **Network Errors**: Graceful fallback to mock data
2. **Loading States**: Spinner components during data fetching
3. **Error Messages**: User-friendly error display
4. **Retry Logic**: Automatic fallback to demonstration data

## Mock Data

When live APIs are unavailable, the application falls back to realistic mock data that demonstrates:

- **Content Structure**: How each platform organizes content
- **Field Types**: Different field types and their formats
- **Relationships**: How related content is handled
- **Metadata**: Publishing dates, categories, and custom fields

## Deployment

This project can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use the build output
- **AWS S3**: Upload static files

Build the project first:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Resources

- [Drupal JSON API Documentation](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JSON API Specification](https://jsonapi.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)