import React from 'react';

export type ArenaDiagramSpec =
  | {
      kind: 'triangle';
      baseLabel: string;
      heightLabel: string;
      extraBadge?: string;
    }
  | {
      kind: 'trapezoid';
      topBaseLabel: string;
      bottomBaseLabel: string;
      heightLabel: string;
      extraBadge?: string;
    }
  | {
      kind: 'circle';
      mode: 'radius' | 'diameter';
      measureLabel: string;
      extraBadge?: string;
    }
  | {
      kind: 'box3d';
      lengthLabel: string;
      widthLabel: string;
      heightLabel: string;
      extraBadge?: string;
    }
  | {
      kind: 'cube3d';
      edgeLabel: string;
      extraBadge?: string;
    }
  | {
      kind: 'motion';
      pointA: string;
      pointB: string;
      topLabel: string;
      bottomLabel: string;
      opposite?: boolean;
      secondTopLabel?: string;
    }
  | {
      kind: 'segments';
      label1: string;
      parts1: number;
      label2: string;
      parts2: number;
      footer: string;
    }
  | {
      kind: 'badge_visual';
      title: string;
      subtitle: string;
      accent: 'teal' | 'sky' | 'rose' | 'amber' | 'violet';
    };

/** Chuyển chuỗi có chứa cm², dm², m², km², cm³, dm³, m³ sang SVG text có tspan chỉ số trên */
const renderSvgLabelWithSup = (text: string) => {
  const parts = text.split(/(cm²|dm²|m²|km²|cm³|dm³|m³)/g);
  return parts.map((part, idx) => {
    if (part.endsWith('²')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <tspan baselineShift="super" fontSize="72%">2</tspan>
        </React.Fragment>
      );
    }
    if (part.endsWith('³')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <tspan baselineShift="super" fontSize="72%">3</tspan>
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

/** Render chuỗi HTML với thẻ <sup> chuẩn cho chỉ số trên của diện tích/thể tích */
export const renderMathUnitText = (text: string): React.ReactNode => {
  const parts = text.split(/(cm²|dm²|m²|km²|cm³|dm³|m³)/g);
  return parts.map((part, idx) => {
    if (part.endsWith('²')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <sup>2</sup>
        </React.Fragment>
      );
    }
    if (part.endsWith('³')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <sup>3</sup>
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

export const ArenaIllustration: React.FC<{ spec: ArenaDiagramSpec }> = ({ spec }) => {
  return (
    <div className="bg-slate-50/90 border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center w-full">
      {spec.kind === 'triangle' && (
        <div className="flex flex-col items-center w-full">
          {spec.extraBadge && (
            <span className="mb-1.5 px-3 py-1 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 text-xs font-extrabold">
              {renderMathUnitText(spec.extraBadge)}
            </span>
          )}
          <svg viewBox="0 0 260 148" className="w-full max-w-[260px] h-36">
            <polygon
              points="34,116 226,116 144,24"
              fill="#dbeafe"
              fillOpacity="0.8"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Đường cao nét đứt */}
            <line
              x1="144"
              y1="24"
              x2="144"
              y2="116"
              stroke="#dc2626"
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />
            {/* Ký hiệu góc vuông */}
            <polyline
              points="144,104 156,104 156,116"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.8"
            />
            {/* Nhãn chiều cao */}
            <text
              x="152"
              y="72"
              fontSize="11"
              fontWeight="800"
              fill={spec.heightLabel.includes('?') ? '#b91c1c' : '#dc2626'}
            >
              {renderSvgLabelWithSup(spec.heightLabel)}
            </text>
            {/* Nhãn đáy */}
            <text
              x="130"
              y="136"
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="900"
              fill={spec.baseLabel.includes('?') ? '#b91c1c' : '#1e3a8a'}
            >
              {renderSvgLabelWithSup(spec.baseLabel)}
            </text>
          </svg>
        </div>
      )}

      {spec.kind === 'trapezoid' && (
        <div className="flex flex-col items-center w-full">
          {spec.extraBadge && (
            <span className="mb-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 text-xs font-extrabold">
              {renderMathUnitText(spec.extraBadge)}
            </span>
          )}
          <svg viewBox="0 0 270 152" className="w-full max-w-[270px] h-36">
            <polygon
              points="74,34 186,34 228,116 34,116"
              fill="#f3e8ff"
              fillOpacity="0.85"
              stroke="#7c3aed"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Đường cao nét đứt */}
            <line
              x1="92"
              y1="34"
              x2="92"
              y2="116"
              stroke="#dc2626"
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />
            {/* Ký hiệu góc vuông */}
            <polyline
              points="92,104 104,104 104,116"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.8"
            />
            {/* Đáy bé */}
            <text
              x="130"
              y="22"
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill={spec.topBaseLabel.includes('?') ? '#b91c1c' : '#581c87'}
            >
              {renderSvgLabelWithSup(spec.topBaseLabel)}
            </text>
            {/* Chiều cao */}
            <text
              x="100"
              y="78"
              fontSize="11"
              fontWeight="800"
              fill={spec.heightLabel.includes('?') ? '#b91c1c' : '#dc2626'}
            >
              {renderSvgLabelWithSup(spec.heightLabel)}
            </text>
            {/* Đáy lớn */}
            <text
              x="131"
              y="138"
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="900"
              fill={spec.bottomBaseLabel.includes('?') ? '#b91c1c' : '#581c87'}
            >
              {renderSvgLabelWithSup(spec.bottomBaseLabel)}
            </text>
          </svg>
        </div>
      )}

      {spec.kind === 'circle' && (
        <div className="flex flex-col items-center w-full">
          {spec.extraBadge && (
            <span className="mb-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold">
              {renderMathUnitText(spec.extraBadge)}
            </span>
          )}
          <svg viewBox="0 0 210 148" className="w-52 h-36">
            <circle
              cx="105"
              cy="74"
              r="54"
              fill="#fef3c7"
              fillOpacity="0.8"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            {spec.mode === 'radius' ? (
              <line x1="105" y1="74" x2="159" y2="74" stroke="#dc2626" strokeWidth="2.4" />
            ) : (
              <line x1="51" y1="74" x2="159" y2="74" stroke="#dc2626" strokeWidth="2.4" />
            )}
            <circle cx="105" cy="74" r="3.8" fill="#0f172a" />
            <text x="98" y="68" textAnchor="end" fontSize="11" fontWeight="900" fill="#0f172a">
              O
            </text>
            <text
              x={spec.mode === 'radius' ? 132 : 105}
              y="64"
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="900"
              fill="#dc2626"
            >
              {renderSvgLabelWithSup(spec.measureLabel)}
            </text>
          </svg>
        </div>
      )}

      {spec.kind === 'box3d' && (
        <div className="flex flex-col items-center w-full">
          {spec.extraBadge && (
            <span className="mb-1.5 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-extrabold">
              {renderMathUnitText(spec.extraBadge)}
            </span>
          )}
          <svg viewBox="0 0 275 150" className="w-full max-w-[275px] h-36">
            {/* Mặt trong mờ giúp nhìn rõ 3 cạnh khuất nét đứt */}
            <polygon points="36,54 142,54 142,114 36,114" fill="#e0e7ff" fillOpacity="0.55" />
            <polygon points="36,54 78,24 184,24 142,54" fill="#eef2ff" fillOpacity="0.7" />
            <polygon points="142,54 184,24 184,84 142,114" fill="#c7d2fe" fillOpacity="0.65" />

            {/* 3 cạnh khuất vẽ nét đứt */}
            <line x1="78" y1="24" x2="78" y2="84" stroke="#6366f1" strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1="36" y1="114" x2="78" y2="84" stroke="#6366f1" strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1="78" y1="84" x2="184" y2="84" stroke="#6366f1" strokeWidth="1.6" strokeDasharray="4 3" />

            {/* Các cạnh thấy vẽ nét liền sắc nét */}
            <polygon
              points="36,54 142,54 142,114 36,114"
              fill="none"
              stroke="#4338ca"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polyline
              points="36,54 78,24 184,24 142,54"
              fill="none"
              stroke="#4338ca"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polyline
              points="184,24 184,84 142,114"
              fill="none"
              stroke="#4338ca"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Nhãn kích thước trực tiếp trên các cạnh */}
            <text
              x="89"
              y="133"
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill={spec.lengthLabel.includes('?') ? '#dc2626' : '#312e81'}
            >
              {renderSvgLabelWithSup(spec.lengthLabel)}
            </text>
            <text
              x="169"
              y="108"
              fontSize="10.5"
              fontWeight="900"
              fill={spec.widthLabel.includes('?') ? '#dc2626' : '#312e81'}
            >
              {renderSvgLabelWithSup(spec.widthLabel)}
            </text>
            <text
              x="191"
              y="58"
              fontSize="10.5"
              fontWeight="900"
              fill={spec.heightLabel.includes('?') ? '#dc2626' : '#b45309'}
            >
              {renderSvgLabelWithSup(spec.heightLabel)}
            </text>
          </svg>
        </div>
      )}

      {spec.kind === 'cube3d' && (
        <div className="flex flex-col items-center w-full">
          {spec.extraBadge && (
            <span className="mb-1.5 px-3 py-1 rounded-xl bg-pink-100 text-pink-900 border border-pink-200 text-xs font-extrabold">
              {renderMathUnitText(spec.extraBadge)}
            </span>
          )}
          <svg viewBox="0 0 220 150" className="w-56 h-36">
            {/* Mặt trong mờ */}
            <polygon points="62,50 128,50 128,116 62,116" fill="#fce7f3" fillOpacity="0.6" />
            <polygon points="62,50 94,24 160,24 128,50" fill="#fdf2f8" fillOpacity="0.75" />
            <polygon points="128,50 160,24 160,90 128,116" fill="#fbcfe8" fillOpacity="0.65" />

            {/* 3 cạnh khuất vẽ nét đứt */}
            <line x1="94" y1="24" x2="94" y2="90" stroke="#ec4899" strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1="62" y1="116" x2="94" y2="90" stroke="#ec4899" strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1="94" y1="90" x2="160" y2="90" stroke="#ec4899" strokeWidth="1.6" strokeDasharray="4 3" />

            {/* Các cạnh thấy vẽ nét liền */}
            <polygon
              points="62,50 128,50 128,116 62,116"
              fill="none"
              stroke="#be185d"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polyline
              points="62,50 94,24 160,24 128,50"
              fill="none"
              stroke="#be185d"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polyline
              points="160,24 160,90 128,116"
              fill="none"
              stroke="#be185d"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Nhãn độ dài cạnh */}
            <text
              x="95"
              y="135"
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="900"
              fill={spec.edgeLabel.includes('?') ? '#dc2626' : '#831843'}
            >
              {renderSvgLabelWithSup(spec.edgeLabel)}
            </text>
          </svg>
        </div>
      )}

      {spec.kind === 'motion' && (
        <svg viewBox="0 0 270 110" className="w-full max-w-[270px] h-28">
          <line x1="24" y1="64" x2="246" y2="64" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="64" r="5" fill="#0284c7" />
          <circle cx="246" cy="64" r="5" fill="#059669" />
          <text x="24" y="82" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#0f172a">
            {spec.pointA}
          </text>
          <text x="246" y="82" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#0f172a">
            {spec.pointB}
          </text>
          <rect x="34" y="34" width="28" height="16" rx="4" fill="#0284c7" />
          <path d="M 68 42 L 98 42" stroke="#0284c7" strokeWidth="2.2" />
          <polygon points="98,38 106,42 98,46" fill="#0284c7" />
          <text x="66" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0369a1">
            {spec.topLabel}
          </text>
          {spec.opposite && (
            <>
              <rect x="208" y="34" width="28" height="16" rx="4" fill="#ea580c" />
              <path d="M 202 42 L 172 42" stroke="#ea580c" strokeWidth="2.2" />
              <polygon points="172,38 164,42 172,46" fill="#ea580c" />
              <text x="204" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#c2410c">
                {spec.secondTopLabel}
              </text>
            </>
          )}
          <text x="135" y="99" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#334155">
            {spec.bottomLabel}
          </text>
        </svg>
      )}

      {spec.kind === 'segments' && (
        <svg viewBox="0 0 270 105" className="w-full max-w-[270px] h-24">
          <text x="8" y="30" fontSize="10.5" fontWeight="800" fill="#0f172a">
            {spec.label1}
          </text>
          {Array.from({ length: Math.min(spec.parts1, 6) }).map((_, i) => (
            <rect
              key={i}
              x={84 + i * 26}
              y="16"
              width="24"
              height="18"
              rx="4"
              fill="#38bdf8"
              stroke="#0284c7"
              strokeWidth="1.4"
            />
          ))}
          <text x="8" y="64" fontSize="10.5" fontWeight="800" fill="#0f172a">
            {spec.label2}
          </text>
          {Array.from({ length: Math.min(spec.parts2, 6) }).map((_, i) => (
            <rect
              key={i}
              x={84 + i * 26}
              y="50"
              width="24"
              height="18"
              rx="4"
              fill="#14b8a6"
              stroke="#0f766e"
              strokeWidth="1.4"
            />
          ))}
          <text x="135" y="92" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#334155">
            {spec.footer}
          </text>
        </svg>
      )}

      {spec.kind === 'badge_visual' && (
        <div className="py-3 px-4 text-center space-y-1">
          <div className="text-sm sm:text-base font-black text-slate-900">
            {renderMathUnitText(spec.title)}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-600">
            {renderMathUnitText(spec.subtitle)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaIllustration;
