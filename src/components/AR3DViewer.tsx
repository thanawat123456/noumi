import React, { useEffect, useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const AR3DViewer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrDetected, setQrDetected] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [cameraLabel, setCameraLabel] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.async = true;
    script.onload = () => console.log('Model Viewer script loaded');
    script.onerror = () => setError('ไม่สามารถโหลดสคริปต์ Model Viewer ได้');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startScanner = async () => {
    try {
      stopCamera();

      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError('กรุณาเข้าใช้งานผ่าน HTTPS เพื่อใช้งานกล้อง');
        setIsLoading(false);
        return;
      }

      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      initialStream.getTracks().forEach(track => track.stop());

      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        setError('ไม่พบกล้องในอุปกรณ์นี้ กรุณาตรวจสอบการตั้งค่ากล้อง');
        setIsLoading(false);
        return;
      }

      console.log('Available cameras:', videoInputDevices);

      const selectedDevice = videoInputDevices.find(device => {
        const label = device.label.toLowerCase();
        return (
          label.includes('back') ||
          label.includes('environment') ||
          label.includes('rear') ||
          label.includes('main') ||
          label.includes('camera 0') ||
          label.includes('กล้องหลัง')
        );
      }) || videoInputDevices[1];

      setCameraLabel(selectedDevice.label || 'กล้องเริ่มต้น');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedDevice.deviceId },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            resolve();
          };
        });

        console.log('Video dimensions:', videoRef.current.videoWidth, videoRef.current.videoHeight);
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          setError('ไม่สามารถรับขนาดวิดีโอได้ กรุณาลองใหม่');
          setIsLoading(false);
          stopCamera();
          return;
        }

        await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              console.log('QR Code detected:', result.getText());
              handleQRCodeDetected(result.getText());
            }
            if (err && !(err.name === 'NotFoundException' || err.message?.includes(''))) {
              console.error('Scan error:', err);
              setError('เกิดข้อผิดพลาดในการสแกน: ' + err.message);
            }
          }
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error starting scanner:', err);
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('กรุณาอนุญาตการเข้าถึงกล้องในการตั้งค่า Browser');
      } else if (err instanceof Error && err.name === 'NotFoundError') {
        setError('ไม่พบกล้องในอุปกรณ์นี้ กรุณาตรวจสอบการตั้งค่ากล้อง');
      } else {
        setError('ไม่สามารถเริ่มการสแกนได้: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopCamera();
    };
  }, []);

  const handleQRCodeDetected = async (data: string) => {
    setQrDetected(true);
    console.log('Processing QR Code:', data);

    const modelMapping: { [key: string]: string } = {
      model1: '/images/glb/พระกริ่งใหญ่.glb',
      model2: '/images/glb/test.glb',
      model3: '/images/glb/model3.glb',
    };

    // URL mapping สำหรับ redirect URL ไปยังคีย์ใน modelMapping
    const urlMapping: { [key: string]: string } = {
      'https://cdn.jsdelivr.net/Duck/glTF-Binary/Duck.glb': 'model1',
      // 'https://example.com/model2.glb': 'model2',
      // 'https://example.com/model3.glb': 'model3',
    };

    let modelKey = '';

    // ตรวจสอบว่า data เป็น URL หรือไม่
    try {
      const trimmedData = data.trim();
      if (trimmedData.startsWith('http://') || trimmedData.startsWith('https://')) {
        // ถ้าเป็น URL ตรวจสอบใน urlMapping
        modelKey = urlMapping[trimmedData] || '';
        if (!modelKey) {
          setError('URL จาก QR Code ไม่ได้รับการสนับสนุน');
          setQrDetected(false);
          setIsLoading(true);
          startScanner();
          return;
        }
        console.log(`Redirecting URL ${trimmedData} to model key: ${modelKey}`);
      } else {
        // ถ้าไม่ใช่ URL ใช้เป็นคีย์ปกติ
        modelKey = trimmedData;
      }
    } catch (err) {
      console.error('Error parsing QR code data:', err);
      setError('ข้อมูล QR Code ไม่ถูกต้อง');
      setQrDetected(false);
      setIsLoading(true);
      startScanner();
      return;
    }

    const model = modelMapping[modelKey];
    if (!model) {
      setError('ไม่พบโมเดลสำหรับ QR Code นี้');
      setQrDetected(false);
      setIsLoading(true);
      startScanner();
      return;
    }

    // ตรวจสอบว่าไฟล์โมเดลสามารถโหลดได้
    try {
      console.log('Attempting to fetch model:', model);
      const response = await fetch(model, { method: 'HEAD' });
      console.log('Fetch response:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`ไม่สามารถเข้าถึงไฟล์โมเดล: ${response.status} ${response.statusText}`);
      }
      setModelUrl(model);
    } catch (err) {
      console.error('Model file check error:', err);
      setError(
        'ไม่สามารถโหลดโมเดล 3D ได้: ' + (err instanceof Error ? err.message : 'Unknown error')
      );
      setQrDetected(false);
      setIsLoading(true);
      startScanner();
    }
  };

  const handleClose = () => {
    setQrDetected(false);
    setModelUrl(null);
    setError(null);
    setIsLoading(true);
    setCameraLabel(null);
    startScanner();
  };

  if (qrDetected && !modelUrl && error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ zIndex: 2 }}>
        <div className="bg-red-500 text-white p-4 rounded-lg max-w-sm text-center">
          <p>{error}</p>
          <button
            onClick={handleClose}
            className="mt-4 bg-white text-red-500 px-4 py-2 rounded font-medium"
          >
            สแกนใหม่
          </button>
        </div>
      </div>
    );
  }

  if (qrDetected && modelUrl) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4" style={{ zIndex: 3 }}>
          <div className="max-w-[414px] mx-auto flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">AR Model Viewer</h2>
            <button
              onClick={handleClose}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
            >
              ปิด
            </button>
          </div>
        </div>

        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className="w-full max-w-[414px] h-[600px] relative">
              <model-viewer
                src={modelUrl}
                alt="3D Model"
                camera-controls
                auto-rotate
                shadow-intensity="0"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                }}
                environment-image="neutral"
                camera-orbit="0deg 75deg 105%"
                field-of-view="30deg"
                onError={(e: any) => {
                  console.error('Model viewer error:', e);
                  setError('ไม่สามารถเรนเดอร์โมเดล 3D ได้: ' + (e.message || 'Unknown error'));
                  setQrDetected(false);
                  setIsLoading(true);
                  startScanner();
                }}
                onLoad={() => console.log('Model loaded successfully')}
              >
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 p-3 rounded-lg">
                  <p className="text-white text-sm text-center">
                    ลากเพื่อหมุน • บีบนิ้วเพื่อซูม
                  </p>
                </div>
              </model-viewer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4" style={{ zIndex: 3 }}>
        <div className="max-w-[414px] mx-auto">
          <h2 className="text-white text-xl font-semibold text-center">
            สแกน QR Code
          </h2>
          <p className="text-white text-sm text-center mt-1 opacity-75">
            หันกล้องไปยัง QR Code เพื่อดูโมเดล 3D
          </p>
          {cameraLabel && (
            <p className="text-white text-xs text-center mt-1 opacity-75">
              ใช้กล้อง: {cameraLabel}
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0">
              <div className="h-1 bg-green-500 w-full absolute animate-scan"></div>
            </div>
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">กำลังเปิดกล้อง...</p>
          </div>
        </div>
      )}

      {error && !qrDetected && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 3 }}>
          <div className="bg-red-500 text-white p-4 rounded-lg max-w-sm text-center">
            <p>{error}</p>
            <button
              onClick={handleClose}
              className="mt-4 bg-white text-red-500 px-4 py-2 rounded font-medium"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6" style={{ zIndex: 3 }}>
        <div className="max-w-[414px] mx-auto text-center">
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <p className="text-white text-sm">
              วาง QR Code ไว้ในกรอบสี่เหลี่ยม
            </p>
            <p className="text-white text-xs mt-1 opacity-75">
              ใช้กล้องหลัง • ถือให้นิ่ง • ใช้แสงสว่างเพียงพอ • ระยะ 15-30 ซม. • ตรวจสอบว่า QR Code ชัดเจน
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AR3DViewer;