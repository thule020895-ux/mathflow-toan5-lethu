import React from 'react';

export type ConquerSvgType =
  // Đề 01: Tỉ số diện tích tam giác (10 hình riêng biệt)
  | 'tri_extend'
  | 'tri_ceva'
  | 'tri_percent'
  | 'tri_midpoint'
  | 'tri_quad_cut'
  | 'tri_median_ray'
  | 'tri_right_parallel'
  | 'tri_extend_all'
  | 'tri_inner_o'
  | 'tri_in_rect'
  // Đề 02: Hình tròn & phần tô màu (10 hình)
  | 'circle_in_sq'
  | 'sq_in_circle'
  | 'circle_ring'
  | 'sq_area_to_circle'
  | 'circle_area_to_sq'
  | 'circle_petal'
  | 'rect_minus_semi'
  | 'sq_four_quarters'
  | 'semi_crescents'
  | 'ring_inverse'
  // Đề 03: Biến đổi HCN & Hình vuông (10 hình)
  | 'rect_to_sq'
  | 'rect_pct'
  | 'rect_add_len'
  | 'sq_expand_both'
  | 'rect_perim_change'
  | 'rect_expand_both'
  | 'rect_pct_inv'
  | 'rect_4_squares'
  | 'sq_cut_both'
  | 'rect_inner_path'
  // Đề 04: Hình thang & đường chéo (10 hình)
  | 'trap_butterfly_basic'
  | 'trap_extend_base'
  | 'trap_ratio_o'
  | 'trap_total_to_cod'
  | 'trap_to_rect'
  | 'trap_change_bases'
  | 'trap_mid_side'
  | 'trap_split_half'
  | 'trap_diff_o'
  | 'trap_find_height'
  // Đề 05: Hình khối 3D & nước dâng (10 hình)
  | 'cube_paint_0'
  | 'water_rise_rock'
  | 'cube_paint_1'
  | 'box_paint_2'
  | 'water_overflow'
  | 'water_standing_block'
  | 'water_5_balls'
  | 'cube_paint_inv'
  | 'cube_scale_pct'
  | 'water_drain_cube'
  // Đề 06: Quy luật dãy số (10 hình / mẫu trực quan)
  | 'sequence_pattern'
  | 'seq_sum'
  | 'seq_pages'
  | 'seq_pages_inv'
  | 'seq_fraction_tel'
  | 'seq_periodic'
  // Đề 07: Tổng - Hiệu - Tỉ (sơ đồ đoạn thẳng trực quan)
  | 'sum_diff_ratio'
  | 'ratio_age'
  | 'ratio_both_change'
  | 'ratio_three'
  | 'ratio_fraction_cloth'
  // Đề 08: Tỉ số phần trăm & Thực tế
  | 'percentage_app'
  | 'pct_solution'
  | 'pct_seed'
  | 'pct_two_items'
  | 'pct_double_disc'
  // Đề 09: Chuyển động đều
  | 'motion_physics'
  | 'motion_chase'
  | 'motion_train'
  | 'motion_river'
  | 'motion_two_speeds'
  // Đề 10: Tỉ lệ bản đồ & Địa hình thực tế
  | 'map_scale_diagram'
  | 'map_rect_area'
  | 'map_dual_scale'
  | 'map_trap_land'
  | 'map_tri_land';

export interface ConquerSvgData {
  val1?: string;
  val2?: string;
  val3?: string;
  val4?: string;
}

const renderSvgTextWithSup = (text: string) => {
  const parts = text.split(/(cm²|dm²|m²|cm³|dm³|m³)/g);
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

export const ConquerIllustration: React.FC<{
  svgType: ConquerSvgType;
  svgData?: ConquerSvgData;
}> = ({ svgType, svgData }) => {
  const v1 = svgData?.val1 || '';
  const v2 = svgData?.val2 || '';
  const v3 = svgData?.val3 || '';
  const v4 = svgData?.val4 || '';

  return (
    <div className="w-full h-44 sm:h-48 bg-slate-900/95 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden border border-slate-700 shadow-inner">
      <svg viewBox="0 0 320 168" className="w-full h-full max-h-44 select-none">
        {/* ==================== ĐỀ 01: TAM GIÁC ==================== */}
        {svgType === 'tri_extend' && (
          <g>
            <polygon points="45,130 185,130 135,28" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.4" />
            <polygon points="185,130 255,130 135,28" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <line x1="135" y1="28" x2="135" y2="130" stroke="#FBBF24" strokeWidth="1.8" strokeDasharray="3 3" />
            <polyline points="135,121 144,121 144,130" fill="none" stroke="#FBBF24" strokeWidth="1.4" />
            <text x="131" y="21" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="34" y="143" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="181" y="143" fill="#38BDF8" fontSize="12" fontWeight="bold">C</text>
            <text x="257" y="143" fill="#F43F5E" fontSize="12" fontWeight="bold">D</text>
            <text x="112" y="102" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="218" y="104" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
            <text x="115" y="148" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v3}</text>
            <text x="220" y="148" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">{v4}</text>
          </g>
        )}

        {svgType === 'tri_ceva' && (
          <g>
            <polygon points="45,134 255,134 150,24" fill="rgba(56, 189, 248, 0.16)" stroke="#38BDF8" strokeWidth="2.4" />
            <polygon points="185,61 150,134 255,134" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.2" />
            <line x1="150" y1="24" x2="150" y2="134" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="4 3" />
            <text x="146" y="18" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="33" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="260" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="192" y="57" fill="#FDA4AF" fontSize="12" fontWeight="bold">M</text>
            <text x="146" y="149" fill="#FDE047" fontSize="12" fontWeight="bold">N</text>
            <text x="86" y="104" fill="#BAE6FD" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="210" y="120" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'tri_percent' && (
          <g>
            <polygon points="50,128 210,128 130,30" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.3" />
            <polygon points="50,128 245,128 130,50" fill="rgba(245, 158, 11, 0.22)" stroke="#FBBF24" strokeWidth="2.2" strokeDasharray="4 3" />
            <line x1="130" y1="30" x2="130" y2="128" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="148" y="45" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="155" y="146" textAnchor="middle" fill="#86EFAC" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="18" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontWeight="bold">{v3}</text>
          </g>
        )}

        {svgType === 'tri_midpoint' && (
          <g>
            <polygon points="50,134 265,134 155,22" fill="rgba(56, 189, 248, 0.16)" stroke="#38BDF8" strokeWidth="2.3" />
            <polygon points="157,134 210,78 102,78" fill="rgba(16, 185, 129, 0.45)" stroke="#10B981" strokeWidth="2.3" />
            <text x="151" y="17" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="38" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="270" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="89" y="78" fill="#86EFAC" fontSize="12" fontWeight="bold">P</text>
            <text x="216" y="78" fill="#86EFAC" fontSize="12" fontWeight="bold">N</text>
            <text x="152" y="149" fill="#86EFAC" fontSize="12" fontWeight="bold">M</text>
            <text x="156" y="102" textAnchor="middle" fill="#ECFDF5" fontSize="11" fontWeight="bold">{v2}</text>
            <text x="252" y="34" textAnchor="end" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
          </g>
        )}

        {svgType === 'tri_quad_cut' && (
          <g>
            <polygon points="50,134 265,134 145,22" fill="rgba(56, 189, 248, 0.18)" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="50,134 265,134 235,106 113,59" fill="rgba(244, 63, 94, 0.38)" stroke="#F43F5E" strokeWidth="2.2" />
            <line x1="113" y1="59" x2="235" y2="106" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="113" y1="59" x2="265" y2="134" stroke="#94A3B8" strokeWidth="1.4" strokeDasharray="3 3" />
            <text x="142" y="17" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="38" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="270" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="99" y="57" fill="#FDE047" fontSize="12" fontWeight="bold">D</text>
            <text x="241" y="104" fill="#FDE047" fontSize="12" fontWeight="bold">E</text>
            <text x="150" y="114" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">{v2}</text>
            <text x="275" y="28" textAnchor="end" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
          </g>
        )}

        {svgType === 'tri_median_ray' && (
          <g>
            <polygon points="48,134 262,134 150,24" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="48,134 188,61 150,24" fill="rgba(245, 158, 11, 0.35)" stroke="#FBBF24" strokeWidth="2.2" />
            <line x1="150" y1="24" x2="155" y2="134" stroke="#94A3B8" strokeWidth="1.8" strokeDasharray="4 3" />
            <line x1="48" y1="134" x2="188" y2="61" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <circle cx="152" cy="79" r="3" fill="#F43F5E" />
            <text x="146" y="17" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="36" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="267" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="151" y="149" fill="#CBD5E1" fontSize="12" fontWeight="bold">M</text>
            <text x="140" y="75" fill="#FDA4AF" fontSize="12" fontWeight="bold">N</text>
            <text x="193" y="59" fill="#FDE047" fontSize="12" fontWeight="bold">K</text>
            <text x="128" y="64" fill="#FDE68A" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="265" y="28" textAnchor="end" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
          </g>
        )}

        {svgType === 'tri_right_parallel' && (
          <g>
            <polygon points="65,24 65,134 255,134" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="2.4" />
            <line x1="65" y1="98" x2="127" y2="98" stroke="#F43F5E" strokeWidth="2.4" strokeDasharray="4 2" />
            <line x1="65" y1="134" x2="127" y2="98" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="3 3" />
            <polyline points="65,124 75,124 75,134" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
            <polyline points="65,89 74,89 74,98" fill="none" stroke="#F43F5E" strokeWidth="1.5" />
            <text x="54" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="58" y="20" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="262" y="142" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="48" y="102" fill="#FDA4AF" fontSize="12" fontWeight="bold">M</text>
            <text x="134" y="96" fill="#FDA4AF" fontSize="12" fontWeight="bold">N</text>
            <text x="16" y="76" fill="#BAE6FD" fontSize="10" fontWeight="bold">{v1}</text>
            <text x="160" y="152" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="98" y="92" textAnchor="middle" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{v3}</text>
          </g>
        )}

        {svgType === 'tri_extend_all' && (
          <g>
            <polygon points="120,104 195,104 155,58" fill="rgba(56, 189, 248, 0.35)" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="102,126 270,104 138,34" fill="rgba(244, 63, 94, 0.18)" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="155" y1="58" x2="102" y2="126" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="120" y1="104" x2="270" y2="104" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="195" y1="104" x2="138" y2="34" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="162" y="54" fill="#FFFFFF" fontSize="11" fontWeight="bold">A</text>
            <text x="112" y="100" fill="#FFFFFF" fontSize="11" fontWeight="bold">B</text>
            <text x="197" y="116" fill="#FFFFFF" fontSize="11" fontWeight="bold">C</text>
            <text x="89" y="135" fill="#FDA4AF" fontSize="11" fontWeight="bold">M</text>
            <text x="275" y="108" fill="#FDA4AF" fontSize="11" fontWeight="bold">N</text>
            <text x="132" y="27" fill="#FDA4AF" fontSize="11" fontWeight="bold">P</text>
            <text x="157" y="92" textAnchor="middle" fill="#BAE6FD" fontSize="9.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="160" y="154" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'tri_inner_o' && (
          <g>
            <polygon points="48,134 264,134 152,22" fill="rgba(56, 189, 248, 0.16)" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="48,134 176,84 152,22" fill="rgba(244, 63, 94, 0.4)" stroke="#F43F5E" strokeWidth="2.2" />
            <line x1="152" y1="22" x2="210" y2="134" stroke="#FBBF24" strokeWidth="1.8" strokeDasharray="4 2" />
            <line x1="48" y1="134" x2="208" y2="78" stroke="#FBBF24" strokeWidth="1.8" strokeDasharray="4 2" />
            <circle cx="176" cy="84" r="3" fill="#FDE047" />
            <text x="148" y="17" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="36" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="269" y="146" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="206" y="149" fill="#FDE047" fontSize="12" fontWeight="bold">M</text>
            <text x="213" y="76" fill="#FDE047" fontSize="12" fontWeight="bold">N</text>
            <text x="180" y="96" fill="#FDE047" fontSize="11.5" fontWeight="bold">O</text>
            <text x="122" y="88" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="275" y="28" textAnchor="end" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
          </g>
        )}

        {svgType === 'tri_in_rect' && (
          <g>
            <rect x="65" y="26" width="190" height="114" fill="rgba(56, 189, 248, 0.16)" stroke="#38BDF8" strokeWidth="2.2" />
            <polygon points="140,26 65,72 255,140" fill="rgba(244, 63, 94, 0.45)" stroke="#F43F5E" strokeWidth="2.4" />
            <text x="53" y="24" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">A</text>
            <text x="260" y="24" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">B</text>
            <text x="260" y="146" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">C</text>
            <text x="53" y="146" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">D</text>
            <text x="137" y="19" fill="#FDE047" fontSize="11.5" fontWeight="bold">M</text>
            <text x="52" y="76" fill="#FDE047" fontSize="11.5" fontWeight="bold">N</text>
            <text x="160" y="92" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">{v3}</text>
            <text x="160" y="156" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="278" y="86" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {/* ==================== ĐỀ 02: HÌNH TRÒN ==================== */}
        {svgType === 'circle_in_sq' && (
          <g>
            <rect x="92" y="18" width="124" height="124" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.4" />
            <circle cx="154" cy="80" r="62" fill="#0f172a" stroke="#38BDF8" strokeWidth="2.4" />
            <circle cx="154" cy="80" r="3" fill="#FBBF24" />
            <line x1="154" y1="80" x2="216" y2="80" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
            <text x="184" y="74" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="154" y="158" textAnchor="middle" fill="#FCA5A5" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="64" y="34" textAnchor="end" fill="#FDA4AF" fontSize="10" fontWeight="bold">Phần tô màu: ?</text>
          </g>
        )}

        {svgType === 'sq_in_circle' && (
          <g>
            <circle cx="155" cy="80" r="62" fill="rgba(56, 189, 248, 0.22)" stroke="#38BDF8" strokeWidth="2.4" />
            <polygon points="155,18 217,80 155,142 93,80" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2.4" />
            <line x1="93" y1="80" x2="217" y2="80" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="155" cy="80" r="3" fill="#FBBF24" />
            <text x="185" y="74" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="155" y="158" textAnchor="middle" fill="#FDA4AF" fontSize="11" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'circle_ring' && (
          <g>
            <circle cx="155" cy="80" r="64" fill="rgba(168, 85, 247, 0.45)" stroke="#A855F7" strokeWidth="2.4" />
            <circle cx="155" cy="80" r="38" fill="#0f172a" stroke="#F43F5E" strokeWidth="2.4" />
            <circle cx="155" cy="80" r="3" fill="#FBBF24" />
            <line x1="155" y1="80" x2="219" y2="80" stroke="#E9D5FF" strokeWidth="2" />
            <line x1="155" y1="80" x2="155" y2="42" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="3 2" />
            <text x="190" y="74" textAnchor="middle" fill="#E9D5FF" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="60" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="155" y="158" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v3 || 'Phần tô màu = ?')}</text>
          </g>
        )}

        {svgType === 'sq_area_to_circle' && (
          <g>
            <circle cx="155" cy="80" r="62" fill="rgba(56, 189, 248, 0.3)" stroke="#38BDF8" strokeWidth="2.4" />
            <polygon points="155,18 217,80 155,142 93,80" fill="#0f172a" stroke="#FBBF24" strokeWidth="2.4" />
            <line x1="93" y1="80" x2="217" y2="80" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="155" y1="18" x2="155" y2="142" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="155" y="84" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="155" y="158" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'circle_area_to_sq' && (
          <g>
            <rect x="93" y="18" width="124" height="124" fill="rgba(244, 63, 94, 0.45)" stroke="#F43F5E" strokeWidth="2.4" />
            <circle cx="155" cy="80" r="62" fill="#0f172a" stroke="#38BDF8" strokeWidth="2.4" />
            <text x="155" y="84" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="155" y="158" textAnchor="middle" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'circle_petal' && (
          <g>
            <rect x="95" y="18" width="120" height="120" fill="rgba(56, 189, 248, 0.14)" stroke="#38BDF8" strokeWidth="2.2" />
            {/* Cánh hoa giao của 2 phần tư đường tròn */}
            <path d="M 95,138 A 120,120 0 0,0 215,18 A 120,120 0 0,0 95,138 Z" fill="rgba(244, 63, 94, 0.5)" stroke="#F43F5E" strokeWidth="2.2" />
            <text x="82" y="20" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">A</text>
            <text x="220" y="20" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">B</text>
            <text x="220" y="144" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">C</text>
            <text x="82" y="144" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">D</text>
            <text x="155" y="82" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">Cánh hoa: ?</text>
            <text x="155" y="156" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">{v1}</text>
          </g>
        )}

        {svgType === 'rect_minus_semi' && (
          <g>
            <rect x="75" y="34" width="170" height="86" fill="rgba(244, 63, 94, 0.4)" stroke="#F43F5E" strokeWidth="2.2" />
            <path d="M 75,34 A 85,85 0 0,0 245,34 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2.2" strokeDasharray="4 2" />
            <text x="160" y="25" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="253" y="80" fill="#FDA4AF" fontSize="11" fontWeight="bold">{v2}</text>
            <text x="160" y="144" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">Phần còn lại tô màu: ?</text>
          </g>
        )}

        {svgType === 'sq_four_quarters' && (
          <g>
            <rect x="95" y="18" width="120" height="120" fill="rgba(244, 63, 94, 0.45)" stroke="#F43F5E" strokeWidth="2.2" />
            <path d="M 95,18 L 155,18 A 60,60 0 0,1 95,78 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 215,18 L 215,78 A 60,60 0 0,1 155,18 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 215,138 L 155,138 A 60,60 0 0,1 215,78 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 95,138 L 95,78 A 60,60 0 0,1 155,138 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2" />
            <text x="155" y="82" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">Phần giữa: ?</text>
            <text x="155" y="156" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">{v1}</text>
          </g>
        )}

        {svgType === 'semi_crescents' && (
          <g>
            <path d="M 55,122 A 105,105 0 0,1 265,122 Z" fill="rgba(244, 63, 94, 0.45)" stroke="#F43F5E" strokeWidth="2.4" />
            <path d="M 55,122 A 63,63 0 0,1 181,122 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 181,122 A 42,42 0 0,1 265,122 Z" fill="#0f172a" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
            <text x="44" y="128" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">A</text>
            <text x="177" y="138" fill="#FDE047" fontSize="11.5" fontWeight="bold">C</text>
            <text x="270" y="128" fill="#FFFFFF" fontSize="11.5" fontWeight="bold">B</text>
            <text x="118" y="114" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="bold">{v1}</text>
            <text x="223" y="114" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="160" y="54" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">Phần tô màu: ?</text>
          </g>
        )}

        {svgType === 'ring_inverse' && (
          <g>
            <circle cx="155" cy="80" r="64" fill="rgba(168, 85, 247, 0.45)" stroke="#A855F7" strokeWidth="2.4" />
            <circle cx="155" cy="80" r="38" fill="#0f172a" stroke="#F43F5E" strokeWidth="2.4" />
            <circle cx="155" cy="80" r="3" fill="#FBBF24" />
            <line x1="155" y1="80" x2="219" y2="80" stroke="#E9D5FF" strokeWidth="2" />
            <line x1="155" y1="80" x2="155" y2="42" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="3 2" />
            <text x="190" y="74" textAnchor="middle" fill="#E9D5FF" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="60" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="155" y="158" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
          </g>
        )}

        {/* ==================== ĐỀ 03: HÌNH CHỮ NHẬT & HÌNH VUÔNG ==================== */}
        {svgType === 'rect_to_sq' && (
          <g>
            <rect x="55" y="42" width="165" height="62" fill="rgba(249, 115, 22, 0.28)" stroke="#F97316" strokeWidth="2.3" />
            <rect x="55" y="42" width="124" height="100" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeDasharray="4 3" />
            <text x="116" y="76" textAnchor="middle" fill="#FED7AA" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="198" y="34" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="116" y="128" textAnchor="middle" fill="#86EFAC" fontSize="10" fontWeight="bold">{v3}</text>
          </g>
        )}

        {svgType === 'rect_pct' && (
          <g>
            <rect x="65" y="38" width="140" height="72" fill="rgba(249, 115, 22, 0.25)" stroke="#F97316" strokeWidth="2.3" />
            <rect x="65" y="38" width="172" height="92" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeDasharray="4 3" />
            <text x="135" y="78" textAnchor="middle" fill="#FED7AA" fontSize="11" fontWeight="bold">Diện tích: 100%</text>
            <text x="223" y="78" fill="#86EFAC" fontSize="10" fontWeight="bold">{v1}</text>
            <text x="145" y="148" textAnchor="middle" fill="#86EFAC" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'rect_add_len' && (
          <g>
            <rect x="50" y="42" width="150" height="76" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.3" />
            <rect x="200" y="42" width="60" height="76" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <text x="125" y="84" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="230" y="84" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
            <text x="230" y="32" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v3}</text>
            <text x="155" y="144" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontWeight="bold">Chu vi ban đầu: ?</text>
          </g>
        )}

        {svgType === 'sq_expand_both' && (
          <g>
            <rect x="80" y="28" width="90" height="90" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.3" />
            <rect x="170" y="28" width="38" height="90" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="80" y="118" width="90" height="32" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="170" y="118" width="38" height="32" fill="rgba(245, 158, 11, 0.5)" stroke="#FBBF24" strokeWidth="2" />
            <text x="125" y="76" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">Cạnh: ?</text>
            <text x="189" y="138" textAnchor="middle" fill="#FEF3C7" fontSize="9.5" fontWeight="bold">{v1}</text>
            <text x="256" y="84" textAnchor="middle" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'rect_perim_change' && (
          <g>
            <rect x="55" y="34" width="160" height="96" fill="rgba(56, 189, 248, 0.22)" stroke="#38BDF8" strokeWidth="2.3" />
            <rect x="55" y="54" width="200" height="76" fill="none" stroke="#FBBF24" strokeWidth="2.2" strokeDasharray="4 3" />
            <text x="135" y="86" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="235" y="96" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="155" y="24" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">{v3}</text>
            <text x="155" y="152" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontWeight="bold">Diện tích ban đầu: ?</text>
          </g>
        )}

        {svgType === 'rect_expand_both' && (
          <g>
            <rect x="65" y="26" width="140" height="84" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.3" />
            <rect x="205" y="26" width="38" height="84" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="65" y="110" width="140" height="32" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="205" y="110" width="38" height="32" fill="rgba(245, 158, 11, 0.5)" stroke="#FBBF24" strokeWidth="2" />
            <text x="135" y="72" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="224" y="130" textAnchor="middle" fill="#FEF3C7" fontSize="9.5" fontWeight="bold">{v2}</text>
            <text x="275" y="76" textAnchor="middle" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
          </g>
        )}

        {svgType === 'rect_pct_inv' && (
          <g>
            <rect x="65" y="34" width="150" height="90" fill="rgba(56, 189, 248, 0.22)" stroke="#38BDF8" strokeWidth="2.3" />
            <rect x="65" y="48" width="185" height="76" fill="rgba(244, 63, 94, 0.2)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 3" />
            <text x="145" y="88" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="145" y="24" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="155" y="150" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">Diện tích ban đầu: ?</text>
          </g>
        )}

        {svgType === 'rect_4_squares' && (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={60 + i * 50}
                y="50"
                width="50"
                height="50"
                fill="rgba(249, 115, 22, 0.28)"
                stroke="#F97316"
                strokeWidth="2.2"
              />
            ))}
            <text x="160" y="36" textAnchor="middle" fill="#FED7AA" fontSize="11" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="160" y="124" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="160" y="144" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">Chu vi hình chữ nhật: ?</text>
          </g>
        )}

        {svgType === 'sq_cut_both' && (
          <g>
            <rect x="92" y="22" width="120" height="120" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <rect x="92" y="42" width="90" height="100" fill="rgba(56, 189, 248, 0.35)" stroke="#38BDF8" strokeWidth="2.3" />
            <text x="137" y="96" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">Cạnh: ?</text>
            <text x="197" y="92" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold">{v1}</text>
            <text x="152" y="36" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="152" y="158" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
          </g>
        )}

        {svgType === 'rect_inner_path' && (
          <g>
            <rect x="60" y="24" width="200" height="114" fill="rgba(148, 163, 184, 0.3)" stroke="#CBD5E1" strokeWidth="2.2" />
            <rect x="82" y="42" width="156" height="78" fill="rgba(16, 185, 129, 0.45)" stroke="#10B981" strokeWidth="2.4" />
            <text x="160" y="84" textAnchor="middle" fill="#ECFDF5" fontSize="11" fontWeight="bold">Đất trồng cây: ?</text>
            <text x="160" y="16" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="270" y="84" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="160" y="156" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v3}</text>
          </g>
        )}

        {/* ==================== ĐỀ 04: HÌNH THANG ==================== */}
        {svgType === 'trap_butterfly_basic' && (
          <g>
            <polygon points="90,34 210,34 258,128 42,128" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" strokeWidth="2.4" />
            <line x1="90" y1="34" x2="258" y2="128" stroke="#F59E0B" strokeWidth="2" />
            <line x1="210" y1="34" x2="42" y2="128" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="150" cy="70" r="3" fill="#EF4444" />
            <text x="148" y="63" fill="#FDE047" fontSize="11.5" fontWeight="bold">O</text>
            <text x="80" y="28" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="215" y="28" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="263" y="133" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="29" y="133" fill="#FFFFFF" fontSize="12" fontWeight="bold">D</text>
            <text x="150" y="48" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="198" y="86" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
            <text x="150" y="152" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">Diện tích ABCD: ?</text>
          </g>
        )}

        {svgType === 'trap_extend_base' && (
          <g>
            <polygon points="82,36 184,36 218,126 42,126" fill="rgba(16, 185, 129, 0.24)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="218,126 270,126 184,36" fill="rgba(244, 63, 94, 0.4)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <line x1="82" y1="36" x2="82" y2="126" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="3 3" />
            <polyline points="82,118 90,118 90,126" fill="none" stroke="#FBBF24" strokeWidth="1.4" />
            <text x="133" y="26" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="130" y="144" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="246" y="144" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">{v3}</text>
            <text x="248" y="82" fill="#FECDD3" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v4)}</text>
          </g>
        )}

        {svgType === 'trap_ratio_o' && (
          <g>
            <polygon points="96,34 204,34 256,128 44,128" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" strokeWidth="2.4" />
            <line x1="96" y1="34" x2="256" y2="128" stroke="#F59E0B" strokeWidth="2" />
            <line x1="204" y1="34" x2="44" y2="128" stroke="#F59E0B" strokeWidth="2" />
            <text x="150" y="24" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="150" y="52" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
            <text x="150" y="150" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">Diện tích hình thang: ?</text>
          </g>
        )}

        {svgType === 'trap_total_to_cod' && (
          <g>
            <polygon points="104,34 196,34 256,128 44,128" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="150,70 256,128 44,128" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.2" />
            <line x1="104" y1="34" x2="256" y2="128" stroke="#F59E0B" strokeWidth="1.8" />
            <line x1="196" y1="34" x2="44" y2="128" stroke="#F59E0B" strokeWidth="1.8" />
            <text x="150" y="24" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="150" y="114" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">Tam giác dưới: ?</text>
            <text x="150" y="152" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'trap_to_rect' && (
          <g>
            <polygon points="60,34 180,34 246,126 60,126" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="180,34 246,34 246,126" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.2" strokeDasharray="4 2" />
            <polyline points="60,116 70,116 70,126" fill="none" stroke="#10B981" strokeWidth="1.6" />
            <text x="120" y="24" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="153" y="144" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="218" y="64" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
            <text x="36" y="84" fill="#FDE047" fontSize="10.5" fontWeight="bold">Cao: ?</text>
          </g>
        )}

        {svgType === 'trap_change_bases' && (
          <g>
            <polygon points="84,36 196,36 254,126 46,126" fill="rgba(16, 185, 129, 0.22)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="84,36 216,36 218,126 46,126" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 3" />
            <text x="140" y="25" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="150" y="144" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="150" y="86" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
          </g>
        )}

        {svgType === 'trap_mid_side' && (
          <g>
            <polygon points="78,32 196,32 248,130 48,130" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="78,32 222,81 48,130" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="2.4" />
            <circle cx="222" cy="81" r="3.5" fill="#FDE047" />
            <text x="70" y="26" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
            <text x="200" y="26" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
            <text x="254" y="135" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
            <text x="36" y="135" fill="#FFFFFF" fontSize="12" fontWeight="bold">D</text>
            <text x="230" y="82" fill="#FDE047" fontSize="12" fontWeight="bold">M</text>
            <text x="122" y="86" textAnchor="middle" fill="#FECDD3" fontSize="11" fontWeight="bold">Diện tích: ?</text>
            <text x="150" y="152" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
          </g>
        )}

        {svgType === 'trap_split_half' && (
          <g>
            <polygon points="76,34 176,34 252,126 52,126" fill="rgba(16, 185, 129, 0.22)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="76,34 202,126 52,126" fill="rgba(56, 189, 248, 0.35)" stroke="#38BDF8" strokeWidth="2.2" />
            <line x1="76" y1="34" x2="76" y2="126" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="3 3" />
            <text x="126" y="24" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="126" y="144" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="228" y="144" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">CM = ?</text>
            <text x="34" y="84" fill="#FDE047" fontSize="10" fontWeight="bold">{v3}</text>
          </g>
        )}

        {svgType === 'trap_diff_o' && (
          <g>
            <polygon points="100,34 200,34 254,128 46,128" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" strokeWidth="2.4" />
            <polygon points="100,34 200,34 150,70" fill="rgba(56, 189, 248, 0.35)" />
            <polygon points="46,128 254,128 150,70" fill="rgba(244, 63, 94, 0.38)" />
            <line x1="100" y1="34" x2="254" y2="128" stroke="#F59E0B" strokeWidth="1.8" />
            <line x1="200" y1="34" x2="46" y2="128" stroke="#F59E0B" strokeWidth="1.8" />
            <text x="150" y="24" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="150" y="150" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'trap_find_height' && (
          <g>
            <polygon points="94,34 196,34 252,126 48,126" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2.4" />
            <line x1="94" y1="34" x2="252" y2="126" stroke="#F59E0B" strokeWidth="1.8" />
            <line x1="196" y1="34" x2="48" y2="126" stroke="#F59E0B" strokeWidth="1.8" />
            <line x1="94" y1="34" x2="94" y2="126" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" />
            <text x="145" y="24" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="150" y="144" textAnchor="middle" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="58" y="84" fill="#FDA4AF" fontSize="10.5" fontWeight="bold">Cao: ?</text>
            <text x="145" y="52" textAnchor="middle" fill="#FDE047" fontSize="9.5" fontWeight="bold">{renderSvgTextWithSup(v3)}</text>
          </g>
        )}

        {/* ==================== ĐỀ 05: HÌNH KHỐI 3D & NƯỚC DÂNG ==================== */}
        {(svgType === 'cube_paint_0' || svgType === 'cube_paint_1' || svgType === 'cube_paint_inv' || svgType === 'cube_scale_pct') && (
          <g>
            <polygon points="105,46 185,46 185,126 105,126" fill="rgba(59, 130, 246, 0.35)" stroke="#60A5FA" strokeWidth="2.2" />
            <polygon points="105,46 142,18 222,18 185,46" fill="rgba(96, 165, 250, 0.5)" stroke="#93C5FD" strokeWidth="2.2" />
            <polygon points="185,46 222,18 222,98 185,126" fill="rgba(37, 99, 235, 0.45)" stroke="#60A5FA" strokeWidth="2.2" />
            {/* 3 cạnh khuất nét đứt */}
            <line x1="142" y1="18" x2="142" y2="98" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="105" y1="126" x2="142" y2="98" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="142" y1="98" x2="222" y2="98" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            {/* Lưới chia mặt trước */}
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <line x1={105 + i * 20} y1="46" x2={105 + i * 20} y2="126" stroke="#FFFFFF" strokeWidth="0.9" strokeOpacity="0.45" />
                <line x1="105" y1={46 + i * 20} x2="185" y2={46 + i * 20} stroke="#FFFFFF" strokeWidth="0.9" strokeOpacity="0.45" />
              </React.Fragment>
            ))}
            <text x="145" y="144" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="160" y="160" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'box_paint_2' && (
          <g>
            <polygon points="62,52 192,52 192,118 62,118" fill="rgba(59, 130, 246, 0.35)" stroke="#60A5FA" strokeWidth="2.2" />
            <polygon points="62,52 106,22 236,22 192,52" fill="rgba(96, 165, 250, 0.5)" stroke="#93C5FD" strokeWidth="2.2" />
            <polygon points="192,52 236,22 236,88 192,118" fill="rgba(37, 99, 235, 0.45)" stroke="#60A5FA" strokeWidth="2.2" />
            <line x1="106" y1="22" x2="106" y2="88" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="62" y1="118" x2="106" y2="88" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="106" y1="88" x2="236" y2="88" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="4 3" />
            <text x="127" y="138" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="232" y="110" fill="#BAE6FD" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="244" y="60" fill="#BAE6FD" fontSize="10" fontWeight="bold">{v3}</text>
            <text x="160" y="158" textAnchor="middle" fill="#FDA4AF" fontSize="10" fontWeight="bold">Khối sơn đúng 2 mặt: ?</text>
          </g>
        )}

        {(svgType === 'water_rise_rock' || svgType === 'water_5_balls' || svgType === 'water_overflow' || svgType === 'water_drain_cube') && (
          <g>
            <rect x="75" y="34" width="170" height="96" fill="rgba(15, 23, 42, 0.6)" stroke="#38BDF8" strokeWidth="2.4" rx="4" />
            <rect x="75" y="78" width="170" height="52" fill="rgba(14, 165, 233, 0.35)" />
            <rect x="75" y="58" width="170" height="20" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="4 2" />
            {svgType === 'water_5_balls' ? (
              <g>
                {[115, 138, 160, 182, 205].map((cx, idx) => (
                  <circle key={idx} cx={cx} cy="116" r="8" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1.5" />
                ))}
              </g>
            ) : (
              <rect x="136" y="92" width="48" height="36" rx="5" fill="#64748B" stroke="#CBD5E1" strokeWidth="2" />
            )}
            <text x="160" y="72" textAnchor="middle" fill="#FECDD3" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="160" y="150" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            {v3 && <text x="160" y="24" textAnchor="middle" fill="#FDE047" fontSize="10.5" fontWeight="bold">{v3}</text>}
          </g>
        )}

        {svgType === 'water_standing_block' && (
          <g>
            <rect x="65" y="42" width="190" height="90" fill="rgba(15, 23, 42, 0.6)" stroke="#38BDF8" strokeWidth="2.4" rx="4" />
            <rect x="65" y="74" width="190" height="58" fill="rgba(14, 165, 233, 0.35)" />
            <rect x="65" y="60" width="190" height="14" fill="rgba(244, 63, 94, 0.42)" stroke="#F43F5E" strokeWidth="1" strokeDasharray="3 2" />
            {/* Khối đá đứng cao hơn thành bể */}
            <rect x="135" y="18" width="50" height="114" fill="#64748B" stroke="#E2E8F0" strokeWidth="2" />
            <text x="160" y="54" textAnchor="middle" fill="#FDE047" fontSize="9.5" fontWeight="bold">{v2}</text>
            <text x="160" y="152" textAnchor="middle" fill="#BAE6FD" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="275" y="70" fill="#FDA4AF" fontSize="10" fontWeight="bold">Dâng: ?</text>
          </g>
        )}

        {/* ==================== ĐỀ 06: QUY LUẬT DÃY SỐ ==================== */}
        {svgType === 'sequence_pattern' && (
          <g>
            <rect x="22" y="48" width="54" height="38" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <text x="49" y="71" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="bold">Số 1</text>
            <path d="M 78 52 Q 94 30 110 52" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="94" y="34" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontWeight="bold">{v3 || '+ khoảng'}</text>
            <rect x="110" y="48" width="54" height="38" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <text x="137" y="71" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="bold">Số 2</text>
            <path d="M 166 52 Q 182 30 198 52" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <rect x="198" y="48" width="42" height="38" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="219" y="71" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold">...</text>
            <rect x="248" y="48" width="54" height="38" rx="8" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2.4" />
            <text x="275" y="71" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="bold">Số cuối</text>
            <text x="160" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="140" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'seq_sum' && (
          <g>
            <rect x="28" y="36" width="264" height="44" rx="10" fill="rgba(245, 158, 11, 0.16)" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 52 84 L 52 94 L 268 94 L 268 84" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="160" y="63" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="bold">{v1}</text>
            <text x="160" y="114" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="160" y="144" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">{v3 || 'Tổng dãy số: ?'}</text>
          </g>
        )}

        {(svgType === 'seq_pages' || svgType === 'seq_pages_inv') && (
          <g>
            <rect x="44" y="24" width="112" height="84" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.2" />
            <rect x="164" y="24" width="112" height="84" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.2" />
            <line x1="160" y1="24" x2="160" y2="108" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="100" y="54" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">1 chữ số: 1 → 9</text>
            <text x="100" y="76" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">2 chữ số: 10 → 99</text>
            <text x="220" y="64" textAnchor="middle" fill="#fda4af" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="220" y="88" textAnchor="middle" fill="#86efac" fontSize="10.5" fontWeight="bold">{v2}</text>
            <text x="160" y="138" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">{v3 || 'Đánh số trang sách'}</text>
          </g>
        )}

        {svgType === 'seq_fraction_tel' && (
          <g>
            <rect x="24" y="34" width="76" height="44" rx="8" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
            <text x="62" y="60" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="bold">Phân số 1</text>
            <text x="114" y="60" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="bold">+</text>
            <rect x="128" y="34" width="76" height="44" rx="8" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
            <text x="166" y="60" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="bold">Phân số 2</text>
            <text x="218" y="60" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold">+ ... +</text>
            <rect x="234" y="34" width="64" height="44" rx="8" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2.2" />
            <text x="266" y="60" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">Số cuối</text>
            <text x="160" y="108" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="134" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'seq_periodic' && (
          <g>
            {['T', 'O', 'A', 'N', 'H', 'O', 'C'].map((ch, idx) => (
              <g key={idx}>
                <rect x={26 + idx * 39} y="34" width="33" height="36" rx="7" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="2" />
                <text x={42.5 + idx * 39} y="57" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="bold">{ch}</text>
                <text x={42.5 + idx * 39} y="85" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold">{idx + 1}</text>
              </g>
            ))}
            <text x="160" y="114" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="138" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">{v2}</text>
          </g>
        )}

        {/* ==================== ĐỀ 07: TỔNG - HIỆU - TỈ ==================== */}
        {(svgType === 'sum_diff_ratio' || svgType === 'ratio_age' || svgType === 'ratio_both_change') && (
          <g>
            <text x="18" y="42" fill="#cbd5e1" fontSize="11" fontWeight="bold">{v3 || 'Phần bé:'}</text>
            <rect x="86" y="28" width="46" height="22" rx="4" fill="#6366f1" stroke="#818cf8" strokeWidth="1.6" />
            <rect x="134" y="28" width="46" height="22" rx="4" fill="#6366f1" stroke="#818cf8" strokeWidth="1.6" />
            <rect x="182" y="28" width="46" height="22" rx="4" fill="rgba(99, 102, 241, 0.35)" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 2" />

            <text x="18" y="82" fill="#cbd5e1" fontSize="11" fontWeight="bold">{v4 || 'Phần lớn:'}</text>
            <rect x="86" y="68" width="46" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.6" />
            <rect x="134" y="68" width="46" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.6" />
            <rect x="182" y="68" width="46" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.6" />
            <rect x="230" y="68" width="46" height="22" rx="4" fill="rgba(236, 72, 153, 0.35)" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 2" />

            <path d="M 284 28 L 292 59 L 284 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="160" y="122" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="144" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'ratio_three' && (
          <g>
            <text x="20" y="34" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">Đội 1:</text>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={72 + i * 36} y="20" width="34" height="18" rx="4" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="1.4" />
            ))}
            <text x="20" y="64" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">Đội 2:</text>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={72 + i * 36} y="50" width="34" height="18" rx="4" fill="#a855f7" stroke="#c084fc" strokeWidth="1.4" />
            ))}
            <text x="20" y="94" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">Đội 3:</text>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={72 + i * 36} y="80" width="34" height="18" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.4" />
            ))}
            <text x="160" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="146" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'ratio_fraction_cloth' && (
          <g>
            <text x="18" y="42" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">Tấm 1:</text>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={68 + i * 34} y="26" width="32" height="22" rx="4" fill={i < 4 ? '#10b981' : 'rgba(244, 63, 94, 0.35)'} stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            <text x="18" y="82" fill="#cbd5e1" fontSize="10.5" fontWeight="bold">Tấm 2:</text>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={68 + i * 34} y="66" width="32" height="22" rx="4" fill={i < 4 ? '#38bdf8' : 'rgba(244, 63, 94, 0.35)'} stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            <text x="160" y="118" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="142" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {/* ==================== ĐỀ 08: TỈ SỐ PHẦN TRĂM ==================== */}
        {(svgType === 'percentage_app' || svgType === 'pct_double_disc' || svgType === 'pct_two_items') && (
          <g>
            <rect x="34" y="30" width="220" height="30" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
            <rect x="34" y="30" width="140" height="30" rx="8" fill="rgba(244, 63, 94, 0.55)" />
            <text x="104" y="49" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="bold">Giá sau biến đổi</text>
            <text x="214" y="49" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">100%</text>
            <circle cx="280" cy="45" r="18" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text x="280" y="50" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="bold">%</text>
            <text x="160" y="96" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="122" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
            {v3 && <text x="160" y="146" textAnchor="middle" fill="#86efac" fontSize="10.5" fontWeight="bold">{v3}</text>}
          </g>
        )}

        {svgType === 'pct_solution' && (
          <g>
            <rect x="50" y="30" width="84" height="74" rx="6" fill="rgba(15, 23, 42, 0.7)" stroke="#38bdf8" strokeWidth="2.2" />
            <rect x="50" y="58" width="84" height="46" rx="4" fill="rgba(56, 189, 248, 0.35)" />
            <text x="92" y="84" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Dung dịch cũ</text>
            <path d="M 144 68 L 176 68" stroke="#fbbf24" strokeWidth="2.5" />
            <polygon points="176,64 184,68 176,72" fill="#fbbf24" />
            <rect x="190" y="30" width="84" height="74" rx="6" fill="rgba(15, 23, 42, 0.7)" stroke="#10b981" strokeWidth="2.2" />
            <rect x="190" y="48" width="84" height="56" rx="4" fill="rgba(16, 185, 129, 0.35)" />
            <text x="232" y="80" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">Dung dịch mới</text>
            <text x="160" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="148" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'pct_seed' && (
          <g>
            <rect x="36" y="32" width="106" height="54" rx="10" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2.2" />
            <text x="89" y="54" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">Hạt tươi</text>
            <text x="89" y="74" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">{v1}</text>
            <path d="M 148 59 L 176 59" stroke="#fbbf24" strokeWidth="2.4" />
            <polygon points="176,55 184,59 176,63" fill="#fbbf24" />
            <text x="164" y="46" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontWeight="bold">- Nước</text>
            <rect x="190" y="32" width="96" height="54" rx="10" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="2.2" />
            <text x="238" y="54" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">Hạt khô</text>
            <text x="238" y="74" textAnchor="middle" fill="#fed7aa" fontSize="10" fontWeight="bold">{v2}</text>
            <text x="160" y="120" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">Lượng hạt khô nguyên chất không đổi</text>
            <text x="160" y="144" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v3 || 'Khối lượng hạt khô: ?'}</text>
          </g>
        )}

        {/* ==================== ĐỀ 09: CHUYỂN ĐỘNG ĐỀU ==================== */}
        {svgType === 'motion_physics' && (
          <g>
            <line x1="34" y1="68" x2="286" y2="68" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <line x1="34" y1="68" x2="286" y2="68" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="44" cy="68" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <text x="39" y="54" fill="#93c5fd" fontSize="12" fontWeight="bold">A</text>
            <path d="M 56 50 L 96 50" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="96,46 104,50 96,54" fill="#38bdf8" />
            <circle cx="276" cy="68" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="271" y="54" fill="#fca5a5" fontSize="12" fontWeight="bold">B</text>
            <path d="M 264 50 L 224 50" stroke="#f87171" strokeWidth="2.5" />
            <polygon points="224,46 216,50 224,54" fill="#f87171" />
            <text x="160" y="106" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{v1}</text>
            <text x="160" y="130" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'motion_chase' && (
          <g>
            <line x1="30" y1="70" x2="290" y2="70" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="70" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 56 52 L 96 52" stroke="#f87171" strokeWidth="2.5" />
            <polygon points="96,48 104,52 96,56" fill="#f87171" />
            <text x="74" y="42" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">Xe đuổi</text>
            <circle cx="152" cy="70" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 160 52 L 194 52" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="194,48 202,52 194,56" fill="#38bdf8" />
            <text x="176" y="42" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">Xe trước</text>
            <text x="160" y="106" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="130" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'motion_train' && (
          <g>
            <rect x="30" y="42" width="76" height="24" rx="4" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2" />
            <text x="68" y="58" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Đoàn tàu</text>
            <rect x="112" y="54" width="176" height="14" rx="3" fill="rgba(245, 158, 11, 0.35)" stroke="#f59e0b" strokeWidth="2" />
            <text x="200" y="46" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">Cây cầu</text>
            <line x1="26" y1="74" x2="294" y2="74" stroke="#64748b" strokeWidth="3" />
            <text x="160" y="106" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="130" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'motion_river' && (
          <g>
            <rect x="28" y="34" width="264" height="46" rx="8" fill="rgba(14, 165, 233, 0.25)" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 48 48 L 106 48" stroke="#86efac" strokeWidth="2.5" />
            <polygon points="106,44 114,48 106,52" fill="#86efac" />
            <text x="80" y="42" textAnchor="middle" fill="#86efac" fontSize="9.5" fontWeight="bold">Xuôi dòng</text>
            <path d="M 272 64 L 214 64" stroke="#fda4af" strokeWidth="2.5" />
            <polygon points="214,60 206,64 214,68" fill="#fda4af" />
            <text x="240" y="76" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontWeight="bold">Ngược dòng</text>
            <text x="160" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="132" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'motion_two_speeds' && (
          <g>
            <line x1="36" y1="42" x2="284" y2="42" stroke="#38bdf8" strokeWidth="3" />
            <line x1="36" y1="74" x2="284" y2="74" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 3" />
            <circle cx="36" cy="42" r="4" fill="#ffffff" />
            <circle cx="36" cy="74" r="4" fill="#ffffff" />
            <text x="160" y="34" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">{v3 || 'Đi vận tốc 1'}</text>
            <text x="160" y="66" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">{v4 || 'Đi vận tốc 2'}</text>
            <text x="160" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="132" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {/* ==================== ĐỀ 10: TỈ LỆ BẢN ĐỒ ==================== */}
        {(svgType === 'map_scale_diagram' || svgType === 'map_dual_scale') && (
          <g>
            <rect x="34" y="20" width="252" height="82" rx="8" fill="rgba(16, 185, 129, 0.16)" stroke="#10b981" strokeWidth="2" />
            <circle cx="66" cy="60" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="61" y="48" fill="#fca5a5" fontSize="10.5" fontWeight="bold">A</text>
            <circle cx="234" cy="60" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="229" y="48" fill="#fca5a5" fontSize="10.5" fontWeight="bold">B</text>
            <line x1="66" y1="60" x2="234" y2="60" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
            <rect x="166" y="74" width="110" height="20" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.9" />
            <text x="221" y="88" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontWeight="bold">{v3 || 'Tỉ lệ bản đồ'}</text>
            <text x="160" y="124" textAnchor="middle" fill="#86efac" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="146" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{v2}</text>
          </g>
        )}

        {svgType === 'map_rect_area' && (
          <g>
            <rect x="74" y="22" width="172" height="82" rx="4" fill="rgba(16, 185, 129, 0.24)" stroke="#10b981" strokeWidth="2.3" />
            <text x="160" y="68" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold">{v3 || 'Khu đất trên bản đồ'}</text>
            <text x="160" y="124" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v1)}</text>
            <text x="160" y="146" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'map_trap_land' && (
          <g>
            <polygon points="96,24 224,24 260,96 60,96" fill="rgba(16, 185, 129, 0.24)" stroke="#10b981" strokeWidth="2.3" />
            <line x1="96" y1="24" x2="96" y2="96" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
            <text x="160" y="18" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">{v3 || 'Đáy bé'}</text>
            <text x="160" y="120" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="144" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}

        {svgType === 'map_tri_land' && (
          <g>
            <polygon points="62,98 258,98 160,22" fill="rgba(16, 185, 129, 0.24)" stroke="#10b981" strokeWidth="2.3" />
            <line x1="160" y1="22" x2="160" y2="98" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
            <text x="160" y="120" textAnchor="middle" fill="#bae6fd" fontSize="10.5" fontWeight="bold">{v1}</text>
            <text x="160" y="144" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="bold">{renderSvgTextWithSup(v2)}</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default ConquerIllustration;
