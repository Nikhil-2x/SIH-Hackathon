import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Settings } from 'lucide-react';
import DanceFormSelector from './DanceFormSelector';
import DetectionModeSelector from './DetectionModeSelector';
import UploadTab from './uploadTab'
import CameraTab from './CameraTab';
import ResultsDisplay from './ResultsDisplay';
import { analyzeMudra, startCamera, stopCamera, captureImage, resetAll } from '../hooks/imageutils';

function Mudra() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedDanceForm, setSelectedDanceForm] = useState('bharatanatyam');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionMode, setDetectionMode] = useState('full-body');
  const [error, setError] = useState('');
  const [resultImageData, setResultImageData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'camera' && !cameraActive) {
      startCamera(videoRef, setCameraActive, setError);
    }
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setResults(null);
      setResultImageData(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    const { imageUrl, file } = captureImage(videoRef, canvasRef);
    setUploadedImage(imageUrl);
    setSelectedFile(file);
    stopCamera(videoRef, setCameraActive);
    setActiveTab('upload');
  };

  const handleAnalyze = async () => {
    const result = await analyzeMudra(selectedFile, setIsAnalyzing, setError, setResults, setResultImageData);
  };

  const handleReset = () => {
    resetAll(setUploadedImage, setResults, setResultImageData, setSelectedFile, setError, stopCamera, videoRef, setCameraActive);
  };

  useEffect(() => {
    return () => stopCamera(videoRef, setCameraActive);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-600/30 backdrop-blur-lg p-3 rounded-2xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Mudra Vision AI</h1>
                <p className="text-gray-300 mt-1">Bharatiya Natya Gesture Recognition System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-600/30 hover:bg-gray-600/50 backdrop-blur-lg p-3 rounded-xl transition-all duration-300 hover:scale-105">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DanceFormSelector 
              selectedDanceForm={selectedDanceForm}
              setSelectedDanceForm={setSelectedDanceForm}
            />
            
            <DetectionModeSelector 
              detectionMode={detectionMode}
              setDetectionMode={setDetectionMode}
            />

            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Model Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Accuracy</span>
                  <span className="font-bold text-xl">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Speed</span>
                  <span className="font-bold text-xl">35 FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Mudras DB</span>
                  <span className="font-bold text-xl">52</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 border-gray-700 rounded-2xl shadow-xl border overflow-hidden">
              <div className="flex border-gray-700 border-b">
                <button
                  onClick={() => handleTabChange('upload')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="font-semibold">Upload Image</span>
                </button>
                <button
                  onClick={() => handleTabChange('camera')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${
                    activeTab === 'camera'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="font-semibold">Camera Capture</span>
                </button>
                <button
                  onClick={() => handleTabChange('realtime')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${
                    activeTab === 'realtime'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="font-semibold">Real-time</span>
                </button>
              </div>

              {activeTab === 'upload' && (
                <UploadTab 
                  uploadedImage={uploadedImage}
                  onFileUpload={handleFileUpload}
                  onAnalyze={handleAnalyze}
                  onReset={handleReset}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {activeTab === 'camera' && (
                <CameraTab 
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  cameraActive={cameraActive}
                  onCapture={handleCapture}
                  onStopCamera={() => stopCamera(videoRef, setCameraActive)}
                />
              )}

              {activeTab === 'realtime' && (
                <div className="p-6">
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <p className="text-white text-lg font-medium mb-1">Real-time Detection Coming Soon</p>
                    <p className="text-gray-400 text-sm">Live mudra recognition with webcam feed</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/50 border-red-700 text-red-200 border-2 rounded-xl p-4">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <ResultsDisplay 
              resultImageData={resultImageData}
              results={results}
              onDownload={() => {/* download logic */}}
            />

            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="font-bold text-lg mb-2">About This System</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    This ML-powered system identifies mudras (hand gestures) from various Bharatiya Natya dance forms. 
                    Using advanced computer vision and deep learning models, it can detect and classify mudras from 
                    full-body images or close-up hand shots with high accuracy. Upload an image or use your camera to begin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mudra;