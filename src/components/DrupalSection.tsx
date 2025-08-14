import React from 'react';
import { Database, Plus, LogIn, LogOut, Edit3 } from 'lucide-react';
import { useDrupalArticles } from '../hooks/useDrupalContent';
import { drupalApi } from '../services/drupalApi';
import { ContentCard } from './ContentCard';
import { ArticleForm } from './ArticleForm';
import { LoginForm } from './LoginForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { DrupalArticle } from '../types';

export const DrupalSection: React.FC = () => {
  const { articles, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useDrupalArticles(3);
  
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [showArticleForm, setShowArticleForm] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<DrupalArticle | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  // Check authentication status on component mount and periodically
  React.useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(drupalApi.isAuthenticated());
    };
    
    // Check immediately
    checkAuthStatus();
    
    // Check every 10 seconds to catch session expiration
    const interval = setInterval(checkAuthStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    setFormLoading(true);
    try {
      const success = await drupalApi.authenticate(username, password);
      if (success) {
        setIsAuthenticated(true);
        setShowLoginForm(false);
      }
      return success;
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    drupalApi.logout();
    setIsAuthenticated(false);
  };

  const handleCreateArticle = async (title: string, body: string) => {
    setFormLoading(true);
    try {
      if (!drupalApi.isAuthenticated()) {
        throw new Error('You must be logged in to create articles');
      }
      await drupalApi.createArticle(title, body);
      setShowArticleForm(false);
      refetchArticles();
    } catch (error) {
      console.error('Error creating article:', error);
      // Don't automatically close the form on error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('permission')) {
        alert(`Permission Error: ${errorMessage}\n\nTo fix this, go to your Drupal admin:\nAdmin → People → Permissions\nAnd grant your user role the "Article: Create new content" and "Article: Edit any content" permissions.`);
      } else {
        alert(`Failed to create article: ${errorMessage}`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateArticle = async (title: string, body: string) => {
    if (!editingArticle) return;
    
    setFormLoading(true);
    try {
      if (!drupalApi.isAuthenticated()) {
        throw new Error('You must be logged in to edit articles');
      }
      await drupalApi.updateArticle(editingArticle.id, title, body);
      setEditingArticle(null);
      refetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      // Don't automatically close the form on error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('permission')) {
        alert(`Permission Error: ${errorMessage}\n\nTo fix this, go to your Drupal admin:\nAdmin → People → Permissions\nAnd grant your user role the "Article: Edit any content" permissions.`);
      } else {
        alert(`Failed to update article: ${errorMessage}`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditArticle = (article: DrupalArticle) => {
    setEditingArticle(article);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-teal/10 rounded-lg">
            <Database className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-red">Drupal JSON API</h2>
            <p className="text-brand-text-gray">Content fetched via Drupal's JSON API specification</p>
          </div>
        </div>
        
        {/* Auth & Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowArticleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Article
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-brand-text-gray text-brand-text-gray rounded-lg hover:bg-brand-light-gray transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login to Create
            </button>
          )}
        </div>
      </div>

      {/* Articles Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-red">Articles</h3>
          {isAuthenticated && (
            <span className="text-xs text-brand-text-gray bg-green-100 px-2 py-1 rounded">
              ✓ Authenticated - Check permissions if create/edit fails
            </span>
          )}
        </div>
        {articlesLoading ? (
          <LoadingSpinner className="py-8" />
        ) : articlesError ? (
          <ErrorMessage message={articlesError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="relative">
                <ContentCard
                  id={article.id}
                  title={article.attributes.title}
                  content={article.attributes.body?.processed || ''}
                  date={article.attributes.created}
                  type="article"
                  platform="drupal"
                />
                {isAuthenticated && (
                  <button
                    onClick={() => handleEditArticle(article)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                    title="Edit Article"
                  >
                    <Edit3 className="w-4 h-4 text-brand-teal" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login Form */}
      <LoginForm
        onLogin={handleLogin}
        onCancel={() => setShowLoginForm(false)}
        isOpen={showLoginForm}
        loading={formLoading}
      />

      {/* Article Form - Create */}
      <ArticleForm
        onSave={handleCreateArticle}
        onCancel={() => setShowArticleForm(false)}
        isOpen={showArticleForm}
        loading={formLoading}
      />

      {/* Article Form - Edit */}
      <ArticleForm
        article={editingArticle || undefined}
        onSave={handleUpdateArticle}
        onCancel={() => setEditingArticle(null)}
        isOpen={!!editingArticle}
        loading={formLoading}
      />
    </section>
  );
};