
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Trophy, Timer, RotateCcw, Play, Heart, 
  Triangle, Box, Circle, Layers, Bike, 
  ChevronRight, Star, Target, Compass,
  Scale, Split, Percent, BarChart3, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotCompanion from './MascotCompanion';

type GameType = 
  | 'tri_area' | 'trap_area' | 'circle_area' 
  | 'rect_sxq' | 'cube_stp' | 'volume' 
  | 'velocity' | 'distance' | 'time' | 'relative_motion'
  | 'units_convert' | 'sum_diff_game' | 'ratio_game' 
  | 'fraction_game' | 'percentage_game' | 'stats_game';

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
  { id: 'percentage_game', title: 'Cao thủ Phần trăm', description: 'Tính nhanh tỉ số phần trăm hoặc giá trị % của một số.', icon: <Percent size={24} />, color: 'bg-red-500' },
  { id: 'stats_game', title: 'Nhà Thống kê Tài ba', description: 'Phân tích số liệu thống kê và tỉ lệ biểu đồ.', icon: <BarChart3 size={24} />, color: 'bg-cyan-600' },
];

interface GameProblem {
  question: string;
  answer: number;
  options: number[];
  unit: string;
}

const GamePanel: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentProblem, setCurrentProblem] = useState<GameProblem | null>(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const generateProblem = useCallback((type: GameType) => {
    let question = '';
    let ans = 0;
    let unit = '';

    const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch (type) {
      case 'tri_area':
        const b = r(4, 20);
        const h = r(4, 15);
        question = `Đáy = ${b}cm, Cao = ${h}cm. Diện tích?`;
        ans = (b * h) / 2;
        unit = 'cm²';
        break;
      case 'trap_area':
        const b1 = r(10, 20);
        const b2 = r(4, 8);
        const th = r(4, 10);
        question = `Đáy lớn = ${b1}cm, Đáy bé = ${b2}cm, Cao = ${th}cm. S?`;
        ans = ((b1 + b2) * th) / 2;
        unit = 'cm²';
        break;
      case 'circle_area':
        const radius = r(2, 10);
        const isArea = Math.random() > 0.5;
        if (isArea) {
          question = `Bán kính r = ${radius}cm. Diện tích? (π=3,14)`;
          ans = Number((radius * radius * 3.14).toFixed(2));
        } else {
          question = `Bán kính r = ${radius}cm. Chu vi? (π=3,14)`;
          ans = Number((radius * 2 * 3.14).toFixed(2));
        }
        unit = 'cm²';
        break;
      case 'rect_sxq':
        const l = r(5, 15);
        const w = r(4, 10);
        const rh = r(5, 12);
        question = `Dài = ${l}cm, Rộng = ${w}cm, Cao = ${rh}cm. Sxq?`;
        ans = 2 * (l + w) * rh;
        unit = 'cm²';
        break;
      case 'cube_stp':
        const edge = r(3, 10);
        question = `Cạnh = ${edge}cm. Diện tích toàn phần?`;
        ans = edge * edge * 6;
        unit = 'cm²';
        break;
      case 'volume':
        const vl = r(4, 10);
        const vw = r(3, 8);
        const vh = r(4, 10);
        question = `Dài = ${vl}cm, Rộng = ${vw}cm, Cao = ${vh}cm. Thể tích?`;
        ans = vl * vw * vh;
        unit = 'cm³';
        break;
      case 'velocity':
        const s = r(20, 200);
        const t = [1, 2, 4, 5, 10][r(0, 4)];
        question = `Quãng đường = ${s}km, Thời gian = ${t}h. Vận tốc?`;
        ans = s / t;
        unit = 'km/h';
        break;
      case 'distance':
        const v = r(30, 60);
        const dt = r(2, 5);
        question = `Vận tốc = ${v}km/h, Thời gian = ${dt}h. Quãng đường?`;
        ans = v * dt;
        unit = 'km';
        break;
      case 'time':
        const ts = r(60, 300);
        const tv = [30, 40, 50, 60][r(0, 3)];
        question = `Quãng đường = ${ts}km, Vận tốc = ${tv}km/h. Thời gian?`;
        ans = ts / tv;
        unit = 'giờ';
        break;
      case 'relative_motion':
        const v1 = r(40, 60);
        const v2 = r(30, 45);
        const dist = r(10, 50);
        const isSameDirection = Math.random() > 0.5;
        if (isSameDirection) {
          question = `V1=${v1}km/h, V2=${v2}km/h (cùng chiều). Hiệu vận tốc?`;
          ans = v1 - v2;
        } else {
          question = `V1=${v1}km/h, V2=${v2}km/h (ngược chiều). Tổng vận tốc?`;
          ans = v1 + v2;
        }
        unit = 'km/h';
        break;

      case 'units_convert':
        const uType = r(1, 4);
        if (uType === 1) {
          const kmVal = r(2, 9);
          question = `${kmVal} km = ? mét (m)`;
          ans = kmVal * 1000;
          unit = 'm';
        } else if (uType === 2) {
          const tanVal = r(2, 8);
          question = `${tanVal} tấn = ? ki-lô-gam (kg)`;
          ans = tanVal * 1000;
          unit = 'kg';
        } else if (uType === 3) {
          const haVal = r(1, 6);
          question = `${haVal} ha = ? mét vuông (m²)`;
          ans = haVal * 10000;
          unit = 'm²';
        } else {
          const m3Val = r(2, 7);
          question = `${m3Val} m³ = ? đề-xi-mét khối (dm³ / lít)`;
          ans = m3Val * 1000;
          unit = 'dm³';
        }
        break;

      case 'sum_diff_game':
        const sSmall = r(10, 30);
        const sDiff = r(4, 16);
        const sSum = sSmall * 2 + sDiff;
        const findLarger = Math.random() > 0.5;
        if (findLarger) {
          question = `Tổng = ${sSum}, Hiệu = ${sDiff}. Tìm SỐ LỚN?`;
          ans = (sSum + sDiff) / 2;
        } else {
          question = `Tổng = ${sSum}, Hiệu = ${sDiff}. Tìm SỐ BÉ?`;
          ans = (sSum - sDiff) / 2;
        }
        unit = '';
        break;

      case 'ratio_game':
        const rParts = [{ n: 1, d: 2 }, { n: 2, d: 3 }, { n: 1, d: 3 }, { n: 3, d: 4 }, { n: 2, d: 5 }];
        const selPart = rParts[r(0, rParts.length - 1)];
        const partVal = r(4, 12);
        const rSum = (selPart.n + selPart.d) * partVal;
        question = `Tổng = ${rSum}, Tỉ số = ${selPart.n}/${selPart.d}. Tìm SỐ BÉ?`;
        ans = selPart.n * partVal;
        unit = '';
        break;

      case 'fraction_game':
        const fDens = [3, 4, 5, 6, 8, 10];
        const fDen = fDens[r(0, fDens.length - 1)];
        const fNum = r(1, fDen - 1);
        const fMultiplier = r(3, 10);
        const fTotal = fDen * fMultiplier;
        question = `Tìm ${fNum}/${fDen} của ${fTotal}?`;
        ans = fMultiplier * fNum;
        unit = '';
        break;

      case 'percentage_game':
        const pTypes = r(1, 2);
        if (pTypes === 1) {
          const pP = [10, 20, 25, 30, 50][r(0, 4)];
          const pB = [60, 80, 100, 120, 150, 200][r(0, 5)];
          question = `Tìm ${pP}% của số ${pB}?`;
          ans = (pB * pP) / 100;
        } else {
          const pB = [20, 25, 40, 50, 80][r(0, 4)];
          const pRate = [20, 25, 50, 75][r(0, 3)];
          const pA = (pB * pRate) / 100;
          question = `Tỉ số phần trăm của ${pA} và ${pB} là bao nhiêu %?`;
          ans = pRate;
        }
        unit = '';
        break;

      case 'stats_game':
        const totalStu = [40, 50, 60, 100, 200][r(0, 4)];
        const sportPct = [20, 25, 30, 40, 50][r(0, 4)];
        question = `Trường có ${totalStu} học sinh. CLB Bóng đá chiếm ${sportPct}%. Số học sinh tham gia CLB là?`;
        ans = (totalStu * sportPct) / 100;
        unit = 'học sinh';
        break;
    }

    const options = [ans];
    while (options.length < 4) {
      let wrong = 0;
      if (ans % 1 === 0) {
        const offset = r(-10, 10);
        wrong = ans + (offset === 0 ? 5 : offset);
      } else {
        const offset = r(-5, 5) * 0.5;
        wrong = Number((ans + (offset === 0 ? 1.5 : offset)).toFixed(2));
      }
      if (wrong > 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }

    setCurrentProblem({
      question,
      answer: ans,
      options: options.sort(() => Math.random() - 0.5),
      unit
    });
  }, []);

  const startGame = (type: GameType) => {
    setSelectedGame(type);
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(45);
    setLives(3);
    setGameOver(false);
    generateProblem(type);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver]);

  const handleAnswer = (selected: number) => {
    if (gameOver || !currentProblem || !selectedGame) return;

    if (selected === currentProblem.answer) {
      setScore(prev => prev + 10);
      generateProblem(selectedGame);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399']
      });
    } else {
      setLives(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
      generateProblem(selectedGame);
    }
  };

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
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Đấu Trường Trò Chơi Toán Học</h2>
          <p className="text-slate-500 font-semibold text-sm">Chọn một thử thách tính nhanh để rèn luyện phản xạ và tư duy hình học!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl mx-auto w-full pb-16">
          {GAMES.map((game, idx) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => startGame(game.id)}
              className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all text-left flex items-start gap-4 relative overflow-hidden"
            >
              <div className={`${game.color} p-3.5 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                {game.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-slate-800 text-base leading-tight mb-1">{game.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">{game.description}</p>
              </div>
              <div className="absolute right-3.5 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-sky-500" size={18} />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="fixed bottom-4 right-6 z-20 pointer-events-auto hidden md:block">
          <MascotCompanion 
            message="Chúc em đạt điểm số kỷ lục trong trò chơi nhé!" 
          />
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-indigo-100 p-8 rounded-full mb-6"
        >
          <Trophy size={100} className="text-indigo-600" />
        </motion.div>
        <h2 className="text-5xl font-black text-slate-800 mb-2">HOÀN THÀNH!</h2>
        <p className="text-xl text-slate-500 mb-8 font-bold">
          Điểm số của bạn trong <span className="text-indigo-600">"{GAMES.find(g => g.id === selectedGame)?.title}"</span> là:
        </p>
        <div className="text-7xl font-black text-orange-600 mb-12 drop-shadow-lg">{score}</div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-black shadow-sm hover:bg-slate-200 transition-all"
          >
            QUAY LẠI MENU
          </button>
          <button
            onClick={() => selectedGame && startGame(selectedGame)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all"
          >
            <RotateCcw size={20} />
            CHƠI LẠI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Game Header */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsPlaying(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <RotateCcw size={20} className="rotate-180" />
          </button>
          <div>
            <h3 className="font-black text-xl tracking-tight">{GAMES.find(g => g.id === selectedGame)?.title}</h3>
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={16} 
                  className={i < lives ? "text-red-500 fill-red-500" : "text-white/20"} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Thời gian</p>
            <div className="flex items-center gap-2 text-2xl font-black text-orange-400">
              <Timer size={20} />
              {timeLeft}s
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Điểm số</p>
            <p className="text-3xl font-black text-emerald-400">{score}</p>
          </div>
        </div>
      </div>

      {/* Game Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-8 gap-12 rotate-12 scale-150">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="text-slate-900"><Star size={40} /></div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentProblem && (
            <motion.div
              key={currentProblem.question}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="w-full max-w-4xl flex flex-col items-center gap-12 z-10"
            >
              <div className="bg-slate-50 p-10 rounded-[3rem] border-4 border-slate-100 shadow-inner text-center w-full">
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                  {currentProblem.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentProblem.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt)}
                    className="group bg-white border-4 border-slate-100 p-8 rounded-[2rem] text-4xl font-black text-slate-700 shadow-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-4"
                  >
                    {opt.toLocaleString('vi-VN')}
                    <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-400">{currentProblem.unit}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePanel;
