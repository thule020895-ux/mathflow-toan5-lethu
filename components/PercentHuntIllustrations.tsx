import React from 'react';
import { PercentHuntVisualType } from './percentHuntData';

interface PercentHuntIllustrationProps {
  visualType: PercentHuntVisualType;
  badgeText: string;
  tagValue: string;
}

const DiscountHangTag: React.FC<{ badgeText: string; x?: number; y?: number }> = ({
  badgeText,
  x = 192,
  y = 20
}) => (
  <g transform={`translate(${x}, ${y}) rotate(8)`}>
    {/* Dây treo thẻ */}
    <path
      d="M 14 14 Q 4 2 0 -8"
      fill="none"
      stroke="#0f766e"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Thẻ giảm giá vàng cam */}
    <rect
      x="0"
      y="8"
      width="74"
      height="42"
      rx="10"
      fill="#f59e0b"
      stroke="#b45309"
      strokeWidth="2.5"
    />
    <circle cx="12" cy="18" r="3.5" fill="#fffbeb" stroke="#b45309" strokeWidth="1.5" />
    <text
      x="41"
      y="35"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="17"
      fontWeight="900"
      fontFamily="Quicksand, sans-serif"
    >
      {badgeText}
    </text>
  </g>
);

const PricePillTag: React.FC<{ tagValue: string; x?: number; y?: number }> = ({
  tagValue,
  x = 14,
  y = 148
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect
      x="0"
      y="0"
      width="116"
      height="32"
      rx="10"
      fill="#ffffff"
      stroke="#0d9488"
      strokeWidth="2.2"
    />
    <text
      x="58"
      y="21"
      textAnchor="middle"
      fill="#0f766e"
      fontSize="14"
      fontWeight="800"
      fontFamily="Quicksand, sans-serif"
    >
      {tagValue}
    </text>
  </g>
);

export const PercentHuntIllustration: React.FC<PercentHuntIllustrationProps> = ({
  visualType,
  badgeText,
  tagValue
}) => {
  return (
    <div className="w-full h-full min-h-[185px] sm:min-h-[210px] rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-amber-50/80 border-2 border-teal-200/80 flex items-center justify-center p-2.5 shadow-inner overflow-hidden">
      <svg
        viewBox="0 0 280 195"
        className="w-full max-w-[270px] h-auto select-none"
        role="img"
        aria-label={`Minh họa bài toán ${tagValue} (${badgeText})`}
      >
        {/* Họa tiết nền nhẹ */}
        <circle cx="52" cy="48" r="34" fill="#ccfbf1" opacity="0.7" />
        <circle cx="222" cy="148" r="36" fill="#fef3c7" opacity="0.8" />

        {visualType === 'school_bag' && (
          <g>
            {/* Tay cầm cặp sách */}
            <path
              d="M 110 42 C 110 24, 152 24, 152 42"
              fill="none"
              stroke="#0f766e"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Thân cặp sách */}
            <rect
              x="66"
              y="44"
              width="130"
              height="104"
              rx="18"
              fill="#14b8a6"
              stroke="#0f766e"
              strokeWidth="3"
            />
            {/* Nắp cặp sách */}
            <path
              d="M 66 60 Q 66 44 84 44 L 178 44 Q 196 44 196 60 L 196 96 Q 131 114 66 96 Z"
              fill="#0d9488"
              stroke="#115e59"
              strokeWidth="2.8"
            />
            {/* Dải phản quang cam */}
            <rect x="86" y="114" width="90" height="16" rx="6" fill="#fb923c" />
            {/* Hai khóa cài */}
            <rect
              x="92"
              y="88"
              width="14"
              height="24"
              rx="4"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="2"
            />
            <rect
              x="156"
              y="88"
              width="14"
              height="24"
              rx="4"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="2"
            />
            {/* Túi bên */}
            <rect x="54" y="84" width="12" height="46" rx="5" fill="#0f766e" />
            <rect x="196" y="84" width="12" height="46" rx="5" fill="#0f766e" />

            <DiscountHangTag badgeText={badgeText} x={186} y={24} />
            <PricePillTag tagValue={tagValue} x={74} y={154} />
          </g>
        )}

        {visualType === 'stationery_kit' && (
          <g>
            {/* Hộp đựng đồ dùng học tập */}
            <rect
              x="54"
              y="86"
              width="148"
              height="62"
              rx="14"
              fill="#0d9488"
              stroke="#115e59"
              strokeWidth="3"
            />
            {/* Thước kẻ vàng */}
            <g transform="translate(72, 28) rotate(-10)">
              <rect
                x="0"
                y="0"
                width="26"
                height="86"
                rx="4"
                fill="#fbbf24"
                stroke="#b45309"
                strokeWidth="2.2"
              />
              <line x1="0" y1="16" x2="9" y2="16" stroke="#78350f" strokeWidth="2" />
              <line x1="0" y1="30" x2="7" y2="30" stroke="#78350f" strokeWidth="2" />
              <line x1="0" y1="44" x2="9" y2="44" stroke="#78350f" strokeWidth="2" />
              <line x1="0" y1="58" x2="7" y2="58" stroke="#78350f" strokeWidth="2" />
            </g>
            {/* Bút chì cam */}
            <g transform="translate(115, 22) rotate(6)">
              <rect
                x="0"
                y="14"
                width="16"
                height="72"
                rx="2"
                fill="#f97316"
                stroke="#9a3412"
                strokeWidth="2"
              />
              <polygon points="0,14 8,0 16,14" fill="#fde68a" stroke="#9a3412" strokeWidth="2" />
              <polygon points="5,5 8,0 11,5" fill="#1e293b" />
            </g>
            {/* Ê-ke xanh ngọc nhạt */}
            <g transform="translate(142, 34) rotate(8)">
              <polygon
                points="0,66 0,0 50,66"
                fill="#5eead4"
                stroke="#0f766e"
                strokeWidth="2.2"
              />
              <polygon points="12,52 12,26 30,52" fill="#ecfeff" stroke="#0f766e" strokeWidth="1.5" />
            </g>
            {/* Nhãn trang trí trên hộp */}
            <rect x="76" y="106" width="104" height="22" rx="8" fill="#ccfbf1" />
            <text
              x="128"
              y="122"
              textAnchor="middle"
              fill="#0f766e"
              fontSize="11.5"
              fontWeight="800"
              fontFamily="Quicksand, sans-serif"
            >
              ĐỒ DÙNG HỌC TẬP
            </text>

            <DiscountHangTag badgeText={badgeText} x={188} y={22} />
            <PricePillTag tagValue={tagValue} x={70} y={154} />
          </g>
        )}

        {(visualType === 'sports_club' || visualType === 'art_club') && (
          <g>
            {/* Bảng CLB nổi bật phía sau */}
            <rect
              x="40"
              y="22"
              width="200"
              height="42"
              rx="12"
              fill="#0f766e"
              stroke="#115e59"
              strokeWidth="2.5"
            />
            <text
              x="140"
              y="48"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="900"
              fontFamily="Quicksand, sans-serif"
            >
              {visualType === 'art_club' ? 'CLB MỸ THUẬT' : 'CLB THỂ THAO'} · {badgeText}
            </text>

            {/* 3 học sinh lớp 5 */}
            {[
              { cx: 82, shirt: '#14b8a6', hair: '#1e293b' },
              { cx: 140, shirt: '#f97316', hair: '#334155' },
              { cx: 198, shirt: '#10b981', hair: '#1e293b' }
            ].map((kid, idx) => (
              <g key={idx}>
                {/* Thân áo */}
                <path
                  d={`M ${kid.cx - 20} 142 C ${kid.cx - 20} 112, ${kid.cx + 20} 112, ${kid.cx + 20} 142 Z`}
                  fill={kid.shirt}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                {/* Đầu */}
                <circle
                  cx={kid.cx}
                  cy="96"
                  r="16"
                  fill="#fde68a"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                {/* Tóc */}
                <path
                  d={`M ${kid.cx - 15} 94 C ${kid.cx - 14} 78, ${kid.cx + 14} 78, ${kid.cx + 15} 94 C ${kid.cx + 6} 86, ${kid.cx - 6} 86, ${kid.cx - 15} 94 Z`}
                  fill={kid.hair}
                />
                {/* Mắt & Nụ cười */}
                <circle cx={kid.cx - 5} cy="97" r="2" fill="#0f172a" />
                <circle cx={kid.cx + 5} cy="97" r="2" fill="#0f172a" />
                <path
                  d={`M ${kid.cx - 4} 103 Q ${kid.cx} 107 ${kid.cx + 4} 103`}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* Quả bóng đá hoặc bảng màu */}
            {visualType === 'sports_club' ? (
              <g transform="translate(222, 128)">
                <circle cx="16" cy="16" r="15" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
                <polygon points="16,9 22,14 20,21 12,21 10,14" fill="#0f172a" />
              </g>
            ) : (
              <g transform="translate(216, 122)">
                <ellipse cx="20" cy="18" rx="19" ry="14" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
                <circle cx="12" cy="14" r="3.5" fill="#ef4444" />
                <circle cx="22" cy="12" r="3.5" fill="#10b981" />
                <circle cx="28" cy="20" r="3.5" fill="#3b82f6" />
              </g>
            )}

            <PricePillTag tagValue={tagValue} x={82} y={154} />
          </g>
        )}

        {visualType === 'ergonomic_backpack' && (
          <g>
            {/* Quai đeo ba lô */}
            <path
              d="M 94 40 C 86 24, 174 24, 166 40"
              fill="none"
              stroke="#0f766e"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Quai phụ hai bên */}
            <path
              d="M 72 64 C 50 76, 52 128, 72 136"
              fill="none"
              stroke="#0d9488"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 188 64 C 210 76, 208 128, 188 136"
              fill="none"
              stroke="#0d9488"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Thân ba lô chống gù cứng cáp */}
            <rect
              x="72"
              y="38"
              width="116"
              height="112"
              rx="22"
              fill="#0d9488"
              stroke="#115e59"
              strokeWidth="3"
            />
            {/* Ngăn hộp phía trước */}
            <rect
              x="86"
              y="76"
              width="88"
              height="60"
              rx="14"
              fill="#14b8a6"
              stroke="#0f766e"
              strokeWidth="2.5"
            />
            {/* Dải phản quang an toàn cam */}
            <rect x="96" y="88" width="68" height="11" rx="5.5" fill="#fbbf24" />
            {/* Ngăn kéo trên */}
            <path
              d="M 88 58 L 172 58"
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Khuy khóa kéo */}
            <circle cx="130" cy="58" r="5" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />

            <DiscountHangTag badgeText={badgeText} x={188} y={24} />
            <PricePillTag tagValue={tagValue} x={72} y={154} />
          </g>
        )}

        {visualType === 'book_set' && (
          <g>
            {/* 3 quyển sách xếp nghiêng */}
            <rect
              x="56"
              y="46"
              width="36"
              height="102"
              rx="6"
              fill="#0d9488"
              stroke="#115e59"
              strokeWidth="2.5"
            />
            <rect
              x="96"
              y="36"
              width="40"
              height="112"
              rx="6"
              fill="#f97316"
              stroke="#9a3412"
              strokeWidth="2.5"
            />
            <rect
              x="140"
              y="52"
              width="38"
              height="96"
              rx="6"
              fill="#10b981"
              stroke="#065f46"
              strokeWidth="2.5"
            />
            <rect x="64" y="64" width="20" height="14" rx="3" fill="#ccfbf1" />
            <rect x="104" y="56" width="24" height="16" rx="3" fill="#ffedd5" />
            <rect x="148" y="70" width="22" height="14" rx="3" fill="#d1fae5" />

            <DiscountHangTag badgeText={badgeText} x={184} y={24} />
            <PricePillTag tagValue={tagValue} x={70} y={154} />
          </g>
        )}

        {visualType === 'desk_lamp' && (
          <g>
            {/* Đế đèn */}
            <rect
              x="76"
              y="132"
              width="84"
              height="16"
              rx="8"
              fill="#0f766e"
              stroke="#115e59"
              strokeWidth="2.5"
            />
            {/* Thân đèn */}
            <path
              d="M 106 132 L 88 74 L 146 48"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Chụp đèn */}
            <path
              d="M 134 40 L 176 58 L 160 80 L 128 62 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Ánh sáng */}
            <polygon points="132,64 162,78 182,124 114,110" fill="#fef08a" opacity="0.45" />

            <DiscountHangTag badgeText={badgeText} x={188} y={24} />
            <PricePillTag tagValue={tagValue} x={72} y={154} />
          </g>
        )}

        {visualType === 'sports_shoes' && (
          <g>
            {/* Chiếc giày thể thao */}
            <path
              d="M 56 122 L 56 96 Q 58 80 76 82 L 106 60 Q 120 74 138 90 L 182 98 Q 198 104 196 124 L 56 124 Z"
              fill="#0d9488"
              stroke="#115e59"
              strokeWidth="3"
            />
            {/* Đế giày */}
            <rect
              x="54"
              y="122"
              width="144"
              height="18"
              rx="8"
              fill="#ffffff"
              stroke="#0f766e"
              strokeWidth="2.5"
            />
            {/* Sọc trang trí cam */}
            <path d="M 102 82 L 122 114" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
            <path d="M 118 86 L 138 114" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />

            <DiscountHangTag badgeText={badgeText} x={188} y={24} />
            <PricePillTag tagValue={tagValue} x={72} y={154} />
          </g>
        )}
      </svg>
    </div>
  );
};

export default PercentHuntIllustration;
