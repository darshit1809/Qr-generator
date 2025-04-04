import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import History from './pages/History';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<QRGenerator />} />
        <Route path="/scan" element={<QRScanner />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
}

export default App; 