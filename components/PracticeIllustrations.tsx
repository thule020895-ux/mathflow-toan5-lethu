import React from 'react';

export type DiagramId =
  | 'so_do_ti_so_2'
  | 'so_do_hieu_ti_2'
  | 'chuyen_dong_2'
  | 'chuyen_dong_nguoc_2'
  | 'tam_giac_2'
  | 'hinh_thang_2'
  | 'tam_giac_dien_tich_2'
  | 'hinh_tron_d_2'
  | 'hinh_tron_r_2'
  | 'hinh_vuong_tron_2'
  | 'lap_phuong_2'
  | 'hhcn_2'
  | 'lap_phuong_son_2'
  | 'bieu_do_quat_1'
  | 'bieu_do_quat_2'
  | 'bieu_do_quat_3'
  | 'bieu_do_cot_1_new'
  | 'bieu_do_cot_2_new'
  | 'bieu_do_cot_3_new'
  | 'bieu_do_cot_4_new'
  | 'xac_suat_dong_xu_2'
  | 'xac_suat_tui_bi_2'
  | 'xac_suat_vong_quay_2'
  | 'xac_suat_xuc_xac_2';

interface PracticeIllustrationProps {
  id: DiagramId;
}

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
};

const describeArcSector = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

const PieChartSvg: React.FC<{
  slices: { label: string; pct: number; color: string; displayLabel?: string }[];
  title: string;
}> = ({ slices, title }) => {
  let cumulative = 0;
  const cx = 82;
  const cy = 82;
  const r = 64;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-extrabold text-slate-700 mb-1.5 text-center">{title}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <svg viewBox="0 0 164 164" className="w-36 h-36 shrink-0">
          {slices.map((s, idx) => {
            const start = (cumulative / 100) * 360;
            cumulative += s.pct;
            const end = (cumulative / 100) * 360;
            const mid = (start + end) / 2;
            const labelPos = polarToCartesian(cx, cy, r * 0.62, mid);
            return (
              <g key={idx}>
                <path
                  d={describeArcSector(cx, cy, r, start, end)}
                  fill={s.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#ffffff"
                >
                  {s.displayLabel ?? `${s.pct}%`}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="space-y-1.5 text-xs font-bold text-slate-700">
          {slices.map((s, idx) => (
            <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
              <span>{s.label}: {s.displayLabel ?? `${s.pct}%`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChartSvg: React.FC<{
  bars: { label: string; value: number | null; displayVal: string; color: string }[];
  maxVal: number;
  unit: string;
  title: string;
}> = ({ bars, maxVal, unit, title }) => {
  const chartW = 250;
  const chartH = 136;
  const baseLine = 110;
  const topLine = 18;
  const usableH = baseLine - topLine;

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs font-extrabold text-slate-700 mb-1 text-center">{title} ({unit})</p>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-[270px] h-36">
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = baseLine - t * usableH;
          return (
            <g key={i}>
              <line x1="34" y1={y} x2="240" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i > 0 ? '3 3' : undefined} />
              <text x="30" y={y + 3} textAnchor="end" fontSize="8" fill="#64748b" fontWeight="700">
                {Math.round(maxVal * t)}
              </text>
            </g>
          );
        })}
        <line x1="34" y1={topLine - 4} x2="34" y2={baseLine} stroke="#475569" strokeWidth="1.5" />
        <line x1="34" y1={baseLine} x2="242" y2={baseLine} stroke="#475569" strokeWidth="1.5" />
        {bars.map((b, idx) => {
          const slotW = 198 / bars.length;
          const barW = Math.min(30, slotW * 0.56);
          const x = 38 + idx * slotW + (slotW - barW) / 2;
          const h = b.value !== null ? (b.value / maxVal) * usableH : usableH * 0.45;
          const y = baseLine - h;
          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="4"
                fill={b.value !== null ? b.color : '#f1f5f9'}
                stroke={b.value !== null ? 'none' : '#94a3b8'}
                strokeDasharray={b.value !== null ? undefined : '3 3'}
                strokeWidth="1.5"
              />
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={b.value !== null ? '#0f172a' : '#d97706'}
              >
                {b.displayVal}
              </text>
              <text x={x + barW / 2} y={baseLine + 14} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const PracticeIllustration: React.FC<PracticeIllustrationProps> = ({ id }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-center min-h-[150px]">
      {id === 'so_do_ti_so_2' && (
        <svg viewBox="0 0 270 112" className="w-full max-w-[270px] h-28">
          <text x="8" y="34" fontSize="11" fontWeight="800" fill="#0f172a">Rộng:</text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={56 + i * 32} y="20" width="30" height="19" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
          ))}
          <text x="8" y="68" fontSize="11" fontWeight="800" fill="#0f172a">Dài:</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={56 + i * 32} y="54" width="30" height="19" rx="4" fill="#14b8a6" stroke="#0f766e" strokeWidth="1.5" />
          ))}
          <path d="M 222 22 Q 235 46 222 72" fill="none" stroke="#0f172a" strokeWidth="1.5" />
          <text x="236" y="51" fontSize="11" fontWeight="900" fill="#0369a1">120 m</text>
          <text x="135" y="98" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
            Chu vi = 240 m · Rộng = 3/5 Dài
          </text>
        </svg>
      )}

      {id === 'so_do_hieu_ti_2' && (
        <svg viewBox="0 0 270 115" className="w-full max-w-[280px] h-28">
          <text x="8" y="32" fontSize="11" fontWeight="800" fill="#0f172a">Nam:</text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={50 + i * 22} y="18" width="20" height="18" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
          ))}
          <text x="8" y="64" fontSize="11" fontWeight="800" fill="#0f172a">Nữ:</text>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              x={50 + i * 22}
              y="50"
              width="20"
              height="18"
              rx="3"
              fill={i < 4 ? '#14b8a6' : '#f59e0b'}
              stroke={i < 4 ? '#0f766e' : '#b45309'}
              strokeWidth="1.2"
            />
          ))}
          <path d="M 138 74 L 138 82 L 246 82 L 246 74" fill="none" stroke="#b45309" strokeWidth="1.5" />
          <text x="192" y="98" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#b45309">
            Hơn: 315 người
          </text>
        </svg>
      )}

      {id === 'chuyen_dong_2' && (
        <svg viewBox="0 0 265 115" className="w-full max-w-[270px] h-28">
          <line x1="25" y1="68" x2="240" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <circle cx="25" cy="68" r="5" fill="#0284c7" />
          <circle cx="240" cy="68" r="5" fill="#059669" />
          <text x="25" y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0f172a">A</text>
          <text x="240" y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0f172a">B</text>
          <rect x="42" y="34" width="34" height="18" rx="5" fill="#0284c7" />
          <circle cx="50" cy="54" r="4" fill="#0f172a" />
          <circle cx="68" cy="54" r="4" fill="#0f172a" />
          <path d="M 84 43 L 118 43" stroke="#0284c7" strokeWidth="2.5" />
          <polygon points="118,39 126,43 118,47" fill="#0284c7" />
          <text x="68" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0369a1">v = 45,5 km/giờ</text>
          <text x="132" y="88" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#d97706">
            s = ? km (t = 3 giờ 30 phút)
          </text>
        </svg>
      )}

      {id === 'chuyen_dong_nguoc_2' && (
        <svg viewBox="0 0 265 115" className="w-full max-w-[270px] h-28">
          <line x1="24" y1="68" x2="241" y2="68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="68" r="5" fill="#0284c7" />
          <circle cx="241" cy="68" r="5" fill="#ea580c" />
          <text x="24" y="86" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f172a">A (6h30)</text>
          <text x="241" y="86" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f172a">B (6h30)</text>
          <rect x="28" y="38" width="26" height="15" rx="4" fill="#0284c7" />
          <path d="M 60 45 L 88 45" stroke="#0284c7" strokeWidth="2" />
          <polygon points="88,41 96,45 88,49" fill="#0284c7" />
          <text x="58" y="26" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0369a1">52,5 km/h</text>
          <rect x="210" y="38" width="26" height="15" rx="4" fill="#ea580c" />
          <path d="M 204 45 L 176 45" stroke="#ea580c" strokeWidth="2" />
          <polygon points="176,41 168,45 176,49" fill="#ea580c" />
          <text x="206" y="26" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#c2410c">38,5 km/h</text>
          <text x="132" y="101" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#0f172a">
            AB = 245,7 km · Gặp nhau lúc ?
          </text>
        </svg>
      )}

      {id === 'tam_giac_2' && (
        <svg viewBox="0 0 245 140" className="w-full max-w-[245px] h-36">
          <polygon points="32,112 212,112 138,24" fill="#ffedd5" stroke="#ea580c" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="138" y1="24" x2="138" y2="112" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
          <rect x="138" y="102" width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          <text x="145" y="72" fontSize="10.5" fontWeight="800" fill="#dc2626">h = 12,4 cm</text>
          <text x="122" y="130" textAnchor="middle" fontSize="11" fontWeight="900" fill="#9a3412">Đáy = 24,5 cm</text>
        </svg>
      )}

      {id === 'hinh_thang_2' && (
        <svg viewBox="0 0 255 140" className="w-full max-w-[255px] h-36">
          <polygon points="65,28 175,28 215,110 35,110" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="88" y1="28" x2="88" y2="110" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
          <rect x="88" y="100" width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          <text x="120" y="20" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e">Đáy bé = 27,5 m</text>
          <text x="125" y="128" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e">Đáy lớn = 42,5 m</text>
          <text x="95" y="74" fontSize="10.5" fontWeight="800" fill="#dc2626">h = 18,4 m</text>
        </svg>
      )}

      {id === 'tam_giac_dien_tich_2' && (
        <svg viewBox="0 0 260 140" className="w-full max-w-[260px] h-36">
          <polygon points="28,110 184,110 92,24" fill="#ffedd5" stroke="#ea580c" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="184,110 232,110 92,24" fill="#fecaca" fillOpacity="0.65" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
          <text x="106" y="128" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#9a3412">BC = 25 cm</text>
          <text x="208" y="128" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#dc2626">+6,5 cm</text>
          <text x="195" y="64" fontSize="10" fontWeight="900" fill="#dc2626">+45,5 cm²</text>
        </svg>
      )}

      {id === 'hinh_tron_d_2' && (
        <svg viewBox="0 0 180 145" className="w-44 h-36">
          <circle cx="90" cy="72" r="52" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
          <line x1="38" y1="72" x2="142" y2="72" stroke="#dc2626" strokeWidth="2" />
          <circle cx="90" cy="72" r="3" fill="#dc2626" />
          <text x="90" y="63" textAnchor="middle" fontSize="11" fontWeight="900" fill="#dc2626">d = 12,5 m</text>
          <text x="90" y="138" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e">Chu vi C = ? m</text>
        </svg>
      )}

      {id === 'hinh_tron_r_2' && (
        <svg viewBox="0 0 180 145" className="w-44 h-36">
          <circle cx="90" cy="72" r="52" fill="#ffedd5" stroke="#ea580c" strokeWidth="2.5" />
          <line x1="90" y1="72" x2="142" y2="72" stroke="#dc2626" strokeWidth="2.2" />
          <circle cx="90" cy="72" r="3.2" fill="#0f172a" />
          <text x="85" y="65" textAnchor="end" fontSize="10.5" fontWeight="800" fill="#0f172a">O</text>
          <text x="116" y="64" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#dc2626">r = 1,2 m</text>
          <text x="90" y="138" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#9a3412">S = ? dm²</text>
        </svg>
      )}

      {id === 'hinh_vuong_tron_2' && (
        <svg viewBox="0 0 185 150" className="w-44 h-36">
          <rect x="40" y="18" width="104" height="104" fill="#fb923c" fillOpacity="0.45" stroke="#c2410c" strokeWidth="2.5" />
          <circle cx="92" cy="70" r="52" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <line x1="40" y1="70" x2="144" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="92" y="65" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#475569">d = 20 cm</text>
          <text x="92" y="140" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#9a3412">Cạnh hình vuông = 20 cm</text>
        </svg>
      )}

      {id === 'lap_phuong_2' && (
        <svg viewBox="0 0 190 145" className="w-44 h-36">
          <polygon points="55,45 115,45 115,105 55,105" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
          <polygon points="55,45 80,22 140,22 115,45" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" />
          <polygon points="115,45 140,22 140,82 115,105" fill="#fdba74" stroke="#ea580c" strokeWidth="2" />
          <text x="85" y="124" textAnchor="middle" fontSize="11" fontWeight="900" fill="#9a3412">Cạnh = 12,5 cm</text>
        </svg>
      )}

      {id === 'hhcn_2' && (
        <svg viewBox="0 0 230 145" className="w-56 h-36">
          <polygon points="32,52 132,52 132,108 32,108" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <polygon points="32,52 66,26 166,26 132,52" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
          <polygon points="132,52 166,26 166,82 132,108" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
          <text x="82" y="124" textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400e">Dài: 12,5 cm</text>
          <text x="160" y="102" fontSize="9.5" fontWeight="800" fill="#92400e">Rộng: 8,4 cm</text>
          <text x="172" y="58" fontSize="9.5" fontWeight="800" fill="#b45309">Cao: 6 cm</text>
        </svg>
      )}

      {id === 'lap_phuong_son_2' && (
        <svg viewBox="0 0 190 145" className="w-44 h-36">
          <polygon points="46,44 116,44 116,114 46,114" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
          <polygon points="46,44 74,20 144,20 116,44" fill="#ffedd5" stroke="#c2410c" strokeWidth="2" />
          <polygon points="116,44 144,20 144,90 116,114" fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <line x1={46 + i * 14} y1="44" x2={46 + i * 14} y2="114" stroke="#ea580c" strokeWidth="0.9" />
              <line x1="46" y1={44 + i * 14} x2="116" y2={44 + i * 14} stroke="#ea580c" strokeWidth="0.9" />
            </React.Fragment>
          ))}
          <text x="95" y="133" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#9a3412">Khối 5×5×5 (125 hình nhỏ)</text>
        </svg>
      )}

      {id === 'bieu_do_quat_1' && (
        <PieChartSvg
          title="Phương tiện của 1.200 học sinh"
          slices={[
            { label: 'Xe đạp', pct: 40, color: '#059669' },
            { label: 'Đi bộ', pct: 35, color: '#0284c7' },
            { label: 'Xe máy', pct: 15, color: '#8b5cf6' },
            { label: 'Ô tô', pct: 10, color: '#f59e0b' }
          ]}
        />
      )}

      {id === 'bieu_do_quat_2' && (
        <PieChartSvg
          title="1.500 HS tham gia CLB"
          slices={[
            { label: 'Bóng đá', pct: 40, color: '#059669' },
            { label: 'Bơi lội', pct: 25, color: '#0284c7' },
            { label: 'Cầu lông', pct: 21, color: '#8b5cf6' },
            { label: 'Cờ vua', pct: 14, color: '#f59e0b', displayLabel: '?%' }
          ]}
        />
      )}

      {id === 'bieu_do_quat_3' && (
        <PieChartSvg
          title="Tỉ lệ hoa quả thu hoạch"
          slices={[
            { label: 'Cam', pct: 40, color: '#f97316' },
            { label: 'Xoài', pct: 35, color: '#eab308' },
            { label: 'Bưởi', pct: 25, color: '#10b981' }
          ]}
        />
      )}

      {id === 'bieu_do_cot_1_new' && (
        <BarChartSvg
          title="Số sách cho mượn theo quý"
          unit="quyển"
          maxVal={1800}
          bars={[
            { label: 'Quý I', value: 1240, displayVal: '1.240', color: '#10b981' },
            { label: 'Quý II', value: 1560, displayVal: '1.560', color: '#0ea5e9' },
            { label: 'Quý III', value: 1180, displayVal: '1.180', color: '#8b5cf6' },
            { label: 'Quý IV', value: 1620, displayVal: '1.620', color: '#059669' }
          ]}
        />
      )}

      {id === 'bieu_do_cot_2_new' && (
        <BarChartSvg
          title="Gạo xuất khẩu (Tổng: 2.040 tấn)"
          unit="tấn"
          maxVal={650}
          bars={[
            { label: 'T1', value: 450, displayVal: '450', color: '#0ea5e9' },
            { label: 'T2', value: 540, displayVal: '540', color: '#8b5cf6' },
            { label: 'T3', value: 480, displayVal: '480', color: '#10b981' },
            { label: 'T4', value: null, displayVal: '?', color: '#f59e0b' }
          ]}
        />
      )}

      {id === 'bieu_do_cot_3_new' && (
        <BarChartSvg
          title="Lượng mưa 4 tháng cuối năm"
          unit="mm"
          maxVal={400}
          bars={[
            { label: 'T9', value: 360, displayVal: '360', color: '#0284c7' },
            { label: 'T10', value: 270, displayVal: '270', color: '#0ea5e9' },
            { label: 'T11', value: 180, displayVal: '180', color: '#10b981' },
            { label: 'T12', value: 126, displayVal: '126', color: '#f59e0b' }
          ]}
        />
      )}

      {id === 'bieu_do_cot_4_new' && (
        <BarChartSvg
          title="Số học sinh tham gia ngoại khóa"
          unit="học sinh"
          maxVal={500}
          bars={[
            { label: 'Khối 2', value: 245, displayVal: '245', color: '#10b981' },
            { label: 'Khối 3', value: 315, displayVal: '315', color: '#0ea5e9' },
            { label: 'Khối 4', value: 385, displayVal: '385', color: '#8b5cf6' },
            { label: 'Khối 5', value: 455, displayVal: '455', color: '#f97316' }
          ]}
        />
      )}

      {id === 'xac_suat_dong_xu_2' && (
        <svg viewBox="0 0 245 120" className="w-full max-w-[250px] h-28">
          <circle cx="65" cy="48" r="28" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
          <text x="65" y="52" textAnchor="middle" fontSize="11" fontWeight="900" fill="#854d0e">NGỬA</text>
          <text x="65" y="94" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">135 lần</text>
          <circle cx="178" cy="48" r="28" fill="#e2e8f0" stroke="#64748b" strokeWidth="2.5" />
          <text x="178" y="52" textAnchor="middle" fontSize="11" fontWeight="900" fill="#334155">SẤP</text>
          <text x="178" y="94" textAnchor="middle" fontSize="11" fontWeight="800" fill="#d97706">? lần</text>
          <text x="122" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">Tổng số lần tung: 250 lần</text>
        </svg>
      )}

      {id === 'xac_suat_tui_bi_2' && (
        <svg viewBox="0 0 250 125" className="w-full max-w-[260px] h-28">
          <path d="M 42 30 L 104 30 L 118 100 Q 118 110 104 110 L 42 110 Q 28 110 28 100 Z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="56" cy="76" r="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="74" cy="56" r="12" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
          <circle cx="92" cy="78" r="12" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="184" y="42" textAnchor="middle" fontSize="11" fontWeight="900" fill="#4c1d95">Thử 400 lần:</text>
          <text x="184" y="62" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">Đỏ: 144 lần</text>
          <text x="184" y="80" textAnchor="middle" fontSize="11" fontWeight="800" fill="#059669">Xanh: 156 lần</text>
          <text x="184" y="98" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b45309">Vàng: ? lần</text>
        </svg>
      )}

      {id === 'xac_suat_vong_quay_2' && (
        <svg viewBox="0 0 255 130" className="w-full max-w-[260px] h-32">
          <g>
            {[
              { start: 0, end: 126, color: '#f59e0b' },
              { start: 126, end: 240, color: '#3b82f6' },
              { start: 240, end: 360, color: '#10b981' }
            ].map((seg, i) => (
              <path
                key={i}
                d={describeArcSector(68, 66, 48, seg.start, seg.end)}
                fill={seg.color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            ))}
            <circle cx="68" cy="66" r="6" fill="#0f172a" />
            <polygon points="68,12 63,22 73,22" fill="#0f172a" />
          </g>
          <text x="182" y="48" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">Quay 200 lần</text>
          <text x="182" y="68" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#d97706">Trúng thưởng: 7/20</text>
          <text x="182" y="88" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#6d28d9">Không trúng: ? lần</text>
        </svg>
      )}

      {id === 'xac_suat_xuc_xac_2' && (
        <svg viewBox="0 0 255 120" className="w-full max-w-[260px] h-28">
          <rect x="34" y="22" width="66" height="66" rx="12" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          {[
            [50, 38], [84, 38],
            [50, 55], [84, 55],
            [50, 72], [84, 72]
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="5" fill="#dc2626" />
          ))}
          <text x="178" y="42" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">Gieo 300 lần</text>
          <text x="178" y="62" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#dc2626">Mặt 6 chấm: 18%</text>
          <text x="178" y="80" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0284c7">Mặt 1 chấm: 1/5</text>
          <text x="178" y="98" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#059669">Tổng 2 mặt: ? lần</text>
        </svg>
      )}
    </div>
  );
};

export default PracticeIllustration;
