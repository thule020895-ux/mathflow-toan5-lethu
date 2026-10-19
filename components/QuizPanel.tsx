import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy,
  HelpCircle,
  Lightbulb,
  Shapes,
  Square,
  RectangleHorizontal,
  Triangle as TriangleIcon,
  Circle as CircleIcon,
  Box,
  Car,
  ChevronLeft,
  LayoutGrid,
  Scale,
  Split,
  Percent,
  BarChart3,
  Dices,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotCompanion from './MascotCompanion';

type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

interface Question {
  id: number;
  topic: string;
  subTopic?: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Topic {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'geom' | 'motion_algebra' | 'ratio_stats';
  categoryLabel: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

const TOPICS: Topic[] = [
  // 1. NHÓM HÌNH HỌC & ĐO LƯỜNG (XANH LÁ CÂY - EMERALD)
  { 
    id: 'flat_shapes', 
    title: 'Hình phẳng', 
    icon: <Shapes size={24} />, 
    category: 'geom',
    categoryLabel: 'Hình học & Đo lường',
    color: 'bg-emerald-600', 
    borderColor: 'border-emerald-400 hover:border-emerald-600',
    badgeBg: 'bg-emerald-50 border border-emerald-200',
    badgeText: 'text-emerald-800',
    description: 'Chu vi & diện tích: Hình vuông, chữ nhật, tam giác, hình thang và hình tròn' 
  },
  { 
    id: 'shapes3d', 
    title: 'Hình khối', 
    icon: <Box size={24} />, 
    category: 'geom',
    categoryLabel: 'Hình học & Đo lường',
    color: 'bg-emerald-600', 
    borderColor: 'border-emerald-400 hover:border-emerald-600',
    badgeBg: 'bg-emerald-50 border border-emerald-200',
    badgeText: 'text-emerald-800',
    description: 'Hình hộp chữ nhật & Hình lập phương: Diện tích xung quanh, toàn phần & thể tích' 
  },
  { 
    id: 'units', 
    title: 'Đổi đơn vị đo', 
    icon: <Scale size={24} />, 
    category: 'geom',
    categoryLabel: 'Hình học & Đo lường',
    color: 'bg-emerald-600', 
    borderColor: 'border-emerald-400 hover:border-emerald-600',
    badgeBg: 'bg-emerald-50 border border-emerald-200',
    badgeText: 'text-emerald-800',
    description: 'Bảng đơn vị đo độ dài, diện tích, khối lượng và thể tích (dm³, cm³, m³)' 
  },

  // 2. NHÓM CHUYỂN ĐỘNG & ĐẠI SỐ (XANH DƯƠNG - BLUE)
  { 
    id: 'motion', 
    title: 'Chuyển động đều', 
    icon: <Car size={24} />, 
    category: 'motion_algebra',
    categoryLabel: 'Chuyển động & Đại số',
    color: 'bg-blue-600', 
    borderColor: 'border-blue-400 hover:border-blue-600',
    badgeBg: 'bg-blue-50 border border-blue-200',
    badgeText: 'text-blue-800',
    description: 'Công thức v - s - t, bài toán hai xe đi ngược chiều và cùng chiều' 
  },
  { 
    id: 'sum_diff', 
    title: 'Tổng và Hiệu', 
    icon: <Scale size={24} />, 
    category: 'motion_algebra',
    categoryLabel: 'Chuyển động & Đại số',
    color: 'bg-blue-600', 
    borderColor: 'border-blue-400 hover:border-blue-600',
    badgeBg: 'bg-blue-50 border border-blue-200',
    badgeText: 'text-blue-800',
    description: 'Tìm hai số khi biết Tổng và Hiệu: Số lớn = (Tổng + Hiệu) : 2' 
  },
  { 
    id: 'ratio', 
    title: 'Tổng/Hiệu - Tỉ', 
    icon: <Split size={24} />, 
    category: 'motion_algebra',
    categoryLabel: 'Chuyển động & Đại số',
    color: 'bg-blue-600', 
    borderColor: 'border-blue-400 hover:border-blue-600',
    badgeBg: 'bg-blue-50 border border-blue-200',
    badgeText: 'text-blue-800',
    description: 'Tìm hai số khi biết Tổng (hoặc Hiệu) và Tỉ số qua sơ đồ đoạn thẳng' 
  },

  // 3. NHÓM TỈ SỐ, PHẦN TRĂM & THỐNG KÊ (CAM HỔ PHÁCH - AMBER)
  { 
    id: 'fraction', 
    title: 'Phân số của một số', 
    icon: <Sparkles size={24} />, 
    category: 'ratio_stats',
    categoryLabel: 'Tỉ số & Thống kê',
    color: 'bg-amber-600', 
    borderColor: 'border-amber-400 hover:border-amber-600',
    badgeBg: 'bg-amber-50 border border-amber-200',
    badgeText: 'text-amber-900',
    description: 'Tìm giá trị phân số của một số và tìm một số khi biết phân số của nó' 
  },
  { 
    id: 'percentage', 
    title: 'Tỉ số phần trăm', 
    icon: <Percent size={24} />, 
    category: 'ratio_stats',
    categoryLabel: 'Tỉ số & Thống kê',
    color: 'bg-amber-600', 
    borderColor: 'border-amber-400 hover:border-amber-600',
    badgeBg: 'bg-amber-50 border border-amber-200',
    badgeText: 'text-amber-900',
    description: '3 bài toán cơ bản: Tìm tỉ số phần trăm, tìm % của một số, tìm số ban đầu' 
  },
  { 
    id: 'prob_stats', 
    title: 'Xác suất & Thống kê', 
    icon: <BarChart3 size={24} />, 
    category: 'ratio_stats',
    categoryLabel: 'Tỉ số & Thống kê',
    color: 'bg-amber-600', 
    borderColor: 'border-amber-400 hover:border-amber-600',
    badgeBg: 'bg-amber-50 border border-amber-200',
    badgeText: 'text-amber-900',
    description: 'Phân tích bảng số liệu, biểu đồ hình quạt tròn và khả năng xảy ra biến cố' 
  },
];

const allQuestions: Question[] = [
  // ================= CHUYÊN ĐỀ HÌNH PHẲNG (Vuông, Chữ nhật, Tam giác, Hình thang, Hình tròn) =================
  // 1. Hình vuông
  {
    id: 101, topic: 'flat_shapes', subTopic: 'Hình vuông', difficulty: 'Dễ',
    text: 'Một hình vuông có cạnh 5cm. Chu vi của hình vuông đó là:',
    options: ['10 cm', '20 cm', '25 cm', '15 cm'],
    correctAnswer: 1,
    explanation: 'Chu vi hình vuông = Cạnh × 4 = 5 × 4 = 20 cm.'
  },
  {
    id: 102, topic: 'flat_shapes', subTopic: 'Hình vuông', difficulty: 'Trung bình',
    text: 'Diện tích của một hình vuông là 36 cm². Cạnh của hình vuông đó là:',
    options: ['4 cm', '9 cm', '6 cm', '12 cm'],
    correctAnswer: 2,
    explanation: 'Vì 6 × 6 = 36 nên cạnh hình vuông là 6 cm.'
  },
  {
    id: 103, topic: 'flat_shapes', subTopic: 'Hình vuông', difficulty: 'Khó',
    text: 'Nếu tăng cạnh của một hình vuông lên gấp đôi thì diện tích của nó tăng lên gấp mấy lần?',
    options: ['2 lần', '4 lần', '8 lần', '16 lần'],
    correctAnswer: 1,
    explanation: 'Diện tích mới = (Cạnh × 2) × (Cạnh × 2) = (Cạnh × Cạnh) × 4 = Diện tích cũ × 4.'
  },

  // 2. Hình chữ nhật
  {
    id: 201, topic: 'flat_shapes', subTopic: 'Hình chữ nhật', difficulty: 'Dễ',
    text: 'Hình chữ nhật có chiều dài 8cm, chiều rộng 5cm. Diện tích là:',
    options: ['13 cm²', '40 cm²', '26 cm²', '30 cm²'],
    correctAnswer: 1,
    explanation: 'Diện tích hình chữ nhật = Dài × Rộng = 8 × 5 = 40 cm².'
  },
  {
    id: 202, topic: 'flat_shapes', subTopic: 'Hình chữ nhật', difficulty: 'Trung bình',
    text: 'Một hình chữ nhật có chu vi 24cm, chiều dài 8cm. Chiều rộng của nó là:',
    options: ['4 cm', '16 cm', '8 cm', '12 cm'],
    correctAnswer: 0,
    explanation: 'Nửa chu vi = 24 : 2 = 12 cm. Chiều rộng = 12 - 8 = 4 cm.'
  },
  {
    id: 203, topic: 'flat_shapes', subTopic: 'Hình chữ nhật', difficulty: 'Khó',
    text: 'Một hình chữ nhật có chiều dài gấp 3 lần chiều rộng và diện tích là 48 cm². Chu vi hình chữ nhật đó là:',
    options: ['24 cm', '32 cm', '40 cm', '28 cm'],
    correctAnswer: 1,
    explanation: 'Gọi chiều rộng là a, chiều dài là 3a. Diện tích = a × 3a = 3a² = 48 => a² = 16 => a = 4. Chiều dài = 12. Chu vi = (12 + 4) × 2 = 32 cm.'
  },

  // 3. Hình tam giác
  {
    id: 301, topic: 'flat_shapes', subTopic: 'Hình tam giác', difficulty: 'Dễ',
    text: 'Diện tích hình tam giác có đáy 10cm và chiều cao 6cm là:',
    options: ['60 cm²', '30 cm²', '16 cm²', '20 cm²'],
    correctAnswer: 1,
    explanation: 'Diện tích tam giác = (Đáy × Cao) : 2 = (10 × 6) : 2 = 30 cm².'
  },
  {
    id: 302, topic: 'flat_shapes', subTopic: 'Hình tam giác', difficulty: 'Trung bình',
    text: 'Một hình tam giác có diện tích 20 cm², chiều cao 5cm. Độ dài đáy của nó là:',
    options: ['4 cm', '8 cm', '10 cm', '5 cm'],
    correctAnswer: 1,
    explanation: 'Đáy = (Diện tích × 2) : Chiều cao = (20 × 2) : 5 = 8 cm.'
  },
  {
    id: 303, topic: 'flat_shapes', subTopic: 'Hình tam giác', difficulty: 'Khó',
    text: 'Một hình tam giác vuông có hai cạnh góc vuông lần lượt là 3cm và 4cm. Diện tích hình tam giác đó là:',
    options: ['12 cm²', '7 cm²', '6 cm²', '5 cm²'],
    correctAnswer: 2,
    explanation: 'Diện tích tam giác vuông = Tích hai cạnh góc vuông : 2 = (3 × 4) : 2 = 6 cm².'
  },

  // 4. Hình thang
  {
    id: 501, topic: 'flat_shapes', subTopic: 'Hình thang', difficulty: 'Dễ',
    text: 'Diện tích hình thang có đáy lớn 10cm, đáy bé 6cm và chiều cao 5cm là:',
    options: ['80 cm²', '40 cm²', '50 cm²', '30 cm²'],
    correctAnswer: 1,
    explanation: 'Diện tích = (Đáy lớn + Đáy bé) × Cao : 2 = (10 + 6) × 5 : 2 = 40 cm².'
  },
  {
    id: 502, topic: 'flat_shapes', subTopic: 'Hình thang', difficulty: 'Trung bình',
    text: 'Một hình thang có diện tích 60 cm², trung bình cộng hai đáy là 12cm. Chiều cao của hình thang là:',
    options: ['5 cm', '10 cm', '6 cm', '8 cm'],
    correctAnswer: 0,
    explanation: 'Diện tích = Trung bình cộng hai đáy × Chiều cao => Chiều cao = 60 : 12 = 5 cm.'
  },
  {
    id: 503, topic: 'flat_shapes', subTopic: 'Hình thang', difficulty: 'Khó',
    text: 'Một thửa ruộng hình thang có đáy lớn 120m, đáy bé bằng 2/3 đáy lớn và chiều cao bằng 75m. Diện tích thửa ruộng đó là:',
    options: ['7500 m²', '15000 m²', '9000 m²', '6500 m²'],
    correctAnswer: 0,
    explanation: 'Đáy bé = 120 × 2/3 = 80 m. Diện tích = (120 + 80) × 75 : 2 = 200 × 75 : 2 = 7500 m².'
  },

  // 5. Hình tròn
  {
    id: 401, topic: 'flat_shapes', subTopic: 'Hình tròn', difficulty: 'Dễ',
    text: 'Chu vi hình tròn có đường kính 10cm là:',
    options: ['31,4 cm', '62,8 cm', '15,7 cm', '314 cm'],
    correctAnswer: 0,
    explanation: 'Chu vi = Đường kính × 3,14 = 10 × 3,14 = 31,4 cm.'
  },
  {
    id: 402, topic: 'flat_shapes', subTopic: 'Hình tròn', difficulty: 'Trung bình',
    text: 'Diện tích hình tròn có bán kính 2cm là:',
    options: ['6,28 cm²', '12,56 cm²', '4 cm²', '12 cm²'],
    correctAnswer: 1,
    explanation: 'Diện tích = Bán kính × Bán kính × 3,14 = 2 × 2 × 3,14 = 12,56 cm².'
  },
  {
    id: 403, topic: 'flat_shapes', subTopic: 'Hình tròn', difficulty: 'Khó',
    text: 'Nếu chu vi hình tròn là 18,84 cm thì bán kính của nó là:',
    options: ['3 cm', '6 cm', '2 cm', '4 cm'],
    correctAnswer: 0,
    explanation: 'Bán kính = Chu vi : 3,14 : 2 = 18,84 : 3,14 : 2 = 3 cm.'
  },

  // Hình khối
  {
    id: 601, topic: 'shapes3d', difficulty: 'Dễ',
    text: 'Thể tích hình lập phương có cạnh 2cm là:',
    options: ['4 cm³', '8 cm³', '12 cm³', '6 cm³'],
    correctAnswer: 1,
    explanation: 'Thể tích = Cạnh × Cạnh × Cạnh = 2 × 2 × 2 = 8 cm³.'
  },
  {
    id: 602, topic: 'shapes3d', difficulty: 'Trung bình',
    text: 'Diện tích xung quanh của hình hộp chữ nhật có dài 5cm, rộng 3cm, cao 2cm là:',
    options: ['32 cm²', '16 cm²', '30 cm²', '60 cm²'],
    correctAnswer: 0,
    explanation: 'Sxq = (Dài + Rộng) × 2 × Cao = (5 + 3) × 2 × 2 = 32 cm².'
  },

  // Chuyển động đều
  {
    id: 701, topic: 'motion', difficulty: 'Dễ',
    text: 'Một người đi xe đạp với vận tốc 15 km/giờ trong 2 giờ. Quãng đường đi được là:',
    options: ['7,5 km', '30 km', '17 km', '20 km'],
    correctAnswer: 1,
    explanation: 'Quãng đường = Vận tốc × Thời gian = 15 × 2 = 30 km.'
  },
  {
    id: 702, topic: 'motion', difficulty: 'Trung bình',
    text: 'Một ô tô đi quãng đường 120km hết 2 giờ 30 phút. Vận tốc của ô tô là:',
    options: ['60 km/giờ', '48 km/giờ', '50 km/giờ', '55 km/giờ'],
    correctAnswer: 1,
    explanation: '2 giờ 30 phút = 2,5 giờ. Vận tốc = 120 : 2,5 = 48 km/giờ.'
  },
  {
    id: 703, topic: 'motion', difficulty: 'Khó',
    text: 'Hai xe khởi hành cùng lúc từ A và B cách nhau 120km, đi ngược chiều nhau. Xe 1 đi từ A với v=50km/h, xe 2 đi từ B với v=30km/h. Sau bao lâu hai xe gặp nhau?',
    options: ['1,5 giờ', '2 giờ', '3 giờ', '4 giờ'],
    correctAnswer: 0,
    explanation: 'Thời gian gặp nhau = Khoảng cách : Tổng vận tốc = 120 : (50 + 30) = 120 : 80 = 1,5 giờ.'
  },

  // Đổi đơn vị đo
  {
    id: 801, topic: 'units', difficulty: 'Dễ',
    text: '3,5 km đổi ra mét (m) bằng bao nhiêu?',
    options: ['350 m', '3500 m', '35000 m', '35 m'],
    correctAnswer: 1,
    explanation: '1 km = 1000 m nên 3,5 km = 3,5 × 1000 = 3500 m.'
  },
  {
    id: 802, topic: 'units', difficulty: 'Trung bình',
    text: '2,4 tấn bằng bao nhiêu ki-lô-gam (kg)?',
    options: ['240 kg', '2400 kg', '24000 kg', '24 kg'],
    correctAnswer: 1,
    explanation: '1 tấn = 1000 kg nên 2,4 tấn = 2,4 × 1000 = 2400 kg.'
  },
  {
    id: 803, topic: 'units', difficulty: 'Khó',
    text: 'Một thửa ruộng có diện tích 0,5 ha. Diện tích thửa ruộng đó theo mét vuông (m²) là:',
    options: ['50 m²', '500 m²', '5000 m²', '50000 m²'],
    correctAnswer: 2,
    explanation: '1 ha = 10 000 m² nên 0,5 ha = 0,5 × 10 000 = 5000 m².'
  },

  // Tổng và Hiệu
  {
    id: 901, topic: 'sum_diff', difficulty: 'Dễ',
    text: 'Tổng của hai số là 70, hiệu của hai số là 20. Số lớn là:',
    options: ['45', '50', '40', '25'],
    correctAnswer: 0,
    explanation: 'Số lớn = (Tổng + Hiệu) : 2 = (70 + 20) : 2 = 90 : 2 = 45.'
  },
  {
    id: 902, topic: 'sum_diff', difficulty: 'Trung bình',
    text: 'Hai anh em có tất cả 48 viên bi. Anh có nhiều hơn em 12 viên. Hỏi em có bao nhiêu viên bi?',
    options: ['30 viên', '18 viên', '20 viên', '36 viên'],
    correctAnswer: 1,
    explanation: 'Số bi của em (số bé) = (48 - 12) : 2 = 36 : 2 = 18 viên bi.'
  },
  {
    id: 903, topic: 'sum_diff', difficulty: 'Khó',
    text: 'Một hình chữ nhật có chu vi 80m. Chiều dài hơn chiều rộng 10m. Diện tích hình chữ nhật đó là:',
    options: ['375 m²', '400 m²', '300 m²', '450 m²'],
    correctAnswer: 0,
    explanation: 'Nửa chu vi (Tổng) = 80 : 2 = 40m. Chiều dài = (40 + 10) : 2 = 25m. Chiều rộng = 25 - 10 = 15m. Diện tích = 25 × 15 = 375 m².'
  },

  // Tổng (Hiệu) - Tỉ
  {
    id: 1001, topic: 'ratio', difficulty: 'Dễ',
    text: 'Tổng hai số là 60. Tỉ số của hai số là 2/3. Số bé là:',
    options: ['20', '24', '36', '30'],
    correctAnswer: 1,
    explanation: 'Tổng số phần bằng nhau = 2 + 3 = 5 phần. Số bé = (60 : 5) × 2 = 24.'
  },
  {
    id: 1002, topic: 'ratio', difficulty: 'Trung bình',
    text: 'Hiệu hai số là 30. Tỉ số của hai số là 2/5. Số lớn là:',
    options: ['50', '20', '60', '40'],
    correctAnswer: 0,
    explanation: 'Hiệu số phần bằng nhau = 5 - 2 = 3 phần. Giá trị 1 phần = 30 : 3 = 10. Số lớn = 10 × 5 = 50.'
  },
  {
    id: 1003, topic: 'ratio', difficulty: 'Khó',
    text: 'Lớp 5A có số học sinh nam bằng 3/4 số học sinh nữ. Biết số học sinh nữ nhiều hơn số học sinh nam là 5 bạn. Tổng số học sinh lớp 5A là:',
    options: ['30 bạn', '35 bạn', '40 bạn', '25 bạn'],
    correctAnswer: 1,
    explanation: 'Hiệu số phần = 4 - 3 = 1 phần. 1 phần = 5 bạn. Tổng số phần = 3 + 4 = 7 phần. Tổng số học sinh = 5 × 7 = 35 bạn.'
  },

  // Tìm phân số của một số
  {
    id: 1101, topic: 'fraction', difficulty: 'Dễ',
    text: '3/5 của 45 là bao nhiêu?',
    options: ['25', '27', '18', '30'],
    correctAnswer: 1,
    explanation: '3/5 của 45 = (45 : 5) × 3 = 9 × 3 = 27.'
  },
  {
    id: 1102, topic: 'fraction', difficulty: 'Trung bình',
    text: 'Một bao gạo nặng 60kg. Người ta đã bán đi 2/3 số gạo đó. Hỏi trong bao còn lại bao nhiêu kg gạo?',
    options: ['40 kg', '20 kg', '30 kg', '15 kg'],
    correctAnswer: 1,
    explanation: 'Số gạo đã bán = 60 × 2/3 = 40 kg. Số gạo còn lại = 60 - 40 = 20 kg (hoặc 60 × 1/3 = 20 kg).'
  },
  {
    id: 1103, topic: 'fraction', difficulty: 'Khó',
    text: 'Một mảnh đất hình vuông có cạnh 24m. Người ta dành 3/8 diện tích để làm vườn hoa. Diện tích vườn hoa là:',
    options: ['216 m²', '144 m²', '288 m²', '192 m²'],
    correctAnswer: 0,
    explanation: 'Diện tích mảnh đất = 24 × 24 = 576 m². Diện tích vườn hoa = 576 × 3/8 = 216 m².'
  },

  // Tỉ số phần trăm
  {
    id: 1201, topic: 'percentage', difficulty: 'Dễ',
    text: 'Tỉ số phần trăm của 15 và 60 là:',
    options: ['20%', '25%', '30%', '15%'],
    correctAnswer: 1,
    explanation: '15 : 60 = 0,25 = 25%.'
  },
  {
    id: 1202, topic: 'percentage', difficulty: 'Trung bình',
    text: '20% của 150 là bao nhiêu?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    explanation: '20% của 150 = 150 × 20 : 100 = 30.'
  },
  {
    id: 1203, topic: 'percentage', difficulty: 'Khó',
    text: 'Tìm một số biết 30% của số đó bằng 72:',
    options: ['216', '240', '210', '250'],
    correctAnswer: 1,
    explanation: 'Số cần tìm = 72 : 30 × 100 = 240.'
  },

  // Xác suất & Thống kê
  {
    id: 1301, topic: 'prob_stats', difficulty: 'Dễ',
    text: 'Một hộp có 3 quả bóng xanh và 1 quả bóng đỏ. Bạn Nam nhắm mắt lấy ra 1 quả bóng. Biến cố "Nam lấy được quả bóng màu vàng" là biến cố:',
    options: ['Chắc chắn xảy ra', 'Có thể xảy ra', 'Không thể xảy ra', 'Xác suất 50%'],
    correctAnswer: 2,
    explanation: 'Vì trong hộp chỉ có bóng xanh và bóng đỏ, không có bóng vàng nên biến cố này "Không thể xảy ra".'
  },
  {
    id: 1302, topic: 'prob_stats', difficulty: 'Trung bình',
    text: 'Quay một vòng quay chia thành 4 phần bằng nhau gồm 4 màu Đỏ, Xanh, Vàng, Trắng. Xác suất kim chỉ vào ô màu Đỏ là:',
    options: ['20%', '25% (1/4)', '50% (1/2)', '75%'],
    correctAnswer: 1,
    explanation: 'Vòng quay có 4 ô bằng nhau, ô màu đỏ chiếm 1 phần nên xác suất là 1/4 = 25%.'
  },
  {
    id: 1303, topic: 'prob_stats', difficulty: 'Khó',
    text: 'Biểu đồ quạt tròn biểu diễn sở thích thể thao của 200 học sinh. Môn Cầu lông chiếm 35%. Hỏi có bao nhiêu học sinh thích môn Cầu lông?',
    options: ['60 học sinh', '70 học sinh', '80 học sinh', '50 học sinh'],
    correctAnswer: 1,
    explanation: 'Số học sinh thích Cầu lông = 200 × 35 : 100 = 70 học sinh.'
  }
];

const QuizPanel: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'geom' | 'motion_algebra' | 'ratio_stats'>('all');
  const [selectedSubShape, setSelectedSubShape] = useState<string>('all');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const displayedTopics = selectedCategory === 'all'
    ? TOPICS
    : TOPICS.filter(t => t.category === selectedCategory);

  const filteredQuestions = selectedTopic 
    ? allQuestions.filter(q => {
        if (q.topic !== selectedTopic.id) return false;
        if (selectedTopic.id === 'flat_shapes' && selectedSubShape !== 'all') {
          return q.subTopic === selectedSubShape;
        }
        return true;
      })
    : [];

  const handleSelectSubShape = (sub: string) => {
    setSelectedSubShape(sub);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === filteredQuestions[currentQuestionIdx].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < filteredQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
      if (score >= filteredQuestions.length / 2) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const backToMenu = () => {
    setSelectedTopic(null);
    setSelectedSubShape('all');
    restartQuiz();
  };

  if (!selectedTopic) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-white min-h-[750px] relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Chuyên đề ôn luyện */}
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300">
              <Sparkles size={14} className="text-emerald-700" />
              <span>Hệ Thống Câu Hỏi Trắc Nghiệm Trực Quan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Luyện Tập Theo Chuyên Đề
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Lựa chọn chuyên đề toán trọng tâm dưới đây để rèn luyện kỹ năng và nâng cao tư duy giải toán.
            </p>
          </div>

          {/* Thanh lọc phân nhóm tách biệt rõ ràng (Tạo sự tách biệt) */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              Tất cả chuyên đề ({TOPICS.length})
            </button>
            <button 
              onClick={() => setSelectedCategory('geom')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCategory === 'geom'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
              }`}
            >
              Hình học & Đo lường (3)
            </button>
            <button 
              onClick={() => setSelectedCategory('motion_algebra')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCategory === 'motion_algebra'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-800 hover:bg-blue-50 border border-blue-300'
              }`}
            >
              Chuyển động & Đại số (3)
            </button>
            <button 
              onClick={() => setSelectedCategory('ratio_stats')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCategory === 'ratio_stats'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-300'
              }`}
            >
              Tỉ số & Thống kê (3)
            </button>
          </div>

          {/* Danh sách thẻ Chuyên đề: Nền trắng, viền phân màu theo nhóm, phân tách rõ ràng */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTopics.map((topic) => (
              <motion.button
                key={topic.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTopic(topic)}
                className={`bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border-2 ${topic.borderColor} text-left group transition-all flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-12 h-12 ${topic.color} text-white rounded-2xl flex items-center justify-center shadow-xs`}>
                      {topic.icon}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${topic.badgeBg} ${topic.badgeText}`}>
                      {topic.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {topic.description}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                  <span>Bắt đầu ôn luyện</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Banner giới thiệu lộ trình ôn tập: Nền trắng, khung viền xanh lá cây */}
          <div className="mt-10 bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
              <LayoutGrid size={28} />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
                Luyện tập có phương pháp - Tự tin đạt điểm cao
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Các câu hỏi trắc nghiệm được phân cấp từ Dễ đến Nâng cao, kèm lời giải chi tiết và gợi ý phương pháp sau mỗi câu trả lời.
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="p-4 sm:p-8 bg-white min-h-[750px] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl shadow-md p-6 sm:p-8 text-center border-2 border-emerald-500"
        >
          <div className="w-20 h-20 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Trophy className="text-amber-600" size={40} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Hoàn thành {selectedTopic.title}{selectedSubShape !== 'all' ? ` (${selectedSubShape})` : ''}!
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Bạn đã trả lời đúng <strong className="text-emerald-700 font-black">{score}/{filteredQuestions.length}</strong> câu hỏi.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <div className="text-2xl font-black text-emerald-800">
                {filteredQuestions.length > 0 ? Math.round((score/filteredQuestions.length)*100) : 0}%
              </div>
              <div className="text-xs font-bold text-emerald-700 uppercase">Độ chính xác</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <div className="text-2xl font-black text-blue-800">{score}</div>
              <div className="text-xs font-bold text-blue-700 uppercase">Điểm số</div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button 
              onClick={restartQuiz}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} /> Làm lại bài tập
            </button>
            <button 
              onClick={backToMenu}
              className="w-full py-3.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={18} /> Quay lại danh sách chuyên đề
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-emerald-500 max-w-xl mx-auto my-12 shadow-sm">
        <p className="text-slate-700 font-bold mb-4">Không tìm thấy câu hỏi phù hợp.</p>
        <button 
          onClick={backToMenu} 
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm cursor-pointer"
        >
          Quay lại danh sách chuyên đề
        </button>
      </div>
    );
  }

  const q = filteredQuestions[currentQuestionIdx];

  const subShapes = [
    { id: 'all', label: 'Tất cả các hình (15)' },
    { id: 'Hình vuông', label: 'Hình vuông (3)' },
    { id: 'Hình chữ nhật', label: 'Hình chữ nhật (3)' },
    { id: 'Hình tam giác', label: 'Hình tam giác (3)' },
    { id: 'Hình thang', label: 'Hình thang (3)' },
    { id: 'Hình tròn', label: 'Hình tròn (3)' }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-[750px] relative">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <button 
            onClick={backToMenu}
            className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-bold transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs cursor-pointer w-fit text-xs sm:text-sm"
          >
            <ChevronLeft size={18} /> Quay lại danh sách chuyên đề
          </button>
          
          {selectedTopic.id === 'flat_shapes' && (
            <span className="text-xs text-slate-500 font-medium">
              Chuyên đề gộp 5 dạng hình phẳng
            </span>
          )}
        </div>

        {/* Bộ lọc từng dạng hình phẳng nếu người học muốn luyện riêng từng hình */}
        {selectedTopic.id === 'flat_shapes' && (
          <div className="mb-6 p-2 bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-xs font-black text-emerald-900 shrink-0 px-2">Dạng hình:</span>
              {subShapes.map(sub => {
                const isActive = selectedSubShape === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubShape(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
              Câu hỏi {currentQuestionIdx + 1}/{filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-lg font-black text-slate-900">{selectedTopic.title}</span>
              {q.subTopic && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {q.subTopic}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                q.difficulty === 'Dễ' ? 'bg-emerald-600' : 
                q.difficulty === 'Trung bình' ? 'bg-amber-500' : 'bg-rose-500'
              }`}>
                {q.difficulty}
              </span>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIdx + 1) / filteredQuestions.length) * 100}%` }}
            className="h-full bg-emerald-600"
          />
        </div>
      </div>

      {/* Question Card: Nền trắng, viền xanh lá cây */}
      <motion.div 
        key={currentQuestionIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl shadow-sm border-2 border-emerald-500 overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
            {q.text}
          </h3>

          <div className="space-y-3">
            {q.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === q.correctAnswer;
              const isWrong = isSelected && !isCorrect;
              
              let bgColor = "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-800";
              if (selectedAnswer !== null) {
                if (isCorrect) bgColor = "bg-emerald-50 border-emerald-500 text-emerald-800";
                else if (isWrong) bgColor = "bg-rose-50 border-rose-500 text-rose-800";
                else bgColor = "bg-white border-slate-200 opacity-50 text-slate-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between cursor-pointer ${bgColor}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrect && <CheckCircle2 className="text-emerald-600 shrink-0" />}
                  {selectedAnswer !== null && isWrong && <XCircle className="text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-emerald-50/80 border-t-2 border-emerald-300 p-6 sm:p-8"
            >
              <div className="flex gap-3.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900 mb-1">Giải thích & Phương pháp:</h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
              
              <button 
                onClick={nextQuestion}
                className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>{currentQuestionIdx === filteredQuestions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

        {/* Quick Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-amber-300 flex gap-3 shadow-2xs">
            <HelpCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-900 font-medium">Đọc kỹ đề bài và các đơn vị đo lường trước khi chọn đáp án nhé!</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-300 flex gap-3 shadow-2xs">
            <Lightbulb className="text-emerald-600 shrink-0" size={20} />
            <p className="text-xs text-emerald-900 font-medium">Em có thể chuyển qua tab "Bảng Nháp" để tính toán trước khi chọn.</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-6 z-20 pointer-events-auto hidden md:block">
        <MascotCompanion 
          message="Bình tĩnh tính toán, em chắc chắn sẽ làm tốt!" 
        />
      </div>
    </div>
  );
};

export default QuizPanel;
