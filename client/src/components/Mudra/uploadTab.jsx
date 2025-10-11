import React, { useRef } from 'react';
import { Image, Zap, RotateCcw } from 'lucide-react';

function UploadTab({ uploadedImage, onFileUpload, onAnalyze, onReset, isAnalyzing }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileUpload(file);
    } else {
      console.error('Please select a valid image file.');
    }
  };

  return (
    <div className="p-8">
      {!uploadedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-orange-400 hover:border-orange-300 hover:bg-orange-900/20 rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <Image className="w-16 h-16 mx-auto text-orange-400 mb-4" />
          <p className="text-xl font-semibold text-gray-200 mb-2">Upload Dance Image</p>
          <p className="text-gray-400">Click to browse or drag and drop your image here</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-96 object-contain rounded-xl bg-gray-700"
          />
          <div className="flex space-x-3">
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-xl transition-all disabled:opacity-50 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Mudra'}</span>
            </button>
            <button
              onClick={onReset}
              className="px-6 bg-gray-700 text-gray-300 hover:bg-gray-600 py-4 rounded-xl font-bold transition-all hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadTab;