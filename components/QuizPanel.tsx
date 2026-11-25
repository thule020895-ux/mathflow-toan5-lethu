import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Lightbulb,
  Calculator,
  Shapes,
  BarChart3,
  Star,
  NotebookPen,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotCompanion from './MascotCompanion';
import PracticeIllustration from './PracticeIllustrations';
import PracticeScratchpad from './PracticeScratchpad';
import {
  QUESTION_BANK,
  PRACTICE_SETS,
  DomainId,
  PracticeSetMeta
} from './practiceQuestionBank';

interface DomainConfig {
  id: DomainId;
  title: string;
  icon: React.ReactNode;
  headerBgClass: string;
  cardBorderClass: string;
  iconBoxClass: string;
  badgeClass: string;
  progressBarClass: string;
  ctaClass: string;
  accentTextClass: string;
}

const DOMAINS: DomainConfig[] = [
  {
    id: 'numbers',
    title: 'Số và Phép tính',
    icon: <Calculator size={28} />,
    headerBgClass: 'bg-gradient-to-r from-teal-600 to-sky-600 text-white',
    cardBorderClass: 'border-teal-200 hover:border-teal-500',
    iconBoxClass: 'bg-gradient-to-br from-teal-500 to-sky-600 text-white',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    progressBarClass: 'bg-gradient-to-r from-teal-500 to-sky-500',
    ctaClass: 'bg-teal-600 hover:bg-teal-700 text-white',
    accentTextClass: 'text-teal-700'
  },
  {
    id: 'geometry',
    title: 'Hình học và Đo lường',
    icon: <Shapes size={28} />,
    headerBgClass: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    cardBorderClass: 'border-orange-200 hover:border-orange-500',
    iconBoxClass: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    progressBarClass: 'bg-gradient-to-r from-orange-500 to-amber-500',
    ctaClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    accentTextClass: 'text-orange-700'
  },
  {
    id: 'stats',
    title: 'Thống kê và Xác suất',
    icon: <BarChart3 size={28} />,
    headerBgClass: 'bg-gradient-to-r from-emerald-600 to-violet-600 text-white',
    cardBorderClass: 'border-emerald-200 hover:border-violet-500',
    iconBoxClass: 'bg-gradient-to-br from-emerald-500 to-violet-600 text-white',
    badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
    progressBarClass: 'bg-gradient-to-r from-emerald-500 to-violet-500',
    ctaClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accentTextClass: 'text-violet-700'
  }
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const QuizPanel: React.FC = () => {
  // 3 màn hình tách biệt:
  // 1) selectedDomainId === null -> Màn hình 1: Chọn Mạch kiến thức
  // 2) selectedDomainId !== null && selectedSetId === null -> Màn hình 2: Danh sách Bộ đề luyện tập
  // 3) selectedDomainId !== null && selectedSetId !== null -> Màn hình 3: Bảng tương tác 10 bài tập
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMethodHint, setShowMethodHint] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);

  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [domainStars, setDomainStars] = useState<Record<DomainId, number>>({
    numbers: 0,
    geometry: 0,
    stats: 0
  });
  const [solvedIds, setSolvedIds] = useState<Record<number, boolean>>({});

  const activeDomain = useMemo(
    () => DOMAINS.find((d) => d.id === selectedDomainId) ?? null,
    [selectedDomainId]
  );

  const domainSets = useMemo(
    () => (selectedDomainId ? PRACTICE_SETS.filter((s) => s.domain === selectedDomainId) : []),
    [selectedDomainId]
  );

  const activeSet: PracticeSetMeta | null = useMemo(
    () => PRACTICE_SETS.find((s) => s.id === selectedSetId) ?? null,
    [selectedSetId]
  );

  const setQuestions = useMemo(() => {
    if (!selectedSetId) return [];
    return QUESTION_BANK.filter((q) => q.setId === selectedSetId).sort((a, b) => a.id - b.id);
  }, [selectedSetId]);

  const resetQuestionState = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowMethodHint(false);
    setShowScratchpad(false);
    setSessionCorrect(0);
    setSessionAnswered(0);
    setIsFinished(false);
  };

  // Chuyển sang Màn hình 2 (Danh sách Bộ đề)
  const handleSelectDomain = (domainId: DomainId) => {
    setSelectedDomainId(domainId);
    setSelectedSetId(null);
    resetQuestionState();
  };

  // Quay về Màn hình 1 (3 Mạch kiến thức)
  const handleBackToDomains = () => {
    setSelectedDomainId(null);
    setSelectedSetId(null);
    resetQuestionState();
  };

  // Chuyển sang Màn hình 3 (Bảng tương tác 10 câu)
  const handleSelectSet = (setId: string) => {
    setSelectedSetId(setId);
    resetQuestionState();
  };

  // Quay về Màn hình 2 (Danh sách Bộ đề)
  const handleBackToSets = () => {
    setSelectedSetId(null);
    resetQuestionState();
  };

  // Chạm chọn A/B/C/D -> Chấm điểm ngay & hiện lời giải từng bước
  const handlePickOption = (optionIndex: number) => {
    if (selectedOption !== null || !activeDomain) return;
    const currentQ = setQuestions[currentIdx];
    if (!currentQ) return;

    const isCorrect = optionIndex === currentQ.correctAnswer;
    setSelectedOption(optionIndex);
    setSessionAnswered((prev) => prev + 1);

    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
      if (!solvedIds[currentQ.id]) {
        setSolvedIds((prev) => ({ ...prev, [currentQ.id]: true }));
        setDomainStars((prev) => ({
          ...prev,
          [activeDomain.id]: prev[activeDomain.id] + 10
        }));
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < setQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowMethodHint(false);
    } else {
      setIsFinished(true);
      if (setQuestions.length > 0 && sessionCorrect >= Math.ceil(setQuestions.length / 2)) {
        confetti({
          particleCount: 100,
          spread: 65,
          origin: { y: 0.65 }
        });
      }
    }
  };

  const totalStars = domainStars.numbers + domainStars.geometry + domainStars.stats;

  // ==================== MÀN HÌNH 1: CHỌN MẠCH KIẾN THỨC ====================
  if (!activeDomain) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-slate-50/70 min-h-full">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Header gọn gàng, rõ ràng trên cả mobile & desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Luyện Tập Toán 5
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Chọn một mạch kiến thức để mở các bộ đề luyện tập.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-300 shadow-sm self-start sm:self-center shrink-0">
              <Star size={18} className="text-amber-500" fill="currentColor" />
              <span className="text-sm font-black text-slate-800 tabular-nums">
                Tổng sao: <span className="text-amber-600">{totalStars}</span>
              </span>
            </div>
          </div>

          {/* 3 Thẻ Mạch Kiến Thức Tối Giản: Chỉ Icon + Tên mạch + Tổng sao + Nút chọn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {DOMAINS.map((dom) => (
              <button
                key={dom.id}
                type="button"
                onClick={() => handleSelectDomain(dom.id)}
                className={`w-full text-left bg-white rounded-3xl border-2 ${dom.cardBorderClass} shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between gap-5 cursor-pointer group active:scale-[0.99]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl ${dom.iconBoxClass} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0`}
                  >
                    {dom.icon}
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-700 font-black text-sm tabular-nums shrink-0">
                    <Star size={15} className="text-amber-500" fill="currentColor" />
                    <span>{domainStars[dom.id]}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {dom.title}
                </h3>

                <div
                  className={`w-full min-h-[48px] py-2.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-colors ${dom.ctaClass}`}
                >
                  <span>Chọn mạch kiến thức</span>
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==================== MÀN HÌNH 2: DANH SÁCH CÁC BỘ ĐỀ ====================
  if (!activeSet) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-slate-50/70 min-h-full">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Nút Quay lại lớn + Tiêu đề Mạch kiến thức */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBackToDomains}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-200 font-black text-sm shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </button>

            <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-amber-300 text-sm font-black text-slate-800 tabular-nums shadow-sm">
              <Star size={16} className="text-amber-500" fill="currentColor" />
              <span>{domainStars[activeDomain.id]} sao</span>
            </div>
          </div>

          <div className={`${activeDomain.headerBgClass} rounded-3xl p-5 shadow-sm flex items-center gap-3.5`}>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              {activeDomain.icon}
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-white/85">
                Mạch kiến thức
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">{activeDomain.title}</h2>
            </div>
          </div>

          {/* Danh sách Bộ đề luyện tập */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 px-1 flex items-center gap-2">
              <Layers size={15} />
              <span>Bộ đề luyện tập (10 bài tập / bộ đề)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domainSets.map((setMeta) => {
                const setQs = QUESTION_BANK.filter((q) => q.setId === setMeta.id);
                const solvedCount = setQs.filter((q) => solvedIds[q.id]).length;
                const progressPct =
                  setQs.length > 0 ? Math.round((solvedCount / setQs.length) * 100) : 0;

                return (
                  <button
                    key={setMeta.id}
                    type="button"
                    onClick={() => handleSelectSet(setMeta.id)}
                    className={`w-full text-left bg-white rounded-3xl border-2 ${activeDomain.cardBorderClass} p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group active:scale-[0.99]`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border ${activeDomain.badgeClass}`}
                        >
                          Bộ đề {setMeta.setNumber}
                        </span>
                        <span className="text-xs font-black text-slate-600 tabular-nums">
                          {solvedCount}/{setQs.length} câu
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {setMeta.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {setMeta.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full transition-all duration-300 ${activeDomain.progressBarClass}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div
                        className={`w-full min-h-[46px] py-2.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-colors ${activeDomain.ctaClass}`}
                      >
                        <span>Làm bài</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MÀN HÌNH 3: BẢNG TƯƠNG TÁC 10 BÀI TẬP KÈM GỢI Ý ====================
  const currentQ = setQuestions[currentIdx];
  const isChecked = selectedOption !== null;
  const progressPct =
    setQuestions.length > 0 ? Math.round(((currentIdx + 1) / setQuestions.length) * 100) : 0;

  const currentSetIndex = domainSets.findIndex((s) => s.id === activeSet.id);
  const nextSet =
    currentSetIndex >= 0 && currentSetIndex < domainSets.length - 1
      ? domainSets[currentSetIndex + 1]
      : null;

  return (
    <div className="p-3.5 sm:p-6 bg-slate-50/70 min-h-full">
      <div className="max-w-3xl mx-auto space-y-3.5 sm:space-y-4">
        {/* Thanh điều hướng quay lại Màn hình 2 + Điểm sao */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleBackToSets}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-200 font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <ArrowLeft size={17} />
            <span>Quay lại bộ đề</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black border ${activeDomain.badgeClass}`}
            >
              Bộ đề {activeSet.setNumber}: {activeSet.title}
            </span>

            <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 min-h-[40px] rounded-xl border border-amber-300 text-xs sm:text-sm font-black text-slate-800 tabular-nums shadow-sm">
              <Star size={15} className="text-amber-500" fill="currentColor" />
              <span>{domainStars[activeDomain.id]}</span>
            </div>
          </div>
        </div>

        {/* Nếu đã hoàn thành 10 câu của bộ đề */}
        {isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-3xl border-2 ${activeDomain.cardBorderClass} p-6 sm:p-8 text-center shadow-sm space-y-5`}
          >
            <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="text-amber-600" size={32} />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Hoàn thành Bộ đề {activeSet.setNumber}!
              </h3>
              <p className="text-sm text-slate-600 mt-1 font-medium">{activeSet.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              <div className="bg-emerald-50 p-3 sm:p-4 rounded-2xl border border-emerald-200">
                <div className="text-lg sm:text-xl font-black text-emerald-800 tabular-nums">
                  {sessionCorrect}/{setQuestions.length}
                </div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase">Câu đúng</div>
              </div>
              <div className="bg-sky-50 p-3 sm:p-4 rounded-2xl border border-sky-200">
                <div className="text-lg sm:text-xl font-black text-sky-800 tabular-nums">
                  {setQuestions.length > 0
                    ? Math.round((sessionCorrect / setQuestions.length) * 100)
                    : 0}
                  %
                </div>
                <div className="text-[11px] font-bold text-sky-700 uppercase">Chính xác</div>
              </div>
              <div className="bg-amber-50 p-3 sm:p-4 rounded-2xl border border-amber-200">
                <div className="text-lg sm:text-xl font-black text-amber-800 tabular-nums flex items-center justify-center gap-1">
                  <Star size={17} className="text-amber-500" fill="currentColor" />
                  {domainStars[activeDomain.id]}
                </div>
                <div className="text-[11px] font-bold text-amber-700 uppercase">Sao mạch</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <button
                type="button"
                onClick={resetQuestionState}
                className="min-h-[48px] px-5 py-3 rounded-2xl font-black text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw size={17} />
                <span>Làm lại bộ đề này</span>
              </button>

              {nextSet ? (
                <button
                  type="button"
                  onClick={() => handleSelectSet(nextSet.id)}
                  className={`min-h-[48px] px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${activeDomain.ctaClass}`}
                >
                  <span>Bộ đề {nextSet.setNumber}: {nextSet.title}</span>
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBackToSets}
                  className={`min-h-[48px] px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${activeDomain.ctaClass}`}
                >
                  <ArrowLeft size={17} />
                  <span>Về danh sách bộ đề</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : currentQ ? (
          <div className="space-y-3.5">
            {/* Thanh tiến độ Câu X/10 */}
            <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-sm font-black tabular-nums ${activeDomain.accentTextClass}`}>
                  Câu {currentIdx + 1}/{setQuestions.length}
                </span>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-extrabold tabular-nums">
                  <span
                    className={
                      currentQ.difficulty === 'Thông hiểu' ? 'text-sky-700' : 'text-amber-700'
                    }
                  >
                    {currentQ.difficulty}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <span className="text-slate-600">
                    Đúng: <strong className="text-emerald-700">{sessionCorrect}/{sessionAnswered}</strong>
                  </span>
                </div>
              </div>

              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${activeDomain.progressBarClass}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Khung câu hỏi tối ưu chạm tay trên di động */}
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-6 space-y-5">
                {/* Nội dung đề bài (>= 18px) + Minh họa SVG nếu có */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {currentQ.text}
                  </h3>

                  {currentQ.diagramId && (
                    <div className="max-w-md mx-auto">
                      <PracticeIllustration id={currentQ.diagramId} />
                    </div>
                  )}
                </div>

                {/* Thanh nút hỗ trợ: Gợi ý cách giải & Bảng nháp nhanh */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowMethodHint((prev) => !prev)}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold border flex items-center gap-2 transition-all cursor-pointer ${
                      showMethodHint
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    <Lightbulb size={16} />
                    <span>Gợi ý cách giải</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowScratchpad((prev) => !prev)}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold border flex items-center gap-2 transition-all cursor-pointer ${
                      showScratchpad
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <NotebookPen size={16} />
                    <span>Bảng nháp nhanh</span>
                  </button>
                </div>

                {/* Khung Gợi ý cách giải (không làm lộ đáp án) */}
                <AnimatePresence>
                  {showMethodHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-2.5 text-sm text-sky-950 leading-relaxed">
                        <Lightbulb size={18} className="text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black">Gợi ý cách giải: </span>
                          <span className="font-medium">{currentQ.methodHint}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bảng nháp nhanh */}
                <AnimatePresence>
                  {showScratchpad && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <PracticeScratchpad onClose={() => setShowScratchpad(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4 Nút đáp án A, B, C, D lớn dễ chạm trên điện thoại */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOpt = idx === currentQ.correctAnswer;

                    let cardStyle =
                      'bg-white border-slate-200 text-slate-900 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99]';

                    if (isChecked) {
                      if (isCorrectOpt) {
                        cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                      } else if (isSelected && !isCorrectOpt) {
                        cardStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                      } else {
                        cardStyle = 'bg-white border-slate-200 text-slate-400 opacity-70';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isChecked}
                        onClick={() => handlePickOption(idx)}
                        className={`min-h-[56px] p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span
                            className={`w-8 h-8 rounded-xl text-sm font-black flex items-center justify-center shrink-0 ${
                              isChecked && isCorrectOpt
                                ? 'bg-emerald-600 text-white'
                                : isChecked && isSelected && !isCorrectOpt
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {OPTION_LABELS[idx]}
                          </span>
                          <span className="text-base sm:text-lg leading-snug">{option}</span>
                        </div>

                        {isChecked && isCorrectOpt && (
                          <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                        )}
                        {isChecked && isSelected && !isCorrectOpt && (
                          <XCircle size={22} className="text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Giải thích chi tiết từng bước hiển thị ngay sau khi chọn đáp án */}
              <AnimatePresence>
                {isChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`border-t-2 p-4 sm:p-6 space-y-4 ${
                      selectedOption === currentQ.correctAnswer
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-rose-50/80 border-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {selectedOption === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-emerald-900 font-black text-base">
                            Chính xác! Em làm rất tốt! (+10 sao)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                          <span className="text-rose-900 font-black text-base">
                            Chưa chính xác! Đáp án đúng là{' '}
                            <strong className="underline">
                              {OPTION_LABELS[currentQ.correctAnswer]}.{' '}
                              {currentQ.options[currentQ.correctAnswer]}
                            </strong>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        Giải thích chi tiết từng bước
                      </h4>
                      <ul className="space-y-2 text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                        {currentQ.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <MascotCompanion
                        compact
                        isHappy={selectedOption === currentQ.correctAnswer}
                        message={
                          selectedOption === currentQ.correctAnswer
                            ? 'Tuyệt vời! Sang câu tiếp theo nhé!'
                            : 'Xem kỹ các bước giải trên để nhớ cách làm nha!'
                        }
                      />

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className={`w-full sm:w-auto min-h-[52px] px-7 py-3 rounded-2xl font-black text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${activeDomain.ctaClass}`}
                      >
                        <span>
                          {currentIdx === setQuestions.length - 1
                            ? 'Xem kết quả bộ đề'
                            : 'Câu tiếp theo'}
                        </span>
                        <ArrowRight size={19} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuizPanel;
