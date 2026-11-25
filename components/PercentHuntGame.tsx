import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Dices,
  BookOpen,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PercentHuntIllustration from './PercentHuntIllustrations';
import {
  PercentHuntScenario,
  PRESET_PERCENT_HUNT_SCENARIOS,
  shuffleOptions,
  generateRandomPercentScenario
} from './percentHuntData';

interface PercentHuntGameProps {
  onBack?: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function createPresetSession(): PercentHuntScenario[] {
  return PRESET_PERCENT_HUNT_SCENARIOS.map((item) => ({
    ...item,
    options: shuffleOptions(item.options)
  }));
}

export const PercentHuntGame: React.FC<PercentHuntGameProps> = ({ onBack }) => {
  const [scenarios, setScenarios] = useState<PercentHuntScenario[]>(() => createPresetSession());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [randomScenario, setRandomScenario] = useState<PercentHuntScenario | null>(null);
  const [randomCount, setRandomCount] = useState(0);

  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [shakingOption, setShakingOption] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  const [score, setScore] = useState(0);
  const [firstTryHits, setFirstTryHits] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (!soundEnabled || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, [soundEnabled]);

  // Âm thanh vỗ tay vui nhộn + chuông chúc mừng (Web Audio API)
  const playApplauseSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Chuỗi nốt vui tươi (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.075);

      gain.gain.setValueAtTime(0.001, now + idx * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.075 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.075 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.075);
      osc.stop(now + idx * 0.075 + 0.38);
    });

    // 2. Tạo tiếng vỗ tay rộn ràng từ nhiều tiếng vỗ ngắn chồng lớp
    const bufferSize = Math.floor(ctx.sampleRate * 0.09);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const totalClaps = 22;
    for (let c = 0; c < totalClaps; c++) {
      const startOffset = 0.04 + (c / totalClaps) * 1.15 + Math.random() * 0.05;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950 + Math.random() * 1100, now + startOffset);
      filter.Q.setValueAtTime(1.6 + Math.random() * 1.2, now + startOffset);

      const clapGain = ctx.createGain();
      const peak = 0.14 + Math.random() * 0.12;
      clapGain.gain.setValueAtTime(peak, now + startOffset);
      clapGain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + 0.085);

      src.connect(filter);
      filter.connect(clapGain);
      clapGain.connect(ctx.destination);
      src.start(now + startOffset);
    }
  }, [getAudioContext]);

  // Âm thanh nhắc nhở nhẹ nhàng khi chọn sai (Web Audio API)
  const playGentleReminderSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const tones = [329.63, 261.63]; // E4 -> C4 êm dịu
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.13);

      gain.gain.setValueAtTime(0.001, now + i * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.13 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.13 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.13);
      osc.stop(now + i * 0.13 + 0.25);
    });
  }, [getAudioContext]);

  const activeScenario = isRandomMode ? randomScenario : scenarios[currentIdx];

  const resetQuestionUi = () => {
    setWrongOptions([]);
    setShakingOption(null);
    setIsSolved(false);
    setShowFormulaHint(false);
  };

  const handleSelectOption = (option: string) => {
    if (!activeScenario || isSolved || wrongOptions.includes(option)) return;

    if (option === activeScenario.correctAnswer) {
      setIsSolved(true);
      const earned = wrongOptions.length === 0 ? 25 : 15;
      setScore((prev) => prev + earned);
      if (wrongOptions.length === 0) {
        setFirstTryHits((prev) => prev + 1);
      }

      playApplauseSound();
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.72 },
        colors: ['#10b981', '#0d9488', '#f59e0b', '#fbbf24']
      });
    } else {
      playGentleReminderSound();
      setWrongOptions((prev) => [...prev, option]);
      setShakingOption(option);
      setTimeout(() => {
        setShakingOption((curr) => (curr === option ? null : curr));
      }, 450);
    }
  };

  const handleNextScenario = () => {
    if (isRandomMode) {
      handleGenerateRandomScenario();
      return;
    }

    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      resetQuestionUi();
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 95,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981', '#f59e0b', '#fb923c']
      });
    }
  };

  const handleRestartPreset = () => {
    setScenarios(createPresetSession());
    setCurrentIdx(0);
    setIsRandomMode(false);
    setRandomScenario(null);
    setRandomCount(0);
    setScore(0);
    setFirstTryHits(0);
    setIsFinished(false);
    resetQuestionUi();
  };

  const handleGenerateRandomScenario = () => {
    const next = generateRandomPercentScenario(randomScenario?.question);
    setRandomScenario(next);
    setIsRandomMode(true);
    setIsFinished(false);
    setRandomCount((prev) => prev + 1);
    resetQuestionUi();
  };

  // ==================== MÀN HÌNH TỔNG KẾT SAU 4 TÌNH HUỐNG ====================
  if (isFinished && !isRandomMode) {
    return (
      <div className="min-h-full math-grid-light p-4 sm:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-white rounded-3xl border-2 border-teal-200 shadow-lg p-6 sm:p-10 text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
            <Trophy size={42} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-wider text-teal-700">
              Hoàn thành 4 tình huống · Tìm giá trị phần trăm của một số
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              XUẤT SẮC LẮM CÁC EM ƠI!
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-semibold max-w-xl mx-auto">
              Cả lớp đã chinh phục trọn vẹn 4 mức độ từ cơ bản đến vận dụng 2 bước tính.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="text-xs font-extrabold uppercase text-amber-800 mb-1">
                Tổng điểm đạt được
              </div>
              <div className="text-4xl sm:text-5xl font-black text-orange-600 tabular-nums">
                {score}
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
              <div className="text-xs font-extrabold uppercase text-emerald-800 mb-1">
                Trúng ngay lần đầu
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600 tabular-nums">
                {firstTryHits}/4
              </div>
            </div>
          </div>

          {/* Chế độ giáo viên mở rộng */}
          <div className="bg-teal-50/70 border-2 border-teal-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-center gap-2 text-teal-900 font-black text-base sm:text-lg">
              <Sparkles size={20} className="text-amber-500" />
              <span>Chế độ Giáo viên mở rộng</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              Nếu còn thời gian luyện tập trên lớp, thầy/cô bấm nút bên dưới để tạo thêm các tình huống tương tự hoàn toàn mới!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleGenerateRandomScenario}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-white font-black text-base sm:text-lg px-7 py-4 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                <Dices size={22} />
                <span>🎲 Tạo tình huống ngẫu nhiên</span>
              </button>

              <button
                type="button"
                onClick={handleRestartPreset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 font-black text-base px-6 py-4 rounded-2xl transition-all cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>Chơi lại 4 tình huống</span>
              </button>
            </div>
          </div>

          {onBack && (
            <div>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 hover:text-teal-700 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Quay lại màn hình chọn trò chơi</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (!activeScenario) return null;

  const progressPercent = isRandomMode
    ? 100
    : Math.round(((currentIdx + (isSolved ? 1 : 0)) / scenarios.length) * 100);

  return (
    <div className="min-h-full math-grid-light flex flex-col">
      {/* Header đồng bộ xanh ngọc - vàng cam, chữ lớn rõ nét cho Tivi lớp học */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white px-4 py-3.5 sm:px-6 border-b-2 border-teal-800 shadow-sm shrink-0">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors cursor-pointer shrink-0"
                title="Quay lại chọn trò chơi"
                aria-label="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-sm shrink-0">
              <Target size={24} className="stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight uppercase leading-tight">
                Săn Tìm Đáp Án Đúng
              </h2>
              <p className="text-xs sm:text-sm font-bold text-teal-100">
                Bài học: Tìm giá trị phần trăm của một số · Toán 5, Tập 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span className="hidden sm:inline">{soundEnabled ? 'Âm thanh' : 'Đã tắt tiếng'}</span>
            </button>

            <div className="bg-white/15 border border-white/25 rounded-2xl px-4 py-1.5 text-right">
              <div className="text-[11px] font-bold text-teal-100 uppercase">Điểm số</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums leading-none">
                {score}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tiến độ 4 tình huống */}
      <div className="h-2 bg-teal-100 w-full shrink-0">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Thân trò chơi chính */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto flex flex-col gap-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* 1. KHUNG CÂU HỎI TÌNH HUỐNG + MINH HỌA SVG */}
            <div className="bg-white rounded-3xl border-2 border-teal-200/90 shadow-md p-5 sm:p-7 space-y-4">
              {/* Metadata gọn gàng không dùng pill thừa */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2 text-sm sm:text-base font-black text-teal-800">
                  <span>
                    {isRandomMode
                      ? `Tình huống mở rộng #${randomCount}`
                      : `Tình huống ${currentIdx + 1} / ${scenarios.length}`}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-orange-600">{activeScenario.levelTitle}</span>
                </div>

                {isRandomMode && (
                  <button
                    type="button"
                    onClick={handleRestartPreset}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Quay về 4 tình huống gốc</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xl sm:text-2xl lg:text-[27px] font-extrabold text-slate-900 leading-relaxed">
                    {activeScenario.question}
                  </h3>

                  {!isSolved && wrongOptions.length === 0 && (
                    <p className="text-sm sm:text-base font-bold text-teal-700 flex items-center gap-2">
                      <Target size={18} className="text-orange-500 shrink-0" />
                      <span>Hãy nhắm trúng thẻ đáp án đúng bên dưới nhé!</span>
                    </p>
                  )}
                </div>

                <div className="md:col-span-5">
                  <PercentHuntIllustration
                    visualType={activeScenario.visualType}
                    badgeText={activeScenario.visualBadge}
                    tagValue={activeScenario.visualTagValue}
                  />
                </div>
              </div>
            </div>

            {/* 2. KHU VỰC 4 MỤC TIÊU SĂN ĐÁP ÁN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeScenario.options.map((option, idx) => {
                const isCorrectOpt = option === activeScenario.correctAnswer;
                const isTriedWrong = wrongOptions.includes(option);
                const isHit = isSolved && isCorrectOpt;
                const isShaking = shakingOption === option;
                const isDimmedAfterSolve = isSolved && !isCorrectOpt;

                let cardStyle =
                  'bg-white border-teal-200 hover:border-orange-400 hover:bg-amber-50/50 text-slate-900 shadow-sm hover:shadow-md';
                let badgeStyle = 'bg-teal-600 text-white';

                if (isHit) {
                  cardStyle =
                    'bg-emerald-50 border-emerald-500 text-emerald-950 ring-4 ring-emerald-400/45 shadow-lg';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isTriedWrong) {
                  cardStyle = 'bg-rose-50 border-rose-400 text-rose-800 opacity-85';
                  badgeStyle = 'bg-rose-600 text-white';
                } else if (isDimmedAfterSolve) {
                  cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  badgeStyle = 'bg-slate-300 text-slate-600';
                }

                return (
                  <motion.button
                    key={option}
                    type="button"
                    disabled={isSolved || isTriedWrong}
                    animate={
                      isShaking
                        ? { x: [0, -10, 10, -7, 7, -3, 3, 0] }
                        : isHit
                        ? { scale: [1, 1.025, 1] }
                        : { x: 0, scale: 1 }
                    }
                    transition={{ duration: 0.35 }}
                    whileHover={!isSolved && !isTriedWrong ? { scale: 1.015 } : undefined}
                    whileTap={!isSolved && !isTriedWrong ? { scale: 0.98 } : undefined}
                    onClick={() => handleSelectOption(option)}
                    className={`min-h-[82px] sm:min-h-[92px] px-5 py-4 rounded-2xl border-2 text-left transition-colors flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`w-11 h-11 rounded-xl text-lg font-black flex items-center justify-center shrink-0 shadow-xs ${badgeStyle}`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums leading-snug">
                        {option}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isHit && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-black text-sm sm:text-base">
                          <CheckCircle2 size={28} className="text-emerald-600" />
                          <span className="hidden sm:inline">Trúng mục tiêu!</span>
                        </div>
                      )}
                      {isTriedWrong && <XCircle size={26} className="text-rose-500" />}
                      {!isSolved && !isTriedWrong && (
                        <Target size={24} className="text-orange-400 opacity-80" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* 3. PHẢN HỒI KHI CHỌN SAI + NÚT GỢI Ý CÔNG THỨC */}
            {!isSolved && wrongOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-rose-700 font-extrabold text-base sm:text-lg">
                    <XCircle size={22} className="shrink-0" />
                    <span>Chưa chính xác rồi! Em hãy kiểm tra lại phép tính và chọn mục tiêu khác nhé.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFormulaHint((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Lightbulb size={18} />
                    <span>{showFormulaHint ? 'Ẩn gợi ý công thức' : 'Xem gợi ý công thức'}</span>
                  </button>
                </div>

                {showFormulaHint && (
                  <div className="bg-white border border-amber-200 rounded-xl p-4 text-slate-900">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
                      Gợi ý công thức
                    </div>
                    <p className="text-lg sm:text-xl font-black text-teal-800">
                      Muốn tìm a% của B, ta lấy B × a : 100
                    </p>
                    {activeScenario.level === 4 && (
                      <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
                        Lưu ý bài 2 bước: Sau khi tính số tiền được giảm, lấy giá ban đầu trừ đi số tiền được giảm.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. BẮT BUỘC HIỂN THỊ KHUNG "TRÌNH BÀY CÁCH TÍNH" KHI TRẢ LỜI ĐÚNG + NÚT ĐIỀU KHIỂN GIÁO VIÊN */}
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 text-emerald-900">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                        Trình bày cách tính
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-emerald-700">
                        Mời 1 bạn học sinh đứng dậy đọc to cách tính trước lớp!
                      </p>
                    </div>
                  </div>

                  <span className="text-sm sm:text-base font-black text-emerald-800 tabular-nums">
                    +{wrongOptions.length === 0 ? 25 : 15} điểm thưởng
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-200 p-4 sm:p-5 space-y-2.5">
                  {activeScenario.calculationSteps.map((step, sIdx) => (
                    <p
                      key={sIdx}
                      className="text-lg sm:text-2xl font-black text-slate-900 font-mono leading-relaxed"
                    >
                      {step}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
                  {isRandomMode && (
                    <button
                      type="button"
                      onClick={handleGenerateRandomScenario}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-white font-black text-base sm:text-lg shadow-md transition-all cursor-pointer"
                    >
                      <Dices size={20} />
                      <span>🎲 Tạo tình huống ngẫu nhiên</span>
                    </button>
                  )}

                  {!isRandomMode && (
                    <button
                      type="button"
                      onClick={handleNextScenario}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-[0.98] text-white font-black text-base sm:text-lg shadow-md transition-all cursor-pointer"
                    >
                      <span>
                        {currentIdx < scenarios.length - 1
                          ? '➡️ Tình huống tiếp theo'
                          : '🏆 Xem tổng kết lượt chơi'}
                      </span>
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PercentHuntGame;
