import React, { useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface MascotCompanionProps {
  message?: string;
  customMessage?: string;
  subMessage?: string;
  isHappy?: boolean;
  mood?: string;
  className?: string;
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  message,
  customMessage,
  subMessage,
  isHappy = false,
  mood,
  className = ""
}) => {
  const effectiveMessage = customMessage || message || "Cùng khám phá hình học nào!";
  const effectiveHappy = isHappy || mood === 'happy';
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const funQuotes = [
    "MathFlow: Học chủ động – Vững tư duy!",
    "Cùng khám phá toán học và hình học nào!",
    "Kéo thả các mảnh để thấy điều kỳ diệu!",
    "Chinh phục các bài toán nâng cao để đạt điểm 10!",
    "Tam giác, hình thang, hình tròn đều có công thức tuyệt vời!"
  ];

  const currentMessage = clickCount > 0 ? funQuotes[clickCount % funQuotes.length] : effectiveMessage;

  return (
    <div 
      className={`flex items-end gap-2 md:gap-3 select-none transition-transform duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setClickCount(prev => prev + 1)}
      title="Bấm vào bạn nhỏ để nhận lời động viên học tập!"
    >
      {/* Speech Bubble */}
      <div className="relative bg-white/95 backdrop-blur-sm border-2 border-sky-300 rounded-2xl px-3.5 py-2 shadow-lg max-w-[200px] md:max-w-[230px] transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-start gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-xs md:text-sm font-bold text-sky-900 leading-snug">
              {currentMessage}
            </p>
            {subMessage && (
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">
                {subMessage}
              </p>
            )}
          </div>
        </div>
        {/* Bubble arrow pointing towards mascot */}
        <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-sky-300 rotate-45"></div>
      </div>

      {/* 2D Cartoon Vietnamese Primary Student Mascot */}
      <div className="relative w-20 h-24 md:w-24 md:h-28 shrink-0 cursor-pointer animate-mascot-float">
        <svg 
          viewBox="0 0 120 140" 
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Soft gradients for hair and clothing */}
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="rulerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#0284c7" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Body / Shirt */}
          <path 
            d="M32 95 L22 135 L98 135 L88 95 Z" 
            fill="url(#shirtGrad)" 
            stroke="#94a3b8" 
            strokeWidth="2" 
          />

          {/* Blue Pants */}
          <path 
            d="M30 133 L30 140 L90 140 L90 133 Z" 
            fill="#0369a1" 
          />

          {/* Red Scarf (Khăn quàng đỏ học sinh Việt Nam) */}
          <path 
            d="M48 88 L60 98 L72 88 L64 114 L60 110 L56 114 Z" 
            fill="#dc2626" 
            stroke="#b91c1c" 
            strokeWidth="1.5"
          />
          <circle cx="60" cy="94" r="3.5" fill="#ef4444" />

          {/* Left Hand holding Geometry Ruler */}
          <g className="animate-mascot-wave">
            {/* Left Arm */}
            <path 
              d="M32 96 C18 100 12 112 18 122 C22 126 28 124 30 118" 
              fill="url(#shirtGrad)" 
              stroke="#94a3b8" 
              strokeWidth="2" 
            />
            {/* Hand */}
            <circle cx="16" cy="120" r="7" fill="url(#skinGrad)" stroke="#f97316" strokeWidth="1" />
            {/* Geometry Triangle Ruler (Thước Ê-ke màu vàng) */}
            <polygon 
              points="4,106 28,124 4,136" 
              fill="url(#rulerGrad)" 
              stroke="#ca8a04" 
              strokeWidth="1.5" 
            />
            <polygon 
              points="9,114 20,123 9,130" 
              fill="#ffffff" 
              stroke="#ca8a04" 
              strokeWidth="1" 
            />
            {/* Ruler markings */}
            <line x1="6" y1="110" x2="9" y2="110" stroke="#ca8a04" strokeWidth="1" />
            <line x1="6" y1="115" x2="11" y2="115" stroke="#ca8a04" strokeWidth="1" />
            <line x1="6" y1="120" x2="9" y2="120" stroke="#ca8a04" strokeWidth="1" />
            <line x1="6" y1="125" x2="11" y2="125" stroke="#ca8a04" strokeWidth="1" />
          </g>

          {/* Right Arm holding Math Book */}
          <g>
            <path 
              d="M88 96 C98 102 106 112 100 122 C96 126 90 124 88 118" 
              fill="url(#shirtGrad)" 
              stroke="#94a3b8" 
              strokeWidth="2" 
            />
            {/* Hand */}
            <circle cx="98" cy="116" r="7" fill="url(#skinGrad)" stroke="#f97316" strokeWidth="1" />
            {/* Blue Math Book */}
            <rect 
              x="92" y="104" width="22" height="26" rx="2" 
              fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" 
            />
            <rect x="94" y="106" width="4" height="22" fill="#38bdf8" />
            <text x="100" y="120" fontSize="8" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">Σ5</text>
          </g>

          {/* Neck */}
          <rect x="52" y="78" width="16" height="12" rx="3" fill="url(#skinGrad)" />

          {/* Head */}
          <circle cx="60" cy="52" r="30" fill="url(#skinGrad)" stroke="#f97316" strokeWidth="1" />

          {/* Ears */}
          <circle cx="30" cy="54" r="6" fill="url(#skinGrad)" stroke="#f97316" strokeWidth="1" />
          <circle cx="90" cy="54" r="6" fill="url(#skinGrad)" stroke="#f97316" strokeWidth="1" />

          {/* Hair */}
          <path 
            d="M30 46 C30 20 50 14 60 14 C70 14 90 20 90 46 C90 48 86 42 82 42 C74 42 70 48 64 42 C56 42 50 48 42 42 C38 42 30 48 30 46 Z" 
            fill="url(#hairGrad)" 
          />
          {/* Cute tuft of hair */}
          <path d="M58 14 C58 8 64 6 66 10 C68 14 62 16 58 14 Z" fill="url(#hairGrad)" />

          {/* Cheerful Eyes */}
          {isHappy ? (
            /* Curved happy eyes */
            <>
              <path d="M44 52 Q50 45 54 52" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 52 Q72 45 76 52" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            /* Big sparkling round eyes */
            <>
              <circle cx="48" cy="50" r="5" fill="#0f172a" />
              <circle cx="50" cy="48" r="1.8" fill="#ffffff" />
              <circle cx="72" cy="50" r="5" fill="#0f172a" />
              <circle cx="74" cy="48" r="1.8" fill="#ffffff" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M43 42 Q48 39 53 43" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M67 43 Q72 39 77 42" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <circle cx="40" cy="58" r="5" fill="#f43f5e" opacity="0.35" />
          <circle cx="80" cy="58" r="5" fill="#f43f5e" opacity="0.35" />

          {/* Smile */}
          <path 
            d={isHappy ? "M48 62 Q60 76 72 62 Z" : "M50 63 Q60 72 70 63"} 
            fill={isHappy ? "#dc2626" : "none"} 
            stroke="#0f172a" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
          {isHappy && (
            <path d="M53 66 Q60 72 67 66" fill="#fca5a5" />
          )}
        </svg>
      </div>
    </div>
  );
};

export default MascotCompanion;
