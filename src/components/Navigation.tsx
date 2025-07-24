import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Database, Globe, Home, FileCode } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200";
    return isActive(path) 
      ? `${baseClass} bg-brand-teal/10 text-brand-navy font-medium`
      : `${baseClass} text-brand-text-gray hover:bg-brand-light-gray hover:text-brand-navy`;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-red to-brand-teal rounded-xl">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-red">
                Decoupled CMS Demo
              </h1>
              <p className="text-sm text-brand-text-gray">
                Drupal JSON API vs WordPress REST API
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/" className={linkClass('/')}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/drupal" className={linkClass('/drupal')}>
              <Database className="w-4 h-4" />
              <span>Drupal</span>
            </Link>
            <Link to="/wordpress" className={linkClass('/wordpress')}>
              <Globe className="w-4 h-4" />
              <span>WordPress</span>
            </Link>
            <Link to="/code-examples" className={linkClass('/code-examples')}>
              <FileCode className="w-4 h-4" />
              <span>Code Examples</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};