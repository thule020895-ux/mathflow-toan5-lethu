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
  BookOpen,
  PieChart,
  Split
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type SubMode = 'sum_ratio' | 'diff_ratio' | 'fraction_of_num';

interface RatioFractionPanelProps {
  initialSubMode?: SubMode;
}

export const RatioFractionPanel: React.FC<RatioFractionPanelProps> = ({ initialSubMode = 'sum_ratio' }) => {
  const [subMode, setSubMode] = useState<SubMode>(initialSubMode);

  React.useEffect(() => {
    if (initialSubMode) {
      setSubMode(initialSubMode);
    }
  }, [initialSubMode]);

  // Dữ liệu cho Tổng - Tỉ
  const [sumRatioData, setSumRatioData] = useState({
    sum: 60,
    numPart: 2,
    denPart: 3
  });

  // Dữ liệu cho Hiệu - Tỉ
  const [diffRatioData, setDiffRatioData] = useState({
    diff: 30,
    numPart: 2,
    denPart: 5
  });

  // Dữ liệu cho Tìm phân số của một số
  const [fracData, setFracData] = useState({
    total: 45,
    numerator: 3,
    denominator: 5
  });

  // State học sinh thực hành tương tác
  const [userAns1, setUserAns1] = useState<string>(''); // Số bé hoặc kết quả phân số
  const [userAns2, setUserAns2] = useState<string>(''); // Số lớn
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  // Kiểm tra số liệu mẫu ban đầu
  const isInitialData = () => {
    if (subMode === 'sum_ratio') {
      return sumRatioData.sum === 60 && sumRatioData.numPart === 2 && sumRatioData.denPart === 3;
    }
    if (subMode === 'diff_ratio') {
      return diffRatioData.diff === 30 && diffRatioData.numPart === 2 && diffRatioData.denPart === 5;
    }
    return fracData.total === 45 && fracData.numerator === 3 && fracData.denominator === 5;
  };

  // Tính kết quả thực tế
  // Tổng - Tỉ:
  const sumTotalParts = sumRatioData.numPart + sumRatioData.denPart;
  const sumPartVal = sumRatioData.sum / sumTotalParts;
  const sumSmaller = sumPartVal * sumRatioData.numPart;
  const sumLarger = sumPartVal * sumRatioData.denPart;

  // Hiệu - Tỉ:
  const diffTotalParts = Math.abs(diffRatioData.denPart - diffRatioData.numPart);
  const diffPartVal = diffRatioData.diff / (diffTotalParts || 1);
  const diffSmaller = diffPartVal * Math.min(diffRatioData.numPart, diffRatioData.denPart);
  const diffLarger = diffPartVal * Math.max(diffRatioData.numPart, diffRatioData.denPart);

  // Phân số của một số:
  const fracResult = (fracData.total * fracData.numerator) / (fracData.denominator || 1);

  const handleRandomize = () => {
    if (subMode === 'sum_ratio') {
      const parts = [
        { n: 1, d: 2 }, { n: 2, d: 3 }, { n: 3, d: 4 }, { n: 1, d: 4 }, { n: 2, d: 5 }, { n: 3, d: 5 }
      ];
      const selected = parts[Math.floor(Math.random() * parts.length)];
      const unitVal = Math.floor(Math.random() * 8) + 4; // 4..11
      const total = (selected.n + selected.d) * unitVal;
      setSumRatioData({ sum: total, numPart: selected.n, denPart: selected.d });
    } else if (subMode === 'diff_ratio') {
      const parts = [
        { n: 1, d: 3 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 1, d: 4 }, { n: 4, d: 7 }
      ];
      const selected = parts[Math.floor(Math.random() * parts.length)];
      const unitVal = Math.floor(Math.random() * 8) + 4;
      const difference = (selected.d - selected.n) * unitVal;
      setDiffRatioData({ diff: difference, numPart: selected.n, denPart: selected.d });
    } else {
      const dens = [3, 4, 5, 6, 8, 10];
      const d = dens[Math.floor(Math.random() * dens.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      const multiplier = Math.floor(Math.random() * 8) + 3;
      setFracData({ total: d * multiplier, numerator: n, denominator: d });
    }

    setUserAns1('');
    setUserAns2('');
    setPracticeResult(null);
  };

  const handleResetToInitial = () => {
    if (subMode === 'sum_ratio') {
      setSumRatioData({ sum: 60, numPart: 2, denPart: 3 });
    } else if (subMode === 'diff_ratio') {
      setDiffRatioData({ diff: 30, numPart: 2, denPart: 5 });
    } else {
      setFracData({ total: 45, numerator: 3, denominator: 5 });
    }
    setUserAns1('');
    setUserAns2('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    if (subMode === 'sum_ratio') {
      const sVal = parseFloat(userAns1.replace(',', '.'));
      const lVal = parseFloat(userAns2.replace(',', '.'));
      const isOk = Math.abs(sVal - sumSmaller) < 0.01 && Math.abs(lVal - sumLarger) < 0.01;
      setPracticeResult({ isChecked: true, isCorrect: isOk });
    } else if (subMode === 'diff_ratio') {
      const sVal = parseFloat(userAns1.replace(',', '.'));
      const lVal = parseFloat(userAns2.replace(',', '.'));
      const isOk = Math.abs(sVal - diffSmaller) < 0.01 && Math.abs(lVal - diffLarger) < 0.01;
      setPracticeResult({ isChecked: true, isCorrect: isOk });
    } else {
      const val = parseFloat(userAns1.replace(',', '.'));
      const isOk = Math.abs(val - fracResult) < 0.01;
      setPracticeResult({ isChecked: true, isCorrect: isOk });
    }
  };

  const handleRetry = () => {
    setUserAns1('');
    setUserAns2('');
    setPracticeResult(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-purple-50/40 via-white to-slate-50 min-h-full flex flex-col justify-between">
      <div>
        {/* Header với 3 tabs chọn dạng toán */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
                <Split size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                Toán Tỉ Số & Phân Số
              </h2>
            </div>
          </div>

          {/* Sub-tabs Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => { setSubMode('sum_ratio'); setUserAns1(''); setUserAns2(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                subMode === 'sum_ratio'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white/70'
              }`}
            >
              1. Tổng – Tỉ
            </button>
            <button
              onClick={() => { setSubMode('diff_ratio'); setUserAns1(''); setUserAns2(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                subMode === 'diff_ratio'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white/70'
              }`}
            >
              2. Hiệu – Tỉ
            </button>
            <button
              onClick={() => { setSubMode('fraction_of_num'); setUserAns1(''); setUserAns2(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                subMode === 'fraction_of_num'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white/70'
              }`}
            >
              3. Phân số của một số
            </button>
          </div>
        </div>

        {/* KHỐI SƠ ĐỒ ĐOẠN THẲNG TRỰC QUAN SỐ PHẦN */}
        <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={16} className="text-purple-600" />
              Sơ đồ minh họa số phần bằng nhau
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              {subMode === 'sum_ratio' && `Tỉ số: ${sumRatioData.numPart}/${sumRatioData.denPart} | Tổng: ${sumRatioData.sum}`}
              {subMode === 'diff_ratio' && `Tỉ số: ${diffRatioData.numPart}/${diffRatioData.denPart} | Hiệu: ${diffRatioData.diff}`}
              {subMode === 'fraction_of_num' && `Tìm ${fracData.numerator}/${fracData.denominator} của ${fracData.total}`}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            {subMode === 'sum_ratio' && (
              <>
                {/* Số bé */}
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">Số bé:</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: sumRatioData.numPart }).map((_, i) => (
                      <div key={i} className="h-8 w-12 sm:w-16 bg-amber-400 rounded-lg border border-amber-500 shadow-xs flex items-center justify-center text-[10px] font-bold text-slate-800">
                        1 phần
                      </div>
                    ))}
                  </div>
                </div>
                {/* Số lớn */}
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">Số lớn:</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: sumRatioData.denPart }).map((_, i) => (
                      <div key={i} className="h-8 w-12 sm:w-16 bg-purple-500 rounded-lg border border-purple-600 shadow-xs flex items-center justify-center text-[10px] font-bold text-white">
                        1 phần
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-purple-900">
                  <span>Tổng số phần bằng nhau: {sumRatioData.numPart} + {sumRatioData.denPart} = {sumTotalParts} phần</span>
                  <span>Tổng giá trị = {sumRatioData.sum}</span>
                </div>
              </>
            )}

            {subMode === 'diff_ratio' && (
              <>
                {/* Số bé */}
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">Số bé:</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: diffRatioData.numPart }).map((_, i) => (
                      <div key={i} className="h-8 w-12 sm:w-16 bg-amber-400 rounded-lg border border-amber-500 shadow-xs flex items-center justify-center text-[10px] font-bold text-slate-800">
                        1 phần
                      </div>
                    ))}
                  </div>
                </div>
                {/* Số lớn */}
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">Số lớn:</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: diffRatioData.denPart }).map((_, i) => {
                      const isExtra = i >= diffRatioData.numPart;
                      return (
                        <div key={i} className={`h-8 w-12 sm:w-16 rounded-lg border shadow-xs flex items-center justify-center text-[10px] font-bold ${
                          isExtra 
                            ? 'bg-rose-400 border-rose-500 text-white animate-pulse' 
                            : 'bg-purple-500 border-purple-600 text-white'
                        }`}>
                          {isExtra ? 'Phần hơn' : '1 phần'}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-rose-900">
                  <span>Hiệu số phần bằng nhau: {diffRatioData.denPart} - {diffRatioData.numPart} = {diffTotalParts} phần</span>
                  <span>Hiệu giá trị (phần hơn màu đỏ) = {diffRatioData.diff}</span>
                </div>
              </>
            )}

            {subMode === 'fraction_of_num' && (
              <>
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">Số {fracData.total}:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {Array.from({ length: fracData.denominator }).map((_, i) => {
                      const isTaken = i < fracData.numerator;
                      return (
                        <div key={i} className={`h-9 w-14 sm:w-16 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-bold ${
                          isTaken 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'bg-slate-200 border-slate-300 text-slate-600'
                        }`}>
                          <span>1/{fracData.denominator}</span>
                          <span className="text-[9px] font-mono font-semibold">({fracData.total / fracData.denominator})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-emerald-900">
                  <span>Số phần lấy: {fracData.numerator} phần xanh lá trên tổng số {fracData.denominator} phần bằng nhau</span>
                  <span>Mỗi phần có giá trị = {fracData.total} : {fracData.denominator} = {fracData.total / fracData.denominator}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2 CỘT: THIẾT LẬP DỮ LIỆU & BÀI GIẢI MẪU VS BẢNG GIẢI TƯƠNG TÁC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Calculator size={18} className="text-purple-600" />
                Dữ liệu bài toán
              </h3>

              {subMode === 'sum_ratio' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tổng hai số:</label>
                    <input
                      type="number"
                      value={sumRatioData.sum}
                      onChange={(e) => {
                        setSumRatioData({ ...sumRatioData, sum: parseFloat(e.target.value) || 0 });
                        setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Số phần số bé:</label>
                      <input
                        type="number"
                        value={sumRatioData.numPart}
                        onChange={(e) => {
                          setSumRatioData({ ...sumRatioData, numPart: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Số phần số lớn:</label>
                      <input
                        type="number"
                        value={sumRatioData.denPart}
                        onChange={(e) => {
                          setSumRatioData({ ...sumRatioData, denPart: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {subMode === 'diff_ratio' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Hiệu hai số:</label>
                    <input
                      type="number"
                      value={diffRatioData.diff}
                      onChange={(e) => {
                        setDiffRatioData({ ...diffRatioData, diff: parseFloat(e.target.value) || 0 });
                        setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Số phần số bé:</label>
                      <input
                        type="number"
                        value={diffRatioData.numPart}
                        onChange={(e) => {
                          setDiffRatioData({ ...diffRatioData, numPart: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Số phần số lớn:</label>
                      <input
                        type="number"
                        value={diffRatioData.denPart}
                        onChange={(e) => {
                          setDiffRatioData({ ...diffRatioData, denPart: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setUserAns2(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {subMode === 'fraction_of_num' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Số đã cho:</label>
                    <input
                      type="number"
                      value={fracData.total}
                      onChange={(e) => {
                        setFracData({ ...fracData, total: parseFloat(e.target.value) || 0 });
                        setUserAns1(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Tử số:</label>
                      <input
                        type="number"
                        value={fracData.numerator}
                        onChange={(e) => {
                          setFracData({ ...fracData, numerator: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Mẫu số:</label>
                      <input
                        type="number"
                        value={fracData.denominator}
                        onChange={(e) => {
                          setFracData({ ...fracData, denominator: parseInt(e.target.value) || 1 });
                          setUserAns1(''); setPracticeResult(null);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nút random / reset */}
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  className="flex-1 py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
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

            {/* Tóm tắt đề bài */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[11px]">
                Đề bài cụ thể:
              </span>
              {subMode === 'sum_ratio' && (
                <p className="font-semibold text-slate-700">
                  Tìm hai số biết tổng của chúng bằng <strong className="text-purple-800 font-black">{sumRatioData.sum}</strong> và tỉ số là <strong className="text-purple-800 font-black">{sumRatioData.numPart}/{sumRatioData.denPart}</strong>.
                </p>
              )}
              {subMode === 'diff_ratio' && (
                <p className="font-semibold text-slate-700">
                  Tìm hai số biết hiệu của chúng bằng <strong className="text-rose-700 font-black">{diffRatioData.diff}</strong> và tỉ số là <strong className="text-rose-700 font-black">{diffRatioData.numPart}/{diffRatioData.denPart}</strong>.
                </p>
              )}
              {subMode === 'fraction_of_num' && (
                <p className="font-semibold text-slate-700">
                  Tìm <strong className="text-emerald-700 font-black">{fracData.numerator}/{fracData.denominator}</strong> của số <strong className="text-emerald-700 font-black">{fracData.total}</strong>.
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: BÀI GIẢI MẪU HOẶC BẢNG GIẢI TƯƠNG TÁC */}
          <div className="lg:col-span-7">
            {isInitialData() ? (
              /* Bài giải mẫu chi tiết */
              <div className="bg-purple-50/70 p-4 sm:p-5 rounded-3xl border border-purple-200 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-purple-950 font-black text-sm flex items-center gap-2">
                      <ArrowRight size={18} className="text-purple-600" />
                      Bài giải mẫu chi tiết từng bước
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-300">
                      Số liệu mẫu gốc
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs mb-3 space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {subMode === 'sum_ratio' && (
                      <>
                        <p>1. Theo sơ đồ, tổng số phần bằng nhau là: <strong>{sumRatioData.numPart} + {sumRatioData.denPart} = {sumTotalParts}</strong> (phần)</p>
                        <p>2. Giá trị của một phần là: <strong>{sumRatioData.sum} : {sumTotalParts} = {sumPartVal}</strong></p>
                        <p>3. Số bé là: <strong>{sumPartVal} × {sumRatioData.numPart} = {sumSmaller}</strong></p>
                        <p>4. Số lớn là: <strong>{sumPartVal} × {sumRatioData.denPart} = {sumLarger}</strong> (hoặc {sumRatioData.sum} - {sumSmaller} = {sumLarger})</p>
                      </>
                    )}

                    {subMode === 'diff_ratio' && (
                      <>
                        <p>1. Theo sơ đồ, hiệu số phần bằng nhau là: <strong>{diffRatioData.denPart} - {diffRatioData.numPart} = {diffTotalParts}</strong> (phần)</p>
                        <p>2. Giá trị của một phần là: <strong>{diffRatioData.diff} : {diffTotalParts} = {diffPartVal}</strong></p>
                        <p>3. Số bé là: <strong>{diffPartVal} × {diffRatioData.numPart} = {diffSmaller}</strong></p>
                        <p>4. Số lớn là: <strong>{diffSmaller} + {diffRatioData.diff} = {diffLarger}</strong></p>
                      </>
                    )}

                    {subMode === 'fraction_of_num' && (
                      <>
                        <p>Muốn tìm phân số của một số, ta lấy số đó nhân với phân số:</p>
                        <p><strong>{fracData.total} × {fracData.numerator}/{fracData.denominator} = ({fracData.total} : {fracData.denominator}) × {fracData.numerator} = {fracResult}</strong></p>
                      </>
                    )}
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                    <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Mẹo:</strong> Khi em đổi số đo, bảng này sẽ chuyển sang <strong>Bảng giải tương tác</strong> để em tự thực hành và rèn luyện tư duy!
                    </span>
                  </div>
                </div>

                <div className="text-right pt-3 border-t border-purple-200 mt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                  {subMode === 'fraction_of_num' ? (
                    <span className="text-2xl font-black text-emerald-700 font-mono">{fracResult}</span>
                  ) : (
                    <div className="text-xl sm:text-2xl font-black text-purple-900 font-mono">
                      Số bé: <span className="text-amber-600">{subMode === 'sum_ratio' ? sumSmaller : diffSmaller}</span> ; Số lớn: <span className="text-purple-600">{subMode === 'sum_ratio' ? sumLarger : diffLarger}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Bảng giải tương tác cho học sinh */
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

                  {/* Đề bài luyện tập */}
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3 text-xs sm:text-sm text-slate-800">
                    <p className="font-bold text-amber-950 mb-1">
                      Đề bài yêu cầu:
                    </p>
                    {subMode === 'sum_ratio' && (
                      <p>Tìm hai số biết tổng = <strong>{sumRatioData.sum}</strong> và tỉ số = <strong>{sumRatioData.numPart}/{sumRatioData.denPart}</strong>.</p>
                    )}
                    {subMode === 'diff_ratio' && (
                      <p>Tìm hai số biết hiệu = <strong>{diffRatioData.diff}</strong> và tỉ số = <strong>{diffRatioData.numPart}/{diffRatioData.denPart}</strong>.</p>
                    )}
                    {subMode === 'fraction_of_num' && (
                      <p>Tính giá trị của <strong>{fracData.numerator}/{fracData.denominator}</strong> của số <strong>{fracData.total}</strong>.</p>
                    )}
                  </div>

                  {/* Nhập đáp án */}
                  {subMode === 'fraction_of_num' ? (
                    <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nhập kết quả tính được:
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập đáp số..."
                        value={userAns1}
                        onChange={(e) => { setUserAns1(e.target.value); setPracticeResult(null); }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-emerald-950 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white p-3 rounded-2xl border border-amber-200">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Số bé:</label>
                        <input
                          type="text"
                          placeholder="Số bé = ?"
                          value={userAns1}
                          onChange={(e) => { setUserAns1(e.target.value); setPracticeResult(null); }}
                          disabled={practiceResult?.isCorrect}
                          className="w-full text-base font-black text-amber-950 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200 outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-amber-200">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Số lớn:</label>
                        <input
                          type="text"
                          placeholder="Số lớn = ?"
                          value={userAns2}
                          onChange={(e) => { setUserAns2(e.target.value); setPracticeResult(null); }}
                          disabled={practiceResult?.isCorrect}
                          className="w-full text-base font-black text-purple-950 bg-purple-50/40 p-2.5 rounded-xl border border-purple-200 outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Kết quả chấm */}
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
                            Chính xác 100%! Em làm bài rất tốt! 🎉
                          </p>
                          <div className="bg-white/20 p-2 rounded-xl font-mono text-xs">
                            ✓ {subMode === 'fraction_of_num' ? `Đáp số: ${fracResult}` : `Số bé = ${subMode === 'sum_ratio' ? sumSmaller : diffSmaller} ; Số lớn = ${subMode === 'sum_ratio' ? sumLarger : diffLarger}`}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                            <XCircle size={18} className="text-rose-600" />
                            Chưa chính xác! Em hãy xem lại các bước tìm giá trị một phần nhé.
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
                      disabled={!userAns1.trim() || (subMode !== 'fraction_of_num' && !userAns2.trim())}
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

      <div className="mt-6 flex justify-end">
        <MascotCompanion message="Bí quyết giải bài toán Tổng - Tỉ và Hiệu - Tỉ là luôn tìm GIÁ TRỊ CỦA MỘT PHẦN trước tiên nhé!" />
      </div>
    </div>
  );
};

export default RatioFractionPanel;
