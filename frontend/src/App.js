import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeedList from './components/FeedList';
import FeedDetail from './components/FeedDetail';
import AddFeed from './components/AddFeed';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<FeedList />} />
            <Route path="/feeds/new" element={<AddFeed />} />
            <Route path="/feeds/:id" element={<FeedDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 