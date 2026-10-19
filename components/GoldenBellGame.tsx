
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Trophy, Timer, RotateCcw, Play, Heart, 
  CheckCircle2, XCircle, User, Star, ArrowRight,
  Zap, Award, Medal, Crown, List, LogIn, Info
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
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useFirebase } from './FirebaseProvider';

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
  authInfo: any;
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
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Question {
  id: string;
  type: 'multiple' | 'boolean' | 'fill';
  question: string;
  options?: string[];
  answer: string | boolean;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const QUESTION_SETS: Record<number, Question[]> = {
    1: [
        { id: '1-1', type: 'multiple', question: 'Chữ số 5 trong số 17,352 có giá trị là bao nhiêu?', options: ['5', '0,5', '0,05', '0,005'], answer: '0,05' },
        { id: '1-2', type: 'multiple', question: 'Số thập phân 4,08 được đọc như thế nào?', options: ['Bốn phẩy tám', 'Bốn phẩy không tám', 'Bốn phẩy tám mươi', 'Bốn không tám'], answer: 'Bốn phẩy không tám' },
        { id: '1-3', type: 'multiple', question: 'Phân số nào sau đây bằng 0,5?', options: ['1/4', '1/2', '2/3', '3/4'], answer: '1/2' },
        { id: '1-4', type: 'multiple', question: '1 km bằng bao nhiêu mét?', options: ['10 m', '100 m', '1000 m', '10000 m'], answer: '1000 m' },
        { id: '1-5', type: 'multiple', question: 'Hình nào dưới đây có bốn cạnh bằng nhau?', options: ['Hình chữ nhật', 'Hình vuông', 'Hình thang', 'Hình tam giác'], answer: 'Hình vuông' },
        { id: '1-6', type: 'multiple', question: '5 m² bằng bao nhiêu đề-xi-mét vuông?', options: ['50 dm²', '500 dm²', '5000 dm²', '50000 dm²'], answer: '500 dm²' },
        { id: '1-7', type: 'multiple', question: 'Hãy tính: 0,6 × 10 = ?', options: ['0,06', '6', '60', '0,6'], answer: '6' },
        { id: '1-8', type: 'multiple', question: '1 giờ 30 phút bằng bao nhiêu phút?', options: ['60 phút', '75 phút', '90 phút', '120 phút'], answer: '90 phút' },
        { id: '1-9', type: 'multiple', question: 'Trong các số sau, số nào lớn nhất?', options: ['3,45', '3,405', '3,54', '3,504'], answer: '3,54' },
        { id: '1-10', type: 'multiple', question: 'Kết quả của phép tính 25 × 8 là:', options: ['150', '200', '250', '300'], answer: '200' },
        { id: '1-11', type: 'multiple', question: 'Tính nhanh: 48 + 52 + 37 + 63 = ?', options: ['180', '190', '200', '210'], answer: '200' },
        { id: '1-12', type: 'multiple', question: '3/4 của 20 là bao nhiêu?', options: ['12', '14', '15', '16'], answer: '15' },
        { id: '1-13', type: 'multiple', question: 'Một hình chữ nhật có chiều dài 10 m và chiều rộng 5 m. Diện tích của nó là:', options: ['15 m²', '50 m²', '25 m²', '30 m²'], answer: '50 m²' },
        { id: '1-14', type: 'multiple', question: 'Số thập phân nào bằng với phân số 1/4?', options: ['0,1', '0,2', '0,25', '0,5'], answer: '0,25' },
        { id: '1-15', type: 'multiple', question: 'Hãy tính: 1,5 + 2,5 = ?', options: ['3,0', '3,5', '4,0', '4,5'], answer: '4,0' },
        { id: '1-16', type: 'multiple', question: 'Một lớp học có 30 học sinh, trong đó 1/3 là học sinh giỏi. Số học sinh giỏi là:', options: ['5', '10', '15', '20'], answer: '10' },
        { id: '1-17', type: 'multiple', question: 'Hình vuông có cạnh 5 cm thì chu vi là:', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answer: '20 cm' },
        { id: '1-18', type: 'multiple', question: '0,5 kg đường có giá 10 000 đồng. Vậy 1 kg đường giá bao nhiêu?', options: ['15 000 đồng', '20 000 đồng', '25 000 đồng', '30 000 đồng'], answer: '20 000 đồng' },
        { id: '1-19', type: 'multiple', question: 'Một xe máy đi với vận tốc 40 km/giờ. Trong 2 giờ xe máy đi được quãng đường là:', options: ['20 km', '60 km', '80 km', '100 km'], answer: '80 km' },
        { id: '1-20', type: 'multiple', question: 'Một mảnh đất hình chữ nhật có chiều dài 20 m, chiều rộng 10 m. Diện tích mảnh đất là:', options: ['30 m²', '100 m²', '200 m²', '300 m²'], answer: '200 m²' }
    ],
    2: [
        { id: '2-1', type: 'multiple', question: 'Chữ số 7 trong số 25,741 có giá trị là bao nhiêu?', options: ['7', '0,7', '0,07', '0,007'], answer: '0,7' },
        { id: '2-2', type: 'multiple', question: 'Số thập phân 0,05 được đọc là:', options: ['Không phẩy năm', 'Không phẩy không năm', 'Năm phần mười', 'Năm'], answer: 'Không phẩy không năm' },
        { id: '2-3', type: 'multiple', question: 'Phân số nào bằng 0,75?', options: ['1/2', '2/3', '3/4', '4/5'], answer: '3/4' },
        { id: '2-4', type: 'multiple', question: '1 tấn bằng bao nhiêu ki-lô-gam?', options: ['10 kg', '100 kg', '1000 kg', '10000 kg'], answer: '1000 kg' },
        { id: '2-5', type: 'multiple', question: 'Hình nào có 3 cạnh?', options: ['Hình vuông', 'Hình chữ nhật', 'Hình tam giác', 'Hình tròn'], answer: 'Hình tam giác' },
        { id: '2-6', type: 'multiple', question: '2 m² bằng bao nhiêu xăng-ti-mét vuông?', options: ['200 cm²', '2000 cm²', '20000 cm²', '200000 cm²'], answer: '20000 cm²' },
        { id: '2-7', type: 'multiple', question: 'Hãy tính: 1,2 × 10 = ?', options: ['0,12', '12', '120', '1,2'], answer: '12' },
        { id: '2-8', type: 'multiple', question: '2 giờ 15 phút bằng bao nhiêu phút?', options: ['120 phút', '135 phút', '150 phút', '165 phút'], answer: '135 phút' },
        { id: '2-9', type: 'multiple', question: 'Số nhỏ nhất trong các số sau là:', options: ['0,5', '0,05', '0,505', '0,055'], answer: '0,05' },
        { id: '2-10', type: 'multiple', question: 'Kết quả của phép tính 15 × 4 là:', options: ['40', '50', '60', '70'], answer: '60' },
        { id: '2-11', type: 'multiple', question: 'Tính: 125 + 75 + 50 = ?', options: ['200', '225', '250', '275'], answer: '250' },
        { id: '2-12', type: 'multiple', question: '2/5 của 50 là bao nhiêu?', options: ['10', '20', '25', '30'], answer: '20' },
        { id: '2-13', type: 'multiple', question: 'Một hình vuông có cạnh 4 m. Diện tích của nó là:', options: ['8 m²', '12 m²', '16 m²', '20 m²'], answer: '16 m²' },
        { id: '2-14', type: 'multiple', question: 'Số thập phân nào bằng 1/2?', options: ['0,2', '0,4', '0,5', '0,6'], answer: '0,5' },
        { id: '2-15', type: 'multiple', question: 'Hãy tính: 5,5 - 2,5 = ?', options: ['2,0', '2,5', '3,0', '3,5'], answer: '3,0' },
        { id: '2-16', type: 'multiple', question: 'Một lớp có 40 học sinh, 1/4 là học sinh giỏi. Số học sinh giỏi là:', options: ['5', '10', '15', '20'], answer: '10' },
        { id: '2-17', type: 'multiple', question: 'Hình chữ nhật có dài 6 cm, rộng 4 cm thì chu vi là:', options: ['10 cm', '20 cm', '24 cm', '28 cm'], answer: '20 cm' },
        { id: '2-18', type: 'multiple', question: 'Mua 2 kg gạo hết 30 000 đồng. Vậy 1 kg gạo giá bao nhiêu?', options: ['10 000 đồng', '15 000 đồng', '20 000 đồng', '25 000 đồng'], answer: '15 000 đồng' },
        { id: '2-19', type: 'multiple', question: 'Một người đi bộ với vận tốc 5 km/giờ. Trong 3 giờ người đó đi được:', options: ['10 km', '12 km', '15 km', '18 km'], answer: '15 km' },
        { id: '2-20', type: 'multiple', question: 'Một bể nước hình lập phương có cạnh 2 m. Thể tích bể là:', options: ['4 m³', '6 m³', '8 m³', '10 m³'], answer: '8 m³' }
    ],
    3: [
        { id: '3-1', type: 'multiple', question: 'Chữ số 9 trong số 12,349 có giá trị là bao nhiêu?', options: ['9', '0,9', '0,09', '0,009'], answer: '0,009' },
        { id: '3-2', type: 'multiple', question: 'Số thập phân 2,5 đọc là:', options: ['Hai phẩy năm', 'Hai phẩy không năm', 'Hai năm', 'Hai mươi lăm'], answer: 'Hai phẩy năm' },
        { id: '3-3', type: 'multiple', question: 'Phân số nào bằng 0,2?', options: ['1/2', '1/4', '1/5', '1/10'], answer: '1/5' },
        { id: '3-4', type: 'multiple', question: '1 mét bằng bao nhiêu xăng-ti-mét?', options: ['10 cm', '100 cm', '1000 cm', '10000 cm'], answer: '100 cm' },
        { id: '3-5', type: 'multiple', question: 'Hình nào có các cạnh đối diện song song và bằng nhau?', options: ['Hình tam giác', 'Hình thang', 'Hình chữ nhật', 'Hình tròn'], answer: 'Hình chữ nhật' },
        { id: '3-6', type: 'multiple', question: '3 dm² bằng bao nhiêu xăng-ti-mét vuông?', options: ['30 cm²', '300 cm²', '3000 cm²', '30000 cm²'], answer: '300 cm²' },
        { id: '3-7', type: 'multiple', question: 'Hãy tính: 0,45 × 100 = ?', options: ['4,5', '45', '450', '0,045'], answer: '45' },
        { id: '3-8', type: 'multiple', question: '1 ngày bằng bao nhiêu giờ?', options: ['12 giờ', '24 giờ', '36 giờ', '48 giờ'], answer: '24 giờ' },
        { id: '3-9', type: 'multiple', question: 'Số lớn nhất trong các số 0,9; 0,89; 0,91; 0,899 là:', options: ['0,9', '0,89', '0,91', '0,899'], answer: '0,91' },
        { id: '3-10', type: 'multiple', question: 'Kết quả của phép tính 12 × 5 là:', options: ['50', '55', '60', '65'], answer: '60' },
        { id: '3-11', type: 'multiple', question: 'Tính: 250 - 150 + 100 = ?', options: ['100', '150', '200', '250'], answer: '200' },
        { id: '3-12', type: 'multiple', question: '3/5 của 30 là bao nhiêu?', options: ['12', '15', '18', '21'], answer: '18' },
        { id: '3-13', type: 'multiple', question: 'Một hình chữ nhật có chiều dài 8 cm, chiều rộng 6 cm. Diện tích là:', options: ['14 cm²', '24 cm²', '28 cm²', '48 cm²'], answer: '48 cm²' },
        { id: '3-14', type: 'multiple', question: 'Số thập phân nào bằng 4/5?', options: ['0,4', '0,6', '0,8', '0,9'], answer: '0,8' },
        { id: '3-15', type: 'multiple', question: 'Hãy tính: 0,5 + 0,7 = ?', options: ['1,0', '1,1', '1,2', '1,3'], answer: '1,2' },
        { id: '3-16', type: 'multiple', question: 'Một lớp có 35 học sinh, 20% là học sinh giỏi. Số học sinh giỏi là:', options: ['5', '7', '9', '11'], answer: '7' },
        { id: '3-17', type: 'multiple', question: 'Hình vuông có chu vi 16 cm thì cạnh là:', options: ['2 cm', '4 cm', '6 cm', '8 cm'], answer: '4 cm' },
        { id: '3-18', type: 'multiple', question: 'Mua 5 quyển vở hết 25 000 đồng. Vậy 1 quyển vở giá bao nhiêu?', options: ['4 000 đồng', '5 000 đồng', '6 000 đồng', '7 000 đồng'], answer: '5 000 đồng' },
        { id: '3-19', type: 'multiple', question: 'Một ô tô đi với vận tốc 60 km/giờ. Trong 1,5 giờ ô tô đi được:', options: ['80 km', '90 km', '100 km', '120 km'], answer: '90 km' },
        { id: '3-20', type: 'multiple', question: 'Một thửa ruộng hình chữ nhật có chiều dài 15 m, chiều rộng 12 m. Biết rằng 1 m² thu được 2 kg lúa. Hỏi cả thửa ruộng thu được bao nhiêu ki-lô-gam lúa?', options: ['300 kg', '320 kg', '340 kg', '360 kg'], answer: '360 kg' }
    ],
    4: [
        { id: '4-1', type: 'multiple', question: 'Chữ số 3 trong số 8,734 có giá trị là bao nhiêu?', options: ['3', '0,3', '0,03', '0,003'], answer: '0,03' },
        { id: '4-2', type: 'multiple', question: 'Số 6,04 đọc là:', options: ['Sáu phẩy bốn', 'Sáu phẩy không bốn', 'Sáu phẩy bốn mươi', 'Sáu không bốn'], answer: 'Sáu phẩy không bốn' },
        { id: '4-3', type: 'multiple', question: 'Phân số nào bằng 0,2?', options: ['1/5', '1/2', '2/3', '3/4'], answer: '1/5' },
        { id: '4-4', type: 'multiple', question: '1 kg =', options: ['10 g', '100 g', '1000 g', '10000 g'], answer: '1000 g' },
        { id: '4-5', type: 'multiple', question: 'Hình có 2 cặp cạnh song song:', options: ['Hình chữ nhật', 'Hình tam giác', 'Hình thang', 'Hình tròn'], answer: 'Hình chữ nhật' },
        { id: '4-6', type: 'multiple', question: '9 m² =', options: ['90 dm²', '900 dm²', '9000 dm²', '90000 dm²'], answer: '900 dm²' },
        { id: '4-7', type: 'multiple', question: '0,7 × 10 =', options: ['0,07', '7', '70', '0,7'], answer: '7' },
        { id: '4-8', type: 'multiple', question: '2,5 giờ =', options: ['120 phút', '130 phút', '140 phút', '150 phút'], answer: '150 phút' },
        { id: '4-9', type: 'multiple', question: 'Số lớn nhất là:', options: ['6,35', '6,305', '6,53', '6,503'], answer: '6,53' },
        { id: '4-10', type: 'multiple', question: '25 × 12 =', options: ['250', '275', '300', '325'], answer: '300' },
        { id: '4-11', type: 'multiple', question: '25 + 75 + 48 + 52 =', options: ['180', '190', '200', '210'], answer: '200' },
        { id: '4-12', type: 'multiple', question: '4/5 của 20:', options: ['12', '14', '16', '18'], answer: '16' },
        { id: '4-13', type: 'multiple', question: 'Hình chữ nhật 10 m × 9 m:', options: ['80 m²', '90 m²', '100 m²', '110 m²'], answer: '90 m²' },
        { id: '4-14', type: 'multiple', question: '1,8 km =', options: ['180 m', '1800 m', '18000 m', '18 m'], answer: '1800 m' },
        { id: '4-15', type: 'multiple', question: '1,6 + 0,4 =', options: ['1,8', '2', '2,2', '2,4'], answer: '2' },
        { id: '4-16', type: 'multiple', question: 'Lớp 35 HS, 1/7 giỏi:', options: ['4', '5', '6', '7'], answer: '5' },
        { id: '4-17', type: 'multiple', question: 'Hình vuông diện tích 36 cm²:', options: ['5 cm', '6 cm', '7 cm', '8 cm'], answer: '6 cm' },
        { id: '4-18', type: 'multiple', question: '0,5 kg đường giá 12 000 đồng. 1 kg:', options: ['18 000', '20 000', '24 000', '25 000'], answer: '24 000' },
        { id: '4-19', type: 'multiple', question: 'Xe chạy 30 km/giờ trong 1,5 giờ:', options: ['40 km', '45 km', '50 km', '55 km'], answer: '45 km' },
        { id: '4-20', type: 'multiple', question: 'Mảnh đất 16 m × 10 m. 1 m² thu 2 kg rau:', options: ['280 kg', '300 kg', '320 kg', '340 kg'], answer: '320 kg' }
    ],
    5: [
        { id: '5-1', type: 'multiple', question: 'Chữ số 8 trong số 15,284:', options: ['8', '0,8', '0,08', '0,008'], answer: '0,08' },
        { id: '5-2', type: 'multiple', question: 'Số 9,02 đọc là:', options: ['Chín phẩy hai', 'Chín phẩy không hai', 'Chín phẩy hai mươi', 'Chín không hai'], answer: 'Chín phẩy không hai' },
        { id: '5-3', type: 'multiple', question: 'Phân số bằng 0,4:', options: ['2/5', '1/3', '3/4', '4/5'], answer: '2/5' },
        { id: '5-4', type: 'multiple', question: '1 ha =', options: ['100 m²', '1000 m²', '10000 m²', '100000 m²'], answer: '10000 m²' },
        { id: '5-5', type: 'multiple', question: 'Hình có 1 cặp cạnh song song:', options: ['Hình thang', 'Hình vuông', 'Hình chữ nhật', 'Hình tam giác'], answer: 'Hình thang' },
        { id: '5-6', type: 'multiple', question: '6 m² =', options: ['60 dm²', '600 dm²', '6000 dm²', '60000 dm²'], answer: '600 dm²' },
        { id: '5-7', type: 'multiple', question: '0,5 × 10 =', options: ['0,05', '5', '50', '0,5'], answer: '5' },
        { id: '5-8', type: 'multiple', question: '3 giờ =', options: ['120 phút', '150 phút', '180 phút', '200 phút'], answer: '180 phút' },
        { id: '5-9', type: 'multiple', question: 'Số lớn nhất:', options: ['7,45', '7,405', '7,54', '7,504'], answer: '7,54' },
        { id: '5-10', type: 'multiple', question: '25 × 16 =', options: ['300', '350', '400', '450'], answer: '400' },
        { id: '5-11', type: 'multiple', question: '35 + 65 + 27 + 73 =', options: ['180', '190', '200', '210'], answer: '200' },
        { id: '5-12', type: 'multiple', question: '2/3 của 18:', options: ['10', '11', '12', '13'], answer: '12' },
        { id: '5-13', type: 'multiple', question: 'Hình chữ nhật 12 m × 7 m:', options: ['70 m²', '80 m²', '84 m²', '90 m²'], answer: '84 m²' },
        { id: '5-14', type: 'multiple', question: '6,5 km =', options: ['650 m', '6500 m', '65000 m', '65 m'], answer: '6500 m' },
        { id: '5-15', type: 'multiple', question: '2,3 + 1,7 =', options: ['3', '4', '4,5', '5'], answer: '4' },
        { id: '5-16', type: 'multiple', question: 'Lớp 28 HS, 1/4 giỏi:', options: ['6', '7', '8', '9'], answer: '7' },
        { id: '5-17', type: 'multiple', question: 'Hình vuông diện tích 100 cm²:', options: ['8 cm', '9 cm', '10 cm', '11 cm'], answer: '10 cm' },
        { id: '5-18', type: 'multiple', question: '0,2 kg chè giá 10 000 đồng. 1 kg:', options: ['40 000', '45 000', '50 000', '60 000'], answer: '50 000' },
        { id: '5-19', type: 'multiple', question: 'Xe đi 50 km/giờ trong 1,2 giờ:', options: ['55 km', '60 km', '65 km', '70 km'], answer: '60 km' },
        { id: '5-20', type: 'multiple', question: 'Ruộng 20 m × 15 m. 1 m² thu 3 kg lúa:', options: ['800 kg', '850 kg', '900 kg', '950 kg'], answer: '900 kg' }
    ]
};

const GoldenBellGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'round_summary'>('start');
  const [playerName, setPlayerName] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { user } = useFirebase();
  
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({
    round1: [], round2: [], round3: [], round4: [], round5: []
  });

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribers = [1, 2, 3, 4, 5].map(round => {
      const q = query(
        collection(db, 'scores'),
        orderBy('score', 'desc'),
        limit(10)
      );
      
      return onSnapshot(q, (snapshot) => {
        const roundScores: Record<number, LeaderboardEntry[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        
        // Note: Firestore query above doesn't filter by round because we want a global top 10 or per round top 10.
        // The user wants per round leaderboards.
        // Let's refine the query to be per round.
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'scores');
      });
    });

    // Actually, let's just listen to all scores and filter locally for simplicity in this small app,
    // or better, create 5 listeners.
    
    const roundUnsubscribers = [1, 2, 3, 4, 5].map(roundNum => {
      const q = query(
        collection(db, 'scores'),
        // We can't easily filter by round AND order by score without composite index,
        // but for small data we can just get all and filter.
        // However, let's try to be efficient.
        orderBy('score', 'desc')
      );

      return onSnapshot(q, (snapshot) => {
        const allScores = snapshot.docs.map(doc => doc.data() as any);
        const roundData = allScores
          .filter(s => s.round === roundNum)
          .slice(0, 10)
          .map(s => ({
            name: s.name,
            score: s.score,
            date: s.date
          }));
        
        setLeaderboards(prev => ({
          ...prev,
          [`round${roundNum}`]: roundData
        }));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'scores');
      });
    });

    return () => roundUnsubscribers.forEach(unsub => unsub());
  }, [user]);

  const updateLeaderboard = async (round: number, name: string, score: number) => {
    if (!user) return;

    const studentName = name.trim() || 'Học sinh ẩn danh';
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const isoDate = new Date().toISOString();

    try {
      // Save Score
      await addDoc(collection(db, 'scores'), {
        name: studentName,
        score: score,
        round: round,
        date: dateStr,
        timestamp: serverTimestamp()
      });

      // Record Attendance
      // We use a slug of the name as ID for attendance to count plays per student name
      const studentId = studentName.toLowerCase().replace(/\s+/g, '_');
      const attendanceRef = doc(db, 'attendance', studentId);
      const attendanceDoc = await getDoc(attendanceRef);

      if (attendanceDoc.exists()) {
        await setDoc(attendanceRef, {
          name: studentName,
          count: increment(1),
          lastPlayed: isoDate
        }, { merge: true });
      } else {
        await setDoc(attendanceRef, {
          name: studentName,
          count: 1,
          lastPlayed: isoDate
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'scores/attendance');
    }
  };

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(err => {
      console.error("Login error:", err);
    });
  };

  const generateQuestions = useCallback((round: number) => {
    const set = QUESTION_SETS[round] || [];
    return set.map(q => ({
      ...q,
      options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : []
    }));
  }, []);

  const startNewGame = () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên của em trước khi bắt đầu!');
      return;
    }
    setRoundScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentQuestionIndex(0);
    setQuestions(generateQuestions(currentRound));
    setGameState('playing');
    setTimeLeft(20);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(20);
      setUserAnswer('');
      setShowFeedback(null);
    } else {
      updateLeaderboard(currentRound, playerName, roundScore);
      setGameState('round_summary');
    }
  }, [currentQuestionIndex, questions.length, currentRound, roundScore, playerName, leaderboards]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(null);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft, showFeedback]);

  const handleAnswer = (ans: any) => {
    if (showFeedback) return;

    const currentQ = questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQ.type === 'multiple' || currentQ.type === 'fill') {
      isCorrect = ans?.toString().trim() === currentQ.answer.toString();
    } else if (currentQ.type === 'boolean') {
      isCorrect = ans === currentQ.answer;
    }

    if (isCorrect) {
      setRoundScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      setShowFeedback('correct');
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setWrongCount(prev => prev + 1);
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const roundThemes: Record<number, any> = {
    1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'bg-blue-500' },
    2: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-500' },
    3: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', accent: 'bg-purple-500' },
    4: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', accent: 'bg-rose-500' },
    5: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', accent: 'bg-amber-500' }
  };

  const theme = roundThemes[currentRound] || roundThemes[1];

  return (
    <div className={`h-full flex flex-col ${theme.bg} math-grid-light overflow-hidden relative transition-colors duration-500`}>
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 custom-scrollbar overflow-y-auto"
          >
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border-4 border-amber-200 max-w-2xl w-full text-center card-shadow">
              <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Bell size={40} className="text-amber-600 animate-bounce" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-amber-800 mb-4 uppercase tracking-tighter">RUNG CHUÔNG VÀNG</h1>
              <p className="text-slate-600 mb-8 font-medium italic">Vượt qua 20 câu hỏi để trở thành trạng nguyên toán học!</p>
              
              <div className="mb-8 text-left">
                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Tên của em là gì?</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nhập tên tại đây..."
                    className="w-full bg-slate-100 border-4 border-transparent focus:border-amber-400 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-slate-700 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mb-8 text-left">
                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Chọn Mã đề:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setCurrentRound(r)}
                      className={`py-3 rounded-xl font-bold transition-all ${currentRound === r ? 'bg-amber-500 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      MÃ {r}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startNewGame}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-2xl text-2xl font-black shadow-xl shadow-amber-200 transition-all flex items-center justify-center gap-3 group"
              >
                BẮT ĐẦU CHƠI
                <Play fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
              </button>

              {!user && (
                <div className="mt-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
                  <p className="text-rose-700 font-bold mb-3 flex items-center justify-center gap-2">
                    <Info size={18} />
                    Vui lòng đăng nhập để lưu kết quả thi!
                  </p>
                  <button 
                    onClick={login}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all"
                  >
                    <LogIn size={18} /> Đăng nhập ngay
                  </button>
                </div>
              )}

              {leaderboards[`round${currentRound}`]?.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-black text-slate-800 uppercase mb-4 flex items-center justify-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    BẢNG VÀNG MÃ ĐỀ {currentRound}
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 max-h-48 overflow-y-auto border border-slate-100">
                    {leaderboards[`round${currentRound}`].map((entry, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-700">{entry.name}</span>
                        </div>
                        <span className="font-black text-amber-600">{entry.score} điểm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col z-10"
          >
            <div className={`bg-white p-4 border-b-4 ${theme.border} flex justify-between items-center shadow-md`}>
              <div className="flex items-center gap-4">
                <div className={`${theme.accent} text-white px-4 py-2 rounded-xl font-black text-sm shadow-lg`}>
                  MÃ ĐỀ {currentRound}
                </div>
                <div className="text-slate-400 font-bold text-sm">
                  Câu {currentQuestionIndex + 1}/20
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="font-black text-emerald-600">{correctCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="text-rose-500" size={20} />
                  <span className="font-black text-rose-600">{wrongCount}</span>
                </div>
                <div className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black shadow-xl">
                  {roundScore} ĐIỂM
                </div>
              </div>
            </div>

            <div className="h-2 bg-slate-100 w-full">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 20) * 100}%` }}
                className={`h-full ${timeLeft < 5 ? 'bg-rose-500' : theme.accent} transition-colors`}
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-4xl">
                <motion.div 
                  key={questions[currentQuestionIndex].id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`bg-white p-10 rounded-[3rem] shadow-xl border-4 ${theme.border} mb-8 text-center relative overflow-hidden`}
                >
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm ${showFeedback === 'correct' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`p-6 rounded-full bg-white shadow-2xl ${showFeedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}
                        >
                          {showFeedback === 'correct' ? <CheckCircle2 size={80} /> : <XCircle size={80} />}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                    {questions[currentQuestionIndex].question}
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestionIndex].type === 'multiple' && questions[currentQuestionIndex].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className={`bg-white hover:${theme.bg} border-4 border-white hover:${theme.border} p-6 rounded-2xl text-2xl font-black text-slate-700 shadow-lg transition-all text-center`}
                    >
                      {opt}
                    </button>
                  ))}

                  {questions[currentQuestionIndex].type === 'boolean' && (
                    <>
                      <button
                        onClick={() => handleAnswer(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-8 rounded-2xl text-3xl font-black shadow-lg transition-all"
                      >
                        ĐÚNG
                      </button>
                      <button
                        onClick={() => handleAnswer(false)}
                        className="bg-rose-500 hover:bg-rose-600 text-white p-8 rounded-2xl text-3xl font-black shadow-lg transition-all"
                      >
                        SAI
                      </button>
                    </>
                  )}

                  {questions[currentQuestionIndex].type === 'fill' && (
                    <div className="col-span-full flex flex-col items-center gap-4">
                      <input 
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Nhập kết quả..."
                        className={`w-full max-w-md bg-white border-4 ${theme.border} rounded-2xl py-6 px-8 text-4xl font-black text-center text-slate-700 outline-none shadow-xl`}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                      />
                      <button 
                        onClick={() => handleAnswer(userAnswer)}
                        className={`${theme.accent} text-white px-12 py-4 rounded-2xl text-xl font-black shadow-lg transition-all`}
                      >
                        GỬI ĐÁP ÁN
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'round_summary' && (
          <motion.div 
            key="round_summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 z-10"
          >
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-amber-400 max-w-2xl w-full text-center">
              <div className="relative inline-block mb-8">
                <Crown size={100} className="text-yellow-400 drop-shadow-lg" />
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tighter">KẾT THÚC MÃ ĐỀ {currentRound}!</h2>
              <p className="text-2xl text-amber-600 font-black mb-8 uppercase">{playerName}</p>
              
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] mb-12 shadow-2xl">
                <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Điểm số đạt được</p>
                <p className="text-7xl font-black text-yellow-400">{roundScore}</p>
                <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase">Số câu đúng</p>
                    <p className="text-2xl font-black text-emerald-400">{correctCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase">Số câu sai</p>
                    <p className="text-2xl font-black text-rose-400">{wrongCount}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={startNewGame}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} /> CHƠI LẠI
                </button>
                <button 
                  onClick={() => setGameState('start')}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl text-xl font-black shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  CHỌN MÃ KHÁC
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoldenBellGame;
