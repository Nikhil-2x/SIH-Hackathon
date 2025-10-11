import React from 'react';
import { Image, Grid3x3, Download } from 'lucide-react';

function ResultsDisplay({ resultImageData, results, onDownload, onExport }) {
  if (!resultImageData && !results) return null;

  return (
    <>
      {resultImageData && (
        <div className="bg-gray-800 border-gray-700 rounded-2xl shadow-xl p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Image className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-gray-200">Processed Image</h2>
            </div>
            <button 
              onClick={onDownload}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center space-x-2 font-bold hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Download Image</span>
            </button>
          </div>
          <img
            src={resultImageData}
            alt="Processed Result"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      )}

      {results && (
        <div className="bg-gray-800 border-gray-700 rounded-2xl shadow-xl p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Grid3x3 className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-gray-200">Detection Results</h2>
            </div>
            <button 
              onClick={onExport}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center space-x-2 font-bold hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Export Results</span>
            </button>
          </div>

          {/* Mudra Information Fields */}
          {results.fullApiResponse?.Mudra_info && (
            <div className="mb-6">
              <h3 className="font-semibold text-base text-gray-800 mb-4">Mudra Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.fullApiResponse.Mudra_info).map(([key, value]) => (
                  <div key={key} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <p className="text-indigo-600 text-sm font-medium mb-1">{key}</p>
                    <p className="text-gray-800 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Response Fields */}
          {results.fullApiResponse && Object.keys(results.fullApiResponse).length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-200 mb-4">API Response Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.fullApiResponse).map(([key, value]) => {
                  if (key === 'Mudra_info' || key === 'image_base64' || (typeof value === 'string' && (value.includes('data:image') || value.length > 1000))) {
                    return null;
                  }
                  
                  const getFieldStyle = (key) => {
                    const lowerKey = key.toLowerCase();
                    if (lowerKey.includes('time') || lowerKey.includes('duration')) {
                      return {
                        bg: 'from-blue-900/50 to-blue-800/50',
                        labelColor: 'text-blue-400',
                        valueColor: 'text-blue-200',
                        icon: '⏱️'
                      };
                    }
                    if (lowerKey.includes('confidence') || lowerKey.includes('score') || lowerKey.includes('accuracy')) {
                      return {
                        bg: 'from-green-900/50 to-green-800/50',
                        labelColor: 'text-green-400',
                        valueColor: 'text-green-200',
                        icon: '🎯'
                      };
                    }
                    if (lowerKey.includes('quality') || lowerKey.includes('status')) {
                      return {
                        bg: 'from-purple-900/50 to-purple-800/50',
                        labelColor: 'text-purple-400',
                        valueColor: 'text-purple-200',
                        icon: '✨'
                      };
                    }
                    if (lowerKey.includes('count') || lowerKey.includes('number') || lowerKey.includes('detected')) {
                      return {
                        bg: 'from-orange-900/50 to-orange-800/50',
                        labelColor: 'text-orange-400',
                        valueColor: 'text-orange-200',
                        icon: '📊'
                      };
                    }
                    if (lowerKey.includes('error') || lowerKey.includes('fail')) {
                      return {
                        bg: 'from-red-900/50 to-red-800/50',
                        labelColor: 'text-red-400',
                        valueColor: 'text-red-200',
                        icon: '⚠️'
                      };
                    }
                    return {
                      bg: 'from-gray-700 to-gray-600',
                      labelColor: 'text-gray-400',
                      valueColor: 'text-gray-200',
                      icon: '📋'
                    };
                  };

                  const formatValue = (val) => {
                    if (typeof val === 'object' && val !== null) {
                      return JSON.stringify(val, null, 2);
                    }
                    if (typeof val === 'number') {
                      return val.toString();
                    }
                    if (typeof val === 'boolean') {
                      return val ? 'Yes' : 'No';
                    }
                    return String(val);
                  };

                  const formatLabel = (label) => {
                    return label
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
                  };

                  const style = getFieldStyle(key);

                  return (
                    <div key={key} className={`bg-gradient-to-br ${style.bg} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{style.icon}</span>
                        <p className={`${style.labelColor} text-sm font-semibold`}>{formatLabel(key)}</p>
                      </div>
                      <p className={`${style.valueColor} text-base font-bold break-words`} title={formatValue(value)}>
                        {formatValue(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}          
        </div>
      )}
    </>
  );
}

export default ResultsDisplay;