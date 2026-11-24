import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Trophy,
  Timer,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  User,
  Star,
  Crown,
  LogIn,
  Info,
  Scissors,
  GraduationCap,
  ShieldAlert,
  Camera,
  RefreshCw,
  Award,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useFirebase } from './FirebaseProvider';
import {
  GOLDEN_BELL_STAGES,
  STAGE_QUESTION_SETS,
  RESCUE_QUESTIONS,
  GoldenBellQuestion,
  RescueQuestion,
} from './goldenBellData';
import { GoldenBellIllustration } from './GoldenBellIllustrations';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

type QuestionOutcome = 'pending' | 'current' | 'correct' | 'rescued' | 'wrong';

function normalizeNumericAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '').replace(/\./g, ',');
}

function renderFormattedMathText(text: string): React.ReactNode {
  const parts = text.split(/(mm²|cm²|dm²|m²|km²|mm³|cm³|dm³|m³|km³|cm2|dm2|m2|km2|cm3|dm3|m3)/g);
  return parts.map((part, idx) => {
    if (/^(mm|cm|dm|m|km)[²2]$/.test(part)) {
      const unitBase = part.slice(0, -1);
      return (
        <React.Fragment key={idx}>
          {unitBase}
          <sup>2</sup>
        </React.Fragment>
      );
    }
    if (/^(mm|cm|dm|m|km)[³3]$/.test(part)) {
      const unitBase = part.slice(0, -1);
      return (
        <React.Fragment key={idx}>
          {unitBase}
          <sup>3</sup>
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function getAwardTitle(correctCount: number): {
  title: string;
  subtitle: string;
  sealText: string;
} {
  if (correctCount >= 19) {
    return {
      title: 'Trạng nguyên Nhí',
      subtitle: 'Xuất sắc rung vang Chuông Vàng Toán học lớp 5!',
      sealText: 'TRẠNG NGUYÊN',
    };
  }
  if (correctCount >= 16) {
    return {
      title: 'Bảng nhãn Xuất sắc',
      subtitle: 'Tư duy vững vàng, bản lĩnh chinh phục đỉnh cao!',
      sealText: 'BẢNG NHÃN',
    };
  }
  if (correctCount >= 12) {
    return {
      title: 'Thám hoa Tài năng',
      subtitle: 'Nền tảng kiến thức chắc chắn và tốc độ ấn tượng!',
      sealText: 'THÁM HOA',
    };
  }
  if (correctCount >= 8) {
    return {
      title: 'Tiến sĩ Chăm chỉ',
      subtitle: 'Tinh thần vượt khó đáng khen ngợi, hãy tiến xa hơn nữa!',
      sealText: 'TIẾN SĨ',
    };
  }
  return {
    title: 'Sĩ tử Triển vọng',
    subtitle: 'Khởi đầu tự tin trên hành trình chinh phục Toán lớp 5!',
    sealText: 'SĨ TỬ',
  };
}

function getQuestionTimeLimit(question?: GoldenBellQuestion): number {
  if (!question) return 40;
  if (question.timeLimit) return question.timeLimit;
  return 40;
}

const MILESTONES = [5, 10, 15, 20];

const GoldenBellGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'round_summary'>('start');
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [questions, setQuestions] = useState<GoldenBellQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<QuestionOutcome[]>(Array(20).fill('pending'));
  const [roundScore, setRoundScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [feedbackDetail, setFeedbackDetail] = useState<string>('');
  const [eliminatedAt, setEliminatedAt] = useState<number | null>(null);

  // 3 Quyền trợ giúp (mỗi quyền 1 lần / lượt chơi)
  const [used5050, setUsed5050] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [usedStar, setUsedStar] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [activeHintText, setActiveHintText] = useState<string | null>(null);
  const [starActiveForCurrent, setStarActiveForCurrent] = useState(false);

  // Cơ chế Câu hỏi Giải cứu (10 giây, tối đa 1 lần / lượt chơi)
  const [rescueUsed, setRescueUsed] = useState(false);
  const [rescueModalOpen, setRescueModalOpen] = useState(false);
  const [activeRescueQuestion, setActiveRescueQuestion] = useState<RescueQuestion | null>(null);
  const [rescueTimeLeft, setRescueTimeLeft] = useState(10);
  const [rescueResult, setRescueResult] = useState<'success' | 'fail' | null>(null);

  // Lưu ảnh Giấy chứng nhận
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const { user, openLoginModal } = useFirebase();

  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({
    round1: [],
    round2: [],
    round3: [],
    round4: [],
    round5: [],
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rescueTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStage = GOLDEN_BELL_STAGES.find((s) => s.id === currentRound) || GOLDEN_BELL_STAGES[0];
  const currentQ = questions[currentQuestionIndex];

  useEffect(() => {
    if (!user) return;

    const roundUnsubscribers = [1, 2, 3, 4, 5].map((roundNum) => {
      const q = query(collection(db, 'scores'), orderBy('score', 'desc'));

      return onSnapshot(
        q,
        (snapshot) => {
          const allScores = snapshot.docs.map((d) => d.data() as any);
          const roundData = allScores
            .filter((s) => s.round === roundNum)
            .slice(0, 10)
            .map((s) => ({
              name: s.name,
              score: s.score,
              date: s.date,
            }));

          setLeaderboards((prev) => ({
            ...prev,
            [`round${roundNum}`]: roundData,
          }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'scores');
        }
      );
    });

    return () => roundUnsubscribers.forEach((unsub) => unsub());
  }, [user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rescueTimerRef.current) clearInterval(rescueTimerRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const updateLeaderboard = useCallback(
    async (round: number, name: string, score: number) => {
      if (!user) return;

      const studentName = name.trim() || 'Học sinh ẩn danh';
      const dateStr = new Date().toLocaleDateString('vi-VN');
      const isoDate = new Date().toISOString();

      try {
        await addDoc(collection(db, 'scores'), {
          name: studentName,
          score,
          round,
          date: dateStr,
          timestamp: serverTimestamp(),
        });

        const studentId = studentName.toLowerCase().replace(/\s+/g, '_');
        const attendanceRef = doc(db, 'attendance', studentId);
        const attendanceDoc = await getDoc(attendanceRef);

        if (attendanceDoc.exists()) {
          await setDoc(
            attendanceRef,
            {
              name: studentName,
              count: increment(1),
              lastPlayed: isoDate,
            },
            { merge: true }
          );
        } else {
          await setDoc(attendanceRef, {
            name: studentName,
            count: 1,
            lastPlayed: isoDate,
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'scores/attendance');
      }
    },
    [user]
  );

  const generateQuestions = useCallback((round: number): GoldenBellQuestion[] => {
    const set = STAGE_QUESTION_SETS[round] || STAGE_QUESTION_SETS[1];
    return set.map((q) => ({
      ...q,
      options: q.options
        ? q.preserveOptionOrder
          ? [...q.options]
          : [...q.options].sort(() => Math.random() - 0.5)
        : undefined,
    }));
  }, []);

  const finishGame = useCallback(
    (finalScore: number, stoppedAtQuestion: number | null) => {
      setEliminatedAt(stoppedAtQuestion);
      updateLeaderboard(currentRound, playerName, finalScore);
      setGameState('round_summary');
      if (stoppedAtQuestion === null) {
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.55 },
        });
      }
    },
    [currentRound, playerName, updateLeaderboard]
  );

  const advanceToNextQuestion = useCallback(
    (latestScore: number) => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setTimeLeft(getQuestionTimeLimit(questions[nextIdx]));
        setUserAnswer('');
        setShowFeedback(null);
        setFeedbackDetail('');
        setHiddenOptions([]);
        setActiveHintText(null);
        setStarActiveForCurrent(false);
        setOutcomes((prev) => {
          const updated = [...prev];
          if (updated[nextIdx] === 'pending') updated[nextIdx] = 'current';
          return updated;
        });
      } else {
        finishGame(latestScore, null);
      }
    },
    [currentQuestionIndex, questions, finishGame]
  );

  const startNewGame = () => {
    if (!playerName.trim()) {
      setNameError('Vui lòng nhập tên của em trước khi bắt đầu!');
      return;
    }
    setNameError('');
    const builtQuestions = generateQuestions(currentRound);
    const initOutcomes: QuestionOutcome[] = Array(builtQuestions.length).fill('pending');
    initOutcomes[0] = 'current';

    setQuestions(builtQuestions);
    setOutcomes(initOutcomes);
    setRoundScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(getQuestionTimeLimit(builtQuestions[0]));
    setUserAnswer('');
    setShowFeedback(null);
    setFeedbackDetail('');
    setEliminatedAt(null);

    setUsed5050(false);
    setUsedHint(false);
    setUsedStar(false);
    setHiddenOptions([]);
    setActiveHintText(null);
    setStarActiveForCurrent(false);

    setRescueUsed(false);
    setRescueModalOpen(false);
    setActiveRescueQuestion(null);
    setRescueResult(null);
    setSaveNotice(null);

    setGameState('playing');
  };

  // Đồng hồ câu hỏi chính
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback || rescueModalOpen) return;
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswer(null);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft, showFeedback, rescueModalOpen]);

  // Đồng hồ Modal Câu hỏi Giải cứu (10 giây)
  useEffect(() => {
    if (!rescueModalOpen || rescueResult !== null) return;
    if (rescueTimeLeft > 0) {
      rescueTimerRef.current = setInterval(() => {
        setRescueTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (rescueTimeLeft === 0) {
      handleRescueAnswer(null);
    }
    return () => {
      if (rescueTimerRef.current) clearInterval(rescueTimerRef.current);
    };
  }, [rescueModalOpen, rescueTimeLeft, rescueResult]);

  const openRescueChallenge = () => {
    const picked = RESCUE_QUESTIONS[Math.floor(Math.random() * RESCUE_QUESTIONS.length)];
    const shuffled: RescueQuestion = {
      ...picked,
      options: [...picked.options].sort(() => Math.random() - 0.5),
    };
    setActiveRescueQuestion(shuffled);
    setRescueTimeLeft(10);
    setRescueResult(null);
    setRescueModalOpen(true);
  };

  const handleAnswer = (ans: string | boolean | null) => {
    if (showFeedback || rescueModalOpen || !currentQ) return;

    let isCorrect = false;
    if (currentQ.type === 'multiple') {
      isCorrect = ans !== null && ans.toString().trim() === currentQ.answer.toString().trim();
    } else if (currentQ.type === 'fill') {
      isCorrect =
        ans !== null &&
        normalizeNumericAnswer(ans.toString()) === normalizeNumericAnswer(currentQ.answer.toString());
    } else if (currentQ.type === 'boolean') {
      isCorrect = ans === currentQ.answer;
    }

    if (isCorrect) {
      const gained = starActiveForCurrent ? 20 : 10;
      const updatedScore = roundScore + gained;
      setRoundScore(updatedScore);
      setCorrectCount((prev) => prev + 1);
      setOutcomes((prev) => {
        const next = [...prev];
        next[currentQuestionIndex] = 'correct';
        return next;
      });
      setShowFeedback('correct');
      const bonusLabel = starActiveForCurrent
        ? `+${gained} điểm (Ngôi sao hy vọng nhân đôi!)`
        : `+${gained} điểm`;
      setFeedbackDetail(
        currentQ.explanation ? `${bonusLabel} · ${currentQ.explanation}` : bonusLabel
      );
      confetti({
        particleCount: starActiveForCurrent ? 70 : 35,
        spread: 70,
        origin: { y: 0.6 },
      });

      transitionTimeoutRef.current = setTimeout(() => {
        advanceToNextQuestion(updatedScore);
      }, currentQ.explanation ? 1900 : 1350);
    } else {
      setWrongCount((prev) => prev + 1);
      setOutcomes((prev) => {
        const next = [...prev];
        next[currentQuestionIndex] = 'wrong';
        return next;
      });

      if (!rescueUsed) {
        // Mở Câu hỏi Giải cứu 10 giây thay vì dừng ngay
        setShowFeedback('wrong');
        setFeedbackDetail('Chưa chính xác! Chuẩn bị mở Câu hỏi Giải cứu...');
        transitionTimeoutRef.current = setTimeout(() => {
          setShowFeedback(null);
          openRescueChallenge();
        }, 1100);
      } else {
        const rightText =
          currentQ.type === 'boolean'
            ? currentQ.answer
              ? 'Đúng'
              : 'Sai'
            : `${currentQ.answer}${currentQ.unit ? ` ${currentQ.unit}` : ''}`;
        setShowFeedback('wrong');
        setFeedbackDetail(
          currentQ.explanation
            ? `Đáp án đúng là: ${rightText}. ${currentQ.explanation}`
            : `Đáp án đúng là: ${rightText}`
        );
        transitionTimeoutRef.current = setTimeout(() => {
          finishGame(roundScore, currentQuestionIndex + 1);
        }, currentQ.explanation ? 2300 : 1600);
      }
    }
  };

  const handleRescueAnswer = (selected: string | null) => {
    if (!activeRescueQuestion || rescueResult !== null) return;
    const isSuccess = selected !== null && selected === activeRescueQuestion.answer;
    setRescueUsed(true);

    if (isSuccess) {
      setRescueResult('success');
      setOutcomes((prev) => {
        const next = [...prev];
        next[currentQuestionIndex] = 'rescued';
        return next;
      });
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.55 },
      });
      transitionTimeoutRef.current = setTimeout(() => {
        setRescueModalOpen(false);
        setRescueResult(null);
        advanceToNextQuestion(roundScore);
      }, 1300);
    } else {
      setRescueResult('fail');
      transitionTimeoutRef.current = setTimeout(() => {
        setRescueModalOpen(false);
        setRescueResult(null);
        finishGame(roundScore, currentQuestionIndex + 1);
      }, 1500);
    }
  };

  // Xử lý 3 Quyền trợ giúp
  const handleUse5050 = () => {
    if (used5050 || !currentQ || currentQ.type !== 'multiple' || !currentQ.options || showFeedback) return;
    const wrongChoices = currentQ.options.filter((opt) => opt !== currentQ.answer.toString());
    const pickedToHide = [...wrongChoices].sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(pickedToHide);
    setUsed5050(true);
  };

  const handleUseMathFlowHint = () => {
    if (usedHint || !currentQ || showFeedback) return;
    setActiveHintText(currentQ.hint);
    setUsedHint(true);
  };

  const handleUseHopeStar = () => {
    if (usedStar || starActiveForCurrent || showFeedback) return;
    setStarActiveForCurrent(true);
    setUsedStar(true);
  };

  // Tạo ảnh PNG Giấy chứng nhận Trạng nguyên Toán học
  const handleDownloadCertificate = () => {
    const award = getAwardTitle(correctCount);
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1060;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nền giấy kem ấm
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1060);
    bgGrad.addColorStop(0, '#FFFDF5');
    bgGrad.addColorStop(1, '#FEF7E0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1060);

    // Viền ngoài vàng kim
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 18;
    ctx.strokeRect(36, 36, 1528, 988);

    // Viền trong mảnh
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.strokeRect(64, 64, 1472, 932);

    // Hoa văn góc
    const drawCorner = (x: number, y: number, sx: number, sy: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sx, sy);
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 60);
      ctx.lineTo(0, 0);
      ctx.lineTo(60, 0);
      ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(16, 16, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(82, 82, 1, 1);
    drawCorner(1518, 82, -1, 1);
    drawCorner(82, 978, 1, -1);
    drawCorner(1518, 978, -1, -1);

    // Tiêu đề đầu
    ctx.fillStyle = '#B45309';
    ctx.font = '700 28px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MATHFLOW TOÁN 5 · ĐẤU TRƯỜNG RUNG CHUÔNG VÀNG', 800, 145);

    ctx.fillStyle = '#92400E';
    ctx.font = '800 54px Quicksand, sans-serif';
    ctx.fillText('GIẤY CHỨNG NHẬN', 800, 225);

    ctx.fillStyle = '#D97706';
    ctx.font = '800 34px Quicksand, sans-serif';
    ctx.fillText('TRẠNG NGUYÊN TOÁN HỌC', 800, 275);

    // Đường kẻ phân cách
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(460, 305);
    ctx.lineTo(1140, 305);
    ctx.stroke();

    // Trân trọng trao tặng
    ctx.fillStyle = '#475569';
    ctx.font = '600 26px Quicksand, sans-serif';
    ctx.fillText('Trân trọng vinh danh em học sinh:', 800, 368);

    // Tên học sinh
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 64px Quicksand, sans-serif';
    ctx.fillText((playerName.trim() || 'Học sinh').toUpperCase(), 800, 448);

    // Danh hiệu
    ctx.fillStyle = '#B45309';
    ctx.font = '800 38px Quicksand, sans-serif';
    ctx.fillText(`Danh hiệu: ${award.title}`, 800, 520);

    ctx.fillStyle = '#475569';
    ctx.font = '600 24px Quicksand, sans-serif';
    ctx.fillText(award.subtitle, 800, 566);

    // Khung thông số thành tích
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(190, 620, 1220, 175, 24);
    ctx.fill();
    ctx.stroke();

    const cols = [
      { label: 'CHẶNG THI ĐÃ THAM GIA', value: `${currentStage.shortTitle}: ${currentStage.title}`, x: 430 },
      { label: 'SỐ CÂU ĐÚNG', value: `${correctCount} / 20 câu`, x: 870 },
      { label: 'TỔNG ĐIỂM', value: `${roundScore} điểm`, x: 1200 },
    ];
    cols.forEach((c) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '700 18px Quicksand, sans-serif';
      ctx.fillText(c.label, c.x, 675);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 30px Quicksand, sans-serif';
      ctx.fillText(c.value, c.x, 735);
    });

    // Ngày tháng & Con dấu
    const dateStr = new Date().toLocaleDateString('vi-VN');
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '600 22px Quicksand, sans-serif';
    ctx.fillText(`Ngày chứng nhận: ${dateStr}`, 190, 890);
    ctx.fillStyle = '#92400E';
    ctx.font = '700 24px Quicksand, sans-serif';
    ctx.fillText('Hội đồng Đấu trường MathFlow', 190, 932);

    // Con dấu tròn đỏ vàng bên phải
    ctx.save();
    ctx.translate(1285, 895);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.font = '800 16px Quicksand, sans-serif';
    ctx.fillText('CHỨNG NHẬN', 0, -14);
    ctx.font = '800 20px Quicksand, sans-serif';
    ctx.fillText(award.sealText, 0, 14);
    ctx.font = '700 13px Quicksand, sans-serif';
    ctx.fillText('MATHFLOW TOÁN 5', 0, 38);
    ctx.restore();

    const link = document.createElement('a');
    link.download = `Giay_Chung_Nhan_${(playerName.trim() || 'Hoc_Sinh').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setSaveNotice('Đã tải Giấy chứng nhận thành tích về máy!');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const awardInfo = getAwardTitle(correctCount);
  const currentTimeLimit = getQuestionTimeLimit(currentQ);

  return (
    <div
      className={`h-full flex flex-col ${
        gameState === 'start' ? 'bg-[#F4FAF6]' : currentStage.themeBg
      } math-grid-light overflow-hidden relative transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        {/* MÀN HÌNH BẮT ĐẦU — Giữ nguyên giao diện tông vàng kim - kem ấm áp */}
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 custom-scrollbar overflow-y-auto"
          >
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border-4 border-amber-200 max-w-2xl w-full text-center card-shadow">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Bell size={34} className="text-amber-600" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-800 mb-2 uppercase tracking-tight">
                RUNG CHUÔNG VÀNG
              </h1>
              <p className="text-slate-600 mb-5 text-sm sm:text-base font-medium italic">
                Vượt qua 20 câu hỏi để trở thành trạng nguyên toán học!
              </p>

              {/* Ô nhập tên */}
              <div className="mb-5 text-left">
                <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Tên của em là gì?
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && startNewGame()}
                    placeholder="Nhập tên tại đây..."
                    className="w-full bg-slate-100 border-2 border-transparent focus:border-amber-400 rounded-2xl py-3.5 pl-11 pr-4 text-lg font-bold text-slate-700 outline-none transition-all"
                  />
                </div>
                {nameError && (
                  <p className="mt-1.5 ml-1 text-xs font-bold text-rose-600">{nameError}</p>
                )}
              </div>

              {/* 5 Chặng thi thực tế - gọn trên điện thoại */}
              <div className="mb-5 text-left">
                <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Chọn chặng chinh phục:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {GOLDEN_BELL_STAGES.map((stage, idx) => {
                    const isSelected = currentRound === stage.id;
                    const isFifth = idx === GOLDEN_BELL_STAGES.length - 1;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => setCurrentRound(stage.id)}
                        className={`px-2.5 py-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center min-h-[48px] ${
                          isFifth ? 'col-span-2 md:col-span-1' : ''
                        } ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                            : 'bg-slate-100 border-transparent text-slate-700 hover:bg-amber-50 hover:border-amber-200'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider leading-none mb-1 ${
                            isSelected ? 'text-amber-100' : 'text-amber-700'
                          }`}
                        >
                          {stage.shortTitle}
                        </span>
                        <span className="text-xs font-extrabold leading-tight">
                          {stage.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 ml-1 text-[11px] sm:text-xs font-semibold text-slate-500">
                  {currentStage.shortTitle}: {currentStage.title} · {currentStage.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={startNewGame}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl text-xl sm:text-2xl font-black shadow-xl shadow-amber-200 transition-all flex items-center justify-center gap-3 group"
              >
                BẮT ĐẦU CHƠI
                <Play fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
              </button>

              {!user && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                  <p className="text-rose-700 font-bold mb-3 flex items-center justify-center gap-2 text-sm">
                    <Info size={18} />
                    Đăng nhập để lưu điểm lên Bảng Vàng của lớp (vẫn chơi ngay được không cần đăng nhập)
                  </p>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all text-sm"
                  >
                    <LogIn size={17} /> Đăng nhập ngay
                  </button>
                </div>
              )}

              {leaderboards[`round${currentRound}`]?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-black text-slate-800 uppercase mb-4 flex items-center justify-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    Bảng vàng {currentStage.shortTitle}: {currentStage.title}
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 max-h-48 overflow-y-auto border border-slate-100">
                    {leaderboards[`round${currentRound}`].map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0 ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-700">{entry.name}</span>
                        </div>
                        <span className="font-black text-amber-600 tabular-nums">{entry.score} điểm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* MÀN HÌNH THI ĐẤU */}
        {gameState === 'playing' && currentQ && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col z-10 overflow-y-auto"
          >
            {/* Thanh thông tin trên cùng */}
            <div className={`bg-white px-4 py-3 border-b-2 ${currentStage.themeBorder} shadow-sm`}>
              <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setGameState('start')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                    title="Quay lại chọn chặng"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className={`${currentStage.themeAccent} text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs md:text-sm whitespace-nowrap shrink-0`}>
                    {currentStage.shortTitle}: {currentStage.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm truncate">
                    <User size={16} className="text-amber-600 shrink-0" />
                    <span className="truncate">{playerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-700 tabular-nums">
                    <CheckCircle2 className="text-emerald-500" size={18} />
                    <span>{correctCount} đúng</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <ShieldAlert size={16} className={rescueUsed ? 'text-slate-400' : 'text-amber-600'} />
                    <span>{rescueUsed ? 'Đã dùng giải cứu' : 'Còn 1 lần giải cứu'}</span>
                  </div>
                  <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-black text-sm md:text-base tabular-nums">
                    {roundScore} điểm
                  </div>
                </div>
              </div>

              {/* Thanh tiến trình 20 câu hỏi với 4 mốc quan trọng (Câu 5, 10, 15, 20) */}
              <div className="max-w-5xl mx-auto mt-3">
                <div className="grid grid-cols-10 md:grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
                  {outcomes.map((status, idx) => {
                    const qNum = idx + 1;
                    const isMilestone = MILESTONES.includes(qNum);
                    const isCurrent = idx === currentQuestionIndex;

                    let cellClass = 'bg-slate-100 text-slate-500 border-slate-200';
                    if (status === 'correct') cellClass = 'bg-emerald-500 text-white border-emerald-600';
                    else if (status === 'rescued') cellClass = 'bg-amber-400 text-amber-950 border-amber-500';
                    else if (status === 'wrong') cellClass = 'bg-rose-500 text-white border-rose-600';
                    else if (isCurrent) cellClass = 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300';
                    else if (isMilestone) cellClass = 'bg-amber-50 text-amber-700 border-amber-300';

                    return (
                      <div
                        key={qNum}
                        title={isMilestone ? `Mốc quan trọng: Câu ${qNum}` : `Câu ${qNum}`}
                        className={`h-7 rounded-lg border text-[11px] font-extrabold flex items-center justify-center tabular-nums transition-all ${cellClass}`}
                      >
                        {isMilestone && status === 'pending' && !isCurrent ? (
                          <span className="flex items-center gap-0.5">
                            {qNum}
                          </span>
                        ) : (
                          qNum
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-1 px-0.5">
                  <span>Câu {currentQuestionIndex + 1} / 20</span>
                  <span>Mốc quan trọng: Câu 5 · Câu 10 · Câu 15 · Câu 20</span>
                </div>
              </div>
            </div>

            {/* Thanh đồng hồ đếm ngược */}
            <div className="h-2.5 bg-slate-200 w-full shrink-0">
              <div
                style={{ width: `${(timeLeft / currentTimeLimit) * 100}%` }}
                className={`h-full transition-all duration-500 ${
                  timeLeft <= 5 ? 'bg-rose-500' : currentStage.themeAccent
                }`}
              />
            </div>

            {/* Khu vực câu hỏi chính */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
              <div className="w-full max-w-4xl">
                {/* Hàng trạng thái câu + đồng hồ + 3 quyền trợ giúp */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 text-sm font-extrabold text-slate-700">
                    <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
                      {currentQ.type === 'multiple' && 'Trắc nghiệm 4 lựa chọn'}
                      {currentQ.type === 'fill' && 'Bảng con tốc độ · Nhập số'}
                      {currentQ.type === 'boolean' && 'Phán đoán Đúng / Sai'}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-black tabular-nums ${
                        timeLeft <= 5
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <Timer size={16} /> {timeLeft} giây
                    </span>
                  </div>

                  {/* 3 Nút Quyền Trợ Giúp */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUse5050}
                      disabled={used5050 || currentQ.type !== 'multiple' || !!showFeedback}
                      className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        used5050 || currentQ.type !== 'multiple'
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50 shadow-xs'
                      }`}
                    >
                      <Scissors size={15} className="text-amber-600" />
                      50/50
                    </button>

                    <button
                      type="button"
                      onClick={handleUseMathFlowHint}
                      disabled={usedHint || !!showFeedback}
                      className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        usedHint
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-sky-300 hover:bg-sky-50 shadow-xs'
                      }`}
                    >
                      <GraduationCap size={16} className="text-sky-600" />
                      Hỏi Trợ lý MathFlow
                    </button>

                    <button
                      type="button"
                      onClick={handleUseHopeStar}
                      disabled={usedStar || starActiveForCurrent || !!showFeedback}
                      className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        starActiveForCurrent
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                          : usedStar
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50 shadow-xs'
                      }`}
                    >
                      <Star size={15} fill={starActiveForCurrent ? 'currentColor' : 'none'} className={starActiveForCurrent ? 'text-white' : 'text-amber-500'} />
                      {starActiveForCurrent ? 'Đang nhân đôi điểm' : 'Ngôi sao hy vọng'}
                    </button>
                  </div>
                </div>

                {/* Thẻ đề bài */}
                <motion.div
                  key={currentQ.id}
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 ${
                    starActiveForCurrent ? 'border-amber-400 ring-4 ring-amber-100' : currentStage.themeBorder
                  } mb-5 text-center relative overflow-hidden`}
                >
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm px-4 ${
                          showFeedback === 'correct' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                        }`}
                      >
                        <motion.div
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          className={`px-7 py-5 rounded-3xl bg-white shadow-2xl border-2 flex flex-col items-center gap-2 ${
                            showFeedback === 'correct'
                              ? 'border-emerald-300 text-emerald-600'
                              : 'border-rose-300 text-rose-600'
                          }`}
                        >
                          {showFeedback === 'correct' ? (
                            <CheckCircle2 size={56} />
                          ) : (
                            <XCircle size={56} />
                          )}
                          <p className="text-xl font-black">
                            {showFeedback === 'correct' ? 'Chính xác!' : 'Chưa đúng rồi!'}
                          </p>
                          {feedbackDetail && (
                            <p className="text-sm font-bold text-slate-700 max-w-lg leading-relaxed">
                              {renderFormattedMathText(feedbackDetail)}
                            </p>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-snug">
                    Câu {currentQuestionIndex + 1}: {renderFormattedMathText(currentQ.question)}
                  </h2>

                  {currentQ.svg && <GoldenBellIllustration spec={currentQ.svg} />}

                  {/* Gợi ý từ Trợ lý MathFlow (chỉ hiện khi bấm nút) */}
                  {activeHintText && (
                    <div className="mt-4 bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-left flex items-start gap-3">
                      <GraduationCap size={20} className="text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-extrabold text-sky-800 uppercase tracking-wide mb-0.5">
                          Gợi ý hướng tư duy từ Trợ lý MathFlow
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {renderFormattedMathText(activeHintText)}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Khu vực trả lời theo 3 định dạng */}
                {currentQ.type === 'multiple' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentQ.options?.map((opt, idx) => {
                      const isRemoved = hiddenOptions.includes(opt);
                      const letter = ['A', 'B', 'C', 'D'][idx];
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isRemoved || !!showFeedback}
                          onClick={() => handleAnswer(opt)}
                          className={`p-5 rounded-2xl border-2 text-lg md:text-xl font-extrabold transition-all flex items-center gap-4 text-left ${
                            isRemoved
                              ? 'bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed opacity-55'
                              : `bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/60 shadow-sm`
                          }`}
                        >
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                              isRemoved ? 'bg-slate-200 text-slate-400' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1">{renderFormattedMathText(opt)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'boolean' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      disabled={!!showFeedback}
                      onClick={() => handleAnswer(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-6 px-8 rounded-2xl text-2xl font-black shadow-md transition-all flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 size={28} />
                      ĐÚNG
                    </button>
                    <button
                      type="button"
                      disabled={!!showFeedback}
                      onClick={() => handleAnswer(false)}
                      className="bg-rose-600 hover:bg-rose-700 text-white py-6 px-8 rounded-2xl text-2xl font-black shadow-md transition-all flex items-center justify-center gap-3"
                    >
                      <XCircle size={28} />
                      SAI
                    </button>
                  </div>
                )}

                {currentQ.type === 'fill' && (
                  <div className="bg-slate-800 border-4 border-amber-700/70 rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                      Bảng con tốc độ · Viết nhanh kết quả của em
                    </p>
                    <div className="flex items-center justify-center gap-3 w-full max-w-md">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && userAnswer.trim()) handleAnswer(userAnswer);
                        }}
                        placeholder="Nhập số..."
                        autoFocus
                        className="flex-1 bg-white border-2 border-amber-300 rounded-2xl py-4 px-5 text-3xl font-black text-center text-slate-800 outline-none focus:ring-4 focus:ring-amber-300/50 tabular-nums"
                      />
                      {currentQ.unit && (
                        <span className="bg-amber-100 text-amber-900 px-4 py-4 rounded-2xl text-xl font-black whitespace-nowrap shrink-0">
                          {renderFormattedMathText(currentQ.unit)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={!userAnswer.trim() || !!showFeedback}
                      onClick={() => handleAnswer(userAnswer)}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white px-10 py-3.5 rounded-2xl text-lg font-black shadow-lg transition-all"
                    >
                      Giơ bảng chốt đáp án
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MÀN HÌNH VINH DANH & GIẤY CHỨNG NHẬN */}
        {gameState === 'round_summary' && (
          <motion.div
            key="round_summary"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 overflow-y-auto"
          >
            <div className="max-w-3xl w-full space-y-5">
              {/* Giấy chứng nhận Trạng nguyên Toán học */}
              <div className="bg-[#FFFDF5] rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl border-[6px] border-amber-400 relative overflow-hidden">
                <div className="border-2 border-amber-300 rounded-2xl p-5 sm:p-8 text-center relative">
                  {/* Hoa văn góc SVG */}
                  <svg className="w-7 h-7 text-amber-600 absolute top-2.5 left-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 12V2h10" />
                  </svg>
                  <svg className="w-7 h-7 text-amber-600 absolute top-2.5 right-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12V2H12" />
                  </svg>
                  <svg className="w-7 h-7 text-amber-600 absolute bottom-2.5 left-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 12v10h10" />
                  </svg>
                  <svg className="w-7 h-7 text-amber-600 absolute bottom-2.5 right-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12v10H12" />
                  </svg>

                  <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-3 text-amber-600">
                    <Crown size={36} />
                  </div>

                  <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                    MathFlow Toán 5 · Đấu trường Rung Chuông Vàng
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-900 mt-1 tracking-tight">
                    GIẤY CHỨNG NHẬN TRẠNG NGUYÊN TOÁN HỌC
                  </h2>

                  <div className="w-40 h-0.5 bg-amber-300 mx-auto my-4" />

                  <p className="text-sm font-semibold text-slate-600">Trân trọng chứng nhận em học sinh:</p>
                  <p className="text-2xl sm:text-4xl font-black text-slate-900 uppercase mt-1 mb-3">
                    {playerName || 'Học sinh'}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-5 py-2 rounded-xl font-black text-lg mb-2">
                    <Award size={22} className="text-amber-600" />
                    <span>Danh hiệu: {awardInfo.title}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-6">{awardInfo.subtitle}</p>

                  {/* Bảng 3 chỉ số chính trên Giấy chứng nhận */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-amber-200 rounded-2xl p-4 mb-5">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Chặng thi</p>
                      <p className="text-base font-black text-slate-800 mt-1">
                        {currentStage.shortTitle}: {currentStage.title}
                      </p>
                    </div>
                    <div className="sm:border-x border-amber-100 px-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Số câu đúng</p>
                      <p className="text-2xl font-black text-emerald-600 mt-0.5 tabular-nums">
                        {correctCount} / 20
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Tổng điểm đạt được</p>
                      <p className="text-2xl font-black text-amber-600 mt-0.5 tabular-nums">
                        {roundScore} điểm
                      </p>
                    </div>
                  </div>

                  {eliminatedAt !== null && (
                    <p className="text-xs font-bold text-rose-700 mb-4">
                      Hành trình tạm dừng tại Câu {eliminatedAt} · Hãy thử sức lại để chạm mốc Câu 20 nhé!
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-amber-200/80 text-left">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Ngày cấp: {new Date().toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm font-extrabold text-amber-900">Hội đồng Đấu trường MathFlow</p>
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-rose-600/80 flex flex-col items-center justify-center text-rose-700 font-black text-[10px] leading-tight rotate-[-8deg] bg-rose-50/60">
                      <span>CHỨNG NHẬN</span>
                      <span className="text-xs text-rose-600">{awardInfo.sealText}</span>
                      <span>TOÁN 5</span>
                    </div>
                  </div>
                </div>
              </div>

              {saveNotice && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-center text-sm font-extrabold">
                  {saveNotice}
                </div>
              )}

              {/* Các nút hành động */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-5 rounded-2xl text-base font-black shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={20} /> Lưu / Chụp thành tích
                </button>
                <button
                  type="button"
                  onClick={() => setGameState('start')}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-4 px-5 rounded-2xl text-base font-black shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Thử sức chặng khác
                </button>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-4 px-5 rounded-2xl text-base font-black transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={19} /> Thi lại chặng này
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CÂU HỎI GIẢI CỨU (10 GIÂY) */}
      <AnimatePresence>
        {rescueModalOpen && activeRescueQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="bg-white border-4 border-amber-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert size={34} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                Quyền Giải cứu Duy nhất · Thời gian 10 giây
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 mb-2">
                CÂU HỎI GIẢI CỨU TÍNH NHANH
              </h3>
              <p className="text-sm font-semibold text-slate-600 mb-4">
                Trả lời đúng câu hỏi này để được hồi sinh và tiếp tục chinh phục Chuông Vàng!
              </p>

              {/* Đồng hồ 10 giây */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-black text-lg tabular-nums">
                  <Timer size={18} /> {rescueTimeLeft} giây
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    style={{ width: `${(rescueTimeLeft / 10) * 100}%` }}
                    className="h-full bg-rose-500 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {renderFormattedMathText(activeRescueQuestion.question)}
                </p>
              </div>

              {rescueResult === null ? (
                <div className="grid grid-cols-2 gap-3">
                  {activeRescueQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRescueAnswer(opt)}
                      className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 py-4 px-3 rounded-2xl text-xl font-black text-slate-800 transition-all"
                    >
                      {renderFormattedMathText(opt)}
                    </button>
                  ))}
                </div>
              ) : rescueResult === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl p-4 font-black text-lg flex items-center justify-center gap-2">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                  Hồi sinh thành công! Tiến lên câu tiếp theo!
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl p-4 font-black text-base flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <XCircle size={22} className="text-rose-600" />
                    <span>Giải cứu chưa thành công!</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Đáp án đúng là: {renderFormattedMathText(activeRescueQuestion.answer)}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoldenBellGame;
