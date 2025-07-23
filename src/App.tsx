import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { DrupalPage } from './pages/DrupalPage';
import { WordPressPage } from './pages/WordPressPage';
import { CodeExamplesPage } from './pages/CodeExamplesPage';
import { ContentDetailPage } from './pages/ContentDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/drupal" element={<DrupalPage />} />
          <Route path="/wordpress" element={<WordPressPage />} />
          <Route path="/code-examples" element={<CodeExamplesPage />} />
          <Route path="/:platform/:type/:id" element={<ContentDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
