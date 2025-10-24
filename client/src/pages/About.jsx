import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Info, Sparkles } from "lucide-react";
import ParticleBackground from "../components/Landing/ParticleBackground";

// Updated About page with Mudra's color scheme and particle background
const About = () => {
  const navigate = useNavigate();
  const goHome = () => navigate("/");

  // hide global navbar while About is mounted
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const prevDisplay = nav.style.display;
    nav.style.display = "none";
    return () => {
      nav.style.display = prevDisplay || "";
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full force-white"
      style={{
        background: "#000",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* particle background with interactive controls enabled */}
      <ParticleBackground showControls={true} />

      {/* top bar (glass) */}
      <div style={{ position: "relative", zIndex: 2 }} className="shadow-2xl">
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-lg p-3 rounded-2xl border border-white/20 shadow-lg">
                  <Sparkles className="w-8 h-8 text-purple-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">MudraNET</h1>
                  <p className="text-purple-200 text-sm drop-shadow-md">
                    Bharatiya Natya Gesture Recognition System
                  </p>
                </div>
              </div>
              <button
                onClick={goHome}
                className="bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-lg hover:bg-white/25 hover:shadow-xl hover:border-white/35 transition-all rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="container mx-auto px-6 py-12" style={{ position: "relative", zIndex: 2 }}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - info panel */}
          <div className="lg:col-span-1">
            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-purple-300" />
                <h2 className="text-xl font-bold text-purple-100">About This System</h2>
              </div>
              <p className="text-white text-sm leading-relaxed">
                MudraNET is an AI-powered system for recognizing mudras (hand gestures) in Bharatiya Natya dance forms such as Bharatanatyam and Kathakali. It combines computer vision and deep learning to detect hand landmarks and classify gestures from images or live camera feeds.
                Built with MediaPipe and TensorFlow, the model extracts 21 key hand points, identifies mudras, and returns confidence scores. Users can upload images or use real-time webcam input, visualize the detected gestures, and download processed results — all within an adaptive, modern UI.
              </p>
            </div>
          </div>

          {/* Right column - feature cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-purple-100 mb-4">How it works</h3>
              <p className="text-white mb-6">
                Upload a dance image or use your webcam to capture a frame. The model
                processes the image, identifies hands and classifies the mudra, then
                returns annotated results and confidence scores.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-4">
                  <p className=" text-purple-100 text-sm font-bold">Upload / Capture</p>
                  <p className="text-white text-sm mt-2">
                    The user uploads an image or activates the webcam to capture a dance frame or hand gesture. Clear, front-facing hand positions yield the best results.
                  </p>
                </div>
                <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-4">
                  <p className=" text-purple-100 text-sm font-bold">Preprocessing</p>
                  <p className="text-white text-sm mt-2">
                    The image is resized and normalized before being passed into the MediaPipe Hands pipeline, which detects and extracts 21 hand landmarks.
                  </p>
                </div>
                <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-4">
                  <p className=" text-purple-100 text-sm font-bold">Feature Analysis</p>
                  <p className="text-white text-sm mt-2">
                    Spatial coordinates and angular relationships between key points are computed to represent the mudra’s structure.
                  </p>
                </div>
                <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-4">
                  <p className=" text-purple-100 text-sm font-bold">Visualization & Export</p>
                  <p className="text-white text-sm mt-2">
                    The system overlays the detected landmarks and labels onto the image, displays the mudra name with confidence, and lets users download or export results for learning or research.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-purple-100">Get Started</h4>
                <p className="text-white text-sm">Try uploading an image or open the camera.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md hover:shadow-xl transition-all rounded-xl px-4 py-2"
                >
                  Open Mudra Tool
                </button>
                <button
                  onClick={goHome}
                  className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-white hover:bg-gray-200 hover:shadow-md transition-all"
                >
                  Home
                </button>
              </div>
            </div>

            {/* small footer note */}
            {/* <div className="text-xs text-white">
							<p>Built with open-source models and domain knowledge of Bharatiya Natya.</p>
						</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
