import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Database, Globe, ExternalLink } from 'lucide-react';
import { useDrupalArticles, useDrupalEvents } from '../hooks/useDrupalContent';
import { useWordPressPosts, useWordPressEvents } from '../hooks/useWordPressContent';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ContentDetailPage: React.FC = () => {
  const { platform, type, id } = useParams<{
    platform: 'drupal' | 'wordpress';
    type: 'article' | 'event';
    id: string;
  }>();

  // Fetch data based on platform and type
  const { articles: drupalArticles, loading: drupalArticlesLoading, error: drupalArticlesError } = useDrupalArticles();
  const { events: drupalEvents, loading: drupalEventsLoading, error: drupalEventsError } = useDrupalEvents();
  const { posts: wordpressPosts, loading: wordpressPostsLoading, error: wordpressPostsError } = useWordPressPosts();
  const { events: wordpressEvents, loading: wordpressEventsLoading, error: wordpressEventsError } = useWordPressEvents();

  if (!platform || !type || !id) {
    return <Navigate to="/" replace />;
  }

  // Determine loading state
  const isLoading = platform === 'drupal' 
    ? (type === 'article' ? drupalArticlesLoading : drupalEventsLoading)
    : (type === 'article' ? wordpressPostsLoading : wordpressEventsLoading);

  // Determine error state
  const error = platform === 'drupal'
    ? (type === 'article' ? drupalArticlesError : drupalEventsError)
    : (type === 'article' ? wordpressPostsError : wordpressEventsError);

  // Find the specific content item
  let content: any = null;
  
  if (!isLoading && !error) {
    if (platform === 'drupal') {
      const items = type === 'article' ? drupalArticles : drupalEvents;
      content = items.find(item => item.id === id);
    } else {
      const items = type === 'article' ? wordpressPosts : wordpressEvents;
      content = items.find(item => item.id.toString() === id);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const platformConfig = {
    drupal: {
      name: 'Drupal JSON API',
      icon: Database,
      color: 'blue',
      bgColor: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    wordpress: {
      name: 'WordPress REST API',
      icon: Globe,
      color: 'green',
      bgColor: 'bg-green-600',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    }
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`${config.bgColor} text-white py-8`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to={`/${platform}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {config.name}
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner className="py-20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`${config.bgColor} text-white py-8`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to={`/${platform}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {config.name}
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`${config.bgColor} text-white py-8`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to={`/${platform}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {config.name}
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message="Content not found" />
        </div>
      </div>
    );
  }

  // Extract content data based on platform
  const title = platform === 'drupal' 
    ? content.attributes.title 
    : content.title.rendered;
  
  const body = platform === 'drupal'
    ? content.attributes.body?.processed || ''
    : content.content.rendered;
    
  const publishDate = platform === 'drupal'
    ? content.attributes.created
    : content.date;

  const eventDate = platform === 'drupal'
    ? content.attributes.field_event_date
    : content.acf?.event_date;

  const location = platform === 'drupal'
    ? content.attributes.field_location
    : content.acf?.location;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${config.bgColor} text-white py-8`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to={`/${platform}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {config.name}
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 ${config.lightBg.replace('bg-', 'bg-').replace('-50', '-500')} rounded-lg`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm text-white/80 uppercase tracking-wide font-medium">
                {type} from {config.name}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Meta Information */}
          <div className={`${config.lightBg} px-6 py-4 border-b`}>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Published: {formatDate(publishDate)}
                </span>
              </div>
              
              {type === 'event' && eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    Event Date: {formatDate(eventDate)}
                  </span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="px-6 py-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>

          {/* API Information */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">API Details</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Platform:</strong> {config.name}</p>
              <p><strong>Content Type:</strong> {type}</p>
              <p><strong>Content ID:</strong> {id}</p>
              <p><strong>Data Structure:</strong> {platform === 'drupal' ? 'JSON API format with attributes/relationships' : 'REST API format with direct properties'}</p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
