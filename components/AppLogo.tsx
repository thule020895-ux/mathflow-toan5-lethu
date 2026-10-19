import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'light' | 'dark';
  className?: string;
  animate?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  textColor = 'light',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: { px: 'w-9 h-9' },
    md: { px: 'w-11 h-11' },
    lg: { px: 'w-14 h-14' },
    xl: { px: 'w-18 h-18' },
  };

  const { px } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Impressive MathFlow Emblem Badge */}
      <div 
        className={`relative ${px} shrink-0 group cursor-pointer`}
        title="MathFlow - TOÁN 5: Học chủ động – Vững tư duy"
      >
        {/* Ambient Glow behind the logo: Emerald & Golden Glow */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-400 rounded-2xl blur-[6px] opacity-75 group-hover:opacity-100 transition duration-500 group-hover:blur-[8px]"></div>

        {/* Main Logo Canvas */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-md transform transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Green / Emerald Gradient */}
            <linearGradient id="mathflowBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />      {/* Emerald 600 */}
              <stop offset="50%" stopColor="#10B981" />     {/* Emerald 500 */}
              <stop offset="100%" stopColor="#047857" />    {/* Emerald 700 */}
            </linearGradient>

            {/* Radiant Flow Line Gradient */}
            <linearGradient id="flowGrad" x1="10" y1="80" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />      {/* Amber 500 */}
              <stop offset="50%" stopColor="#FDE047" />     {/* Yellow 300 */}
              <stop offset="100%" stopColor="#FFFFFF" />    {/* Pure White */}
            </linearGradient>

            {/* Gold Compass Gradient */}
            <linearGradient id="goldCompass" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Pure Clean White Badge Rim */}
            <filter id="badgeGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Rounded Squircle Shield Base in Rich Emerald Green */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="url(#mathflowBg)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            filter="url(#badgeGlow)"
          />

          {/* Inner Math Grid Lines in Badge */}
          <path
            d="M 24 15 L 24 85 M 37 15 L 37 85 M 50 15 L 50 85 M 63 15 L 63 85 M 76 15 L 76 85"
            stroke="white"
            strokeWidth="0.8"
            strokeOpacity="0.18"
          />
          <path
            d="M 15 25 L 85 25 M 15 40 L 85 40 M 15 55 L 85 55 M 15 70 L 85 70 M 15 85 L 85 85"
            stroke="white"
            strokeWidth="0.8"
            strokeOpacity="0.18"
          />

          {/* Dynamic Flowing Math Infinity Wave ("Flow") */}
          <path
            d="M 18 64 C 28 32, 45 32, 50 50 C 55 68, 72 68, 82 36"
            stroke="url(#flowGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            className={animate ? 'animate-pulse' : ''}
          />

          {/* Open Knowledge Book / Base Plate */}
          <path
            d="M 50 72 C 38 66, 26 68, 20 73 L 20 52 C 26 48, 38 47, 50 52 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1"
          />
          <path
            d="M 50 72 C 62 66, 74 68, 80 73 L 80 52 C 74 48, 62 47, 50 52 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <path
            d="M 50 52 L 50 73"
            stroke="#059669"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Precision Golden Geometric Compass (Com-pa) */}
          {/* Top Knob */}
          <rect x="48" y="14" width="4" height="6" rx="2" fill="url(#goldCompass)" />
          {/* Hinge */}
          <circle cx="50" cy="22" r="4.5" fill="url(#goldCompass)" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="50" cy="22" r="1.5" fill="#78350F" />
          {/* Left Leg */}
          <path
            d="M 48 24 L 33 54"
            stroke="url(#goldCompass)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <polygon points="33,54 31,58 35,56" fill="#FFFFFF" />
          {/* Right Leg */}
          <path
            d="M 52 24 L 67 54"
            stroke="url(#goldCompass)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <polygon points="67,54 69,58 65,56" fill="#F43F5E" />

          {/* Floating Math Symbols */}
          <text x="18" y="32" fill="#FEF08A" fontSize="12" fontWeight="bold" fontFamily="sans-serif">+</text>
          <text x="75" y="32" fill="#FEF08A" fontSize="12" fontWeight="bold" fontFamily="sans-serif">×</text>
          <text x="21" y="84" fill="#A7F3D0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">π</text>
          <text x="73" y="84" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="sans-serif">=</text>

          {/* Radiant 4-Point Knowledge Star */}
          <g className={animate ? 'animate-bounce' : ''}>
            <polygon
              points="50,6 52,11 57,12 53,15 54,20 50,17 46,20 47,15 43,12 48,11"
              fill="url(#goldCompass)"
              stroke="#FFF"
              strokeWidth="0.6"
            />
          </g>

          {/* Gloss overlay */}
          <path
            d="M 12 12 Q 50 20 88 12 Q 80 34 50 36 Q 20 34 12 12 Z"
            fill="white"
            fillOpacity="0.18"
          />
        </svg>

        {/* Small floating badge dot */}
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping"></span>
        </div>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span 
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                textColor === 'light' ? 'text-white' : 'text-slate-800'
              } drop-shadow-sm flex items-center`}
            >
              Math<span className="text-amber-300">Flow</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase bg-white text-emerald-800 px-2.5 py-0.5 rounded-full shadow-sm border border-emerald-200">
              TOÁN 5
            </span>
          </div>
          <span 
            className={`text-[10px] sm:text-[11px] font-extrabold tracking-wider ${
              textColor === 'light' ? 'text-emerald-100' : 'text-emerald-700'
            } opacity-95`}
          >
            Học chủ động – Vững tư duy.
          </span>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
