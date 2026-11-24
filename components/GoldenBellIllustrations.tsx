import React from 'react';
import { GoldenBellSvgSpec } from './goldenBellData';

interface Props {
  spec: GoldenBellSvgSpec;
}

export const GoldenBellIllustration: React.FC<Props> = ({ spec }) => {
  const d = spec.data || {};

  return (
    <div className="my-3 flex justify-center">
      <div className="bg-slate-50/90 border border-slate-200 rounded-2xl px-4 py-3 w-full max-w-md flex flex-col items-center">
        {spec.type === 'scale_map' && (
          <svg viewBox="0 0 300 100" className="w-full max-w-[290px] h-24">
            <rect x="16" y="14" width="268" height="72" rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="5 3" />
            <line x1="42" y1="54" x2="258" y2="54" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="42" cy="54" r="5" fill="#1d4ed8" />
            <circle cx="258" cy="54" r="5" fill="#1d4ed8" />
            <text x="150" y="34" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e40af">
              Tỉ lệ bản đồ: {d.ratio}
            </text>
            <text x="150" y="74" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0f172a">
              Bản đồ: {d.mapLen}  →  Thực tế: {d.realLen}
            </text>
          </svg>
        )}

        {spec.type === 'number_compare' && (
          <svg viewBox="0 0 320 76" className="w-full max-w-[300px] h-20">
            <line x1="20" y1="46" x2="300" y2="46" stroke="#64748b" strokeWidth="2.5" />
            <polygon points="300,46 290,41 290,51" fill="#64748b" />
            {[60, 125, 195, 260].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="46" r="5" fill={i === 2 ? '#d97706' : '#0284c7'} />
                <text x={cx} y="27" textAnchor="middle" fontSize="12" fontWeight="800" fill={i === 2 ? '#b45309' : '#334155'}>
                  Vị trí {i + 1}
                </text>
              </g>
            ))}
            <text x="160" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
              {d.numbers}
            </text>
          </svg>
        )}

        {spec.type === 'tape_sum_ratio' && (
          <svg viewBox="0 0 320 110" className="w-full max-w-[300px] h-24">
            <text x="12" y="28" fontSize="11" fontWeight="700" fill="#334155">{d.topLabel}</text>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={108 + i * 32} y="14" width="30" height="20" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            ))}
            <text x="12" y="64" fontSize="11" fontWeight="700" fill="#334155">{d.bottomLabel}</text>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={108 + i * 32} y="50" width="30" height="20" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            ))}
            <path d="M 274 14 Q 286 14 286 42 Q 286 70 274 70" fill="none" stroke="#0f172a" strokeWidth="2" />
            <text x="292" y="46" fontSize="12" fontWeight="800" fill="#0f172a">{d.total}</text>
            <text x="160" y="96" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">Sơ đồ đoạn thẳng tổng – tỉ</text>
          </svg>
        )}

        {spec.type === 'tape_diff_ratio' && (
          <svg viewBox="0 0 320 110" className="w-full max-w-[300px] h-24">
            <text x="10" y="28" fontSize="11" fontWeight="700" fill="#334155">{d.topLabel}</text>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x={104 + i * 26} y="14" width="24" height="20" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            ))}
            <text x="10" y="64" fontSize="11" fontWeight="700" fill="#334155">{d.bottomLabel}</text>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={104 + i * 26} y="50" width="24" height="20" rx="3" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
            ))}
            <line x1="182" y1="42" x2="182" y2="78" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 184 78 L 284 78" stroke="#dc2626" strokeWidth="2" />
            <text x="234" y="95" textAnchor="middle" fontSize="12" fontWeight="800" fill="#dc2626">Hiệu = {d.diff}</text>
          </svg>
        )}

        {spec.type === 'rect_land' && (
          <svg viewBox="0 0 300 120" className="w-full max-w-[280px] h-28">
            <rect x="64" y="22" width="160" height="68" rx="4" fill="#d1fae5" stroke="#059669" strokeWidth="2.5" />
            <text x="144" y="15" textAnchor="middle" fontSize="12" fontWeight="800" fill="#065f46">Chiều dài: {d.length}</text>
            <text x="58" y="60" textAnchor="end" fontSize="11.5" fontWeight="800" fill="#065f46">{d.width}</text>
            <text x="144" y="60" textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">{d.note}</text>
          </svg>
        )}

        {spec.type === 'triangle_area' && (
          <svg viewBox="0 0 280 125" className="w-full max-w-[260px] h-28">
            <polygon points="50,96 230,96 156,22" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
            <line x1="156" y1="22" x2="156" y2="96" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
            <rect x="156" y="86" width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="1.5" />
            <text x="164" y="62" fontSize="12" fontWeight="800" fill="#dc2626">{d.height}</text>
            <text x="140" y="114" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0369a1">Đáy: {d.base}</text>
          </svg>
        )}

        {spec.type === 'triangle_inverse' && (
          <svg viewBox="0 0 280 125" className="w-full max-w-[260px] h-28">
            <polygon points="48,96 232,96 128,20" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
            <line x1="128" y1="20" x2="128" y2="96" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
            <text x="136" y="62" fontSize="12" fontWeight="800" fill="#dc2626">{d.height}</text>
            <text x="140" y="114" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e">Đáy: {d.base}</text>
            <text x="195" y="42" fontSize="11.5" fontWeight="800" fill="#0f172a">Diện tích: {d.area}</text>
          </svg>
        )}

        {spec.type === 'triangle_ratio' && (
          <svg viewBox="0 0 290 125" className="w-full max-w-[270px] h-28">
            <polygon points="50,98 240,98 130,20" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <polygon points="50,98 113,98 130,20" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
            <text x="130" y="14" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">A</text>
            <text x="42" y="104" fontSize="12" fontWeight="800" fill="#0f172a">B</text>
            <text x="113" y="113" textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">M</text>
            <text x="246" y="104" fontSize="12" fontWeight="800" fill="#0f172a">C</text>
            <text x="195" y="42" fontSize="11.5" fontWeight="800" fill="#0369a1">{d.totalArea}</text>
            <text x="195" y="58" fontSize="11" fontWeight="700" fill="#b45309">{d.ratio}</text>
          </svg>
        )}

        {(spec.type === 'trapezoid_area' || spec.type === 'trapezoid_land') && (
          <svg viewBox="0 0 290 125" className="w-full max-w-[270px] h-28">
            <polygon points="86,26 204,26 244,96 46,96" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
            <line x1="94" y1="26" x2="94" y2="96" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
            <text x="100" y="64" fontSize="12" fontWeight="800" fill="#dc2626">{d.height}</text>
            {spec.type === 'trapezoid_area' ? (
              <>
                <text x="145" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5b21b6">Đáy bé: {d.top}</text>
                <text x="145" y="114" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5b21b6">Đáy lớn: {d.bottom}</text>
              </>
            ) : (
              <text x="145" y="114" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5b21b6">{d.mid}</text>
            )}
          </svg>
        )}

        {spec.type === 'trapezoid_diagonals' && (
          <svg viewBox="0 0 290 125" className="w-full max-w-[270px] h-28">
            <polygon points="95,24 195,24 245,98 45,98" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <polygon points="95,24 195,24 145,49" fill="#fde68a" />
            <polygon points="45,98 245,98 145,49" fill="#bae6fd" />
            <line x1="95" y1="24" x2="245" y2="98" stroke="#475569" strokeWidth="1.5" />
            <line x1="195" y1="24" x2="45" y2="98" stroke="#475569" strokeWidth="1.5" />
            <text x="86" y="22" fontSize="11.5" fontWeight="800" fill="#0f172a">A</text>
            <text x="202" y="22" fontSize="11.5" fontWeight="800" fill="#0f172a">B</text>
            <text x="250" y="102" fontSize="11.5" fontWeight="800" fill="#0f172a">C</text>
            <text x="34" y="102" fontSize="11.5" fontWeight="800" fill="#0f172a">D</text>
            <text x="145" y="42" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#b45309">{d.areaTop}</text>
            <text x="145" y="84" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0369a1">? cm²</text>
            <text x="145" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#475569">{d.ratio}</text>
          </svg>
        )}

        {spec.type === 'circle_radius' && (
          <svg viewBox="0 0 260 116" className="w-full max-w-[250px] h-28">
            <circle cx="82" cy="58" r="44" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
            <line x1="38" y1="58" x2="126" y2="58" stroke="#b45309" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="82" cy="58" r="3.5" fill="#b45309" />
            <text x="82" y="50" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#92400e">d = {d.diameter}</text>
            <text x="192" y="55" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">{d.note}</text>
            <path d="M 142 66 L 242 66" stroke="#059669" strokeWidth="2.5" strokeDasharray="5 3" />
          </svg>
        )}

        {spec.type === 'shaded_square_circle' && (
          <svg viewBox="0 0 250 120" className="w-full max-w-[240px] h-28">
            <rect x="75" y="14" width="88" height="88" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="119" cy="58" r="44" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <text x="119" y="62" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0369a1">{d.side}</text>
            <text x="119" y="115" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b45309">Phần tô màu vàng</text>
          </svg>
        )}

        {spec.type === 'ring_circle' && (
          <svg viewBox="0 0 260 120" className="w-full max-w-[250px] h-28">
            <circle cx="95" cy="60" r="48" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
            <circle cx="95" cy="60" r="34" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
            <circle cx="95" cy="60" r="2.5" fill="#15803d" />
            <line x1="95" y1="60" x2="129" y2="60" stroke="#15803d" strokeWidth="2" />
            <line x1="129" y1="60" x2="143" y2="60" stroke="#dc2626" strokeWidth="2.5" />
            <text x="195" y="48" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#15803d">Bồn hoa: {d.rInner}</text>
            <text x="195" y="70" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#b45309">Lối đi rộng: {d.width}</text>
          </svg>
        )}

        {spec.type === 'cube_box' && (
          <svg viewBox="0 0 260 120" className="w-full max-w-[240px] h-28">
            <polygon points="88,42 148,42 172,24 112,24" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="2" />
            <rect x="88" y="42" width="60" height="60" fill="#ede9fe" stroke="#6d28d9" strokeWidth="2" />
            <polygon points="148,42 172,24 172,84 148,102" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2" />
            <text x="118" y="116" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#5b21b6">Cạnh: {d.edge}</text>
            <text x="208" y="64" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#475569">{d.label}</text>
          </svg>
        )}

        {spec.type === 'cube_stacked' && (
          <svg viewBox="0 0 260 120" className="w-full max-w-[240px] h-28">
            <rect x="84" y="34" width="68" height="68" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            {[1, 2, 3].map((k) => (
              <React.Fragment key={k}>
                <line x1={84 + k * 17} y1="34" x2={84 + k * 17} y2="102" stroke="#a16207" strokeWidth="1" />
                <line x1="84" y1={34 + k * 17} x2="152" y2={34 + k * 17} stroke="#a16207" strokeWidth="1" />
              </React.Fragment>
            ))}
            <polygon points="84,34 152,34 174,16 106,16" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="152,34 174,16 174,84 152,102" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <text x="118" y="116" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#854d0e">Cạnh lớn: {d.edge} (4×4×4)</text>
          </svg>
        )}

        {spec.type === 'rect_prism' && (
          <svg viewBox="0 0 280 122" className="w-full max-w-[260px] h-28">
            <polygon points="68,46 178,46 206,24 96,24" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
            <rect x="68" y="46" width="110" height="52" fill="#ecfeff" stroke="#0891b2" strokeWidth="2" />
            <polygon points="178,46 206,24 206,76 178,98" fill="#a5f3fc" stroke="#0891b2" strokeWidth="2" />
            <text x="123" y="114" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0e7490">Dài: {d.length}</text>
            <text x="208" y="92" fontSize="11" fontWeight="800" fill="#0e7490">Rộng: {d.width}</text>
            <text x="62" y="75" textAnchor="end" fontSize="11" fontWeight="800" fill="#dc2626">Cao: {d.height}</text>
          </svg>
        )}

        {spec.type === 'water_tank' && (
          <svg viewBox="0 0 280 122" className="w-full max-w-[260px] h-28">
            <rect x="74" y="24" width="120" height="72" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <rect x="76" y="46" width="116" height="48" fill="#7dd3fc" opacity="0.7" />
            <line x1="74" y1="46" x2="194" y2="46" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
            <text x="134" y="74" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0369a1">{d.fill}</text>
            <text x="134" y="112" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
              Dài {d.length} · Rộng {d.width} · Cao {d.height}
            </text>
          </svg>
        )}

        {spec.type === 'pie_chart' && (
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0">
              {/* 40% Bóng đá (0..144 deg), 25% Bơi lội (144..234), 20% Cầu lông (234..306), 15% Cờ vua (306..360) */}
              <path d="M60,60 L60,10 A50,50 0 0,1 89.4,100.5 Z" fill="#0284c7" stroke="#fff" strokeWidth="2" />
              <path d="M60,60 L89.4,100.5 A50,50 0 0,1 19.5,89.4 Z" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <path d="M60,60 L19.5,89.4 A50,50 0 0,1 19.5,30.6 Z" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <path d="M60,60 L19.5,30.6 A50,50 0 0,1 60,10 Z" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
            </svg>
            <div className="text-xs font-bold text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-sky-600 inline-block" /> Bóng đá: 40%</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Bơi lội: 25%</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" /> Cầu lông: 20%</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-violet-500 inline-block" /> Cờ vua: 15%</div>
              <div className="text-[11px] text-slate-500 pt-0.5">Tổng: {d.total}</div>
            </div>
          </div>
        )}

        {spec.type === 'bar_chart' && (
          <svg viewBox="0 0 280 124" className="w-full max-w-[270px] h-28">
            <text x="140" y="14" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">{d.title}</text>
            <line x1="36" y1="98" x2="256" y2="98" stroke="#64748b" strokeWidth="2" />
            <line x1="36" y1="22" x2="36" y2="98" stroke="#64748b" strokeWidth="2" />
            {[
              { name: '5A', val: 45, h: 48, color: '#0284c7', x: 56 },
              { name: '5B', val: 55, h: 58, color: '#10b981', x: 106 },
              { name: '5C', val: 40, h: 42, color: '#f59e0b', x: 156 },
              { name: '5D', val: 60, h: 64, color: '#8b5cf6', x: 206 },
            ].map((b) => (
              <g key={b.name}>
                <rect x={b.x} y={98 - b.h} width="28" height={b.h} rx="4" fill={b.color} />
                <text x={b.x + 14} y={94 - b.h} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">{b.val}</text>
                <text x={b.x + 14} y="114" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">{b.name}</text>
              </g>
            ))}
          </svg>
        )}

        {spec.type === 'motion_basic' && (
          <svg viewBox="0 0 300 96" className="w-full max-w-[290px] h-24">
            <line x1="34" y1="52" x2="266" y2="52" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="34" cy="52" r="6" fill="#059669" />
            <circle cx="266" cy="52" r="6" fill="#dc2626" />
            <polygon points="168,52 154,45 154,59" fill="#0284c7" />
            <text x="34" y="74" textAnchor="middle" fontSize="12" fontWeight="800" fill="#065f46">A</text>
            <text x="266" y="74" textAnchor="middle" fontSize="12" fontWeight="800" fill="#991b1b">B</text>
            <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0369a1">Quãng đường: {d.distance}</text>
            <text x="150" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">{d.time} · {d.speed}</text>
          </svg>
        )}

        {spec.type === 'motion_opposite' && (
          <svg viewBox="0 0 320 100" className="w-full max-w-[300px] h-24">
            <line x1="30" y1="54" x2="290" y2="54" stroke="#334155" strokeWidth="3" />
            <circle cx="30" cy="54" r="6" fill="#0284c7" />
            <circle cx="290" cy="54" r="6" fill="#e11d48" />
            <polygon points="118,54 104,47 104,61" fill="#0284c7" />
            <polygon points="202,54 216,47 216,61" fill="#e11d48" />
            <text x="80" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0369a1">{d.v1}</text>
            <text x="240" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#be123c">{d.v2}</text>
            <text x="160" y="84" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">AB = {d.dist} (Ngược chiều)</text>
          </svg>
        )}

        {spec.type === 'motion_chase' && (
          <svg viewBox="0 0 320 100" className="w-full max-w-[300px] h-24">
            <line x1="28" y1="56" x2="292" y2="56" stroke="#334155" strokeWidth="3" />
            <circle cx="42" cy="56" r="6" fill="#e11d48" />
            <circle cx="152" cy="56" r="6" fill="#0284c7" />
            <polygon points="94,56 80,49 80,63" fill="#e11d48" />
            <polygon points="212,56 198,49 198,63" fill="#0284c7" />
            <text x="64" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill="#be123c">{d.vFast}</text>
            <text x="176" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0369a1">{d.vSlow}</text>
            <text x="160" y="84" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#475569">Cùng chiều đuổi nhau · {d.lead}</text>
          </svg>
        )}

        {spec.type === 'motion_river' && (
          <svg viewBox="0 0 300 96" className="w-full max-w-[290px] h-24">
            <rect x="20" y="26" width="260" height="44" rx="14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 48 48 Q 76 40 104 48 T 160 48 T 216 48" fill="none" stroke="#0284c7" strokeWidth="2.5" />
            <polygon points="236,48 220,41 220,55" fill="#0284c7" />
            <text x="150" y="18" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0369a1">
              Nước lặng: {d.vBoat} · Dòng nước: {d.vWater}
            </text>
            <text x="150" y="88" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0f172a">{d.dist}</text>
          </svg>
        )}

        {spec.type === 'motion_train' && (
          <svg viewBox="0 0 320 100" className="w-full max-w-[300px] h-24">
            <rect x="130" y="42" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <rect x="26" y="38" width="94" height="26" rx="5" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <polygon points="120,44 130,51 120,58" fill="#b45309" />
            <text x="73" y="55" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffffff">Tàu {d.train}</text>
            <text x="210" y="57" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">Cầu {d.bridge}</text>
            <text x="160" y="86" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0369a1">Vận tốc đoàn tàu: {d.speed}</text>
          </svg>
        )}

        {spec.type === 'commune_bar_chart' && (
          <svg viewBox="0 0 320 130" className="w-full max-w-[300px] h-28">
            <text x="160" y="15" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
              So sánh diện tích các xã (km²)
            </text>
            <line x1="36" y1="104" x2="292" y2="104" stroke="#64748b" strokeWidth="2" />
            {[
              { name: 'Quỳ Châu', val: '327,53', h: 66, color: '#0284c7', x: 58 },
              { name: 'Châu Tiến', val: '247,16', h: 50, color: '#10b981', x: 142 },
              { name: 'Châu Bình', val: '130,91', h: 28, color: '#f59e0b', x: 226 },
            ].map((item) => (
              <g key={item.name}>
                <rect x={item.x} y={104 - item.h} width="42" height={item.h} rx="5" fill={item.color} />
                <text x={item.x + 21} y={99 - item.h} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0f172a">
                  {item.val}
                </text>
                <text x={item.x + 21} y="120" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#475569">
                  {item.name}
                </text>
              </g>
            ))}
          </svg>
        )}

        {spec.type === 'sugar_bag' && (
          <svg viewBox="0 0 300 100" className="w-full max-w-[280px] h-24">
            <rect x="24" y="20" width="76" height="58" rx="14" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
            <path d="M 46 20 L 40 10 L 84 10 L 78 20" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
            <text x="62" y="48" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#92400e">Bao đường</text>
            <text x="62" y="65" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{d.total}</text>
            <line x1="112" y1="49" x2="144" y2="49" stroke="#0284c7" strokeWidth="2.5" />
            <polygon points="150,49 140,43 140,55" fill="#0284c7" />
            <rect x="156" y="24" width="128" height="50" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
            <text x="220" y="53" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1e40af">{d.step}</text>
          </svg>
        )}
      </div>
    </div>
  );
};
