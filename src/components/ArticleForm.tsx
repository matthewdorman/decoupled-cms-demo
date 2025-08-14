import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { DrupalArticle } from '../types';

interface ArticleFormProps {
  article?: DrupalArticle;
  onSave: (title: string, body: string) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  loading?: boolean;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onSave,
  onCancel,
  isOpen,
  loading = false
}) => {
  const [title, setTitle] = useState(article?.attributes.title || '');
  const [body, setBody] = useState(article?.attributes.body?.value || '');

  // Update form fields when article prop changes
  React.useEffect(() => {
    if (article) {
      setTitle(article.attributes.title);
      setBody(article.attributes.body?.value || '');
    } else {
      // Clear form for new articles
      setTitle('');
      setBody('');
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    
    try {
      await onSave(title, body);
      if (!article) {
        // Clear form for new articles
        setTitle('');
        setBody('');
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
      
      <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-teal/10 rounded-lg">
                <Edit3 className="w-5 h-5 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">
                {article ? 'Edit Article' : 'Create New Article'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-brand-light-gray rounded"
            >
              <X className="w-5 h-5 text-brand-text-gray" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto">
            <form id="article-form" onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-brand-navy mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  placeholder="Enter article title..."
                  required
                />
              </div>

              {/* Body Field */}
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-brand-navy mb-2">
                  Article Content
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
                  placeholder="Enter article content... (HTML allowed)"
                  required
                />
                <p className="text-xs text-brand-text-gray mt-1">
                  You can use basic HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
              </div>

              {/* API Information */}
              <div className="p-4 bg-brand-teal/5 rounded-lg">
                <h3 className="text-sm font-semibold text-brand-navy mb-2">JSON API Details</h3>
                <div className="text-xs text-brand-text-gray space-y-1">
                  <p><strong>Method:</strong> {article ? 'PATCH' : 'POST'}</p>
                  <p><strong>Endpoint:</strong> /jsonapi/node/article{article ? `/${article.id}` : ''}</p>
                  <p><strong>Content-Type:</strong> application/vnd.api+json</p>
                  <p><strong>Authentication:</strong> CSRF Token required</p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-brand-light-gray">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-brand-text-gray hover:text-brand-navy transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="article-form"
              disabled={loading || !title.trim() || !body.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};