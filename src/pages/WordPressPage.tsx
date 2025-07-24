import React from 'react';
import { Globe } from 'lucide-react';
import { WordPressSection } from '../components/WordPressSection';

export const WordPressPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light-gray">
      <div className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-teal rounded-xl">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">WordPress REST API</h1>
              <p className="text-white/80 mt-2">
                Content delivered via RESTful endpoints - flexible, familiar, and easily extensible
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WordPressSection />
      </main>
    </div>
  );
};