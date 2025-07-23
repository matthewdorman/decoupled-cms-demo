import React from 'react';
import { Database } from 'lucide-react';
import { useDrupalArticles, useDrupalEvents } from '../hooks/useDrupalContent';
import { ContentCard } from './ContentCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const DrupalSection: React.FC = () => {
  const { articles, loading: articlesLoading, error: articlesError } = useDrupalArticles(3);
  const { events, loading: eventsLoading, error: eventsError } = useDrupalEvents(2);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drupal JSON API</h2>
          <p className="text-gray-600">Content fetched via Drupal's JSON API specification</p>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Articles</h3>
        {articlesLoading ? (
          <LoadingSpinner className="py-8" />
        ) : articlesError ? (
          <ErrorMessage message={articlesError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                id={article.id}
                title={article.attributes.title}
                content={article.attributes.body?.processed || ''}
                date={article.attributes.created}
                type="article"
                platform="drupal"
              />
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Events</h3>
        {eventsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : eventsError ? (
          <ErrorMessage message={eventsError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <ContentCard
                key={event.id}
                id={event.id}
                title={event.attributes.title}
                content={event.attributes.body?.processed || ''}
                date={event.attributes.created}
                type="event"
                platform="drupal"
                eventDate={event.attributes.field_event_date}
                location={event.attributes.field_location}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};