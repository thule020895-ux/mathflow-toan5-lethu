import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Calculator, 
  Info, 
  Bike, 
  Car, 
  Navigation, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Check,
  Lightbulb,
  Edit3
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type MotionMode = 's' | 'v' | 't';

const MotionPanel: React.FC = () => {
  const [mode, setMode] = useState<MotionMode>('s');
  const [inputs, setInputs] = useState({
    s: 120, // distance
    v: 40,  // velocity
    t: 3,   // time
    unitS: 'km',
    unitV: 'km/giờ',
    unitT: 'giờ'
  });

  // State bảng thực hành tương tác
  const [userPracticeInput, setUserPracticeInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  const [animProgress, setAnimProgress] = useState(0);

  const isInitialData = () => {
    return inputs.v === 40 && inputs.t === 3 && inputs.s === 120;
  };

  const resetToInitialData = () => {
    setInputs({
      s: 120,
      v: 40,
      t: 3,
      unitS: 'km',
      unitV: 'km/giờ',
      unitT: 'giờ'
    });
    setUserPracticeInput('');
    setPracticeResult(null);
  };

  const getExpectedValue = () => {
    if (mode === 's') return Number((inputs.v * inputs.t).toFixed(2));
    if (mode === 'v') return inputs.t !== 0 ? Number((inputs.s / inputs.t).toFixed(2)) : 0;
    if (mode === 't') return inputs.v !== 0 ? Number((inputs.s / inputs.v).toFixed(2)) : 0;
    return 0;
  };

  const handleCheckAnswer = () => {
    const expected = getExpectedValue();
    const userVal = parseFloat(userPracticeInput.trim().replace(',', '.'));
    const isOk = !isNaN(userVal) && Math.abs(userVal - expected) <= 0.05;
    setPracticeResult({
      isChecked: true,
      isCorrect: isOk
    });
  };

  const handleRetry = () => {
    setPracticeResult(null);
    setUserPracticeInput('');
  };

  // Auto calculate based on mode
  useEffect(() => {
    if (mode === 's') {
      setInputs(prev => ({ ...prev, s: Number((prev.v * prev.t).toFixed(2)) }));
    } else if (mode === 'v') {
      setInputs(prev => ({ ...prev, v: prev.t !== 0 ? Number((prev.s / prev.t).toFixed(2)) : 0 }));
    } else if (mode === 't') {
      setInputs(prev => ({ ...prev, t: prev.v !== 0 ? Number((prev.s / prev.v).toFixed(2)) : 0 }));
    }
  }, [mode, inputs.s, inputs.v, inputs.t]);

  useEffect(() => {
    setUserPracticeInput('');
    setPracticeResult(null);
  }, [mode]);

  // Animation effect
  useEffect(() => {
    let interval: any;
    setAnimProgress(0);
    interval = setInterval(() => {
      setAnimProgress(prev => {
        if (prev >= 94) return 0;
        return prev + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [mode]);

  const generateRandom = () => {
    const s = Math.floor(Math.random() * 400) + 60;
    const v = Math.floor(Math.random() * 60) + 20;
    const t = Number((s / v).toFixed(2));
    setInputs({
      ...inputs,
      s, v, t
    });
    setUserPracticeInput('');
    setPracticeResult(null);
  };

  const getSolutionTitle = () => {
    switch(mode) {
      case 's': return 'Quãng đường chuyển động được là:';
      case 'v': return 'Vận tốc của chuyển động là:';
      case 't': return 'Thời gian đi hết quãng đường là:';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-50/90 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <Navigation size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Đại lượng cần tính
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 's', label: 'Tính Quãng đường (s)', icon: <Navigation size={17}/> },
              { id: 'v', label: 'Tính Vận tốc (v)', icon: <Car size={17}/> },
              { id: 't', label: 'Tính Thời gian (t)', icon: <Timer size={17}/> }
            ].map((m) => {
              const isCurrent = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as MotionMode)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-bold flex items-center justify-between ${
                    isCurrent 
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 translate-y-[-1px]' 
                      : 'bg-white hover:bg-orange-50/70 text-slate-700 border border-slate-200/90 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isCurrent ? 'text-white' : 'text-orange-600'}>
                      {m.icon}
                    </span>
                    <span className="text-sm">{m.label}</span>
                  </div>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhập dữ liệu */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Calculator size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Nhập số liệu
            </h3>
          </div>
          
          <div className="space-y-2.5">
            {mode !== 's' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <label className="text-xs font-bold text-slate-500 block mb-1">Quãng đường (s):</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={inputs.s} 
                    onChange={(e) => setInputs({...inputs, s: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-orange-600 outline-none" 
                  />
                  <select 
                    value={inputs.unitS} 
                    onChange={(e) => setInputs({...inputs, unitS: e.target.value})} 
                    className="text-xs font-bold text-slate-700 bg-slate-100 p-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option>km</option>
                    <option>m</option>
                  </select>
                </div>
              </div>
            )}
            
            {mode !== 'v' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <label className="text-xs font-bold text-slate-500 block mb-1">Vận tốc (v):</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={inputs.v} 
                    onChange={(e) => setInputs({...inputs, v: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-blue-600 outline-none" 
                  />
                  <select 
                    value={inputs.unitV} 
                    onChange={(e) => setInputs({...inputs, unitV: e.target.value})} 
                    className="text-xs font-bold text-slate-700 bg-slate-100 p-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option>km/giờ</option>
                    <option>m/phút</option>
                    <option>m/giây</option>
                  </select>
                </div>
              </div>
            )}

            {mode !== 't' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <label className="text-xs font-bold text-slate-500 block mb-1">Thời gian (t):</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="0.1"
                    step="0.5"
                    value={inputs.t} 
                    onChange={(e) => setInputs({...inputs, t: Math.max(0.1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-emerald-600 outline-none" 
                  />
                  <select 
                    value={inputs.unitT} 
                    onChange={(e) => setInputs({...inputs, unitT: e.target.value})} 
                    className="text-xs font-bold text-slate-700 bg-slate-100 p-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option>giờ</option>
                    <option>phút</option>
                    <option>giây</option>
                  </select>
                </div>
              </div>
            )}
            
            <button 
              onClick={generateRandom}
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-all active:scale-[0.98]"
            >
              <RotateCcw size={16} className="text-orange-600" /> Đổi số liệu ngẫu nhiên
            </button>
            {!isInitialData() && (
              <button 
                onClick={resetToInitialData}
                className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-[0.98]"
              >
                <RotateCcw size={14} className="text-emerald-600" /> Khôi phục số liệu gốc (Bài mẫu)
              </button>
            )}
          </div>
        </div>

        <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-amber-900">
          <h4 className="text-xs font-extrabold uppercase mb-1.5 flex items-center gap-1.5 text-amber-800">
            <HelpCircle size={14}/> Quy tắc tương thích đơn vị:
          </h4>
          <ul className="text-xs space-y-1 font-semibold text-slate-700">
            <li>• <strong className="text-orange-700">km</strong> đi cùng <strong className="text-emerald-700">giờ</strong> (vận tốc là <strong className="text-blue-700">km/giờ</strong>)</li>
            <li>• <strong className="text-orange-700">m</strong> đi cùng <strong className="text-emerald-700">phút</strong> hoặc <strong className="text-emerald-700">giây</strong></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-white overflow-hidden">
        
        {/* ĐƯỜNG ĐUA CHUYỂN ĐỘNG TRÊN NỀN Ô LY TOÁN */}
        <div className="w-full aspect-[16/7] md:min-h-[260px] math-grid-bg rounded-3xl border-2 border-orange-200 shadow-md board-shadow relative flex items-center justify-center overflow-hidden select-none mb-6">
          <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-300" />
            MÔ PHỎNG ĐƯỜNG CHUYỂN ĐỘNG
          </div>

          <div className="w-full px-8 md:px-16 relative">
            {/* Vạch đường chạy */}
            <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden border border-slate-300 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-75"
                style={{ width: `${animProgress}%` }}
              ></div>
            </div>

            {/* Cột mốc A và B */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm mb-1"></div>
                <span className="text-xs font-black text-slate-700 uppercase">Điểm A</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">t = 0</span>
              </div>
              <div className="text-center bg-white/90 backdrop-blur px-3 py-1 rounded-xl border border-orange-200 shadow-xs">
                <span className="text-xs font-black text-orange-700 font-mono">Quãng đường s = {inputs.s} {inputs.unitS}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-sm mb-1"></div>
                <span className="text-xs font-black text-slate-700 uppercase">Điểm B</span>
                <span className="text-[10px] font-bold text-emerald-600 font-mono">t = {inputs.t} {inputs.unitT}</span>
              </div>
            </div>

            {/* Xe / Người chuyển động */}
            <div 
              className="absolute -top-12 transition-all duration-75 ease-linear flex flex-col items-center"
              style={{ left: `calc(${animProgress}% + 2rem)`, transform: 'translateX(-50%)' }}
            >
              <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 text-[11px] font-mono font-black text-blue-700 whitespace-nowrap mb-1">
                v = {inputs.v} {inputs.unitV}
              </div>
              {inputs.v < 20 ? (
                <Bike className="text-orange-500 filter drop-shadow-sm" size={36} />
              ) : (
                <Car className="text-blue-600 filter drop-shadow-sm" size={40} />
              )}
            </div>
          </div>

          {/* Mascot Companion */}
          <div className="absolute bottom-2 right-3 z-10">
            <MascotCompanion 
              message="s = v × t | v = s : t | t = s : v"
              subMessage="Nhớ cùng đơn vị đo trước khi thực hiện phép tính!"
            />
          </div>
        </div>

        {/* 2 Cột: Bảng công thức và Bài giải chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Bảng công thức ghi nhớ */}
          <div className="bg-sky-50/70 p-4 md:p-5 rounded-2xl border border-sky-200/80 shadow-xs">
            <h4 className="text-sky-900 font-extrabold text-sm mb-3 flex items-center gap-2">
              <BookOpen size={17} className="text-sky-600" /> Bảng công thức ghi nhớ
            </h4>
            
            <div className="space-y-2">
              <div className={`p-3 rounded-xl border transition-all ${mode === 's' ? 'bg-orange-600 text-white border-orange-500 shadow-md' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase opacity-90">Tìm Quãng đường:</span>
                  <span className="text-lg font-black font-serif italic">s = v × t</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${mode === 'v' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase opacity-90">Tìm Vận tốc:</span>
                  <span className="text-lg font-black font-serif italic">v = s : t</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${mode === 't' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase opacity-90">Tìm Thời gian:</span>
                  <span className="text-lg font-black font-serif italic">t = s : v</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 font-semibold text-center">
              s (Quãng đường) · v (Vận tốc) · t (Thời gian)
            </div>
          </div>

          {/* CỘT 2: BÀI GIẢI MẪU (SỐ LIỆU GỐC) HOẶC BẢNG GIẢI TƯƠNG TÁC (KHI ĐỔI SỐ LIỆU) */}
          {isInitialData() ? (
            <div className="bg-emerald-50/70 p-4 md:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-emerald-900 font-extrabold text-sm flex items-center gap-2">
                    <ArrowRight size={17} className="text-emerald-600" />
                    Bài giải mẫu chi tiết
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Số liệu mẫu gốc
                  </span>
                </div>
                
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs mb-3">
                  <p className="text-xs font-bold text-slate-700 italic mb-2">
                    {getSolutionTitle()}
                  </p>
                  <div className="font-mono font-bold text-base text-emerald-800">
                    {mode === 's' ? `${inputs.v} × ${inputs.t} = ${inputs.s}` : `${inputs.s} : ${mode === 'v' ? inputs.t : inputs.v} = ${mode === 'v' ? inputs.v : inputs.t}`} ({mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT})
                  </div>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Em có biết:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi số liệu ngẫu nhiên"</em> ở cột bên trái, bảng này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em tự thực hành và kiểm tra kết quả!
                  </span>
                </div>
              </div>

              <div className="text-right pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số:</span>
                <span className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
                  {mode === 's' ? inputs.s : mode === 'v' ? inputs.v : inputs.t} {mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT}
                </span>
              </div>
            </div>
          ) : (
            /* BẢNG GIẢI TƯƠNG TÁC CHO HỌC SINH */
            <div className="bg-amber-50/60 p-4 md:p-5 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-amber-950 font-extrabold text-sm flex items-center gap-2">
                    <Edit3 size={17} className="text-amber-600" /> 
                    Bảng giải tương tác cho học sinh
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    Em tự thực hành
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs mb-3 text-xs leading-relaxed text-slate-800">
                  <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Đề bài luyện tập:
                  </p>
                  {mode === 's' && (
                    <p>Một chuyển động đều với vận tốc <strong>v = {inputs.v} {inputs.unitV}</strong> trong thời gian <strong>t = {inputs.t} {inputs.unitT}</strong>. Em hãy tính quãng đường <strong>s</strong> đi được:</p>
                  )}
                  {mode === 'v' && (
                    <p>Một vật chuyển động đi quãng đường <strong>s = {inputs.s} {inputs.unitS}</strong> hết thời gian <strong>t = {inputs.t} {inputs.unitT}</strong>. Em hãy tính vận tốc <strong>v</strong>:</p>
                  )}
                  {mode === 't' && (
                    <p>Một vật chuyển động đi quãng đường <strong>s = {inputs.s} {inputs.unitS}</strong> với vận tốc <strong>v = {inputs.v} {inputs.unitV}</strong>. Em hãy tính thời gian <strong>t</strong> đi hết quãng đường:</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Gợi ý: {mode === 's' ? 's = v × t' : mode === 'v' ? 'v = s : t' : 't = s : v'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 mb-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {mode === 's' ? 'Nhập quãng đường s của em:' : mode === 'v' ? 'Nhập vận tốc v của em:' : 'Nhập thời gian t của em:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập kết quả tính được..."
                      value={userPracticeInput}
                      onChange={(e) => { setUserPracticeInput(e.target.value); setPracticeResult(null); }}
                      disabled={practiceResult?.isCorrect}
                      className="w-full text-base font-black text-orange-900 bg-amber-50/40 p-2.5 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-sm font-black text-slate-600 shrink-0 px-2.5 py-2 bg-slate-100 rounded-lg">
                      {mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT}
                    </span>
                  </div>
                </div>

                {practiceResult?.isChecked && (
                  <div className={`p-3 rounded-xl mb-3 border text-xs ${
                    practiceResult.isCorrect 
                      ? 'bg-emerald-500 text-white border-emerald-600 animate-in zoom-in-95' 
                      : 'bg-rose-50 text-rose-900 border-rose-300 animate-in shake'
                  }`}>
                    {practiceResult.isCorrect ? (
                      <div className="space-y-1.5">
                        <p className="font-black text-sm flex items-center gap-1.5">
                          <CheckCircle2 size={18} className="text-white" />
                          Hoan hô! Em đã tìm ra đáp số hoàn toàn chính xác! 🎉
                        </p>
                        <div className="bg-white/20 p-2 rounded-lg font-mono text-white text-[11px]">
                          ✓ {getSolutionTitle()} {mode === 's' ? `${inputs.v} × ${inputs.t} = ${inputs.s} ${inputs.unitS}` : `${inputs.s} : ${mode === 'v' ? inputs.t : inputs.v} = ${mode === 'v' ? inputs.v : inputs.t} ${mode === 'v' ? inputs.unitV : inputs.unitT}`}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                          <XCircle size={18} className="text-rose-600" />
                          Kết quả chưa chính xác rồi! Em hãy tính nháp lại nhé.
                        </p>
                        <p className="text-rose-800">
                          Gợi ý: Hãy xem lại công thức {mode === 's' ? 's = v × t' : mode === 'v' ? 'v = s : t' : 't = s : v'} và kiểm tra lại phép tính chia hoặc nhân nhé!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-200/80">
                {!practiceResult?.isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userPracticeInput}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Check size={18} />
                    Kiểm tra kết quả
                  </button>
                ) : practiceResult.isCorrect ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={generateRandom}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} /> Thử số khác
                    </button>
                    <button
                      onClick={resetToInitialData}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Về bài giải mẫu
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
                      onClick={resetToInitialData}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <Calculator size={14} /> Xem bài mẫu
                    </button>
                  </div>
                )}

                <button
                  onClick={resetToInitialData}
                  className="w-full text-center text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline pt-1 block"
                >
                  ← Khôi phục số liệu gốc (Hiển thị lại bài giải chi tiết mẫu)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MotionPanel;
