import React, { useState, useRef, useEffect } from 'react'
import './index.css';
import { Camera, Upload, Image, Video, RotateCcw, Download, Sparkles, Info, Grid3x3, Settings, BookOpen, Eye, Zap, CheckCircle2 } from 'lucide-react';

 function Mudra() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedDanceForm, setSelectedDanceForm] = useState('bharatanatyam');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionMode, setDetectionMode] = useState('full-body');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const danceForms = [
    { id: 'bharatanatyam', name: 'Bharatanatyam', color: 'from-orange-500 to-red-600' },
    { id: 'odissi', name: 'Odissi', color: 'from-blue-500 to-indigo-600' },
    { id: 'kuchipudi', name: 'Kuchipudi', color: 'from-purple-500 to-pink-600' },
    { id: 'mohiniattam', name: 'Mohiniattam', color: 'from-green-500 to-teal-600' },
    { id: 'manipuri', name: 'Manipuri', color: 'from-yellow-500 to-orange-600' },
    { id: 'kathak', name: 'Kathak', color: 'from-red-500 to-pink-600' }
  ];

  const mockMudras = [
    { name: 'Pataka', confidence: 94.5, description: 'Flag - All fingers extended' },
    { name: 'Tripataka', confidence: 87.2, description: 'Three parts of flag' },
    { name: 'Ardhapataka', confidence: 82.8, description: 'Half flag' },
    { name: 'Kartarimukha', confidence: 78.3, description: 'Scissors face' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      setUploadedImage(canvasRef.current.toDataURL());
      stopCamera();
      setActiveTab('upload');
    }
  };

  const analyzeMudra = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults({
        mudras: mockMudras,
        metadata: {
          processingTime: '0.42s',
          imageQuality: 'Excellent',
          handsDetected: 2,
          bodyPoseConfidence: 91.2
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAll = () => {
    setUploadedImage(null);
    setResults(null);
    stopCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Mudra Vision AI</h1>
                <p className="text-orange-100 mt-1">Bharatiya Natya Gesture Recognition System</p>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg p-3 rounded-xl transition-all">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-800">Select Dance Form</h2>
              </div>
              <div className="space-y-3">
                {danceForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedDanceForm(form.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedDanceForm === form.id
                        ? `bg-gradient-to-r ${form.color} text-white shadow-lg scale-105`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{form.name}</span>
                      {selectedDanceForm === form.id && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-800">Detection Mode</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setDetectionMode('full-body')}
                  className={`w-full p-3 rounded-xl transition-all ${
                    detectionMode === 'full-body'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Full Body Analysis
                </button>
                <button
                  onClick={() => setDetectionMode('hands-only')}
                  className={`w-full p-3 rounded-xl transition-all ${
                    detectionMode === 'hands-only'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Hands Only
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Model Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Accuracy</span>
                  <span className="font-bold text-xl">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Speed</span>
                  <span className="font-bold text-xl">35 FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Mudras DB</span>
                  <span className="font-bold text-xl">52</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Upload Image</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('camera');
                    if (!cameraActive) startCamera();
                  }}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all ${
                    activeTab === 'camera'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="font-semibold">Camera Capture</span>
                </button>
                <button
                  onClick={() => setActiveTab('realtime')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all ${
                    activeTab === 'realtime'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">Real-time</span>
                </button>
              </div>

              {activeTab === 'upload' && (
                <div className="p-8">
                  {!uploadedImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-orange-300 rounded-2xl p-16 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
                    >
                      <Image className="w-16 h-16 mx-auto text-orange-400 mb-4" />
                      <p className="text-xl font-semibold text-gray-700 mb-2">Upload Dance Image</p>
                      <p className="text-gray-500">Click to browse or drag and drop your image here</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-96 object-contain rounded-xl bg-gray-100"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={analyzeMudra}
                          disabled={isAnalyzing}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          <Zap className="w-5 h-5" />
                          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Mudra'}</span>
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'camera' && (
                <div className="p-8">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-xl transition-all"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Capture Image</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'realtime' && (
                <div className="p-8">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-16 text-center">
                    <Video className="w-16 h-16 mx-auto text-orange-400 mb-4" />
                    <p className="text-white text-xl font-semibold mb-2">Real-time Detection Coming Soon</p>
                    <p className="text-gray-400">Live mudra recognition with webcam feed</p>
                  </div>
                </div>
              )}
            </div>

            {results && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Grid3x3 className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Detection Results</h2>
                  </div>
                  <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition-all flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <p className="text-blue-600 text-sm font-semibold">Processing Time</p>
                    <p className="text-2xl font-bold text-blue-900">{results.metadata.processingTime}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                    <p className="text-green-600 text-sm font-semibold">Image Quality</p>
                    <p className="text-2xl font-bold text-green-900">{results.metadata.imageQuality}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                    <p className="text-purple-600 text-sm font-semibold">Hands Detected</p>
                    <p className="text-2xl font-bold text-purple-900">{results.metadata.handsDetected}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                    <p className="text-orange-600 text-sm font-semibold">Pose Confidence</p>
                    <p className="text-2xl font-bold text-orange-900">{results.metadata.bodyPoseConfidence}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Identified Mudras</h3>
                  {results.mudras.map((mudra, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-800">{mudra.name}</h4>
                        <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          {mudra.confidence}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{mudra.description}</p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${mudra.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">About This System</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
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