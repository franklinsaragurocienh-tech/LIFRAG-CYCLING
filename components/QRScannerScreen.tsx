import React, { useState, useRef, useEffect } from 'react';
import { BackIcon } from './Icons';

// jsQR is loaded from a script tag in index.html, so we need to declare it for TypeScript
declare const jsQR: (data: Uint8ClampedArray, width: number, height: number, options?: object) => { data: string } | null;

interface QRScannerScreenProps {
  onBack: () => void;
}

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isScanning) {
      stopCamera();
      return;
    }

    const startScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setErrorMsg("No se pudo acceder a la cámara. Revisa los permisos.");
        setIsScanning(false);
      }
    };

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          setScanResult(code.data);
          setIsScanning(false);
          stopCamera();
          return; // Stop the loop
        }
      }
      if (isScanning && streamRef.current) {
        requestAnimationFrame(tick);
      }
    };

    startScan();

    // Cleanup function
    return () => {
      stopCamera();
    };
  }, [isScanning]);

  const handleScanAgain = () => {
    setScanResult(null);
    setErrorMsg(null);
    setIsScanning(true);
  };

  return (
    <div className="p-6 animate-fadeIn h-full flex flex-col bg-brand-dark">
      <header className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
          <BackIcon className="w-6 h-6 text-brand-text" />
        </button>
        <h1 className="text-2xl font-bold text-center w-full">Escanear Código QR</h1>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center relative">
         <canvas ref={canvasRef} style={{ display: 'none' }} />

         {isScanning && (
             <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden bg-brand-gray">
                 <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                 <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-3/4 h-3/4 border-4 border-dashed border-brand-primary/50 rounded-lg"/>
                 </div>
                 <div className="absolute top-4 left-4 text-xs bg-black/50 text-white px-2 py-1 rounded">Buscando código QR...</div>
             </div>
         )}

         {errorMsg && (
             <div className="text-center p-4 bg-red-500/20 text-red-300 rounded-lg w-full max-w-sm">
                 <p>{errorMsg}</p>
             </div>
         )}
         
         {scanResult && (
             <div className="text-center p-6 bg-brand-gray rounded-xl w-full max-w-sm animate-fadeIn">
                 <h2 className="text-lg font-bold text-brand-primary mb-2">Escaneo Exitoso</h2>
                 <p className="text-brand-text-secondary bg-brand-dark p-3 rounded-md break-all">{scanResult}</p>
             </div>
         )}

         <div className="mt-8 w-full max-w-sm">
             {!isScanning && (
                 <div className="flex flex-col gap-3">
                     <button onClick={handleScanAgain} className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-full text-lg hover:opacity-90 transition-opacity">
                         Escanear de Nuevo
                     </button>
                     <button onClick={onBack} className="w-full bg-brand-gray text-brand-text font-semibold py-3 rounded-full text-lg hover:bg-opacity-80 transition-opacity">
                         Volver al Panel
                     </button>
                 </div>
             )}
         </div>

      </div>
    </div>
  );
};

export default QRScannerScreen;