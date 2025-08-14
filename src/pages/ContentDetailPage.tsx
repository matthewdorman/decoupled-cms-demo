import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Database, Globe, Edit3, Save, X } from 'lucide-react';
import { useDrupalArticle, useDrupalEvent } from '../hooks/useDrupalContent';
import { useWordPressPost, useWordPressEvent } from '../hooks/useWordPressContent';
import { drupalApi } from '../services/drupalApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ContentDetailPage: React.FC = () => {
  const { platform, type, id } = useParams<{
    platform: 'drupal' | 'wordpress';
    type: 'article' | 'event';
    id: string;
  }>();

  // Always call all hooks to avoid conditional hook calls
  const { article: drupalArticle, loading: drupalArticleLoading, error: drupalArticleError, refetch: refetchDrupalArticle } = useDrupalArticle(
    platform === 'drupal' && type === 'article' && id ? id : ''
  );
  const { event: drupalEvent, loading: drupalEventLoading, error: drupalEventError } = useDrupalEvent(
    platform === 'drupal' && type === 'event' && id ? id : ''
  );
  const { post: wordpressPost, loading: wordpressPostLoading, error: wordpressPostError } = useWordPressPost(
    platform === 'wordpress' && type === 'article' && id ? parseInt(id) : 0
  );
  const { event: wordpressEvent, loading: wordpressEventLoading, error: wordpressEventError } = useWordPressEvent(
    platform === 'wordpress' && type === 'event' && id ? parseInt(id) : 0
  );

  // All state hooks - always called
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState('');
  const [editBody, setEditBody] = React.useState('');
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Always call useEffect hooks in the same order
  // Check authentication status
  React.useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(drupalApi.isAuthenticated());
    };
    
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Initialize edit form when content loads
  React.useEffect(() => {
    if (platform === 'drupal' && type === 'article' && drupalArticle) {
      setEditTitle(drupalArticle.attributes.title);
      setEditBody(drupalArticle.attributes.body?.value || '');
    }
  }, [platform, type, drupalArticle]);

  if (!platform || !type || !id) {
    return <Navigate to="/" replace />;
  }

  // Determine loading state
  const isLoading = platform === 'drupal' 
    ? (type === 'article' ? drupalArticleLoading : drupalEventLoading)
    : (type === 'article' ? wordpressPostLoading : wordpressEventLoading);

  // Determine error state
  const error = platform === 'drupal'
    ? (type === 'article' ? drupalArticleError : drupalEventError)
    : (type === 'article' ? wordpressPostError : wordpressEventError);

  // Find the specific content item
  let content: any = null;
  
  if (!isLoading && !error) {
    if (platform === 'drupal') {
      content = type === 'article' ? drupalArticle : drupalEvent;
    } else {
      content = type === 'article' ? wordpressPost : wordpressEvent;
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

  const platformConfig = {
    drupal: {
      name: 'Drupal JSON API',
      icon: Database,
      color: 'teal',
      bgColor: 'bg-brand-navy',
      lightBg: 'bg-brand-teal/5',
      textColor: 'text-brand-teal'
    },
    wordpress: {
      name: 'WordPress REST API',
      icon: Globe,
      color: 'teal',
      bgColor: 'bg-brand-navy',
      lightBg: 'bg-brand-teal/5',
      textColor: 'text-brand-teal'
    }
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  const handleStartEdit = () => {
    if (content && platform === 'drupal') {
      setEditTitle(content.attributes.title);
      setEditBody(content.attributes.body?.value || '');
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (content && platform === 'drupal') {
      setEditTitle(content.attributes.title);
      setEditBody(content.attributes.body?.value || '');
    }
  };

  const handleSaveEdit = async () => {
    if (!content || platform !== 'drupal' || !editTitle.trim() || !editBody.trim()) {
      return;
    }

    setSaveLoading(true);
    try {
      await drupalApi.updateArticle(content.id, editTitle, editBody);
      setIsEditing(false);
      refetchDrupalArticle();
    } catch (error) {
      console.error('Error updating article:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to update article: ${errorMessage}`);
    } finally {
      setSaveLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light-gray">
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
      <div className="min-h-screen bg-brand-light-gray">
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
      <div className="min-h-screen bg-brand-light-gray">
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
    <div className="min-h-screen bg-brand-light-gray">
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
            <div className="p-2 bg-brand-teal rounded-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm text-white/80 uppercase tracking-wide font-medium">
                {type} from {config.name}
              </span>
            </div>
          </div>
          
          {/* Inline Edit Form or Title */}
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-3xl md:text-4xl font-bold bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                placeholder="Article title..."
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={saveLoading || !editTitle.trim() || !editBody.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {title}
              </h1>
              
              {/* Edit Button for Drupal Articles */}
              {platform === 'drupal' && type === 'article' && isAuthenticated && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Article
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Meta Information */}
          <div className={`${config.lightBg} px-6 py-4 border-b`}>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-text-gray" />
                <span className="text-brand-red">
                  Published: {formatDate(publishDate)}
                </span>
              </div>
              
              {type === 'event' && eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-text-gray" />
                  <span className="text-brand-red">
                    Event Date: {formatDate(eventDate)}
                  </span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-text-gray" />
                  <span className="text-brand-red">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="px-6 py-8">
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2">
                  Article Content
                </label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={15}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
                  placeholder="Enter article content... (HTML allowed)"
                />
                <p className="text-xs text-brand-text-gray mt-2">
                  You can use basic HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            )}
          </div>

          {/* API Information */}
          <div className="px-6 py-4 bg-brand-light-gray border-t">
            <h3 className="text-sm font-semibold text-brand-red mb-2">API Details</h3>
            <div className="text-xs text-brand-text-gray space-y-1">
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