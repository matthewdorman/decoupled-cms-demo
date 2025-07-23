import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Globe, ArrowRight, Code2, Zap, Shield, FileCode } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Code2 className="w-4 h-4" />
            Decoupled Architecture Demo
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Compare CMS APIs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore the differences between Drupal's JSON API and WordPress REST API 
            in a modern React application. See how each platform handles content delivery 
            in decoupled architectures.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Drupal Card */}
          <Link 
            to="/drupal" 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Drupal JSON API</h2>
                <p className="text-gray-600">JSON API specification compliant</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Standardized Format</h3>
                  <p className="text-sm text-gray-600">Follows JSON API specification for consistent data structure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Built-in Relationships</h3>
                  <p className="text-sm text-gray-600">Native support for complex entity relationships and includes</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">View articles & events</span>
              <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* WordPress Card */}
          <Link 
            to="/wordpress" 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">WordPress REST API</h2>
                <p className="text-gray-600">RESTful endpoints with flexibility</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Familiar REST Pattern</h3>
                  <p className="text-sm text-gray-600">Traditional REST API with intuitive endpoint structure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Embedded Resources</h3>
                  <p className="text-sm text-gray-600">Support for embedding related data with _embed parameter</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">View posts & events</span>
              <ArrowRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What You'll See in This Demo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">API Integration Patterns</h3>
              <p className="text-sm text-gray-600">Compare how each platform structures API calls and responses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Content Management</h3>
              <p className="text-sm text-gray-600">See how articles and events are handled by each CMS</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Decoupled Architecture</h3>
              <p className="text-sm text-gray-600">Modern React frontend consuming headless CMS backends</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileCode className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Code Examples</h3>
              <p className="text-sm text-gray-600">Interactive code snippets showing API integration patterns</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/code-examples"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
            >
              <FileCode className="w-5 h-5" />
              View Code Examples
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};