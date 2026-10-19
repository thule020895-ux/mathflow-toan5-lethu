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
  Percent,
  BookOpen
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type PercentType = 'find_rate' | 'find_value' | 'find_whole';

export const PercentagePanel: React.FC = () => {
  const [activeType, setActiveType] = useState<PercentType>('find_rate');

  // Dữ liệu dạng 1: Tìm tỉ số % của a và b
  const [data1, setData1] = useState({ a: 15, b: 60 });

  // Dữ liệu dạng 2: Tìm x% của số B
  const [data2, setData2] = useState({ percent: 20, b: 150 });

  // Dữ liệu dạng 3: Tìm một số biết x% của nó là A
  const [data3, setData3] = useState({ percent: 30, a: 72 });

  // State học sinh làm bài tập tương tác
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  // Kiểm tra số liệu mẫu ban đầu
  const isInitialData = () => {
    if (activeType === 'find_rate') return data1.a === 15 && data1.b === 60;
    if (activeType === 'find_value') return data2.percent === 20 && data2.b === 150;
    return data3.percent === 30 && data3.a === 72;
  };

  // Tính kết quả thực tế
  const correctVal1 = (data1.a / (data1.b || 1)) * 100;
  const correctVal2 = (data2.b * data2.percent) / 100;
  const correctVal3 = (data3.a / (data3.percent || 1)) * 100;

  const handleRandomize = () => {
    if (activeType === 'find_rate') {
      const bVals = [20, 25, 40, 50, 80, 100, 200];
      const b = bVals[Math.floor(Math.random() * bVals.length)];
      const perc = (Math.floor(Math.random() * 8) + 1) * 10; // 10%, 20%... 80%
      const a = (b * perc) / 100;
      setData1({ a, b });
    } else if (activeType === 'find_value') {
      const percs = [10, 15, 20, 25, 30, 40, 50, 75];
      const p = percs[Math.floor(Math.random() * percs.length)];
      const b = (Math.floor(Math.random() * 15) + 5) * 20;
      setData2({ percent: p, b });
    } else {
      const percs = [10, 20, 25, 30, 40, 50];
      const p = percs[Math.floor(Math.random() * percs.length)];
      const whole = (Math.floor(Math.random() * 10) + 5) * 20;
      const a = (whole * p) / 100;
      setData3({ percent: p, a });
    }

    setUserAnswer('');
    setPracticeResult(null);
  };

  const handleResetToInitial = () => {
    if (activeType === 'find_rate') setData1({ a: 15, b: 60 });
    else if (activeType === 'find_value') setData2({ percent: 20, b: 150 });
    else setData3({ percent: 30, a: 72 });

    setUserAnswer('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    const val = parseFloat(userAnswer.replace('%', '').replace(',', '.'));
    if (isNaN(val)) {
      setPracticeResult({ isChecked: true, isCorrect: false });
      return;
    }

    let target = 0;
    if (activeType === 'find_rate') target = correctVal1;
    else if (activeType === 'find_value') target = correctVal2;
    else target = correctVal3;

    const isOk = Math.abs(val - target) < 0.05;
    setPracticeResult({ isChecked: true, isCorrect: isOk });
  };

  const handleRetry = () => {
    setUserAnswer('');
    setPracticeResult(null);
  };

  // Phần trăm để hiển thị thanh trực quan
  const visualPercent = Math.min(100, Math.max(0, 
    activeType === 'find_rate' ? correctVal1 :
    activeType === 'find_value' ? data2.percent : data3.percent
  ));

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-rose-50/40 via-white to-slate-50 min-h-full flex flex-col justify-between">
      <div>
        {/* Header với 3 tabs chọn 3 dạng toán tỉ số % */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-600 text-white rounded-xl shadow-xs">
              <Percent size={20} />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
              Tỉ Số Phần Trăm
            </h2>
          </div>

          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => { setActiveType('find_rate'); setUserAnswer(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                activeType === 'find_rate'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-white/70'
              }`}
            >
              Dạng 1: Tìm tỉ số % của hai số
            </button>
            <button
              onClick={() => { setActiveType('find_value'); setUserAnswer(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                activeType === 'find_value'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-white/70'
              }`}
            >
              Dạng 2: Tìm a% của một số
            </button>
            <button
              onClick={() => { setActiveType('find_whole'); setUserAnswer(''); setPracticeResult(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                activeType === 'find_whole'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-white/70'
              }`}
            >
              Dạng 3: Tìm một số biết a% của nó
            </button>
          </div>
        </div>

        {/* KHỐI TRỰC QUAN HÓA THANH TỈ LỆ % */}
        <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={16} className="text-rose-600" />
              Thanh trực quan tỉ lệ phần trăm (0% → 100%)
            </span>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-mono">
              Tỉ lệ: {visualPercent.toFixed(1)}%
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-full bg-slate-200 h-8 rounded-xl overflow-hidden relative border border-slate-300">
              <div 
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full flex items-center justify-end pr-2 text-white font-black text-xs transition-all duration-500"
                style={{ width: `${visualPercent}%` }}
              >
                {visualPercent >= 10 && `${visualPercent.toFixed(1)}%`}
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>0% (0)</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100% (Toàn bộ)</span>
            </div>
          </div>
        </div>

        {/* 2 CỘT: DỮ LIỆU & BÀI MẪU VS BẢNG TƯƠNG TÁC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Calculator size={18} className="text-rose-600" />
                Dữ liệu bài toán
              </h3>

              {activeType === 'find_rate' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Số thứ nhất (a):</label>
                    <input
                      type="number"
                      value={data1.a}
                      onChange={(e) => {
                        setData1({ ...data1, a: parseFloat(e.target.value) || 0 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Số thứ hai (b):</label>
                    <input
                      type="number"
                      value={data1.b}
                      onChange={(e) => {
                        setData1({ ...data1, b: parseFloat(e.target.value) || 1 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {activeType === 'find_value' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Tỉ lệ phần trăm cần tìm (%):</label>
                    <input
                      type="number"
                      value={data2.percent}
                      onChange={(e) => {
                        setData2({ ...data2, percent: parseFloat(e.target.value) || 0 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Số đã cho (B):</label>
                    <input
                      type="number"
                      value={data2.b}
                      onChange={(e) => {
                        setData2({ ...data2, b: parseFloat(e.target.value) || 0 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {activeType === 'find_whole' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Giá trị phần trăm đã biết (%):</label>
                    <input
                      type="number"
                      value={data3.percent}
                      onChange={(e) => {
                        setData3({ ...data3, percent: parseFloat(e.target.value) || 1 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Giá trị tương ứng (A):</label>
                    <input
                      type="number"
                      value={data3.a}
                      onChange={(e) => {
                        setData3({ ...data3, a: parseFloat(e.target.value) || 0 });
                        setUserAnswer(''); setPracticeResult(null);
                      }}
                      className="w-full text-base font-black text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Nút random / reset */}
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  className="flex-1 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
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
              {activeType === 'find_rate' && (
                <p className="font-semibold text-slate-700">
                  Tìm tỉ số phần trăm của số <strong className="text-rose-800 font-black">{data1.a}</strong> và số <strong className="text-rose-800 font-black">{data1.b}</strong>.
                </p>
              )}
              {activeType === 'find_value' && (
                <p className="font-semibold text-slate-700">
                  Tìm <strong className="text-rose-800 font-black">{data2.percent}%</strong> của số <strong className="text-rose-800 font-black">{data2.b}</strong>.
                </p>
              )}
              {activeType === 'find_whole' && (
                <p className="font-semibold text-slate-700">
                  Tìm một số biết <strong className="text-rose-800 font-black">{data3.percent}%</strong> của số đó là <strong className="text-rose-800 font-black">{data3.a}</strong>.
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: BÀI GIẢI MẪU HOẶC BẢNG GIẢI TƯƠNG TÁC */}
          <div className="lg:col-span-7">
            {isInitialData() ? (
              /* Bài giải mẫu chi tiết */
              <div className="bg-rose-50/70 p-4 sm:p-5 rounded-3xl border border-rose-200 shadow-xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-rose-950 font-black text-sm flex items-center gap-2">
                      <ArrowRight size={18} className="text-rose-600" />
                      Bài giải mẫu chi tiết theo quy tắc SGK
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full border border-rose-300">
                      Số liệu mẫu gốc
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs mb-3 space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeType === 'find_rate' && (
                      <>
                        <p className="font-bold text-rose-900">Quy tắc tìm tỉ số phần trăm của 2 số a và b:</p>
                        <p>1. Tìm thương của {data1.a} và {data1.b}: <strong>{data1.a} : {data1.b} = {(data1.a / data1.b).toFixed(2)}</strong></p>
                        <p>2. Nhân thương đó với 100 rồi viết thêm kí hiệu % vào bên phải:</p>
                        <p className="font-mono font-bold text-rose-800 text-sm">{(data1.a / data1.b).toFixed(2)} × 100% = {correctVal1}%</p>
                      </>
                    )}

                    {activeType === 'find_value' && (
                      <>
                        <p className="font-bold text-rose-900">Quy tắc tìm a% của một số B:</p>
                        <p>Muốn tìm {data2.percent}% của {data2.b}, ta có thể lấy {data2.b} chia cho 100 rồi nhân với {data2.percent} (hoặc lấy {data2.b} nhân với {data2.percent} rồi chia cho 100):</p>
                        <p className="font-mono font-bold text-rose-800 text-sm">{data2.b} × {data2.percent} : 100 = {correctVal2}</p>
                      </>
                    )}

                    {activeType === 'find_whole' && (
                      <>
                        <p className="font-bold text-rose-900">Quy tắc tìm một số khi biết a% của nó là A:</p>
                        <p>Muốn tìm số đó, ta có thể lấy {data3.a} chia cho {data3.percent} rồi nhân với 100 (hoặc lấy {data3.a} nhân với 100 rồi chia cho {data3.percent}):</p>
                        <p className="font-mono font-bold text-rose-800 text-sm">{data3.a} : {data3.percent} × 100 = {correctVal3}</p>
                      </>
                    )}
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                    <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Lưu ý:</strong> Khi em đổi số đo, bảng này sẽ chuyển sang <strong>Bảng giải tương tác</strong> để em trực tiếp giải và tự kiểm tra kết quả!
                    </span>
                  </div>
                </div>

                <div className="text-right pt-3 border-t border-rose-200 mt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                  <span className="text-2xl font-black text-rose-700 font-mono">
                    {activeType === 'find_rate' ? `${correctVal1}%` : (activeType === 'find_value' ? correctVal2 : correctVal3)}
                  </span>
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
                    {activeType === 'find_rate' && (
                      <p>Tính tỉ số phần trăm của <strong>{data1.a}</strong> và <strong>{data1.b}</strong>.</p>
                    )}
                    {activeType === 'find_value' && (
                      <p>Tính <strong>{data2.percent}%</strong> của số <strong>{data2.b}</strong>.</p>
                    )}
                    {activeType === 'find_whole' && (
                      <p>Tìm một số biết <strong>{data3.percent}%</strong> của số đó là <strong>{data3.a}</strong>.</p>
                    )}
                  </div>

                  {/* Ô nhập câu trả lời */}
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 mb-3">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nhập kết quả tính được:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nhập đáp số..."
                        value={userAnswer}
                        onChange={(e) => { setUserAnswer(e.target.value); setPracticeResult(null); }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-rose-950 bg-rose-50/40 p-2.5 rounded-xl border border-rose-200 outline-none focus:border-rose-500 font-mono"
                      />
                      {activeType === 'find_rate' && (
                        <span className="text-base font-black text-slate-600 shrink-0 px-3 py-2.5 bg-slate-100 rounded-xl">
                          %
                        </span>
                      )}
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
                            Chính xác 100%! Em rất giỏi! 🎉
                          </p>
                          <div className="bg-white/20 p-2 rounded-xl font-mono text-xs">
                            ✓ Đáp số đúng: {activeType === 'find_rate' ? `${correctVal1}%` : (activeType === 'find_value' ? correctVal2 : correctVal3)}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                            <XCircle size={18} className="text-rose-600" />
                            Chưa chính xác! Em hãy xem lại quy tắc tính nhân/chia với 100 nhé.
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
                      disabled={!userAnswer.trim()}
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
        <MascotCompanion message="Ghi nhớ: Tìm tỉ số phần trăm thì NHÂN 100%; tìm giá trị phần trăm thì NHÂN rồi CHIA 100; tìm số ban đầu thì CHIA rồi NHÂN 100!" />
      </div>
    </div>
  );
};

export default PercentagePanel;
