import React from 'react';
import { Database } from 'lucide-react';
import { DrupalSection } from '../components/DrupalSection';

export const DrupalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Drupal JSON API</h1>
              <p className="text-blue-100 mt-2">
                Content delivered via JSON API specification - standardized, predictable, and relationship-aware
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DrupalSection />
      </main>
    </div>
  );
};