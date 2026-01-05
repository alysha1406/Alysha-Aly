
import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div className="flex items-center group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-black flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/50">
        <div className="relative animate-spin-360 group-hover:animate-spin-fast">
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Splashes */}
            <path d="M10 20C20 5 45 10 50 30C55 50 35 60 20 55C5 50 0 35 10 20Z" fill="#1D4ED8" fillOpacity="0.8" />
            <circle cx="15" cy="15" r="5" fill="#1D4ED8" />
            
            <path d="M50 45C70 40 95 55 90 80C85 100 60 105 45 85C30 65 35 55 50 45Z" fill="#FF4B1F" />
            <circle cx="85" cy="90" r="6" fill="#FF4B1F" />

            {/* The Football (Soccer Ball) */}
            <g>
              <circle cx="50" cy="50" r="32" fill="white" />
              <path d="M50 36L38 45V60L50 69L62 60V45L50 36Z" fill="black" />
              <path d="M50 36V18M62 45L78 40M62 60L78 70M50 69V82M38 60L22 70M38 45L22 40" stroke="black" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 18L35 22L40 30H60L65 22L50 18Z" fill="black" />
              <path d="M78 40L82 55L75 65L68 55L78 40Z" fill="black" />
              <path d="M78 70L65 82H50H35L22 70L30 60L50 69L70 60L78 70Z" fill="black" />
              <path d="M22 40L18 55L25 65L32 55L22 40Z" fill="black" />
              <circle cx="30" cy="35" r="4" fill="#1D4ED8" fillOpacity="0.6" />
              <circle cx="70" cy="65" r="5" fill="#FF4B1F" fillOpacity="0.6" />
            </g>
          </svg>
        </div>
      </div>
      <div className="ml-4 flex flex-col">
        <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors uppercase leading-none">
          FOOTBALL NOVA
        </span>
      </div>
      <style>{`
        @keyframes spin-360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-360 {
          animation: spin-360 15s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-360 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;
