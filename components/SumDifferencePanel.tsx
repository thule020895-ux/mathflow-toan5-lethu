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
  Calculator,
  Shuffle,
  BookOpen
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

const INITIAL_PARAMS = {
  sum: 70,
  diff: 20
};

export const SumDifferencePanel: React.FC = () => {
  const [sum, setSum] = useState<number>(INITIAL_PARAMS.sum);
  const [diff, setDiff] = useState<number>(INITIAL_PARAMS.diff);

  // State bài tập tương tác
  const [userLarger, setUserLarger] = useState<string>('');
  const [userSmaller, setUserSmaller] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  // Kiểm tra số liệu mẫu ban đầu
  const isInitialData = () => {
    return sum === INITIAL_PARAMS.sum && diff === INITIAL_PARAMS.diff;
  };

  // Tính kết quả thực tế
  const correctLarger = (sum + diff) / 2;
  const correctSmaller = (sum - diff) / 2;

  const handleRandomize = () => {
    // Sinh số chẵn đẹp cho cấp 1
    const randSmaller = Math.floor(Math.random() * 30) + 10;
    const randDiff = Math.floor(Math.random() * 20) + 6;
    const newDiff = randDiff;
    const newSum = randSmaller * 2 + newDiff; // Đảm bảo tổng - hiệu là số chẵn

    setSum(newSum);
    setDiff(newDiff);
    setUserLarger('');
    setUserSmaller('');
    setPracticeResult(null);
  };

  const handleResetToInitial = () => {
    setSum(INITIAL_PARAMS.sum);
    setDiff(INITIAL_PARAMS.diff);
    setUserLarger('');
    setUserSmaller('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    const lVal = parseFloat(userLarger.replace(',', '.'));
    const sVal = parseFloat(userSmaller.replace(',', '.'));

    if (isNaN(lVal) || isNaN(sVal)) {
      setPracticeResult({ isChecked: true, isCorrect: false });
      return;
    }

    const isLCorrect = Math.abs(lVal - correctLarger) < 0.01;
    const isSCorrect = Math.abs(sVal - correctSmaller) < 0.01;

    setPracticeResult({
      isChecked: true,
      isCorrect: isLCorrect && isSCorrect
    });
  };

  const handleRetry = () => {
    setUserLarger('');
    setUserSmaller('');
    setPracticeResult(null);
  };

  // Tính chiều rộng tỉ lệ thanh biểu đồ sơ đồ đoạn thẳng
  const maxVal = Math.max(correctLarger, 1);
  const largerPercent = 100;
  const smallerPercent = Math.max(15, Math.min(95, (correctSmaller / maxVal) * 100));

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 min-h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                <Scale size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                Tìm Hai Số Khi Biết Tổng Và Hiệu
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-bold text-indigo-900">
              Công thức cốt lõi:
            </span>
            <span className="text-xs font-black text-indigo-700 font-mono bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
              Số lớn = (Tổng + Hiệu) : 2
            </span>
          </div>
        </div>

        {/* Khối trực quan hóa sơ đồ đoạn thẳng */}
        <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={16} className="text-indigo-600" />
              Sơ đồ đoạn thẳng trực quan mô phỏng bài toán
            </span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Tổng = {sum} | Hiệu = {diff}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            {/* Đoạn thẳng số lớn */}
            <div className="flex items-center gap-3">
              <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">
                Số lớn:
              </span>
              <div className="flex-1 flex items-center">
                <div 
                  className="h-8 bg-indigo-500 text-white font-bold text-xs flex items-center justify-between px-3 rounded-xl shadow-xs transition-all duration-300 relative"
                  style={{ width: `${largerPercent}%` }}
                >
                  <span>{correctLarger}</span>
                  <span className="text-[10px] bg-indigo-700/80 px-2 py-0.5 rounded-md">
                    Chênh lệch: +{diff}
                  </span>
                </div>
              </div>
            </div>

            {/* Đoạn thẳng số bé */}
            <div className="flex items-center gap-3">
              <span className="w-16 sm:w-20 text-xs font-black text-slate-700 shrink-0">
                Số bé:
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div 
                  className="h-8 bg-emerald-500 text-white font-bold text-xs flex items-center justify-start px-3 rounded-xl shadow-xs transition-all duration-300"
                  style={{ width: `${smallerPercent}%` }}
                >
                  <span>{correctSmaller}</span>
                </div>
                {/* Đoạn chênh lệch nét đứt */}
                <div 
                  className="h-8 border-2 border-dashed border-rose-400 bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center px-2 rounded-xl"
                  style={{ width: `${100 - smallerPercent}%` }}
                >
                  <span className="text-[11px] font-black">Hiệu: {diff}</span>
                </div>
              </div>
            </div>

            {/* Chú thích ngoặc tổng */}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-600 font-semibold">
              <span>Đoạn nét đứt màu đỏ là hiệu ({diff})</span>
              <span className="font-bold text-indigo-900">Tổng của cả hai số là: {sum}</span>
            </div>
          </div>
        </div>

        {/* 2 Cột: Điều khiển & Bài giải mẫu vs Bảng giải tương tác */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CỘT TRÁI: Nhập Tổng và Hiệu */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Calculator size={18} className="text-indigo-600" />
                Dữ liệu bài toán
              </h3>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Tổng của hai số:
                  </label>
                  <input
                    type="number"
                    value={sum}
                    onChange={(e) => {
                      setSum(parseFloat(e.target.value) || 0);
                      setUserLarger('');
                      setUserSmaller('');
                      setPracticeResult(null);
                    }}
                    className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Hiệu của hai số:
                  </label>
                  <input
                    type="number"
                    value={diff}
                    onChange={(e) => {
                      setDiff(parseFloat(e.target.value) || 0);
                      setUserLarger('');
                      setUserSmaller('');
                      setPracticeResult(null);
                    }}
                    className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  className="flex-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
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
              <p className="font-semibold text-slate-700">
                Tìm hai số biết tổng của chúng bằng <strong className="text-indigo-800 font-black">{sum}</strong> và hiệu của chúng bằng <strong className="text-rose-700 font-black">{diff}</strong>.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: BÀI GIẢI MẪU CHI TIẾT (SỐ LIỆU GỐC) HOẶC BẢNG GIẢI TƯƠNG TÁC (KHI ĐỔI SỐ LIỆU) */}
          <div className="lg:col-span-7">
            {isInitialData() ? (
              /* Bài giải mẫu chi tiết cho số liệu gốc */
              <div className="bg-indigo-50/70 p-4 sm:p-5 rounded-3xl border border-indigo-200 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-indigo-950 font-black text-sm flex items-center gap-2">
                      <ArrowRight size={18} className="text-indigo-600" />
                      Bài giải mẫu chi tiết (2 cách giải)
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-300">
                      Số liệu mẫu gốc
                    </span>
                  </div>

                  <div className="space-y-3 mb-3 text-xs sm:text-sm">
                    {/* Cách 1 */}
                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-xs">
                      <p className="font-extrabold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                        Cách 1: Tìm số lớn trước
                      </p>
                      <div className="space-y-1 text-slate-700 font-medium pl-6">
                        <p>Số lớn là: ({sum} + {diff}) : 2 = <strong className="text-indigo-800 font-bold">{correctLarger}</strong></p>
                        <p>Số bé là: {correctLarger} - {diff} = <strong className="text-emerald-700 font-bold">{correctSmaller}</strong> (hoặc {sum} - {correctLarger} = {correctSmaller})</p>
                      </div>
                    </div>

                    {/* Cách 2 */}
                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-xs">
                      <p className="font-extrabold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                        Cách 2: Tìm số bé trước
                      </p>
                      <div className="space-y-1 text-slate-700 font-medium pl-6">
                        <p>Số bé là: ({sum} - {diff}) : 2 = <strong className="text-emerald-700 font-bold">{correctSmaller}</strong></p>
                        <p>Số lớn là: {correctSmaller} + {diff} = <strong className="text-indigo-800 font-bold">{correctLarger}</strong> (hoặc {sum} - {correctSmaller} = {correctLarger})</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                    <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Gợi ý:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi số liệu ngẫu nhiên"</em>, bài mẫu này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em trực tiếp giải và tự kiểm tra!
                    </span>
                  </div>
                </div>

                <div className="text-right pt-3 border-t border-indigo-200/80 mt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                  <div className="text-xl sm:text-2xl font-black text-indigo-900 font-mono">
                    Số lớn: <span className="text-indigo-600">{correctLarger}</span> ; Số bé: <span className="text-emerald-600">{correctSmaller}</span>
                  </div>
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
                      Đề bài cần giải:
                    </p>
                    <p>
                      Tìm hai số biết tổng bằng <strong>{sum}</strong> và hiệu bằng <strong>{diff}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      Gợi ý: Số lớn = (Tổng + Hiệu) : 2; Số bé = Số lớn - Hiệu.
                    </p>
                  </div>

                  {/* Nhập đáp án */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white p-3 rounded-2xl border border-amber-200">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nhập Số lớn:
                      </label>
                      <input
                        type="text"
                        placeholder="Số lớn = ?"
                        value={userLarger}
                        onChange={(e) => {
                          setUserLarger(e.target.value);
                          setPracticeResult(null);
                        }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-indigo-950 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-amber-200">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nhập Số bé:
                      </label>
                      <input
                        type="text"
                        placeholder="Số bé = ?"
                        value={userSmaller}
                        onChange={(e) => {
                          setUserSmaller(e.target.value);
                          setPracticeResult(null);
                        }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-emerald-950 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Kết quả */}
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
                            Xuất sắc! Em đã tìm đúng cả hai số! 🎉
                          </p>
                          <div className="bg-white/20 p-2 rounded-xl font-mono text-xs">
                            ✓ Số lớn = ({sum} + {diff}) : 2 = {correctLarger} | Số bé = {correctLarger} - {diff} = {correctSmaller}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                            <XCircle size={18} className="text-rose-600" />
                            Kết quả chưa chính xác! Em hãy thử tính lại nhé.
                          </p>
                          <p className="text-rose-800 text-xs">
                            Gợi ý: Lấy ({sum} + {diff}) rồi chia cho 2 để tìm Số lớn trước nhé!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Nút kiểm tra / làm lại */}
                <div className="space-y-2 pt-2 border-t border-amber-200">
                  {!practiceResult?.isChecked ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!userLarger.trim() || !userSmaller.trim()}
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
        <MascotCompanion message="Ghi nhớ công thức vàng: Số lớn = (Tổng + Hiệu) : 2; Số bé = (Tổng - Hiệu) : 2 hoặc Lấy Số lớn trừ đi Hiệu nhé các bạn!" />
      </div>
    </div>
  );
};

export default SumDifferencePanel;
