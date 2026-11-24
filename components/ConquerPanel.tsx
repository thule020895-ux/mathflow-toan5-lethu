import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  BookOpen, 
  Award, 
  Flame, 
  ChevronRight, 
  Star, 
  Clock, 
  Sparkles,
  HelpCircle,
  Shapes,
  Maximize2,
  Check,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTION_SETS } from './conquerAdvancedSets';
import { ConquerIllustration } from './ConquerIllustrations';

const renderTextWithSup = (text: string) => {
  const parts = text.split(/(cm²|dm²|m²|cm³|dm³|m³)/g);
  return parts.map((part, idx) => {
    if (part.endsWith('²')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <sup className="text-[0.72em] leading-none">2</sup>
        </React.Fragment>
      );
    }
    if (part.endsWith('³')) {
      return (
        <React.Fragment key={idx}>
          {part.slice(0, -1)}
          <sup className="text-[0.72em] leading-none">3</sup>
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

export const ConquerPanel: React.FC = () => {
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedSets, setCompletedSets] = useState<{ [setId: string]: { correct: number; total: number } }>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const activeSet = QUESTION_SETS.find(s => s.id === selectedSetId) || QUESTION_SETS[0];
  const currentQ = activeSet.questions[currentQuestionIndex];
  const selectedOption = userAnswers[currentQuestionIndex] ?? null;
  const isAnswered = selectedOption !== null;

  const handleSelectSet = (setId: string) => {
    setSelectedSetId(setId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowHint(false);
    setCompleted(false);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // Prevent changing after submission
    const nextAnswers = { ...userAnswers, [currentQuestionIndex]: index };
    setUserAnswers(nextAnswers);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      setCompleted(true);
      const totalCorrect = Object.entries(userAnswers).filter(
        ([idx, ans]) => ans === activeSet.questions[Number(idx)]?.correctIndex
      ).length;
      setCompletedSets(prev => ({
        ...prev,
        [activeSet.id]: { correct: totalCorrect, total: activeSet.questions.length }
      }));
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentQuestionIndex(idx);
    setShowHint(false);
  };

  const handleResetSet = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowHint(false);
    setCompleted(false);
  };



  const correctCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => ans === activeSet.questions[Number(idx)]?.correctIndex
  ).length;
  const totalQuestions = activeSet.questions.length;

  // 1. MÀN HÌNH CHỌN BỘ ĐỀ (KHI CHƯA CHỌN BỘ ĐỀ NÀO)
  if (selectedSetId === null) {
    const totalFinished = Object.keys(completedSets).length;

    return (
      <div className="h-full flex flex-col bg-[#fcfdfa] math-grid-light overflow-y-auto p-3 sm:p-5">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
          
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
                <Trophy size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                    Luyện Thi HSG & Vào Trường Chuyên
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">10 Bộ Đề Trọng Điểm</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
                  Chọn Bộ Đề Thử Thách Toán Nâng Cao Lớp 5
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Em hãy chọn một bộ đề bên dưới để mở bảng tương tác làm bài và khám phá lời giải chi tiết!
                </p>
              </div>
            </div>

            {/* Quick summary pill */}
            <div className="flex items-center gap-3 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-300 shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Đã hoàn thành</span>
                <span className="text-base font-black text-amber-700">
                  {totalFinished}/10 bộ đề
                </span>
              </div>
            </div>
          </div>

          {/* Grid 10 Question Sets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {QUESTION_SETS.map((set, index) => {
              const completedStat = completedSets[set.id];
              return (
                <div
                  key={set.id}
                  onClick={() => handleSelectSet(set.id)}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  {/* Top indicator bar */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      ĐỀ {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 group-hover:text-amber-700">
                      {set.questions.length} câu
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-700/80 block mb-1">
                      {set.badge}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 group-hover:text-amber-800 line-clamp-2 leading-snug">
                      {set.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {set.description}
                    </p>
                  </div>

                  {/* Bottom Action & Status */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    {completedStat ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Đúng {completedStat.correct}/{completedStat.total}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        Chưa làm
                      </span>
                    )}

                    <span className="text-xs font-black text-amber-600 group-hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Bắt đầu <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bí quyết chinh phục footer note */}
          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-300/80 flex items-center gap-2.5 text-xs text-amber-900">
            <Lightbulb size={18} className="text-amber-600 shrink-0" />
            <span className="font-semibold">
              Mẹo ôn tập: Hãy chú ý tỉ số diện tích giữa các tam giác có chung đáy hoặc chiều cao, và các phép trừ diện tích hình học!
            </span>
          </div>

        </div>
      </div>
    );
  }

  // 2. BẢNG TƯƠNG TÁC LÀM BÀI (THIẾT KẾ TINH GỌN, KHÔNG CẦN LĂN CHUỘT)
  return (
    <div className="h-full flex flex-col bg-[#fcfdfa] math-grid-light overflow-hidden">
      
      {/* Top Bar Tinh Gọn: Nút chọn đề khác + Tên đề + Chuyển câu hỏi + Điểm số */}
      <div className="bg-white border-b-2 border-amber-400 px-3 sm:px-4 py-2 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Nút Quay lại danh sách bộ đề & Tiêu đề */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedSetId(null)}
              className="flex items-center gap-1.5 text-xs font-extrabold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-amber-400 transition-all cursor-pointer"
              title="Quay lại danh sách chọn bộ đề"
            >
              <ArrowLeft size={14} />
              <span>Đổi bộ đề khác</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                {activeSet.badge}
              </span>
              <h2 className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[240px] md:max-w-[320px]">
                {activeSet.title}
              </h2>
            </div>
          </div>

          {/* Dãy nút chuyển câu hỏi nhanh [1] ... [10] */}
          <div className="flex flex-wrap items-center gap-1 bg-amber-50/70 p-1 rounded-xl border border-amber-300/80">
            {activeSet.questions.map((q, idx) => {
              const isCurrent = currentQuestionIndex === idx;
              const ans = userAnswers[idx];
              const isAns = ans !== undefined;
              const isCorrect = ans === q.correctIndex;

              let dotStyle = 'bg-white text-slate-600 hover:bg-amber-100 border-slate-200';
              if (isAns) {
                dotStyle = isCorrect
                  ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                  : 'bg-rose-500 text-white border-rose-500 font-black';
              } else if (isCurrent) {
                dotStyle = 'bg-amber-500 text-white border-amber-600 font-black shadow-sm';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${dotStyle} ${
                    isCurrent ? 'ring-2 ring-amber-400' : ''
                  }`}
                  title={`Câu ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Điểm & Số câu đúng */}
          <div className="flex items-center gap-2 bg-amber-50/70 px-3 py-1 rounded-xl border border-amber-300/80 text-xs font-black">
            <span className="text-amber-800 flex items-center gap-1">
              <Award size={14} className="text-amber-600" />
              {correctCount * 10} điểm
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-600" />
              {correctCount}/{totalQuestions}
            </span>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-2 sm:p-3.5 flex flex-col overflow-y-auto">
        
        {!completed ? (
          <div className="flex-1 bg-white rounded-2xl border-2 border-amber-400 shadow-sm p-3 sm:p-4 flex flex-col justify-start overflow-y-auto">
            
            {/* Split 2 Cột: Bên Trái là Sơ Đồ Hình Học, Bên Phải là Câu Hỏi + Đáp Án + Hướng Dẫn */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
              
              {/* CỘT TRÁI (5 phần): Sơ đồ hình học SVG & Gợi ý tư duy */}
              <div className="lg:col-span-5 flex flex-col gap-2 shrink-0">
                
                {/* Visual Diagram Frame */}
                <div className="rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner bg-slate-950">
                  <ConquerIllustration svgType={currentQ.svgType} svgData={currentQ.svgData} />
                </div>

                {/* Gợi ý tư duy dạng toggle gọn gàng */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-300/80 text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-900 flex items-center gap-1">
                      <Lightbulb size={14} className="text-amber-600" />
                      Gợi ý tư duy nhanh
                    </span>
                    <button
                      onClick={() => setShowHint(prev => !prev)}
                      className="text-[11px] font-extrabold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                    >
                      {showHint ? 'Thu gọn' : 'Xem chi tiết'}
                    </button>
                  </div>
                  
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-slate-700 leading-snug font-medium pt-1 border-t border-amber-200"
                    >
                      {renderTextWithSup(currentQ.hint)}
                    </motion.p>
                  )}
                </div>

              </div>

              {/* CỘT PHẢI (7 phần): CÂU HỎI -> ĐÁP ÁN NGAY DƯỚI -> HƯỚNG DẪN NGAY DƯỚI */}
              <div className="lg:col-span-7 flex flex-col justify-start gap-2.5">
                
                {/* 1. KHUNG CÂU HỎI */}
                <div className="bg-amber-50/50 p-3 sm:p-3.5 rounded-xl border-2 border-amber-300 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                      Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
                    </span>
                    <span className="text-xs font-black text-slate-700 truncate">
                      {currentQ.title}
                    </span>
                  </div>
                  <p className="text-slate-900 text-sm sm:text-base font-bold leading-snug">
                    {renderTextWithSup(currentQ.question)}
                  </p>
                </div>

                {/* 2. ĐÁP ÁN HIỂN THỊ NGAY DƯỚI CÂU HỎI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-white hover:bg-amber-50/60 border-slate-200 hover:border-amber-400 text-slate-800 shadow-sm cursor-pointer';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    const labels = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`py-2 px-3 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 active:scale-[0.99] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? (isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white')
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {labels[idx]}
                          </span>
                          <span className="leading-snug">{renderTextWithSup(opt)}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle size={16} className="text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 3. PHÂN TÍCH & LỜI GIẢI CHI TIẾT */}
                {isAnswered ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border-2 leading-snug shadow-sm ${
                      selectedOption === currentQ.correctIndex
                        ? 'bg-emerald-50/70 border-emerald-400 text-slate-800'
                        : 'bg-amber-50/70 border-amber-400 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-black/5">
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm uppercase">
                        {selectedOption === currentQ.correctIndex ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-600" />
                            <span className="text-emerald-700">Chính xác! (+10 điểm)</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-rose-600" />
                            <span className="text-rose-700">Chưa chính xác! Xem phân tích bên dưới:</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                      >
                        <span>{currentQuestionIndex < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-white/95 p-2.5 sm:p-3 rounded-lg border border-amber-200/70">
                      <div className="font-black text-amber-800 mb-1.5 flex items-center gap-1.5">
                        <BookOpen size={15} className="text-amber-600 shrink-0" />
                        <span>Phân tích & Lời giải chi tiết</span>
                      </div>
                      {currentQ.steps && currentQ.steps.length > 0 ? (
                        <ol className="space-y-1.5 text-slate-700">
                          {currentQ.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                {stepIdx + 1}
                              </span>
                              <span>{renderTextWithSup(step)}</span>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p>{renderTextWithSup(currentQ.solution)}</p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                      <span>👉</span>
                      <span>Hãy chọn một đáp án A, B, C hoặc D ở trên để chấm điểm và xem Phân tích & Lời giải chi tiết.</span>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : (
          /* MÀN HÌNH HOÀN THÀNH BỘ ĐỀ */
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-white rounded-2xl border-2 border-amber-400 shadow-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-xl"
            >
              <div className="w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-3 text-slate-900 shadow-lg animate-bounce">
                <Trophy size={36} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-0.5 uppercase tracking-tight">
                Hoàn Thành Bộ Đề!
              </h2>
              <p className="text-xs text-slate-500 font-bold mb-4">
                {activeSet.title}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-extrabold text-slate-500 block uppercase">Số câu đúng</span>
                  <span className="text-2xl font-black text-emerald-600">{correctCount}/{totalQuestions}</span>
                </div>
                <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-extrabold text-slate-500 block uppercase">Điểm đạt được</span>
                  <span className="text-2xl font-black text-amber-600">{correctCount * 10} điểm</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl mb-5 text-xs font-extrabold text-amber-900 leading-relaxed">
                {correctCount === totalQuestions
                  ? '🌟 Trạng Nguyên Hình Học! Em đã xuất sắc đạt điểm tuyệt đối!'
                  : correctCount >= totalQuestions / 2
                  ? '👏 Rất đáng khen! Hãy xem lại lời giải chi tiết để nâng cao tư duy hơn nữa!'
                  : '💪 Cố gắng lên nhé! Đọc kỹ gợi ý và thử lại để chinh phục điểm tối đa!'}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleResetSet}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all active:scale-98 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>Luyện tập lại</span>
                </button>
                <button
                  onClick={() => setSelectedSetId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-all active:scale-98 cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>Chọn bộ đề khác</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConquerPanel;
