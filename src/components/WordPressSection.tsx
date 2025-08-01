import React from 'react';
import { Globe } from 'lucide-react';
import { useWordPressPosts, useWordPressEvents } from '../hooks/useWordPressContent';
import { ContentCard } from './ContentCard';
import { ECommerceSection } from './ECommerceSection';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const WordPressSection: React.FC = () => {
  const { posts, loading: postsLoading, error: postsError } = useWordPressPosts(3);
  const { events, loading: eventsLoading, error: eventsError } = useWordPressEvents(2);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-teal/10 rounded-lg">
          <Globe className="w-6 h-6 text-brand-teal" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-red">WordPress REST API</h2>
          <p className="text-brand-text-gray">Content fetched via WordPress REST API endpoints</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-red mb-4">Posts</h3>
        {postsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : postsError ? (
          <ErrorMessage message={postsError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ContentCard
                key={post.id}
                id={post.id.toString()}
                title={post.title.rendered}
                content={post.content.rendered}
                date={post.date}
                type="article"
                platform="wordpress"
              />
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div>
        <h3 className="text-lg font-semibold text-brand-red mb-4">Events</h3>
        {eventsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : eventsError ? (
          <ErrorMessage message={eventsError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <ContentCard
                key={event.id}
                id={event.id.toString()}
                title={event.title.rendered}
                content={event.content.rendered}
                date={event.date}
                type="event"
                platform="wordpress"
                eventDate={event.acf?.event_date}
                location={event.acf?.location}
              />
            ))}
          </div>
        )}
      </div>

      {/* E-commerce Section */}
      <ECommerceSection />
    </section>
  );
};