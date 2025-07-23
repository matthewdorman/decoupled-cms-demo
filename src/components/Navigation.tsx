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
      ? `${baseClass} bg-blue-100 text-blue-700 font-medium`
      : `${baseClass} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Decoupled CMS Demo
              </h1>
              <p className="text-sm text-gray-600">
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