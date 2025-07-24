import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface ContentCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'article' | 'event';
  platform: 'drupal' | 'wordpress';
  location?: string;
  eventDate?: string;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  content,
  date,
  type,
  platform,
  location,
  eventDate,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <Link 
      to={`/${platform}/${type}/${id}`}
      className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-brand-navy line-clamp-2">
          {title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          type === 'article' 
            ? 'bg-brand-teal/10 text-brand-navy' 
            : 'bg-brand-teal/20 text-brand-navy'
        }`}>
          {type}
        </span>
      </div>
      
      <p className="text-brand-text-gray text-sm mb-4 line-clamp-3">
        {stripHtml(content)}
      </p>
      
      <div className="flex flex-col gap-2 text-xs text-brand-text-gray/70">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Published: {formatDate(date)}</span>
        </div>
        
        {type === 'event' && eventDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Event: {formatDate(eventDate)}</span>
          </div>
        )}
        
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-brand-text-gray/50 flex items-center gap-1">
          View details
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
};