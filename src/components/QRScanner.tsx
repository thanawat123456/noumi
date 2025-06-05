import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Camera, RotateCcw, QrCode } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// QR Code mapping - เชื่อมโยงระหว่าง QR result กับไฟล์วิดีโอ
const QR_VIDEO_MAPPING: Record<string, string> = {
  'https://youtube.com/shorts/ZMpKFq5615Q?feature=share': '/video/ตำนานผีเปรต.mp4',
  'https://youtube.com/shorts/R98_ljX3Dx8?feature=share': '/video/ต้นโพธิ์.mp4',
  'https://youtube.com/shorts/bfN6rJh4KQ8?feature=share': '/video/พระพุทธตรีโลกเชฏฐ์.mp4',
  'https://youtube.com/shorts/PIlO_HW2U7Y?feature=share': '/video/พระพุทธเสรฏฐมุนี.mp4',
  'https://www.youtube.com/shorts/ZMpKFq5615Q': '/video/ตำนานผีเปรต.mp4',
  'https://www.youtube.com/shorts/R98_ljX3Dx8': '/video/ต้นโพธิ์.mp4',
  'https://www.youtube.com/shorts/bfN6rJh4KQ8': '/video/พระพุทธตรีโลกเชฏฐ์.mp4',
  'https://www.youtube.com/shorts/PIlO_HW2U7Y': '/video/พระพุทธเสรฏฐมุนี.mp4',
};

// Declare ZXing globally
declare global {
  interface Window {
    ZXing: any;
  }
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [detectedVideoPath, setDetectedVideoPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeReaderRef = useRef<any>(null);

  // Load ZXing library
  const loadZXing = useCallback(async () => {
    try {
      if (!window.ZXing) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@zxing/library@0.18.6/umd/index.min.js';
        script.async = true;

        return new Promise<void>((resolve, reject) => {
          script.onload = () => {
            console.log('ZXing loaded successfully');
            setDebugInfo('ZXing library loaded');
            resolve();
          };
          script.onerror = () => {
            console.error('Failed to load ZXing');
            setDebugInfo('Failed to load ZXing library');
            reject(new Error('Failed to load ZXing library'));
          };
          document.head.appendChild(script);
        });
      } else {
        setDebugInfo('ZXing already loaded');
      }
    } catch (err) {
      console.error('Failed to load ZXing:', err);
      setDebugInfo(`Failed to load ZXing library: ${err}`);
    }
  }, []);

  // Scan QR code using canvas
  const scanWithCanvas = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning || scanResult) {
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        setDebugInfo(`Canvas: ${canvas.width}x${canvas.height}, Video: ${video.videoWidth}x${video.videoHeight}`);

        if (window.ZXing && !codeReaderRef.current) {
          try {
            const { BrowserQRCodeReader } = window.ZXing;
            codeReaderRef.current = new BrowserQRCodeReader();
            setDebugInfo('ZXing BrowserQRCodeReader initialized');
          } catch (err) {
            console.error('ZXing initialization error:', err);
            setDebugInfo(`ZXing init error: ${err}`);
          }
        }

        if (codeReaderRef.current) {
          try {
            const imageDataUrl = canvas.toDataURL('image/png');
            codeReaderRef.current
              .decodeFromImage(undefined, imageDataUrl)
              .then((result: any) => {
                if (result && result.text) {
                  console.log('QR Code detected with ZXing:', result.text);
                  setDebugInfo(`Detected: ${result.text.substring(0, 50)}...`);
                  handleQRDetected(result.text);
                }
              })
              .catch((err: any) => {
                setDebugInfo('Scanning... (no QR found)');
              });
          } catch (err) {
            setDebugInfo(`ZXing decode error: ${err}`);
          }
        } else {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const hasQRPattern = detectQRPattern(imageData);
          if (hasQRPattern) {
            setDebugInfo('QR pattern detected but cannot decode without library');
          } else {
            setDebugInfo('Scanning for QR pattern...');
          }
        }
      }
    } catch (err) {
      console.error('Canvas scanning error:', err);
      setDebugInfo(`Canvas error: ${err}`);
    }
  }, [isScanning, scanResult]);

  // Detect QR pattern (fallback)
  const detectQRPattern = (imageData: ImageData): boolean => {
    const data = imageData.data;
    let blackPixels = 0;
    let whitePixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;

      if (brightness < 128) {
        blackPixels++;
      } else {
        whitePixels++;
      }
    }

    const totalPixels = blackPixels + whitePixels;
    const blackRatio = blackPixels / totalPixels;

    return blackRatio > 0.3 && blackRatio < 0.7;
  };

  // Handle QR code detection
  const handleQRDetected = useCallback(
    (qrResult: string) => {
      console.log('QR Code detected:', qrResult);

      let videoPath = QR_VIDEO_MAPPING[qrResult];

      if (!videoPath) {
        const keys = Object.keys(QR_VIDEO_MAPPING);
        const foundKey = keys.find(
          (key) =>
            qrResult.includes(key) ||
            key.includes(qrResult) ||
            ((qrResult.includes('youtube.com') || qrResult.includes('youtu.be')) &&
              (key.includes('youtube.com') || key.includes('youtu.be')))
        );

        if (foundKey) {
          videoPath = QR_VIDEO_MAPPING[foundKey];
        }
      }

      if (videoPath) {
        console.log('Valid QR detected:', qrResult, '→ Video:', videoPath);
        setScanResult(qrResult);
        setDetectedVideoPath(videoPath);
        setIsScanning(false);
        setDebugInfo(`Success! Playing: ${videoPath}`);

        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }

        setTimeout(() => {
          if (overlayVideoRef.current) {
            overlayVideoRef.current.src = videoPath;
            overlayVideoRef.current.play().catch(console.error);
          }
        }, 500);
      } else {
        console.log('Unrecognized QR Code:', qrResult);
        setError('ไม่พบวิดีโอ');
        setDebugInfo(`Unknown QR: ${qrResult.substring(0, 30)}...`);

        setTimeout(() => {
          setError(null);
          setDebugInfo('Resuming scan...');
        }, 3000);
      }
    },
    []
  );

  // Reset scanner
  const resetScanner = useCallback(() => {
    console.log('Resetting scanner...');
    setIsScanning(true);
    setScanResult(null);
    setDetectedVideoPath(null);
    setError(null);
    setDebugInfo('Resetting...');

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    codeReaderRef.current = null;
  }, []);

  // Start scanning
  const startScanning = useCallback(() => {
    console.log('Starting QR scan...');
    setDebugInfo('Starting scan...');

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(scanWithCanvas, 500);
  }, [scanWithCanvas]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setDebugInfo('Scanning stopped');
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setDebugInfo('Starting camera...');

      await loadZXing();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 15 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setDebugInfo('Camera stream acquired');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          setDebugInfo('Video metadata loaded');
          videoRef.current?.play().then(() => {
            setDebugInfo('Video playing, starting scan in 2s...');
            setTimeout(startScanning, 2000);
          });
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง');
      setDebugInfo(`Camera error: ${err}`);
    }
  }, [facingMode, startScanning, loadZXing]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopScanning();
    setDebugInfo('Camera stopped');
  }, [stopScanning]);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    resetScanner();
  }, [resetScanner]);

  // Simulate QR detection for testing
  const simulateQR = useCallback(() => {
    const testQR = 'https://youtube.com/shorts/ZMpKFq5615Q?feature=share';
    handleQRDetected(testQR);
  }, [handleQRDetected]);

  // Effect for camera management
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      resetScanner();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera, resetScanner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between p-4 pt-12">
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="text-center flex-1 mx-4">
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <p className="text-white/90 text-sm">
              {isScanning ? 'สแกน QR Code เพื่อดูเรื่องเล่า' : 'กำลังเล่นวิดีโอ AR'}
            </p>
          </div>

          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

 
      {/* Camera View */}
      <div className="relative w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Canvas for processing */}
        <canvas
          ref={canvasRef}
          className="absolute top-32 left-4 w-32 h-24 border border-white/50 bg-black/20"
          style={{ display: 'block' }}
        />

        {/* QR Scanner Overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-72 h-72 relative">
                <div className="w-full h-full border-2 border-white/30 rounded-3xl bg-black/10"></div>

                {/* Animated corners */}
                <div className="absolute top-2 left-2 w-12 h-12">
                  <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                  <div className="w-1 h-full bg-orange-500 rounded-full"></div>
                </div>
                <div className="absolute top-2 right-2 w-12 h-12 rotate-90">
                  <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                  <div className="w-1 h-full bg-orange-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-2 left-2 w-12 h-12 -rotate-90">
                  <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                  <div className="w-1 h-full bg-orange-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-2 right-2 w-12 h-12 rotate-180">
                  <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                  <div className="w-1 h-full bg-orange-500 rounded-full"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-white/60" />
                </div>

                {/* Scanning animation */}
                <div className="absolute inset-4 overflow-hidden rounded-2xl">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
                </div>
              </div>

              <div className="text-center mt-6 bg-black/40 backdrop-blur-sm rounded-2xl p-4 max-w-sm">
                <p className="text-white text-lg font-medium mb-2">
                  วางกล้องให้ QR Code อยู่ในกรอบ
                </p>
        
              </div>
            </div>
          </div>
        )}

        {/* Video Overlay */}
        {detectedVideoPath && (
          <div className="absolute top-24 left-4 right-4 bottom-24">
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-4 h-full border border-white/20">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <video
                  ref={overlayVideoRef}
                  controls
                  className="w-full h-full object-contain"
                  onEnded={resetScanner}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setError('ไม่สามารถเล่นวิดีโอได้');
                    resetScanner();
                  }}
                />

                <div className="absolute top-4 right-4">
                  <button
                    onClick={resetScanner}
                    className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20"
                  >
                    สแกนใหม่
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute bottom-8 left-4 right-4">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-2xl p-4 border border-red-400/50">
              <div className="text-center">
                <p className="text-white font-semibold">⚠️ {error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-white/80 text-sm underline"
                >
                  ปิดข้อความ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {scanResult && !error && (
          <div className="absolute bottom-8 left-4 right-4">
            <div className="bg-green-500/90 backdrop-blur-sm rounded-2xl p-4 border border-green-400/50">
              <div className="text-center">
                <p className="text-white font-semibold">✅ พบ QR Code แล้ว!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;