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
  Scale, 
  Ruler, 
  Box, 
  Grid,
  Calculator,
  Shuffle
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type CategoryType = 'length' | 'weight' | 'area' | 'volume';

interface UnitDef {
  symbol: string;
  name: string;
  factor: number; // Tỉ lệ so với đơn vị chuẩn ở vị trí 0
}

interface CategoryConfig {
  id: CategoryType;
  title: string;
  icon: React.ReactNode;
  color: string;
  badgeColor: string;
  baseRatio: number; // 10 cho độ dài, khối lượng; 100 cho diện tích; 1000 cho thể tích
  description: string;
  units: UnitDef[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'length',
    title: 'Độ dài',
    icon: <Ruler size={18} />,
    color: 'emerald',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    baseRatio: 10,
    description: 'Hai đơn vị đo độ dài liền nhau gấp hoặc kém nhau 10 lần (1m = 10dm; 1dm = 0,1m).',
    units: [
      { symbol: 'km', name: 'ki-lô-mét', factor: 1000 },
      { symbol: 'hm', name: 'héc-tô-mét', factor: 100 },
      { symbol: 'dam', name: 'đề-ca-mét', factor: 10 },
      { symbol: 'm', name: 'mét', factor: 1 },
      { symbol: 'dm', name: 'đề-xi-mét', factor: 0.1 },
      { symbol: 'cm', name: 'xen-ti-mét', factor: 0.01 },
      { symbol: 'mm', name: 'mi-li-mét', factor: 0.001 }
    ]
  },
  {
    id: 'weight',
    title: 'Khối lượng',
    icon: <Scale size={18} />,
    color: 'amber',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    baseRatio: 10,
    description: 'Hai đơn vị đo khối lượng liền nhau gấp hoặc kém nhau 10 lần (1 tấn = 10 tạ = 1000kg).',
    units: [
      { symbol: 'tấn', name: 'tấn', factor: 1000 },
      { symbol: 'tạ', name: 'tạ', factor: 100 },
      { symbol: 'yến', name: 'yến', factor: 10 },
      { symbol: 'kg', name: 'ki-lô-gam', factor: 1 },
      { symbol: 'hg', name: 'héc-tô-gam', factor: 0.1 },
      { symbol: 'dag', name: 'đề-ca-gam', factor: 0.01 },
      { symbol: 'g', name: 'gam', factor: 0.001 }
    ]
  },
  {
    id: 'area',
    title: 'Diện tích',
    icon: <Grid size={18} />,
    color: 'rose',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    baseRatio: 100,
    description: 'Hai đơn vị đo diện tích liền nhau gấp hoặc kém nhau 100 lần (1m² = 100dm²; 1ha = 10.000m²).',
    units: [
      { symbol: 'km²', name: 'ki-lô-mét vuông', factor: 1000000 },
      { symbol: 'ha', name: 'héc-ta (hm²)', factor: 10000 },
      { symbol: 'dam²', name: 'đề-ca-mét vuông', factor: 100 },
      { symbol: 'm²', name: 'mét vuông', factor: 1 },
      { symbol: 'dm²', name: 'đề-xi-mét vuông', factor: 0.01 },
      { symbol: 'cm²', name: 'xen-ti-mét vuông', factor: 0.0001 },
      { symbol: 'mm²', name: 'mi-li-mét vuông', factor: 0.000001 }
    ]
  },
  {
    id: 'volume',
    title: 'Thể tích & Dung tích',
    icon: <Box size={18} />,
    color: 'sky',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    baseRatio: 1000,
    description: 'Hai đơn vị đo thể tích liền nhau gấp hoặc kém nhau 1000 lần (1m³ = 1000dm³ = 1000 lít; 1cm³ = 1ml).',
    units: [
      { symbol: 'm³', name: 'mét khối', factor: 1000 },
      { symbol: 'dm³ (lít)', name: 'đề-xi-mét khối (lít)', factor: 1 },
      { symbol: 'cm³ (ml)', name: 'xen-ti-mét khối (ml)', factor: 0.001 }
    ]
  }
];

// Dữ liệu mẫu ban đầu cho mỗi chuyên mục
const INITIAL_CONVERT_DATA: Record<CategoryType, { value: number; from: string; to: string }> = {
  length: { value: 3.5, from: 'km', to: 'm' },
  weight: { value: 2.4, from: 'tấn', to: 'kg' },
  area: { value: 5, from: 'ha', to: 'm²' },
  volume: { value: 1.5, from: 'm³', to: 'dm³ (lít)' }
};

const UnitConversionPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('length');

  // Trạng thái giá trị chuyển đổi
  const [inputVal, setInputVal] = useState<number>(3.5);
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('m');

  // Trạng thái học sinh tự thực hành
  const [userPracticeAnswer, setUserPracticeAnswer] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  const currentCat = CATEGORIES.find(c => c.id === activeCategory)!;

  // Kiểm tra xem có đang ở số liệu ban đầu không
  const isInitialData = () => {
    const init = INITIAL_CONVERT_DATA[activeCategory];
    return inputVal === init.value && fromUnit === init.from && toUnit === init.to;
  };

  const handleSelectCategory = (catId: CategoryType) => {
    setActiveCategory(catId);
    const init = INITIAL_CONVERT_DATA[catId];
    setInputVal(init.value);
    setFromUnit(init.from);
    setToUnit(init.to);
    setUserPracticeAnswer('');
    setPracticeResult(null);
  };

  // Tính kết quả chính xác
  const getConvertedValue = (val: number, from: string, to: string) => {
    const fromDef = currentCat.units.find(u => u.symbol === from);
    const toDef = currentCat.units.find(u => u.symbol === to);
    if (!fromDef || !toDef) return 0;
    // Chuyển sang đơn vị cơ sở rồi sang đơn vị đích
    const inBase = val * fromDef.factor;
    const finalVal = inBase / toDef.factor;
    // Làm tròn tránh sai số dấu phẩy động
    return Math.round(finalVal * 1000000) / 1000000;
  };

  const correctValue = getConvertedValue(inputVal, fromUnit, toUnit);

  const handleRandomize = () => {
    const units = currentCat.units;
    const fromIdx = Math.floor(Math.random() * units.length);
    let toIdx = Math.floor(Math.random() * units.length);
    while (toIdx === fromIdx && units.length > 1) {
      toIdx = Math.floor(Math.random() * units.length);
    }
    const sampleValues = [2, 5, 8, 12, 15, 2.5, 4.8, 0.75, 120, 450];
    const randVal = sampleValues[Math.floor(Math.random() * sampleValues.length)];

    setInputVal(randVal);
    setFromUnit(units[fromIdx].symbol);
    setToUnit(units[toIdx].symbol);
    setUserPracticeAnswer('');
    setPracticeResult(null);
  };

  const handleResetToInitial = () => {
    const init = INITIAL_CONVERT_DATA[activeCategory];
    setInputVal(init.value);
    setFromUnit(init.from);
    setToUnit(init.to);
    setUserPracticeAnswer('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    if (!userPracticeAnswer.trim()) return;
    const parsed = parseFloat(userPracticeAnswer.replace(',', '.'));
    if (isNaN(parsed)) {
      setPracticeResult({ isChecked: true, isCorrect: false });
      return;
    }
    const diff = Math.abs(parsed - correctValue);
    const isOk = diff < 0.0001 || (correctValue !== 0 && diff / Math.abs(correctValue) < 0.001);
    setPracticeResult({ isChecked: true, isCorrect: isOk });
  };

  const handleRetry = () => {
    setUserPracticeAnswer('');
    setPracticeResult(null);
  };

  // Xác định số bậc nhảy giữa 2 đơn vị để hiển thị giải thích chi tiết
  const getStepExplanation = () => {
    const fromIndex = currentCat.units.findIndex(u => u.symbol === fromUnit);
    const toIndex = currentCat.units.findIndex(u => u.symbol === toUnit);
    if (fromIndex === -1 || toIndex === -1) return '';

    const stepDiff = Math.abs(toIndex - fromIndex);
    const ratioPerStep = currentCat.baseRatio;
    const totalMultiplier = Math.pow(ratioPerStep, stepDiff);

    if (fromIndex < toIndex) {
      // Đổi từ đơn vị lớn sang đơn vị bé hơn -> nhân
      return `Đổi từ đơn vị lớn (${fromUnit}) sang đơn vị bé (${toUnit}) cách nhau ${stepDiff} bậc: ta lấy số đo nhân với ${totalMultiplier.toLocaleString('vi-VN')}: ${inputVal} × ${totalMultiplier.toLocaleString('vi-VN')} = ${correctValue.toLocaleString('vi-VN')} ${toUnit}.`;
    } else if (fromIndex > toIndex) {
      // Đổi từ đơn vị bé sang đơn vị lớn -> chia
      return `Đổi từ đơn vị bé (${fromUnit}) sang đơn vị lớn (${toUnit}) cách nhau ${stepDiff} bậc: ta lấy số đo chia cho ${totalMultiplier.toLocaleString('vi-VN')} (hoặc nhân với ${ (1 / totalMultiplier).toLocaleString('vi-VN') }): ${inputVal} : ${totalMultiplier.toLocaleString('vi-VN')} = ${correctValue.toLocaleString('vi-VN')} ${toUnit}.`;
    } else {
      return `Hai đơn vị giống nhau: ${inputVal} ${fromUnit} = ${correctValue} ${toUnit}.`;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-50/50 to-white min-h-full flex flex-col justify-between">
      <div>
        {/* Header giới thiệu */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Scale size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                Bảng Quy Đổi Đơn Vị Đo Đại Lượng
              </h2>
            </div>
          </div>

          {/* Chọn loại đại lượng */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/70'
                }`}
              >
                {cat.icon}
                <span>{cat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Thanh ghi nhớ quy tắc vàng */}
        <div className="mb-6 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <Lightbulb size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950">
            <strong className="font-extrabold text-emerald-900">Quy tắc vàng ({currentCat.title}): </strong>
            <span>{currentCat.description}</span>
          </div>
        </div>

        {/* Bảng bậc thang trực quan các đơn vị */}
        <div className="mb-6 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bảng thứ tự các đơn vị từ LỚN đến BÉ
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Gấp/kém {currentCat.baseRatio} lần mỗi bậc
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {currentCat.units.map((unit, idx) => {
              const isFrom = unit.symbol === fromUnit;
              const isTo = unit.symbol === toUnit;
              return (
                <div
                  key={unit.symbol}
                  onClick={() => {
                    // Nếu bấm vào có thể đổi đơn vị nhanh
                    setFromUnit(unit.symbol);
                    setUserPracticeAnswer('');
                    setPracticeResult(null);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col justify-between ${
                    isFrom
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400'
                      : isTo
                      ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Bậc {idx + 1}
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-800 my-1 font-mono">
                    {unit.symbol}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 line-clamp-1">
                    {unit.name}
                  </div>
                  {isFrom && (
                    <span className="mt-2 text-[10px] font-black bg-emerald-600 text-white rounded-md py-0.5">
                      Từ đây
                    </span>
                  )}
                  {isTo && !isFrom && (
                    <span className="mt-2 text-[10px] font-black bg-amber-500 text-white rounded-md py-0.5">
                      Đến đây
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC ĐIỀU KHIỂN & BÀI TẬP: 2 CỘT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CỘT TRÁI: Nhập số đo và chọn đơn vị */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Calculator size={18} className="text-emerald-600" />
                Thiết lập số đo cần đổi
              </h3>

              {/* Nhập số lượng */}
              <div className="mb-3">
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Giá trị số đo:
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(parseFloat(e.target.value) || 0);
                    setUserPracticeAnswer('');
                    setPracticeResult(null);
                  }}
                  className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white outline-none font-mono"
                />
              </div>

              {/* Chọn đơn vị gốc */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Đơn vị ban đầu:
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value);
                      setUserPracticeAnswer('');
                      setPracticeResult(null);
                    }}
                    className="w-full text-xs font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  >
                    {currentCat.units.map(u => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol} ({u.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Đổi sang đơn vị:
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => {
                      setToUnit(e.target.value);
                      setUserPracticeAnswer('');
                      setPracticeResult(null);
                    }}
                    className="w-full text-xs font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  >
                    {currentCat.units.map(u => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol} ({u.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thao tác nhanh */}
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  className="flex-1 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Shuffle size={14} />
                  Đổi bài tập ngẫu nhiên
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

            {/* Tóm tắt đề bài */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Bài toán đổi đơn vị:
              </span>
              <div className="text-lg font-black font-mono text-emerald-800">
                {inputVal} {fromUnit} = <span className="text-amber-600">?</span> {toUnit}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BÀI GIẢI MẪU CHI TIẾT (SỐ LIỆU GỐC) HOẶC BẢNG GIẢI TƯƠNG TÁC (KHI ĐỔI SỐ LIỆU) */}
          <div className="lg:col-span-7">
            {isInitialData() ? (
              /* Bài giải mẫu chi tiết */
              <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-emerald-950 font-black text-sm flex items-center gap-2">
                      <ArrowRight size={18} className="text-emerald-600" />
                      Bài giải mẫu chi tiết
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Số liệu mẫu gốc
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs mb-3 space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <p className="font-bold text-emerald-900">
                      Hướng dẫn từng bước cách đổi:
                    </p>
                    <p className="text-slate-700">
                      {getStepExplanation()}
                    </p>
                    <div className="p-3 bg-emerald-50/80 rounded-xl font-mono text-emerald-900 font-extrabold text-sm sm:text-base border border-emerald-200">
                      {inputVal} {fromUnit} = {correctValue.toLocaleString('vi-VN')} {toUnit}
                    </div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-medium flex items-start gap-2.5">
                    <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Mẹo học tập:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi bài tập ngẫu nhiên"</em>, bài mẫu này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em trực tiếp tự làm và kiểm tra kết quả!
                    </span>
                  </div>
                </div>

                <div className="text-right pt-3 border-t border-emerald-200/80 mt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                    {correctValue.toLocaleString('vi-VN')} {toUnit}
                  </span>
                </div>
              </div>
            ) : (
              /* Bảng giải tương tác cho học sinh thực hành */
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

                  {/* Đề bài */}
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3 text-xs sm:text-sm text-slate-800">
                    <p className="font-bold text-amber-950 mb-1">
                      Đề bài yêu cầu:
                    </p>
                    <p>
                      Em hãy đổi số đo: <strong>{inputVal} {fromUnit}</strong> thành đơn vị <strong>{toUnit}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      Gợi ý: Hãy quan sát số bậc chênh lệch trên bảng thứ tự và nhân/chia với hệ số tương ứng nhé!
                    </p>
                  </div>

                  {/* Ô nhập câu trả lời */}
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Nhập số đo tính được:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ví dụ: 3500 hoặc 0,25..."
                        value={userPracticeAnswer}
                        onChange={(e) => {
                          setUserPracticeAnswer(e.target.value);
                          setPracticeResult(null);
                        }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-amber-950 bg-amber-50/50 p-2.5 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-sm font-black text-slate-600 shrink-0 px-3 py-2.5 bg-slate-100 rounded-xl">
                        {toUnit}
                      </span>
                    </div>
                  </div>

                  {/* Kết quả chấm đúng / sai */}
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
                            Hoan hô! Em đã đổi số đo hoàn toàn chính xác! 🎉
                          </p>
                          <div className="bg-white/20 p-2 rounded-xl font-mono text-xs">
                            ✓ {inputVal} {fromUnit} = {correctValue.toLocaleString('vi-VN')} {toUnit}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                            <XCircle size={18} className="text-rose-600" />
                            Chưa chính xác rồi em ơi! Em hãy xem lại số bậc chuyển đổi nhé.
                          </p>
                          <p className="text-rose-800 text-xs">
                            Gợi ý: {getStepExplanation()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Nút hành động */}
                <div className="space-y-2 pt-2 border-t border-amber-200">
                  {!practiceResult?.isChecked ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!userPracticeAnswer.trim()}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Check size={18} />
                      Kiểm tra kết quả
                    </button>
                  ) : practiceResult.isCorrect ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleRandomize}
                        className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={14} /> Thử bài tập khác
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
                        onClick={handleRetry}
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

      {/* Mascot đồng hành */}
      <div className="mt-6 flex justify-end">
        <MascotCompanion message="Em hãy nhớ: Khi đổi từ đơn vị lớn sang đơn vị bé thì làm phép NHÂN, còn từ bé sang lớn thì làm phép CHIA nhé!" />
      </div>
    </div>
  );
};

export default UnitConversionPanel;
