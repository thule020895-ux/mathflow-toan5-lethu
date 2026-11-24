import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Calculator,
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
  Edit3,
  Eye,
  EyeOff,
  Play,
  Pause,
  Clock,
  MapPin
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type MotionMode = 's' | 'v' | 't';

interface MotionInputs {
  s: number;
  v: number;
  t: number;
  unitS: string;
  unitV: string;
  unitT: string;
}

const INITIAL_INPUTS: MotionInputs = {
  s: 120,
  v: 40,
  t: 3,
  unitS: 'km',
  unitV: 'km/giờ',
  unitT: 'giờ'
};

const fmtNum = (n: number): string => {
  if (!Number.isFinite(n)) return '0';
  const rounded = Math.round(n * 100) / 100;
  return rounded.toString().replace('.', ',');
};

const getExpectedUnitsFromVelocity = (unitV: string) => {
  if (unitV === 'km/giờ') return { dist: 'km', time: 'giờ' };
  if (unitV === 'm/phút') return { dist: 'm', time: 'phút' };
  return { dist: 'm', time: 'giây' };
};

const MotionPanel: React.FC = () => {
  const [mode, setMode] = useState<MotionMode>('s');
  const [inputs, setInputs] = useState<MotionInputs>(INITIAL_INPUTS);

  // Trạng thái mô phỏng
  const [animProgress, setAnimProgress] = useState(0); // 0..100
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSimAnswer, setShowSimAnswer] = useState(false);

  // Trạng thái ẩn/hiện bài giải mẫu chi tiết
  const [showSampleSolution, setShowSampleSolution] = useState(false);

  // State bảng thực hành tương tác
  const [userPracticeInput, setUserPracticeInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const isInitialData = () => {
    return (
      inputs.v === INITIAL_INPUTS.v &&
      inputs.t === INITIAL_INPUTS.t &&
      inputs.s === INITIAL_INPUTS.s &&
      inputs.unitS === INITIAL_INPUTS.unitS &&
      inputs.unitV === INITIAL_INPUTS.unitV &&
      inputs.unitT === INITIAL_INPUTS.unitT
    );
  };

  // Kiểm tra tương thích đơn vị
  const expectedFromV = getExpectedUnitsFromVelocity(inputs.unitV);
  const isUnitMismatch = (() => {
    if (mode === 's') {
      return inputs.unitT !== expectedFromV.time;
    }
    if (mode === 't') {
      return inputs.unitS !== expectedFromV.dist;
    }
    // mode === 'v'
    const validKmH = inputs.unitS === 'km' && inputs.unitT === 'giờ';
    const validMMin = inputs.unitS === 'm' && inputs.unitT === 'phút';
    const validMSec = inputs.unitS === 'm' && inputs.unitT === 'giây';
    return !(validKmH || validMMin || validMSec);
  })();

  const getMascotSpeech = () => {
    if (isUnitMismatch) {
      if (mode === 's') {
        return {
          message: `Chú ý! Đơn vị thời gian (${inputs.unitT}) chưa khớp với vận tốc (${inputs.unitV})!`,
          subMessage: `Em cần đổi "${inputs.unitT}" sang "${expectedFromV.time}" trước khi tính quãng đường nhé.`
        };
      }
      if (mode === 't') {
        return {
          message: `Chú ý! Đơn vị quãng đường (${inputs.unitS}) chưa khớp với vận tốc (${inputs.unitV})!`,
          subMessage: `Em cần đổi "${inputs.unitS}" sang "${expectedFromV.dist}" trước khi tính thời gian nhé.`
        };
      }
      return {
        message: `Chú ý! Quãng đường (${inputs.unitS}) và thời gian (${inputs.unitT}) chưa cùng hệ đơn vị!`,
        subMessage: `Hãy chọn km đi với giờ, hoặc m đi với phút/giây trước khi tính vận tốc nhé.`
      };
    }

    const reachedB = animProgress >= 99.9;
    if (reachedB) {
      return {
        message: 'Xe đã chạm đích Điểm B! Đáp án đã hiển thị trên bảng.',
        subMessage: 'Bấm "Đặt lại" hoặc kéo thanh trượt để quan sát lại từng bước nhé!'
      };
    }

    return {
      message: 's = v × t  |  v = s : t  |  t = s : v',
      subMessage: 'Bấm "Chạy mô phỏng" để xem xe di chuyển qua từng mốc thời gian!'
    };
  };

  // Đồng bộ reset xe về A & ẩn đáp án khi đổi số liệu
  const resetSimulationState = () => {
    setIsPlaying(false);
    setAnimProgress(0);
    setShowSimAnswer(false);
    setShowSampleSolution(false);
    setUserPracticeInput('');
    setPracticeResult(null);
  };

  const resetToInitialData = () => {
    setInputs(INITIAL_INPUTS);
    resetSimulationState();
  };

  const handleModeChange = (newMode: MotionMode) => {
    setMode(newMode);
    setInputs(prev => {
      const next = { ...prev };
      if (newMode === 's') {
        const exp = getExpectedUnitsFromVelocity(prev.unitV);
        next.unitS = exp.dist;
        next.s = Number((prev.v * prev.t).toFixed(2));
      } else if (newMode === 'v') {
        if (prev.unitS === 'km' && prev.unitT === 'giờ') next.unitV = 'km/giờ';
        else if (prev.unitS === 'm' && prev.unitT === 'phút') next.unitV = 'm/phút';
        else if (prev.unitS === 'm' && prev.unitT === 'giây') next.unitV = 'm/giây';
        next.v = prev.t !== 0 ? Number((prev.s / prev.t).toFixed(2)) : 0;
      } else if (newMode === 't') {
        const exp = getExpectedUnitsFromVelocity(prev.unitV);
        next.unitT = exp.time;
        next.t = prev.v !== 0 ? Number((prev.s / prev.v).toFixed(2)) : 0;
      }
      return next;
    });
    resetSimulationState();
  };

  const handleUpdateInput = (field: keyof MotionInputs, rawVal: number | string) => {
    setInputs(prev => {
      const next = { ...prev, [field]: rawVal };
      if (field === 'unitV') {
        const exp = getExpectedUnitsFromVelocity(String(rawVal));
        if (mode === 's') next.unitS = exp.dist;
        if (mode === 't') next.unitT = exp.time;
      }
      if (mode === 'v' && (field === 'unitS' || field === 'unitT')) {
        if (next.unitS === 'km' && next.unitT === 'giờ') next.unitV = 'km/giờ';
        else if (next.unitS === 'm' && next.unitT === 'phút') next.unitV = 'm/phút';
        else if (next.unitS === 'm' && next.unitT === 'giây') next.unitV = 'm/giây';
      }

      // Tính lại đại lượng phụ thuộc
      if (mode === 's') {
        next.s = Number((next.v * next.t).toFixed(2));
      } else if (mode === 'v') {
        next.v = next.t !== 0 ? Number((next.s / next.t).toFixed(2)) : 0;
      } else if (mode === 't') {
        next.t = next.v !== 0 ? Number((next.s / next.v).toFixed(2)) : 0;
      }
      return next;
    });
    resetSimulationState();
  };

  const generateRandom = () => {
    const velocities = [24, 30, 32, 36, 40, 42, 45, 48, 50, 54, 60, 64, 72, 75, 80];
    const times = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const v = velocities[Math.floor(Math.random() * velocities.length)];
    const t = times[Math.floor(Math.random() * times.length)];
    const s = Number((v * t).toFixed(2));
    setInputs(prev => ({
      ...prev,
      s,
      v,
      t,
      unitS: 'km',
      unitV: 'km/giờ',
      unitT: 'giờ'
    }));
    resetSimulationState();
  };

  // Vòng lặp animation mượt mà bằng requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      // Toàn quãng đường mất khoảng 4.5 giây (22.2% / giây)
      const increment = (deltaMs / 1000) * 22.2;

      setAnimProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (animProgress >= 99.9) {
      setAnimProgress(0);
      setShowSimAnswer(false);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResetSim = () => {
    setIsPlaying(false);
    setAnimProgress(0);
    setShowSimAnswer(false);
  };

  const handleScrub = (val: number) => {
    setIsPlaying(false);
    setAnimProgress(val);
    if (val < 99.9 && showSimAnswer) {
      // Giữ trạng thái hiện tại nếu học sinh chủ động bật "Hiện đáp án",
      // còn nếu chưa bật thì vẫn theo trạng thái chạm đích
    }
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
    setShowSimAnswer(false);
  };

  const hasReachedB = animProgress >= 99.9;
  const isAnswerVisible = showSimAnswer || hasReachedB || Boolean(practiceResult?.isCorrect);

  // Tính thời gian trôi qua & quãng đường đã đi theo tiến trình
  const progressRatio = animProgress / 100;
  const elapsedTime = Number((inputs.t * progressRatio).toFixed(2));
  const traveledDist = Number((inputs.s * progressRatio).toFixed(2));

  // Tính các vạch chia mốc thời gian trên đường đi
  const timeTicks = (() => {
    if (mode === 't' && !isAnswerVisible) {
      return [];
    }
    const totalT = Math.max(0.1, inputs.t);
    const ticks: { pos: number; label: string; isWhole: boolean }[] = [];
    if (totalT <= 10) {
      const count = Math.floor(totalT);
      for (let i = 1; i <= count; i++) {
        // Không vẽ đè sát mốc 100% (Điểm B)
        const pos = (i / totalT) * 100;
        if (pos < 98.5) {
          ticks.push({
            pos,
            label: `${i} ${inputs.unitT}`,
            isWhole: true
          });
        }
      }
    } else {
      const step = Math.ceil(totalT / 8);
      for (let i = step; i < totalT; i += step) {
        const pos = (i / totalT) * 100;
        if (pos < 96) {
          ticks.push({
            pos,
            label: `${i} ${inputs.unitT}`,
            isWhole: true
          });
        }
      }
    }
    return ticks;
  })();

  const getSolutionTitle = () => {
    switch (mode) {
      case 's': return 'Quãng đường chuyển động được là:';
      case 'v': return 'Vận tốc của chuyển động là:';
      case 't': return 'Thời gian đi hết quãng đường là:';
    }
  };

  const mascotSpeech = getMascotSpeech();

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[680px]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-76 bg-slate-50/90 p-4 md:p-5 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-4 overflow-y-auto custom-scrollbar shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <Navigation size={16} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
              Đại lượng cần tính
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 's', label: 'Tính Quãng đường (s)', icon: <Navigation size={16} /> },
              { id: 'v', label: 'Tính Vận tốc (v)', icon: <Car size={16} /> },
              { id: 't', label: 'Tính Thời gian (t)', icon: <Timer size={16} /> }
            ].map((m) => {
              const isCurrent = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id as MotionMode)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 font-bold flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'bg-white hover:bg-orange-50/70 text-slate-700 border border-slate-200/90 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isCurrent ? 'text-white' : 'text-orange-600'}>
                      {m.icon}
                    </span>
                    <span className="text-xs md:text-sm">{m.label}</span>
                  </div>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhập dữ liệu */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Calculator size={16} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
              Nhập số liệu
            </h3>
          </div>

          <div className="space-y-2">
            {mode !== 's' && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Quãng đường (s):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={inputs.s}
                    onChange={(e) => handleUpdateInput('s', Math.max(1, Number(e.target.value)))}
                    className="w-full text-base font-black text-orange-600 outline-none font-mono"
                  />
                  <select
                    value={inputs.unitS}
                    onChange={(e) => handleUpdateInput('unitS', e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-slate-100 p-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option>km</option>
                    <option>m</option>
                  </select>
                </div>
              </div>
            )}

            {mode !== 'v' && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Vận tốc (v):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={inputs.v}
                    onChange={(e) => handleUpdateInput('v', Math.max(1, Number(e.target.value)))}
                    className="w-full text-base font-black text-blue-600 outline-none font-mono"
                  />
                  <select
                    value={inputs.unitV}
                    onChange={(e) => handleUpdateInput('unitV', e.target.value)}
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
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Thời gian (t):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={inputs.t}
                    onChange={(e) => handleUpdateInput('t', Math.max(0.5, Number(e.target.value)))}
                    className="w-full text-base font-black text-emerald-600 outline-none font-mono"
                  />
                  <select
                    value={inputs.unitT}
                    onChange={(e) => handleUpdateInput('unitT', e.target.value)}
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
              className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs md:text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw size={15} className="text-orange-600" /> Đổi số liệu ngẫu nhiên
            </button>
            {!isInitialData() && (
              <button
                onClick={resetToInitialData}
                className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw size={13} className="text-emerald-600" /> Khôi phục số liệu gốc
              </button>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl border transition-colors ${
          isUnitMismatch
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <h4 className={`text-[11px] font-extrabold uppercase mb-1 flex items-center gap-1.5 ${
            isUnitMismatch ? 'text-rose-700' : 'text-amber-800'
          }`}>
            <HelpCircle size={13} /> Quy tắc tương thích đơn vị:
          </h4>
          <ul className="text-[11px] space-y-0.5 font-semibold text-slate-700">
            <li>• <strong className="text-orange-700">km</strong> đi cùng <strong className="text-emerald-700">giờ</strong> (vận tốc <strong className="text-blue-700">km/giờ</strong>)</li>
            <li>• <strong className="text-orange-700">m</strong> đi cùng <strong className="text-emerald-700">phút</strong> hoặc <strong className="text-emerald-700">giây</strong></li>
          </ul>
        </div>
      </div>

      {/* Main Content — Tối ưu chiều cao gọn gàng để hiển thị trọn vẹn trên 1 màn hình */}
      <div className="flex-1 p-3.5 md:p-5 flex flex-col bg-white overflow-hidden justify-between gap-3.5">
        
        {/* KHUNG MÔ PHỎNG ĐƯỜNG CHUYỂN ĐỘNG TRÊN NỀN Ô LY TOÁN */}
        <div className="w-full math-grid-bg rounded-2xl border-2 border-orange-200 shadow-sm board-shadow p-3 md:p-4 select-none flex flex-col gap-3">
          {/* Header khung mô phỏng */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="bg-orange-600 text-white px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-300" />
              MÔ PHỎNG ĐƯỜNG CHUYỂN ĐỘNG
            </div>

            <div className="flex items-center gap-2">
              {isUnitMismatch && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-extrabold animate-pulse">
                  ⚠ Lệch đơn vị đo
                </span>
              )}
              <button
                onClick={() => setShowSimAnswer(prev => !prev)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                  isAnswerVisible
                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                    : 'bg-white text-orange-800 border-orange-300 hover:bg-amber-50'
                }`}
              >
                {isAnswerVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                {isAnswerVisible ? 'Ẩn đáp án' : 'Hiện đáp án'}
              </button>
            </div>
          </div>

          {/* Khu vực đường chạy + Xe + Vạch chia thời gian */}
          <div className="pt-14 pb-1 px-6 md:px-10 relative">
            <div className="relative w-full">
              {/* Xe chuyển động + Nhãn động thời gian & quãng đường */}
              <div
                className="absolute -top-13 flex flex-col items-center z-20 pointer-events-none"
                style={{ left: `${animProgress}%`, transform: 'translateX(-50%)' }}
              >
                {/* Nhãn động khi xe chạy hoặc đang tua */}
                {animProgress > 0 && (
                  <div
                    className="mb-0.5 px-2 py-0.5 rounded-lg bg-slate-900/90 text-white text-[10px] font-mono font-bold whitespace-nowrap shadow-md flex items-center gap-1.5 border border-slate-700"
                    style={{
                      transform:
                        animProgress < 12
                          ? 'translateX(22%)'
                          : animProgress > 88
                          ? 'translateX(-22%)'
                          : 'none'
                    }}
                  >
                    <span className="text-amber-300 flex items-center gap-0.5">
                      <Clock size={10} /> {fmtNum(elapsedTime)} {inputs.unitT}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-300 flex items-center gap-0.5">
                      <MapPin size={10} /> {fmtNum(traveledDist)} {inputs.unitS}
                    </span>
                  </div>
                )}

                {/* Nhãn vận tốc trên xe */}
                <div
                  className={`px-2 py-0.5 rounded-md shadow-xs text-[10px] font-mono font-black whitespace-nowrap border ${
                    mode === 'v' && !isAnswerVisible
                      ? 'bg-amber-50 border-amber-400 border-dashed text-amber-800'
                      : 'bg-white border-blue-200 text-blue-700'
                  }`}
                >
                  v = {mode === 'v' && !isAnswerVisible ? '?' : fmtNum(inputs.v)} {inputs.unitV}
                </div>

                {inputs.v < 20 ? (
                  <Bike className="text-orange-500 drop-shadow-sm -mt-0.5" size={28} />
                ) : (
                  <Car className="text-blue-600 drop-shadow-sm -mt-0.5" size={30} />
                )}
              </div>

              {/* Thanh đường chạy */}
              <div className="w-full h-3.5 bg-slate-200/95 rounded-full relative overflow-visible border border-slate-300 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-500 rounded-full"
                  style={{ width: `${animProgress}%` }}
                />

                {/* Vạch chia mốc theo từng đơn vị thời gian */}
                {timeTicks.map((tick, idx) => {
                  const passed = animProgress >= tick.pos;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 flex flex-col items-center z-10"
                      style={{ left: `${tick.pos}%`, transform: 'translateX(-50%)' }}
                    >
                      <div
                        className={`w-0.5 h-5 -mt-0.5 rounded-full transition-colors ${
                          passed ? 'bg-orange-700' : 'bg-slate-500/80'
                        }`}
                      />
                      <span
                        className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold whitespace-nowrap border ${
                          passed
                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                            : 'bg-white/90 text-slate-600 border-slate-300'
                        }`}
                      >
                        {tick.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mốc Điểm A, Quãng đường s (giữa), Điểm B */}
              <div className="flex justify-between items-start mt-5">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white shadow-xs inline-block" />
                    <span className="text-[11px] font-black text-slate-800 uppercase">Điểm A</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono pl-4">0 {inputs.unitT}</span>
                </div>

                <div
                  className={`text-center px-3 py-1 rounded-xl shadow-xs border ${
                    mode === 's' && !isAnswerVisible
                      ? 'bg-amber-50 border-amber-400 border-dashed'
                      : 'bg-white/95 border-orange-200'
                  }`}
                >
                  <span
                    className={`text-xs font-black font-mono ${
                      mode === 's' && !isAnswerVisible ? 'text-amber-800' : 'text-orange-700'
                    }`}
                  >
                    Quãng đường s = {mode === 's' && !isAnswerVisible ? '?' : fmtNum(inputs.s)} {inputs.unitS}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-slate-800 uppercase">Điểm B</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white shadow-xs inline-block" />
                  </div>
                  <span
                    className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded mt-0.5 ${
                      mode === 't' && !isAnswerVisible
                        ? 'bg-amber-100 text-amber-800 border border-dashed border-amber-400'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    t = {mode === 't' && !isAnswerVisible ? '?' : fmtNum(inputs.t)} {inputs.unitT}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thanh điều khiển mô phỏng & Trợ lý góc dưới (không che đường chạy) */}
          <div className="pt-2 border-t border-orange-200/70 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
            {/* Cụm nút điều khiển + Thanh trượt tua */}
            <div className="flex-1 bg-white/90 rounded-xl border border-orange-200/90 p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-emerald-100 text-emerald-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                  }`}
                >
                  <Play size={13} fill="currentColor" />
                  Chạy mô phỏng
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                    !isPlaying
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                  }`}
                >
                  <Pause size={13} fill="currentColor" />
                  Tạm dừng
                </button>
                <button
                  onClick={handleResetSim}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Đặt lại
                </button>
              </div>

              {/* Thanh trượt tua tiến trình theo thời gian */}
              <div className="flex-1 flex items-center gap-2 min-w-[140px]">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={animProgress}
                  onChange={(e) => handleScrub(Number(e.target.value))}
                  aria-label="Thanh trượt tua tiến trình theo thời gian"
                  className="w-full accent-orange-600 cursor-pointer h-2 rounded-lg"
                />
                <span className="text-[11px] font-mono font-black text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 shrink-0 min-w-[44px] text-center">
                  {Math.round(animProgress)}%
                </span>
              </div>
            </div>

            {/* Nhân vật trợ lý nhắc đơn vị / cổ vũ */}
            <div className="flex justify-end shrink-0">
              <MascotCompanion
                compact
                isWarning={isUnitMismatch}
                isHappy={!isUnitMismatch && (hasReachedB || Boolean(practiceResult?.isCorrect))}
                message={mascotSpeech.message}
                subMessage={mascotSpeech.subMessage}
              />
            </div>
          </div>
        </div>

        {/* 2 CỘT BÊN DƯỚI: BẢNG CÔNG THỨC & BÀI GIẢI MẪU / THỰC HÀNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Bảng công thức ghi nhớ */}
          <div className="bg-sky-50/70 p-3.5 md:p-4 rounded-2xl border border-sky-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sky-900 font-extrabold text-sm mb-2.5 flex items-center gap-2">
                <BookOpen size={16} className="text-sky-600" /> Bảng công thức ghi nhớ
              </h4>

              <div className="space-y-1.5">
                <div className={`px-3 py-2 rounded-xl border transition-all ${mode === 's' ? 'bg-orange-600 text-white border-orange-500 shadow-sm' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase opacity-90">Tìm Quãng đường:</span>
                    <span className="text-base font-black font-serif italic">s = v × t</span>
                  </div>
                </div>

                <div className={`px-3 py-2 rounded-xl border transition-all ${mode === 'v' ? 'bg-blue-600 text-white border-blue-500 shadow-sm' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase opacity-90">Tìm Vận tốc:</span>
                    <span className="text-base font-black font-serif italic">v = s : t</span>
                  </div>
                </div>

                <div className={`px-3 py-2 rounded-xl border transition-all ${mode === 't' ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-white text-slate-700 border-slate-200/80'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase opacity-90">Tìm Thời gian:</span>
                    <span className="text-base font-black font-serif italic">t = s : v</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 text-[11px] text-slate-500 font-semibold text-center">
              s (Quãng đường) · v (Vận tốc) · t (Thời gian)
            </div>
          </div>

          {/* CỘT 2: BÀI GIẢI MẪU (MẶC ĐỊNH ẨN NỘI DUNG) HOẶC BẢNG GIẢI TƯƠNG TÁC */}
          {isInitialData() ? (
            <div className="bg-emerald-50/70 p-3.5 md:p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-emerald-900 font-extrabold text-sm flex items-center gap-1.5">
                    <ArrowRight size={16} className="text-emerald-600" />
                    Bài giải mẫu chi tiết
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Số liệu mẫu gốc
                  </span>
                </div>

                {/* Đề bài mẫu luôn hiển thị để học sinh tự giải */}
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs mb-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="font-extrabold text-emerald-800">Đề bài: </span>
                  {mode === 's' && (
                    <>Một xe đi với vận tốc <strong>v = {fmtNum(inputs.v)} {inputs.unitV}</strong> trong <strong>t = {fmtNum(inputs.t)} {inputs.unitT}</strong>. Tính quãng đường <strong>s</strong>?</>
                  )}
                  {mode === 'v' && (
                    <>Một xe đi quãng đường <strong>s = {fmtNum(inputs.s)} {inputs.unitS}</strong> hết <strong>t = {fmtNum(inputs.t)} {inputs.unitT}</strong>. Tính vận tốc <strong>v</strong>?</>
                  )}
                  {mode === 't' && (
                    <>Một xe đi quãng đường <strong>s = {fmtNum(inputs.s)} {inputs.unitS}</strong> với vận tốc <strong>v = {fmtNum(inputs.v)} {inputs.unitV}</strong>. Tính thời gian <strong>t</strong>?</>
                  )}
                </div>

                {showSampleSolution ? (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                      <p className="text-xs font-bold text-slate-700 italic mb-1">
                        {getSolutionTitle()}
                      </p>
                      <div className="font-mono font-bold text-sm md:text-base text-emerald-800">
                        {mode === 's'
                          ? `${fmtNum(inputs.v)} × ${fmtNum(inputs.t)} = ${fmtNum(inputs.s)}`
                          : `${fmtNum(inputs.s)} : ${mode === 'v' ? fmtNum(inputs.t) : fmtNum(inputs.v)} = ${mode === 'v' ? fmtNum(inputs.v) : fmtNum(inputs.t)}`}{' '}
                        ({mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT})
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-100/80 px-3 py-2 rounded-xl border border-emerald-200">
                      <span className="text-xs font-black text-emerald-900 uppercase">Đáp số:</span>
                      <span className="text-lg font-black text-emerald-700 font-mono">
                        {mode === 's' ? fmtNum(inputs.s) : mode === 'v' ? fmtNum(inputs.v) : fmtNum(inputs.t)}{' '}
                        {mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/90 border border-dashed border-amber-300 rounded-xl p-3 text-center space-y-2">
                    <p className="text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5">
                      <Lightbulb size={15} className="text-amber-600 shrink-0" />
                      Em hãy tự tính ra nháp hoặc chạy mô phỏng trước khi xem lời giải nhé!
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2.5 flex flex-col gap-1.5">
                <button
                  onClick={() => setShowSampleSolution(prev => !prev)}
                  className={`w-full py-2 px-4 rounded-xl font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    showSampleSolution
                      ? 'bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {showSampleSolution ? <EyeOff size={15} /> : <Eye size={15} />}
                  {showSampleSolution ? 'Ẩn bài giải mẫu' : 'Xem bài giải mẫu'}
                </button>
              </div>
            </div>
          ) : (
            /* BẢNG GIẢI TƯƠNG TÁC CHO HỌC SINH */
            <div className="bg-amber-50/60 p-3.5 md:p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-amber-950 font-extrabold text-sm flex items-center gap-1.5">
                    <Edit3 size={16} className="text-amber-600" />
                    Bảng giải tương tác cho học sinh
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Em tự thực hành
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs mb-2.5 text-xs leading-relaxed text-slate-800">
                  {mode === 's' && (
                    <p>Một chuyển động đều với <strong>v = {fmtNum(inputs.v)} {inputs.unitV}</strong> trong <strong>t = {fmtNum(inputs.t)} {inputs.unitT}</strong>. Tính quãng đường <strong>s</strong>:</p>
                  )}
                  {mode === 'v' && (
                    <p>Một vật đi quãng đường <strong>s = {fmtNum(inputs.s)} {inputs.unitS}</strong> hết <strong>t = {fmtNum(inputs.t)} {inputs.unitT}</strong>. Tính vận tốc <strong>v</strong>:</p>
                  )}
                  {mode === 't' && (
                    <p>Một vật đi quãng đường <strong>s = {fmtNum(inputs.s)} {inputs.unitS}</strong> với <strong>v = {fmtNum(inputs.v)} {inputs.unitV}</strong>. Tính thời gian <strong>t</strong>:</p>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-amber-200 mb-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={mode === 's' ? 'Nhập quãng đường s...' : mode === 'v' ? 'Nhập vận tốc v...' : 'Nhập thời gian t...'}
                      value={userPracticeInput}
                      onChange={(e) => { setUserPracticeInput(e.target.value); setPracticeResult(null); }}
                      disabled={practiceResult?.isCorrect}
                      className="w-full text-sm font-black text-orange-900 bg-amber-50/40 p-2 rounded-lg border-2 border-amber-200 outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-xs font-black text-slate-600 shrink-0 px-2.5 py-2 bg-slate-100 rounded-lg">
                      {mode === 's' ? inputs.unitS : mode === 'v' ? inputs.unitV : inputs.unitT}
                    </span>
                  </div>
                </div>

                {practiceResult?.isChecked && (
                  <div className={`p-2.5 rounded-xl mb-2 border text-xs ${
                    practiceResult.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}>
                    {practiceResult.isCorrect ? (
                      <div className="space-y-1">
                        <p className="font-black flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-white" />
                          Hoan hô! Đáp số hoàn toàn chính xác! 🎉
                        </p>
                        <div className="bg-white/20 px-2 py-1 rounded-lg font-mono text-[11px]">
                          ✓ {getSolutionTitle()} {mode === 's' ? `${fmtNum(inputs.v)} × ${fmtNum(inputs.t)} = ${fmtNum(inputs.s)} ${inputs.unitS}` : `${fmtNum(inputs.s)} : ${mode === 'v' ? fmtNum(inputs.t) : fmtNum(inputs.v)} = ${mode === 'v' ? fmtNum(inputs.v) : fmtNum(inputs.t)} ${mode === 'v' ? inputs.unitV : inputs.unitT}`}
                        </div>
                      </div>
                    ) : (
                      <p className="font-extrabold flex items-center gap-1.5 text-rose-700">
                        <XCircle size={16} className="text-rose-600 shrink-0" />
                        Chưa chính xác! Em hãy xem lại công thức {mode === 's' ? 's = v × t' : mode === 'v' ? 'v = s : t' : 't = s : v'} nhé.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-amber-200/80">
                {!practiceResult?.isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userPracticeInput}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <Check size={16} />
                    Kiểm tra kết quả
                  </button>
                ) : practiceResult.isCorrect ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={generateRandom}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={13} /> Thử số khác
                    </button>
                    <button
                      onClick={resetToInitialData}
                      className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={13} /> Về bài mẫu
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRetry}
                      className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={13} /> Làm lại
                    </button>
                    <button
                      onClick={resetToInitialData}
                      className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calculator size={13} /> Xem bài mẫu
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotionPanel;
