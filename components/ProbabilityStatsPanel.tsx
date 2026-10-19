import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Calculator,
  Shuffle,
  BarChart3,
  PieChart as PieIcon,
  Play,
  Dices,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type TabType = 'stats' | 'prob';

interface SportStat {
  name: string;
  count: number;
  color: string;
}

const INITIAL_STATS: SportStat[] = [
  { name: 'Toán học & Cờ vua', count: 18, color: '#3b82f6' }, // Blue
  { name: 'Mỹ thuật & Thủ công', count: 12, color: '#ec4899' }, // Pink
  { name: 'Bóng đá & Thể thao', count: 24, color: '#10b981' }, // Green
  { name: 'Bơi lội', count: 6, color: '#f59e0b' } // Amber
];

export const ProbabilityStatsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  // Dữ liệu thống kê
  const [statsData, setStatsData] = useState<SportStat[]>(INITIAL_STATS);

  // State xác suất thực nghiệm
  const [spinHistory, setSpinHistory] = useState<string[]>([]);
  const [currentSlice, setCurrentSlice] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);

  // State bài tập tương tác
  const [userPracticeAns, setUserPracticeAns] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  // Tính toán số liệu thống kê
  const totalStudents = statsData.reduce((acc, curr) => acc + curr.count, 0);

  // Kiểm tra số liệu ban đầu
  const isInitialData = () => {
    return statsData[0].count === 18 && statsData[1].count === 12 && statsData[2].count === 24 && statsData[3].count === 6;
  };

  // Vòng quay gồm 4 ô màu
  const SPINNER_SECTORS = [
    { label: 'Đỏ', color: '#ef4444', prob: 0.25 },
    { label: 'Xanh dương', color: '#3b82f6', prob: 0.25 },
    { label: 'Xanh lá', color: '#10b981', prob: 0.25 },
    { label: 'Vàng', color: '#f59e0b', prob: 0.25 }
  ];

  // Quay vòng quay may mắn
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomExtraRotations = 5 + Math.floor(Math.random() * 4); // 5-8 vòng
    const randomSectorIdx = Math.floor(Math.random() * 4);
    const sectorAngle = 360 / 4;
    // Góc dừng chính xác giữa mỗi sector
    const targetDeg = rotationDeg + randomExtraRotations * 360 + randomSectorIdx * sectorAngle + 45;
    setRotationDeg(targetDeg);

    setTimeout(() => {
      const selected = SPINNER_SECTORS[randomSectorIdx].label;
      setCurrentSlice(selected);
      setSpinHistory(prev => [selected, ...prev]);
      setIsSpinning(false);
    }, 1200);
  };

  const handleResetSpin = () => {
    setSpinHistory([]);
    setCurrentSlice(null);
  };

  const handleRandomizeStats = () => {
    const newStats: SportStat[] = [
      { name: 'Toán học & Cờ vua', count: Math.floor(Math.random() * 15) + 10, color: '#3b82f6' },
      { name: 'Mỹ thuật & Thủ công', count: Math.floor(Math.random() * 12) + 8, color: '#ec4899' },
      { name: 'Bóng đá & Thể thao', count: Math.floor(Math.random() * 20) + 12, color: '#10b981' },
      { name: 'Bơi lội', count: Math.floor(Math.random() * 10) + 5, color: '#f59e0b' }
    ];
    setStatsData(newStats);
    setUserPracticeAns('');
    setPracticeResult(null);
  };

  const handleResetToInitial = () => {
    setStatsData(INITIAL_STATS);
    setUserPracticeAns('');
    setPracticeResult(null);
  };

  // Câu hỏi tương tác: tỉ số % của CLB Bóng đá trên tổng số HS
  const targetFootballPercent = Math.round((statsData[2].count / (totalStudents || 1)) * 100);

  const handleCheckAnswer = () => {
    const val = parseFloat(userPracticeAns.replace('%', '').replace(',', '.'));
    if (isNaN(val)) {
      setPracticeResult({ isChecked: true, isCorrect: false });
      return;
    }
    const isOk = Math.abs(val - targetFootballPercent) <= 1;
    setPracticeResult({ isChecked: true, isCorrect: isOk });
  };

  // Tính tọa độ cho biểu đồ hình quạt tròn SVG
  let cumulativeAngle = 0;
  const piePaths = statsData.map((item) => {
    const sliceAngle = (item.count / totalStudents) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const percent = Math.round((item.count / totalStudents) * 100);

    return {
      pathData,
      color: item.color,
      name: item.name,
      percent,
      count: item.count
    };
  });

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 min-h-full flex flex-col justify-between">
      <div>
        {/* Header với Switcher Thống Kê vs Xác Suất */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
                <BarChart3 size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                Xác Suất Và Thống Kê
              </h2>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'stats'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-600 hover:text-teal-700 hover:bg-white/70'
              }`}
            >
              <PieIcon size={16} />
              <span>1. Thống kê & Biểu đồ</span>
            </button>
            <button
              onClick={() => setActiveTab('prob')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'prob'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-600 hover:text-teal-700 hover:bg-white/70'
              }`}
            >
              <Dices size={16} />
              <span>2. Xác suất thực nghiệm</span>
            </button>
          </div>
        </div>

        {activeTab === 'stats' ? (
          /* TAB 1: THỐNG KÊ VÀ BIỂU ĐỒ */
          <div>
            {/* Khối trực quan: Biểu đồ quạt tròn và Biểu đồ cột */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Biểu đồ hình quạt tròn SVG */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
                  <PieIcon size={16} className="text-teal-600" />
                  Biểu đồ hình quạt tròn tỉ lệ tham gia CLB
                </span>

                <div className="w-52 h-52 relative my-2">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {piePaths.map((slice, i) => (
                      <path
                        key={i}
                        d={slice.pathData}
                        fill={slice.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-90"
                      />
                    ))}
                  </svg>
                </div>

                {/* Chú giải quạt tròn */}
                <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-slate-100 text-[11px] font-bold">
                  {piePaths.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="truncate">{s.name}: <strong className="font-mono">{s.percent}%</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biểu đồ cột (Bar Chart) */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart3 size={16} className="text-teal-600" />
                  Biểu đồ cột số lượng học sinh (Tổng: {totalStudents} em)
                </span>

                <div className="space-y-3 my-auto">
                  {statsData.map((item, idx) => {
                    const pct = Math.round((item.count / totalStudents) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{item.name}</span>
                          <span className="font-mono text-slate-900">{item.count} em ({pct}%)</span>
                        </div>
                        <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden p-0.5 border border-slate-200">
                          <div
                            className="h-full rounded-lg transition-all duration-500 flex items-center px-2 text-[10px] text-white font-bold"
                            style={{ width: `${Math.max(15, pct)}%`, backgroundColor: item.color }}
                          >
                            {item.count} HS
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 text-right text-xs font-bold text-teal-800">
                  CLB nhiều học sinh nhất: <strong className="text-emerald-700 font-black">{statsData[2].name} ({statsData[2].count} em)</strong>
                </div>
              </div>
            </div>

            {/* 2 Cột: Bảng dữ liệu & Bài giải mẫu vs Bảng tương tác */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* CỘT TRÁI: Điều chỉnh số liệu */}
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <Calculator size={18} className="text-teal-600" />
                    Bảng số liệu thống kê lớp 5
                  </h3>

                  <div className="space-y-2.5 mb-4">
                    {statsData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-600 truncate flex-1">
                          {item.name}:
                        </label>
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = [...statsData];
                            next[idx].count = val;
                            setStatsData(next);
                            setUserPracticeAns('');
                            setPracticeResult(null);
                          }}
                          className="w-24 text-sm font-black text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-200 text-right font-mono"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleRandomizeStats}
                      className="flex-1 py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Shuffle size={14} />
                      Đổi số liệu ngẫu nhiên
                    </button>
                    {!isInitialData() && (
                      <button
                        onClick={handleResetToInitial}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                        title="Khôi phục số liệu gốc"
                      >
                        <RotateCcw size={14} />
                        Gốc
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[11px]">
                    Câu hỏi thực hành phân tích số liệu:
                  </span>
                  <p className="font-semibold text-slate-700">
                    CLB Bóng đá có <strong className="text-teal-800">{statsData[2].count}</strong> em trên tổng số <strong className="text-teal-800">{totalStudents}</strong> em toàn trường. Hãy tính tỉ số phần trăm học sinh tham gia CLB Bóng đá?
                  </p>
                </div>
              </div>

              {/* CỘT PHẢI: BÀI GIẢI MẪU HOẶC BẢNG TƯƠNG TÁC */}
              <div className="lg:col-span-7">
                {isInitialData() ? (
                  /* Bài giải mẫu chi tiết cho số liệu gốc */
                  <div className="bg-teal-50/70 p-4 sm:p-5 rounded-3xl border border-teal-200 shadow-xs flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-teal-950 font-black text-sm flex items-center gap-2">
                          <ArrowRight size={18} className="text-teal-600" />
                          Bài giải mẫu phân tích số liệu thống kê
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-teal-200 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-300">
                          Số liệu mẫu gốc
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs mb-3 space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <p>1. Tổng số học sinh cả 4 câu lạc bộ là:</p>
                        <p className="font-mono font-bold text-teal-800">18 + 12 + 24 + 6 = 60 (học sinh)</p>
                        <p>2. Tỉ số phần trăm của học sinh tham gia CLB Bóng đá là:</p>
                        <p className="font-mono font-bold text-emerald-800">24 : 60 = 0,4 = 40%</p>
                        <p>3. Tương tự, ta tính được góc hình quạt tương ứng trên biểu đồ hình quạt tròn:</p>
                        <p className="font-mono text-slate-600">360° × 40% = 144°</p>
                      </div>

                      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                        <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Mẹo học tập:</strong> Khi em đổi số đo học sinh, bảng này sẽ chuyển sang <strong>Bảng giải tương tác</strong> để em tự thực hành và kiểm tra kết quả!
                        </span>
                      </div>
                    </div>

                    <div className="text-right pt-3 border-t border-teal-200 mt-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                      <span className="text-2xl font-black text-teal-700 font-mono">40%</span>
                    </div>
                  </div>
                ) : (
                  /* Bảng giải tương tác */
                  <div className="bg-amber-50/70 p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-md flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-amber-950 font-black text-sm flex items-center gap-2">
                          <Sparkles size={18} className="text-amber-600" />
                          Bảng giải tương tác cho học sinh
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                          Em tự thực hành
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3 text-xs sm:text-sm text-slate-800">
                        <p className="font-bold text-amber-950 mb-1">
                          Đề bài cần giải:
                        </p>
                        <p>
                          Tổng số học sinh là <strong>{totalStudents}</strong> em. Trong đó CLB Bóng đá có <strong>{statsData[2].count}</strong> em. Hỏi CLB Bóng đá chiếm bao nhiêu phần trăm tổng số học sinh?
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Nhập tỉ số phần trăm tính được:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ví dụ: 35 hoặc 40..."
                            value={userPracticeAns}
                            onChange={(e) => { setUserPracticeAns(e.target.value); setPracticeResult(null); }}
                            disabled={practiceResult?.isCorrect}
                            className="w-full text-base font-black text-teal-950 bg-teal-50/40 p-2.5 rounded-xl border border-teal-200 outline-none focus:border-teal-500 font-mono"
                          />
                          <span className="text-base font-black text-slate-600 shrink-0 px-3 py-2.5 bg-slate-100 rounded-xl">
                            %
                          </span>
                        </div>
                      </div>

                      {practiceResult?.isChecked && (
                        <div className={`p-3.5 rounded-2xl mb-3 border text-xs sm:text-sm ${
                          practiceResult.isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-rose-50 text-rose-950 border-rose-300'
                        }`}>
                          {practiceResult.isCorrect ? (
                            <div className="space-y-1.5">
                              <p className="font-black text-sm flex items-center gap-1.5">
                                <CheckCircle2 size={18} className="text-white" />
                                Chính xác! Em tính tỉ số phần trăm rất chuẩn! 🎉
                              </p>
                              <div className="bg-white/20 p-2 rounded-xl font-mono text-xs">
                                ✓ {statsData[2].count} : {totalStudents} × 100% = {targetFootballPercent}%
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                                <XCircle size={18} className="text-rose-600" />
                                Chưa chính xác! Hãy lấy {statsData[2].count} chia cho {totalStudents} rồi nhân 100 nhé!
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-amber-200">
                      {!practiceResult?.isChecked ? (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={!userPracticeAns.trim()}
                          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Check size={18} />
                          Kiểm tra kết quả
                        </button>
                      ) : practiceResult.isCorrect ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleRandomizeStats}
                            className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                          >
                            <Sparkles size={14} /> Thử số khác
                          </button>
                          <button
                            onClick={handleResetToInitial}
                            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw size={14} /> Về bài mẫu gốc
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => { setUserPracticeAns(''); setPracticeResult(null); }}
                            className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw size={14} /> Làm lại
                          </button>
                          <button
                            onClick={handleResetToInitial}
                            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                          >
                            <HelpCircle size={14} /> Xem bài mẫu
                          </button>
                        </div>
                      )}

                      <button
                        onClick={handleResetToInitial}
                        className="w-full text-center text-[11px] font-bold text-amber-900 hover:underline pt-1 block"
                      >
                        ← Khôi phục số liệu gốc (Hiển thị lại bài giải chi tiết mẫu)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: XÁC SUẤT THỰC NGHIỆM */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Vòng quay may mắn */}
              <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Dices size={16} className="text-teal-600" />
                  Mô phỏng vòng quay may mắn (4 ô bằng nhau)
                </span>

                <div className="relative w-56 h-56 my-4 flex items-center justify-center">
                  {/* Kim chỉ */}
                  <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-slate-900 drop-shadow-md" />

                  {/* Vòng quay */}
                  <div 
                    className="w-full h-full rounded-full border-4 border-slate-800 shadow-xl overflow-hidden transition-transform duration-1000 ease-out relative"
                    style={{ transform: `rotate(${rotationDeg}deg)` }}
                  >
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500 flex items-center justify-center text-white font-black text-xs">
                      Đỏ (1/4)
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 flex items-center justify-center text-white font-black text-xs">
                      Xanh D (1/4)
                    </div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-500 flex items-center justify-center text-white font-black text-xs">
                      Xanh L (1/4)
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500 flex items-center justify-center text-white font-black text-xs">
                      Vàng (1/4)
                    </div>
                  </div>

                  {/* Tâm vòng tròn */}
                  <div className="absolute w-8 h-8 bg-white border-2 border-slate-800 rounded-full z-10 shadow-sm" />
                </div>

                <div className="flex gap-2 w-full max-w-xs mt-2">
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
                  >
                    <Play size={16} />
                    {isSpinning ? 'Đang quay...' : 'Quay 1 lần'}
                  </button>
                  <button
                    onClick={handleResetSpin}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all"
                    title="Xóa lịch sử thực nghiệm"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Bảng theo dõi kết quả thực nghiệm */}
              <div className="md:col-span-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center justify-between">
                    <span>Thống kê xác suất thực nghiệm:</span>
                    <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-mono font-bold">
                      Tổng số lần quay: {spinHistory.length}
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {SPINNER_SECTORS.map(sec => {
                      const count = spinHistory.filter(s => s === sec.label).length;
                      const rate = spinHistory.length > 0 ? ((count / spinHistory.length) * 100).toFixed(1) : '0';
                      return (
                        <div key={sec.label} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }} />
                            <span className="text-xs font-bold text-slate-700">{sec.label}</span>
                          </div>
                          <div className="text-lg font-black text-slate-900 font-mono">
                            {count} lần <span className="text-xs font-semibold text-slate-500">({rate}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950 space-y-1">
                    <p className="font-extrabold text-teal-900">Khái niệm sự kiện trong Toán lớp 5:</p>
                    <p>• <strong>Chắc chắn xảy ra:</strong> Kim chỉ vào một trong 4 màu Đỏ, Xanh dương, Xanh lá, Vàng.</p>
                    <p>• <strong>Có thể xảy ra:</strong> Kim chỉ vào ô màu Đỏ (hoặc bất kì màu nào).</p>
                    <p>• <strong>Không thể xảy ra:</strong> Kim chỉ vào ô màu Tím (vì vòng quay không có màu Tím).</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
                  * Khi số lần quay càng lớn, tỉ số số lần kim dừng ở mỗi ô màu sẽ càng tiến gần đến 25% (1/4).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <MascotCompanion message="Xác suất và Thống kê giúp chúng ta thu thập, phân tích số liệu và dự đoán các khả năng xảy ra trong cuộc sống!" />
      </div>
    </div>
  );
};

export default ProbabilityStatsPanel;
