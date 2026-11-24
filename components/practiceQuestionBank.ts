import { DiagramId } from './PracticeIllustrations';

export type DomainId = 'numbers' | 'geometry' | 'stats';
export type DifficultyLevel = 'Thông hiểu' | 'Vận dụng';

export interface PracticeSetMeta {
  id: string;
  domain: DomainId;
  setNumber: number;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  domain: DomainId;
  setId: string;
  difficulty: DifficultyLevel;
  text: string;
  diagramId?: DiagramId;
  options: string[];
  correctAnswer: number;
  methodHint: string;
  steps: string[];
}

export const PRACTICE_SETS: PracticeSetMeta[] = [
  // Mạch 1: Số và Phép tính (5 Bộ đề)
  {
    id: 'set_num_1',
    domain: 'numbers',
    setNumber: 1,
    title: 'Số thập phân & Phép tính',
    description: 'Cộng, trừ, nhân, chia số thập phân và giải toán nhiều bước.'
  },
  {
    id: 'set_num_2',
    domain: 'numbers',
    setNumber: 2,
    title: 'Tỉ số & Tỉ số phần trăm',
    description: 'Tính phần trăm, lãi suất, giảm giá và sản lượng thực tế.'
  },
  {
    id: 'set_num_3',
    domain: 'numbers',
    setNumber: 3,
    title: 'Bài toán tìm hai số',
    description: 'Tổng - tỉ, hiệu - tỉ và bài toán dịch dấu phẩy.'
  },
  {
    id: 'set_num_4',
    domain: 'numbers',
    setNumber: 4,
    title: 'Chuyển động đều',
    description: 'Tính quãng đường, vận tốc, gặp nhau ngược chiều và cùng chiều.'
  },
  {
    id: 'set_num_5',
    domain: 'numbers',
    setNumber: 5,
    title: 'Tìm số trung bình cộng',
    description: 'Tính số trung bình cộng, tìm giá trị chưa biết và toán tổng hợp.'
  },

  // Mạch 2: Hình học và Đo lường (4 Bộ đề)
  {
    id: 'set_geo_1',
    domain: 'geometry',
    setNumber: 1,
    title: 'Diện tích tam giác & hình thang',
    description: 'Tính diện tích, chiều cao, độ dài đáy và bài toán mở rộng hình.'
  },
  {
    id: 'set_geo_2',
    domain: 'geometry',
    setNumber: 2,
    title: 'Chu vi & Diện tích hình tròn',
    description: 'Hình tròn, nửa hình tròn, hình ghép và hình tròn đồng tâm.'
  },
  {
    id: 'set_geo_3',
    domain: 'geometry',
    setNumber: 3,
    title: 'Hình hộp chữ nhật & Hình lập phương',
    description: 'Diện tích xung quanh, toàn phần, thể tích và xếp khối lập phương.'
  },
  {
    id: 'set_geo_4',
    domain: 'geometry',
    setNumber: 4,
    title: 'Đổi đơn vị đo đại lượng',
    description: 'Quy đổi diện tích, khối lượng, thể tích, thời gian và vận tốc.'
  },

  // Mạch 3: Thống kê và Xác suất (3 Bộ đề)
  {
    id: 'set_stat_1',
    domain: 'stats',
    setNumber: 1,
    title: 'Đọc biểu đồ hình quạt tròn',
    description: 'Phân tích tỉ lệ phần trăm, tìm phần còn thiếu và so sánh số liệu.'
  },
  {
    id: 'set_stat_2',
    domain: 'stats',
    setNumber: 2,
    title: 'Đọc và phân tích biểu đồ cột',
    description: 'Đọc số liệu, so sánh, tính tỉ số phần trăm và tổng hợp từ biểu đồ cột.'
  },
  {
    id: 'set_stat_3',
    domain: 'stats',
    setNumber: 3,
    title: 'Tỉ số mô tả số lần lặp lại của sự kiện',
    description: 'Tính tỉ số kết quả thử nghiệm qua đồng xu, xúc xắc, túi bi.'
  }
];

export const QUESTION_BANK: QuizQuestion[] = [
  // =====================================================================
  // MẠCH 1: SỐ VÀ PHÉP TÍNH — BỘ ĐỀ 1 (Số thập phân & Phép tính)
  // =====================================================================
  {
    id: 1,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Đặt tính rồi tính giá trị của biểu thức: 348,25 + 176,89.',
    options: ['525,14', '524,14', '525,04', '515,14'],
    correctAnswer: 0,
    methodHint: 'Đặt tính sao cho các dấu phẩy thẳng cột với nhau, cộng từ phải sang trái và giữ nguyên dấu phẩy ở tổng.',
    steps: [
      'Phần thập phân: 0,25 + 0,89 = 1,14 (viết 14 ở phần thập phân, nhớ 1 sang phần nguyên).',
      'Phần nguyên: 348 + 176 + 1 (nhớ) = 525.',
      'Vậy 348,25 + 176,89 = 525,14.'
    ]
  },
  {
    id: 2,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Kết quả của phép trừ 1.250,4 − 674,85 là bao nhiêu?',
    options: ['576,55', '575,55', '585,55', '575,65'],
    correctAnswer: 1,
    methodHint: 'Viết thêm chữ số 0 vào bên phải số bị trừ (1.250,40) để có hai chữ số phần thập phân rồi thực hiện trừ như số tự nhiên.',
    steps: [
      'Viết lại phép tính: 1.250,40 − 674,85.',
      'Thực hiện trừ thẳng cột từ phải sang trái: 125040 − 67485 = 57555.',
      'Đặt dấu phẩy thẳng cột, ta được kết quả là 575,55.'
    ]
  },
  {
    id: 3,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Thực hiện phép nhân: 34,6 × 4,5.',
    options: ['15,57', '155,7', '154,7', '165,7'],
    correctAnswer: 1,
    methodHint: 'Nhân như nhân hai số tự nhiên 346 × 45, sau đó đếm tổng số chữ số ở phần thập phân của cả hai thừa số để đặt dấu phẩy.',
    steps: [
      'Tính 346 × 45 = 15.570.',
      'Cả hai thừa số có tất cả 1 + 1 = 2 chữ số ở phần thập phân.',
      'Tách từ phải sang trái 2 chữ số ở tích: 155,70 = 155,7.'
    ]
  },
  {
    id: 4,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Thương của phép chia 187,2 : 4,5 bằng bao nhiêu?',
    options: ['4,16', '41,6', '42,6', '41,2'],
    correctAnswer: 1,
    methodHint: 'Chuyển dấu phẩy ở cả số bị chia và số chia sang phải 1 chữ số để đưa về phép chia cho số tự nhiên: 1.872 : 45.',
    steps: [
      'Nhân cả hai số với 10: 187,2 : 4,5 = 1.872 : 45.',
      '187 chia 45 được 4 (dư 7); hạ 2 được 72 chia 45 được 1 (dư 27).',
      'Đặt dấu phẩy ở thương, thêm 0 vào dư: 270 chia 45 được 6. Kết quả: 41,6.'
    ]
  },
  {
    id: 5,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Tìm giá trị của x, biết: x + 128,75 = 405,2.',
    options: ['276,45', '277,45', '286,45', '276,55'],
    correctAnswer: 0,
    methodHint: 'Muốn tìm số hạng chưa biết, ta lấy tổng trừ đi số hạng đã biết (chú ý viết 405,2 thành 405,20).',
    steps: [
      'x = 405,20 − 128,75.',
      'Thực hiện trừ: 40520 − 12875 = 27645.',
      'Vậy x = 276,45.'
    ]
  },
  {
    id: 6,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Thông hiểu',
    text: 'Thùng thứ nhất đựng 145,8 lít dầu. Thùng thứ hai đựng ít hơn thùng thứ nhất 28,35 lít dầu. Hỏi cả hai thùng đựng bao nhiêu lít dầu?',
    options: ['263,25 lít', '264,25 lít', '253,25 lít', '117,45 lít'],
    correctAnswer: 0,
    methodHint: 'Bước 1: Tìm số lít dầu ở thùng thứ hai. Bước 2: Cộng số dầu của cả hai thùng.',
    steps: [
      'Số dầu ở thùng thứ hai là: 145,8 − 28,35 = 117,45 (lít).',
      'Tổng số dầu ở cả hai thùng là: 145,8 + 117,45 = 263,25 (lít).'
    ]
  },
  {
    id: 7,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Vận dụng',
    text: 'Tính bằng cách thuận tiện nhất giá trị biểu thức: 12,5 × 34,8 × 0,8.',
    options: ['34,8', '348', '3.480', '358'],
    correctAnswer: 1,
    methodHint: 'Áp dụng tính chất giao hoán và kết hợp của phép nhân để nhóm 12,5 × 0,8 thành số tròn chục.',
    steps: [
      'Nhóm hai thừa số dễ tính: (12,5 × 0,8) × 34,8.',
      'Ta có 12,5 × 0,8 = 10.',
      '10 × 34,8 = 348.'
    ]
  },
  {
    id: 8,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Vận dụng',
    text: 'Một cửa hàng nhập về 450 kg gạo. Ngày đầu bán được 138,4 kg, ngày thứ hai bán nhiều hơn ngày đầu 24,65 kg. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?',
    options: ['148,55 kg', '149,55 kg', '158,55 kg', '163,05 kg'],
    correctAnswer: 0,
    methodHint: 'Tính số gạo bán ngày thứ hai, tính tổng số gạo bán trong hai ngày rồi lấy 450 kg trừ đi.',
    steps: [
      'Ngày thứ hai bán được: 138,4 + 24,65 = 163,05 (kg).',
      'Cả hai ngày bán được: 138,4 + 163,05 = 301,45 (kg).',
      'Số gạo còn lại là: 450 − 301,45 = 148,55 (kg).'
    ]
  },
  {
    id: 9,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Vận dụng',
    text: 'Tích của hai số là 243,6. Nếu gấp thừa số thứ nhất lên 1,5 lần và giữ nguyên thừa số thứ hai thì tích mới bằng bao nhiêu?',
    options: ['365,4', '355,4', '364,4', '162,4'],
    correctAnswer: 0,
    methodHint: 'Khi một thừa số tăng lên k lần và thừa số kia giữ nguyên thì tích mới cũng tăng lên k lần.',
    steps: [
      'Thừa số thứ nhất gấp lên 1,5 lần nên tích mới bằng tích cũ nhân với 1,5.',
      'Tích mới là: 243,6 × 1,5 = 365,4.'
    ]
  },
  {
    id: 10,
    domain: 'numbers',
    setId: 'set_num_1',
    difficulty: 'Vận dụng',
    text: 'Một mảnh vườn hình chữ nhật có chiều dài 42,5 m, chiều rộng kém chiều dài 14,7 m. Người ta làm hàng rào xung quanh vườn và chừa cửa ra vào rộng 2,5 m. Chiều dài hàng rào cần làm là bao nhiêu mét?',
    options: ['140,6 m', '138,1 m', '135,6 m', '139,1 m'],
    correctAnswer: 1,
    methodHint: 'Tìm chiều rộng, tính chu vi hình chữ nhật rồi trừ đi chiều rộng của cửa ra vào.',
    steps: [
      'Chiều rộng mảnh vườn là: 42,5 − 14,7 = 27,8 (m).',
      'Chu vi mảnh vườn là: (42,5 + 27,8) × 2 = 70,3 × 2 = 140,6 (m).',
      'Chiều dài hàng rào là: 140,6 − 2,5 = 138,1 (m).'
    ]
  },

  // =====================================================================
  // MẠCH 1: SỐ VÀ PHÉP TÍNH — BỘ ĐỀ 2 (Tỉ số & Tỉ số phần trăm)
  // =====================================================================
  {
    id: 11,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Thông hiểu',
    text: 'Một trường tiểu học có 1.250 học sinh, trong đó có 550 học sinh nữ. Tỉ số phần trăm của số học sinh nữ và số học sinh toàn trường là bao nhiêu?',
    options: ['42%', '44%', '45%', '48%'],
    correctAnswer: 1,
    methodHint: 'Lấy số học sinh nữ chia cho tổng số học sinh toàn trường, viết dưới dạng số thập phân rồi nhân với 100%.',
    steps: [
      'Thương của 550 và 1.250 là: 550 : 1.250 = 0,44.',
      'Đổi sang tỉ số phần trăm: 0,44 = 44%.'
    ]
  },
  {
    id: 12,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Thông hiểu',
    text: 'Một kho lương thực chứa 1.800 tấn gạo. Người ta đã xuất đi 35% số gạo đó. Hỏi trong kho còn lại bao nhiêu tấn gạo?',
    options: ['630 tấn', '1.150 tấn', '1.170 tấn', '1.270 tấn'],
    correctAnswer: 2,
    methodHint: 'Tìm số phần trăm gạo còn lại (100% − 35% = 65%) rồi nhân với 1.800 tấn.',
    steps: [
      'Số phần trăm gạo còn lại trong kho chiếm: 100% − 35% = 65%.',
      'Số tấn gạo còn lại là: 1.800 × 65 : 100 = 1.170 (tấn).'
    ]
  },
  {
    id: 13,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Thông hiểu',
    text: 'Biết 28% số tiền tiết kiệm của Lan là 350.000 đồng. Hỏi tổng số tiền tiết kiệm của Lan là bao nhiêu?',
    options: ['1.150.000 đồng', '1.250.000 đồng', '1.350.000 đồng', '980.000 đồng'],
    correctAnswer: 1,
    methodHint: 'Muốn tìm một số khi biết 28% của nó là 350.000, ta lấy 350.000 chia cho 28 rồi nhân với 100.',
    steps: [
      '1% số tiền tiết kiệm của Lan là: 350.000 : 28 = 12.500 (đồng).',
      'Tổng số tiền tiết kiệm của Lan là: 12.500 × 100 = 1.250.000 (đồng).'
    ]
  },
  {
    id: 14,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Thông hiểu',
    text: 'Một chiếc xe đạp có giá niêm yết 2.450.000 đồng. Nhân dịp khai trương, cửa hàng giảm giá 12%. Khách hàng mua xe cần trả bao nhiêu tiền?',
    options: ['2.156.000 đồng', '2.165.000 đồng', '2.205.000 đồng', '2.256.000 đồng'],
    correctAnswer: 0,
    methodHint: 'Giá sau khi giảm chiếm 100% − 12% = 88% giá niêm yết.',
    steps: [
      'Số tiền được giảm là: 2.450.000 × 12 : 100 = 294.000 (đồng).',
      'Số tiền khách cần trả là: 2.450.000 − 294.000 = 2.156.000 (đồng).'
    ]
  },
  {
    id: 15,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Thông hiểu',
    text: 'Thư viện có 3.600 cuốn sách, trong đó 45% là sách tham khảo, 35% là sách giáo khoa, còn lại là truyện thiếu nhi. Hỏi thư viện có bao nhiêu cuốn truyện thiếu nhi?',
    options: ['680 cuốn', '720 cuốn', '760 cuốn', '820 cuốn'],
    correctAnswer: 1,
    methodHint: 'Tính tỉ số phần trăm của truyện thiếu nhi so với tổng số sách (100% − 45% − 35%), rồi nhân với 3.600.',
    steps: [
      'Truyện thiếu nhi chiếm: 100% − (45% + 35%) = 20% tổng số sách.',
      'Số cuốn truyện thiếu nhi là: 3.600 × 20 : 100 = 720 (cuốn).'
    ]
  },
  {
    id: 16,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Vận dụng',
    text: 'Một người gửi tiết kiệm 25.000.000 đồng với lãi suất 0,6% một tháng. Hỏi sau một tháng, người đó nhận được cả tiền gửi và tiền lãi là bao nhiêu đồng?',
    options: ['25.120.000 đồng', '25.150.000 đồng', '25.250.000 đồng', '26.500.000 đồng'],
    correctAnswer: 1,
    methodHint: 'Tính tiền lãi sau 1 tháng bằng 0,6% của 25.000.000 đồng, sau đó cộng với tiền gửi ban đầu.',
    steps: [
      'Tiền lãi sau 1 tháng là: 25.000.000 × 0,6 : 100 = 150.000 (đồng).',
      'Tổng số tiền nhận được sau 1 tháng là: 25.000.000 + 150.000 = 25.150.000 (đồng).'
    ]
  },
  {
    id: 17,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Vận dụng',
    text: 'Giá một chiếc áo ban đầu là 320.000 đồng. Tháng trước cửa hàng tăng giá 10%, tháng này lại giảm 10% so với giá tháng trước. Giá chiếc áo hiện nay là bao nhiêu?',
    options: ['320.000 đồng', '316.800 đồng', '318.000 đồng', '315.200 đồng'],
    correctAnswer: 1,
    methodHint: 'Tính giá sau khi tăng 10% của 320.000 đồng; sau đó lấy giá mới đó trừ đi 10% của chính nó.',
    steps: [
      'Giá áo tháng trước sau khi tăng 10% là: 320.000 + 320.000 × 10% = 352.000 (đồng).',
      'Giá áo tháng này sau khi giảm 10% là: 352.000 − 352.000 × 10% = 316.800 (đồng).'
    ]
  },
  {
    id: 18,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Vận dụng',
    text: 'Một xưởng may đặt kế hoạch may 1.200 bộ quần áo, nhưng thực tế đã may được 1.380 bộ. Xưởng may đã thực hiện vượt mức kế hoạch bao nhiêu phần trăm?',
    options: ['12%', '15%', '18%', '115%'],
    correctAnswer: 1,
    methodHint: 'Tìm số bộ quần áo may vượt mức rồi chia cho số bộ theo kế hoạch (1.200 bộ).',
    steps: [
      'Số bộ quần áo làm vượt kế hoạch là: 1.380 − 1.200 = 180 (bộ).',
      'Tỉ số phần trăm vượt mức kế hoạch là: 180 : 1.200 = 0,15 = 15%.'
    ]
  },
  {
    id: 19,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Vận dụng',
    text: 'Hạt tươi chứa 20% nước, hạt khô chứa 5% nước. Để thu được 400 kg hạt khô, cần mang phơi bao nhiêu ki-lô-gam hạt tươi?',
    options: ['460 kg', '475 kg', '480 kg', '500 kg'],
    correctAnswer: 1,
    methodHint: 'Lượng chất khô (không chứa nước) trong hạt tươi và hạt khô luôn bằng nhau.',
    steps: [
      'Lượng chất khô trong 400 kg hạt khô chiếm 100% − 5% = 95%, nặng: 400 × 95% = 380 (kg).',
      'Trong hạt tươi, lượng chất khô này chiếm 100% − 20% = 80% khối lượng hạt tươi.',
      'Khối lượng hạt tươi cần phơi là: 380 : 80 × 100 = 475 (kg).'
    ]
  },
  {
    id: 20,
    domain: 'numbers',
    setId: 'set_num_2',
    difficulty: 'Vận dụng',
    text: 'Khi bán một món hàng với giá 1.100.000 đồng, người bán hàng bị lỗ 12% so với tiền vốn. Hỏi tiền vốn của món hàng đó là bao nhiêu đồng?',
    options: ['1.232.000 đồng', '1.250.000 đồng', '1.240.000 đồng', '1.280.000 đồng'],
    correctAnswer: 1,
    methodHint: 'Bị lỗ 12% nghĩa là giá bán chỉ bằng 100% − 12% = 88% tiền vốn.',
    steps: [
      'Giá bán tương ứng với số phần trăm tiền vốn là: 100% − 12% = 88%.',
      'Tiền vốn của món hàng là: 1.100.000 : 88 × 100 = 1.250.000 (đồng).'
    ]
  },

  // =====================================================================
  // MẠCH 1: SỐ VÀ PHÉP TÍNH — BỘ ĐỀ 3 (Bài toán tìm hai số)
  // =====================================================================
  {
    id: 21,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Thông hiểu',
    text: 'Tổng của hai số là 675, hiệu của hai số đó là 149. Số lớn bằng bao nhiêu?',
    options: ['263', '412', '414', '422'],
    correctAnswer: 1,
    methodHint: 'Áp dụng công thức tìm hai số khi biết tổng và hiệu: Số lớn = (Tổng + Hiệu) : 2.',
    steps: [
      'Số lớn là: (675 + 149) : 2 = 824 : 2 = 412.',
      'Kiểm tra lại: Số bé = 412 − 149 = 263; 412 + 263 = 675 (đúng).'
    ]
  },
  {
    id: 22,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Thông hiểu',
    diagramId: 'so_do_ti_so_2',
    text: 'Một khu đất hình chữ nhật có chu vi 240 m. Chiều rộng bằng 3/5 chiều dài. Tính diện tích khu đất đó.',
    options: ['3.375 m²', '3.275 m²', '3.450 m²', '13.500 m²'],
    correctAnswer: 0,
    methodHint: 'Tính nửa chu vi (tổng chiều dài và chiều rộng), giải bài toán tổng - tỉ để tìm chiều rộng, chiều dài rồi tính diện tích.',
    steps: [
      'Nửa chu vi khu đất là: 240 : 2 = 120 (m).',
      'Tổng số phần bằng nhau: 3 + 5 = 8 (phần).',
      'Chiều rộng: 120 : 8 × 3 = 45 (m); Chiều dài: 120 − 45 = 75 (m).',
      'Diện tích khu đất: 45 × 75 = 3.375 (m²).'
    ]
  },
  {
    id: 23,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Thông hiểu',
    diagramId: 'so_do_hieu_ti_2',
    text: 'Một nhà máy có số công nhân nam bằng 4/9 số công nhân nữ. Biết số công nhân nữ nhiều hơn số công nhân nam 315 người. Hỏi nhà máy có tất cả bao nhiêu công nhân?',
    options: ['567 người', '819 người', '829 người', '756 người'],
    correctAnswer: 1,
    methodHint: 'Tìm hiệu số phần bằng nhau (9 − 4 = 5 phần), tính giá trị 1 phần rồi nhân với tổng số phần (4 + 9 = 13 phần).',
    steps: [
      'Hiệu số phần bằng nhau là: 9 − 4 = 5 (phần).',
      'Giá trị 1 phần là: 315 : 5 = 63 (người).',
      'Tổng số công nhân là: 63 × (4 + 9) = 63 × 13 = 819 (người).'
    ]
  },
  {
    id: 24,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Thông hiểu',
    text: 'Hai kho thóc chứa tất cả 1.440 tấn thóc. Nếu chuyển 120 tấn từ kho A sang kho B thì kho A vẫn nhiều hơn kho B 80 tấn. Hỏi lúc đầu kho A có bao nhiêu tấn thóc?',
    options: ['800 tấn', '840 tấn', '880 tấn', '920 tấn'],
    correctAnswer: 2,
    methodHint: 'Khi chuyển 120 tấn từ A sang B thì hiệu giữa A và B giảm đi 120 × 2 = 240 tấn. Từ đó suy ra hiệu ban đầu của hai kho.',
    steps: [
      'Lúc đầu kho A nhiều hơn kho B là: 120 × 2 + 80 = 320 (tấn).',
      'Số thóc ban đầu của kho A là: (1.440 + 320) : 2 = 1.760 : 2 = 880 (tấn).'
    ]
  },
  {
    id: 25,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Thông hiểu',
    text: 'Trung bình cộng của hai số là 382,5. Biết số thứ nhất bằng 2/3 số thứ hai. Tìm số lớn.',
    options: ['306', '459', '469', '510'],
    correctAnswer: 1,
    methodHint: 'Tìm tổng của hai số bằng cách lấy trung bình cộng nhân với 2, rồi giải bài toán tổng - tỉ.',
    steps: [
      'Tổng của hai số là: 382,5 × 2 = 765.',
      'Tổng số phần bằng nhau: 2 + 3 = 5 (phần).',
      'Số lớn (số thứ hai) là: 765 : 5 × 3 = 459.'
    ]
  },
  {
    id: 26,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Vận dụng',
    text: 'Hiệu của hai số thập phân là 186,3. Nếu chuyển dấu phẩy của số bé sang bên phải một chữ số thì được số lớn. Tìm số lớn.',
    options: ['20,7', '207', '197', '217'],
    correctAnswer: 1,
    methodHint: 'Chuyển dấu phẩy của một số thập phân sang bên phải một chữ số thì số đó gấp lên 10 lần. Giải bài toán hiệu - tỉ với tỉ số 1/10.',
    steps: [
      'Chuyển dấu phẩy sang phải 1 chữ số làm số đó tăng 10 lần, nên số lớn gấp 10 lần số bé.',
      'Hiệu số phần bằng nhau: 10 − 1 = 9 (phần).',
      'Số bé là: 186,3 : 9 = 20,7.',
      'Số lớn là: 20,7 × 10 = 207.'
    ]
  },
  {
    id: 27,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Vận dụng',
    text: 'Ba lớp 5A, 5B, 5C quyên góp được 1.300 quyển vở. Số vở lớp 5A bằng 3/4 số vở lớp 5B, còn số vở lớp 5C gấp rưỡi số vở lớp 5B. Hỏi lớp 5C quyên góp được bao nhiêu quyển vở?',
    options: ['300 quyển', '400 quyển', '500 quyển', '600 quyển'],
    correctAnswer: 3,
    methodHint: 'Biểu diễn số vở mỗi lớp theo phần bằng nhau dựa vào lớp 5B (gấp rưỡi = 3/2 = 6/4).',
    steps: [
      'Lớp 5A = 3/4 lớp 5B; lớp 5C = 3/2 = 6/4 lớp 5B.',
      'Coi lớp 5B là 4 phần thì lớp 5A là 3 phần và lớp 5C là 6 phần.',
      'Tổng số phần bằng nhau: 3 + 4 + 6 = 13 (phần).',
      'Số vở lớp 5C là: 1.300 : 13 × 6 = 600 (quyển).'
    ]
  },
  {
    id: 28,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Vận dụng',
    text: 'Hiện nay tổng số tuổi của hai mẹ con là 56 tuổi. Cách đây 4 năm, tuổi mẹ gấp 5 lần tuổi con. Hỏi hiện nay mẹ bao nhiêu tuổi?',
    options: ['40 tuổi', '42 tuổi', '44 tuổi', '46 tuổi'],
    correctAnswer: 2,
    methodHint: 'Cách đây 4 năm, mỗi người đều ít hơn hiện nay 4 tuổi nên tổng số tuổi của hai mẹ con giảm đi 8 tuổi.',
    steps: [
      'Tổng số tuổi của hai mẹ con cách đây 4 năm là: 56 − 4 × 2 = 48 (tuổi).',
      'Tổng số phần bằng nhau lúc đó: 5 + 1 = 6 (phần).',
      'Tuổi mẹ cách đây 4 năm là: 48 : 6 × 5 = 40 (tuổi).',
      'Tuổi mẹ hiện nay là: 40 + 4 = 44 (tuổi).'
    ]
  },
  {
    id: 29,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Vận dụng',
    text: 'Tổng của hai số là 158,4. Nếu chuyển dấu phẩy của số thứ nhất sang bên trái một chữ số thì được số thứ hai. Tìm số thứ nhất.',
    options: ['14,4', '144', '142', '134'],
    correctAnswer: 1,
    methodHint: 'Chuyển dấu phẩy của số thứ nhất sang bên trái 1 chữ số nghĩa là số thứ nhất gấp 10 lần số thứ hai.',
    steps: [
      'Số thứ nhất gấp 10 lần số thứ hai nên tổng số phần bằng nhau là: 10 + 1 = 11 (phần).',
      'Số thứ hai là: 158,4 : 11 = 14,4.',
      'Số thứ nhất là: 14,4 × 10 = 144.'
    ]
  },
  {
    id: 30,
    domain: 'numbers',
    setId: 'set_num_3',
    difficulty: 'Vận dụng',
    text: 'Một hình chữ nhật có chiều dài hơn chiều rộng 24,6 m. Nếu bớt mỗi chiều đi 2,4 m thì chiều dài mới gấp 4 lần chiều rộng mới. Tính diện tích hình chữ nhật ban đầu.',
    options: ['373,12 m²', '363,12 m²', '288,64 m²', '383,12 m²'],
    correctAnswer: 0,
    methodHint: 'Khi cùng bớt mỗi chiều đi một độ dài như nhau thì hiệu giữa chiều dài và chiều rộng không đổi (vẫn bằng 24,6 m).',
    steps: [
      'Hiệu chiều dài mới và chiều rộng mới vẫn là 24,6 m, tương ứng với 4 − 1 = 3 (phần).',
      'Chiều rộng mới là: 24,6 : 3 = 8,2 (m).',
      'Chiều rộng ban đầu: 8,2 + 2,4 = 10,6 (m); Chiều dài ban đầu: 10,6 + 24,6 = 35,2 (m).',
      'Diện tích ban đầu là: 35,2 × 10,6 = 373,12 (m²).'
    ]
  },

  // =====================================================================
  // MẠCH 1: SỐ VÀ PHÉP TÍNH — BỘ ĐỀ 4 (Chuyển động đều)
  // =====================================================================
  {
    id: 31,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Thông hiểu',
    diagramId: 'chuyen_dong_2',
    text: 'Một ô tô đi với vận tốc 45,5 km/giờ trong thời gian 3 giờ 30 phút. Quãng đường ô tô đi được dài bao nhiêu ki-lô-mét?',
    options: ['159,25 km', '158,25 km', '150,15 km', '169,25 km'],
    correctAnswer: 0,
    methodHint: 'Đổi thời gian 3 giờ 30 phút sang số thập phân (3,5 giờ), sau đó tính quãng đường s = v × t.',
    steps: [
      'Đổi 3 giờ 30 phút = 3,5 giờ.',
      'Quãng đường ô tô đi được là: 45,5 × 3,5 = 159,25 (km).'
    ]
  },
  {
    id: 32,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Thông hiểu',
    text: 'Quãng đường AB dài 234 km. Một xe máy đi từ A lúc 7 giờ 15 phút với vận tốc 39 km/giờ. Hỏi xe máy đến B lúc mấy giờ?',
    options: ['12 giờ 15 phút', '13 giờ 15 phút', '13 giờ 45 phút', '14 giờ 15 phút'],
    correctAnswer: 1,
    methodHint: 'Tính thời gian xe máy đi hết quãng đường (t = s : v), rồi cộng vào thời điểm xuất phát.',
    steps: [
      'Thời gian xe máy đi từ A đến B là: 234 : 39 = 6 (giờ).',
      'Xe máy đến B lúc: 7 giờ 15 phút + 6 giờ = 13 giờ 15 phút.'
    ]
  },
  {
    id: 33,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Thông hiểu',
    text: 'Một người đi xe đạp đi được quãng đường 37,8 km hết 2 giờ 15 phút. Tính vận tốc của người đi xe đạp.',
    options: ['16,4 km/giờ', '16,8 km/giờ', '17,2 km/giờ', '18,2 km/giờ'],
    correctAnswer: 1,
    methodHint: 'Đổi 2 giờ 15 phút ra đơn vị giờ (2,25 giờ), sau đó lấy quãng đường chia cho thời gian.',
    steps: [
      'Đổi 2 giờ 15 phút = 2,25 giờ.',
      'Vận tốc của người đi xe đạp là: 37,8 : 2,25 = 16,8 (km/giờ).'
    ]
  },
  {
    id: 34,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Thông hiểu',
    diagramId: 'chuyen_dong_nguoc_2',
    text: 'Hai tỉnh A và B cách nhau 245,7 km. Lúc 6 giờ 30 phút, một ô tô đi từ A về B với vận tốc 52,5 km/giờ và cùng lúc đó một xe máy đi từ B về A với vận tốc 38,5 km/giờ. Hỏi hai xe gặp nhau lúc mấy giờ?',
    options: ['9 giờ 02 phút', '9 giờ 12 phút', '9 giờ 22 phút', '8 giờ 42 phút'],
    correctAnswer: 1,
    methodHint: 'Tính tổng vận tốc của hai xe, lấy quãng đường AB chia cho tổng vận tốc để tìm thời gian đi đến lúc gặp nhau.',
    steps: [
      'Tổng vận tốc của hai xe là: 52,5 + 38,5 = 91 (km/giờ).',
      'Thời gian hai xe đi để gặp nhau là: 245,7 : 91 = 2,7 (giờ) = 2 giờ 42 phút.',
      'Hai xe gặp nhau lúc: 6 giờ 30 phút + 2 giờ 42 phút = 9 giờ 12 phút.'
    ]
  },
  {
    id: 35,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Thông hiểu',
    text: 'Một ô tô xuất phát từ A lúc 7 giờ 40 phút để đến B cách A 126 km với vận tốc 56 km/giờ. Dọc đường xe nghỉ 25 phút. Hỏi ô tô đến B lúc mấy giờ?',
    options: ['10 giờ 15 phút', '10 giờ 20 phút', '10 giờ 25 phút', '9 giờ 55 phút'],
    correctAnswer: 1,
    methodHint: 'Tính thời gian xe chạy thực tế, cộng thêm 25 phút nghỉ rồi cộng vào thời điểm xuất phát.',
    steps: [
      'Thời gian ô tô chạy trên đường là: 126 : 56 = 2,25 (giờ) = 2 giờ 15 phút.',
      'Thời điểm ô tô đến B là: 7 giờ 40 phút + 2 giờ 15 phút + 25 phút = 10 giờ 20 phút.'
    ]
  },
  {
    id: 36,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Vận dụng',
    text: 'Lúc 6 giờ 45 phút, một xe máy đi từ A với vận tốc 36 km/giờ. Đến 8 giờ 15 phút, một ô tô đuổi theo từ A với vận tốc 54 km/giờ. Hỏi ô tô đuổi kịp xe máy lúc mấy giờ?',
    options: ['10 giờ 45 phút', '11 giờ 15 phút', '11 giờ 30 phút', '12 giờ 15 phút'],
    correctAnswer: 1,
    methodHint: 'Tính quãng đường xe máy đi trước trong 1,5 giờ, rồi chia cho hiệu vận tốc hai xe để tìm thời gian đuổi kịp.',
    steps: [
      'Thời gian xe máy đi trước ô tô: 8 giờ 15 phút − 6 giờ 45 phút = 1,5 (giờ).',
      'Khi ô tô xuất phát, xe máy cách A là: 36 × 1,5 = 54 (km).',
      'Thời gian ô tô đuổi kịp xe máy: 54 : (54 − 36) = 3 (giờ).',
      'Ô tô đuổi kịp xe máy lúc: 8 giờ 15 phút + 3 giờ = 11 giờ 15 phút.'
    ]
  },
  {
    id: 37,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Vận dụng',
    text: 'Một ca nô có vận tốc khi nước lặng là 24,5 km/giờ, vận tốc dòng nước là 3,5 km/giờ. Biết quãng sông AB dài 84 km. Tính tổng thời gian ca nô đi xuôi dòng từ A đến B rồi ngược dòng từ B về A.',
    options: ['6 giờ', '7 giờ', '7,5 giờ', '8 giờ'],
    correctAnswer: 1,
    methodHint: 'Vận tốc xuôi dòng = Vận tốc thực + Vận tốc nước; Vận tốc ngược dòng = Vận tốc thực − Vận tốc nước.',
    steps: [
      'Vận tốc xuôi dòng: 24,5 + 3,5 = 28 (km/giờ) → Thời gian xuôi dòng: 84 : 28 = 3 (giờ).',
      'Vận tốc ngược dòng: 24,5 − 3,5 = 21 (km/giờ) → Thời gian ngược dòng: 84 : 21 = 4 (giờ).',
      'Tổng thời gian cả đi và về là: 3 + 4 = 7 (giờ).'
    ]
  },
  {
    id: 38,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Vận dụng',
    text: 'Một đoàn tàu dài 180 m chạy với vận tốc 45 km/giờ. Hỏi tàu chạy qua hết một cây cầu dài 420 m trong thời gian bao nhiêu giây?',
    options: ['36 giây', '42 giây', '48 giây', '54 giây'],
    correctAnswer: 2,
    methodHint: 'Quãng đường tàu đi để qua hết cầu bằng tổng chiều dài cây cầu và chiều dài đoàn tàu. Đổi vận tốc sang m/giây.',
    steps: [
      'Đổi vận tốc: 45 km/giờ = 45.000 m / 3.600 giây = 12,5 (m/giây).',
      'Tổng quãng đường tàu phải đi: 420 + 180 = 600 (m).',
      'Thời gian tàu qua hết cầu: 600 : 12,5 = 48 (giây).'
    ]
  },
  {
    id: 39,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Vận dụng',
    text: 'Một ô tô đi từ A đến B dài 162 km với vận tốc 54 km/giờ, lúc về từ B về A đi với vận tốc 36 km/giờ. Tính vận tốc trung bình của ô tô trên cả quãng đường đi và về.',
    options: ['45 km/giờ', '43,2 km/giờ', '44,5 km/giờ', '42,4 km/giờ'],
    correctAnswer: 1,
    methodHint: 'Vận tốc trung bình bằng tổng quãng đường cả đi lẫn về chia cho tổng thời gian cả đi lẫn về (không lấy trung bình cộng hai vận tốc).',
    steps: [
      'Thời gian lúc đi: 162 : 54 = 3 (giờ); Thời gian lúc về: 162 : 36 = 4,5 (giờ).',
      'Tổng quãng đường cả đi và về: 162 × 2 = 324 (km).',
      'Vận tốc trung bình là: 324 : (3 + 4,5) = 324 : 7,5 = 43,2 (km/giờ).'
    ]
  },
  {
    id: 40,
    domain: 'numbers',
    setId: 'set_num_4',
    difficulty: 'Vận dụng',
    text: 'Một ô tô dự định đi quãng đường 180 km trong 3 giờ. Sau khi đi được 1,5 giờ với vận tốc dự định, xe nghỉ dọc đường 15 phút. Để đến đúng thời gian dự định, trên quãng đường còn lại xe phải đi với vận tốc bao nhiêu?',
    options: ['68 km/giờ', '72 km/giờ', '75 km/giờ', '80 km/giờ'],
    correctAnswer: 1,
    methodHint: 'Tìm vận tốc dự định, tính quãng đường đã đi trong 1,5 giờ và thời gian còn lại sau khi trừ 15 phút (0,25 giờ) nghỉ.',
    steps: [
      'Vận tốc dự định: 180 : 3 = 60 (km/giờ).',
      'Quãng đường còn lại sau 1,5 giờ: 180 − (60 × 1,5) = 90 (km).',
      'Thời gian còn lại: 3 − 1,5 − 0,25 = 1,25 (giờ).',
      'Vận tốc cần đi trên quãng đường còn lại: 90 : 1,25 = 72 (km/giờ).'
    ]
  },

  // =====================================================================
  // MẠCH 1: SỐ VÀ PHÉP TÍNH — BỘ ĐỀ 5 (Tìm số trung bình cộng)
  // =====================================================================
  {
    id: 111,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Thông hiểu',
    text: 'Tìm số trung bình cộng của bốn số sau: 245,5; 318,4; 276,6 và 359,5.',
    options: ['295', '300', '305', '310'],
    correctAnswer: 1,
    methodHint: 'Tính tổng của bốn số rồi chia cho 4 (có thể ghép cặp các số có tổng tròn chục).',
    steps: [
      'Tổng bốn số là: (245,5 + 359,5) + (318,4 + 276,6) = 605 + 595 = 1.200.',
      'Trung bình cộng của bốn số là: 1.200 : 4 = 300.'
    ]
  },
  {
    id: 112,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Thông hiểu',
    text: 'Một tổ sản xuất 3 ngày đầu làm được lần lượt 245, 268 và 279 sản phẩm. Ngày thứ tư tổ làm được nhiều hơn trung bình cộng của 3 ngày đầu là 18 sản phẩm. Hỏi ngày thứ tư tổ làm được bao nhiêu sản phẩm?',
    options: ['278 sản phẩm', '282 sản phẩm', '284 sản phẩm', '292 sản phẩm'],
    correctAnswer: 1,
    methodHint: 'Tính số sản phẩm trung bình của 3 ngày đầu rồi cộng thêm 18.',
    steps: [
      'Trung bình cộng của 3 ngày đầu là: (245 + 268 + 279) : 3 = 792 : 3 = 264 (sản phẩm).',
      'Số sản phẩm ngày thứ tư làm được là: 264 + 18 = 282 (sản phẩm).'
    ]
  },
  {
    id: 113,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Thông hiểu',
    text: 'Trung bình cộng của 5 số là 246,4. Nếu bỏ đi một số thì trung bình cộng của 4 số còn lại là 235. Tìm số bị bỏ đi.',
    options: ['282', '292', '296', '302'],
    correctAnswer: 1,
    methodHint: 'Tính tổng của 5 số (nhân 5) và tổng của 4 số còn lại (nhân 4), hiệu hai tổng chính là số bị bỏ đi.',
    steps: [
      'Tổng của 5 số là: 246,4 × 5 = 1.232.',
      'Tổng của 4 số còn lại là: 235 × 4 = 940.',
      'Số bị bỏ đi là: 1.232 − 940 = 292.'
    ]
  },
  {
    id: 114,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Thông hiểu',
    text: 'Một đội vận tải có 5 xe lớn và 4 xe nhỏ. Mỗi xe lớn chở 4,6 tấn hàng, mỗi xe nhỏ chở 2,8 tấn hàng. Hỏi trung bình mỗi xe trong đội chở được bao nhiêu tấn hàng?',
    options: ['3,6 tấn', '3,7 tấn', '3,8 tấn', '3,9 tấn'],
    correctAnswer: 2,
    methodHint: 'Tính tổng khối lượng hàng của tất cả 9 xe rồi chia cho 9.',
    steps: [
      'Tổng số hàng 5 xe lớn và 4 xe nhỏ chở là: 5 × 4,6 + 4 × 2,8 = 23 + 11,2 = 34,2 (tấn).',
      'Trung bình mỗi xe chở được: 34,2 : (5 + 4) = 34,2 : 9 = 3,8 (tấn).'
    ]
  },
  {
    id: 115,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Thông hiểu',
    text: 'Trung bình cộng của hai số là 427,5. Biết số thứ nhất bằng 3/2 số thứ hai. Tìm số thứ nhất.',
    options: ['342', '513', '523', '543'],
    correctAnswer: 1,
    methodHint: 'Tìm tổng hai số (427,5 × 2) rồi giải bài toán tổng - tỉ để tìm số thứ nhất.',
    steps: [
      'Tổng hai số là: 427,5 × 2 = 855.',
      'Tổng số phần bằng nhau: 3 + 2 = 5 (phần).',
      'Số thứ nhất là: 855 : 5 × 3 = 513.'
    ]
  },
  {
    id: 116,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Vận dụng',
    text: 'Một đoàn xe chở hàng gồm 2 tốp: tốp thứ nhất có 4 xe, mỗi xe chở 3,25 tấn; tốp thứ hai có 6 xe, mỗi xe chở 4,25 tấn. Hỏi trung bình mỗi xe trong đoàn chở được bao nhiêu tấn hàng?',
    options: ['3,75 tấn', '3,85 tấn', '3,95 tấn', '3,65 tấn'],
    correctAnswer: 1,
    methodHint: 'Lấy tổng số tấn hàng của cả 10 xe chia cho tổng số xe là 4 + 6 = 10 xe.',
    steps: [
      'Tổng số hàng cả đoàn chở được: 4 × 3,25 + 6 × 4,25 = 13 + 25,5 = 38,5 (tấn).',
      'Trung bình mỗi xe chở được: 38,5 : (4 + 6) = 38,5 : 10 = 3,85 (tấn).'
    ]
  },
  {
    id: 117,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Vận dụng',
    text: 'Trung bình cộng của 4 số là 360. Số thứ nhất là 240, số thứ hai bằng 3/2 số thứ nhất, số thứ ba kém số thứ tư 60 đơn vị. Tìm số thứ tư.',
    options: ['390', '420', '450', '480'],
    correctAnswer: 2,
    methodHint: 'Tính tổng 4 số, tìm số thứ hai, suy ra tổng của số thứ ba và số thứ tư rồi giải bài toán tổng - hiệu.',
    steps: [
      'Tổng của 4 số: 360 × 4 = 1.440; Số thứ hai: 240 × 3 : 2 = 360.',
      'Tổng của số thứ ba và số thứ tư: 1.440 − (240 + 360) = 840.',
      'Số thứ tư là: (840 + 60) : 2 = 450.'
    ]
  },
  {
    id: 118,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Vận dụng',
    text: 'Lớp 5A có 35 học sinh đạt điểm kiểm tra trung bình là 8,2 điểm. Lớp 5B có 45 học sinh đạt điểm trung bình là 8,6 điểm. Tính điểm trung bình chung của tất cả học sinh hai lớp.',
    options: ['8,4 điểm', '8,425 điểm', '8,45 điểm', '8,375 điểm'],
    correctAnswer: 1,
    methodHint: 'Tính tổng điểm của lớp 5A và lớp 5B, rồi chia cho tổng số học sinh của cả hai lớp (80 học sinh).',
    steps: [
      'Tổng điểm lớp 5A: 35 × 8,2 = 287; Tổng điểm lớp 5B: 45 × 8,6 = 387.',
      'Tổng điểm hai lớp: 287 + 387 = 674 (điểm); Tổng số học sinh: 35 + 45 = 80 (học sinh).',
      'Điểm trung bình chung là: 674 : 80 = 8,425 (điểm).'
    ]
  },
  {
    id: 119,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Vận dụng',
    text: 'Trong 4 ngày, trung bình mỗi ngày cửa hàng bán được 425 kg gạo. Nếu không tính ngày thứ tư thì trung bình 3 ngày đầu bán được 410 kg. Hỏi ngày thứ tư bán được nhiều hơn mức trung bình 3 ngày đầu bao nhiêu ki-lô-gam?',
    options: ['45 kg', '55 kg', '60 kg', '75 kg'],
    correctAnswer: 2,
    methodHint: 'Tìm số gạo bán được ở ngày thứ tư bằng cách lấy tổng 4 ngày trừ đi tổng 3 ngày đầu, sau đó so sánh với 410 kg.',
    steps: [
      'Số gạo bán ngày thứ tư là: 425 × 4 − 410 × 3 = 1.700 − 1.230 = 470 (kg).',
      'Ngày thứ tư bán nhiều hơn mức trung bình 3 ngày đầu là: 470 − 410 = 60 (kg).'
    ]
  },
  {
    id: 120,
    domain: 'numbers',
    setId: 'set_num_5',
    difficulty: 'Vận dụng',
    text: 'Trung bình cộng của ba số là 385. Biết số thứ nhất lớn hơn số thứ hai 45 đơn vị và bé hơn số thứ ba 75 đơn vị. Tìm số thứ hai.',
    options: ['330', '345', '375', '450'],
    correctAnswer: 0,
    methodHint: 'Tính tổng ba số (385 × 3 = 1.155). Biểu diễn số thứ nhất và số thứ ba theo số thứ hai để tìm số thứ hai.',
    steps: [
      'Tổng ba số là: 385 × 3 = 1.155.',
      'Số thứ nhất = Số thứ hai + 45; Số thứ ba = Số thứ nhất + 75 = Số thứ hai + 120.',
      'Ba lần số thứ hai là: 1.155 − (45 + 120) = 990 → Số thứ hai là: 990 : 3 = 330.'
    ]
  },

  // =====================================================================
  // MẠCH 2: HÌNH HỌC VÀ ĐO LƯỜNG — BỘ ĐỀ 1 (Tam giác & Hình thang)
  // =====================================================================
  {
    id: 41,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Thông hiểu',
    diagramId: 'tam_giac_2',
    text: 'Tính diện tích hình tam giác có độ dài đáy 24,5 cm và chiều cao 12,4 cm.',
    options: ['151,9 cm²', '303,8 cm²', '141,9 cm²', '152,9 cm²'],
    correctAnswer: 0,
    methodHint: 'Áp dụng công thức tính diện tích tam giác: S = (đáy × chiều cao) : 2.',
    steps: [
      'Diện tích hình tam giác là: (24,5 × 12,4) : 2 = 303,8 : 2 = 151,9 (cm²).'
    ]
  },
  {
    id: 42,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Thông hiểu',
    text: 'Một thửa ruộng hình tam giác có diện tích 427,5 m² và chiều cao 19 m. Độ dài cạnh đáy của thửa ruộng đó là bao nhiêu mét?',
    options: ['22,5 m', '45 m', '42 m', '48 m'],
    correctAnswer: 1,
    methodHint: 'Từ S = (a × h) : 2, suy ra độ dài đáy a = (S × 2) : h.',
    steps: [
      'Độ dài cạnh đáy thửa ruộng là: (427,5 × 2) : 19 = 855 : 19 = 45 (m).'
    ]
  },
  {
    id: 43,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Thông hiểu',
    diagramId: 'hinh_thang_2',
    text: 'Một mảnh đất hình thang có đáy lớn 42,5 m, đáy bé 27,5 m và chiều cao 18,4 m. Diện tích mảnh đất đó bằng bao nhiêu mét vuông?',
    options: ['644 m²', '1.288 m²', '624 m²', '654 m²'],
    correctAnswer: 0,
    methodHint: 'Diện tích hình thang bằng tổng độ dài hai đáy nhân với chiều cao rồi chia cho 2.',
    steps: [
      'Tổng độ dài hai đáy là: 42,5 + 27,5 = 70 (m).',
      'Diện tích mảnh đất hình thang là: 70 × 18,4 : 2 = 644 (m²).'
    ]
  },
  {
    id: 44,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Thông hiểu',
    text: 'Một hình thang có diện tích 360 cm² và tổng độ dài hai đáy là 45 cm. Chiều cao của hình thang đó là bao nhiêu xăng-ti-mét?',
    options: ['8 cm', '12 cm', '16 cm', '18 cm'],
    correctAnswer: 2,
    methodHint: 'Chiều cao hình thang = (Diện tích × 2) : Tổng độ dài hai đáy.',
    steps: [
      'Chiều cao của hình thang là: (360 × 2) : 45 = 720 : 45 = 16 (cm).'
    ]
  },
  {
    id: 45,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Thông hiểu',
    text: 'Một hình thang có đáy bé 18 cm, đáy lớn gấp rưỡi đáy bé, chiều cao bằng trung bình cộng độ dài hai đáy. Tính diện tích hình thang đó.',
    options: ['506,25 cm²', '1.012,5 cm²', '486,25 cm²', '516,25 cm²'],
    correctAnswer: 0,
    methodHint: 'Tìm đáy lớn (18 × 1,5), tìm chiều cao là trung bình cộng hai đáy rồi áp dụng công thức diện tích hình thang.',
    steps: [
      'Đáy lớn là: 18 × 1,5 = 27 (cm).',
      'Chiều cao là: (18 + 27) : 2 = 22,5 (cm).',
      'Diện tích hình thang là: (18 + 27) × 22,5 : 2 = 506,25 (cm²).'
    ]
  },
  {
    id: 46,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Vận dụng',
    diagramId: 'tam_giac_dien_tich_2',
    text: 'Cho tam giác ABC có độ dài đáy BC = 25 cm. Nếu kéo dài đáy BC thêm 6,5 cm thì diện tích tam giác tăng thêm 45,5 cm². Tính diện tích tam giác ABC ban đầu.',
    options: ['165 cm²', '175 cm²', '185 cm²', '350 cm²'],
    correctAnswer: 1,
    methodHint: 'Phần diện tích tăng thêm chính là diện tích tam giác có đáy 6,5 cm và có cùng chiều cao với tam giác ABC.',
    steps: [
      'Chiều cao của tam giác ABC là: (45,5 × 2) : 6,5 = 91 : 6,5 = 14 (cm).',
      'Diện tích tam giác ABC ban đầu là: (25 × 14) : 2 = 175 (cm²).'
    ]
  },
  {
    id: 47,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Vận dụng',
    text: 'Một thửa ruộng hình thang có diện tích 1.080 m², chiều cao 24 m. Biết đáy lớn hơn đáy bé 14 m. Tính độ dài đáy lớn của thửa ruộng đó.',
    options: ['38 m', '48 m', '52 m', '56 m'],
    correctAnswer: 2,
    methodHint: 'Tìm tổng hai đáy từ diện tích và chiều cao, sau đó giải bài toán tổng - hiệu để tìm đáy lớn.',
    steps: [
      'Tổng độ dài hai đáy là: (1.080 × 2) : 24 = 90 (m).',
      'Độ dài đáy lớn là: (90 + 14) : 2 = 52 (m).'
    ]
  },
  {
    id: 48,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Vận dụng',
    text: 'Một hình thang vuông có đáy bé 16,5 cm, đáy lớn 24,5 cm và chiều cao 12 cm. Nếu mở rộng đáy bé để được hình chữ nhật thì diện tích phần tăng thêm là bao nhiêu?',
    options: ['48 cm²', '96 cm²', '36 cm²', '54 cm²'],
    correctAnswer: 0,
    methodHint: 'Phần mở rộng thêm để thành hình chữ nhật là một tam giác vuông có đáy bằng hiệu hai đáy và chiều cao bằng 12 cm.',
    steps: [
      'Phần mở rộng là hình tam giác vuông có cạnh đáy: 24,5 − 16,5 = 8 (cm).',
      'Diện tích phần tăng thêm là: (8 × 12) : 2 = 48 (cm²).'
    ]
  },
  {
    id: 49,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Vận dụng',
    text: 'Một mảnh vườn hình tam giác có đáy 36 m, chiều cao 24,5 m. Người ta dành 60% diện tích mảnh vườn để trồng rau sạch. Tính diện tích trồng rau sạch.',
    options: ['264,6 m²', '529,2 m²', '441 m²', '254,6 m²'],
    correctAnswer: 0,
    methodHint: 'Tính diện tích cả mảnh vườn hình tam giác, sau đó nhân với 60%.',
    steps: [
      'Diện tích mảnh vườn hình tam giác là: (36 × 24,5) : 2 = 441 (m²).',
      'Diện tích trồng rau sạch là: 441 × 60 : 100 = 264,6 (m²).'
    ]
  },
  {
    id: 50,
    domain: 'geometry',
    setId: 'set_geo_1',
    difficulty: 'Vận dụng',
    text: 'Cho hình chữ nhật ABCD có chiều dài AB = 32 cm, chiều rộng BC = 18,5 cm. Lấy điểm M nằm trên cạnh AB. Tính tổng diện tích của hai tam giác AMD và MBC.',
    options: ['296 cm²', '592 cm²', '286 cm²', '148 cm²'],
    correctAnswer: 0,
    methodHint: 'Tam giác MDC có đáy DC = 32 cm và chiều cao 18,5 cm nên diện tích bằng một nửa diện tích hình chữ nhật ABCD.',
    steps: [
      'Diện tích hình chữ nhật ABCD là: 32 × 18,5 = 592 (cm²).',
      'Diện tích tam giác MDC là: (32 × 18,5) : 2 = 296 (cm²).',
      'Tổng diện tích hai tam giác AMD và MBC là: 592 − 296 = 296 (cm²).'
    ]
  },

  // =====================================================================
  // MẠCH 2: HÌNH HỌC VÀ ĐO LƯỜNG — BỘ ĐỀ 2 (Chu vi & Diện tích hình tròn)
  // =====================================================================
  {
    id: 51,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Thông hiểu',
    diagramId: 'hinh_tron_d_2',
    text: 'Tính chu vi của một sân khấu hình tròn có đường kính d = 12,5 m.',
    options: ['39,25 m', '78,5 m', '38,25 m', '40,25 m'],
    correctAnswer: 0,
    methodHint: 'Chu vi hình tròn bằng đường kính nhân với 3,14 (C = d × 3,14).',
    steps: [
      'Chu vi sân khấu hình tròn là: 12,5 × 3,14 = 39,25 (m).'
    ]
  },
  {
    id: 52,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Thông hiểu',
    diagramId: 'hinh_tron_r_2',
    text: 'Một mặt bàn hình tròn có bán kính r = 1,2 m. Tính diện tích mặt bàn đó theo đơn vị đề-xi-mét vuông (dm²).',
    options: ['45,216 dm²', '452,16 dm²', '4.521,6 dm²', '75,36 dm²'],
    correctAnswer: 1,
    methodHint: 'Đổi bán kính 1,2 m = 12 dm trước khi áp dụng công thức diện tích S = r × r × 3,14.',
    steps: [
      'Đổi 1,2 m = 12 dm.',
      'Diện tích mặt bàn là: 12 × 12 × 3,14 = 144 × 3,14 = 452,16 (dm²).'
    ]
  },
  {
    id: 53,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Thông hiểu',
    text: 'Một bồn hoa hình tròn có chu vi 78,5 m. Tính diện tích của bồn hoa đó.',
    options: ['490,625 m²', '1.962,5 m²', '480,625 m²', '392,5 m²'],
    correctAnswer: 0,
    methodHint: 'Từ chu vi C = 78,5 m, tìm đường kính (C : 3,14), chia đôi để tìm bán kính rồi tính diện tích.',
    steps: [
      'Đường kính bồn hoa là: 78,5 : 3,14 = 25 (m).',
      'Bán kính bồn hoa là: 25 : 2 = 12,5 (m).',
      'Diện tích bồn hoa là: 12,5 × 12,5 × 3,14 = 490,625 (m²).'
    ]
  },
  {
    id: 54,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Thông hiểu',
    text: 'Một bánh xe ô tô có bán kính 0,35 m. Khi bánh xe lăn trên mặt đường đúng 100 vòng thì ô tô đi được quãng đường dài bao nhiêu mét?',
    options: ['109,9 m', '219,8 m', '21,98 m', '38,465 m'],
    correctAnswer: 1,
    methodHint: 'Quãng đường đi được trong 1 vòng chính là chu vi của bánh xe (C = r × 2 × 3,14).',
    steps: [
      'Chu vi bánh xe là: 0,35 × 2 × 3,14 = 2,198 (m).',
      'Quãng đường đi được sau 100 vòng là: 2,198 × 100 = 219,8 (m).'
    ]
  },
  {
    id: 55,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Thông hiểu',
    text: 'Tính chu vi của một tấm bìa hình nửa hình tròn có đường kính 16 cm.',
    options: ['25,12 cm', '41,12 cm', '50,24 cm', '66,24 cm'],
    correctAnswer: 1,
    methodHint: 'Chu vi nửa hình tròn gồm nửa đường tròn bao quanh cộng thêm đoạn thẳng đường kính ở đáy.',
    steps: [
      'Độ dài nửa đường tròn là: (16 × 3,14) : 2 = 25,12 (cm).',
      'Chu vi của nửa hình tròn là: 25,12 + 16 = 41,12 (cm).'
    ]
  },
  {
    id: 56,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Vận dụng',
    diagramId: 'hinh_vuong_tron_2',
    text: 'Hình tròn được vẽ khít bên trong một hình vuông cạnh 20 cm như hình bên. Tính diện tích phần tô màu nằm ngoài hình tròn và bên trong hình vuông.',
    options: ['86 cm²', '314 cm²', '114 cm²', '76 cm²'],
    correctAnswer: 0,
    methodHint: 'Lấy diện tích hình vuông cạnh 20 cm trừ đi diện tích hình tròn có đường kính 20 cm (bán kính 10 cm).',
    steps: [
      'Diện tích hình vuông là: 20 × 20 = 400 (cm²).',
      'Bán kính hình tròn là: 20 : 2 = 10 (cm) → Diện tích hình tròn: 10 × 10 × 3,14 = 314 (cm²).',
      'Diện tích phần tô màu là: 400 − 314 = 86 (cm²).'
    ]
  },
  {
    id: 57,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Vận dụng',
    text: 'Một giếng nước có miệng hình tròn bán kính 0,8 m. Xung quanh miệng giếng người ta xây thành giếng rộng 0,4 m. Tính diện tích của thành giếng.',
    options: ['2,0096 m²', '2,512 m²', '4,5216 m²', '0,5024 m²'],
    correctAnswer: 1,
    methodHint: 'Diện tích thành giếng (hình vành khăn) bằng diện tích hình tròn lớn bán kính (0,8 + 0,4) m trừ đi diện tích miệng giếng.',
    steps: [
      'Bán kính vòng ngoài thành giếng: 0,8 + 0,4 = 1,2 (m).',
      'Diện tích hình tròn lớn: 1,2 × 1,2 × 3,14 = 4,5216 (m²).',
      'Diện tích miệng giếng: 0,8 × 0,8 × 3,14 = 2,0096 (m²).',
      'Diện tích thành giếng: 4,5216 − 2,0096 = 2,512 (m²).'
    ]
  },
  {
    id: 58,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Vận dụng',
    text: 'Một sân vận động gồm một hình chữ nhật dài 85 m, rộng 40 m và hai nửa hình tròn có đường kính bằng chiều rộng 40 m ghép ở hai đầu. Tính chu vi của sân vận động đó.',
    options: ['250 m', '295,6 m', '375,6 m', '210,6 m'],
    correctAnswer: 1,
    methodHint: 'Hai nửa hình tròn ở hai đầu ghép lại thành một hình tròn có đường kính 40 m. Chu vi sân gồm hai chiều dài 85 m cộng chu vi hình tròn.',
    steps: [
      'Chu vi hai nửa hình tròn bằng chu vi cả hình tròn: 40 × 3,14 = 125,6 (m).',
      'Chu vi sân vận động là: 85 × 2 + 125,6 = 170 + 125,6 = 295,6 (m).'
    ]
  },
  {
    id: 59,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Vận dụng',
    text: 'Nếu tăng bán kính của một hình tròn lên 2,5 lần thì diện tích của hình tròn mới gấp lên bao nhiêu lần so với hình tròn ban đầu?',
    options: ['2,5 lần', '5 lần', '6,25 lần', '7,85 lần'],
    correctAnswer: 2,
    methodHint: 'Trong công thức S = r × r × 3,14, bán kính xuất hiện 2 lần dưới dạng tích r × r.',
    steps: [
      'Khi r tăng lên 2,5 lần thì tích r × r tăng lên: 2,5 × 2,5 = 6,25 (lần).',
      'Vậy diện tích hình tròn mới gấp 6,25 lần hình tròn ban đầu.'
    ]
  },
  {
    id: 60,
    domain: 'geometry',
    setId: 'set_geo_2',
    difficulty: 'Vận dụng',
    text: 'Hai hình tròn có hiệu chu vi là 18,84 cm. Hỏi bán kính của hình tròn lớn dài hơn bán kính của hình tròn nhỏ bao nhiêu xăng-ti-mét?',
    options: ['3 cm', '6 cm', '4,5 cm', '2,5 cm'],
    correctAnswer: 0,
    methodHint: 'Hiệu chu vi = (R − r) × 2 × 3,14 = (R − r) × 6,28.',
    steps: [
      'Hiệu đường kính của hai hình tròn là: 18,84 : 3,14 = 6 (cm).',
      'Hiệu bán kính của hai hình tròn là: 6 : 2 = 3 (cm).'
    ]
  },

  // =====================================================================
  // MẠCH 2: HÌNH HỌC VÀ ĐO LƯỜNG — BỘ ĐỀ 3 (HHCN & Hình lập phương)
  // =====================================================================
  {
    id: 61,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Thông hiểu',
    diagramId: 'lap_phuong_2',
    text: 'Tính diện tích toàn phần của hình lập phương có độ dài cạnh 12,5 cm.',
    options: ['625 cm²', '937,5 cm²', '781,25 cm²', '1.953,125 cm²'],
    correctAnswer: 1,
    methodHint: 'Diện tích toàn phần hình lập phương bằng diện tích 1 mặt (cạnh × cạnh) nhân với 6.',
    steps: [
      'Diện tích một mặt là: 12,5 × 12,5 = 156,25 (cm²).',
      'Diện tích toàn phần là: 156,25 × 6 = 937,5 (cm²).'
    ]
  },
  {
    id: 62,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Thông hiểu',
    diagramId: 'hhcn_2',
    text: 'Tính thể tích của hình hộp chữ nhật có chiều dài 12,5 cm, chiều rộng 8,4 cm và chiều cao 6 cm.',
    options: ['630 cm³', '620 cm³', '530 cm³', '250,8 cm³'],
    correctAnswer: 0,
    methodHint: 'Thể tích hình hộp chữ nhật: V = chiều dài × chiều rộng × chiều cao (cùng đơn vị đo).',
    steps: [
      'Thể tích hình hộp chữ nhật là: 12,5 × 8,4 × 6 = 105 × 6 = 630 (cm³).'
    ]
  },
  {
    id: 63,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Thông hiểu',
    text: 'Người ta làm một bể cá bằng kính dạng hình hộp chữ nhật không nắp có chiều dài 1,5 m, chiều rộng 0,8 m và chiều cao 0,6 m. Tính diện tích kính cần dùng để làm bể.',
    options: ['2,76 m²', '3,96 m²', '5,16 m²', '3,76 m²'],
    correctAnswer: 1,
    methodHint: 'Bể không nắp gồm 4 mặt xung quanh và 1 mặt đáy. Diện tích kính = Sxq + Sđáy.',
    steps: [
      'Diện tích xung quanh bể kính: (1,5 + 0,8) × 2 × 0,6 = 2,76 (m²).',
      'Diện tích mặt đáy bể kính: 1,5 × 0,8 = 1,2 (m²).',
      'Tổng diện tích kính cần dùng là: 2,76 + 1,2 = 3,96 (m²).'
    ]
  },
  {
    id: 64,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Thông hiểu',
    text: 'Một phòng học hình hộp chữ nhật dài 8,5 m, rộng 6 m và cao 3,8 m. Người ta quét vôi trần nhà và 4 bức tường phía trong phòng, biết tổng diện tích các cửa là 12,4 m². Tính diện tích cần quét vôi.',
    options: ['148,8 m²', '161,2 m²', '138,8 m²', '151,2 m²'],
    correctAnswer: 0,
    methodHint: 'Diện tích cần quét vôi = Diện tích xung quanh + Diện tích trần nhà − Diện tích các cửa.',
    steps: [
      'Diện tích xung quanh 4 bức tường: (8,5 + 6) × 2 × 3,8 = 29 × 3,8 = 110,2 (m²).',
      'Diện tích trần nhà: 8,5 × 6 = 51 (m²).',
      'Diện tích cần quét vôi: 110,2 + 51 − 12,4 = 148,8 (m²).'
    ]
  },
  {
    id: 65,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Thông hiểu',
    text: 'Một hình lập phương có diện tích xung quanh là 1.296 cm². Thể tích của hình lập phương đó là bao nhiêu xăng-ti-mét khối?',
    options: ['4.096 cm³', '5.832 cm³', '4.913 cm³', '5.328 cm³'],
    correctAnswer: 1,
    methodHint: 'Chia diện tích xung quanh cho 4 để tìm diện tích một mặt, từ đó suy ra độ dài cạnh và tính thể tích.',
    steps: [
      'Diện tích một mặt hình lập phương là: 1.296 : 4 = 324 (cm²).',
      'Vì 18 × 18 = 324 nên cạnh hình lập phương bằng 18 cm.',
      'Thể tích hình lập phương là: 18 × 18 × 18 = 5.832 (cm³).'
    ]
  },
  {
    id: 66,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Vận dụng',
    text: 'Một bể nước hình hộp chữ nhật có kích thước trong lòng bể: dài 2,4 m, rộng 1,5 m, cao 1,2 m. Hiện lượng nước trong bể chiếm 75% thể tích bể. Hỏi trong bể đang có bao nhiêu lít nước?',
    options: ['3.140 lít', '3.240 lít', '4.320 lít', '3.420 lít'],
    correctAnswer: 1,
    methodHint: 'Tính thể tích bể theo đơn vị mét khối, đổi sang đề-xi-mét khối (1 dm³ = 1 lít) rồi nhân với 75%.',
    steps: [
      'Thể tích của bể là: 2,4 × 1,5 × 1,2 = 4,32 (m³) = 4.320 (dm³) = 4.320 (lít).',
      'Lượng nước đang có trong bể là: 4.320 × 75 : 100 = 3.240 (lít).'
    ]
  },
  {
    id: 67,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Vận dụng',
    text: 'Thả chìm hoàn toàn một khối đá vào bể nước hình hộp chữ nhật có đáy dài 80 cm, rộng 50 cm thì thấy mực nước dâng lên thêm 4,5 cm (nước không tràn). Thể tích khối đá bằng bao nhiêu đề-xi-mét khối?',
    options: ['18 dm³', '180 dm³', '1,8 dm³', '16 dm³'],
    correctAnswer: 0,
    methodHint: 'Thể tích khối đá bằng thể tích phần nước dâng thêm: V = dài bể × rộng bể × chiều cao nước dâng.',
    steps: [
      'Thể tích phần nước dâng lên là: 80 × 50 × 4,5 = 18.000 (cm³).',
      'Đổi 18.000 cm³ = 18 dm³. Vậy thể tích khối đá là 18 dm³.'
    ]
  },
  {
    id: 68,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Vận dụng',
    text: 'Cần dùng bao nhiêu hình lập phương nhỏ cạnh 2 cm để xếp kín thành một hình hộp chữ nhật có chiều dài 24 cm, chiều rộng 16 cm và chiều cao 12 cm?',
    options: ['288 hình', '576 hình', '1.152 hình', '480 hình'],
    correctAnswer: 1,
    methodHint: 'Chia mỗi kích thước của hình hộp chữ nhật cho cạnh 2 cm để biết số lớp theo dài, rộng, cao (hoặc lấy tổng thể tích chia cho thể tích 1 hình nhỏ).',
    steps: [
      'Số hình xếp theo chiều dài: 24 : 2 = 12 (hình); theo chiều rộng: 16 : 2 = 8 (hình); theo chiều cao: 12 : 2 = 6 (hình).',
      'Tổng số hình lập phương nhỏ cần dùng là: 12 × 8 × 6 = 576 (hình).'
    ]
  },
  {
    id: 69,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Vận dụng',
    diagramId: 'lap_phuong_son_2',
    text: 'Xếp 125 hình lập phương nhỏ cạnh 1 cm thành một khối lập phương lớn kích thước 5 × 5 × 5 rồi sơn kín 6 mặt ngoài. Hỏi có bao nhiêu hình lập phương nhỏ được sơn đúng 2 mặt?',
    options: ['24 hình', '36 hình', '48 hình', '54 hình'],
    correctAnswer: 1,
    methodHint: 'Các hình nhỏ được sơn đúng 2 mặt nằm trên 12 cạnh của khối lập phương lớn (trừ 2 hình ở hai đầu góc của mỗi cạnh).',
    steps: [
      'Mỗi cạnh của khối lập phương 5 × 5 × 5 có 5 − 2 = 3 hình nhỏ nằm ở giữa được sơn 2 mặt.',
      'Hình lập phương có 12 cạnh nên số hình nhỏ sơn đúng 2 mặt là: 12 × 3 = 36 (hình).'
    ]
  },
  {
    id: 70,
    domain: 'geometry',
    setId: 'set_geo_3',
    difficulty: 'Vận dụng',
    text: 'Một hình hộp chữ nhật có diện tích xung quanh là 336 cm², chiều cao 12 cm, chiều dài hơn chiều rộng 4 cm. Tính thể tích của hình hộp chữ nhật đó.',
    options: ['540 cm³', '480 cm³', '560 cm³', '600 cm³'],
    correctAnswer: 0,
    methodHint: 'Lấy diện tích xung quanh chia cho chiều cao để tìm chu vi đáy, chia đôi ra tổng dài và rộng rồi giải bài toán tổng - hiệu.',
    steps: [
      'Chu vi đáy là: 336 : 12 = 28 (cm) → Nửa chu vi đáy là: 28 : 2 = 14 (cm).',
      'Chiều rộng: (14 − 4) : 2 = 5 (cm); Chiều dài: 5 + 4 = 9 (cm).',
      'Thể tích hình hộp chữ nhật là: 9 × 5 × 12 = 540 (cm³).'
    ]
  },

  // =====================================================================
  // MẠCH 2: HÌNH HỌC VÀ ĐO LƯỜNG — BỘ ĐỀ 4 (Đổi đơn vị đo đại lượng)
  // =====================================================================
  {
    id: 71,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Viết số thập phân thích hợp vào chỗ chấm: 3 ha 450 m² = ........ ha.',
    options: ['3,45', '3,045', '3,0045', '34,5'],
    correctAnswer: 1,
    methodHint: 'Nhớ rằng 1 ha = 10.000 m², do đó 1 m² = 1/10.000 ha.',
    steps: [
      'Đổi 450 m² = 450 : 10.000 = 0,045 ha.',
      'Vậy 3 ha 450 m² = 3 + 0,045 = 3,045 ha.'
    ]
  },
  {
    id: 72,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Số đo khối lượng 5 tấn 75 kg viết dưới dạng số thập phân với đơn vị tấn là bao nhiêu?',
    options: ['5,75 tấn', '5,075 tấn', '5,0075 tấn', '50,75 tấn'],
    correctAnswer: 1,
    methodHint: '1 tấn = 1.000 kg nên 75 kg = 75/1.000 tấn.',
    steps: [
      'Đổi 75 kg = 75 : 1.000 = 0,075 tấn.',
      'Vậy 5 tấn 75 kg = 5,075 tấn.'
    ]
  },
  {
    id: 73,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Điền số thích hợp vào chỗ chấm: 4 m³ 85 dm³ = ........ dm³.',
    options: ['485', '4.085', '4.850', '40.085'],
    correctAnswer: 1,
    methodHint: 'Trong bảng đơn vị đo thể tích, hai đơn vị liên tiếp gấp hoặc kém nhau 1.000 lần (1 m³ = 1.000 dm³).',
    steps: [
      'Đổi 4 m³ = 4 × 1.000 = 4.000 dm³.',
      'Vậy 4 m³ 85 dm³ = 4.000 + 85 = 4.085 dm³.'
    ]
  },
  {
    id: 74,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Đổi đơn vị thời gian: 3 giờ 48 phút = ........ giờ.',
    options: ['3,48 giờ', '3,6 giờ', '3,8 giờ', '3,75 giờ'],
    correctAnswer: 2,
    methodHint: '1 giờ = 60 phút, muốn đổi phút ra giờ ta lấy số phút chia cho 60.',
    steps: [
      'Đổi 48 phút = 48 : 60 = 0,8 giờ.',
      'Vậy 3 giờ 48 phút = 3 + 0,8 = 3,8 giờ.'
    ]
  },
  {
    id: 75,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Giá trị của 12,45 km² khi đổi sang đơn vị héc-ta (ha) là bao nhiêu?',
    options: ['124,5 ha', '1.245 ha', '12.450 ha', '124.500 ha'],
    correctAnswer: 1,
    methodHint: '1 km² = 100 ha (1 km² = 1.000.000 m² và 1 ha = 10.000 m²).',
    steps: [
      'Vì 1 km² = 100 ha nên 12,45 km² = 12,45 × 100 = 1.245 ha.'
    ]
  },
  {
    id: 76,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Thông hiểu',
    text: 'Một thùng chứa có dung tích 0,425 m³. Thùng đó chứa được tối đa bao nhiêu lít nước? (Biết 1 lít = 1 dm³)',
    options: ['42,5 lít', '425 lít', '4.250 lít', '4,25 lít'],
    correctAnswer: 1,
    methodHint: 'Đổi 0,425 m³ sang dm³ bằng cách nhân với 1.000.',
    steps: [
      '0,425 m³ = 0,425 × 1.000 = 425 dm³ = 425 lít.'
    ]
  },
  {
    id: 77,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Vận dụng',
    text: 'Một máy bơm hoạt động trong 2 giờ 15 phút bơm được 21.600 lít nước. Trung bình mỗi phút máy bơm đó bơm được bao nhiêu mét khối nước?',
    options: ['0,16 m³', '1,6 m³', '0,18 m³', '0,12 m³'],
    correctAnswer: 0,
    methodHint: 'Đổi 21.600 lít ra m³ và đổi 2 giờ 15 phút ra phút trước khi thực hiện phép chia.',
    steps: [
      'Đổi 21.600 lít = 21.600 dm³ = 21,6 m³.',
      'Đổi 2 giờ 15 phút = 2 × 60 + 15 = 135 phút.',
      'Mỗi phút máy bơm được: 21,6 : 135 = 0,16 (m³).'
    ]
  },
  {
    id: 78,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Vận dụng',
    text: 'Một cánh đồng hình chữ nhật dài 250 m, rộng 120 m. Trung bình mỗi héc-ta thu hoạch được 6,8 tấn thóc. Hỏi cả cánh đồng thu hoạch được bao nhiêu tạ thóc?',
    options: ['20,4 tạ', '204 tạ', '2.040 tạ', '184 tạ'],
    correctAnswer: 1,
    methodHint: 'Tính diện tích cánh đồng theo m², đổi ra ha, tính số tấn thóc rồi đổi từ tấn sang tạ (1 tấn = 10 tạ).',
    steps: [
      'Diện tích cánh đồng: 250 × 120 = 30.000 (m²) = 3 (ha).',
      'Số thóc thu hoạch được: 3 × 6,8 = 20,4 (tấn) = 204 (tạ).'
    ]
  },
  {
    id: 79,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Vận dụng',
    text: 'Một ô tô đi quãng đường 122,4 km hết 2 giờ 24 phút. Tính vận tốc của ô tô đó theo đơn vị mét/phút (m/phút).',
    options: ['820 m/phút', '850 m/phút', '880 m/phút', '950 m/phút'],
    correctAnswer: 1,
    methodHint: 'Đổi 122,4 km ra mét (nhân 1.000) và đổi 2 giờ 24 phút ra phút rồi thực hiện phép chia.',
    steps: [
      'Đổi 122,4 km = 122.400 m.',
      'Đổi 2 giờ 24 phút = 2 × 60 + 24 = 144 phút.',
      'Vận tốc của ô tô là: 122.400 : 144 = 850 (m/phút).'
    ]
  },
  {
    id: 80,
    domain: 'geometry',
    setId: 'set_geo_4',
    difficulty: 'Vận dụng',
    text: 'Hai vòi nước cùng chảy vào một bể rỗng có thể tích 7,2 m³. Vòi thứ nhất mỗi phút chảy được 35 lít, vòi thứ hai mỗi phút chảy được 45 lít. Hỏi sau bao lâu thì bể đầy nước?',
    options: ['1 giờ 15 phút', '1 giờ 20 phút', '1 giờ 30 phút', '1 giờ 45 phút'],
    correctAnswer: 2,
    methodHint: 'Đổi thể tích bể 7,2 m³ sang lít (7.200 lít), rồi chia cho tổng số lít cả hai vòi chảy trong 1 phút.',
    steps: [
      'Đổi 7,2 m³ = 7.200 dm³ = 7.200 lít.',
      'Mỗi phút cả hai vòi chảy được: 35 + 45 = 80 (lít).',
      'Thời gian để bể đầy nước: 7.200 : 80 = 90 (phút) = 1 giờ 30 phút.'
    ]
  },

  // =====================================================================
  // MẠCH 3: THỐNG KÊ VÀ XÁC SUẤT — BỘ ĐỀ 1 (Biểu đồ hình quạt tròn)
  // =====================================================================
  {
    id: 81,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_1',
    text: 'Biểu đồ bên cho biết tỉ lệ phương tiện đi học của 1.200 học sinh. Số học sinh đi xe đạp nhiều hơn số học sinh đi xe máy bao nhiêu em?',
    options: ['240 học sinh', '300 học sinh', '320 học sinh', '180 học sinh'],
    correctAnswer: 1,
    methodHint: 'Tìm hiệu tỉ số phần trăm giữa Xe đạp (40%) và Xe máy (15%), sau đó nhân với 1.200 học sinh.',
    steps: [
      'Hiệu tỉ số phần trăm giữa đi xe đạp và đi xe máy là: 40% − 15% = 25%.',
      'Số học sinh đi xe đạp nhiều hơn đi xe máy là: 1.200 × 25 : 100 = 300 (học sinh).'
    ]
  },
  {
    id: 82,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_1',
    text: 'Vẫn từ biểu đồ phương tiện của 1.200 học sinh, hãy tính tổng số học sinh đi bộ và đi ô tô đến trường.',
    options: ['480 học sinh', '540 học sinh', '560 học sinh', '600 học sinh'],
    correctAnswer: 1,
    methodHint: 'Cộng tỉ số phần trăm của hai nhóm Đi bộ (35%) và Ô tô (10%) rồi nhân với 1.200.',
    steps: [
      'Tổng tỉ số phần trăm của học sinh đi bộ và đi ô tô: 35% + 10% = 45%.',
      'Tổng số học sinh của hai nhóm đó là: 1.200 × 45 : 100 = 540 (học sinh).'
    ]
  },
  {
    id: 83,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_2',
    text: 'Biểu đồ bên thống kê 1.500 học sinh tham gia 4 câu lạc bộ. Hỏi có bao nhiêu học sinh tham gia câu lạc bộ Cờ vua?',
    options: ['195 học sinh', '210 học sinh', '225 học sinh', '240 học sinh'],
    correctAnswer: 1,
    methodHint: 'Tổng cả hình tròn là 100%. Tìm tỉ số phần trăm của Cờ vua trước rồi nhân với 1.500 học sinh.',
    steps: [
      'Câu lạc bộ Cờ vua chiếm: 100% − (40% + 25% + 21%) = 14%.',
      'Số học sinh tham gia câu lạc bộ Cờ vua là: 1.500 × 14 : 100 = 210 (học sinh).'
    ]
  },
  {
    id: 84,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_2',
    text: 'Dựa vào biểu đồ các câu lạc bộ của 1.500 học sinh, hãy tính tỉ số phần trăm giữa số học sinh CLB Bơi lội và số học sinh CLB Bóng đá.',
    options: ['60%', '62,5%', '65%', '160%'],
    correctAnswer: 1,
    methodHint: 'Lấy phần trăm của Bơi lội (25%) chia cho phần trăm của Bóng đá (40%) rồi nhân với 100%.',
    steps: [
      'Tỉ số giữa Bơi lội và Bóng đá là: 25 : 40 = 0,625.',
      'Đổi sang tỉ số phần trăm: 0,625 = 62,5%.'
    ]
  },
  {
    id: 85,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_3',
    text: 'Biểu đồ bên ghi tỉ lệ sản lượng hoa quả thu hoạch của một nông trại. Biết sản lượng Bưởi thu được là 375 kg. Hỏi tổng sản lượng cả 3 loại quả là bao nhiêu ki-lô-gam?',
    options: ['1.250 kg', '1.400 kg', '1.500 kg', '1.600 kg'],
    correctAnswer: 2,
    methodHint: 'Bưởi chiếm 25% ứng với 375 kg. Lấy 375 chia cho 25 rồi nhân với 100 để tìm tổng 100%.',
    steps: [
      'Tổng sản lượng hoa quả của nông trại là: 375 : 25 × 100 = 1.500 (kg).'
    ]
  },
  {
    id: 86,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_quat_3',
    text: 'Với sản lượng Bưởi (25%) là 375 kg như biểu đồ trên, hỏi sản lượng Cam nhiều hơn sản lượng Xoài bao nhiêu ki-lô-gam?',
    options: ['65 kg', '75 kg', '85 kg', '90 kg'],
    correctAnswer: 1,
    methodHint: 'Từ tổng sản lượng 1.500 kg, nhân với hiệu tỉ số phần trăm giữa Cam (40%) và Xoài (35%).',
    steps: [
      'Tổng sản lượng là: 375 : 25 × 100 = 1.500 (kg).',
      'Cam nhiều hơn Xoài số phần trăm là: 40% − 35% = 5%.',
      'Sản lượng Cam nhiều hơn Xoài là: 1.500 × 5 : 100 = 75 (kg).'
    ]
  },
  {
    id: 87,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Vận dụng',
    text: 'Thu nhập tháng này của một gia đình là 24.000.000 đồng, được chia trên biểu đồ hình quạt: Tiền ăn 35%, Học tập 25%, Sinh hoạt khác 18%, còn lại là Tiết kiệm. Nếu tháng tới tiền tiết kiệm tăng thêm 10% so với số tiền tiết kiệm tháng này thì số tiền tiết kiệm tháng tới là bao nhiêu?',
    options: ['5.280.000 đồng', '5.808.000 đồng', '5.760.000 đồng', '6.080.000 đồng'],
    correctAnswer: 1,
    methodHint: 'Tìm tỉ lệ phần trăm và số tiền tiết kiệm tháng này, sau đó cộng thêm 10% của khoản tiền tiết kiệm đó.',
    steps: [
      'Tiết kiệm tháng này chiếm: 100% − (35% + 25% + 18%) = 22%.',
      'Tiền tiết kiệm tháng này: 24.000.000 × 22 : 100 = 5.280.000 (đồng).',
      'Tiền tiết kiệm tháng tới: 5.280.000 + 5.280.000 × 10% = 5.808.000 (đồng).'
    ]
  },
  {
    id: 88,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Vận dụng',
    text: 'Khảo sát 800 người về môn thể thao yêu thích, biểu đồ hình quạt ghi: Chạy bộ 30%, Đạp xe 25%, Bơi lội 20%, Cầu lông 25%. Cần có bao nhiêu người chuyển từ nhóm Bơi lội sang nhóm Chạy bộ để tỉ lệ người chọn Chạy bộ đạt đúng 35%?',
    options: ['35 người', '40 người', '45 người', '50 người'],
    correctAnswer: 1,
    methodHint: 'Tổng số người không đổi (800 người). Tính xem 35% hơn 30% bao nhiêu phần trăm rồi nhân với 800.',
    steps: [
      'Tỉ lệ Chạy bộ cần tăng thêm: 35% − 30% = 5%.',
      'Số người cần chuyển từ Bơi lội sang Chạy bộ là: 800 × 5 : 100 = 40 (người).'
    ]
  },
  {
    id: 89,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Vận dụng',
    text: 'Trên biểu đồ hình quạt tròn biểu diễn cơ cấu cây trồng của một nông trại rộng 45 ha: hình quạt chỉ cây ăn quả có góc ở tâm vuông 90°, hình quạt cây công nghiệp chiếm 45%, phần còn lại trồng rau sạch. Tính diện tích trồng rau sạch.',
    options: ['12,5 ha', '13,5 ha', '14,5 ha', '15,5 ha'],
    correctAnswer: 1,
    methodHint: 'Góc ở tâm vuông 90° chiếm 90° : 360° = 1/4 = 25% cả hình tròn.',
    steps: [
      'Cây ăn quả (góc 90°) chiếm: 90 : 360 = 0,25 = 25%.',
      'Rau sạch chiếm: 100% − (25% + 45%) = 30%.',
      'Diện tích trồng rau sạch là: 45 × 30 : 100 = 13,5 (ha).'
    ]
  },
  {
    id: 90,
    domain: 'stats',
    setId: 'set_stat_1',
    difficulty: 'Vận dụng',
    text: 'Biểu đồ hình quạt khảo sát 600 học sinh chọn loại sách yêu thích: Truyện tranh 35%, Khoa học 30%, Văn học 20%, Lịch sử 15%. Nếu có thêm 150 học sinh mới đến đều chọn sách Khoa học thì tỉ số phần trăm học sinh thích sách Khoa học lúc sau là bao nhiêu?',
    options: ['40%', '42%', '44%', '45%'],
    correctAnswer: 2,
    methodHint: 'Tính số học sinh thích sách Khoa học ban đầu, cộng thêm 150 em, đồng thời tổng số học sinh toàn trường lúc sau cũng tăng thêm 150 em.',
    steps: [
      'Số học sinh thích sách Khoa học ban đầu: 600 × 30 : 100 = 180 (em).',
      'Lúc sau có 180 + 150 = 330 (em) thích sách Khoa học trên tổng 600 + 150 = 750 (em).',
      'Tỉ số phần trăm lúc sau là: 330 : 750 = 0,44 = 44%.'
    ]
  },

  // =====================================================================
  // MẠCH 3: THỐNG KÊ VÀ XÁC SUẤT — BỘ ĐỀ 2 (Đọc và phân tích biểu đồ cột)
  // =====================================================================
  {
    id: 91,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_1_new',
    text: 'Dựa vào biểu đồ cột bên, tính tổng số sách thư viện đã cho mượn trong cả năm (4 quý).',
    options: ['5.400 quyển', '5.500 quyển', '5.600 quyển', '5.800 quyển'],
    correctAnswer: 2,
    methodHint: 'Đọc số liệu trên đỉnh của 4 cột (Quý I, II, III, IV) rồi cộng lại với nhau.',
    steps: [
      'Tổng số sách cho mượn cả năm là: 1.240 + 1.560 + 1.180 + 1.620 = 5.600 (quyển).'
    ]
  },
  {
    id: 92,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_1_new',
    text: 'Từ biểu đồ số sách cho mượn ở trên, hỏi tổng số sách của hai quý cho mượn nhiều nhất hơn tổng số sách của hai quý còn lại bao nhiêu quyển?',
    options: ['680 quyển', '720 quyển', '760 quyển', '820 quyển'],
    correctAnswer: 2,
    methodHint: 'Xác định hai cột cao nhất (Quý II và Quý IV) và hai cột còn lại (Quý I và Quý III) rồi tính hiệu.',
    steps: [
      'Hai quý cao nhất (Quý II và Quý IV): 1.560 + 1.620 = 3.180 (quyển).',
      'Hai quý còn lại (Quý I và Quý III): 1.240 + 1.180 = 2.420 (quyển).',
      'Hiệu số sách là: 3.180 − 2.420 = 760 (quyển).'
    ]
  },
  {
    id: 93,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Vận dụng',
    diagramId: 'bieu_do_cot_1_new',
    text: 'Nếu trong Quý IV năm sau thư viện phấn đấu tăng thêm 15% số sách cho mượn so với Quý IV trên biểu đồ, thì số sách cho mượn Quý IV năm sau là bao nhiêu quyển?',
    options: ['1.843 quyển', '1.863 quyển', '1.883 quyển', '1.923 quyển'],
    correctAnswer: 1,
    methodHint: 'Đọc số sách Quý IV trên biểu đồ (1.620 quyển), tính thêm 15% rồi cộng vào.',
    steps: [
      'Số sách cho mượn Quý IV trên biểu đồ là 1.620 quyển.',
      'Số sách tăng thêm 15%: 1.620 × 15 : 100 = 243 (quyển).',
      'Số sách Quý IV năm sau là: 1.620 + 243 = 1.863 (quyển).'
    ]
  },
  {
    id: 94,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_2_new',
    text: 'Biểu đồ bên ghi lượng gạo xuất khẩu trong 4 tháng với tổng sản lượng đạt 2.040 tấn. Hỏi tháng 4 (T4) công ty xuất khẩu được bao nhiêu tấn gạo?',
    options: ['550 tấn', '570 tấn', '590 tấn', '610 tấn'],
    correctAnswer: 1,
    methodHint: 'Lấy tổng sản lượng cả 4 tháng (2.040 tấn) trừ đi tổng sản lượng của 3 tháng đã biết trên biểu đồ.',
    steps: [
      'Tổng lượng gạo xuất khẩu 3 tháng đầu: 450 + 540 + 480 = 1.470 (tấn).',
      'Lượng gạo xuất khẩu tháng 4 là: 2.040 − 1.470 = 570 (tấn).'
    ]
  },
  {
    id: 95,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Vận dụng',
    diagramId: 'bieu_do_cot_2_new',
    text: 'Dựa vào biểu đồ gạo xuất khẩu ở trên, lượng gạo xuất khẩu của Tháng 2 (T2) đã tăng thêm bao nhiêu phần trăm so với Tháng 1 (T1)?',
    options: ['15%', '18%', '20%', '25%'],
    correctAnswer: 2,
    methodHint: 'Tìm phần gạo Tháng 2 tăng thêm so với Tháng 1 (540 − 450) rồi chia cho sản lượng Tháng 1 (450).',
    steps: [
      'Tháng 2 xuất khẩu nhiều hơn Tháng 1 là: 540 − 450 = 90 (tấn).',
      'Tỉ số phần trăm tăng thêm là: 90 : 450 = 0,2 = 20%.'
    ]
  },
  {
    id: 96,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_3_new',
    text: 'Biểu đồ cột bên thống kê lượng mưa 4 tháng cuối năm. Hỏi tổng lượng mưa của hai tháng T9 và T10 nhiều hơn tổng lượng mưa của hai tháng T11 và T12 bao nhiêu mi-li-mét?',
    options: ['304 mm', '314 mm', '324 mm', '334 mm'],
    correctAnswer: 2,
    methodHint: 'Tính tổng chiều cao hai cột T9, T10 rồi trừ đi tổng hai cột T11, T12.',
    steps: [
      'Tổng lượng mưa T9 và T10: 360 + 270 = 630 (mm).',
      'Tổng lượng mưa T11 và T12: 180 + 126 = 306 (mm).',
      'Hiệu lượng mưa là: 630 − 306 = 324 (mm).'
    ]
  },
  {
    id: 97,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_3_new',
    text: 'Từ biểu đồ lượng mưa 4 tháng cuối năm ở trên, lượng mưa của Tháng 12 (T12) bằng bao nhiêu phần trăm lượng mưa của Tháng 9 (T9)?',
    options: ['30%', '35%', '38%', '40%'],
    correctAnswer: 1,
    methodHint: 'Lấy lượng mưa tháng 12 (126 mm) chia cho lượng mưa tháng 9 (360 mm) rồi đổi sang phần trăm.',
    steps: [
      'Thương của 126 và 360 là: 126 : 360 = 0,35.',
      'Đổi sang tỉ số phần trăm: 0,35 = 35%.'
    ]
  },
  {
    id: 98,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Vận dụng',
    diagramId: 'bieu_do_cot_3_new',
    text: 'Dựa vào biểu đồ lượng mưa ở trên, từ Tháng 9 (T9) sang Tháng 10 (T10) lượng mưa đã giảm đi bao nhiêu phần trăm?',
    options: ['20%', '25%', '30%', '75%'],
    correctAnswer: 1,
    methodHint: 'Tìm lượng mưa giảm đi (360 − 270) rồi chia cho lượng mưa của Tháng 9 (360 mm).',
    steps: [
      'Lượng mưa Tháng 10 giảm so với Tháng 9 là: 360 − 270 = 90 (mm).',
      'Tỉ số phần trăm giảm đi là: 90 : 360 = 0,25 = 25%.'
    ]
  },
  {
    id: 99,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Thông hiểu',
    diagramId: 'bieu_do_cot_4_new',
    text: 'Biểu đồ cột bên thống kê số học sinh tham gia ngoại khóa của 4 khối lớp. Hỏi tổng số học sinh của Khối 4 và Khối 5 chiếm bao nhiêu phần trăm số học sinh tham gia ngoại khóa của cả 4 khối?',
    options: ['55%', '58%', '60%', '62,5%'],
    correctAnswer: 2,
    methodHint: 'Tính tổng số học sinh của cả 4 khối rồi tìm tỉ số phần trăm của tổng (Khối 4 + Khối 5) so với cả 4 khối.',
    steps: [
      'Tổng số học sinh Khối 4 và Khối 5 là: 385 + 455 = 840 (học sinh).',
      'Tổng số học sinh cả 4 khối là: 245 + 315 + 385 + 455 = 1.400 (học sinh).',
      'Tỉ số phần trăm là: 840 : 1.400 = 0,6 = 60%.'
    ]
  },
  {
    id: 100,
    domain: 'stats',
    setId: 'set_stat_2',
    difficulty: 'Vận dụng',
    diagramId: 'bieu_do_cot_4_new',
    text: 'Biết mỗi học sinh tham gia ngoại khóa đóng 45.000 đồng tiền tài liệu. Dựa vào biểu đồ trên, tổng số tiền thu được từ Khối 4 và Khối 5 nhiều hơn Khối 2 và Khối 3 bao nhiêu đồng?',
    options: ['12.400.000 đồng', '12.600.000 đồng', '13.500.000 đồng', '14.200.000 đồng'],
    correctAnswer: 1,
    methodHint: 'Tìm hiệu số học sinh giữa nhóm (Khối 4 + Khối 5) và nhóm (Khối 2 + Khối 3) rồi nhân với 45.000 đồng.',
    steps: [
      'Số học sinh Khối 4 và Khối 5: 385 + 455 = 840 (em).',
      'Số học sinh Khối 2 và Khối 3: 245 + 315 = 560 (em).',
      'Hiệu số học sinh: 840 − 560 = 280 (em).',
      'Số tiền nhiều hơn là: 280 × 45.000 = 12.600.000 (đồng).'
    ]
  },

  // =====================================================================
  // MẠCH 3: THỐNG KÊ VÀ XÁC SUẤT — BỘ ĐỀ 3 (Tỉ số lặp lại của sự kiện)
  // =====================================================================
  {
    id: 101,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Thông hiểu',
    diagramId: 'xac_suat_dong_xu_2',
    text: 'Nam tung một đồng xu 250 lần, thấy mặt NGỬA xuất hiện 135 lần. Tỉ số mô tả số lần lặp lại của mặt SẤP so với tổng số lần tung (viết dưới dạng phân số tối giản) là bao nhiêu?',
    options: ['27/50', '23/50', '11/25', '12/25'],
    correctAnswer: 1,
    methodHint: 'Tìm số lần xuất hiện mặt SẤP bằng 250 − 135, lập tỉ số với 250 rồi rút gọn phân số.',
    steps: [
      'Số lần xuất hiện mặt SẤP là: 250 − 135 = 115 (lần).',
      'Tỉ số mô tả số lần mặt SẤP xuất hiện là: 115/250 = 23/50.'
    ]
  },
  {
    id: 102,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Thông hiểu',
    diagramId: 'xac_suat_tui_bi_2',
    text: 'Trong túi có bi đỏ, xanh, vàng. Thực hiện lấy ngẫu nhiên 1 viên bi rồi bỏ lại 400 lần: được 144 lần bi đỏ, 156 lần bi xanh, còn lại là bi vàng. Tỉ số phần trăm số lần lấy được bi vàng so với tổng số lần thử là bao nhiêu?',
    options: ['22%', '24%', '25%', '28%'],
    correctAnswer: 2,
    methodHint: 'Tìm số lần lấy được bi vàng trước rồi chia cho tổng 400 lần thử.',
    steps: [
      'Số lần lấy được bi vàng là: 400 − (144 + 156) = 100 (lần).',
      'Tỉ số phần trăm số lần lấy được bi vàng là: 100 : 400 = 0,25 = 25%.'
    ]
  },
  {
    id: 103,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Thông hiểu',
    diagramId: 'xac_suat_vong_quay_2',
    text: 'Quay vòng quay may mắn 200 lần, tỉ số số lần kim chỉ vào ô Trúng thưởng là 7/20. Hỏi có bao nhiêu lần kim chỉ vào ô Không trúng thưởng?',
    options: ['70 lần', '120 lần', '130 lần', '140 lần'],
    correctAnswer: 2,
    methodHint: 'Tính số lần Trúng thưởng (200 × 7/20), sau đó lấy tổng số lần quay trừ đi.',
    steps: [
      'Số lần kim chỉ vào ô Trúng thưởng: 200 × 7 : 20 = 70 (lần).',
      'Số lần Không trúng thưởng là: 200 − 70 = 130 (lần).'
    ]
  },
  {
    id: 104,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Thông hiểu',
    diagramId: 'xac_suat_xuc_xac_2',
    text: 'Gieo một con xúc xắc 300 lần. Biết mặt 6 chấm xuất hiện chiếm 18% tổng số lần gieo, mặt 1 chấm xuất hiện bằng 1/5 tổng số lần gieo. Hỏi tổng số lần xuất hiện hai mặt này là bao nhiêu?',
    options: ['104 lần', '114 lần', '124 lần', '134 lần'],
    correctAnswer: 1,
    methodHint: 'Tính riêng số lần xuất hiện của mặt 6 chấm (18% của 300) và mặt 1 chấm (1/5 của 300), rồi cộng lại.',
    steps: [
      'Số lần xuất hiện mặt 6 chấm: 300 × 18 : 100 = 54 (lần).',
      'Số lần xuất hiện mặt 1 chấm: 300 : 5 = 60 (lần).',
      'Tổng số lần xuất hiện hai mặt đó là: 54 + 60 = 114 (lần).'
    ]
  },
  {
    id: 105,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Thông hiểu',
    text: 'Trong một buổi tập, một cầu thủ thực hiện 120 quả sút phạt, trong đó có 24 quả sút trượt. Tỉ số phần trăm giữa số quả sút vào lưới và tổng số quả đã sút là bao nhiêu?',
    options: ['75%', '80%', '82%', '85%'],
    correctAnswer: 1,
    methodHint: 'Tìm số quả sút vào lưới (120 − 24 = 96 quả) rồi chia cho 120.',
    steps: [
      'Số quả sút vào lưới là: 120 − 24 = 96 (quả).',
      'Tỉ số phần trăm quả sút vào lưới là: 96 : 120 = 0,8 = 80%.'
    ]
  },
  {
    id: 106,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Vận dụng',
    text: 'Kiểm tra ngẫu nhiên 500 bóng đèn của một nhà máy thấy có 15 bóng bị lỗi. Theo tỉ số đó, nếu kiểm tra 2.400 bóng đèn cùng loại thì ước tính có bao nhiêu bóng đèn đạt chuẩn?',
    options: ['2.304 bóng', '2.328 bóng', '2.340 bóng', '2.352 bóng'],
    correctAnswer: 1,
    methodHint: 'Tìm tỉ lệ phần trăm bóng đạt chuẩn trong 500 bóng mẫu rồi nhân với 2.400 bóng.',
    steps: [
      'Số bóng đạt chuẩn trong mẫu: 500 − 15 = 485 (bóng), chiếm 485 : 500 = 97%.',
      'Số bóng đạt chuẩn ước tính trong 2.400 bóng là: 2.400 × 97 : 100 = 2.328 (bóng).'
    ]
  },
  {
    id: 107,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Vận dụng',
    text: 'Trong hộp có 10 tấm thẻ đánh số từ 1 đến 10. An rút ngẫu nhiên 1 thẻ rồi bỏ lại, lặp lại 250 lần thấy thẻ mang số chẵn xuất hiện 138 lần. Hỏi số lần rút được thẻ số lẻ ít hơn số lần rút được thẻ số chẵn bao nhiêu lần?',
    options: ['24 lần', '26 lần', '28 lần', '112 lần'],
    correctAnswer: 1,
    methodHint: 'Tính số lần rút được thẻ số lẻ (250 − 138) rồi tìm hiệu với 138.',
    steps: [
      'Số lần rút được thẻ số lẻ là: 250 − 138 = 112 (lần).',
      'Số lần thẻ lẻ ít hơn thẻ chẵn là: 138 − 112 = 26 (lần).'
    ]
  },
  {
    id: 108,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Vận dụng',
    text: 'Thử nghiệm gieo 800 hạt giống đợt một thấy tỉ số hạt nảy mầm là 19/20. Đợt hai gieo 1.200 hạt cùng loại và tỉ lệ nảy mầm tăng thêm 1,5% so với đợt một. Tính tổng số hạt nảy mầm của cả hai đợt.',
    options: ['1.898 hạt', '1.918 hạt', '1.928 hạt', '1.938 hạt'],
    correctAnswer: 1,
    methodHint: 'Đổi 19/20 thành 95%, suy ra tỉ lệ nảy mầm đợt hai là 96,5% rồi tính số hạt nảy mầm của từng đợt.',
    steps: [
      'Đợt một có số hạt nảy mầm: 800 × 19 : 20 = 760 (hạt), đạt tỉ lệ 95%.',
      'Đợt hai đạt tỉ lệ 95% + 1,5% = 96,5%, nảy mầm: 1.200 × 96,5 : 100 = 1.158 (hạt).',
      'Tổng số hạt nảy mầm cả hai đợt là: 760 + 1.158 = 1.918 (hạt).'
    ]
  },
  {
    id: 109,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Vận dụng',
    text: 'Gieo đồng thời hai đồng xu 320 lần, kết quả có 88 lần cả hai đồng đều ngửa, 156 lần một ngửa một sấp, còn lại là cả hai đồng đều sấp. Tìm tỉ số giữa số lần cả hai đồng đều sấp và số lần cả hai đồng đều ngửa.',
    options: ['17/22', '19/22', '21/22', '19/24'],
    correctAnswer: 1,
    methodHint: 'Tìm số lần cả hai đồng đều sấp (320 − 88 − 156), lập tỉ số với 88 rồi rút gọn phân số.',
    steps: [
      'Số lần cả hai đồng đều sấp là: 320 − (88 + 156) = 76 (lần).',
      'Tỉ số cần tìm là: 76/88 = 19/22.'
    ]
  },
  {
    id: 110,
    domain: 'stats',
    setId: 'set_stat_3',
    difficulty: 'Vận dụng',
    text: 'Khảo sát chương trình quay thưởng trong 3 ngày: Ngày 1 quay 180 lượt (trúng 45 lượt), Ngày 2 quay 220 lượt (trúng 66 lượt), Ngày 3 quay 200 lượt (trúng 69 lượt). Tỉ số phần trăm lượt trúng thưởng chung của cả 3 ngày là bao nhiêu?',
    options: ['28%', '30%', '32%', '35%'],
    correctAnswer: 1,
    methodHint: 'Tính tổng số lượt trúng thưởng của 3 ngày và tổng số lượt quay của 3 ngày rồi lập tỉ số phần trăm.',
    steps: [
      'Tổng số lượt trúng thưởng là: 45 + 66 + 69 = 180 (lượt).',
      'Tổng số lượt quay là: 180 + 220 + 200 = 600 (lượt).',
      'Tỉ số phần trăm lượt trúng thưởng chung là: 180 : 600 = 0,3 = 30%.'
    ]
  }
];
