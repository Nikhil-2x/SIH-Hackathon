import React from 'react';
import { Camera } from 'lucide-react';
function CameraTab({ videoRef, canvasRef, cameraActive, onCapture, onStopCamera }) {
  return (
    <div className="p-6">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-80 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex space-x-2 mt-3">
        <button
          onClick={onCapture}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Image</span>
        </button>
        <button
          onClick={onStopCamera}
          className="px-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default CameraTab;