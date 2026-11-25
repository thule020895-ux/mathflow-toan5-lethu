import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Trophy,
  Timer,
  RotateCcw,
  Heart,
  Triangle,
  Box,
  Circle,
  Layers,
  Bike,
  ChevronRight,
  Star,
  Target,
  Compass,
  Scale,
  Split,
  Percent,
  BarChart3,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotCompanion from './MascotCompanion';
import ArenaIllustration, { renderMathUnitText } from './ArenaIllustrations';
import PercentHuntGame from './PercentHuntGame';
import {
  GameType,
  ArenaQuestion,
  generateArenaSession
} from './arenaQuestionGenerator';

interface GamePanelProps {
  openPercentHuntSignal?: number;
}

interface GameConfig {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const GAMES: GameConfig[] = [
  { id: 'tri_area', title: 'Thợ săn Tam giác', description: 'Tính diện tích tam giác khi biết đáy và chiều cao.', icon: <Triangle size={24} />, color: 'bg-blue-500' },
  { id: 'trap_area', title: 'Kỹ sư Hình thang', description: 'Tính diện tích hình thang từ đáy lớn, đáy bé và chiều cao.', icon: <Layers size={24} />, color: 'bg-purple-500' },
  { id: 'circle_area', title: 'Vòng tròn Kỳ diệu', description: 'Tính diện tích hoặc chu vi hình tròn từ bán kính.', icon: <Circle size={24} />, color: 'bg-amber-500' },
  { id: 'rect_sxq', title: 'Siêu nhí Hình hộp', description: 'Tính diện tích xung quanh của hình hộp chữ nhật.', icon: <Box size={24} />, color: 'bg-indigo-500' },
  { id: 'cube_stp', title: 'Lập phương Thông thái', description: 'Tính diện tích toàn phần của hình lập phương.', icon: <Box size={24} />, color: 'bg-pink-500' },
  { id: 'volume', title: 'Kiến trúc sư Thể tích', description: 'Tính thể tích của các hình khối cơ bản.', icon: <Layers size={24} />, color: 'bg-emerald-500' },
  { id: 'velocity', title: 'Đường đua Vận tốc', description: 'Tính vận tốc khi biết quãng đường và thời gian.', icon: <Bike size={24} />, color: 'bg-orange-500' },
  { id: 'distance', title: 'Hành trình Quãng đường', description: 'Tính quãng đường khi biết vận tốc và thời gian.', icon: <Target size={24} />, color: 'bg-red-500' },
  { id: 'time', title: 'Đồng hồ Thời gian', description: 'Tính thời gian khi biết quãng đường và vận tốc.', icon: <Timer size={24} />, color: 'bg-cyan-500' },
  { id: 'relative_motion', title: 'Cuộc đua Kỳ thú', description: 'Bài toán chuyển động cùng chiều và ngược chiều.', icon: <Compass size={24} />, color: 'bg-rose-500' },
  { id: 'units_convert', title: 'Thần đồng Đổi đơn vị', description: 'Đổi nhanh các đơn vị đo đại lượng Toán 5.', icon: <Scale size={24} />, color: 'bg-teal-500' },
  { id: 'sum_diff_game', title: 'Cân bằng Tổng - Hiệu', description: 'Tìm nhanh số lớn hoặc số bé khi biết tổng và hiệu.', icon: <Scale size={24} />, color: 'bg-sky-600' },
  { id: 'ratio_game', title: 'Bậc thầy Tổng - Tỉ', description: 'Tính nhanh số phần bằng nhau để tìm số bé, số lớn.', icon: <Split size={24} />, color: 'bg-violet-600' },
  { id: 'fraction_game', title: 'Mảnh ghép Phân số', description: 'Tìm giá trị phân số của một số trong chớp mắt.', icon: <Sparkles size={24} />, color: 'bg-pink-500' },
  { id: 'percentage_game', title: 'Cao thủ Phần trăm', description: 'Tính nhanh tỉ số phần trăm hoặc giá trị phần trăm.', icon: <Percent size={24} />, color: 'bg-red-500' },
  { id: 'stats_game', title: 'Nhà Thống kê Tài ba', description: 'Phân tích số liệu thống kê và tỉ lệ biểu đồ.', icon: <BarChart3 size={24} />, color: 'bg-cyan-600' }
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const TOTAL_TIME_SECONDS = 180;

const GamePanel: React.FC<GamePanelProps> = ({ openPercentHuntSignal = 0 }) => {
  const [isPercentHuntOpen, setIsPercentHuntOpen] = useState(openPercentHuntSignal > 0);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<ArenaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [lives, setLives] = useState(3);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (openPercentHuntSignal > 0) {
      setIsPlaying(false);
      setIsPercentHuntOpen(true);
    }
  }, [openPercentHuntSignal]);

  const handleOpenPercentHunt = () => {
    setIsPercentHuntOpen(true);
  };

  const startGame = (type: GameType) => {
    const session = generateArenaSession(type);
    setSelectedGame(type);
    setQuestions(session);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(TOTAL_TIME_SECONDS);
    setLives(3);
    setPickedOption(null);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver]);

  const handleAnswer = (optionIdx: number) => {
    if (gameOver || pickedOption !== null) return;
    const currentQ = questions[currentIdx];
    if (!currentQ) return;

    setPickedOption(optionIdx);
    const isCorrect = optionIdx === currentQ.correctIndex;
    const nextLives = isCorrect ? lives : lives - 1;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.78 },
        colors: ['#10b981', '#34d399', '#fbbf24']
      });
    } else {
      setLives(nextLives);
    }

    setTimeout(() => {
      const isLastQuestion = currentIdx >= questions.length - 1;
      if (nextLives <= 0 || isLastQuestion) {
        setGameOver(true);
        if (nextLives > 0 && correctCount + (isCorrect ? 1 : 0) >= 6) {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        setCurrentIdx((prev) => prev + 1);
        setPickedOption(null);
      }
    }, 520);
  };

  if (isPercentHuntOpen) {
    return <PercentHuntGame onBack={() => setIsPercentHuntOpen(false)} />;
  }

  // ==================== MÀN HÌNH CHỌN THỬ THÁCH (GIỮ NGUYÊN GIAO DIỆN) ====================
  if (!isPlaying) {
    return (
      <div className="h-full flex flex-col p-6 md:p-8 math-grid-light overflow-y-auto min-h-[750px] relative">
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block bg-orange-500 text-white p-3.5 rounded-2xl shadow-lg mb-3"
          >
            <Zap size={32} fill="currentColor" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Đấu Trường Trò Chơi Toán Học
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            Chọn một thử thách tính nhanh để rèn luyện phản xạ và tư duy hình học!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl mx-auto w-full pb-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleOpenPercentHunt}
            className="group bg-gradient-to-br from-teal-50 via-white to-amber-50 p-5 rounded-2xl border-2 border-teal-300 shadow-sm hover:shadow-lg hover:border-orange-400 transition-all text-left flex items-start gap-4 relative overflow-hidden cursor-pointer"
          >
            <div className="bg-gradient-to-br from-teal-600 to-emerald-500 p-3.5 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Target size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-teal-950 text-base leading-tight mb-1">
                🎯 Săn tìm đáp án đúng (Tỉ số phần trăm)
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 font-semibold">
                Tìm giá trị phần trăm của một số · Toán 5, Tập 2 với 4 tình huống thực tế và chế độ giáo viên mở rộng.
              </p>
            </div>
            <div className="absolute right-3.5 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-orange-500" size={18} />
            </div>
          </motion.button>

          {GAMES.map((game, idx) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => startGame(game.id)}
              className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all text-left flex items-start gap-4 relative overflow-hidden cursor-pointer"
            >
              <div
                className={`${game.color} p-3.5 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform shrink-0`}
              >
                {game.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-800 text-base leading-tight mb-1">
                  {game.title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
                  {game.description}
                </p>
              </div>
              <div className="absolute right-3.5 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-sky-500" size={18} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Đặt trợ lý gọn gàng ở phía dưới danh sách thẻ, chừa khoảng trống bên phải để không che thẻ thứ 6 hay nút tìm kiếm */}
        <div className="max-w-6xl mx-auto w-full flex justify-end pt-2 pb-12 pr-0 md:pr-16">
          <MascotCompanion
            compact
            message="Chúc em đạt điểm số kỷ lục trong trò chơi nhé!"
          />
        </div>
      </div>
    );
  }

  // ==================== MÀN HÌNH KẾT QUẢ ====================
  if (gameOver) {
    const gameTitle = GAMES.find((g) => g.id === selectedGame)?.title ?? '';
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 sm:p-8 text-center bg-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-indigo-100 p-6 sm:p-8 rounded-full mb-5"
        >
          <Trophy size={72} className="text-indigo-600" />
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-800 mb-2">
          HOÀN THÀNH!
        </h2>
        <p className="text-base sm:text-xl text-slate-600 mb-6 font-bold">
          Kết quả của em trong{' '}
          <span className="text-indigo-600">"{gameTitle}"</span>:
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-4">
            <div className="text-xs font-extrabold uppercase text-orange-700 mb-1">
              Điểm số
            </div>
            <div className="text-4xl sm:text-5xl font-black text-orange-600 tabular-nums">
              {score}
            </div>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4">
            <div className="text-xs font-extrabold uppercase text-emerald-700 mb-1">
              Số câu đúng
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-600 tabular-nums">
              {correctCount}/{questions.length}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-black shadow-sm hover:bg-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>QUAY LẠI MENU</span>
          </button>
          <button
            type="button"
            onClick={() => selectedGame && startGame(selectedGame)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-7 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <RotateCcw size={18} />
            <span>CHƠI LẠI</span>
          </button>
        </div>
      </div>
    );
  }

  // ==================== MÀN HÌNH LÀM BÀI ĐẤU TRƯỜNG (10 CÂU TĂNG TIẾN, KHÔNG GỢI Ý) ====================
  const currentQ = questions[currentIdx];
  const progressPct =
    questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50">
      {/* Header Trò chơi */}
      <div className="bg-slate-900 text-white px-4 py-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            title="Quay lại chọn thử thách"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="font-black text-base sm:text-xl tracking-tight">
              {GAMES.find((g) => g.id === selectedGame)?.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    size={16}
                    className={
                      i < lives ? 'text-rose-500 fill-rose-500' : 'text-white/20'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white/70 tabular-nums">
                · Câu {currentIdx + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-7">
          <div className="text-center">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
              Thời gian
            </p>
            <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-black text-orange-400 tabular-nums">
              <Timer size={18} />
              <span>{timeLeft} giây</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
              Điểm số
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {score}
            </p>
          </div>
        </div>
      </div>

      {/* Thanh tiến độ 10 câu */}
      <div className="h-2 bg-slate-200 w-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Thân câu hỏi + Hình minh họa SVG (Tuyệt đối không có nút gợi ý) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none overflow-hidden">
          <div className="grid grid-cols-8 gap-12 rotate-12 scale-150">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="text-slate-900">
                <Star size={36} />
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={`${currentQ.index}-${currentQ.question}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl flex flex-col gap-5 z-10"
            >
              {/* Khung Đề bài + Hình vẽ minh họa SVG */}
              <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-black text-indigo-700 uppercase tracking-wide">
                    Câu hỏi {currentIdx + 1} / {questions.length}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black border ${
                      currentQ.difficulty === 'Cơ bản'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : currentQ.difficulty === 'Thông hiểu'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    Mức độ: {currentQ.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-7">
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed">
                      {renderMathUnitText(currentQ.question)}
                    </h2>
                  </div>
                  <div className="md:col-span-5">
                    <ArenaIllustration spec={currentQ.diagram} />
                  </div>
                </div>
              </div>

              {/* 4 Phương án A, B, C, D đầy đủ đơn vị và chỉ số trên */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((opt, idx) => {
                  const isPicked = pickedOption === idx;
                  const isCorrectOpt = idx === currentQ.correctIndex;
                  const showResult = pickedOption !== null;

                  let btnClass =
                    'bg-white border-slate-200 text-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40';
                  let badgeClass = 'bg-slate-100 text-slate-800';

                  if (showResult) {
                    if (isCorrectOpt) {
                      btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                      badgeClass = 'bg-emerald-600 text-white';
                    } else if (isPicked) {
                      btnClass = 'bg-rose-50 border-rose-500 text-rose-900';
                      badgeClass = 'bg-rose-600 text-white';
                    } else {
                      btnClass = 'bg-white border-slate-200 text-slate-400 opacity-70';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      disabled={showResult}
                      whileHover={showResult ? undefined : { scale: 1.01 }}
                      whileTap={showResult ? undefined : { scale: 0.98 }}
                      onClick={() => handleAnswer(idx)}
                      className={`min-h-[64px] p-4 sm:p-5 rounded-2xl border-2 text-left font-black shadow-sm transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnClass}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-9 h-9 rounded-xl text-sm font-black flex items-center justify-center shrink-0 ${badgeClass}`}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        <span className="text-lg sm:text-2xl leading-snug">
                          {renderMathUnitText(opt)}
                        </span>
                      </div>

                      {showResult && isCorrectOpt && (
                        <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                      )}
                      {showResult && isPicked && !isCorrectOpt && (
                        <XCircle size={24} className="text-rose-600 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePanel;
