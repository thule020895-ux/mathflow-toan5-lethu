import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Compass, 
  Ruler, 
  Navigation, 
  Maximize2, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Layers, 
  Grid,
  Building,
  School,
  Shuffle,
  ChevronRight
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';
import confetti from 'canvas-confetti';

type ScaleTab = 'visual' | 'theory_types' | 'practice';

interface CityPair {
  nameA: string;
  nameB: string;
  realDistanceKm: number; // km
  desc: string;
}

const CITY_PAIRS: CityPair[] = [
  { nameA: 'Hà Nội', nameB: 'Hải Phòng', realDistanceKm: 102, desc: 'Tuyến cao tốc phía Bắc' },
  { nameA: 'Hà Nội', nameB: 'Đà Nẵng', realDistanceKm: 764, desc: 'Tuyến Bắc - Trung Bộ' },
  { nameA: 'Đà Nẵng', nameB: 'TP. Hồ Chí Minh', realDistanceKm: 850, desc: 'Dọc dải đất miền Trung' },
  { nameA: 'TP. Hồ Chí Minh', nameB: 'Cần Thơ', realDistanceKm: 165, desc: 'Cửa ngõ Đồng bằng sông Cửu Long' },
  { nameA: 'Hà Nội', nameB: 'TP. Hồ Chí Minh', realDistanceKm: 1720, desc: 'Tuyến xuyên Việt huyết mạch' }
];

const PRESET_SCALES = [
  { label: '1 : 1 000', value: 1000, desc: 'Bản đồ quy hoạch trường học, sân vận động' },
  { label: '1 : 10 000', value: 10000, desc: 'Bản đồ một phường, xã, thị trấn' },
  { label: '1 : 100 000', value: 100000, desc: 'Bản đồ quận, huyện hoặc thành phố' },
  { label: '1 : 1 000 000', value: 1000000, desc: 'Bản đồ giao thông liên tỉnh (1cm = 10km)' },
  { label: '1 : 2 000 000', value: 2000000, desc: 'Bản đồ toàn cảnh Việt Nam (1cm = 20km)' }
];

interface PracticeQuestion {
  id: number;
  type: 'real' | 'map' | 'ratio' | 'area';
  title: string;
  question: string;
  expectedNum: number;
  unit: string;
  hint: string;
  explanation: string;
}

const PRACTICE_POOL: PracticeQuestion[] = [
  {
    id: 1,
    type: 'real',
    title: 'Khoảng cách giữa hai thành phố',
    question: 'Trên bản đồ tỉ lệ 1 : 1 000 000, quãng đường từ Hà Nội đến Hải Phòng đo được là 10,2 cm. Hỏi trên thực tế quãng đường đó dài bao nhiêu ki-lô-mét?',
    expectedNum: 102,
    unit: 'km',
    hint: 'Khoảng cách thực tế = Khoảng cách bản đồ × Mẫu số tỉ lệ. Nhớ đổi từ cm sang km (1 km = 100 000 cm).',
    explanation: 'Khoảng cách thực tế là: 10,2 × 1 000 000 = 10 200 000 (cm). Đổi 10 200 000 cm = 102 km.'
  },
  {
    id: 2,
    type: 'map',
    title: 'Độ dài đoạn thẳng trên bản đồ',
    question: 'Một con đường dài 25 km. Trên bản đồ tỉ lệ 1 : 500 000, con đường đó được vẽ dài bao nhiêu xăng-ti-mét?',
    expectedNum: 5,
    unit: 'cm',
    hint: 'Trước khi tính, hãy đổi khoảng cách thực tế ra đơn vị xăng-ti-mét: 25 km = 2 500 000 cm. Sau đó lấy số đó chia cho 500 000.',
    explanation: 'Đổi 25 km = 2 500 000 cm. Độ dài trên bản đồ là: 2 500 000 : 500 000 = 5 (cm).'
  },
  {
    id: 3,
    type: 'ratio',
    title: 'Xác định tỉ lệ bản đồ',
    question: 'Chiều dài sân vận động trường học trên thực tế là 100 m. Trên bản vẽ mặt bằng, người ta vẽ chiều dài đó là 10 cm. Hãy tìm mẫu số tỉ lệ của bản vẽ (Bản vẽ có tỉ lệ 1 : ?)',
    expectedNum: 1000,
    unit: '',
    hint: 'Đổi 100 m sang cm: 100 m = 10 000 cm. Mẫu số tỉ lệ = Khoảng cách thực tế : Khoảng cách trên bản vẽ.',
    explanation: 'Đổi 100 m = 10 000 cm. Tỉ lệ bản vẽ là: 10 : 10 000 = 1 : 1 000. Mẫu số tỉ lệ là 1000.'
  },
  {
    id: 4,
    type: 'real',
    title: 'Chiều dài cây cầu vĩ đại',
    question: 'Trên bản đồ tỉ lệ 1 : 20 000, chiều dài một cây cầu bắc qua sông là 12 cm. Hỏi chiều dài thật của cây cầu đó là bao nhiêu mét?',
    expectedNum: 2400,
    unit: 'm',
    hint: 'Tính ra cm: 12 × 20 000 = 240 000 cm. Sau đó đổi từ cm ra mét (1 m = 100 cm).',
    explanation: 'Chiều dài thực tế là: 12 × 20 000 = 240 000 (cm). Đổi 240 000 cm = 2 400 m.'
  },
  {
    id: 5,
    type: 'area',
    title: 'Diện tích sân trường trên bản đồ',
    question: 'Một sân trường hình chữ nhật có chiều dài 80 m, chiều rộng 60 m. Trên bản đồ tỉ lệ 1 : 1 000, diện tích của sân trường đó là bao nhiêu xăng-ti-mét vuông?',
    expectedNum: 48,
    unit: 'cm²',
    hint: 'Đổi 80 m = 8000 cm -> dài trên bản đồ = 8 cm. Đổi 60 m = 6000 cm -> rộng trên bản đồ = 6 cm. Diện tích = dài × rộng.',
    explanation: 'Đổi: 80 m = 8000 cm; 60 m = 6000 cm. Chiều dài trên bản đồ: 8000 : 1000 = 8 cm. Chiều rộng: 6000 : 1000 = 6 cm. Diện tích trên bản đồ: 8 × 6 = 48 (cm²).'
  }
];

export const MapScalePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScaleTab>('visual');

  // --- Visual Tab State ---
  const [scaleDenominator, setScaleDenominator] = useState<number>(1000000);
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [customMapCm, setCustomMapCm] = useState<number>(10.2);
  const [visualMode, setVisualMode] = useState<'vietnam' | 'school'>('vietnam');

  // Trường học State
  const [schoolRealLength, setSchoolRealLength] = useState<number>(80); // 80 mét
  const [schoolRealWidth, setSchoolRealWidth] = useState<number>(50); // 50 mét
  const [schoolScale, setSchoolScale] = useState<number>(1000); // 1 : 1000

  // --- Theory Tab State ---
  const [selectedType, setSelectedType] = useState<1 | 2 | 3 | 4>(1);

  // --- Practice Tab State ---
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentPair = CITY_PAIRS[selectedPairIndex];
  const calculatedMapDistanceCm = Number(((currentPair.realDistanceKm * 100000) / scaleDenominator).toFixed(2));
  const currentPracticeQ = PRACTICE_POOL[practiceIndex];

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;
    const parsed = parseFloat(userAnswer.replace(',', '.'));
    const correct = Math.abs(parsed - currentPracticeQ.expectedNum) < 0.05;
    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextPractice = () => {
    setPracticeIndex((prev) => (prev + 1) % PRACTICE_POOL.length);
    setUserAnswer('');
    setChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#fcfdfa] math-grid-light overflow-y-auto">
      {/* Top Banner Tinh Gọn - Nền Trắng, Viền Vàng Cam */}
      <div className="bg-white border-b-2 border-amber-400 px-4 py-3 shadow-xs shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-700 shadow-xs">
              <Map size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                  Toán Lớp 5 · Chuyên Đề Mới
                </span>
                <span className="text-slate-400 text-xs">|</span>
                <span className="text-xs font-bold text-slate-500">Mô phỏng tương tác & Ứng dụng thực tế</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Tỉ Lệ Bản Đồ & Ứng Dụng Thực Tế
              </h1>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass size={14} />
              <span>1. Bản Đồ Trực Quan</span>
            </button>
            <button
              onClick={() => setActiveTab('theory_types')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'theory_types'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Lightbulb size={14} />
              <span>2. Ba Dạng Toán Trọng Tâm</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calculator size={14} />
              <span>3. Luyện Tập & Tự Sửa Lỗi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        
        {/* ================= TAB 1: BẢN ĐỒ TRỰC QUAN & THƯỚC ĐO ================= */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            
            {/* Chế độ xem: Tuyến đường Việt Nam hoặc Mặt bằng sân trường */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Chọn mô hình mô phỏng:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setVisualMode('vietnam')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      visualMode === 'vietnam'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Navigation size={13} />
                    <span>Khoảng cách địa lý liên tỉnh (km)</span>
                  </button>
                  <button
                    onClick={() => setVisualMode('school')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      visualMode === 'school'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <School size={13} />
                    <span>Mặt bằng sân trường & khu đất (m)</span>
                  </button>
                </div>
              </div>

              {visualMode === 'vietnam' && (
                <div className="text-xs text-slate-600 font-medium">
                  Tỉ lệ đang chọn: <span className="font-black text-amber-700">1 : {scaleDenominator.toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>

            {/* Chế độ 1: Địa lý Việt Nam */}
            {visualMode === 'vietnam' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Cột trái: Bản đồ tương tác SVG & Tuyến đường */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
                        <h3 className="font-black text-slate-800 text-sm sm:text-base">
                          Mô phỏng Thước đo trên Bản đồ Việt Nam
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {currentPair.nameA} ➔ {currentPair.nameB}
                      </span>
                    </div>

                    {/* Bản đồ SVG trực quan */}
                    <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-sky-50 via-teal-50/40 to-emerald-50 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 500 320">
                        {/* Lưới tọa độ bản đồ */}
                        <defs>
                          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.6" strokeDasharray="2 2" />
                          </pattern>
                        </defs>
                        <rect width="500" height="320" fill="url(#grid-pattern)" />

                        {/* Dải đất hình chữ S tượng trưng */}
                        <path
                          d="M 180,30 Q 230,50 210,100 T 260,160 Q 280,210 240,260 T 190,290"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="24"
                          strokeLinecap="round"
                          opacity="0.35"
                        />
                        <path
                          d="M 180,30 Q 230,50 210,100 T 260,160 Q 280,210 240,260 T 190,290"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 2"
                        />

                        {/* Điểm mốc các thành phố */}
                        {/* Hà Nội */}
                        <circle cx="190" cy="55" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <text x="205" y="60" fontSize="11" fontWeight="bold" fill="#1e293b">Hà Nội</text>

                        {/* Hải Phòng */}
                        <circle cx="230" cy="65" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="240" y="70" fontSize="10" fontWeight="bold" fill="#334155">Hải Phòng</text>

                        {/* Huế / Đà Nẵng */}
                        <circle cx="245" cy="145" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <text x="260" y="150" fontSize="11" fontWeight="bold" fill="#1e293b">Đà Nẵng</text>

                        {/* TP. Hồ Chí Minh */}
                        <circle cx="235" cy="245" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <text x="250" y="250" fontSize="11" fontWeight="bold" fill="#1e293b">TP. Hồ Chí Minh</text>

                        {/* Cần Thơ */}
                        <circle cx="205" cy="275" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="145" y="280" fontSize="10" fontWeight="bold" fill="#334155">Cần Thơ</text>

                        {/* Đoạn thẳng đo khoảng cách giữa 2 điểm đang chọn */}
                        {selectedPairIndex === 0 && (
                          <g>
                            <line x1="190" y1="55" x2="230" y2="65" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
                            <rect x="180" y="78" width="130" height="24" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="188" y="94" fontSize="10" fontWeight="bold" fill="#b91c1c">Đo được: {calculatedMapDistanceCm} cm</text>
                          </g>
                        )}

                        {selectedPairIndex === 1 && (
                          <g>
                            <line x1="190" y1="55" x2="245" y2="145" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" />
                            <rect x="160" y="115" width="135" height="24" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="168" y="131" fontSize="10" fontWeight="bold" fill="#b91c1c">Đo được: {calculatedMapDistanceCm} cm</text>
                          </g>
                        )}

                        {selectedPairIndex === 2 && (
                          <g>
                            <line x1="245" y1="145" x2="235" y2="245" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" />
                            <rect x="180" y="185" width="135" height="24" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="188" y="201" fontSize="10" fontWeight="bold" fill="#b91c1c">Đo được: {calculatedMapDistanceCm} cm</text>
                          </g>
                        )}

                        {selectedPairIndex === 3 && (
                          <g>
                            <line x1="235" y1="245" x2="205" y2="275" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
                            <rect x="150" y="235" width="130" height="24" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="158" y="251" fontSize="10" fontWeight="bold" fill="#b91c1c">Đo được: {calculatedMapDistanceCm} cm</text>
                          </g>
                        )}

                        {selectedPairIndex === 4 && (
                          <g>
                            <line x1="190" y1="55" x2="235" y2="245" stroke="#dc2626" strokeWidth="3.5" strokeDasharray="5 3" />
                            <rect x="220" y="130" width="140" height="24" rx="6" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
                            <text x="228" y="146" fontSize="10" fontWeight="bold" fill="#991b1b">Đo được: {calculatedMapDistanceCm} cm</text>
                          </g>
                        )}

                        {/* Thước đo tỉ lệ góc bản đồ (Scale bar) */}
                        <g transform="translate(320, 270)">
                          <rect x="0" y="0" width="160" height="38" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                          <text x="10" y="16" fontSize="9" fontWeight="bold" fill="#475569">
                            Tỉ lệ: 1 : {scaleDenominator.toLocaleString('vi-VN')}
                          </text>
                          <line x1="10" y1="26" x2="150" y2="26" stroke="#0f172a" strokeWidth="3" />
                          <line x1="10" y1="22" x2="10" y2="30" stroke="#0f172a" strokeWidth="2" />
                          <line x1="80" y1="22" x2="80" y2="30" stroke="#0f172a" strokeWidth="2" />
                          <line x1="150" y1="22" x2="150" y2="30" stroke="#0f172a" strokeWidth="2" />
                          <text x="6" y="36" fontSize="8" fill="#64748b">0</text>
                          <text x="65" y="36" fontSize="8" fill="#64748b">{(scaleDenominator / 100000).toFixed(0)}km</text>
                          <text x="135" y="36" fontSize="8" fill="#64748b">{(scaleDenominator * 2 / 100000).toFixed(0)}km</text>
                        </g>

                        {/* La bàn chỉ hướng Bắc */}
                        <g transform="translate(440, 45)">
                          <circle cx="15" cy="15" r="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                          <polygon points="15,4 19,15 15,13 11,15" fill="#ef4444" />
                          <polygon points="15,26 19,15 15,17 11,15" fill="#94a3b8" />
                          <text x="12" y="2" fontSize="9" fontWeight="black" fill="#ef4444">N</text>
                        </g>
                      </svg>
                    </div>

                    {/* Bộ chọn tuyến đường thực tế */}
                    <div className="mt-4">
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Chọn tuyến đường khảo sát thực tế:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CITY_PAIRS.map((pair, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPairIndex(idx)}
                            className={`p-2 rounded-xl text-left border transition-all text-xs ${
                              selectedPairIndex === idx
                                ? 'bg-amber-50 border-amber-400 text-amber-900 font-black shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <div className="truncate">{pair.nameA} - {pair.nameB}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{pair.realDistanceKm} km</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chọn tỉ lệ bản đồ */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Đổi tỉ lệ bản đồ:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SCALES.slice(2).map((scale) => (
                        <button
                          key={scale.value}
                          onClick={() => setScaleDenominator(scale.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            scaleDenominator === scale.value
                              ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {scale.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cột phải: Bảng phân tích công thức tính toán */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                      <Calculator className="w-5 h-5 text-amber-600" />
                      <h4 className="font-black text-slate-800 text-sm sm:text-base">
                        Quy Trình Tính Toán Trực Quan
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {/* Bước 1 */}
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                        <div className="text-[11px] font-black uppercase text-amber-800">
                          Bước 1 · Khoảng cách trên bản đồ
                        </div>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          Đo được: <span className="text-rose-600">{calculatedMapDistanceCm} cm</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          (Đoạn thẳng nối {currentPair.nameA} và {currentPair.nameB} trên trang giấy)
                        </div>
                      </div>

                      {/* Bước 2 */}
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                        <div className="text-[11px] font-black uppercase text-emerald-800">
                          Bước 2 · Nhân với mẫu số tỉ lệ
                        </div>
                        <div className="text-xs font-bold text-slate-800 mt-1">
                          Khoảng cách thực tế (cm) = {calculatedMapDistanceCm} × {scaleDenominator.toLocaleString('vi-VN')}
                        </div>
                        <div className="text-base font-black text-emerald-700 mt-0.5">
                          = {(calculatedMapDistanceCm * scaleDenominator).toLocaleString('vi-VN')} cm
                        </div>
                      </div>

                      {/* Bước 3 */}
                      <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200">
                        <div className="text-[11px] font-black uppercase text-sky-800">
                          Bước 3 · Đổi sang đơn vị ki-lô-mét (km)
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Vì <span className="font-bold">1 km = 100 000 cm</span>, ta lấy số cm chia cho 100 000:
                        </div>
                        <div className="text-lg font-black text-sky-700 mt-1">
                          = {currentPair.realDistanceKm} km
                        </div>
                      </div>
                    </div>

                    {/* Mẹo vàng ghi nhớ */}
                    <div className="p-3 rounded-2xl bg-amber-100/60 border border-amber-300 flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-950 leading-relaxed">
                        <strong className="block text-amber-900 font-black">Quy tắc vàng của Tỉ lệ bản đồ:</strong>
                        Khoảng cách thực tế và khoảng cách bản đồ <span className="underline font-bold">phải luôn cùng đơn vị đo</span> trước khi thực hiện phép nhân hoặc chia!
                      </div>
                    </div>
                  </div>

                  <MascotCompanion 
                    mood="talking" 
                    customMessage={`Em có biết: Trên bản đồ 1 : 1 000 000, cứ 1 cm trên giấy tương ứng với đúng 10 km ngoài đời thực đấy!`}
                  />
                </div>
              </div>
            )}

            {/* Chế độ 2: Mặt bằng sân trường */}
            {visualMode === 'school' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Cột trái: Sơ đồ sân trường */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-black text-slate-800 text-sm sm:text-base">
                        Bản Vẽ Mặt Bằng Khuôn Viên Trường Học
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      Tỉ lệ: 1 : {schoolScale}
                    </span>
                  </div>

                  {/* Khung mô phỏng bản vẽ */}
                  <div className="relative w-full h-72 rounded-2xl bg-emerald-950 p-4 flex items-center justify-center border-2 border-slate-700 overflow-hidden">
                    <div 
                      className="bg-emerald-600/40 border-2 border-amber-400 rounded-xl relative flex flex-col items-center justify-center transition-all duration-300"
                      style={{
                        width: `${Math.min(380, (schoolRealLength / schoolScale) * 100 * 3.5)}px`,
                        height: `${Math.min(220, (schoolRealWidth / schoolScale) * 100 * 3.5)}px`,
                      }}
                    >
                      {/* Sân bóng / Cột cờ / Bồn hoa bên trong */}
                      <div className="border border-white/40 rounded-lg w-3/4 h-3/4 flex flex-col items-center justify-center bg-emerald-500/20 text-white text-center p-2">
                        <div className="w-4 h-4 rounded-full bg-amber-400 border border-white mb-1 shadow-xs" title="Cột cờ" />
                        <span className="text-[11px] font-black text-amber-300">SÂN TRƯỜNG</span>
                        <span className="text-[10px] text-white/80">
                          Thực tế: {schoolRealLength}m × {schoolRealWidth}m
                        </span>
                        <span className="text-[10px] text-emerald-200 font-bold">
                          Bản vẽ: {(schoolRealLength * 100 / schoolScale).toFixed(1)}cm × {(schoolRealWidth * 100 / schoolScale).toFixed(1)}cm
                        </span>
                      </div>

                      {/* Thước đo chiều dài (trên) */}
                      <div className="absolute -top-6 left-0 right-0 flex items-center justify-center text-[10px] font-black text-amber-300">
                        Dài trên bản vẽ: {(schoolRealLength * 100 / schoolScale).toFixed(1)} cm
                      </div>

                      {/* Thước đo chiều rộng (phải) */}
                      <div className="absolute -right-20 top-0 bottom-0 flex items-center justify-center text-[10px] font-black text-amber-300 rotate-90">
                        Rộng: {(schoolRealWidth * 100 / schoolScale).toFixed(1)} cm
                      </div>
                    </div>
                  </div>

                  {/* Thanh trượt điều chỉnh kích thước thực tế */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Chiều dài thực tế:</span>
                        <span className="text-emerald-700 font-black">{schoolRealLength} mét</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="120"
                        step="10"
                        value={schoolRealLength}
                        onChange={(e) => setSchoolRealLength(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Chiều rộng thực tế:</span>
                        <span className="text-emerald-700 font-black">{schoolRealWidth} mét</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={schoolRealWidth}
                        onChange={(e) => setSchoolRealWidth(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Chọn tỉ lệ bản vẽ sân trường */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-600">Tỉ lệ bản vẽ:</span>
                    {[500, 1000, 2000].map((sc) => (
                      <button
                        key={sc}
                        onClick={() => setSchoolScale(sc)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          schoolScale === sc
                            ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        1 : {sc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cột phải: Tính diện tích thực tế và diện tích bản vẽ */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                    <Layers className="w-5 h-5 text-amber-600" />
                    <h4 className="font-black text-slate-800 text-sm sm:text-base">
                      Phân Tích Tỉ Lệ Độ Dài & Diện Tích
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[11px] font-black uppercase text-amber-800">
                        1. Kích thước trên bản vẽ
                      </span>
                      <div className="text-xs text-slate-700 mt-1 space-y-0.5">
                        <div>Chiều dài: {schoolRealLength} m = {schoolRealLength * 100} cm ➔ <strong className="text-slate-900">{schoolRealLength * 100 / schoolScale} cm</strong></div>
                        <div>Chiều rộng: {schoolRealWidth} m = {schoolRealWidth * 100} cm ➔ <strong className="text-slate-900">{schoolRealWidth * 100 / schoolScale} cm</strong></div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] font-black uppercase text-emerald-800">
                        2. Diện tích thực tế
                      </span>
                      <div className="text-base font-black text-emerald-700 mt-1">
                        S = {schoolRealLength} × {schoolRealWidth} = {(schoolRealLength * schoolRealWidth).toLocaleString('vi-VN')} m²
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                      <span className="text-[11px] font-black uppercase text-purple-800">
                        3. Diện tích trên bản vẽ (cm²)
                      </span>
                      <div className="text-base font-black text-purple-700 mt-1">
                        S(bản vẽ) = {(schoolRealLength * 100 / schoolScale).toFixed(1)} × {(schoolRealWidth * 100 / schoolScale).toFixed(1)} = {((schoolRealLength * 100 / schoolScale) * (schoolRealWidth * 100 / schoolScale)).toFixed(2)} cm²
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                      <strong>Khắc sâu kiến thức:</strong> Khi độ dài giảm đi <span className="font-bold">{schoolScale} lần</span> thì diện tích trên bản vẽ giảm đi tới <span className="font-bold">{schoolScale} × {schoolScale} = {(schoolScale * schoolScale).toLocaleString('vi-VN')} lần</span>!
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: BA DẠNG TOÁN TRỌNG TÂM ================= */}
        {activeTab === 'theory_types' && (
          <div className="space-y-6">
            
            {/* Bộ chọn 4 dạng toán */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 1, title: 'Dạng 1: Tìm khoảng cách thực tế', desc: 'Biết độ dài bản đồ và tỉ lệ' },
                { id: 2, title: 'Dạng 2: Tìm khoảng cách bản đồ', desc: 'Biết khoảng cách thật và tỉ lệ' },
                { id: 3, title: 'Dạng 3: Xác định tỉ lệ bản đồ', desc: 'Biết khoảng cách thật và bản đồ' },
                { id: 4, title: 'Dạng 4: Tỉ lệ diện tích', desc: 'Ứng dụng đo đạc mặt bằng đất' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id as 1 | 2 | 3 | 4)}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all ${
                    selectedType === item.id
                      ? 'bg-amber-50 border-amber-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                    selectedType === item.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Dạng {item.id}
                  </span>
                  <div className="font-black text-xs sm:text-sm text-slate-800 mt-1.5 leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            {/* Chi tiết dạng toán đang chọn */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-sm space-y-6">
              
              {selectedType === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      1
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Dạng 1: Tìm khoảng cách trên thực tế
                      </h3>
                      <p className="text-xs text-slate-500">Bài toán xuôi phổ biến nhất trong đề thi và cuộc sống</p>
                    </div>
                  </div>

                  {/* Khung công thức vàng */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase font-extrabold text-amber-100">Công thức ghi nhớ</div>
                      <div className="text-lg sm:text-xl font-black mt-0.5">
                        Khoảng cách thực tế = Khoảng cách bản đồ × Mẫu số tỉ lệ
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold">
                      Đơn vị ra: cm ➔ Đổi ra m hoặc km
                    </div>
                  </div>

                  {/* Ví dụ mẫu & Lời giải */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="text-xs font-black uppercase text-amber-800">Ví dụ minh họa chuẩn SGK:</div>
                    <div className="text-sm font-bold text-slate-800 leading-relaxed">
                      Trên bản đồ tỉ lệ 1 : 1 000 000, quãng đường từ thành phố A đến thành phố B đo được là 15 cm. Hỏi khoảng cách thực tế giữa hai thành phố là bao nhiêu ki-lô-mét?
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5 text-xs text-slate-700">
                      <div className="font-bold text-amber-900">Bài giải:</div>
                      <div>Khoảng cách thực tế giữa hai thành phố là:</div>
                      <div className="font-mono font-bold text-slate-900 pl-4">
                        15 × 1 000 000 = 15 000 000 (cm)
                      </div>
                      <div>Đổi: 15 000 000 cm = 150 km.</div>
                      <div className="font-bold text-emerald-700 pl-4">Đáp số: 150 km.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      2
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Dạng 2: Tìm khoảng cách trên bản đồ
                      </h3>
                      <p className="text-xs text-slate-500">Bài toán vẽ thu nhỏ đồ vật, công trình, quãng đường lên bản vẽ</p>
                    </div>
                  </div>

                  {/* Khung công thức vàng */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase font-extrabold text-teal-100">Công thức ghi nhớ</div>
                      <div className="text-lg sm:text-xl font-black mt-0.5">
                        Khoảng cách bản đồ = Khoảng cách thực tế (cùng đơn vị) : Mẫu số tỉ lệ
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold">
                      Bước 1 luôn là: Đổi đơn vị ra cm!
                    </div>
                  </div>

                  {/* Ví dụ mẫu */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="text-xs font-black uppercase text-teal-800">Ví dụ minh họa chuẩn SGK:</div>
                    <div className="text-sm font-bold text-slate-800 leading-relaxed">
                      Khoảng cách giữa hai tỉnh là 72 km. Trên bản đồ tỉ lệ 1 : 2 000 000, khoảng cách đó dài bao nhiêu xăng-ti-mét?
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1.5 text-xs text-slate-700">
                      <div className="font-bold text-teal-900">Bài giải:</div>
                      <div>Đổi khoảng cách thực tế ra xăng-ti-mét:</div>
                      <div className="font-mono font-bold text-slate-900 pl-4">
                        72 km = 7 200 000 cm
                      </div>
                      <div>Khoảng cách giữa hai tỉnh trên bản đồ là:</div>
                      <div className="font-mono font-bold text-slate-900 pl-4">
                        7 200 000 : 2 000 000 = 3,6 (cm)
                      </div>
                      <div className="font-bold text-emerald-700 pl-4">Đáp số: 3,6 cm.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      3
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Dạng 3: Xác định tỉ lệ của bản đồ
                      </h3>
                      <p className="text-xs text-slate-500">Bài toán tìm phân số tỉ lệ 1 : N khi đã biết kích thước vẽ và kích thước thật</p>
                    </div>
                  </div>

                  {/* Khung công thức vàng */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase font-extrabold text-purple-100">Công thức ghi nhớ</div>
                      <div className="text-lg sm:text-xl font-black mt-0.5">
                        Mẫu số tỉ lệ = Khoảng cách thực tế : Khoảng cách bản đồ (cùng đơn vị đo)
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold">
                      Tỉ lệ = 1 : (Khoảng cách thật : Bản đồ)
                    </div>
                  </div>

                  {/* Ví dụ mẫu */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="text-xs font-black uppercase text-purple-800">Ví dụ minh họa chuẩn SGK:</div>
                    <div className="text-sm font-bold text-slate-800 leading-relaxed">
                      Trên một bản đồ, khoảng cách giữa hai điểm A và B là 2 cm, trong khi trên thực tế khoảng cách đó là 20 km. Hỏi bản đồ đó được vẽ theo tỉ lệ nào?
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1.5 text-xs text-slate-700">
                      <div className="font-bold text-purple-900">Bài giải:</div>
                      <div>Đổi khoảng cách thực tế ra xăng-ti-mét:</div>
                      <div className="font-mono font-bold text-slate-900 pl-4">
                        20 km = 2 000 000 cm
                      </div>
                      <div>Mẫu số tỉ lệ của bản đồ là:</div>
                      <div className="font-mono font-bold text-slate-900 pl-4">
                        2 000 000 : 2 = 1 000 000
                      </div>
                      <div>Do đó bản đồ được vẽ theo tỉ lệ là: <strong className="text-purple-700">1 : 1 000 000</strong>.</div>
                      <div className="font-bold text-emerald-700 pl-4">Đáp số: 1 : 1 000 000.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      4
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Dạng 4: Tỉ lệ diện tích trên bản đồ (Nâng cao)
                      </h3>
                      <p className="text-xs text-slate-500">Tuyệt chiêu thi học sinh giỏi về diện tích thửa ruộng, mảnh đất</p>
                    </div>
                  </div>

                  {/* Khung công thức vàng */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm space-y-1">
                    <div className="text-xs uppercase font-extrabold text-rose-100">Quy tắc vàng diện tích</div>
                    <div className="text-base sm:text-lg font-black">
                      Nếu tỉ lệ độ dài là 1 : k thì tỉ lệ diện tích là 1 : (k × k)
                    </div>
                    <div className="text-xs text-rose-100 pt-1">
                      Diện tích thực tế = Diện tích bản đồ × (k × k)
                    </div>
                  </div>

                  {/* Ví dụ mẫu */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="text-xs font-black uppercase text-rose-800">Ví dụ học sinh giỏi:</div>
                    <div className="text-sm font-bold text-slate-800 leading-relaxed">
                      Trên bản đồ tỉ lệ 1 : 1 000, một mảnh đất hình chữ nhật có chiều dài 5 cm, chiều rộng 3 cm. Hỏi diện tích thực tế của mảnh đất đó là bao nhiêu mét vuông?
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5 text-xs text-slate-700">
                      <div className="font-bold text-rose-900">Cách 1 (Tính kích thước thật trước):</div>
                      <div>Chiều dài thực tế: 5 × 1 000 = 5 000 cm = 50 m.</div>
                      <div>Chiều rộng thực tế: 3 × 1 000 = 3 000 cm = 30 m.</div>
                      <div>Diện tích thực tế: 50 × 30 = <strong className="text-emerald-700 font-bold">1 500 m²</strong>.</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= TAB 3: PHÒNG THỰC HÀNH TƯƠNG TÁC ================= */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cột trái: Bài tập tương tác */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    #{currentPracticeQ.id}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {currentPracticeQ.title}
                  </h3>
                </div>

                <button
                  onClick={handleNextPractice}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Shuffle size={13} />
                  <span>Đổi bài tập khác</span>
                </button>
              </div>

              {/* Đề bài */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentPracticeQ.question}
              </div>

              {/* Ô nhập câu trả lời của học sinh */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-black uppercase text-slate-700 block">
                  Nhập kết quả của em:
                </label>

                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setChecked(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckAnswer();
                    }}
                    placeholder="Ví dụ: 102"
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden font-black text-slate-900 text-base bg-white"
                  />
                  {currentPracticeQ.unit && (
                    <span className="px-3 py-2.5 rounded-xl bg-slate-200 font-black text-slate-700 text-sm">
                      {currentPracticeQ.unit}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={16} />
                    <span>Kiểm tra kết quả</span>
                  </button>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb size={15} className="text-amber-600" />
                    <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý tư duy'}</span>
                  </button>
                </div>
              </div>

              {/* Gợi ý */}
              {showHint && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 leading-relaxed flex items-start gap-2 animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>{currentPracticeQ.hint}</div>
                </div>
              )}

              {/* Kết quả kiểm tra */}
              {checked && (
                <div className={`p-4 rounded-2xl border-2 transition-all animate-fadeIn ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-rose-50 border-rose-400 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-black text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Chính xác tuyệt vời! Em đã nắm vững tỉ lệ bản đồ.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Chưa chính xác rồi. Em hãy xem lời giải chi tiết dưới đây nhé!</span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs space-y-1">
                    <strong className="block text-slate-800 font-bold">Lời giải chi tiết:</strong>
                    <p className="text-slate-700 leading-relaxed">{currentPracticeQ.explanation}</p>
                  </div>
                </div>
              )}

            </div>

            {/* Cột phải: Bảng tra đổi đơn vị đo nhanh */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Ruler className="w-5 h-5 text-amber-600" />
                  <h4 className="font-black text-slate-800 text-sm">
                    Bảng Đổi Đơn Vị Đo Nhanh
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-600">1 km =</span>
                    <span className="text-emerald-700 font-black">1 000 m</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-600">1 km =</span>
                    <span className="text-emerald-700 font-black">100 000 cm</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-600">1 m =</span>
                    <span className="text-emerald-700 font-black">100 cm</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-600">1 m =</span>
                    <span className="text-emerald-700 font-black">1 000 mm</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-600">1 dm =</span>
                    <span className="text-emerald-700 font-black">10 cm</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Mẹo nhẩm nhanh:</strong> Từ <strong>km</strong> đổi sang <strong>cm</strong> chỉ cần viết thêm <strong>5 chữ số 0</strong> vào bên phải!
                </div>
              </div>

              <MascotCompanion
                mood={checked ? (isCorrect ? 'celebrating' : 'thinking') : 'normal'}
                customMessage={
                  checked
                    ? isCorrect
                      ? 'Tuyệt vời lắm! Tiếp tục giải các bài toán bản đồ tiếp theo nhé!'
                      : 'Đừng nản lòng nhé! Hãy chú ý đổi đúng số chữ số 0 khi đổi từ km sang cm.'
                    : 'Hãy nháp cẩn thận bước đổi đơn vị đo trước khi nhân hoặc chia tỉ lệ nha!'
                }
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MapScalePanel;
