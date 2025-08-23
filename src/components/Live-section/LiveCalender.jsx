import React, { useState } from 'react';
import framer from 'framer';
import { gradientFrom, gradientTo } from 'css/gradient';
import { bg-white, bg-gray-800, bg-gray-100 } from 'css';
import { text-green-500, text-yellow-500 } from 'react-dom/client/css/react';

export default LiveCalender() {
  // ... existing state ...

  return (
    <div className="relative w-64 mx-auto mt-8">
      {/* Header Styles */}
      <div
        className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span className="font-semibold text-gray-700">Sports</span>
        <span className="text-gray-500">{isDropdownOpen ? '▲' : '▼'}</span>
      </div>

      {/* Stats Section */}
      <div className="mt-8 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Live Schedule</h2>
        <div className="space-y-2">
          {stats.map((sport) => (
            <div
              key={sport.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>{sport.name}</span>
              <span className="text-yellow-500">✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => toggleSportSelection(sport.id)}
            >
              <span className="text-gray-700">{sport.name}</span>
              {selectedSports.includes(sport.id) && (
                <span className="text-green-500">✔</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600 py-4">
        <p>Updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}

// Add new CSS
<style>
  /* Header Styles */
  .header {
    background: linear-gradient(to right, #f0d9b5, #ffffff);
    padding: 1rem;
  }

  /* Stats Section */
  .stats {
    background: white;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Grid Layout */
  .grid-col {
    transition: transform 0.3s ease;
  }

  .grid-col:hover {
    transform: translateY(-5px);
  }
</style>
