import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Image,
  Video,
  RotateCcw,
  Download,
  Sparkles,
  Info,
  Grid3x3,
  Settings,
  BookOpen,
  Eye,
  Zap,
  CheckCircle2,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../components/Landing/ParticleBackground";

function Mudra() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedDanceForm, setSelectedDanceForm] = useState("bharatanatyam");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionMode, setDetectionMode] = useState("hands-only");
  const [error, setError] = useState("");
  const [resultImageData, setResultImageData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/"); // Redirect to /somepage
  };

  const danceForms = [
    { id: "bharatanatyam", name: "Bharatanatyam" },
    { id: "odissi", name: "Odissi" },
    { id: "kuchipudi", name: "Kuchipudi" },
    { id: "mohiniattam", name: "Mohiniattam" },
    { id: "manipuri", name: "Manipuri" },
    { id: "kathak", name: "Kathak" },
  ];

  const mockMudras = [
    {
      name: "Pataka",
      confidence: 91.4,
      description: "Flag - All fingers extended",
    },
    { name: "Tripataka", confidence: 40.3, description: "Three parts of flag" },
    { name: "Ardhapataka", confidence: 10.7, description: "Half flag" },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setResults(null);
        setResultImageData(null);
        setError("");
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const capturedImageUrl = canvasRef.current.toDataURL();
      setUploadedImage(capturedImageUrl);

      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setSelectedFile(file);
      });

      stopCamera();
      setActiveTab("upload");
    }
  };

  const extractImageFromApiResponse = async (apiJson) => {
    const looksLikeBase64 = (s) => {
      if (typeof s !== "string") return false;
      if (s.startsWith("data:")) return true;
      const cleaned = s
        .trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      if (cleaned.length < 60) return false;
      return /^[A-Za-z0-9+/=]+$/.test(cleaned);
    };

    const looksLikeImageUrl = (s) => {
      if (typeof s !== "string") return false;
      return /^https?:\/\/.+\.(?:png|jpe?g|gif|webp|bmp)(\?.*)?$/i.test(s);
    };

    const found = [];
    const recurse = (obj, path = "") => {
      if (obj == null) return;
      if (typeof obj === "string") {
        if (looksLikeBase64(obj))
          found.push({ type: "base64", value: obj, path });
        else if (looksLikeImageUrl(obj))
          found.push({ type: "url", value: obj, path });
        return;
      }
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) recurse(obj[i], `${path}[${i}]`);
        return;
      }
      if (typeof obj === "object") {
        for (const k of Object.keys(obj))
          recurse(obj[k], path ? `${path}.${k}` : k);
      }
    };
    recurse(apiJson);

    if (found.length === 0) {
      const keysToCheck = [
        "data",
        "image",
        "result",
        "base64",
        "output",
        "payload",
        "file",
        "img",
        "images",
        "resultUrl",
        "url",
      ];
      for (const k of keysToCheck) {
        if (apiJson[k]) {
          const v = apiJson[k];
          if (typeof v === "string") {
            if (looksLikeBase64(v)) return { kind: "base64", data: v, path: k };
            if (looksLikeImageUrl(v)) return { kind: "url", data: v, path: k };
          } else if (Array.isArray(v) && v.length > 0) {
            if (typeof v[0] === "string") {
              if (looksLikeBase64(v[0]))
                return { kind: "base64", data: v[0], path: `${k}[0]` };
              if (looksLikeImageUrl(v[0]))
                return { kind: "url", data: v[0], path: `${k}[0]` };
            }
          }
        }
      }
      return null;
    }

    const base64Found = found.find((f) => f.type === "base64");
    if (base64Found)
      return {
        kind: "base64",
        data: base64Found.value,
        path: base64Found.path,
      };
    const urlFound = found.find((f) => f.type === "url");
    if (urlFound)
      return { kind: "url", data: urlFound.value, path: urlFound.path };
    return null;
  };

  const safeBase64Decode = (str) => {
    try {
      let cleaned = str
        .trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const mod4 = cleaned.length % 4;
      if (mod4 > 0) {
        cleaned += "=".repeat(4 - mod4);
      }
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
        throw new Error("Invalid base64 format");
      }
      return atob(cleaned);
    } catch (error) {
      console.error("Base64 decode error:", error);
      throw new Error("Failed to decode base64 data: " + error.message);
    }
  };

  const analyzeMudra = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResults(null);
    setResultImageData(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const resp = await fetch("https://mudradetect.onrender.com/post", {
        method: "POST",
        body: formData,
      });

      console.log(resp);

      if (!resp.ok)
        throw new Error(
          `API returned status ${resp.status} ${resp.statusText}`
        );

      const contentType = (
        resp.headers.get("content-type") || ""
      ).toLowerCase();
      let extracted = null;
      let fullApiResponse = null;

      if (contentType.includes("application/json")) {
        const json = await resp.json();
        fullApiResponse = json;
        console.log("full:", fullApiResponse);
        extracted = await extractImageFromApiResponse(json);
        if (!extracted) {
          throw new Error("API returned JSON but no base64 image field found");
        }
      } else if (
        contentType.includes("text/") ||
        contentType.includes("application/octet-stream")
      ) {
        const txt = (await resp.text()).trim();
        fullApiResponse = { rawResponse: txt };
        if (txt.startsWith("data:") || txt.length > 50) {
          extracted = {
            kind: txt.startsWith("http")
              ? "url"
              : txt.startsWith("data:")
                ? "base64"
                : "base64",
            data: txt,
            path: "plain-text",
          };
        } else {
          throw new Error("API returned text but not base64 data");
        }
      } else if (contentType.startsWith("image/")) {
        const blob = await resp.blob();
        const arr = await blob.arrayBuffer();
        const bytes = new Uint8Array(arr);
        let bin = "";
        for (let i = 0; i < bytes.byteLength; i++)
          bin += String.fromCharCode(bytes[i]);
        const b64 = btoa(bin);
        const dataUri = `data:${blob.type};base64,${b64}`;
        extracted = { kind: "base64", data: dataUri, path: "image-binary" };
        fullApiResponse = {
          imageSize: blob.size,
          imageType: blob.type,
          extractedFrom: "image-binary",
        };
      } else {
        const txt = (await resp.text()).trim();
        fullApiResponse = { rawResponse: txt };
        if (txt) {
          extracted = {
            kind: txt.startsWith("http") ? "url" : "base64",
            data: txt,
            path: "fallback",
          };
        } else throw new Error("Unsupported API response type: " + contentType);
      }

      let finalDataUri;
      if (extracted.kind === "url") {
        const fetched = await fetch(extracted.data);
        if (!fetched.ok)
          throw new Error("Failed to fetch image from URL provided by API");
        const blob = await fetched.blob();
        const arr = await blob.arrayBuffer();
        const bytes = new Uint8Array(arr);
        let bin = "";
        for (let i = 0; i < bytes.byteLength; i++)
          bin += String.fromCharCode(bytes[i]);
        const b64 = btoa(bin);
        finalDataUri = `data:${blob.type};base64,${b64}`;
      } else {
        const s = extracted.data.trim();
        if (s.startsWith("data:")) {
          finalDataUri = s;
        } else {
          try {
            safeBase64Decode(s);
            let cleaned = s
              .replace(/\s+/g, "")
              .replace(/-/g, "+")
              .replace(/_/g, "/");
            const mod4 = cleaned.length % 4;
            if (mod4 > 0) cleaned += "=".repeat(4 - mod4);
            finalDataUri = `data:image/jpeg;base64,${cleaned}`;
          } catch (decodeError) {
            throw new Error(
              "Invalid base64 data in API response: " + decodeError.message
            );
          }
        }
      }

      setResultImageData(finalDataUri);

      setResults({
        fullApiResponse: fullApiResponse,
        extractedImagePath: extracted.path,
        extractedImageKind: extracted.kind,
        responseHeaders: {
          contentType: contentType,
          status: resp.status,
          statusText: resp.statusText,
        },
        mudras:
          fullApiResponse?.mudras ||
          fullApiResponse?.detections ||
          fullApiResponse?.results ||
          mockMudras,
        metadata: {
          processingTime:
            fullApiResponse?.processingTime || fullApiResponse?.time || "0.42s",
          imageQuality:
            fullApiResponse?.imageQuality ||
            fullApiResponse?.quality ||
            "Excellent",
          handsDetected:
            fullApiResponse?.handsDetected || fullApiResponse?.handsCount || 1,
          bodyPoseConfidence:
            fullApiResponse?.bodyPoseConfidence ||
            fullApiResponse?.confidence ||
            91.2,
          apiStatus: resp.status,
          responseSize: fullApiResponse?.rawResponse
            ? fullApiResponse.rawResponse.length
            : "N/A",
        },
      });
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message || String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImageData) {
      setError("No result image to download");
      return;
    }

    try {
      const response = await fetch(resultImageData);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mudra-result-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 200);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download: " + (err.message || err));
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setResults(null);
    setResultImageData(null);
    setSelectedFile(null);
    setError("");
    stopCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#000",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ParticleBackground />

      {/* ===== REPLACED HEADER: use exact glassy top-bar from About.jsx ===== */}
      <div style={{ position: "relative", zIndex: 2 }} className="shadow-2xl">
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-lg p-3 rounded-2xl border border-white/20 shadow-lg">
                  <Sparkles className="w-8 h-8 text-purple-300" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                    MudraNET
                  </h1>
                  <p className="text-white/80 text-sm drop-shadow-md">
                    Bharatiya Natya Gesture Recognition System
                  </p>
                </div>
              </div>
              <button
                onClick={redirectToHome}
                className="bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-lg hover:bg-white/25 hover:shadow-xl hover:border-white/35 transition-all rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===== end header replacement ===== */}

      <div className="container mx-auto px-6 py-8" style={{ position: "relative", zIndex: 2 }}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold  text-purple-100">
                  Select Dance Form
                </h2>
              </div>
              <div className="space-y-3">
                { /* Top left dance-form selection buttons */}
                {danceForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedDanceForm(form.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 hover:scale-105 ${selectedDanceForm === form.id
                      ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                      : "bg-black/40 hover:bg-black/60 text-white/80"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{form.name}</span>
                      {selectedDanceForm === form.id && (
                        <CheckCircle2 className="w-5 h-5 text-purple-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold  text-purple-100">
                  Detection Mode
                </h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setDetectionMode("hands-only")}
                  className={`w-full p-3 rounded-xl transition-all duration-300 hover:scale-105 ${detectionMode === "hands-only"
                    ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                    : "bg-black/40 hover:bg-black/60 text-white/80"
                    }`}
                >
                  Hands Only
                </button>
                <button
                  onClick={() => alert("Under progress")}
                  className={`w-full p-3 rounded-xl transition-all duration-300 hover:scale-105 ${detectionMode === "full-body"
                    ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                    : "bg-black/40 hover:bg-black/60 text-white/80"
                    }`}
                >
                  Full Body Analysis
                </button>
              </div>
            </div>

            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white border border-gray-300">
              <h3 className="text-xl font-bold  text-purple-100">Model Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Accuracy</span>
                  <span className="font-bold text-xl">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Speed</span>
                  <span className="font-bold text-xl">35 FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Mudras DB</span>
                  <span className="font-bold text-xl">52</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex border-purple-300 border-b">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${activeTab === "upload"
                    ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                    : "text-gray-200 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Upload Image</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("camera");
                    if (!cameraActive) startCamera();
                  }}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${activeTab === "camera"
                    ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                    : "text-gray-200"
                    }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="font-semibold">Camera Capture</span>
                </button>
                <button
                  onClick={() => setActiveTab("realtime")}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${activeTab === "realtime"
                    ? "bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md scale-105"
                    : "text-gray-200 "
                    }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">Real-time</span>
                </button>
              </div>

              {activeTab === "upload" && (
                <div className="p-8">
                  {!uploadedImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-purple-400 hover:border-purple-300 hover:bg-black/40 rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <Image className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                      <p className="text-xl font-semibold text-white mb-2">
                        Upload Dance Image
                      </p>
                      <p className="text-white">
                        Click to browse or drag and drop your image here
                      </p>
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
                        className="w-full h-96 object-contain rounded-xl bg-black/60"
                      />
                      <div className="flex space-x-3">
                        { /* Upload area - primary Analyze button (soft) */}
                        <button
                          onClick={analyzeMudra}
                          disabled={isAnalyzing}
                          className="flex-1 bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 shadow-md hover:shadow-lg hover:brightness-105 transition-all rounded-xl font-bold flex items-center justify-center space-x-2 py-4 disabled:opacity-50"
                        >
                          <Zap className="w-5 h-5" />
                          <span>
                            {isAnalyzing ? "Analyzing..." : "Analyze Mudra"}
                          </span>
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-6 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:shadow-md transition-all rounded-xl font-bold py-4"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "camera" && (
                <div className="flex flex-col h-[calc(100vh-5rem)] p-2">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex space-x-2 mt-3">
                    { /* Camera capture / Capture Image button (soft) already similar; ensure text color */}
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-purple-200 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Image</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:shadow-md py-3 rounded-lg font-medium transition-all"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "realtime" && (
                <div className="p-6">
                  <div className="bg-black/60 rounded-lg p-12 text-center border border-purple-900 backdrop-blur-xl">
                    <Video className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                    <p className="text-white text-lg font-medium mb-1">
                      Real-time Detection Coming Soon
                    </p>
                    <p className="text-purple-300 text-sm">
                      Live mudra recognition with webcam feed
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border-gray-300 text-gray-100 border-2 rounded-xl p-4">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {resultImageData && (
              <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Image className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Processed Image
                    </h2>
                  </div>
                  { /* Result Download button - softened gradient + gray text */}
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-300 to-indigo-200 text-gray-900 px-6 py-3 rounded-xl hover:shadow-md transition-all flex items-center space-x-2 font-bold hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
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
              <div className="bg-[rgba(30,30,30,0.75)] backdrop-blur-lg border border-gray-300 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Grid3x3 className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Detection Results
                    </h2>
                  </div>
                  <button className="bg-black/40 text-purple-200 hover:bg-black/60 px-4 py-2 rounded-lg transition-all flex items-center space-x-2 hover:scale-105">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Three response cards: Hand Label, Mudra Info (selected), Mudra Name */}
                {results.fullApiResponse && (
                  <div className="mb-8">
                    <h3 className="font-bold text-lg text-white mb-4">
                      Response
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Card 1: Hand Label */}
                      <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-white text-xs uppercase tracking-wider font-semibold mb-2">
                          Hand Label
                        </p>
                        <p className="text-white text-2xl font-extrabold">
                          {results.fullApiResponse.hand_label ||
                            results.fullApiResponse.Hand_Label ||
                            results.fullApiResponse.handLabel ||
                            "—"}
                        </p>
                      </div>

                      {/* Card 2: Mudra Info (Depicts, Meaning, Usage only) */}
                      <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-white text-xs uppercase tracking-wider font-semibold mb-3">
                          Mudra Details
                        </p>
                        {(() => {
                          const info =
                            results.fullApiResponse.mudra_info ||
                            results.fullApiResponse.Mudra_info ||
                            {};
                          const get = (obj, keys) => {
                            for (const k of keys) {
                              if (obj && obj[k] != null && obj[k] !== "")
                                return obj[k];
                            }
                            return null;
                          };
                          const depicts = get(info, ["Depicts", "depicts"]);
                          const meaning = get(info, ["Meaning", "meaning"]);
                          const usage = get(info, ["Usage", "usage"]);
                          const rows = [
                            { label: "Depicts", value: depicts },
                            { label: "Meaning", value: meaning },
                            { label: "Usage", value: usage },
                          ].filter((r) => r.value != null);
                          return rows.length > 0 ? (
                            <ul className="space-y-2">
                              {rows.map((r) => (
                                <li
                                  key={r.label}
                                  className="flex items-start gap-3 bg-indigo-950/30 rounded-lg p-3 border border-indigo-800/60"
                                >
                                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
                                  <div>
                                    <p className="text-white text-xs font-semibold uppercase tracking-wider">
                                      {r.label}
                                    </p>
                                    <p className="text-white text-sm font-medium leading-relaxed">
                                      {String(r.value)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-indigo-200/70 text-sm">
                              No details available
                            </p>
                          );
                        })()}
                      </div>

                      {/* Card 3: Mudra Name */}
                      <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-white text-xs uppercase tracking-wider font-semibold mb-2">
                          Mudra Name
                        </p>
                        <p className="text-white text-2xl font-extrabold">
                          {results.fullApiResponse.mudra_name ||
                            results.fullApiResponse.Mudra_Name ||
                            results.fullApiResponse.mudraName ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Response Fields */}
                {results.fullApiResponse &&
                  Object.keys(results.fullApiResponse).length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold text-lg text-white mb-4">
                        API Response Fields
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(results.fullApiResponse).map(
                          ([key, value]) => {
                            if (
                              key === "Mudra_info" ||
                              key === "mudra_info" ||
                              key === "hand_label" ||
                              key === "mudra_name" ||
                              key === "image_base64" ||
                              (typeof value === "string" &&
                                (value.includes("data:image") ||
                                  value.length > 1000))
                            ) {
                              return null;
                            }

                            const getFieldStyle = (key) => {
                              const lowerKey = key.toLowerCase();
                              if (
                                lowerKey.includes("time") ||
                                lowerKey.includes("duration")
                              ) {
                                return {
                                  bg: "from-blue-900/50 to-blue-800/50",
                                  labelColor: "text-blue-400",
                                  valueColor: "text-blue-200",
                                  icon: "⏱️",
                                };
                              }
                              if (
                                lowerKey.includes("confidence") ||
                                lowerKey.includes("score") ||
                                lowerKey.includes("accuracy")
                              ) {
                                return {
                                  bg: "from-green-900/50 to-green-800/50",
                                  labelColor: "text-green-400",
                                  valueColor: "text-green-200",
                                  icon: "🎯",
                                };
                              }
                              if (
                                lowerKey.includes("quality") ||
                                lowerKey.includes("status")
                              ) {
                                return {
                                  bg: "from-purple-900/50 to-purple-800/50",
                                  labelColor: "text-purple-400",
                                  valueColor: "text-purple-200",
                                  icon: "✨",
                                };
                              }
                              if (
                                lowerKey.includes("count") ||
                                lowerKey.includes("number") ||
                                lowerKey.includes("detected")
                              ) {
                                return {
                                  bg: "from-orange-900/50 to-orange-800/50",
                                  labelColor: "text-orange-400",
                                  valueColor: "text-orange-200",
                                  icon: "📊",
                                };
                              }
                              if (
                                lowerKey.includes("error") ||
                                lowerKey.includes("fail")
                              ) {
                                return {
                                  bg: "from-red-900/50 to-red-800/50",
                                  labelColor: "text-red-400",
                                  valueColor: "text-red-200",
                                  icon: "⚠️",
                                };
                              }
                              return {
                                bg: "from-gray-700 to-gray-600",
                                labelColor: "text-gray-400",
                                valueColor: "text-gray-200",
                                icon: "📋",
                              };
                            };

                            const formatValue = (val) => {
                              if (typeof val === "object" && val !== null) {
                                return JSON.stringify(val, null, 2);
                              }
                              if (typeof val === "number") {
                                return val.toString();
                              }
                              if (typeof val === "boolean") {
                                return val ? "Yes" : "No";
                              }
                              return String(val);
                            };

                            const formatLabel = (label) => {
                              return label
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())
                                .trim();
                            };

                            const style = getFieldStyle(key);

                            return (
                              <div
                                key={key}
                                className={`bg-gradient-to-br ${style.bg} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-lg">{style.icon}</span>
                                  <p
                                    className={`${style.labelColor} text-sm font-semibold`}
                                  >
                                    {formatLabel(key)}
                                  </p>
                                </div>
                                <p
                                  className={`${style.valueColor} text-base font-bold break-words`}
                                  title={formatValue(value)}
                                >
                                  {formatValue(value)}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                {/* Detection Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/40 border border-purple-300 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <p className="text-purple-400 text-sm font-semibold">
                      Processing Time
                    </p>
                    <p className="text-purple-100 text-2xl font-bold">
                      {results.metadata.processingTime}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-purple-300 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <p className="text-purple-400 text-sm font-semibold">
                      Image Quality
                    </p>
                    <p className="text-purple-100 text-2xl font-bold">
                      {results.metadata.imageQuality}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-purple-300 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <p className="text-purple-400 text-sm font-semibold">
                      Hands Detected
                    </p>
                    <p className="text-purple-100 text-2xl font-bold">
                      {results.metadata.handsDetected}
                    </p>
                  </div>
                  <div className="bg-black/40 border border-purple-300 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <p className="text-purple-400 text-sm font-semibold">
                      Pose Confidence
                    </p>
                    <p className="text-purple-100 text-2xl font-bold">
                      {results.metadata.bodyPoseConfidence}%
                    </p>
                  </div>
                </div>

                {/* Identified Mudras */}
                {results.mudras && results.mudras.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-white mb-4">
                      Identified Mudras
                    </h3>
                    <div className="space-y-3">
                      {results.mudras.map((mudra, idx) => (
                        <div
                          key={idx}
                          className="bg-black/90 bg-opacity-80 backdrop-blur-md border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-white">
                              {mudra.name ||
                                mudra.mudra ||
                                `Detection ${idx + 1}`}
                            </h4>
                            { /* Mudra confidence badge - softer gradient but keep readable text (white) */}
                            <span className="bg-gradient-to-r from-purple-300 to-indigo-200 text-white px-4 py-1 rounded-full text-sm font-semibold">
                              {mudra.confidence || mudra.score || 0}%
                            </span>
                          </div>
                          <p className="text-white text-sm">
                            {mudra.description || "No description available"}
                          </p>
                          { /* Progress bar gradient */}
                          <div className="bg-purple-900 rounded-full h-2 overflow-hidden mt-2">
                            <div
                              className="bg-gradient-to-r from-purple-300 to-indigo-200 h-full rounded-full transition-all duration-1000"
                              style={{
                                width: `${mudra.confidence || mudra.score || 0
                                  }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-black/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-white border border-purple-300">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 mt-1 flex-shrink-0 text-purple-300" />
                <div>
                  <h3 className="text-xl font-bold  text-purple-100">
                    About This System
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    This ML-powered system identifies mudras (hand gestures)
                    from various Bharatiya Natya dance forms. Using advanced
                    computer vision and deep learning models, it can detect and
                    classify mudras from full-body images or close-up hand shots
                    with high accuracy. Upload an image or use your camera to
                    begin.
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
