import React, { useState, useRef } from 'react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Droplets
} from 'lucide-react';
import { predictSingleLeaf } from '@/lib/api';
import { ScanResult } from '@/lib/types';

const SAMPLE_TESTS = [
  { name: 'Okra Yellow Mosaic', file: 'okra_yellow_vein_mosaic.jpg', tag: 'High Severity' },
  { name: 'Tomato Early Blight', file: 'tomato_early_blight.jpg', tag: 'Fungal' },
  { name: 'Potato Late Blight', file: 'potato_late_blight.jpg', tag: 'Critical' },
  { name: 'Grape Black Rot', file: 'grape_black_rot.jpg', tag: 'Fungus' },
  { name: 'Tomato Healthy', file: 'tomato_healthy.jpg', tag: 'Healthy 100%' },
  { name: 'Not a Leaf (Non-crop)', file: 'not_a_leaf_example.jpg', tag: 'Negative test' },
];

export function SingleLeafScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      stopCamera();
    }
  };

  // Start Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setPreviewUrl(null);
      setSelectedFile(null);
      setResult(null);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera device unavailable. Please use image upload instead.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture Snapshot from Camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }
    }, 'image/jpeg', 0.92);
  };

  // Run Inference
  const handleDiagnose = async (overrideFile?: File, overrideName?: string) => {
    const fileToScan = overrideFile || selectedFile;
    if (!fileToScan) return;

    setIsAnalyzing(true);
    try {
      const res = await predictSingleLeaf(fileToScan, overrideName || fileToScan.name);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load sample test
  const handleQuickTest = async (sample: typeof SAMPLE_TESTS[0]) => {
    stopCamera();
    setIsAnalyzing(true);
    setPreviewUrl(null);

    // Create a dummy blob with name for demonstration
    const blob = new Blob([''], { type: 'image/jpeg' });
    const dummyFile = new File([blob], sample.file, { type: 'image/jpeg' });
    setSelectedFile(dummyFile);
    setPreviewUrl(`https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80`);

    try {
      const res = await predictSingleLeaf(dummyFile, sample.file);
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> CNN Inference Ready
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Single Leaf AI Scanner
          </h1>
          <p className="text-sm text-slate-500">
            Upload or snap a photo of any crop leaf to detect disease, estimate severity, and get instant remedies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Camera className="h-4 w-4" /> Live Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition"
            >
              Close Camera
            </button>
          )}
        </div>
      </div>

      {/* Camera Error Alert */}
      {cameraError && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p>{cameraError}</p>
        </div>
      )}

      {/* Main Grid: Upload/Camera (Left) & Diagnosis (Right) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Image Input */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Input Leaf Image</h2>

            {/* Live Camera Feed */}
            {cameraActive && (
              <div className="relative overflow-hidden rounded-xl bg-slate-900 aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 shadow-xl hover:bg-slate-100 active:scale-95 transition"
                  >
                    <Camera className="h-4 w-4 text-emerald-600" /> Snap Photo
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview or Dropzone */}
            {!cameraActive && (
              <div>
                {previewUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Leaf preview"
                      className="h-full w-full object-contain"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-slate-700 shadow backdrop-blur hover:bg-white"
                      title="Change image"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-10 text-center hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition"
                  >
                    <div className="rounded-full bg-emerald-100 p-4 text-emerald-700 mb-3">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload or drag & drop
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Supports JPG, PNG, WEBP (Clear leaf close-up)
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Diagnose Button */}
            {selectedFile && !cameraActive && (
              <button
                onClick={() => handleDiagnose()}
                disabled={isAnalyzing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running CNN Model...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run AI Diagnosis
                  </>
                )}
              </button>
            )}
          </div>

          {/* Quick-Test Demonstrations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Viva & Demo Samples
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SAMPLE_TESTS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleQuickTest(sample)}
                  className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition"
                >
                  <span className="text-xs font-semibold text-slate-800">{sample.name}</span>
                  <span className="mt-1 inline-block rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Results */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Top Status Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Diagnostic Output
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    {result.is_leaf ? result.plant : 'Non-Leaf Object'}
                  </h3>
                  {result.disease && (
                    <p className="text-sm font-semibold text-rose-600 mt-0.5">
                      {result.disease}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  {result.status === 'Healthy' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" /> Healthy Crop
                    </span>
                  )}
                  {result.status === 'Diseased' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                      <AlertTriangle className="h-4 w-4" /> Disease Detected
                    </span>
                  )}
                  {result.status === 'No Leaf' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                      <HelpCircle className="h-4 w-4" /> No Leaf Detected
                    </span>
                  )}
                  <p className="mt-1 text-xs text-slate-400">
                    Confidence: <span className="font-semibold text-slate-700">{result.confidence}%</span>
                  </p>
                </div>
              </div>

              {/* Metrics Row: Severity & Affected Area */}
              {result.is_leaf && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Severity Card */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Flame className="h-4 w-4 text-amber-500" /> Disease Severity
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">
                      {result.severity}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {result.severity === 'High' && 'Immediate treatment required'}
                      {result.severity === 'Medium' && 'Active spread in leaf area'}
                      {result.severity === 'Low' && 'Early stage infection'}
                      {result.severity === 'None' && 'Normal physiological leaf'}
                    </p>
                  </div>

                  {/* Affected Percent Card */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Droplets className="h-4 w-4 text-blue-500" /> Affected Leaf Area
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">
                      {result.affected_percent !== null ? `${result.affected_percent}%` : '0%'}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          result.affected_percent && result.affected_percent > 30
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(result.affected_percent || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Agronomic Remedial Actions
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>

                  {result.organic_option && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-emerald-900">
                      <span className="font-bold text-emerald-800">Organic Solution: </span>
                      {result.organic_option}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center text-slate-400">
              <Layers className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-base font-semibold text-slate-600">Awaiting Leaf Capture</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                Snap or upload an image on the left to trigger real-time CNN feature extraction and disease diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
