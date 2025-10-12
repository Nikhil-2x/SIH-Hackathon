import React from 'react';
import { Eye } from 'lucide-react';

function DetectionModeSelector({ detectionMode, setDetectionMode }) {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-2xl shadow-xl p-6 border">
      <div className="flex items-center space-x-2 mb-4">
        <Eye className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-gray-200">Detection Mode</h2>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => setDetectionMode('full-body')}
          className={`w-full p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
            detectionMode === 'full-body'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          Full Body Analysis
        </button>
        <button
          onClick={() => setDetectionMode('hands-only')}
          className={`w-full p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
            detectionMode === 'hands-only'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          Hands Only
        </button>
      </div>
    </div>
  );
}

export default DetectionModeSelector;