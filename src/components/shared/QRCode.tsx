
import React, { useEffect, useRef } from 'react';
// Using default import for compatibility
import QRCodeStyling from 'qr-code-styling';

interface QRCodeProps {
  value: string;
  size?: number;
  logoUrl?: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  value, 
  size = 200,
  logoUrl
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      data: value,
      dotsOptions: {
        color: '#3b82f6',
        type: 'rounded'
      },
      cornersSquareOptions: {
        type: 'extra-rounded'
      },
      backgroundOptions: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      },
      ...(logoUrl ? { image: logoUrl } : {})
    });
    
    ref.current.innerHTML = '';
    qrCode.append(ref.current);
  }, [value, size, logoUrl]);

  return (
    <div className="bg-white p-3 rounded-2xl shadow-md">
      <div ref={ref} />
    </div>
  );
};

export default QRCodeComponent;
