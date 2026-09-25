import React, { useState } from 'react';
import { QrCode, Smartphone } from 'lucide-react';

interface QRCodeDisplayProps {
  method: 'esewa' | 'khalti' | 'ime_pay' | 'bank_qr' | string;
  accountName: string;
  accountNumber: string;
  qrCodeUrl?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  method,
  accountName,
  accountNumber,
  qrCodeUrl
}) => {
  const [imageError, setImageError] = useState(false);

  // If external QR image failed or not provided, render a sharp SVG merchant QR
  if (imageError || !qrCodeUrl) {
    const isEsewa = method === 'esewa';
    const isKhalti = method === 'khalti';
    const isIme = method === 'ime_pay';
    const isBank = method === 'bank_qr';

    const brandColor = isEsewa ? '#60BB46' : isKhalti ? '#5C2D91' : isIme ? '#ED1C24' : '#0B5394';
    const brandName = isEsewa ? 'eSewa Pay' : isKhalti ? 'Khalti' : isIme ? 'IME Pay' : 'Fonepay QR';

    return (
      <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-xs text-center select-none w-44">
        <div 
          className="w-full text-white text-[11px] font-black py-1 px-2 rounded-t mb-2 flex items-center justify-center gap-1 uppercase tracking-wider"
          style={{ backgroundColor: brandColor }}
        >
          <Smartphone className="w-3 h-3" />
          <span>{brandName}</span>
        </div>

        {/* Dynamic Stylized QR Matrix Pattern */}
        <div className="w-36 h-36 border-2 border-gray-900 p-2 bg-white flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-4 border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-900" />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <div className="w-4 h-1.5 bg-gray-800" />
              <div className="w-6 h-1.5 bg-gray-800" />
              <div className="w-3 h-1.5 bg-gray-800" />
            </div>
            <div className="w-8 h-8 border-4 border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-900" />
            </div>
          </div>

          <div className="my-auto py-1 flex items-center justify-center">
            <div 
              className="text-[9px] font-black px-1.5 py-0.5 rounded text-white shadow-2xs"
              style={{ backgroundColor: brandColor }}
            >
              {accountNumber}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="w-8 h-8 border-4 border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-6 h-1.5 bg-gray-800" />
              <div className="w-4 h-1.5 bg-gray-800" />
              <div className="w-5 h-1.5 bg-gray-800" />
            </div>
            <div className="w-7 h-7 border-2 border-dashed border-gray-700 flex items-center justify-center text-[8px] font-mono font-bold">
              NP
            </div>
          </div>
        </div>

        <span className="text-[10px] text-gray-500 font-semibold mt-2 font-mono">
          {accountNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white rounded-xl border border-gray-300 shadow-md text-center max-w-[200px]">
      <img
        src={qrCodeUrl}
        alt={`${method} QR`}
        className="w-40 h-40 object-contain mx-auto rounded"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
      />
      <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">
        Scan from mobile banking or wallet
      </span>
    </div>
  );
};
