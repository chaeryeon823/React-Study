import React, { useState, useCallback } from 'react';
import NewsList from './components/NewsList.js';
import Categories from './components/Categories.js';
import { Routes, Route } from 'react-router-dom';
import NewsPage from './pages/NewsPage.js';
const App = () => {
  const [category, setCategory] = useState('all');
  const onSelect = useCallback((category) => setCategory(category), []);
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/:category" element={<NewsPage />} />
    </Routes>
  );
};

export default App;
