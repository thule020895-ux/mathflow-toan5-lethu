import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
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
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotCompanion from './MascotCompanion';

interface AdvancedQuestion {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  solution: string;
  svgType: 'triangle_ratio' | 'circle_square' | 'rect_change' | 'trapezoid_diag' | 'cube_paint' | 'circle_ring' | 'water_rise' | 'sequence_pattern' | 'sum_diff_ratio' | 'percentage_app' | 'motion_physics' | 'map_scale_diagram';
  svgData?: {
    labelA?: string;
    labelB?: string;
    labelC?: string;
    val1?: string;
    val2?: string;
  };
}

interface QuestionSet {
  id: string;
  title: string;
  badge: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
  questions: AdvancedQuestion[];
}

const QUESTION_SETS: QuestionSet[] = [
  {
    id: 'set-1',
    title: 'Đề 1: Đỉnh cao Tỉ số Diện tích Tam giác',
    badge: 'Hình tam giác',
    description: 'Chuyên đề kinh điển về tam giác chung chiều cao, đáy tăng giảm và tỉ số diện tích tam giác con.',
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-600',
    questions: [
      {
        id: 1,
        title: 'Kéo dài cạnh đáy tam giác',
        question: 'Một hình tam giác ABC có diện tích là 90 cm². Người ta kéo dài cạnh đáy BC thêm một đoạn CD = 4 cm thì diện tích tam giác tăng thêm 24 cm². Độ dài cạnh đáy BC ban đầu là bao nhiêu?',
        options: ['12 cm', '15 cm', '18 cm', '20 cm'],
        correctIndex: 1,
        hint: 'Hai tam giác ABC và ACD có chung chiều cao hạ từ đỉnh A xuống đường thẳng BD. Tỉ số diện tích bằng tỉ số hai cạnh đáy tương ứng.',
        solution: 'Chiều cao hạ từ đỉnh A xuống đáy BC là: 24 × 2 : 4 = 12 (cm). Độ dài cạnh đáy BC ban đầu là: 90 × 2 : 12 = 15 (cm). Hoặc: Đáy BC = 4 × (90 : 24) = 15 (cm).',
        svgType: 'triangle_ratio',
        svgData: { val1: 'S = 90 cm²', val2: '+24 cm² (CD = 4cm)' }
      },
      {
        id: 2,
        title: 'Tỉ số điểm trên cạnh tam giác',
        question: 'Cho tam giác ABC có diện tích 120 cm². Trên cạnh AC lấy điểm M sao cho AM = 1/3 AC. Trên cạnh BC lấy điểm N là trung điểm của BC. Diện tích tam giác CMN là bao nhiêu?',
        options: ['30 cm²', '40 cm²', '50 cm²', '60 cm²'],
        correctIndex: 1,
        hint: 'Vì AM = 1/3 AC nên MC = 2/3 AC. Nối A với N hoặc tính diện tích qua tam giác trung gian.',
        solution: 'Diện tích tam giác ABN = ANC = 1/2 × 120 = 60 cm² (vì chung đường cao từ A và đáy BN = NC). Tam giác CMN có chung đường cao hạ từ N xuống AC và đáy MC = 2/3 AC, nên S(CMN) = 2/3 × S(ANC) = 2/3 × 60 = 40 (cm²).',
        svgType: 'triangle_ratio',
        svgData: { val1: 'S(ABC) = 120 cm²', val2: 'MC = 2/3 AC' }
      },
      {
        id: 3,
        title: 'Hai chiều cùng tăng giảm',
        question: 'Một tam giác có cạnh đáy tăng 20%, đồng thời chiều cao tương ứng giảm 20%. Hỏi diện tích tam giác đó tăng hay giảm bao nhiêu phần trăm?',
        options: ['Không đổi', 'Tăng 4%', 'Giảm 4%', 'Giảm 2%'],
        correctIndex: 2,
        hint: 'Coi đáy ban đầu là 100%, chiều cao ban đầu là 100%. Tính tỉ số giữa diện tích mới và diện tích cũ.',
        solution: 'Đáy mới = 120% = 1,2 đáy cũ. Chiều cao mới = 80% = 0,8 chiều cao cũ. Diện tích mới = 1,2 × 0,8 = 0,96 = 96% diện tích cũ. Do đó diện tích giảm: 100% - 96% = 4%.',
        svgType: 'triangle_ratio',
        svgData: { val1: 'Đáy: +20%', val2: 'Cao: -20%' }
      },
      {
        id: 4,
        title: 'Trọng tâm và chia tam giác',
        question: 'Cho tam giác ABC có diện tích 60 cm². Lấy điểm M, N, P lần lượt là trung điểm của các cạnh BC, CA, AB. Diện tích tam giác MNP bằng bao nhiêu?',
        options: ['12 cm²', '15 cm²', '20 cm²', '30 cm²'],
        correctIndex: 1,
        hint: 'Ba điểm trung điểm của 3 cạnh tam giác chia tam giác lớn thành 4 hình tam giác nhỏ có diện tích bằng nhau.',
        solution: 'Khi nối ba trung điểm của ba cạnh tam giác, ta được 4 tam giác có diện tích hoàn toàn bằng nhau: APN, PBM, NMC và MNP. Do đó diện tích tam giác MNP = 60 : 4 = 15 (cm²).',
        svgType: 'triangle_ratio',
        svgData: { val1: '4 tam giác bằng nhau', val2: 'S = 60 : 4' }
      }
    ]
  },
  {
    id: 'set-2',
    title: 'Đề 2: Bí ẩn Hình tròn & Diện tích Phần tô màu',
    badge: 'Hình tròn',
    description: 'Bài toán tính diện tích phần tô màu giữa hình vuông, hình tròn nội tiếp và hình vành khăn.',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    questions: [
      {
        id: 5,
        title: 'Diện tích 4 góc ngoài hình tròn',
        question: 'Một hình vuông có cạnh 10 cm. Bên trong vẽ một hình tròn tiếp xúc với 4 cạnh của hình vuông (hình tròn nội tiếp). Diện tích phần hình vuông nằm ngoài hình tròn là bao nhiêu? (Lấy số pi = 3,14)',
        options: ['18,5 cm²', '21,5 cm²', '25,0 cm²', '28,5 cm²'],
        correctIndex: 1,
        hint: 'Đường kính hình tròn bằng cạnh hình vuông (d = 10 cm, r = 5 cm). Diện tích cần tìm = S(hình vuông) - S(hình tròn).',
        solution: 'Diện tích hình vuông là: 10 × 10 = 100 (cm²). Bán kính hình tròn là: 10 : 2 = 5 (cm). Diện tích hình tròn là: 5 × 5 × 3,14 = 78,5 (cm²). Diện tích phần nằm ngoài hình tròn là: 100 - 78,5 = 21,5 (cm²).',
        svgType: 'circle_square',
        svgData: { val1: 'Cạnh = 10cm', val2: 'r = 5cm' }
      },
      {
        id: 6,
        title: 'Hình vuông nội tiếp hình tròn',
        question: 'Một hình tròn có bán kính r = 6 cm. Một hình vuông có 4 đỉnh nằm trên đường tròn (hình vuông nội tiếp). Diện tích của hình vuông đó là bao nhiêu?',
        options: ['64 cm²', '72 cm²', '78,5 cm²', '84 cm²'],
        correctIndex: 1,
        hint: 'Đường chéo của hình vuông chính là đường kính của hình tròn (d = 2 × 6 = 12 cm). Diện tích hình vuông = (đường chéo × đường chéo) : 2.',
        solution: 'Đường kính hình tròn = 6 × 2 = 12 (cm), đây cũng là độ dài 2 đường chéo của hình vuông. Diện tích hình vuông tính theo 2 đường chéo vuông góc là: 12 × 12 : 2 = 72 (cm²).',
        svgType: 'circle_square',
        svgData: { val1: 'Đường chéo = 12cm', val2: 'S = d × d : 2' }
      },
      {
        id: 7,
        title: 'Diện tích hình vành khăn',
        question: 'Hai hình tròn đồng tâm O có bán kính lần lượt là R = 8 cm và r = 5 cm. Diện tích của hình vành khăn giới hạn bởi hai đường tròn là bao nhiêu? (Lấy pi = 3,14)',
        options: ['103,62 cm²', '112,45 cm²', '125,60 cm²', '145,20 cm²'],
        correctIndex: 0,
        hint: 'Diện tích hình vành khăn bằng diện tích hình tròn lớn trừ diện tích hình tròn bé: S = (R × R - r × r) × 3,14.',
        solution: 'S = (8 × 8 - 5 × 5) × 3,14 = (64 - 25) × 3,14 = 39 × 3,14 = 103,62 (cm²).',
        svgType: 'circle_ring',
        svgData: { val1: 'R = 8cm', val2: 'r = 5cm' }
      }
    ]
  },
  {
    id: 'set-3',
    title: 'Đề 3: Biến đổi Hình chữ nhật & Hình vuông',
    badge: 'Hình phẳng',
    description: 'Các bài toán tăng giảm chu vi, diện tích và tính ngược kích thước ban đầu.',
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
    questions: [
      {
        id: 8,
        title: 'Tăng chiều dài và chiều rộng',
        question: 'Một mảnh đất hình chữ nhật có chiều dài gấp 3 lần chiều rộng. Nếu tăng chiều rộng thêm 5 m và giảm chiều dài đi 5 m thì mảnh đất trở thành hình vuông. Diện tích mảnh đất ban đầu là bao nhiêu?',
        options: ['75 m²', '150 m²', '300 m²', '375 m²'],
        correctIndex: 0,
        hint: 'Khi giảm chiều dài 5m và tăng chiều rộng 5m thì chiều dài hơn chiều rộng là: 5 + 5 = 10 (m).',
        solution: 'Chiều dài hơn chiều rộng là: 5 + 5 = 10 (m). Chiều rộng là: 10 : (3 - 1) = 5 (m). Chiều dài là: 5 × 3 = 15 (m). Diện tích ban đầu là: 15 × 5 = 75 (m²).',
        svgType: 'rect_change',
        svgData: { val1: 'Dài = 3 × Rộng', val2: 'Dài - Rộng = 10m' }
      },
      {
        id: 9,
        title: 'Diện tích thay đổi theo tỉ lệ phần trăm',
        question: 'Nếu tăng chiều dài của một hình chữ nhật thêm 10% và tăng chiều rộng thêm 20% thì diện tích hình chữ nhật đó tăng thêm bao nhiêu phần trăm?',
        options: ['30%', '32%', '35%', '38%'],
        correctIndex: 1,
        hint: 'Coi chiều dài ban đầu là 100%, chiều rộng ban đầu là 100%. Tính tỉ số giữa diện tích mới và diện tích ban đầu.',
        solution: 'Chiều dài mới = 110% = 1,1. Chiều rộng mới = 120% = 1,2. Diện tích mới = 1,1 × 1,2 = 1,32 = 132% diện tích cũ. Diện tích tăng thêm: 132% - 100% = 32%.',
        svgType: 'rect_change',
        svgData: { val1: '+10% Dài', val2: '+20% Rộng' }
      }
    ]
  },
  {
    id: 'set-4',
    title: 'Đề 4: Đấu trường Hình thang & Đường chéo',
    badge: 'Hình thang',
    description: 'Tính chất đặc biệt về giao điểm hai đường chéo hình thang và tỉ số diện tích.',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-600',
    questions: [
      {
        id: 10,
        title: 'Hai tam giác cánh bướm bằng nhau',
        question: 'Cho hình thang ABCD có hai đáy AB và CD. Hai đường chéo AC và BD cắt nhau tại điểm O. Biết diện tích tam giác AOB là 9 cm² và diện tích tam giác BOC là 15 cm². Diện tích hình thang ABCD là bao nhiêu?',
        options: ['48 cm²', '64 cm²', '72 cm²', '80 cm²'],
        correctIndex: 1,
        hint: 'Trong hình thang có 2 tam giác ở hai cạnh bên luôn có diện tích bằng nhau: S(AOD) = S(BOC). Và S(AOB) × S(COD) = S(AOD) × S(BOC).',
        solution: 'Vì S(AOD) = S(BOC) = 15 cm². Ta có công thức tỉ lệ: S(AOB) × S(COD) = S(AOD) × S(BOC) ⇒ 9 × S(COD) = 15 × 15 = 225 ⇒ S(COD) = 225 : 9 = 25 cm². Diện tích hình thang ABCD = 9 + 15 + 15 + 25 = 64 (cm²).',
        svgType: 'trapezoid_diag',
        svgData: { val1: 'S(AOB) = 9', val2: 'S(BOC) = 15' }
      },
      {
        id: 11,
        title: 'Tỉ số hai đáy hình thang',
        question: 'Một hình thang ABCD có đáy bé AB = 12 cm, đáy lớn CD = 18 cm. Kéo dài đáy lớn CD thêm 6 cm về phía D thì diện tích tăng thêm 45 cm². Diện tích hình thang ABCD ban đầu là bao nhiêu?',
        options: ['180 cm²', '210 cm²', '225 cm²', '240 cm²'],
        correctIndex: 2,
        hint: 'Phần diện tích tăng thêm là một tam giác có đáy 6 cm và chiều cao đúng bằng chiều cao hình thang.',
        solution: 'Chiều cao hình thang là: 45 × 2 : 6 = 15 (cm). Diện tích hình thang ABCD là: (12 + 18) × 15 : 2 = 225 (cm²).',
        svgType: 'trapezoid_diag',
        svgData: { val1: 'AB=12, CD=18', val2: '+6cm -> +45cm²' }
      }
    ]
  },
  {
    id: 'set-5',
    title: 'Đề 5: Hình khối 3D & Thể tích nước dâng',
    badge: 'Hình khối',
    description: 'Khối lập phương sơn mặt và bài toán mực nước dâng khi thả vật thể vào bể.',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-600',
    questions: [
      {
        id: 12,
        title: 'Sơn các mặt khối lập phương',
        question: 'Người ta xếp các khối lập phương nhỏ cạnh 1 cm thành một khối lập phương lớn cạnh 5 cm, sau đó sơn toàn bộ 6 mặt ngoài của khối lớn. Hỏi có bao nhiêu khối lập phương nhỏ không được sơn mặt nào?',
        options: ['27 khối', '36 khối', '48 khối', '64 khối'],
        correctIndex: 0,
        hint: 'Các khối nhỏ không được sơn mặt nào tạo thành một khối lập phương nhỏ hơn ở bên trong, có cạnh bằng (5 - 2) = 3 cm.',
        solution: 'Các khối không sơn mặt nào nằm ở lõi bên trong: số khối theo chiều dài = 5 - 2 = 3; rộng = 3; cao = 3. Số khối không được sơn mặt nào là: 3 × 3 × 3 = 27 (khối).',
        svgType: 'cube_paint',
        svgData: { val1: 'Cạnh 5cm', val2: 'Lõi: (5-2)³ = 27' }
      },
      {
        id: 13,
        title: 'Mực nước dâng khi thả vật',
        question: 'Một bể kính hình hộp chữ nhật có đáy kích thước 40 cm × 30 cm đang chứa nước. Khi thả một hòn đá chìm hoàn toàn vào bể thì mực nước dâng cao thêm 2,5 cm. Thể tích của hòn đá đó là bao nhiêu?',
        options: ['2000 cm³', '2500 cm³', '3000 cm³', '3500 cm³'],
        correctIndex: 2,
        hint: 'Thể tích của hòn đá bằng đúng thể tích của cột nước dâng lên (Đáy bể 40cm × 30cm, chiều cao dâng 2,5cm).',
        solution: 'Thể tích hòn đá là: 40 × 30 × 2,5 = 3000 (cm³) = 3 dm³ = 3 lít.',
        svgType: 'water_rise',
        svgData: { val1: '40 × 30 cm', val2: 'Nước dâng +2,5 cm' }
      }
    ]
  },
  {
    id: 'set-6',
    title: 'Đề 6: Bí ẩn Quy luật Dãy số & Tìm Số hạng',
    badge: 'Quy luật dãy số',
    description: 'Chinh phục số hạng thứ n, tính tổng dãy số cách đều và bài toán đếm chữ số trang sách.',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    questions: [
      {
        id: 14,
        title: 'Tìm số hạng thứ n của dãy cách đều',
        question: 'Cho dãy số cách đều: 3, 7, 11, 15, 19, ... Hỏi số hạng thứ 50 của dãy số là số nào?',
        options: ['195', '199', '201', '203'],
        correctIndex: 1,
        hint: 'Công thức số hạng thứ n của dãy cách đều khoảng cách d: Số hạng thứ n = Số đầu + (n - 1) × d. Ở đây d = 4.',
        solution: 'Khoảng cách giữa hai số liên tiếp là: 7 - 3 = 4. Số hạng thứ 50 của dãy là: 3 + (50 - 1) × 4 = 3 + 49 × 4 = 199.',
        svgType: 'sequence_pattern',
        svgData: { val1: '3, 7, 11, 15...', val2: '+4 mỗi bước (n=50)' }
      },
      {
        id: 15,
        title: 'Tính tổng dãy số cách đều',
        question: 'Tính tổng của 40 số chẵn liên tiếp đầu tiên kể từ số 2: S = 2 + 4 + 6 + ... + 80.',
        options: ['1600', '1640', '1680', '1720'],
        correctIndex: 1,
        hint: 'Tổng dãy số cách đều = (Số đầu + Số cuối) × Số số hạng : 2.',
        solution: 'Dãy gồm 40 số hạng, số đầu là 2, số cuối là 80. Tổng S = (2 + 80) × 40 : 2 = 82 × 20 = 1640.',
        svgType: 'sequence_pattern',
        svgData: { val1: 'S = 2 + 4 + ... + 80', val2: '(Đầu + Cuối) × n : 2' }
      },
      {
        id: 16,
        title: 'Đếm chữ số dùng để đánh số trang sách',
        question: 'Để đánh số trang của một cuốn sách dày 150 trang (từ trang 1 đến trang 150), người ta cần dùng tất cả bao nhiêu lượt chữ số?',
        options: ['324 chữ số', '336 chữ số', '342 chữ số', '350 chữ số'],
        correctIndex: 2,
        hint: 'Chia làm 3 nhóm: từ trang 1 đến 9 (1 chữ số/trang), từ trang 10 đến 99 (2 chữ số/trang), từ 100 đến 150 (3 chữ số/trang).',
        solution: 'Từ 1 đến 9 có: 9 trang × 1 = 9 chữ số. Từ 10 đến 99 có: (99 - 10 + 1) = 90 trang × 2 = 180 chữ số. Từ 100 đến 150 có: (150 - 100 + 1) = 51 trang × 3 = 153 chữ số. Tổng số chữ số cần dùng: 9 + 180 + 153 = 342 (chữ số).',
        svgType: 'sequence_pattern',
        svgData: { val1: '1 -> 150 trang', val2: '9 + 180 + 153 = 342' }
      },
      {
        id: 17,
        title: 'Quy luật khoảng cách tăng dần',
        question: 'Tìm số hạng tiếp theo của dãy số sau: 1, 2, 4, 7, 11, 16, 22, ...?',
        options: ['28', '29', '30', '31'],
        correctIndex: 1,
        hint: 'Xét hiệu hai số liên tiếp: 2 - 1 = 1; 4 - 2 = 2; 7 - 4 = 3; 11 - 7 = 4; 16 - 11 = 5; 22 - 16 = 6. Khoảng cách tiếp theo sẽ là bao nhiêu?',
        solution: 'Quy luật: Khoảng cách giữa các số tăng dần: +1, +2, +3, +4, +5, +6. Khoảng cách tiếp theo là +7. Số tiếp theo cần tìm là: 22 + 7 = 29.',
        svgType: 'sequence_pattern',
        svgData: { val1: '+1, +2, +3, +4, +5, +6', val2: 'Số tiếp theo = 22 + 7' }
      }
    ]
  },
  {
    id: 'set-7',
    title: 'Đề 7: Tuyệt kỹ Toán Tổng – (Hiệu) – Tỉ',
    badge: 'Tổng - Hiệu - Tỉ',
    description: 'Chuyên đề chuyển dịch phần, bài toán tuổi tác và thay đổi tỉ số nâng cao.',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    questions: [
      {
        id: 18,
        title: 'Chuyển dịch giữa hai ngăn sách',
        question: 'Hai ngăn sách có tổng cộng 180 cuốn sách. Nếu chuyển 15 cuốn từ ngăn thứ nhất sang ngăn thứ hai thì số sách ngăn thứ nhất bằng 4/5 số sách ngăn thứ hai. Hỏi ban đầu ngăn thứ nhất có bao nhiêu cuốn sách?',
        options: ['85 cuốn', '90 cuốn', '95 cuốn', '100 cuốn'],
        correctIndex: 2,
        hint: 'Khi chuyển sách giữa hai ngăn với nhau thì tổng số sách vẫn không đổi là 180 cuốn. Tìm số sách lúc sau của ngăn 1 theo bài toán Tổng - Tỉ.',
        solution: 'Tổng số sách không đổi là 180 cuốn. Tổng số phần bằng nhau lúc sau: 4 + 5 = 9 (phần). Số sách ngăn thứ nhất lúc sau: 180 : 9 × 4 = 80 (cuốn). Số sách ngăn thứ nhất ban đầu: 80 + 15 = 95 (cuốn).',
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Tổng = 180 cuốn', val2: 'Tỉ số sau chuyển = 4/5' }
      },
      {
        id: 19,
        title: 'Bài toán tuổi tác qua các năm',
        question: 'Hiện nay mẹ 36 tuổi và con 8 tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi mẹ gấp 3 lần tuổi con?',
        options: ['4 năm', '5 năm', '6 năm', '8 năm'],
        correctIndex: 2,
        hint: 'Hiệu số tuổi của hai mẹ con không thay đổi theo thời gian: 36 - 8 = 28 tuổi. Áp dụng bài toán Hiệu - Tỉ khi tuổi mẹ gấp 3 lần tuổi con.',
        solution: 'Hiệu số tuổi không đổi là: 36 - 8 = 28 (tuổi). Khi tuổi mẹ gấp 3 lần tuổi con, hiệu số phần là: 3 - 1 = 2 (phần). Tuổi con khi đó là: 28 : 2 × 1 = 14 (tuổi). Số năm cần tìm là: 14 - 8 = 6 (năm).',
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Hiệu tuổi = 28', val2: 'Tỉ số mới = 3 : 1' }
      },
      {
        id: 20,
        title: 'Cùng bớt ở cả hai số (Hiệu không đổi)',
        question: 'Tìm hai số có tỉ số bằng 3/5. Nếu cùng bớt ở cả hai số đi 10 đơn vị thì được hai số mới có tỉ số bằng 1/2. Số lớn ban đầu là bao nhiêu?',
        options: ['40', '50', '60', '75'],
        correctIndex: 1,
        hint: 'Khi cùng bớt ở cả hai số đi một lượng như nhau thì hiệu hai số không đổi. So sánh hiệu số phần ban đầu và lúc sau.',
        solution: 'Ban đầu: Số lớn hơn số bé: 5 - 3 = 2 phần, tức hiệu = 2 phần và số lớn = 5/2 hiệu. Lúc sau: tỉ số 1/2 nghĩa là số lớn mới = 2/1 hiệu = 2 lần hiệu. Độ giảm của số lớn: (5/2 - 2) hiệu = 1/2 hiệu = 10 đơn vị. Suy ra Hiệu = 20. Số lớn ban đầu: 20 × 5/2 = 50.',
        svgType: 'sum_diff_ratio',
        svgData: { val1: '3/5 ➔ Bớt 10 ➔ 1/2', val2: 'Hiệu số không đổi' }
      }
    ]
  },
  {
    id: 'set-8',
    title: 'Đề 8: Chinh phục Tỉ số Phần trăm & Thực tế',
    badge: 'Tỉ số phần trăm',
    description: 'Thử thách bài toán giá vốn - giá bán - lãi suất, pha trộn dung dịch muối và chiết khấu thương mại.',
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600',
    questions: [
      {
        id: 21,
        title: 'Hạ giá bìa nhưng vẫn có lãi',
        question: 'Một hiệu sách hạ giá 20% so với giá ghi trên bìa sách nhưng vẫn còn lãi 12% so với giá vốn mua vào. Hỏi nếu bán đúng theo giá bìa thì hiệu sách lãi bao nhiêu phần trăm so với giá vốn?',
        options: ['32%', '36%', '40%', '44%'],
        correctIndex: 2,
        hint: 'Coi giá vốn là 100%. Giá bán khi hạ giá = 112% giá vốn, và bằng 80% (100% - 20%) giá bìa. Từ đó tìm tỉ số phần trăm của giá bìa so với giá vốn.',
        solution: 'Coi giá vốn là 100%. Giá bán khi đã hạ giá là: 100% + 12% = 112% (giá vốn). Giá bán này ứng với: 100% - 20% = 80% (giá bìa). Giá bìa so với giá vốn chiếm tỉ lệ: 112% : 80% = 1,4 = 140% (giá vốn). Vậy nếu bán đúng giá bìa thì hiệu sách lãi: 140% - 100% = 40% (giá vốn).',
        svgType: 'percentage_app',
        svgData: { val1: 'Giảm 20% giá bìa', val2: 'Lãi 12% vốn -> Bìa = 140%' }
      },
      {
        id: 22,
        title: 'Pha thêm nước cất vào dung dịch muối',
        question: 'Trong 200 gam dung dịch nước muối có nồng độ 5% muối. Hỏi cần đổ thêm vào bình bao nhiêu gam nước tinh khiết để được dung dịch mới có nồng độ 2% muối?',
        options: ['150 gam', '250 gam', '300 gam', '350 gam'],
        correctIndex: 2,
        hint: 'Lượng muối nguyên chất trong dung dịch không thay đổi trước và sau khi đổ thêm nước.',
        solution: 'Khối lượng muối nguyên chất có trong bình: 200 × 5% = 10 (gam). Lượng muối 10g này chiếm 2% khối lượng dung dịch mới. Khối lượng dung dịch mới là: 10 : 2% = 500 (gam). Khối lượng nước tinh khiết cần đổ thêm: 500 - 200 = 300 (gam).',
        svgType: 'percentage_app',
        svgData: { val1: '200g (5% muối = 10g)', val2: 'Đổ thêm nước -> 2% muối' }
      },
      {
        id: 23,
        title: 'Bài toán gửi tiết kiệm sinh lời',
        question: 'Bác An gửi tiết kiệm 50 000 000 đồng vào ngân hàng với lãi suất 0,6% một tháng. Sau một tháng, bác An nhận được cả tiền gốc và tiền lãi là bao nhiêu?',
        options: ['50 300 000 đ', '50 600 000 đ', '53 000 000 đ', '56 000 000 đ'],
        correctIndex: 0,
        hint: 'Tiền lãi sau 1 tháng = Tiền gốc × Lãi suất hàng tháng : 100.',
        solution: 'Số tiền lãi sau 1 tháng là: 50 000 000 × 0,6 : 100 = 300 000 (đồng). Tổng số tiền cả gốc và lãi nhận được là: 50 000 000 + 300 000 = 50 300 000 (đồng).',
        svgType: 'percentage_app',
        svgData: { val1: '50.000.000đ (0.6%/tháng)', val2: 'Lãi: 300.000đ' }
      }
    ]
  },
  {
    id: 'set-9',
    title: 'Đề 9: Bứt phá Toán Chuyển động đều',
    badge: 'Chuyển động đều',
    description: 'Chinh phục bài toán hai xe gặp nhau, đuổi nhau, đoàn tàu chui qua cầu hầm và chuyển động trên dòng nước.',
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
    questions: [
      {
        id: 24,
        title: 'Hai xe đi ngược chiều gặp nhau',
        question: 'Quãng đường AB dài 180 km. Lúc 7 giờ sáng, một ô tô đi từ A về B với vận tốc 50 km/h và một xe máy đi từ B về A với vận tốc 40 km/h. Hỏi hai xe gặp nhau lúc mấy giờ?',
        options: ['8 giờ 30 phút', '9 giờ 00 phút', '9 giờ 30 phút', '10 giờ 00 phút'],
        correctIndex: 1,
        hint: 'Sau mỗi giờ hai xe đi được quãng đường bằng tổng vận tốc hai xe: v1 + v2. Thời gian gặp nhau = Quãng đường : Tổng vận tốc.',
        solution: 'Tổng vận tốc của hai xe là: 50 + 40 = 90 (km/h). Thời gian hai xe đi để gặp nhau là: 180 : 90 = 2 (giờ). Hai xe gặp nhau lúc: 7 giờ + 2 giờ = 9 giờ.',
        svgType: 'motion_physics',
        svgData: { val1: 'AB = 180km', val2: 'v1=50, v2=40 ➔ Gặp sau 2h' }
      },
      {
        id: 25,
        title: 'Xe máy đuổi theo xe đạp (Cùng chiều)',
        question: 'Một người đi xe đạp từ A với vận tốc 12 km/h. Sau 2 giờ, một xe máy cũng đi từ A đuổi theo xe đạp với vận tốc 36 km/h. Hỏi sau bao lâu kể từ lúc bắt đầu xuất phát, xe máy đuổi kịp xe đạp?',
        options: ['45 phút', '1 giờ', '1 giờ 15 phút', '1 giờ 30 phút'],
        correctIndex: 1,
        hint: 'Tính quãng đường xe đạp đã đi trước (khoảng cách lúc xuất phát). Thời gian đuổi kịp = Khoảng cách trước : Hiệu vận tốc.',
        solution: 'Quãng đường xe đạp đi trước trong 2 giờ: 12 × 2 = 24 (km). Sau mỗi giờ xe máy gần xe đạp thêm: 36 - 12 = 24 (km). Thời gian xe máy đuổi kịp xe đạp: 24 : 24 = 1 (giờ).',
        svgType: 'motion_physics',
        svgData: { val1: 'Khoảng cách trước = 24km', val2: 'Hiệu v = 36 - 12 = 24km/h' }
      },
      {
        id: 26,
        title: 'Đoàn tàu hỏa chạy qua cây cầu',
        question: 'Một đoàn tàu dài 150 m chạy qua một cây cầu dài 450 m với vận tốc 36 km/h. Hỏi kể từ lúc đầu tàu bước vào cầu cho đến khi toa cuối cùng qua khỏi cầu mất bao nhiêu giây?',
        options: ['45 giây', '50 giây', '60 giây', '75 giây'],
        correctIndex: 2,
        hint: 'Quãng đường đoàn tàu đi được để qua hoàn toàn cây cầu = Chiều dài tàu + Chiều dài cầu. Nhớ đổi vận tốc 36 km/h ra m/giây (36 × 1000 : 3600 = 10 m/s).',
        solution: 'Đổi vận tốc: 36 km/h = 10 m/s. Quãng đường tàu đi được khi qua hết cầu: 150 + 450 = 600 (m). Thời gian tàu chạy qua cầu: 600 : 10 = 60 (giây).',
        svgType: 'motion_physics',
        svgData: { val1: 'Tàu 150m + Cầu 450m = 600m', val2: 'v = 36km/h = 10m/s' }
      },
      {
        id: 27,
        title: 'Cano xuôi ngược trên dòng sông',
        question: 'Một ca nô xuôi dòng từ A đến B mất 2 giờ và đi ngược dòng từ B về A mất 3 giờ. Biết vận tốc của dòng nước là 3 km/h. Tính quãng đường sông từ A đến B.',
        options: ['30 km', '36 km', '42 km', '48 km'],
        correctIndex: 1,
        hint: 'Hiệu vận tốc xuôi dòng và ngược dòng bằng 2 lần vận tốc dòng nước (2 × 3 = 6 km/h). Tỉ số thời gian xuôi/ngược là 2/3 nên tỉ số vận tốc xuôi/ngược là 3/2.',
        solution: 'Vận tốc xuôi dòng hơn vận tốc ngược dòng: 3 × 2 = 6 (km/h). Vì cùng quãng đường AB, vận tốc và thời gian tỉ lệ nghịch. Tỉ số thời gian là 2/3 nên tỉ số vận tốc xuôi so với ngược là 3/2. Vận tốc xuôi dòng: 6 : (3 - 2) × 3 = 18 (km/h). Quãng đường AB: 18 × 2 = 36 (km).',
        svgType: 'motion_physics',
        svgData: { val1: 'Hiệu v = 2 × vnước = 6km/h', val2: 't xuôi/ngược = 2/3 ➔ v = 18km/h' }
      }
    ]
  },
  {
    id: 'set-10',
    title: 'Đề 10: Ứng dụng Tỉ lệ Bản đồ & Địa hình Thực tế',
    badge: 'Ứng dụng tỉ lệ bản đồ',
    description: 'Chuyên đề thực tế về tính khoảng cách, thời gian lộ trình và diện tích công trình trên bản đồ quy hoạch.',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-600',
    questions: [
      {
        id: 28,
        title: 'Tính thời gian lộ trình theo bản đồ',
        question: 'Trên bản đồ giao thông miền Bắc tỉ lệ 1 : 500 000, khoảng cách từ Hà Nội đến Ninh Bình đo được là 18,6 cm. Một ô tô chạy trên tuyến đường này với vận tốc 62 km/h thì đi từ Hà Nội đến Ninh Bình mất bao nhiêu thời gian?',
        options: ['1 giờ 15 phút', '1 giờ 30 phút', '1 giờ 45 phút', '2 giờ'],
        correctIndex: 1,
        hint: 'Bước 1: Tính khoảng cách thực tế (cm) rồi đổi sang km. Bước 2: Thời gian = Quãng đường : Vận tốc.',
        solution: 'Khoảng cách thực tế từ Hà Nội đến Ninh Bình: 18,6 × 500 000 = 9 300 000 (cm) = 93 km. Thời gian ô tô di chuyển: 93 : 62 = 1,5 (giờ) = 1 giờ 30 phút.',
        svgType: 'map_scale_diagram',
        svgData: { val1: '18,6 cm (1 : 500.000)', val2: 'Thực tế = 93 km ➔ 1,5 giờ' }
      },
      {
        id: 29,
        title: 'Diện tích thửa ruộng trên bản đồ địa chính',
        question: 'Một thửa ruộng hình chữ nhật có chu vi 280 m, chiều dài hơn chiều rộng 20 m. Trên bản đồ địa chính tỉ lệ 1 : 2 000, diện tích của thửa ruộng đó là bao nhiêu xăng-ti-mét vuông?',
        options: ['6 cm²', '8 cm²', '12 cm²', '16 cm²'],
        correctIndex: 2,
        hint: 'Tìm chiều dài, chiều rộng thực tế của thửa ruộng (Tổng - Hiệu). Đổi sang cm rồi chia cho mẫu số tỉ lệ 2000 để tìm kích thước trên bản đồ, sau đó tính diện tích.',
        solution: 'Nửa chu vi thửa ruộng: 280 : 2 = 140 (m). Chiều dài thực tế: (140 + 20) : 2 = 80 m = 8 000 cm. Chiều rộng thực tế: 80 - 20 = 60 m = 6 000 cm. Kích thước trên bản đồ: Dài = 8 000 : 2 000 = 4 cm; Rộng = 6 000 : 2 000 = 3 cm. Diện tích thửa ruộng trên bản đồ: 4 × 3 = 12 (cm²).',
        svgType: 'map_scale_diagram',
        svgData: { val1: 'Dài = 80m, Rộng = 60m', val2: 'Bản đồ: 4cm × 3cm = 12cm²' }
      },
      {
        id: 30,
        title: 'Chuyển đổi giữa hai bản đồ khác tỉ lệ',
        question: 'Trên bản đồ thứ nhất tỉ lệ 1 : 100 000, khoảng cách giữa hai huyện là 35 cm. Nếu vẽ lại khoảng cách giữa hai huyện đó trên một bản đồ thứ hai có tỉ lệ 1 : 250 000 thì đoạn thẳng đó sẽ dài bao nhiêu xăng-ti-mét?',
        options: ['12 cm', '14 cm', '15 cm', '17,5 cm'],
        correctIndex: 1,
        hint: 'Tính khoảng cách thực tế giữa hai huyện từ bản đồ thứ nhất: 35 × 100 000 = 3 500 000 cm. Sau đó chia cho mẫu số tỉ lệ của bản đồ thứ hai.',
        solution: 'Khoảng cách thực tế giữa hai huyện là: 35 × 100 000 = 3 500 000 (cm) = 35 km. Trên bản đồ thứ hai tỉ lệ 1 : 250 000, khoảng cách đó dài: 3 500 000 : 250 000 = 14 (cm).',
        svgType: 'map_scale_diagram',
        svgData: { val1: 'Bản đồ 1: 35cm (1:100.000)', val2: 'Bản đồ 2: (1:250.000) ➔ 14cm' }
      },
      {
        id: 31,
        title: 'Chu vi thực tế của công viên hình vuông',
        question: 'Một công viên hình vuông có diện tích trên bản đồ tỉ lệ 1 : 5 000 là 16 cm². Hỏi chu vi trên thực tế của công viên đó là bao nhiêu mét?',
        options: ['400 m', '600 m', '800 m', '1000 m'],
        correctIndex: 2,
        hint: 'Vì diện tích hình vuông là 16 cm² nên cạnh của công viên trên bản đồ là 4 cm (4 × 4 = 16). Tính cạnh thực tế rồi tính chu vi.',
        solution: 'Vì 4 × 4 = 16 nên cạnh của công viên trên bản đồ là 4 cm. Độ dài cạnh công viên trên thực tế: 4 × 5 000 = 20 000 (cm) = 200 m. Chu vi trên thực tế của công viên là: 200 × 4 = 800 (m).',
        svgType: 'map_scale_diagram',
        svgData: { val1: 'S bản đồ = 16cm² ➔ Cạnh = 4cm', val2: 'Cạnh thật = 200m ➔ P = 800m' }
      }
    ]
  }
];

export const ConquerPanel: React.FC = () => {
  const [selectedSetId, setSelectedSetId] = useState<string>('set-1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [scores, setScores] = useState<{ [qId: number]: boolean }>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const activeSet = QUESTION_SETS.find(s => s.id === selectedSetId) || QUESTION_SETS[0];
  const currentQ = activeSet.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing after submission
    setSelectedOption(index);
    setShowSolution(true);

    const isCorrect = index === currentQ.correctIndex;
    setScores(prev => ({ ...prev, [currentQ.id]: isCorrect }));

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
      setSelectedOption(null);
      setShowHint(false);
      setShowSolution(false);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetSet = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setShowSolution(false);
    setScores({});
    setCompleted(false);
  };

  // Render SVG Diagram according to svgType
  const renderGeometrySVG = () => {
    return (
      <div className="w-full h-48 sm:h-56 bg-slate-900/90 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden border border-slate-700 shadow-inner">
        <svg viewBox="0 0 300 160" className="w-full h-full max-h-52 select-none">
          {currentQ.svgType === 'triangle_ratio' && (
            <g>
              {/* Triangle ABC */}
              <polygon points="50,130 180,130 130,30" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="2.5" />
              {/* Extended triangle ACD */}
              <polygon points="180,130 250,130 130,30" fill="rgba(244, 63, 94, 0.35)" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="4 2" />
              {/* Height line */}
              <line x1="130" y1="30" x2="130" y2="130" stroke="#FBBF24" strokeWidth="1.8" strokeDasharray="3 3" />
              <rect x="130" y="122" width="8" height="8" fill="none" stroke="#FBBF24" strokeWidth="1" />
              {/* Points */}
              <text x="125" y="24" fill="#FFFFFF" fontSize="13" fontWeight="bold">A</text>
              <text x="38" y="142" fill="#FFFFFF" fontSize="13" fontWeight="bold">B</text>
              <text x="175" y="145" fill="#38BDF8" fontSize="13" fontWeight="bold">C</text>
              <text x="255" y="142" fill="#F43F5E" fontSize="13" fontWeight="bold">D</text>
              <text x="100" y="105" fill="#BAE6FD" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 'S1'}</text>
              <text x="195" y="105" fill="#FDA4AF" fontSize="11" fontWeight="bold">{currentQ.svgData?.val2 || 'S2'}</text>
            </g>
          )}

          {currentQ.svgType === 'circle_square' && (
            <g>
              {/* Outer Square */}
              <rect x="75" y="15" width="130" height="130" fill="rgba(239, 68, 68, 0.25)" stroke="#EF4444" strokeWidth="2.5" />
              {/* Inner Circle */}
              <circle cx="140" cy="80" r="65" fill="rgba(59, 130, 246, 0.35)" stroke="#3B82F6" strokeWidth="2.5" />
              {/* Center point */}
              <circle cx="140" cy="80" r="3" fill="#FBBF24" />
              {/* Radius line */}
              <line x1="140" y1="80" x2="205" y2="80" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
              <text x="155" y="74" fill="#FDE047" fontSize="11" fontWeight="bold">r = 5cm</text>
              <text x="110" y="156" fill="#FCA5A5" fontSize="11" fontWeight="bold">Cạnh = 10 cm</text>
              {/* Corner highlighted area */}
              <text x="80" y="32" fill="#F87171" fontSize="10" fontWeight="bold">Phần tô màu</text>
            </g>
          )}

          {currentQ.svgType === 'circle_ring' && (
            <g>
              {/* Outer circle */}
              <circle cx="150" cy="80" r="65" fill="rgba(168, 85, 247, 0.3)" stroke="#A855F7" strokeWidth="2.5" />
              {/* Inner circle */}
              <circle cx="150" cy="80" r="40" fill="#0f172a" stroke="#F43F5E" strokeWidth="2.5" />
              <circle cx="150" cy="80" r="3" fill="#FBBF24" />
              <line x1="150" y1="80" x2="215" y2="80" stroke="#C084FC" strokeWidth="2" />
              <line x1="150" y1="80" x2="150" y2="40" stroke="#F43F5E" strokeWidth="2" />
              <text x="175" y="75" fill="#E9D5FF" fontSize="11" fontWeight="bold">R = 8cm</text>
              <text x="154" y="60" fill="#FDA4AF" fontSize="11" fontWeight="bold">r = 5cm</text>
              <text x="75" y="85" fill="#FDE047" fontSize="11" fontWeight="bold">Hình Vành Khăn</text>
            </g>
          )}

          {currentQ.svgType === 'rect_change' && (
            <g>
              {/* Original Rect */}
              <rect x="50" y="40" width="120" height="70" fill="rgba(249, 115, 22, 0.25)" stroke="#F97316" strokeWidth="2" />
              {/* Expanded Rect */}
              <rect x="50" y="40" width="160" height="90" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="4 3" />
              <text x="95" y="78" fill="#FDBA74" fontSize="12" fontWeight="bold">Ban đầu</text>
              <text x="175" y="78" fill="#86EFAC" fontSize="11" fontWeight="bold">+ Tăng chiều dài</text>
              <text x="90" y="125" fill="#86EFAC" fontSize="11" fontWeight="bold">+ Tăng chiều rộng</text>
            </g>
          )}

          {currentQ.svgType === 'trapezoid_diag' && (
            <g>
              {/* Trapezoid */}
              <polygon points="90,40 190,40 240,125 40,125" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2.5" />
              {/* Diagonals */}
              <line x1="90" y1="40" x2="240" y2="125" stroke="#F59E0B" strokeWidth="2" />
              <line x1="190" y1="40" x2="40" y2="125" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="140" cy="80" r="3" fill="#EF4444" />
              <text x="138" y="75" fill="#EF4444" fontSize="12" fontWeight="bold">O</text>
              <text x="82" y="34" fill="#FFFFFF" fontSize="12" fontWeight="bold">A</text>
              <text x="195" y="34" fill="#FFFFFF" fontSize="12" fontWeight="bold">B</text>
              <text x="248" y="130" fill="#FFFFFF" fontSize="12" fontWeight="bold">C</text>
              <text x="28" y="130" fill="#FFFFFF" fontSize="12" fontWeight="bold">D</text>
              <text x="135" y="55" fill="#FDE68A" fontSize="10" fontWeight="bold">S(AOB)</text>
              <text x="80" y="85" fill="#A7F3D0" fontSize="10" fontWeight="bold">S(AOD)</text>
              <text x="180" y="85" fill="#A7F3D0" fontSize="10" fontWeight="bold">S(BOC)</text>
              <text x="135" y="115" fill="#FDE68A" fontSize="10" fontWeight="bold">S(COD)</text>
            </g>
          )}

          {currentQ.svgType === 'cube_paint' && (
            <g>
              {/* 3D Cube isometric */}
              <polygon points="150,20 210,50 210,110 150,80" fill="rgba(59, 130, 246, 0.4)" stroke="#60A5FA" strokeWidth="2" />
              <polygon points="150,20 90,50 90,110 150,80" fill="rgba(37, 99, 235, 0.5)" stroke="#60A5FA" strokeWidth="2" />
              <polygon points="150,20 210,50 150,80 90,50" fill="rgba(96, 165, 250, 0.6)" stroke="#93C5FD" strokeWidth="2" />
              {/* Internal cut grid lines */}
              <line x1="110" y1="40" x2="110" y2="100" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="130" y1="30" x2="130" y2="90" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="170" y1="30" x2="170" y2="90" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="190" y1="40" x2="190" y2="100" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <text x="110" y="145" fill="#FBBF24" fontSize="11" fontWeight="bold">Khối 5 × 5 × 5 = 125 cm³</text>
            </g>
          )}

          {currentQ.svgType === 'water_rise' && (
            <g>
              {/* Aquarium box */}
              <rect x="70" y="40" width="160" height="90" fill="rgba(15, 23, 42, 0.6)" stroke="#38BDF8" strokeWidth="2.5" rx="4" />
              {/* Water initial */}
              <rect x="70" y="80" width="160" height="50" fill="rgba(14, 165, 233, 0.35)" />
              {/* Risen water section */}
              <rect x="70" y="65" width="160" height="15" fill="rgba(244, 63, 94, 0.45)" stroke="#F43F5E" strokeWidth="1" strokeDasharray="3 2" />
              {/* Submerged rock */}
              <ellipse cx="150" cy="110" rx="24" ry="12" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
              <text x="135" y="113" fill="#FFFFFF" fontSize="10" fontWeight="bold">Hòn đá</text>
              <text x="100" y="76" fill="#FDA4AF" fontSize="11" fontWeight="bold">Nước dâng +2,5 cm</text>
              <text x="100" y="150" fill="#BAE6FD" fontSize="11" fontWeight="bold">Đáy: 40 cm × 30 cm</text>
            </g>
          )}

          {currentQ.svgType === 'sequence_pattern' && (
            <g>
              {/* Pattern nodes */}
              <rect x="20" y="55" width="45" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="35" y="80" fill="#fde68a" fontSize="13" fontWeight="bold">u₁</text>

              <path d="M 65 60 Q 85 35 105 60" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="77" y="40" fill="#fde68a" fontSize="10" fontWeight="bold">+d</text>

              <rect x="105" y="55" width="45" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="120" y="80" fill="#fde68a" fontSize="13" fontWeight="bold">u₂</text>

              <path d="M 150 60 Q 170 35 190 60" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="162" y="40" fill="#fde68a" fontSize="10" fontWeight="bold">+d</text>

              <rect x="190" y="55" width="45" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="205" y="80" fill="#fde68a" fontSize="13" fontWeight="bold">u₃</text>

              <line x1="240" y1="75" x2="255" y2="75" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />

              <rect x="260" y="55" width="48" height="40" rx="8" fill="rgba(245, 158, 11, 0.2)" stroke="#10b981" strokeWidth="2.5" />
              <text x="275" y="80" fill="#86efac" fontSize="13" fontWeight="black">uₙ</text>

              <text x="50" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 'Dãy số cách đều'}</text>
              <text x="50" y="145" fill="#fde68a" fontSize="10" fontWeight="bold">{currentQ.svgData?.val2 || 'Quy luật tăng dần'}</text>
            </g>
          )}

          {currentQ.svgType === 'sum_diff_ratio' && (
            <g>
              {/* Tape Diagram */}
              <text x="25" y="42" fill="#cbd5e1" fontSize="11" fontWeight="bold">Số bé:</text>
              <rect x="75" y="28" width="50" height="22" rx="4" fill="#6366f1" stroke="#818cf8" strokeWidth="1.5" />
              <rect x="127" y="28" width="50" height="22" rx="4" fill="#6366f1" stroke="#818cf8" strokeWidth="1.5" />

              <text x="25" y="82" fill="#cbd5e1" fontSize="11" fontWeight="bold">Số lớn:</text>
              <rect x="75" y="68" width="50" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.5" />
              <rect x="127" y="68" width="50" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.5" />
              <rect x="179" y="68" width="50" height="22" rx="4" fill="#ec4899" stroke="#f472b6" strokeWidth="1.5" />
              <rect x="231" y="68" width="50" height="22" rx="4" fill="rgba(236, 72, 153, 0.4)" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 2" />

              {/* Bracket / Info */}
              <path d="M 285 28 L 292 53 L 285 78" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="50" y="125" fill="#e2e8f0" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 'Sơ đồ đoạn thẳng'}</text>
              <text x="50" y="145" fill="#fde68a" fontSize="10" fontWeight="bold">{currentQ.svgData?.val2 || 'Tỉ số các phần bằng nhau'}</text>
            </g>
          )}

          {currentQ.svgType === 'percentage_app' && (
            <g>
              {/* Percentage bar */}
              <rect x="40" y="35" width="220" height="30" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
              {/* Highlighted portion */}
              <rect x="40" y="35" width="88" height="30" rx="8" fill="rgba(244, 63, 94, 0.6)" />
              <text x="65" y="55" fill="#ffffff" fontSize="12" fontWeight="black">x%</text>
              <text x="170" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">100%</text>

              {/* Discount / Interest tag badge */}
              <circle cx="280" cy="50" r="18" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="274" y="54" fill="#1e293b" fontSize="12" fontWeight="black">%</text>

              <text x="45" y="105" fill="#fda4af" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 'Tỉ số phần trăm thực tế'}</text>
              <text x="45" y="130" fill="#fde68a" fontSize="10" fontWeight="bold">{currentQ.svgData?.val2 || 'Giá vốn - Giá bán - Lãi suất'}</text>
            </g>
          )}

          {currentQ.svgType === 'motion_physics' && (
            <g>
              {/* Road line */}
              <line x1="30" y1="75" x2="290" y2="75" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              <line x1="30" y1="75" x2="290" y2="75" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* Point A */}
              <circle cx="45" cy="75" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <text x="40" y="62" fill="#93c5fd" fontSize="12" fontWeight="bold">A</text>
              {/* Arrow right */}
              <path d="M 55 60 L 85 60" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="85,57 92,60 85,63" fill="#38bdf8" />
              <text x="58" y="52" fill="#38bdf8" fontSize="10" fontWeight="bold">v₁</text>

              {/* Meeting Point / Point B */}
              <circle cx="275" cy="75" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <text x="270" y="62" fill="#fca5a5" fontSize="12" fontWeight="bold">B</text>
              {/* Arrow left */}
              <path d="M 265 60 L 235 60" stroke="#f87171" strokeWidth="2.5" />
              <polygon points="235,57 228,60 235,63" fill="#f87171" />
              <text x="240" y="52" fill="#f87171" fontSize="10" fontWeight="bold">v₂</text>

              <text x="40" y="115" fill="#e2e8f0" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 's = v × t'}</text>
              <text x="40" y="138" fill="#fde68a" fontSize="10" fontWeight="bold">{currentQ.svgData?.val2 || 'Hai chuyển động cùng/ngược chiều'}</text>
            </g>
          )}

          {currentQ.svgType === 'map_scale_diagram' && (
            <g>
              {/* Map background grid */}
              <rect x="35" y="25" width="250" height="90" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />
              {/* Points */}
              <circle cx="65" cy="70" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <text x="60" y="58" fill="#ef4444" fontSize="10" fontWeight="bold">A</text>
              <circle cx="215" cy="70" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <text x="212" y="58" fill="#ef4444" fontSize="10" fontWeight="bold">B</text>
              {/* Connecting line */}
              <line x1="65" y1="70" x2="215" y2="70" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" />

              {/* Scale bar box */}
              <rect x="170" y="85" width="105" height="22" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
              <text x="178" y="100" fill="#fde68a" fontSize="9" fontWeight="bold">Tỉ lệ 1 : N</text>

              <text x="45" y="132" fill="#86efac" fontSize="11" fontWeight="bold">{currentQ.svgData?.val1 || 'Khoảng cách bản đồ'}</text>
              <text x="45" y="150" fill="#fde68a" fontSize="10" fontWeight="bold">{currentQ.svgData?.val2 || 'Quy đổi ra khoảng cách thực tế'}</text>
            </g>
          )}
        </svg>
      </div>
    );
  };

  const correctCount = Object.values(scores).filter(Boolean).length;
  const totalQuestions = activeSet.questions.length;

  return (
    <div className="h-full flex flex-col bg-[#fcfdfa] math-grid-light overflow-hidden">
      {/* Top Banner Tinh Gọn - Nền Trắng, Viền Vàng Cam */}
      <div className="bg-white border-b-2 border-amber-400 px-4 py-2.5 shadow-xs shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shadow-xs">
              <Trophy size={18} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                Thử Thách Toán Nâng Cao
              </h1>
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md">
                Lớp 5
              </span>
            </div>
          </div>

          {/* Quick stats gọn gàng */}
          <div className="flex items-center gap-2 bg-amber-50/70 px-3 py-1 rounded-xl border border-amber-300/80">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
              <Award size={15} className="text-amber-600" />
              <span>Điểm: {correctCount * 10} đ</span>
            </div>
            <div className="w-px h-3.5 bg-amber-300"></div>
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Đúng: {correctCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col md:flex-row gap-5 overflow-hidden">
        
        {/* Left Sidebar: List of Question Sets */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700 px-2 mb-1 flex items-center gap-1.5">
            <Flame size={14} className="text-amber-500" />
            <span>Chọn Bộ Đề Thử Thách</span>
          </div>

          {QUESTION_SETS.map((set) => {
            const isSelected = selectedSetId === set.id;
            return (
              <button
                key={set.id}
                onClick={() => {
                  setSelectedSetId(set.id);
                  handleResetSet();
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-400/25'
                    : 'bg-white hover:bg-amber-50/20 border-slate-200 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-800'
                  }`}>
                    {set.badge}
                  </span>
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-amber-700 font-extrabold' : 'text-slate-400'
                  }`}>
                    {set.questions.length} câu
                  </span>
                </div>
                <h3 className={`text-sm font-extrabold mt-1.5 ${
                  isSelected ? 'text-amber-800' : 'text-slate-800 group-hover:text-amber-700'
                }`}>
                  {set.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {set.description}
                </p>
              </button>
            );
          })}

          {/* Tips Card */}
          <div className="mt-auto bg-white p-3.5 rounded-2xl border-2 border-amber-300 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase mb-1">
              <Lightbulb size={14} className="text-amber-500" /> Bí quyết chinh phục
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hãy chú ý các tỉ số: đáy chung chiều cao, phần diện tích tô màu qua phép trừ diện tích, và quy tắc bảo toàn thể tích nước!
            </p>
          </div>
        </div>

        {/* Right Content Area: Question & Solution (Tông màu trắng, viền vàng cam) */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-amber-400 shadow-md flex flex-col overflow-hidden relative">
          
          {!completed ? (
            <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar">
              
              {/* Question Header & Progress Bar */}
              <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-sm flex items-center justify-center">
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <span className="text-xs font-black uppercase text-amber-700/80 tracking-wider">
                      Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-800">
                      {currentQ.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(prev => !prev)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                    title="Xem gợi ý tư duy"
                  >
                    <Lightbulb size={15} className="text-amber-600" />
                    <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý tư duy'}</span>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 shrink-0 border border-slate-200/50">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question text box: Tông màu trắng, viền vàng cam */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-400/90 text-slate-900 text-sm sm:text-base font-bold leading-relaxed mb-4 shadow-xs">
                {currentQ.question}
              </div>

              {/* Visual Diagram Frame */}
              <div className="mb-4 shrink-0 rounded-2xl border-2 border-amber-200/90 overflow-hidden shadow-xs">
                {renderGeometrySVG()}
              </div>

              {/* Hint Box (if toggled) */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border-2 border-amber-400 p-3.5 rounded-2xl mb-4 text-xs font-medium text-slate-800 leading-relaxed flex items-start gap-2.5 shadow-xs"
                  >
                    <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-amber-700 block mb-0.5">💡 GỢI Ý TƯ DUY:</span>
                      {currentQ.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const showResult = selectedOption !== null;

                  let btnStyle = 'bg-white hover:bg-amber-50/40 border-slate-200 hover:border-amber-400 text-slate-800';

                  if (showResult) {
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
                      disabled={showResult}
                      className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between gap-3 shadow-xs active:scale-[0.99] ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {labels[idx]}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {showResult && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Solution (after answering) */}
              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border-2 mb-4 leading-relaxed shadow-xs ${
                      selectedOption === currentQ.correctIndex
                        ? 'bg-white border-emerald-400 text-slate-800'
                        : 'bg-white border-rose-400 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-sm uppercase mb-1.5">
                      {selectedOption === currentQ.correctIndex ? (
                        <>
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span className="text-emerald-700">Chính xác! Lời giải chi tiết:</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="text-rose-600" />
                          <span className="text-rose-700">Chưa chính xác! Lời giải chi tiết:</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold">{currentQ.solution}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Action Button */}
              {selectedOption !== null && (
                <div className="mt-auto pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>{currentQuestionIndex < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Completed Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white p-8 rounded-3xl border-2 border-amber-400 shadow-xl"
              >
                <div className="w-20 h-20 bg-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-900 shadow-lg animate-bounce">
                  <Trophy size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">
                  Hoàn Thành Bộ Đề!
                </h2>
                <p className="text-xs text-slate-500 font-bold mb-6">
                  {activeSet.title}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                    <span className="text-xs font-extrabold text-slate-500 block uppercase">Số câu đúng</span>
                    <span className="text-3xl font-black text-emerald-600">{correctCount}/{totalQuestions}</span>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                    <span className="text-xs font-extrabold text-slate-500 block uppercase">Điểm đạt được</span>
                    <span className="text-3xl font-black text-amber-600">{correctCount * 10} đ</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl mb-6">
                  <span className="text-xs font-extrabold text-amber-900 block">
                    {correctCount === totalQuestions
                      ? '🌟 Trạng Nguyên Hình Học! Em đã nắm rất chắc các dạng toán nâng cao!'
                      : correctCount >= totalQuestions / 2
                      ? '👏 Rất đáng khen! Hãy xem lại lời giải chi tiết để nâng cao tư duy hơn nữa!'
                      : '💪 Cố gắng lên nhé! Đọc kỹ gợi ý và thử lại để chinh phục điểm tuyệt đối!'}
                  </span>
                </div>

                <button
                  onClick={handleResetSet}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 transition-all active:scale-98 cursor-pointer"
                >
                  <RotateCcw size={18} />
                  <span>Luyện Tập Lại Bộ Đề Này</span>
                </button>
              </motion.div>
            </div>
          )}

          {/* Bottom Mascot Tip */}
          <div className="hidden sm:block absolute bottom-3 right-4 pointer-events-none opacity-90 scale-90">
            <MascotCompanion message="Hãy chú ý các tỉ số diện tích nhé!" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ConquerPanel;
