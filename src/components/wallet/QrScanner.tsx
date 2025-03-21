
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import QrScannerLib from 'qr-scanner/qr-scanner.min.js';

interface QrScannerProps {
  onScan: (data: string) => void;
}

const QrScanner = ({ onScan }: QrScannerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support camera access');
        }
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setLoading(false);
            setScanning(true);
          };
        }
      } catch (err: any) {
        setLoading(false);
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera access to scan QR codes.');
        } else {
          setError(err.message || 'Failed to access camera');
        }
        console.error('Error accessing camera:', err);
      }
    };
    
    startCamera();
    
    // Clean up function to stop the camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setScanning(false);
    };
  }, []);
  
  useEffect(() => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;
    
    const detectQRCode = async () => {
      try {
        // Import the QR code reader library dynamically
        const { default: QrScannerModule } = await import('qr-scanner');
        
        const checkForQR = async () => {
          if (!videoRef.current || !scanning) return;
          
          try {
            const result = await QrScannerModule.scanImage(videoRef.current);
            if (result) {
              // Play a success sound
              const audio = new Audio('/beep.mp3');
              audio.play().catch(e => console.log('Audio play failed', e));
              
              // Vibrate if supported
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }
              
              // Call the onScan callback with the result
              onScan(result);
              setScanning(false);
            }
          } catch (err) {
            // No QR code found, continue scanning
          }
          
          if (scanning) {
            // Schedule the next scan
            requestAnimationFrame(checkForQR);
          }
        };
        
        checkForQR();
      } catch (err) {
        console.error('Error loading QR scanner:', err);
        setError('Failed to load QR scanner');
        setScanning(false);
      }
    };
    
    detectQRCode();
  }, [scanning, onScan]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
        <p className="text-center mb-2">{error}</p>
        <button 
          className="text-sm underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Accessing camera...</span>
        </div>
      )}
      
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '300px', height: '300px' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full" 
          style={{ display: 'none' }}
        />
        
        {/* QR code scanner overlay */}
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg"></div>
        <div className="absolute inset-16 border-2 border-white/70 rounded-md"></div>
        
        {/* Scan line animation */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-scan"></div>
      </div>
      
      <p className="text-center mt-2 text-sm text-muted-foreground">
        Position the QR code within the frame
      </p>
    </div>
  );
};

export default QrScanner;
