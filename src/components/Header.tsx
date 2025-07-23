import React from 'react';
import { Code2, Database, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Decoupled CMS Demo
            </h1>
            <p className="text-gray-600 mt-1">
              Comparing Drupal JSON API vs WordPress REST API integration patterns
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800">Drupal JSON API</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-green-800">WordPress REST API</span>
          </div>
        </div>
      </div>
    </header>
  );
};