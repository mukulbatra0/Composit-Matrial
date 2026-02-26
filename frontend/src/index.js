import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppExperimental from './AppExperimental';

// Main app with navigation
function MainApp() {
  const [currentPage, setCurrentPage] = useState('experimental'); // 'experimental' or 'theoretical'

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">AI Integrated Composite Material Characterization System</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('experimental')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'experimental'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Experimental Data & Load-Deflection
              </button>
              <button
                onClick={() => setCurrentPage('theoretical')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'theoretical'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Theoretical (Rule of Mixtures)
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'experimental' && <AppExperimental />}
      {currentPage === 'theoretical' && <App />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
