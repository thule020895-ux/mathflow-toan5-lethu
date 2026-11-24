import { ConquerSvgData, ConquerSvgType } from './ConquerIllustrations';

export interface AdvancedQuestion {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  solution: string;
  steps?: string[];
  svgType: ConquerSvgType;
  svgData?: ConquerSvgData;
}

export interface QuestionSet {
  id: string;
  title: string;
  badge: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
  questions: AdvancedQuestion[];
}

export const QUESTION_SETS: QuestionSet[] = [
  // ==================== ĐỀ 01: TỈ SỐ DIỆN TÍCH TAM GIÁC (10 CÂU) ====================
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
        question: 'Một hình tam giác ABC có diện tích là 90 cm². Người ta kéo dài cạnh đáy BC thêm một đoạn CD dài 4 cm thì diện tích tam giác tăng thêm 24 cm². Độ dài cạnh đáy BC ban đầu là bao nhiêu?',
        options: ['12 cm', '15 cm', '18 cm', '20 cm'],
        correctIndex: 1,
        hint: 'Hai tam giác ABC và ACD có chung chiều cao hạ từ đỉnh A xuống đường thẳng BD. Tính chiều cao từ phần diện tích tăng thêm rồi tìm cạnh đáy BC.',
        solution: 'Chiều cao hạ từ đỉnh A xuống đáy BC là 12 cm, suy ra độ dài cạnh đáy BC ban đầu là 15 cm.',
        steps: [
          'Phần diện tích tăng thêm là tam giác ACD có đáy CD = 4 cm và chiều cao đúng bằng chiều cao hạ từ đỉnh A xuống đáy BC.',
          'Chiều cao tam giác ABC là: 24 × 2 : 4 = 12 (cm).',
          'Độ dài cạnh đáy BC ban đầu là: 90 × 2 : 12 = 15 (cm).'
        ],
        svgType: 'tri_extend',
        svgData: { val1: '90 cm²', val2: '+24 cm²', val3: 'Đáy BC: ?', val4: 'CD: 4 cm' }
      },
      {
        id: 2,
        title: 'Tỉ số điểm trên hai cạnh tam giác',
        question: 'Cho tam giác ABC có diện tích 120 cm². Trên cạnh AC lấy điểm M sao cho đoạn AM bằng 1/3 cạnh AC. Trên cạnh BC lấy điểm N là trung điểm của cạnh BC. Diện tích tam giác CMN là bao nhiêu?',
        options: ['30 cm²', '40 cm²', '50 cm²', '60 cm²'],
        correctIndex: 1,
        hint: 'Nối A với N để tính diện tích tam giác ANC trước, sau đó so sánh đáy MC với AC.',
        solution: 'Diện tích tam giác ANC bằng 60 cm², suy ra diện tích tam giác CMN bằng 40 cm².',
        steps: [
          'Vì điểm N là trung điểm của cạnh BC nên tam giác ANC và tam giác ABC có chung chiều cao hạ từ đỉnh A và đáy NC bằng 1/2 đáy BC.',
          'Diện tích tam giác ANC là: 120 : 2 = 60 (cm²).',
          'Vì đoạn AM bằng 1/3 cạnh AC nên đoạn MC bằng 2/3 cạnh AC.',
          'Tam giác CMN và tam giác ANC chung chiều cao hạ từ đỉnh N và đáy MC bằng 2/3 đáy AC, nên diện tích tam giác CMN là: 60 × 2 : 3 = 40 (cm²).'
        ],
        svgType: 'tri_ceva',
        svgData: { val1: 'Tam giác ABC: 120 cm²', val2: 'Diện tích: ?' }
      },
      {
        id: 3,
        title: 'Biến đổi đáy và chiều cao theo phần trăm',
        question: 'Một hình tam giác có độ dài cạnh đáy tăng thêm 20%, đồng thời chiều cao tương ứng giảm đi 20%. Hỏi diện tích của hình tam giác đó thay đổi như thế nào?',
        options: ['Không đổi', 'Tăng 4%', 'Giảm 4%', 'Giảm 2%'],
        correctIndex: 2,
        hint: 'Coi cạnh đáy ban đầu là 100%, chiều cao ban đầu là 100%. Tính tỉ số phần trăm giữa diện tích mới và diện tích ban đầu.',
        solution: 'Diện tích mới bằng 96% diện tích ban đầu, tức là giảm 4%.',
        steps: [
          'Coi cạnh đáy ban đầu và chiều cao ban đầu đều bằng 100%.',
          'Cạnh đáy mới so với ban đầu là: 100% + 20% = 120% (tức gấp 1,2 lần).',
          'Chiều cao mới so với ban đầu là: 100% - 20% = 80% (tức gấp 0,8 lần).',
          'Diện tích mới so với diện tích ban đầu là: 1,2 × 0,8 = 0,96 = 96%. Vậy diện tích giảm đi: 100% - 96% = 4%.'
        ],
        svgType: 'tri_percent',
        svgData: { val1: 'Cạnh đáy: +20%', val2: 'Chiều cao: -20%', val3: 'Diện tích mới thay đổi thế nào?' }
      },
      {
        id: 4,
        title: 'Tam giác tạo bởi ba trung điểm',
        question: 'Cho tam giác ABC có diện tích 60 cm². Lấy các điểm M, N, P lần lượt là trung điểm của các cạnh BC, CA, AB. Diện tích tam giác MNP bằng bao nhiêu?',
        options: ['12 cm²', '15 cm²', '20 cm²', '30 cm²'],
        correctIndex: 1,
        hint: 'So sánh diện tích từng tam giác ở ba góc (APN, PBM, NMC) với diện tích tam giác ABC.',
        solution: 'Ba trung điểm chia tam giác lớn thành 4 tam giác nhỏ có diện tích bằng nhau, nên diện tích tam giác MNP là 15 cm².',
        steps: [
          'Nối P với C. Tam giác APC có diện tích bằng 1/2 diện tích tam giác ABC (chung chiều cao từ C, đáy AP bằng 1/2 AB).',
          'Vì N là trung điểm AC nên diện tích tam giác APN bằng 1/2 diện tích tam giác APC, tức bằng 1/4 diện tích tam giác ABC.',
          'Tương tự, diện tích tam giác PBM và diện tích tam giác NMC đều bằng 1/4 diện tích tam giác ABC.',
          'Diện tích tam giác MNP bằng: 1 - (1/4 + 1/4 + 1/4) = 1/4 diện tích tam giác ABC, tức là: 60 : 4 = 15 (cm²).'
        ],
        svgType: 'tri_midpoint',
        svgData: { val1: 'Tam giác ABC: 60 cm²', val2: 'Diện tích: ?' }
      },
      {
        id: 5,
        title: 'Cắt tứ giác bên trong tam giác',
        question: 'Cho tam giác ABC có diện tích 180 cm². Trên cạnh AB lấy điểm D sao cho đoạn AD bằng 1/3 cạnh AB. Trên cạnh AC lấy điểm E sao cho đoạn AE bằng 3/4 cạnh AC. Tính diện tích tứ giác BDEC.',
        options: ['120 cm²', '135 cm²', '145 cm²', '150 cm²'],
        correctIndex: 1,
        hint: 'Nối điểm D với điểm C để tìm diện tích tam giác ADC trước, sau đó tìm diện tích tam giác ADE rồi lấy diện tích tam giác ABC trừ đi.',
        solution: 'Diện tích tam giác ADE bằng 45 cm², suy ra diện tích tứ giác BDEC bằng 135 cm².',
        steps: [
          'Nối D với C. Tam giác ADC và tam giác ABC có chung chiều cao hạ từ C và đáy AD bằng 1/3 đáy AB.',
          'Diện tích tam giác ADC là: 180 : 3 = 60 (cm²).',
          'Tam giác ADE và tam giác ADC có chung chiều cao hạ từ D và đáy AE bằng 3/4 đáy AC.',
          'Diện tích tam giác ADE là: 60 × 3 : 4 = 45 (cm²).',
          'Diện tích tứ giác BDEC là: 180 - 45 = 135 (cm²).'
        ],
        svgType: 'tri_quad_cut',
        svgData: { val1: 'Tam giác ABC: 180 cm²', val2: 'Diện tích BDEC: ?' }
      },
      {
        id: 6,
        title: 'Trung tuyến cắt tia từ đỉnh',
        question: 'Cho tam giác ABC có diện tích 144 cm². Điểm M là trung điểm cạnh BC, điểm N là trung điểm đoạn thẳng AM. Tia BN cắt cạnh AC tại điểm K. Diện tích tam giác ABK là bao nhiêu?',
        options: ['36 cm²', '48 cm²', '54 cm²', '72 cm²'],
        correctIndex: 1,
        hint: 'Nối N với C. So sánh diện tích tam giác ABN với tam giác CBN để suy ra tỉ số hai đoạn thẳng AK và CK.',
        solution: 'Tỉ số đoạn AK và đoạn CK là 1/2 nên AK bằng 1/3 cạnh AC. Diện tích tam giác ABK là 48 cm².',
        steps: [
          'Vì M là trung điểm BC nên diện tích tam giác ABM bằng diện tích tam giác ACM và bằng: 144 : 2 = 72 (cm²).',
          'Vì N là trung điểm AM nên diện tích tam giác ABN bằng diện tích tam giác BMN và bằng: 72 : 2 = 36 (cm²). Tương tự, diện tích tam giác CMN bằng 36 cm².',
          'Suy ra diện tích tam giác BNC bằng tổng diện tích hai tam giác BMN và CMN, tức bằng: 36 + 36 = 72 (cm²).',
          'Hai tam giác ABN và CBN chung đáy BN mà diện tích tam giác ABN bằng một nửa diện tích tam giác CBN, nên chiều cao hạ từ A xuống BK bằng một nửa chiều cao hạ từ C xuống BK.',
          'Hai tam giác ABK và CBK chung đáy BK nên diện tích tam giác ABK cũng bằng một nửa diện tích tam giác CBK, suy ra đoạn AK bằng 1/3 cạnh AC. Vậy diện tích tam giác ABK là: 144 : 3 = 48 (cm²).'
        ],
        svgType: 'tri_median_ray',
        svgData: { val1: 'Tam giác ABC: 144 cm²', val2: 'Diện tích: ?' }
      },
      {
        id: 7,
        title: 'Đường thẳng song song trong tam giác vuông',
        question: 'Cho tam giác ABC vuông tại đỉnh A, có cạnh AB dài 24 cm và cạnh AC dài 30 cm. Trên cạnh AB lấy điểm M sao cho đoạn AM dài 16 cm. Từ M kẻ đường thẳng song song với cạnh AC, cắt cạnh BC tại điểm N. Tính độ dài đoạn thẳng MN.',
        options: ['8 cm', '10 cm', '12 cm', '15 cm'],
        correctIndex: 1,
        hint: 'Nối A với N. Vì MN song song với AC nên khoảng cách từ N xuống cạnh AC đúng bằng độ dài đoạn AM.',
        solution: 'Diện tích tam giác ANC bằng 240 cm², suy ra diện tích tam giác ABN bằng 120 cm² và đoạn MN dài 10 cm.',
        steps: [
          'Diện tích tam giác vuông ABC là: 24 × 30 : 2 = 360 (cm²).',
          'Nối A với N. Vì đoạn MN song song với cạnh AC và vuông góc với cạnh AB nên chiều cao hạ từ N xuống đáy AC bằng đoạn AM = 16 cm.',
          'Diện tích tam giác ANC là: 30 × 16 : 2 = 240 (cm²).',
          'Diện tích tam giác ABN là: 360 - 240 = 120 (cm²).',
          'Tam giác ABN có đáy AB = 24 cm và chiều cao chính là đoạn MN, nên độ dài đoạn MN là: 120 × 2 : 24 = 10 (cm).'
        ],
        svgType: 'tri_right_parallel',
        svgData: { val1: '24 cm', val2: '30 cm', val3: 'MN: ?' }
      },
      {
        id: 8,
        title: 'Mở rộng cả ba cạnh của tam giác',
        question: 'Cho tam giác ABC có diện tích 120 cm². Người ta kéo dài cạnh AB về phía B thêm đoạn BM bằng 1/2 cạnh AB; kéo dài cạnh BC về phía C thêm đoạn CN bằng cạnh BC; kéo dài cạnh CA về phía A thêm đoạn AP bằng 1/2 cạnh AC. Tính diện tích tam giác MNP.',
        options: ['450 cm²', '480 cm²', '510 cm²', '540 cm²'],
        correctIndex: 2,
        hint: 'Nối M với C, N với A, P với B để tính riêng diện tích ba tam giác mở rộng xung quanh là MBN, NCP và PAM.',
        solution: 'Tổng diện tích của tam giác ABC và ba tam giác mở rộng xung quanh là 510 cm².',
        steps: [
          'Nối M với C: vì BM bằng 1/2 AB nên diện tích tam giác MBC bằng 60 cm². Vì BN gấp 2 lần BC nên diện tích tam giác MBN là: 60 × 2 = 120 (cm²).',
          'Nối N với A: vì CN bằng BC nên diện tích tam giác NCA bằng 120 cm². Vì CP bằng 3/2 CA nên diện tích tam giác NCP là: 120 × 3 : 2 = 180 (cm²).',
          'Nối P với B: vì AP bằng 1/2 AC nên diện tích tam giác PAB bằng 60 cm². Vì AM bằng 3/2 AB nên diện tích tam giác PAM là: 60 × 3 : 2 = 90 (cm²).',
          'Diện tích tam giác MNP là: 120 + 120 + 180 + 90 = 510 (cm²).'
        ],
        svgType: 'tri_extend_all',
        svgData: { val1: '120 cm²', val2: 'Diện tích MNP: ?' }
      },
      {
        id: 9,
        title: 'Giao điểm hai đường chia cạnh tam giác',
        question: 'Cho tam giác ABC có diện tích 140 cm². Trên cạnh BC lấy điểm M sao cho đoạn BM gấp 3 lần đoạn MC. Gọi N là trung điểm của cạnh AC. Hai đoạn thẳng AM và BN cắt nhau tại điểm O. Tính diện tích tam giác AOB.',
        options: ['45 cm²', '50 cm²', '60 cm²', '70 cm²'],
        correctIndex: 2,
        hint: 'Nối O với C. Dựa vào trung điểm N để so sánh tam giác AOB với COB, và dựa vào BM gấp 3 lần MC để so sánh tam giác AOB với AOC.',
        solution: 'Chia tổng diện tích thành 7 phần bằng nhau theo tam giác AOC, tìm được diện tích tam giác AOB là 60 cm².',
        steps: [
          'Nối O với C. Vì N là trung điểm cạnh AC nên diện tích tam giác ABN bằng diện tích tam giác CBN và diện tích tam giác AON bằng diện tích tam giác CON. Trừ đi nhau ta được diện tích tam giác AOB bằng diện tích tam giác COB.',
          'Vì đoạn BM gấp 3 lần đoạn MC nên diện tích tam giác ABM gấp 3 lần diện tích tam giác ACM và diện tích tam giác OBM gấp 3 lần diện tích tam giác OCM. Trừ đi nhau ta được diện tích tam giác AOB gấp 3 lần diện tích tam giác AOC.',
          'Coi diện tích tam giác AOC là 1 phần thì diện tích tam giác AOB và tam giác COB mỗi hình chiếm 3 phần.',
          'Tổng số phần bằng nhau của cả tam giác ABC là: 1 + 3 + 3 = 7 (phần).',
          'Diện tích tam giác AOB là: 140 : 7 × 3 = 60 (cm²).'
        ],
        svgType: 'tri_inner_o',
        svgData: { val1: 'Tam giác ABC: 140 cm²', val2: 'Diện tích AOB: ?' }
      },
      {
        id: 10,
        title: 'Tam giác nằm trong hình chữ nhật',
        question: 'Cho hình chữ nhật ABCD có chiều dài AB bằng 30 cm, chiều rộng AD bằng 20 cm. Trên cạnh AB lấy điểm M sao cho đoạn AM dài 12 cm, trên cạnh AD lấy điểm N sao cho đoạn AN dài 8 cm. Tính diện tích tam giác CMN.',
        options: ['180 cm²', '192 cm²', '204 cm²', '216 cm²'],
        correctIndex: 1,
        hint: 'Tính diện tích hình chữ nhật ABCD rồi trừ đi tổng diện tích ba tam giác vuông ở các góc là AMN, MBC và NDC.',
        solution: 'Lấy diện tích hình chữ nhật 600 cm² trừ tổng diện tích ba tam giác vuông 408 cm², được kết quả 192 cm².',
        steps: [
          'Diện tích hình chữ nhật ABCD là: 30 × 20 = 600 (cm²).',
          'Độ dài đoạn MB là: 30 - 12 = 18 (cm). Độ dài đoạn ND là: 20 - 8 = 12 (cm).',
          'Diện tích tam giác vuông AMN là: 12 × 8 : 2 = 48 (cm²).',
          'Diện tích tam giác vuông MBC là: 18 × 20 : 2 = 180 (cm²).',
          'Diện tích tam giác vuông NDC là: 12 × 30 : 2 = 180 (cm²).',
          'Diện tích tam giác CMN là: 600 - (48 + 180 + 180) = 192 (cm²).'
        ],
        svgType: 'tri_in_rect',
        svgData: { val1: 'Chiều dài: 30 cm', val2: '20 cm', val3: 'Diện tích: ?' }
      }
    ]
  },

  // ==================== ĐỀ 02: HÌNH TRÒN & PHẦN TÔ MÀU (10 CÂU) ====================
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
        id: 11,
        title: 'Diện tích bốn góc ngoài hình tròn',
        question: 'Một hình vuông có cạnh dài 10 cm. Bên trong vẽ một hình tròn tiếp xúc với cả 4 cạnh của hình vuông. Diện tích phần hình vuông nằm ngoài hình tròn là bao nhiêu? (Lấy số pi bằng 3,14)',
        options: ['18,5 cm²', '21,5 cm²', '25 cm²', '28,5 cm²'],
        correctIndex: 1,
        hint: 'Đường kính hình tròn đúng bằng cạnh của hình vuông là 10 cm, suy ra bán kính hình tròn là 5 cm.',
        solution: 'Diện tích hình vuông là 100 cm², diện tích hình tròn là 78,5 cm², nên phần tô màu còn lại là 21,5 cm².',
        steps: [
          'Diện tích hình vuông là: 10 × 10 = 100 (cm²).',
          'Đường kính hình tròn bằng cạnh hình vuông là 10 cm, nên bán kính hình tròn là: 10 : 2 = 5 (cm).',
          'Diện tích hình tròn là: 5 × 5 × 3,14 = 78,5 (cm²).',
          'Diện tích phần hình vuông nằm ngoài hình tròn là: 100 - 78,5 = 21,5 (cm²).'
        ],
        svgType: 'circle_in_sq',
        svgData: { val1: 'Cạnh: 10 cm', val2: '5 cm' }
      },
      {
        id: 12,
        title: 'Hình vuông có bốn đỉnh nằm trên đường tròn',
        question: 'Một hình tròn có bán kính 6 cm. Vẽ một hình vuông có cả 4 đỉnh nằm trên đường tròn đó. Diện tích của hình vuông đó là bao nhiêu?',
        options: ['64 cm²', '72 cm²', '78,5 cm²', '84 cm²'],
        correctIndex: 1,
        hint: 'Hai đường chéo của hình vuông vuông góc với nhau và có độ dài đúng bằng đường kính hình tròn.',
        solution: 'Đường chéo hình vuông dài 12 cm, nên diện tích hình vuông là 72 cm².',
        steps: [
          'Đường kính của hình tròn là: 6 × 2 = 12 (cm). Đây cũng là độ dài hai đường chéo của hình vuông.',
          'Hai đường chéo chia hình vuông thành 4 tam giác vuông bằng nhau, hoặc tính như hình thoi có hai đường chéo vuông góc.',
          'Diện tích của hình vuông là: 12 × 12 : 2 = 72 (cm²).'
        ],
        svgType: 'sq_in_circle',
        svgData: { val1: 'Bán kính: 6 cm', val2: 'Diện tích hình vuông: ?' }
      },
      {
        id: 13,
        title: 'Diện tích hình vành khăn',
        question: 'Cho hai hình tròn đồng tâm O có bán kính lần lượt là 8 cm và 5 cm. Diện tích của hình vành khăn giới hạn bởi hai đường tròn đó là bao nhiêu? (Lấy số pi bằng 3,14)',
        options: ['112,45 cm²', '122,46 cm²', '125,6 cm²', '145,2 cm²'],
        correctIndex: 1,
        hint: 'Diện tích hình vành khăn bằng diện tích hình tròn lớn trừ đi diện tích hình tròn nhỏ.',
        solution: 'Hiệu diện tích hai hình tròn đồng tâm là 122,46 cm².',
        steps: [
          'Diện tích hình tròn lớn bán kính 8 cm là: 8 × 8 × 3,14 = 200,96 (cm²).',
          'Diện tích hình tròn nhỏ bán kính 5 cm là: 5 × 5 × 3,14 = 78,5 (cm²).',
          'Diện tích hình vành khăn là: 200,96 - 78,5 = 122,46 (cm²).'
        ],
        svgType: 'circle_ring',
        svgData: { val1: '8 cm', val2: '5 cm', val3: 'Diện tích vành khăn: ?' }
      },
      {
        id: 14,
        title: 'Biết diện tích hình vuông tìm diện tích hình tròn ngoại tiếp',
        question: 'Một hình vuông có diện tích bằng 50 cm², có cả 4 đỉnh nằm trên một đường tròn. Hãy tính diện tích của hình tròn đó. (Lấy số pi bằng 3,14)',
        options: ['62,8 cm²', '78,5 cm²', '86,4 cm²', '100 cm²'],
        correctIndex: 1,
        hint: 'Chia hình vuông theo hai đường chéo thành 4 tam giác vuông cân bằng nhau, mỗi tam giác có hai cạnh góc vuông chính là bán kính hình tròn.',
        solution: 'Tích bán kính nhân bán kính bằng 25, nên diện tích hình tròn là 78,5 cm².',
        steps: [
          'Hai đường chéo chia hình vuông thành 4 tam giác vuông bằng nhau có hai cạnh góc vuông đều bằng bán kính hình tròn.',
          'Diện tích mỗi tam giác vuông nhỏ là: 50 : 4 = 12,5 (cm²).',
          'Tích bán kính nhân bán kính là: 12,5 × 2 = 25.',
          'Diện tích của hình tròn là: 25 × 3,14 = 78,5 (cm²).'
        ],
        svgType: 'sq_area_to_circle',
        svgData: { val1: '50 cm²', val2: 'Diện tích hình tròn: ?' }
      },
      {
        id: 15,
        title: 'Biết diện tích hình tròn nội tiếp tìm phần góc vuông',
        question: 'Một hình tròn có diện tích là 113,04 cm², nằm vừa khít và tiếp xúc với cả 4 cạnh của một hình vuông. Tính diện tích phần hình vuông nằm ngoài hình tròn. (Lấy số pi bằng 3,14)',
        options: ['28,96 cm²', '30,96 cm²', '32,48 cm²', '36,96 cm²'],
        correctIndex: 1,
        hint: 'Từ diện tích hình tròn 113,04 cm², hãy chia cho 3,14 để tìm tích hai bán kính, từ đó suy ra bán kính và cạnh hình vuông.',
        solution: 'Bán kính hình tròn là 6 cm, cạnh hình vuông là 12 cm, nên phần ngoài hình tròn là 30,96 cm².',
        steps: [
          'Tích bán kính nhân bán kính là: 113,04 : 3,14 = 36.',
          'Vì 6 × 6 = 36 nên bán kính hình tròn là 6 cm.',
          'Cạnh của hình vuông bằng đường kính hình tròn là: 6 × 2 = 12 (cm).',
          'Diện tích hình vuông là: 12 × 12 = 144 (cm²).',
          'Diện tích phần hình vuông nằm ngoài hình tròn là: 144 - 113,04 = 30,96 (cm²).'
        ],
        svgType: 'circle_area_to_sq',
        svgData: { val1: '113,04 cm²', val2: 'Phần tô màu: ?' }
      },
      {
        id: 16,
        title: 'Diện tích cánh hoa trong hình vuông',
        question: 'Cho hình vuông ABCD có cạnh dài 10 cm. Vẽ hai cung phần tư đường tròn lần lượt có tâm là đỉnh B và đỉnh D, bán kính đều bằng 10 cm cắt nhau tạo thành phần cánh hoa ở giữa. Tính diện tích phần cánh hoa đó. (Lấy số pi bằng 3,14)',
        options: ['43 cm²', '50 cm²', '57 cm²', '64 cm²'],
        correctIndex: 2,
        hint: 'Tổng diện tích hai phần tư hình tròn bằng diện tích hình vuông cộng thêm đúng phần diện tích cánh hoa bị chồng lên nhau.',
        solution: 'Lấy tổng diện tích hai phần tư hình tròn là 157 cm² trừ đi diện tích hình vuông 100 cm², được 57 cm².',
        steps: [
          'Diện tích hình vuông ABCD là: 10 × 10 = 100 (cm²).',
          'Diện tích một phần tư hình tròn bán kính 10 cm là: 10 × 10 × 3,14 : 4 = 78,5 (cm²).',
          'Tổng diện tích hai phần tư hình tròn là: 78,5 × 2 = 157 (cm²).',
          'Khi ghép hai phần tư hình tròn vào hình vuông, chúng phủ kín hình vuông và chồng lên nhau đúng phần cánh hoa. Vậy diện tích cánh hoa là: 157 - 100 = 57 (cm²).'
        ],
        svgType: 'circle_petal',
        svgData: { val1: 'Cạnh hình vuông: 10 cm' }
      },
      {
        id: 17,
        title: 'Hình chữ nhật khoét nửa hình tròn',
        question: 'Một tấm bìa hình chữ nhật có chiều dài 20 cm và chiều rộng 10 cm. Người ta cắt bỏ đi một nửa hình tròn có đường kính đúng bằng chiều dài 20 cm ở bên trong. Tính diện tích phần bìa tô màu còn lại. (Lấy số pi bằng 3,14)',
        options: ['38 cm²', '43 cm²', '47 cm²', '52 cm²'],
        correctIndex: 1,
        hint: 'Tính diện tích hình chữ nhật ban đầu rồi trừ đi diện tích nửa hình tròn có bán kính 10 cm.',
        solution: 'Lấy diện tích hình chữ nhật 200 cm² trừ đi nửa hình tròn 157 cm², còn lại 43 cm².',
        steps: [
          'Diện tích hình chữ nhật là: 20 × 10 = 200 (cm²).',
          'Bán kính của nửa hình tròn là: 20 : 2 = 10 (cm).',
          'Diện tích nửa hình tròn là: 10 × 10 × 3,14 : 2 = 157 (cm²).',
          'Diện tích phần bìa tô màu còn lại là: 200 - 157 = 43 (cm²).'
        ],
        svgType: 'rect_minus_semi',
        svgData: { val1: 'Chiều dài: 20 cm', val2: '10 cm' }
      },
      {
        id: 18,
        title: 'Bốn góc cung tròn tạo phần lõm ở giữa',
        question: 'Cho một hình vuông có cạnh dài 14 cm. Tại bốn góc của hình vuông, người ta cắt đi 4 phần tư hình tròn có bán kính đều bằng 7 cm. Tính diện tích phần tô màu còn lại ở chính giữa. (Lấy số pi bằng 3,14)',
        options: ['38,14 cm²', '42,14 cm²', '44,14 cm²', '48,86 cm²'],
        correctIndex: 1,
        hint: 'Bốn góc phần tư hình tròn có cùng bán kính 7 cm khi ghép lại sẽ tạo thành một hình tròn hoàn chỉnh.',
        solution: 'Lấy diện tích hình vuông 196 cm² trừ đi diện tích một hình tròn bán kính 7 cm là 153,86 cm², còn lại 42,14 cm².',
        steps: [
          'Diện tích hình vuông là: 14 × 14 = 196 (cm²).',
          'Bốn phần tư hình tròn bán kính 7 cm ghép lại vừa bằng một hình tròn bán kính 7 cm.',
          'Diện tích hình tròn bán kính 7 cm là: 7 × 7 × 3,14 = 153,86 (cm²).',
          'Diện tích phần tô màu ở chính giữa là: 196 - 153,86 = 42,14 (cm²).'
        ],
        svgType: 'sq_four_quarters',
        svgData: { val1: 'Cạnh: 14 cm' }
      },
      {
        id: 19,
        title: 'Hình trăng khuyết từ ba nửa hình tròn',
        question: 'Cho nửa hình tròn lớn đường kính AB dài 20 cm. Trên đoạn AB lấy điểm C sao cho đoạn AC dài 12 cm và đoạn CB dài 8 cm, rồi vẽ hai nửa hình tròn nhỏ đường kính AC và CB nằm bên trong. Tính diện tích phần tô màu nằm ngoài hai nửa hình tròn nhỏ. (Lấy số pi bằng 3,14)',
        options: ['68,42 cm²', '72,18 cm²', '75,36 cm²', '78,5 cm²'],
        correctIndex: 2,
        hint: 'Tính diện tích nửa hình tròn lớn đường kính 20 cm, rồi trừ đi tổng diện tích hai nửa hình tròn nhỏ có đường kính 12 cm và 8 cm.',
        solution: 'Diện tích nửa hình tròn lớn trừ tổng hai nửa hình tròn nhỏ bằng 75,36 cm².',
        steps: [
          'Bán kính nửa hình tròn lớn là: 20 : 2 = 10 (cm). Diện tích nửa hình tròn lớn là: 10 × 10 × 3,14 : 2 = 157 (cm²).',
          'Bán kính nửa hình tròn đường kính AC là: 12 : 2 = 6 (cm). Diện tích là: 6 × 6 × 3,14 : 2 = 56,52 (cm²).',
          'Bán kính nửa hình tròn đường kính CB là: 8 : 2 = 4 (cm). Diện tích là: 4 × 4 × 3,14 : 2 = 25,12 (cm²).',
          'Diện tích phần tô màu là: 157 - (56,52 + 25,12) = 75,36 (cm²).'
        ],
        svgType: 'semi_crescents',
        svgData: { val1: 'AC: 12 cm', val2: 'CB: 8 cm' }
      },
      {
        id: 20,
        title: 'Bài toán ngược tìm bán kính hình vành khăn',
        question: 'Một hình vành khăn giới hạn bởi hai đường tròn đồng tâm có diện tích là 200,96 cm². Biết bán kính đường tròn lớn bên ngoài là 10 cm. Tính bán kính của đường tròn nhỏ bên trong. (Lấy số pi bằng 3,14)',
        options: ['4 cm', '5 cm', '6 cm', '8 cm'],
        correctIndex: 2,
        hint: 'Tính diện tích hình tròn lớn trước, sau đó trừ đi diện tích hình vành khăn để tìm diện tích hình tròn nhỏ.',
        solution: 'Diện tích hình tròn nhỏ là 113,04 cm², suy ra bán kính hình tròn nhỏ là 6 cm.',
        steps: [
          'Diện tích hình tròn lớn bán kính 10 cm là: 10 × 10 × 3,14 = 314 (cm²).',
          'Diện tích hình tròn nhỏ bên trong là: 314 - 200,96 = 113,04 (cm²).',
          'Tích hai bán kính hình tròn nhỏ là: 113,04 : 3,14 = 36.',
          'Vì 6 × 6 = 36 nên bán kính đường tròn nhỏ là 6 cm.'
        ],
        svgType: 'ring_inverse',
        svgData: { val1: '10 cm', val2: 'Bán kính nhỏ: ?', val3: 'Vành khăn: 200,96 cm²' }
      }
    ]
  },

  // ==================== ĐỀ 03: BIẾN ĐỔI HÌNH CHỮ NHẬT & HÌNH VUÔNG (10 CÂU) ====================
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
        id: 21,
        title: 'Biến hình chữ nhật thành hình vuông',
        question: 'Một mảnh đất hình chữ nhật có chiều dài gấp 3 lần chiều rộng. Nếu tăng chiều rộng thêm 5 m và giảm chiều dài đi 5 m thì mảnh đất trở thành hình vuông. Diện tích mảnh đất ban đầu là bao nhiêu?',
        options: ['75 m²', '150 m²', '300 m²', '375 m²'],
        correctIndex: 0,
        hint: 'Khi giảm chiều dài 5 m và tăng chiều rộng 5 m thì hai cạnh bằng nhau, nghĩa là hiệu giữa chiều dài và chiều rộng ban đầu là 10 m.',
        solution: 'Chiều rộng ban đầu là 5 m, chiều dài ban đầu là 15 m, nên diện tích mảnh đất là 75 m².',
        steps: [
          'Vì giảm chiều dài 5 m và tăng chiều rộng 5 m thì hai cạnh bằng nhau nên chiều dài hơn chiều rộng là: 5 + 5 = 10 (m).',
          'Áp dụng bài toán Hiệu - Tỉ với tỉ số 3/1, chiều rộng ban đầu là: 10 : (3 - 1) = 5 (m).',
          'Chiều dài ban đầu là: 5 × 3 = 15 (m).',
          'Diện tích mảnh đất ban đầu là: 15 × 5 = 75 (m²).'
        ],
        svgType: 'rect_to_sq',
        svgData: { val1: 'Dài gấp 3 lần rộng', val2: 'Giảm 5 m', val3: 'Tăng 5 m' }
      },
      {
        id: 22,
        title: 'Thay đổi diện tích theo tỉ số phần trăm',
        question: 'Nếu tăng chiều dài của một hình chữ nhật thêm 10% và tăng chiều rộng thêm 20% thì diện tích của hình chữ nhật đó tăng thêm bao nhiêu phần trăm?',
        options: ['30%', '32%', '35%', '38%'],
        correctIndex: 1,
        hint: 'Coi chiều dài và chiều rộng ban đầu đều là 100%. Nhân tỉ lệ chiều dài mới với chiều rộng mới để tìm tỉ số phần trăm diện tích mới.',
        solution: 'Diện tích mới bằng 132% diện tích ban đầu, tức là tăng thêm 32%.',
        steps: [
          'Chiều dài mới so với chiều dài ban đầu là: 100% + 10% = 110% (bằng 1,1 lần).',
          'Chiều rộng mới so với chiều rộng ban đầu là: 100% + 20% = 120% (bằng 1,2 lần).',
          'Diện tích mới so với diện tích ban đầu là: 1,1 × 1,2 = 1,32 = 132%.',
          'Diện tích hình chữ nhật đã tăng thêm là: 132% - 100% = 32%.'
        ],
        svgType: 'rect_pct',
        svgData: { val1: '+10% chiều dài', val2: '+20% chiều rộng' }
      },
      {
        id: 23,
        title: 'Mở rộng chiều dài hình chữ nhật',
        question: 'Một hình chữ nhật có chiều dài gấp đôi chiều rộng. Nếu kéo dài chiều dài thêm 6 cm và giữ nguyên chiều rộng thì diện tích tăng thêm 72 cm². Tính chu vi hình chữ nhật ban đầu.',
        options: ['60 cm', '72 cm', '84 cm', '96 cm'],
        correctIndex: 1,
        hint: 'Phần diện tích tăng thêm là một hình chữ nhật có chiều rộng 6 cm và chiều dài bằng đúng chiều rộng của hình chữ nhật ban đầu.',
        solution: 'Chiều rộng ban đầu là 12 cm, chiều dài là 24 cm, nên chu vi ban đầu là 72 cm.',
        steps: [
          'Chiều rộng của hình chữ nhật ban đầu là: 72 : 6 = 12 (cm).',
          'Chiều dài của hình chữ nhật ban đầu là: 12 × 2 = 24 (cm).',
          'Chu vi hình chữ nhật ban đầu là: (24 + 12) × 2 = 72 (cm).'
        ],
        svgType: 'rect_add_len',
        svgData: { val1: 'Dài gấp 2 rộng', val2: '+72 cm²', val3: '+6 cm' }
      },
      {
        id: 24,
        title: 'Mở rộng cả hai cạnh hình vuông',
        question: 'Một hình vuông nếu mở rộng mỗi cạnh thêm 4 cm thì diện tích tăng thêm 112 cm². Tính diện tích của hình vuông ban đầu.',
        options: ['100 cm²', '121 cm²', '144 cm²', '169 cm²'],
        correctIndex: 2,
        hint: 'Phần diện tích tăng thêm gồm 2 hình chữ nhật bằng nhau có chiều rộng 4 cm và 1 hình vuông nhỏ ở góc có cạnh 4 cm.',
        solution: 'Cạnh hình vuông ban đầu là 12 cm, nên diện tích ban đầu là 144 cm².',
        steps: [
          'Diện tích hình vuông nhỏ ở góc tạo bởi hai phần mở rộng là: 4 × 4 = 16 (cm²).',
          'Diện tích hai hình chữ nhật mở rộng dọc theo hai cạnh là: 112 - 16 = 96 (cm²).',
          'Diện tích mỗi hình chữ nhật mở rộng là: 96 : 2 = 48 (cm²).',
          'Độ dài cạnh hình vuông ban đầu là: 48 : 4 = 12 (cm). Vậy diện tích hình vuông ban đầu là: 12 × 12 = 144 (cm²).'
        ],
        svgType: 'sq_expand_both',
        svgData: { val1: '4×4', val2: 'Tăng 112 cm²' }
      },
      {
        id: 25,
        title: 'Thay đổi kích thước giữ nguyên quy luật nửa chu vi',
        question: 'Một thửa ruộng hình chữ nhật có chu vi 84 m. Nếu tăng chiều dài thêm 6 m và giảm chiều rộng đi 4 m thì được hình chữ nhật mới có chiều dài gấp 3 lần chiều rộng. Tính diện tích thửa ruộng ban đầu.',
        options: ['360 m²', '385 m²', '405 m²', '420 m²'],
        correctIndex: 2,
        hint: 'Tính nửa chu vi ban đầu, sau đó cộng thêm 6 m và trừ đi 4 m để tìm nửa chu vi của hình chữ nhật mới.',
        solution: 'Chiều rộng ban đầu là 15 m, chiều dài là 27 m, nên diện tích thửa ruộng ban đầu là 405 m².',
        steps: [
          'Nửa chu vi thửa ruộng ban đầu là: 84 : 2 = 42 (m).',
          'Khi tăng chiều dài 6 m và giảm chiều rộng 4 m, nửa chu vi mới là: 42 + 6 - 4 = 44 (m).',
          'Vì chiều dài mới gấp 3 lần chiều rộng mới nên chiều rộng mới là: 44 : (3 + 1) = 11 (m).',
          'Chiều rộng ban đầu là: 11 + 4 = 15 (m). Chiều dài ban đầu là: 42 - 15 = 27 (m).',
          'Diện tích thửa ruộng ban đầu là: 27 × 15 = 405 (m²).'
        ],
        svgType: 'rect_perim_change',
        svgData: { val1: 'Chu vi: 84 m', val2: 'Rộng -4 m', val3: 'Dài +6 m' }
      },
      {
        id: 26,
        title: 'Mở rộng cùng một độ dài ở cả hai chiều hình chữ nhật',
        question: 'Một hình chữ nhật có chiều dài hơn chiều rộng 12 m. Nếu cùng tăng cả chiều dài và chiều rộng thêm 4 m thì diện tích tăng thêm 224 m². Tính diện tích hình chữ nhật ban đầu.',
        options: ['560 m²', '600 m²', '640 m²', '720 m²'],
        correctIndex: 2,
        hint: 'Trừ đi phần hình vuông góc 4 × 4 m² để tìm diện tích dải chữ nhật có chiều rộng 4 m và chiều dài bằng tổng (chiều dài + chiều rộng).',
        solution: 'Nửa chu vi ban đầu là 52 m, suy ra chiều dài 32 m, chiều rộng 20 m và diện tích 640 m².',
        steps: [
          'Diện tích hình vuông nhỏ ở góc tăng thêm là: 4 × 4 = 16 (m²).',
          'Diện tích hai dải chữ nhật gắn vào hai cạnh là: 224 - 16 = 208 (m²).',
          'Tổng của chiều dài và chiều rộng ban đầu (nửa chu vi) là: 208 : 4 = 52 (m).',
          'Chiều dài ban đầu là: (52 + 12) : 2 = 32 (m). Chiều rộng ban đầu là: 52 - 32 = 20 (m).',
          'Diện tích hình chữ nhật ban đầu là: 32 × 20 = 640 (m²).'
        ],
        svgType: 'rect_expand_both',
        svgData: { val1: 'Dài hơn rộng 12 m', val2: '4×4', val3: '+224 m²' }
      },
      {
        id: 27,
        title: 'Tính ngược diện tích sau khi tăng giảm phần trăm',
        question: 'Nếu tăng chiều dài một hình chữ nhật thêm 20% và giảm chiều rộng đi 15% thì được hình chữ nhật mới có diện tích 408 cm². Tính diện tích hình chữ nhật ban đầu.',
        options: ['380 cm²', '400 cm²', '416 cm²', '420 cm²'],
        correctIndex: 1,
        hint: 'Tính xem diện tích mới ứng với bao nhiêu phần trăm của diện tích ban đầu, rồi chia ngược để tìm 100%.',
        solution: 'Diện tích mới bằng 102% diện tích ban đầu, suy ra diện tích ban đầu là 400 cm².',
        steps: [
          'Chiều dài mới bằng: 100% + 20% = 120% (tức 1,2 lần chiều dài ban đầu).',
          'Chiều rộng mới bằng: 100% - 15% = 85% (tức 0,85 lần chiều rộng ban đầu).',
          'Diện tích mới so với diện tích ban đầu là: 1,2 × 0,85 = 1,02 = 102%.',
          'Diện tích hình chữ nhật ban đầu là: 408 : 102 × 100 = 400 (cm²).'
        ],
        svgType: 'rect_pct_inv',
        svgData: { val1: 'Diện tích mới: 408 cm²', val2: 'Dài +20%, Rộng -15%' }
      },
      {
        id: 28,
        title: 'Ghép hình chữ nhật từ bốn hình vuông bằng nhau',
        question: 'Một hình chữ nhật được ghép bởi 4 hình vuông nhỏ bằng nhau xếp thẳng thành một hàng ngang. Biết diện tích hình chữ nhật là 256 cm². Tính chu vi của hình chữ nhật đó.',
        options: ['64 cm', '72 cm', '80 cm', '96 cm'],
        correctIndex: 2,
        hint: 'Chia diện tích hình chữ nhật cho 4 để tìm diện tích một hình vuông nhỏ, từ đó suy ra cạnh hình vuông.',
        solution: 'Cạnh mỗi hình vuông nhỏ là 8 cm, nên hình chữ nhật dài 32 cm, rộng 8 cm và chu vi là 80 cm.',
        steps: [
          'Diện tích của một hình vuông nhỏ là: 256 : 4 = 64 (cm²).',
          'Vì 8 × 8 = 64 nên cạnh của mỗi hình vuông nhỏ là 8 cm.',
          'Chiều rộng hình chữ nhật bằng 8 cm, chiều dài hình chữ nhật là: 8 × 4 = 32 (cm).',
          'Chu vi hình chữ nhật là: (32 + 8) × 2 = 80 (cm).'
        ],
        svgType: 'rect_4_squares',
        svgData: { val1: 'Tổng diện tích: 256 cm²', val2: '4 hình vuông bằng nhau' }
      },
      {
        id: 29,
        title: 'Cắt bớt cả hai cạnh của hình vuông',
        question: 'Một tấm bìa hình vuông nếu cắt bớt một cạnh đi 5 cm và cắt bớt cạnh liền kề đi 3 cm thì diện tích giảm đi 145 cm². Tính diện tích tấm bìa hình vuông ban đầu.',
        options: ['324 cm²', '361 cm²', '400 cm²', '441 cm²'],
        correctIndex: 2,
        hint: 'Khi cắt hai dải dọc theo hai cạnh kề nhau, phần hình chữ nhật góc kích thước 5 cm × 3 cm bị tính chồng 2 lần nên cần cộng thêm 15 cm² vào phần diện tích giảm.',
        solution: 'Cạnh hình vuông ban đầu là 20 cm, nên diện tích ban đầu là 400 cm².',
        steps: [
          'Nếu xét riêng hai dải hình chữ nhật có chiều dài bằng cạnh hình vuông (rộng 5 cm và rộng 3 cm), phần góc 5 × 3 = 15 cm² bị tính lặp lại.',
          'Tổng diện tích hai dải hình chữ nhật có chiều dài bằng cạnh hình vuông là: 145 + 15 = 160 (cm²).',
          'Chiều rộng tổng cộng của hai dải ghép nối tiếp là: 5 + 3 = 8 (cm).',
          'Độ dài cạnh hình vuông ban đầu là: 160 : 8 = 20 (cm). Vậy diện tích ban đầu là: 20 × 20 = 400 (cm²).'
        ],
        svgType: 'sq_cut_both',
        svgData: { val1: 'Bớt 5 cm', val2: 'Bớt 3 cm', val3: 'Diện tích giảm: 145 cm²' }
      },
      {
        id: 30,
        title: 'Lối đi bao quanh bên trong khu vườn',
        question: 'Một khu vườn hình chữ nhật có chiều dài 30 m và chiều rộng 22 m. Người ta làm một lối đi rộng 2 m chạy xung quanh sát hàng rào ở bên trong khu vườn, phần ở giữa để trồng cây. Tính diện tích phần đất trồng cây.',
        options: ['440 m²', '468 m²', '520 m²', '556 m²'],
        correctIndex: 1,
        hint: 'Mỗi chiều của phần đất trồng cây đều bị bớt đi ở cả hai phía trái - phải (hoặc trên - dưới) mỗi bên 2 m.',
        solution: 'Phần trồng cây dài 26 m, rộng 18 m, có diện tích 468 m².',
        steps: [
          'Vì lối đi rộng 2 m bao quanh cả 4 phía nên chiều dài phần đất trồng cây bị giảm đi ở cả hai đầu là: 30 - 2 × 2 = 26 (m).',
          'Chiều rộng phần đất trồng cây còn lại là: 22 - 2 × 2 = 18 (m).',
          'Diện tích phần đất trồng cây là: 26 × 18 = 468 (m²).'
        ],
        svgType: 'rect_inner_path',
        svgData: { val1: 'Chiều dài: 30 m', val2: '22 m', val3: 'Lối đi rộng 2 m' }
      }
    ]
  },

  // ==================== ĐỀ 04: HÌNH THANG & ĐƯỜNG CHÉO (10 CÂU) ====================
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
        id: 31,
        title: 'Hai tam giác cánh bướm bằng nhau',
        question: 'Cho hình thang ABCD có hai đáy là AB và CD. Hai đường chéo AC và BD cắt nhau tại điểm O. Biết diện tích tam giác AOB là 9 cm² và diện tích tam giác BOC là 15 cm². Diện tích hình thang ABCD là bao nhiêu?',
        options: ['48 cm²', '64 cm²', '72 cm²', '80 cm²'],
        correctIndex: 1,
        hint: 'Trong hình thang có hai tam giác bên bằng nhau (diện tích AOD bằng diện tích BOC), và tỉ số diện tích AOB với AOD bằng tỉ số diện tích BOC với COD.',
        solution: 'Diện tích tam giác AOD là 15 cm², diện tích tam giác COD là 25 cm², nên diện tích hình thang là 64 cm².',
        steps: [
          'Hai tam giác ABD và ABC chung đáy AB và chiều cao bằng nhau nên diện tích bằng nhau. Trừ phần chung AOB suy ra diện tích tam giác AOD bằng diện tích tam giác BOC và bằng 15 cm².',
          'Hai tam giác AOB và BOC chung chiều cao hạ từ B xuống AC nên tỉ số đáy OA và OC bằng: 9 : 15 = 3/5.',
          'Hai tam giác AOD và COD cũng có chung chiều cao hạ từ D xuống AC và chung tỉ số đáy OA và OC bằng 3/5.',
          'Do đó diện tích tam giác COD là: 15 : 3 × 5 = 25 (cm²). Diện tích hình thang ABCD là: 9 + 15 + 15 + 25 = 64 (cm²).'
        ],
        svgType: 'trap_butterfly_basic',
        svgData: { val1: '9 cm²', val2: '15 cm²' }
      },
      {
        id: 32,
        title: 'Kéo dài đáy lớn hình thang',
        question: 'Một hình thang ABCD có đáy bé AB dài 12 cm, đáy lớn CD dài 18 cm. Khi kéo dài đáy lớn CD thêm 6 cm về phía C thì diện tích tăng thêm 45 cm². Diện tích hình thang ABCD ban đầu là bao nhiêu?',
        options: ['180 cm²', '210 cm²', '225 cm²', '240 cm²'],
        correctIndex: 2,
        hint: 'Phần diện tích tăng thêm là một tam giác có đáy dài 6 cm và chiều cao đúng bằng chiều cao của hình thang.',
        solution: 'Chiều cao hình thang là 15 cm, suy ra diện tích hình thang ban đầu là 225 cm².',
        steps: [
          'Phần tăng thêm là một hình tam giác có đáy bằng 6 cm và chiều cao bằng chiều cao hình thang.',
          'Chiều cao của hình thang là: 45 × 2 : 6 = 15 (cm).',
          'Diện tích hình thang ABCD ban đầu là: (12 + 18) × 15 : 2 = 225 (cm²).'
        ],
        svgType: 'trap_extend_base',
        svgData: { val1: '12 cm', val2: '18 cm', val3: '+6 cm', val4: '+45 cm²' }
      },
      {
        id: 33,
        title: 'Biết tỉ số hai đáy và diện tích tam giác trên',
        question: 'Cho hình thang ABCD có đáy bé AB bằng 2/3 đáy lớn CD. Hai đường chéo AC và BD cắt nhau tại điểm O. Biết diện tích tam giác AOB bằng 24 cm². Tính diện tích hình thang ABCD.',
        options: ['120 cm²', '136 cm²', '150 cm²', '160 cm²'],
        correctIndex: 2,
        hint: 'So sánh diện tích tam giác ABC và ACD qua tỉ số hai đáy AB và CD để suy ra tỉ số diện tích giữa hai tam giác AOB và AOD.',
        solution: 'Diện tích các tam giác lần lượt là 24, 36, 36 và 54 cm², tổng bằng 150 cm².',
        steps: [
          'Hai tam giác ABC và ACD có chiều cao bằng nhau và đáy AB bằng 2/3 đáy CD nên diện tích tam giác ABC bằng 2/3 diện tích tam giác ACD.',
          'Hai tam giác này chung đáy AC nên chiều cao hạ từ B xuống AC bằng 2/3 chiều cao hạ từ D xuống AC.',
          'Vì vậy diện tích tam giác AOB bằng 2/3 diện tích tam giác AOD. Suy ra diện tích tam giác AOD là: 24 : 2 × 3 = 36 (cm²).',
          'Tương tự, diện tích tam giác BOC bằng 36 cm² và diện tích tam giác COD là: 36 : 2 × 3 = 54 (cm²).',
          'Diện tích hình thang ABCD là: 24 + 36 + 36 + 54 = 150 (cm²).'
        ],
        svgType: 'trap_ratio_o',
        svgData: { val1: 'Đáy AB bằng 2/3 đáy CD', val2: 'Tam giác trên: 24 cm²' }
      },
      {
        id: 34,
        title: 'Từ diện tích hình thang tìm tam giác đáy lớn',
        question: 'Một hình thang ABCD có diện tích 162 cm², đáy bé AB bằng một nửa đáy lớn CD. Hai đường chéo AC và BD cắt nhau tại điểm O. Tính diện tích tam giác COD.',
        options: ['54 cm²', '64 cm²', '72 cm²', '81 cm²'],
        correctIndex: 2,
        hint: 'Vì đáy AB bằng 1/2 đáy CD, hãy biểu diễn diện tích 4 tam giác quanh điểm O theo số phần bằng nhau.',
        solution: 'Chia hình thang thành 9 phần bằng nhau thì tam giác COD chiếm 4 phần, bằng 72 cm².',
        steps: [
          'Vì đáy AB bằng 1/2 đáy CD nên tỉ số đoạn OA trên OC và OB trên OD đều bằng 1/2.',
          'Coi diện tích tam giác AOB là 1 phần thì diện tích mỗi tam giác bên AOD và BOC bằng 2 phần.',
          'Khi đó diện tích tam giác COD bằng: 2 × 2 = 4 (phần).',
          'Tổng số phần của cả hình thang ABCD là: 1 + 2 + 2 + 4 = 9 (phần).',
          'Diện tích tam giác COD là: 162 : 9 × 4 = 72 (cm²).'
        ],
        svgType: 'trap_total_to_cod',
        svgData: { val1: 'AB bằng 1/2 CD', val2: 'Diện tích ABCD: 162 cm²' }
      },
      {
        id: 35,
        title: 'Mở rộng hình thang vuông thành hình chữ nhật',
        question: 'Một hình thang vuông có đáy bé dài 18 cm và đáy lớn dài 30 cm. Nếu kéo dài đáy bé sao cho hình thang trở thành hình chữ nhật thì diện tích tăng thêm 96 cm². Tính diện tích hình thang ban đầu.',
        options: ['320 cm²', '360 cm²', '384 cm²', '412 cm²'],
        correctIndex: 2,
        hint: 'Phần diện tích tăng thêm là một tam giác vuông có cạnh đáy bằng hiệu hai đáy hình thang.',
        solution: 'Chiều cao hình thang là 16 cm, nên diện tích hình thang ban đầu là 384 cm².',
        steps: [
          'Đoạn cần kéo dài thêm ở đáy bé là: 30 - 18 = 12 (cm).',
          'Phần tăng thêm là một tam giác vuông có đáy 12 cm và chiều cao bằng chiều cao hình thang.',
          'Chiều cao hình thang là: 96 × 2 : 12 = 16 (cm).',
          'Diện tích hình thang ban đầu là: (18 + 30) × 16 : 2 = 384 (cm²).'
        ],
        svgType: 'trap_to_rect',
        svgData: { val1: '18 cm', val2: '30 cm', val3: '+96 cm²' }
      },
      {
        id: 36,
        title: 'Thay đổi cả hai đáy hình thang',
        question: 'Một thửa ruộng hình thang có đáy lớn 36 m và đáy bé 24 m. Nếu giảm đáy lớn đi 8 m và tăng đáy bé thêm 4 m thì diện tích thửa ruộng giảm đi 32 m². Tính diện tích thửa ruộng ban đầu.',
        options: ['420 m²', '450 m²', '480 m²', '520 m²'],
        correctIndex: 2,
        hint: 'Tìm xem tổng hai đáy sau khi thay đổi giảm đi bao nhiêu mét; phần diện tích giảm 32 m² tương ứng với một tam giác có đáy bằng hiệu đó.',
        solution: 'Tổng hai đáy giảm 4 m nên chiều cao hình thang là 16 m, diện tích ban đầu là 480 m².',
        steps: [
          'Tổng hai đáy ban đầu là: 36 + 24 = 60 (m).',
          'Khi giảm đáy lớn 8 m và tăng đáy bé 4 m, tổng hai đáy giảm đi: 8 - 4 = 4 (m).',
          'Diện tích giảm đi bằng nửa tích của phần tổng đáy bị giảm nhân với chiều cao, nên chiều cao là: 32 × 2 : 4 = 16 (m).',
          'Diện tích thửa ruộng ban đầu là: 60 × 16 : 2 = 480 (m²).'
        ],
        svgType: 'trap_change_bases',
        svgData: { val1: 'Đáy bé: 24 m', val2: 'Đáy lớn: 36 m', val3: 'Diện tích giảm 32 m²' }
      },
      {
        id: 37,
        title: 'Tam giác nối đỉnh với trung điểm cạnh bên',
        question: 'Cho hình thang ABCD có diện tích 180 cm². Gọi M là trung điểm của cạnh bên BC. Tính diện tích tam giác AMD.',
        options: ['60 cm²', '75 cm²', '90 cm²', '120 cm²'],
        correctIndex: 2,
        hint: 'So sánh tổng diện tích hai tam giác ABM và DCM với diện tích hình thang ABCD dựa vào chiều cao bằng một nửa chiều cao hình thang.',
        solution: 'Diện tích tam giác AMD luôn bằng đúng một nửa diện tích hình thang ABCD, bằng 90 cm².',
        steps: [
          'Vì M là trung điểm cạnh bên BC nên khoảng cách từ M đến hai đáy AB và CD đều bằng một nửa chiều cao hình thang.',
          'Tổng diện tích hai tam giác ABM và DCM bằng: (AB × chiều cao : 2 + CD × chiều cao : 2) : 2 = (AB + CD) × chiều cao : 4, đúng bằng một nửa diện tích hình thang.',
          'Phần còn lại là tam giác AMD cũng có diện tích bằng một nửa diện tích hình thang ABCD.',
          'Diện tích tam giác AMD là: 180 : 2 = 90 (cm²).'
        ],
        svgType: 'trap_mid_side',
        svgData: { val1: 'Diện tích ABCD: 180 cm²' }
      },
      {
        id: 38,
        title: 'Chia hình thang thành hai phần diện tích bằng nhau',
        question: 'Cho hình thang ABCD có đáy bé AB dài 12 cm, đáy lớn CD dài 24 cm và chiều cao bằng 10 cm. Trên đáy lớn CD lấy điểm M sao cho đoạn thẳng AM chia hình thang thành hai phần có diện tích bằng nhau. Tính độ dài đoạn thẳng CM.',
        options: ['4 cm', '6 cm', '8 cm', '9 cm'],
        correctIndex: 1,
        hint: 'Tính một nửa diện tích hình thang để tìm diện tích tam giác AMD, từ đó tính độ dài cạnh đáy DM rồi suy ra CM.',
        solution: 'Một nửa diện tích hình thang là 90 cm², suy ra đáy DM dài 18 cm và đoạn CM dài 6 cm.',
        steps: [
          'Diện tích hình thang ABCD là: (12 + 24) × 10 : 2 = 180 (cm²).',
          'Diện tích của mỗi phần sau khi chia đôi là: 180 : 2 = 90 (cm²).',
          'Tam giác AMD có chiều cao bằng 10 cm và diện tích bằng 90 cm², nên độ dài đáy DM là: 90 × 2 : 10 = 18 (cm).',
          'Độ dài đoạn thẳng CM là: 24 - 18 = 6 (cm).'
        ],
        svgType: 'trap_split_half',
        svgData: { val1: '12 cm', val2: '24 cm', val3: '10 cm' }
      },
      {
        id: 39,
        title: 'Hiệu diện tích hai tam giác đối diện trong hình thang',
        question: 'Cho hình thang ABCD có đáy bé AB bằng 3/5 đáy lớn CD. Hai đường chéo AC và BD cắt nhau tại điểm O. Biết diện tích tam giác COD lớn hơn diện tích tam giác AOB là 64 cm². Tính diện tích hình thang ABCD.',
        options: ['196 cm²', '224 cm²', '256 cm²', '288 cm²'],
        correctIndex: 2,
        hint: 'Từ tỉ số hai đáy 3/5, tìm số phần diện tích của mỗi tam giác AOB (9 phần), AOD (15 phần), BOC (15 phần) và COD (25 phần).',
        solution: 'Hiệu số phần giữa COD và AOB là 16 phần ứng với 64 cm², nên cả hình thang 64 phần có diện tích 256 cm².',
        steps: [
          'Vì đáy AB bằng 3/5 đáy CD nên tỉ số đoạn OA trên OC cũng bằng 3/5.',
          'Biểu diễn tỉ số diện tích của 4 tam giác quanh điểm O: AOB chiếm 9 phần, hai tam giác bên AOD và BOC mỗi hình chiếm 15 phần, tam giác COD chiếm 25 phần.',
          'Hiệu số phần giữa tam giác COD và tam giác AOB là: 25 - 9 = 16 (phần).',
          'Giá trị 1 phần là: 64 : 16 = 4 (cm²).',
          'Tổng số phần của hình thang là: 9 + 15 + 15 + 25 = 64 (phần). Vậy diện tích hình thang ABCD là: 64 × 4 = 256 (cm²).'
        ],
        svgType: 'trap_diff_o',
        svgData: { val1: 'Đáy AB bằng 3/5 CD', val2: 'Hiệu COD và AOB: 64 cm²' }
      },
      {
        id: 40,
        title: 'Tìm chiều cao hình thang qua giao điểm đường chéo',
        question: 'Cho hình thang ABCD có đáy bé AB dài 16 cm, đáy lớn CD dài 24 cm. Hai đường chéo AC và BD cắt nhau tại điểm O. Biết diện tích tam giác AOB bằng 32 cm². Tính chiều cao của hình thang ABCD.',
        options: ['8 cm', '10 cm', '12 cm', '15 cm'],
        correctIndex: 1,
        hint: 'Tính tỉ số giữa hai đáy 16/24 rút gọn thành 2/3 để tìm diện tích ba tam giác còn lại, từ tổng diện tích suy ra chiều cao.',
        solution: 'Tổng diện tích hình thang bằng 200 cm², suy ra chiều cao hình thang là 10 cm.',
        steps: [
          'Tỉ số giữa đáy bé AB và đáy lớn CD là: 16 : 24 = 2/3.',
          'Suy ra diện tích tam giác AOD và tam giác BOC đều bằng: 32 : 2 × 3 = 48 (cm²).',
          'Diện tích tam giác COD là: 48 : 2 × 3 = 72 (cm²).',
          'Diện tích hình thang ABCD là: 32 + 48 + 48 + 72 = 200 (cm²).',
          'Chiều cao của hình thang ABCD là: 200 × 2 : (16 + 24) = 10 (cm).'
        ],
        svgType: 'trap_find_height',
        svgData: { val1: '16 cm', val2: '24 cm', val3: 'AOB: 32 cm²' }
      }
    ]
  },

  // ==================== ĐỀ 05: HÌNH KHỐI 3D & NƯỚC DÂNG (10 CÂU) ====================
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
        id: 41,
        title: 'Khối lập phương không sơn mặt nào',
        question: 'Người ta xếp các khối lập phương nhỏ cạnh 1 cm thành một khối lập phương lớn cạnh 5 cm, sau đó sơn toàn bộ 6 mặt ngoài của khối lớn. Hỏi có bao nhiêu khối lập phương nhỏ không được sơn mặt nào?',
        options: ['27 khối', '36 khối', '48 khối', '64 khối'],
        correctIndex: 0,
        hint: 'Các khối nhỏ không được sơn mặt nào nằm hoàn toàn bên trong lõi, có số khối mỗi chiều giảm đi 2 khối ở hai đầu.',
        solution: 'Phần lõi bên trong là khối lập phương 3 × 3 × 3 gồm 27 khối nhỏ không sơn mặt nào.',
        steps: [
          'Khi bóc lớp vỏ ngoài dày 1 cm ở cả 6 mặt, phần lõi bên trong tạo thành một khối lập phương có cạnh bằng: 5 - 2 = 3 (cm).',
          'Số khối lập phương nhỏ không được sơn mặt nào là: 3 × 3 × 3 = 27 (khối).'
        ],
        svgType: 'cube_paint_0',
        svgData: { val1: 'Cạnh 5 cm', val2: 'Không sơn mặt nào: ?' }
      },
      {
        id: 42,
        title: 'Mực nước dâng khi thả chìm vật thể',
        question: 'Một bể kính hình hộp chữ nhật có kích thước đáy là 40 cm và 30 cm đang chứa nước. Khi thả một hòn đá chìm hoàn toàn vào bể thì mực nước dâng cao thêm 2,5 cm (nước không tràn ra ngoài). Thể tích của hòn đá đó là bao nhiêu?',
        options: ['2.000 cm³', '2.500 cm³', '3.000 cm³', '3.500 cm³'],
        correctIndex: 2,
        hint: 'Thể tích hòn đá bằng đúng thể tích phần nước dâng lên có đáy 40 cm × 30 cm và chiều cao 2,5 cm.',
        solution: 'Thể tích hòn đá bằng 40 × 30 × 2,5 = 3.000 cm³.',
        steps: [
          'Diện tích đáy bể kính là: 40 × 30 = 1.200 (cm²).',
          'Vì hòn đá chìm hoàn toàn và nước không tràn nên thể tích hòn đá bằng thể tích phần nước dâng lên.',
          'Thể tích của hòn đá là: 1.200 × 2,5 = 3.000 (cm³).'
        ],
        svgType: 'water_rise_rock',
        svgData: { val1: 'Đáy: 40 cm × 30 cm', val2: 'Dâng thêm 2,5 cm' }
      },
      {
        id: 43,
        title: 'Khối lập phương sơn đúng một mặt',
        question: 'Dùng 216 khối lập phương nhỏ cạnh 1 cm để xếp thành một khối lập phương lớn, rồi đem sơn kín tất cả 6 mặt ngoài của khối lớn. Hỏi có bao nhiêu khối lập phương nhỏ được sơn đúng 1 mặt?',
        options: ['64 khối', '84 khối', '96 khối', '108 khối'],
        correctIndex: 2,
        hint: 'Tìm độ dài cạnh khối lớn từ 216 khối nhỏ, sau đó đếm các khối nằm ở phần giữa của mỗi mặt (không chạm vào các cạnh).',
        solution: 'Cạnh khối lớn là 6 cm, mỗi mặt có 16 khối sơn 1 mặt, nên cả 6 mặt có 96 khối.',
        steps: [
          'Vì 6 × 6 × 6 = 216 nên cạnh của khối lập phương lớn dài 6 cm.',
          'Trên mỗi mặt, các khối được sơn đúng 1 mặt không chạm cạnh tạo thành hình vuông cạnh: 6 - 2 = 4 (khối).',
          'Số khối sơn đúng 1 mặt trên một mặt của khối lớn là: 4 × 4 = 16 (khối).',
          'Tổng số khối được sơn đúng 1 mặt trên cả 6 mặt là: 16 × 6 = 96 (khối).'
        ],
        svgType: 'cube_paint_1',
        svgData: { val1: '216 khối nhỏ', val2: 'Sơn đúng 1 mặt: ?' }
      },
      {
        id: 44,
        title: 'Hình hộp chữ nhật sơn đúng hai mặt',
        question: 'Xếp các khối lập phương nhỏ cạnh 1 cm thành một hình hộp chữ nhật có chiều dài 6 cm, chiều rộng 5 cm và chiều cao 4 cm, sau đó sơn toàn bộ 6 mặt ngoài. Hỏi có bao nhiêu khối nhỏ được sơn đúng 2 mặt?',
        options: ['24 khối', '32 khối', '36 khối', '48 khối'],
        correctIndex: 2,
        hint: 'Các khối sơn đúng 2 mặt nằm dọc theo 12 cạnh của hình hộp chữ nhật (trừ đi 2 khối ở hai đầu đỉnh mỗi cạnh).',
        solution: 'Cộng số khối ở 4 cạnh dài, 4 cạnh rộng và 4 cạnh cao (bỏ 2 đầu đỉnh), được tổng 36 khối.',
        steps: [
          'Số khối sơn 2 mặt trên 4 cạnh chiều dài là: 4 × (6 - 2) = 16 (khối).',
          'Số khối sơn 2 mặt trên 4 cạnh chiều rộng là: 4 × (5 - 2) = 12 (khối).',
          'Số khối sơn 2 mặt trên 4 cạnh chiều cao là: 4 × (4 - 2) = 8 (khối).',
          'Tổng số khối nhỏ được sơn đúng 2 mặt là: 16 + 12 + 8 = 36 (khối).'
        ],
        svgType: 'box_paint_2',
        svgData: { val1: '6 cm', val2: '5 cm', val3: '4 cm' }
      },
      {
        id: 45,
        title: 'Lượng nước tràn ra ngoài khi thả khối sắt',
        question: 'Một bể kính hình hộp chữ nhật dài 50 cm, rộng 40 cm và cao 35 cm đang chứa nước cao 32 cm. Người ta thả chìm hoàn toàn một khối sắt hình lập phương cạnh 20 cm vào bể. Hỏi có bao nhiêu lít nước bị tràn ra ngoài?',
        options: ['1,5 lít', '2 lít', '2,5 lít', '4 lít'],
        correctIndex: 1,
        hint: 'Tính thể tích phần không gian còn trống phía trên mặt nước rồi lấy thể tích khối sắt trừ đi phần trống đó.',
        solution: 'Phần trống của bể là 6 lít, khối sắt chiếm 8 lít, nên lượng nước tràn ra là 2 lít.',
        steps: [
          'Chiều cao phần còn trống phía trên mặt nước là: 35 - 32 = 3 (cm).',
          'Thể tích phần trống của bể là: 50 × 40 × 3 = 6.000 (cm³) = 6 (lít).',
          'Thể tích khối sắt hình lập phương là: 20 × 20 × 20 = 8.000 (cm³) = 8 (lít).',
          'Lượng nước tràn ra ngoài bể là: 8 - 6 = 2 (lít).'
        ],
        svgType: 'water_overflow',
        svgData: { val1: 'Bể 50 × 40 × 35 cm', val2: 'Khối 20 cm', val3: 'Nước tràn: ? lít' }
      },
      {
        id: 46,
        title: 'Đặt đứng khối bê tông cao hơn mực nước',
        question: 'Một bể nước hình hộp chữ nhật có đáy dài 60 cm, rộng 40 cm, mực nước đang cao 25 cm. Đặt thẳng đứng một khối bê tông hình hộp chữ nhật đáy 20 cm × 20 cm, cao 50 cm chạm tới đáy bể (đầu trên nhô khỏi mặt nước). Mực nước trong bể dâng thêm bao nhiêu xăng-ti-mét?',
        options: ['4 cm', '5 cm', '6 cm', '7,5 cm'],
        correctIndex: 1,
        hint: 'Khi khối bê tông đặt đứng nhô lên khỏi mặt nước, phần diện tích đáy cho nước chiếm chỗ chỉ còn lại bằng diện tích đáy bể trừ đi diện tích đáy khối bê tông.',
        solution: 'Thể tích nước không đổi là 60.000 cm³ chia cho diện tích mặt thoáng mới 2.000 cm² được mực nước mới 30 cm, tăng thêm 5 cm.',
        steps: [
          'Diện tích đáy bể là: 60 × 40 = 2.400 (cm²). Thể tích nước ban đầu là: 2.400 × 25 = 60.000 (cm³).',
          'Diện tích đáy khối bê tông là: 20 × 20 = 400 (cm²).',
          'Vì khối bê tông cao hơn mực nước, diện tích phần đáy còn lại để chứa nước là: 2.400 - 400 = 2.000 (cm²).',
          'Chiều cao mực nước lúc sau là: 60.000 : 2.000 = 30 (cm).',
          'Mực nước trong bể dâng cao thêm là: 30 - 25 = 5 (cm).'
        ],
        svgType: 'water_standing_block',
        svgData: { val1: 'Đáy 60 × 40 cm (nước 25 cm)', val2: 'Khối 20×20' }
      },
      {
        id: 47,
        title: 'Tìm thể tích một viên bi khi thả nhiều viên',
        question: 'Một bể kính hình hộp chữ nhật có đáy dài 45 cm, rộng 20 cm đang chứa nước. Khi thả chìm hoàn toàn 5 viên bi sắt giống hệt nhau vào bể thì mực nước dâng lên thêm 1,2 cm (nước không tràn). Thể tích của mỗi viên bi sắt là bao nhiêu?',
        options: ['180 cm³', '200 cm³', '216 cm³', '240 cm³'],
        correctIndex: 2,
        hint: 'Tính tổng thể tích phần nước dâng lên cho cả 5 viên bi rồi chia đều cho 5.',
        solution: 'Tổng thể tích 5 viên bi là 1.080 cm³, nên mỗi viên bi có thể tích 216 cm³.',
        steps: [
          'Tổng thể tích của cả 5 viên bi sắt bằng thể tích phần nước dâng lên: 45 × 20 × 1,2 = 1.080 (cm³).',
          'Thể tích của mỗi viên bi sắt là: 1.080 : 5 = 216 (cm³).'
        ],
        svgType: 'water_5_balls',
        svgData: { val1: 'Đáy: 45 cm × 20 cm', val2: '5 viên bi dâng 1,2 cm', val3: 'Mỗi viên: ?' }
      },
      {
        id: 48,
        title: 'Bài toán ngược từ số khối không sơn tìm diện tích',
        question: 'Người ta sơn toàn bộ 6 mặt ngoài của một khối lập phương lớn được ghép từ các khối lập phương nhỏ cạnh 1 cm. Biết rằng có đúng 64 khối nhỏ không được sơn mặt nào. Tính diện tích toàn phần của khối lập phương lớn.',
        options: ['150 cm²', '196 cm²', '216 cm²', '256 cm²'],
        correctIndex: 2,
        hint: 'Từ 64 khối không sơn mặt nào ở phần lõi, tìm độ dài cạnh phần lõi rồi cộng thêm 2 cm để ra cạnh khối lớn.',
        solution: 'Cạnh phần lõi là 4 cm, suy ra cạnh khối lớn là 6 cm và diện tích toàn phần là 216 cm².',
        steps: [
          'Phần lõi không sơn mặt nào có 64 khối. Vì 4 × 4 × 4 = 64 nên cạnh phần lõi dài 4 cm.',
          'Độ dài cạnh khối lập phương lớn là: 4 + 2 = 6 (cm).',
          'Diện tích toàn phần của khối lập phương lớn là: 6 × 6 × 6 = 216 (cm²).'
        ],
        svgType: 'cube_paint_inv',
        svgData: { val1: 'Lõi không sơn: 64 khối', val2: 'Diện tích toàn phần: ?' }
      },
      {
        id: 49,
        title: 'Gấp cạnh hình lập phương lên 1,5 lần',
        question: 'Nếu gấp độ dài cạnh của một hình lập phương lên 1,5 lần thì thể tích của hình lập phương đó tăng thêm bao nhiêu phần trăm?',
        options: ['150%', '225%', '237,5%', '337,5%'],
        correctIndex: 2,
        hint: 'Thể tích tăng gấp 1,5 × 1,5 × 1,5 lần. Đổi số lần đó sang tỉ số phần trăm rồi trừ đi 100% ban đầu.',
        solution: 'Thể tích mới bằng 337,5% thể tích cũ, tức là tăng thêm 237,5%.',
        steps: [
          'Khi cạnh gấp lên 1,5 lần thì thể tích mới gấp thể tích cũ số lần là: 1,5 × 1,5 × 1,5 = 3,375 (lần).',
          'Đổi ra tỉ số phần trăm: 3,375 = 337,5%.',
          'Thể tích hình lập phương tăng thêm là: 337,5% - 100% = 237,5%.'
        ],
        svgType: 'cube_scale_pct',
        svgData: { val1: 'Cạnh gấp 1,5 lần', val2: 'Thể tích tăng thêm: ?%' }
      },
      {
        id: 50,
        title: 'Tháo bớt nước rồi thả khối lập phương',
        question: 'Một bể kính hình hộp chữ nhật dài 80 cm, rộng 50 cm và cao 45 cm đang chứa đầy nước. Người ta tháo bớt nước ra cho đến khi mực nước chỉ còn bằng 2/3 chiều cao bể, sau đó thả chìm hoàn toàn một khối lập phương cạnh 30 cm vào bể. Mực nước sau cùng trong bể cao bao nhiêu xăng-ti-mét?',
        options: ['35,5 cm', '36,25 cm', '36,75 cm', '38,5 cm'],
        correctIndex: 2,
        hint: 'Tính chiều cao mực nước sau khi tháo, sau đó tính chiều cao phần nước dâng thêm do khối lập phương cạnh 30 cm chiếm chỗ.',
        solution: 'Mực nước sau khi tháo là 30 cm, thả khối lập phương làm dâng thêm 6,75 cm nên cao 36,75 cm.',
        steps: [
          'Chiều cao mực nước sau khi tháo bớt là: 45 × 2 : 3 = 30 (cm).',
          'Thể tích khối lập phương cạnh 30 cm là: 30 × 30 × 30 = 27.000 (cm³).',
          'Diện tích đáy bể là: 80 × 50 = 4.000 (cm²).',
          'Mực nước dâng thêm khi thả khối lập phương là: 27.000 : 4.000 = 6,75 (cm).',
          'Mực nước sau cùng trong bể cao là: 30 + 6,75 = 36,75 (cm) (nhỏ hơn chiều cao bể 45 cm nên nước không tràn).'
        ],
        svgType: 'water_drain_cube',
        svgData: { val1: 'Bể 80 × 50 × 45 cm', val2: 'Còn 2/3 bể + khối 30 cm', val3: 'Mực nước cuối: ?' }
      }
    ]
  },

  // ==================== ĐỀ 06: QUY LUẬT DÃY SỐ & TÌM SỐ HẠNG (10 CÂU) ====================
  {
    id: 'set-6',
    title: 'Đề 6: Bí ẩn Quy luật Dãy số & Tìm Số hạng',
    badge: 'Quy luật dãy số',
    description: 'Chinh phục số hạng thứ n, tính tổng dãy số cách đều, dãy phân số quy luật và bài toán đếm chữ số trang sách.',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    questions: [
      {
        id: 51,
        title: 'Tìm số hạng thứ 50 của dãy số cách đều',
        question: 'Cho dãy số cách đều: 3, 7, 11, 15, 19, ... Hỏi số hạng thứ 50 của dãy số trên là số nào?',
        options: ['195', '199', '201', '203'],
        correctIndex: 1,
        hint: 'Từ số hạng thứ nhất đến số hạng thứ 50 có 49 khoảng cách bằng nhau, mỗi khoảng cách là 4 đơn vị.',
        solution: 'Số hạng thứ 50 của dãy là: 3 + (50 - 1) × 4 = 199.',
        steps: [
          'Khoảng cách giữa hai số hạng liên tiếp của dãy số là: 7 - 3 = 4 (đơn vị).',
          'Từ số hạng thứ nhất đến số hạng thứ 50 có số khoảng cách là: 50 - 1 = 49 (khoảng cách).',
          'Số hạng thứ 50 của dãy số là: 3 + 49 × 4 = 199.'
        ],
        svgType: 'sequence_pattern',
        svgData: { val1: 'Dãy số: 3, 7, 11, 15, ...', val2: 'Tìm số hạng thứ 50: ?', val3: '+4 đơn vị' }
      },
      {
        id: 52,
        title: 'Tính tổng của 40 số chẵn đầu tiên',
        question: 'Tính tổng của 40 số chẵn liên tiếp đầu tiên kể từ số 2: 2 + 4 + 6 + ... + 80.',
        options: ['1.600', '1.640', '1.680', '1.720'],
        correctIndex: 1,
        hint: 'Tổng của dãy số cách đều bằng tổng của số đầu và số cuối, nhân với số số hạng rồi chia cho 2.',
        solution: 'Tổng của 40 số chẵn liên tiếp đầu tiên bằng (2 + 80) × 40 : 2 = 1.640.',
        steps: [
          'Dãy số trên gồm 40 số hạng cách đều nhau 2 đơn vị, với số đầu là 2 và số cuối là 80.',
          'Tổng của một cặp số đầu và số cuối là: 2 + 80 = 82.',
          'Số cặp số bằng nhau là: 40 : 2 = 20 (cặp).',
          'Tổng giá trị của dãy số là: 82 × 20 = 1.640.'
        ],
        svgType: 'seq_sum',
        svgData: { val1: '2 + 4 + 6 + ... + 80', val2: 'Số lượng: 40 số hạng', val3: 'Tổng giá trị: ?' }
      },
      {
        id: 53,
        title: 'Đếm chữ số dùng để đánh số trang sách',
        question: 'Để đánh số trang của một cuốn sách dày 150 trang (bắt đầu từ trang 1 đến trang 150), người ta cần dùng tất cả bao nhiêu lượt chữ số?',
        options: ['324 chữ số', '336 chữ số', '342 chữ số', '350 chữ số'],
        correctIndex: 2,
        hint: 'Chia các trang sách thành 3 nhóm: nhóm 1 chữ số (từ 1 đến 9), nhóm 2 chữ số (từ 10 đến 99) và nhóm 3 chữ số (từ 100 đến 150).',
        solution: 'Tổng số lượt chữ số cần dùng là: 9 + 180 + 153 = 342 chữ số.',
        steps: [
          'Từ trang 1 đến trang 9 có 9 trang có 1 chữ số, cần: 9 × 1 = 9 (chữ số).',
          'Từ trang 10 đến trang 99 có: (99 - 10) : 1 + 1 = 90 (trang) có 2 chữ số, cần: 90 × 2 = 180 (chữ số).',
          'Từ trang 100 đến trang 150 có: (150 - 100) : 1 + 1 = 51 (trang) có 3 chữ số, cần: 51 × 3 = 153 (chữ số).',
          'Tổng số lượt chữ số cần dùng là: 9 + 180 + 153 = 342 (chữ số).'
        ],
        svgType: 'seq_pages',
        svgData: { val1: '3 chữ số: 100 → 150', val2: 'Tổng trang: 150', val3: 'Tổng số chữ số: ?' }
      },
      {
        id: 54,
        title: 'Dãy số có khoảng cách tăng dần đều',
        question: 'Tìm số hạng tiếp theo của dãy số sau: 1, 2, 4, 7, 11, 16, 22, ...',
        options: ['28', '29', '30', '31'],
        correctIndex: 1,
        hint: 'Tính hiệu giữa hai số đứng liền kề nhau để nhận ra quy luật tăng dần của khoảng cách.',
        solution: 'Khoảng cách giữa các số tăng dần thêm 1 đơn vị nên số tiếp theo là 22 + 7 = 29.',
        steps: [
          'Xét khoảng cách giữa hai số hạng liên tiếp: 2 - 1 = 1; 4 - 2 = 2; 7 - 4 = 3; 11 - 7 = 4; 16 - 11 = 5; 22 - 16 = 6.',
          'Quy luật của dãy là khoảng cách giữa hai số liên tiếp tăng dần thêm 1 đơn vị.',
          'Khoảng cách tiếp theo cần cộng thêm là 7. Vậy số hạng tiếp theo là: 22 + 7 = 29.'
        ],
        svgType: 'sequence_pattern',
        svgData: { val1: '1, 2, 4, 7, 11, 16, 22, ...', val2: 'Số hạng tiếp theo: ?', val3: '+1, +2, +3...' }
      },
      {
        id: 55,
        title: 'Tổng dãy phân số có mẫu là tích hai số liên tiếp',
        question: 'Tính giá trị của tổng dãy phân số sau: 1/(1 × 2) + 1/(2 × 3) + 1/(3 × 4) + ... + 1/(99 × 100).',
        options: ['98/100', '99/100', '100/101', '1/100'],
        correctIndex: 1,
        hint: 'Tách mỗi phân số thành hiệu của hai phân số đơn giản, ví dụ: 1/(1 × 2) = 1 - 1/2; 1/(2 × 3) = 1/2 - 1/3.',
        solution: 'Sau khi tách và triệt tiêu các phân số giống nhau ở giữa, kết quả còn lại là 1 - 1/100 = 99/100.',
        steps: [
          'Nhận xét quy luật tách phân số: 1/(1 × 2) = 1 - 1/2; 1/(2 × 3) = 1/2 - 1/3; ...; 1/(99 × 100) = 1/99 - 1/100.',
          'Thay vào tổng ban đầu ta có: (1 - 1/2) + (1/2 - 1/3) + (1/3 - 1/4) + ... + (1/99 - 1/100).',
          'Các phân số trung gian -1/2 và +1/2, -1/3 và +1/3, ... lần lượt triệt tiêu cho nhau.',
          'Giá trị còn lại của biểu thức là: 1 - 1/100 = 99/100.'
        ],
        svgType: 'seq_fraction_tel',
        svgData: { val1: '1/(1×2) + 1/(2×3) + ... + 1/(99×100)', val2: 'Giá trị của tổng: ?' }
      },
      {
        id: 56,
        title: 'Tổng dãy phân số mẫu cách nhau hai đơn vị',
        question: 'Tính giá trị của biểu thức sau: 2/(1 × 3) + 2/(3 × 5) + 2/(5 × 7) + ... + 2/(23 × 25).',
        options: ['23/25', '24/25', '25/26', '12/25'],
        correctIndex: 1,
        hint: 'Vì hai thừa số ở mẫu hơn kém nhau đúng bằng tử số là 2, ta tách được 2/(1 × 3) = 1 - 1/3; 2/(3 × 5) = 1/3 - 1/5.',
        solution: 'Tách từng phân số thành hiệu và khử liên tiếp, còn lại 1 - 1/25 = 24/25.',
        steps: [
          'Ta có: 2/(1 × 3) = 1 - 1/3; 2/(3 × 5) = 1/3 - 1/5; 2/(5 × 7) = 1/5 - 1/7; ...; 2/(23 × 25) = 1/23 - 1/25.',
          'Cộng tất cả các hiệu lại và triệt tiêu các phân số đối nhau ở phần giữa.',
          'Giá trị cuối cùng của biểu thức là: 1 - 1/25 = 24/25.'
        ],
        svgType: 'seq_fraction_tel',
        svgData: { val1: '2/(1×3) + 2/(3×5) + ... + 2/(23×25)', val2: 'Kết quả rút gọn: ?' }
      },
      {
        id: 57,
        title: 'Bài toán ngược tìm số trang sách từ số chữ số',
        question: 'Để đánh số trang của một cuốn sách (bắt đầu từ trang 1), người ta phải dùng tất cả 642 lượt chữ số. Hỏi cuốn sách đó dày bao nhiêu trang?',
        options: ['214 trang', '240 trang', '250 trang', '251 trang'],
        correctIndex: 2,
        hint: 'Tính số chữ số dùng cho 99 trang đầu tiên (189 chữ số), lấy 642 trừ đi để tìm số chữ số dành cho các trang có 3 chữ số.',
        solution: 'Có 151 trang có 3 chữ số nên cuốn sách dày 99 + 151 = 250 trang.',
        steps: [
          'Từ trang 1 đến trang 9 dùng: 9 × 1 = 9 (chữ số).',
          'Từ trang 10 đến trang 99 có 90 trang dùng: 90 × 2 = 180 (chữ số).',
          'Tổng số chữ số dùng cho 99 trang đầu là: 9 + 180 = 189 (chữ số).',
          'Số chữ số còn lại để đánh các trang có 3 chữ số là: 642 - 189 = 453 (chữ số).',
          'Số trang có 3 chữ số là: 453 : 3 = 151 (trang). Cuốn sách dày tất cả: 99 + 151 = 250 (trang).'
        ],
        svgType: 'seq_pages_inv',
        svgData: { val1: 'Tổng cộng: 642 chữ số', val2: '3 chữ số: 453 chữ số', val3: 'Cuốn sách dày: ? trang' }
      },
      {
        id: 58,
        title: 'Tính tổng dãy số cách đều khi biết số đầu và số cuối',
        question: 'Tính tổng của dãy số cách đều sau: 7 + 13 + 19 + 25 + ... + 301.',
        options: ['7.500', '7.700', '7.850', '8.100'],
        correctIndex: 1,
        hint: 'Bước 1 tìm số lượng các số hạng theo công thức (Số cuối - Số đầu) : Khoảng cách + 1. Bước 2 tính tổng dãy số.',
        solution: 'Dãy có 50 số hạng và tổng bằng (7 + 301) × 50 : 2 = 7.700.',
        steps: [
          'Khoảng cách giữa hai số hạng liên tiếp là: 13 - 7 = 6 (đơn vị).',
          'Số lượng số hạng của dãy số là: (301 - 7) : 6 + 1 = 294 : 6 + 1 = 50 (số hạng).',
          'Tổng của dãy số trên là: (7 + 301) × 50 : 2 = 308 × 25 = 7.700.'
        ],
        svgType: 'seq_sum',
        svgData: { val1: '7 + 13 + 19 + ... + 301', val2: 'Khoảng cách: 6 đơn vị', val3: 'Tổng dãy số: ?' }
      },
      {
        id: 59,
        title: 'Quy luật dãy chữ cái lặp lại theo chu kỳ',
        question: 'Một bạn học sinh viết liên tiếp nhóm chữ cái TOANHOC thành một dãy dài: TOANHOCTOANHOCTOANHOC... Hỏi chữ cái thứ 2.025 trong dãy là chữ cái nào?',
        options: ['Chữ T', 'Chữ O', 'Chữ A', 'Chữ N'],
        correctIndex: 1,
        hint: 'Mỗi nhóm TOANHOC gồm 7 chữ cái lặp lại tuần hoàn. Chia 2.025 cho 7 để tìm số dư và xác định vị trí chữ cái trong nhóm.',
        solution: 'Phép chia 2.025 cho 7 được thương 289 và dư 2, nên chữ cái thứ 2.025 là chữ cái thứ 2 trong nhóm (chữ O).',
        steps: [
          'Nhóm chữ TOANHOC lặp lại gồm đúng 7 chữ cái theo thứ tự: T (1), O (2), A (3), N (4), H (5), O (6), C (7).',
          'Thực hiện phép chia: 2.025 : 7 = 289 (dư 2).',
          'Như vậy viết được trọn vẹn 289 nhóm và thêm 2 chữ cái của nhóm tiếp theo.',
          'Chữ cái thứ 2 trong nhóm TOANHOC là chữ O.'
        ],
        svgType: 'seq_periodic',
        svgData: { val1: 'Chu kỳ lặp lại gồm 7 chữ cái', val2: 'Chữ cái thứ 2.025 là chữ nào?' }
      },
      {
        id: 60,
        title: 'Quy luật dãy số bình phương cộng thêm một',
        question: 'Cho dãy số viết theo quy luật: 2, 5, 10, 17, 26, 37, ... Hỏi số hạng thứ 20 của dãy số trên là bao nhiêu?',
        options: ['362', '399', '401', '442'],
        correctIndex: 2,
        hint: 'Quan sát mối liên hệ giữa mỗi số hạng với vị trí thứ tự của nó: 2 = 1 × 1 + 1; 5 = 2 × 2 + 1; 10 = 3 × 3 + 1.',
        solution: 'Số hạng thứ 20 bằng 20 × 20 + 1 = 401.',
        steps: [
          'Nhận xét quy luật từng số hạng theo số thứ tự: Số thứ 1 là 1 × 1 + 1 = 2; Số thứ 2 là 2 × 2 + 1 = 5; Số thứ 3 là 3 × 3 + 1 = 10; Số thứ 4 là 4 × 4 + 1 = 17.',
          'Quy luật tổng quát: Số hạng ở vị trí thứ n bằng tích n × n rồi cộng thêm 1.',
          'Vậy số hạng ở vị trí thứ 20 của dãy số là: 20 × 20 + 1 = 401.'
        ],
        svgType: 'sequence_pattern',
        svgData: { val1: '2, 5, 10, 17, 26, 37, ...', val2: 'Số hạng thứ 20: ?', val3: 'n × n + 1' }
      }
    ]
  },

  // ==================== ĐỀ 07: TOÁN TỔNG - (HIỆU) - TỈ (10 CÂU) ====================
  {
    id: 'set-7',
    title: 'Đề 7: Tuyệt kỹ Toán Tổng – (Hiệu) – Tỉ',
    badge: 'Tổng - Hiệu - Tỉ',
    description: 'Chuyên đề chuyển dịch phần, bài toán tuổi tác qua các năm và bài toán tỉ số có hai đại lượng cùng thay đổi.',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    questions: [
      {
        id: 61,
        title: 'Chuyển dịch giữa hai ngăn sách (Tổng không đổi)',
        question: 'Hai ngăn sách có tổng cộng 180 cuốn sách. Nếu chuyển 15 cuốn sách từ ngăn thứ nhất sang ngăn thứ hai thì số sách ngăn thứ nhất bằng 4/5 số sách ngăn thứ hai. Hỏi ban đầu ngăn thứ nhất có bao nhiêu cuốn sách?',
        options: ['85 cuốn', '90 cuốn', '95 cuốn', '100 cuốn'],
        correctIndex: 2,
        hint: 'Khi chuyển sách từ ngăn này sang ngăn kia thì tổng số sách của cả hai ngăn vẫn không đổi là 180 cuốn.',
        solution: 'Số sách ngăn thứ nhất lúc sau là 80 cuốn, cộng lại 15 cuốn đã chuyển đi được ban đầu là 95 cuốn.',
        steps: [
          'Khi chuyển sách giữa hai ngăn thì tổng số sách không thay đổi, vẫn là 180 cuốn.',
          'Tổng số phần bằng nhau lúc sau là: 4 + 5 = 9 (phần).',
          'Số sách của ngăn thứ nhất lúc sau là: 180 : 9 × 4 = 80 (cuốn).',
          'Số sách của ngăn thứ nhất ban đầu là: 80 + 15 = 95 (cuốn).'
        ],
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Tổng hai ngăn: 180 cuốn', val2: 'Tỉ số sau khi chuyển: 4/5', val3: 'Ngăn 1:', val4: 'Ngăn 2:' }
      },
      {
        id: 62,
        title: 'Bài toán tuổi tác qua các năm (Tương lai)',
        question: 'Hiện nay mẹ 36 tuổi và con 8 tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi mẹ gấp 3 lần tuổi con?',
        options: ['4 năm', '5 năm', '6 năm', '8 năm'],
        correctIndex: 2,
        hint: 'Hiệu số tuổi của hai mẹ con không thay đổi theo thời gian. Áp dụng bài toán Hiệu - Tỉ tại thời điểm tuổi mẹ gấp 3 lần tuổi con.',
        solution: 'Hiệu số tuổi là 28 tuổi, nên khi tuổi mẹ gấp 3 lần tuổi con thì con 14 tuổi, tức là sau 6 năm nữa.',
        steps: [
          'Hiệu số tuổi giữa mẹ và con không đổi theo thời gian và bằng: 36 - 8 = 28 (tuổi).',
          'Khi tuổi mẹ gấp 3 lần tuổi con, coi tuổi con là 1 phần thì tuổi mẹ là 3 phần.',
          'Hiệu số phần bằng nhau là: 3 - 1 = 2 (phần).',
          'Tuổi con khi đó là: 28 : 2 × 1 = 14 (tuổi). Số năm nữa là: 14 - 8 = 6 (năm).'
        ],
        svgType: 'ratio_age',
        svgData: { val1: 'Hiệu số tuổi không đổi: 28 tuổi', val2: 'Khi tỉ số tuổi là 3 : 1', val3: 'Tuổi con:', val4: 'Tuổi mẹ:' }
      },
      {
        id: 63,
        title: 'Cùng bớt ở cả hai số (Hiệu không đổi)',
        question: 'Tìm hai số có tỉ số ban đầu bằng 3/5. Nếu cùng bớt ở cả hai số đi 10 đơn vị thì được hai số mới có tỉ số bằng 1/2. Hỏi số lớn ban đầu là bao nhiêu?',
        options: ['40', '50', '60', '75'],
        correctIndex: 1,
        hint: 'Khi cùng bớt ở cả hai số đi 10 đơn vị thì hiệu hai số vẫn không thay đổi. Hãy so sánh số bé hoặc số lớn với hiệu hai số ở cả hai thời điểm.',
        solution: 'Hiệu hai số không đổi bằng 20, suy ra số lớn ban đầu bằng 50.',
        steps: [
          'Khi cùng bớt ở cả hai số đi 10 đơn vị thì hiệu giữa hai số không thay đổi.',
          'Ban đầu: tỉ số là 3/5 nên hiệu ứng với 5 - 3 = 2 (phần), tức số lớn bằng 5/2 hiệu hai số.',
          'Lúc sau: tỉ số là 1/2 nên hiệu ứng với 2 - 1 = 1 (phần), tức số lớn lúc sau bằng 2/1 hiệu hai số (hay 4/2 hiệu).',
          'Phân số chỉ 10 đơn vị bị bớt ở số lớn là: 5/2 - 4/2 = 1/2 (hiệu hai số).',
          'Hiệu hai số là: 10 : 1 × 2 = 20. Số lớn ban đầu là: 20 × 5 : 2 = 50.'
        ],
        svgType: 'ratio_both_change',
        svgData: { val1: 'Ban đầu 3/5 → Bớt 10 → Lúc sau 1/2', val2: 'Hiệu hai số không đổi', val3: 'Số bé:', val4: 'Số lớn:' }
      },
      {
        id: 64,
        title: 'Cùng thêm vào cả hai kho thóc (Hiệu không đổi)',
        question: 'Hai kho thóc có tỉ số số thóc giữa kho thứ nhất và kho thứ hai là 4/5. Nếu nhập thêm vào mỗi kho 120 tấn thóc nữa thì tỉ số số thóc của kho thứ nhất và kho thứ hai là 6/7. Tính tổng số tấn thóc ban đầu của cả hai kho.',
        options: ['450 tấn', '480 tấn', '540 tấn', '600 tấn'],
        correctIndex: 2,
        hint: 'Vì cùng thêm vào mỗi kho một lượng bằng nhau là 120 tấn nên hiệu số thóc của hai kho không thay đổi.',
        solution: 'Hiệu số thóc hai kho là 60 tấn, suy ra kho thứ nhất có 240 tấn, kho thứ hai có 300 tấn, tổng là 540 tấn.',
        steps: [
          'Khi cùng nhập thêm vào mỗi kho 120 tấn thì hiệu số thóc giữa kho thứ hai và kho thứ nhất không đổi.',
          'Ban đầu, tỉ số là 4/5 nên hiệu số thóc là 5 - 4 = 1 (phần), tức số thóc kho thứ nhất bằng 4 lần hiệu.',
          'Lúc sau, tỉ số là 6/7 nên hiệu số thóc là 7 - 6 = 1 (phần), tức số thóc kho thứ nhất bằng 6 lần hiệu.',
          'Số thóc kho thứ nhất tăng thêm là 6 - 4 = 2 lần hiệu, ứng với 120 tấn. Vậy hiệu số thóc hai kho là: 120 : 2 = 60 (tấn).',
          'Kho thứ nhất ban đầu có: 60 × 4 = 240 (tấn). Kho thứ hai ban đầu có: 60 × 5 = 300 (tấn). Tổng ban đầu là: 240 + 300 = 540 (tấn).'
        ],
        svgType: 'ratio_both_change',
        svgData: { val1: 'Ban đầu 4/5 → Thêm 120 tấn → 6/7', val2: 'Tổng số thóc ban đầu: ?', val3: 'Kho 1:', val4: 'Kho 2:' }
      },
      {
        id: 65,
        title: 'Bài toán tuổi tác trong quá khứ',
        question: 'Hiện nay tổng số tuổi của hai bố con là 50 tuổi. Biết rằng 4 năm trước đây, tuổi bố gấp 5 lần tuổi con. Hỏi hiện nay bố bao nhiêu tuổi?',
        options: ['35 tuổi', '38 tuổi', '39 tuổi', '41 tuổi'],
        correctIndex: 2,
        hint: 'Tìm tổng số tuổi của hai bố con ở thời điểm 4 năm trước (mỗi người đều giảm đi 4 tuổi), rồi giải bài toán Tổng - Tỉ.',
        solution: 'Tổng số tuổi 4 năm trước là 42 tuổi, khi đó bố 35 tuổi, nên hiện nay bố 39 tuổi.',
        steps: [
          'Mỗi năm mỗi người tăng 1 tuổi nên tổng số tuổi của hai bố con ở 4 năm trước là: 50 - 4 × 2 = 42 (tuổi).',
          'Tổng số phần bằng nhau cách đây 4 năm là: 5 + 1 = 6 (phần).',
          'Tuổi con cách đây 4 năm là: 42 : 6 = 7 (tuổi).',
          'Tuổi bố cách đây 4 năm là: 7 × 5 = 35 (tuổi). Tuổi bố hiện nay là: 35 + 4 = 39 (tuổi).'
        ],
        svgType: 'ratio_age',
        svgData: { val1: 'Tổng tuổi 4 năm trước: 42 tuổi', val2: 'Tuổi bố hiện nay: ?', val3: 'Con (4 năm trước):', val4: 'Bố (4 năm trước):' }
      },
      {
        id: 66,
        title: 'Chuyển dịch và xuất thêm ở hai kho gạo',
        question: 'Hai kho chứa tổng cộng 1.500 tấn gạo. Sau khi chuyển 120 tấn gạo từ kho A sang kho B và xuất đi 100 tấn gạo từ kho B thì số gạo ở kho A bằng 3/4 số gạo ở kho B. Hỏi ban đầu kho A chứa bao nhiêu tấn gạo?',
        options: ['600 tấn', '680 tấn', '720 tấn', '780 tấn'],
        correctIndex: 2,
        hint: 'Việc chuyển từ A sang B không làm thay đổi tổng, nhưng việc xuất đi 100 tấn từ kho B làm tổng số gạo lúc sau giảm đi 100 tấn.',
        solution: 'Tổng số gạo lúc sau là 1.400 tấn, kho A lúc sau còn 600 tấn, suy ra ban đầu kho A có 720 tấn.',
        steps: [
          'Sau khi chuyển 120 tấn từ kho A sang kho B và xuất đi 100 tấn ở kho B, tổng số gạo còn lại ở cả hai kho là: 1.500 - 100 = 1.400 (tấn).',
          'Tổng số phần bằng nhau lúc sau là: 3 + 4 = 7 (phần).',
          'Số gạo ở kho A lúc sau là: 1.400 : 7 × 3 = 600 (tấn).',
          'Số gạo ở kho A ban đầu là: 600 + 120 = 720 (tấn).'
        ],
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Tổng lúc sau: 1.400 tấn (tỉ số 3/4)', val2: 'Kho A ban đầu: ?', val3: 'Kho A:', val4: 'Kho B:' }
      },
      {
        id: 67,
        title: 'Thay đổi một đại lượng khi giữ nguyên đại lượng kia',
        question: 'Một thư viện có số sách khoa học bằng 2/3 số sách văn học. Sau khi nhập thêm 120 cuốn sách khoa học và giữ nguyên số sách văn học thì số sách khoa học bằng 4/5 số sách văn học. Hỏi lúc đầu thư viện có tất cả bao nhiêu cuốn sách của cả hai loại?',
        options: ['1.200 cuốn', '1.400 cuốn', '1.500 cuốn', '1.620 cuốn'],
        correctIndex: 2,
        hint: 'Vì số sách văn học không đổi, hãy quy đổi 120 cuốn sách khoa học nhập thêm thành phân số của số sách văn học.',
        solution: 'Tìm được số sách văn học là 900 cuốn, sách khoa học ban đầu là 600 cuốn, tổng là 1.500 cuốn.',
        steps: [
          'Số sách văn học không thay đổi. Phân số chỉ 120 cuốn sách khoa học nhập thêm so với số sách văn học là: 4/5 - 2/3 = 12/15 - 10/15 = 2/15 (số sách văn học).',
          'Số sách văn học của thư viện là: 120 : 2 × 15 = 900 (cuốn).',
          'Số sách khoa học lúc đầu là: 900 × 2 : 3 = 600 (cuốn).',
          'Tổng số sách cả hai loại lúc đầu là: 900 + 600 = 1.500 (cuốn).'
        ],
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Văn học không đổi, khoa học tăng 120 cuốn', val2: 'Tổng số sách ban đầu: ?', val3: 'Khoa học:', val4: 'Văn học:' }
      },
      {
        id: 68,
        title: 'Tỉ số liên hoàn giữa ba đội công nhân',
        question: 'Ba đội công nhân sửa được tất cả 480 m đường. Biết rằng 2/3 số mét đường đội thứ nhất sửa được bằng 1/2 số mét đường đội thứ hai sửa được và bằng 2/5 số mét đường đội thứ ba sửa được. Hỏi đội thứ hai sửa được bao nhiêu mét đường?',
        options: ['120 m', '150 m', '160 m', '200 m'],
        correctIndex: 2,
        hint: 'Quy đồng tử số các phân số 2/3, 1/2 và 2/5 để biết mỗi đội chiếm bao nhiêu phần bằng nhau.',
        solution: 'Quy đồng tử số được 2/3 = 2/4 = 2/5 nên ba đội ứng với 3, 4 và 5 phần; đội thứ hai sửa được 160 m.',
        steps: [
          'Quy đồng tử số các phân số: 1/2 = 2/4.',
          'Theo đề bài, 2/3 số mét đường đội 1 bằng 2/4 số mét đường đội 2 và bằng 2/5 số mét đường đội 3.',
          'Do đó số mét đường của đội 1, đội 2 và đội 3 lần lượt tương ứng với 3 phần, 4 phần và 5 phần bằng nhau.',
          'Tổng số phần bằng nhau là: 3 + 4 + 5 = 12 (phần).',
          'Số mét đường đội thứ hai sửa được là: 480 : 12 × 4 = 160 (m).'
        ],
        svgType: 'ratio_three',
        svgData: { val1: 'Tổng ba đội sửa được: 480 m', val2: 'Đội 2 sửa được: ? m' }
      },
      {
        id: 69,
        title: 'Bài toán Tổng - Tỉ với số thập phân',
        question: 'Tìm hai số thập phân có tổng bằng 148,5. Biết rằng nếu chuyển dấu phẩy của số bé sang bên phải một chữ số thì ta được số lớn. Số lớn là bao nhiêu?',
        options: ['13,5', '125', '135', '145'],
        correctIndex: 2,
        hint: 'Khi chuyển dấu phẩy của một số thập phân sang bên phải một chữ số thì số đó tăng lên gấp 10 lần.',
        solution: 'Số lớn gấp 10 lần số bé nên số bé là 13,5 và số lớn là 135.',
        steps: [
          'Chuyển dấu phẩy của số bé sang phải một chữ số thì được số lớn, nghĩa là số lớn gấp 10 lần số bé.',
          'Tổng số phần bằng nhau là: 10 + 1 = 11 (phần).',
          'Số bé là: 148,5 : 11 = 13,5.',
          'Số lớn là: 13,5 × 10 = 135.'
        ],
        svgType: 'sum_diff_ratio',
        svgData: { val1: 'Tổng hai số thập phân: 148,5', val2: 'Số lớn gấp 10 lần số bé', val3: 'Số bé:', val4: 'Số lớn:' }
      },
      {
        id: 70,
        title: 'Phân số còn lại bằng nhau của hai tấm vải',
        question: 'Hai tấm vải dài tổng cộng 132 m. Sau khi bán đi 1/3 tấm vải thứ nhất và 1/5 tấm vải thứ hai thì số mét vải còn lại của hai tấm bằng nhau. Hỏi ban đầu tấm vải thứ nhất dài bao nhiêu mét?',
        options: ['60 m', '66 m', '72 m', '84 m'],
        correctIndex: 2,
        hint: 'Tìm phân số chỉ phần vải còn lại của mỗi tấm rồi quy đồng tử số để xác định tỉ số độ dài ban đầu giữa hai tấm vải.',
        solution: 'Tỉ số ban đầu giữa tấm thứ nhất và tấm thứ hai là 6/5, suy ra tấm thứ nhất dài 72 m.',
        steps: [
          'Số vải còn lại của tấm thứ nhất bằng: 1 - 1/3 = 2/3 (tấm thứ nhất).',
          'Số vải còn lại của tấm thứ hai bằng: 1 - 1/5 = 4/5 (tấm thứ hai).',
          'Vì 2/3 tấm thứ nhất bằng 4/5 tấm thứ hai, quy đồng tử số ta được: 4/6 tấm thứ nhất bằng 4/5 tấm thứ hai.',
          'Như vậy tấm thứ nhất gồm 6 phần và tấm thứ hai gồm 5 phần bằng nhau. Tổng số phần là: 6 + 5 = 11 (phần).',
          'Chiều dài ban đầu của tấm vải thứ nhất là: 132 : 11 × 6 = 72 (m).'
        ],
        svgType: 'ratio_fraction_cloth',
        svgData: { val1: 'Tổng hai tấm vải: 132 m', val2: 'Tấm thứ nhất ban đầu: ? m' }
      }
    ]
  },

  // ==================== ĐỀ 08: TỈ SỐ PHẦN TRĂM & THỰC TẾ (10 CÂU) ====================
  {
    id: 'set-8',
    title: 'Đề 8: Chinh phục Tỉ số Phần trăm & Thực tế',
    badge: 'Tỉ số phần trăm',
    description: 'Thử thách bài toán giá vốn – giá bán – lãi/lỗ, pha trộn dung dịch muối/nước đường, hạt tươi – hạt khô và chiết khấu thương mại.',
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600',
    questions: [
      {
        id: 71,
        title: 'Hạ giá bìa nhưng vẫn thu lãi',
        question: 'Một hiệu sách hạ giá 20% so với giá ghi trên bìa sách nhưng vẫn còn lãi 12% so với giá vốn mua vào. Hỏi nếu bán đúng theo giá bìa thì hiệu sách lãi bao nhiêu phần trăm so với giá vốn?',
        options: ['32%', '36%', '40%', '44%'],
        correctIndex: 2,
        hint: 'Coi giá vốn là 100%, giá bán sau khi hạ giá vừa bằng 112% giá vốn vừa bằng 80% giá bìa.',
        solution: 'Giá bìa bằng 140% giá vốn nên nếu bán đúng giá bìa sẽ lãi 40%.',
        steps: [
          'Coi giá vốn là 100%. Giá bán khi đã hạ giá là: 100% + 12% = 112% (giá vốn).',
          'Mặt khác, vì đã hạ giá 20% so với giá bìa nên giá bán này ứng với: 100% - 20% = 80% (giá bìa).',
          'Giá bìa so với giá vốn chiếm tỉ lệ là: 112% : 80% = 1,4 = 140% (giá vốn).',
          'Nếu bán đúng theo giá bìa thì hiệu sách lãi: 140% - 100% = 40% (giá vốn).'
        ],
        svgType: 'percentage_app',
        svgData: { val1: 'Hạ 20% giá bìa vẫn lãi 12% giá vốn', val2: 'Bán đúng giá bìa lãi bao nhiêu?' }
      },
      {
        id: 72,
        title: 'Pha thêm nước tinh khiết vào dung dịch muối',
        question: 'Trong 200 gam dung dịch nước muối có nồng độ 5% muối. Hỏi cần đổ thêm vào bình bao nhiêu gam nước tinh khiết để được dung dịch mới có nồng độ 2% muối?',
        options: ['150 gam', '250 gam', '300 gam', '350 gam'],
        correctIndex: 2,
        hint: 'Khi đổ thêm nước tinh khiết, lượng muối nguyên chất trong bình không hề thay đổi.',
        solution: 'Lượng muối là 10 gam ứng với 2% dung dịch mới (500 gam), nên cần đổ thêm 300 gam nước.',
        steps: [
          'Khối lượng muối nguyên chất có trong bình là: 200 × 5 : 100 = 10 (gam).',
          'Khi đổ thêm nước tinh khiết, lượng muối vẫn là 10 gam và chiếm 2% khối lượng dung dịch mới.',
          'Khối lượng dung dịch nước muối mới là: 10 : 2 × 100 = 500 (gam).',
          'Khối lượng nước tinh khiết cần đổ thêm là: 500 - 200 = 300 (gam).'
        ],
        svgType: 'pct_solution',
        svgData: { val1: '200 gam (5% muối = 10 gam)', val2: 'Đổ thêm nước → 2% muối' }
      },
      {
        id: 73,
        title: 'Bài toán gửi tiết kiệm ngân hàng',
        question: 'Bác An gửi tiết kiệm 50.000.000 đồng vào ngân hàng với lãi suất 0,6% một tháng. Sau một tháng, bác An nhận được cả tiền gốc và tiền lãi là bao nhiêu?',
        options: ['50.300.000 đồng', '50.600.000 đồng', '53.000.000 đồng', '56.000.000 đồng'],
        correctIndex: 0,
        hint: 'Tính tiền lãi sau một tháng bằng cách lấy tiền gốc nhân với 0,6 chia cho 100, rồi cộng với tiền gốc.',
        solution: 'Tiền lãi sau 1 tháng là 300.000 đồng, tổng cả gốc và lãi là 50.300.000 đồng.',
        steps: [
          'Số tiền lãi bác An nhận được sau một tháng là: 50.000.000 × 0,6 : 100 = 300.000 (đồng).',
          'Tổng số tiền cả gốc và lãi sau một tháng là: 50.000.000 + 300.000 = 50.300.000 (đồng).'
        ],
        svgType: 'percentage_app',
        svgData: { val1: 'Tiền gửi: 50.000.000 đồng (lãi 0,6%)', val2: 'Cả gốc và lãi sau 1 tháng: ?' }
      },
      {
        id: 74,
        title: 'Làm bay hơi nước từ dung dịch nước đường',
        question: 'Một bình chứa 400 gam nước đường có nồng độ 15% đường. Cần đun cho bay hơi bao nhiêu gam nước để nhận được dung dịch nước đường có nồng độ 20% đường?',
        options: ['80 gam', '100 gam', '120 gam', '150 gam'],
        correctIndex: 1,
        hint: 'Khi đun cho nước bay hơi, lượng đường trong bình vẫn giữ nguyên không đổi.',
        solution: 'Lượng đường không đổi là 60 gam, dung dịch mới nặng 300 gam nên cần bay hơi 100 gam nước.',
        steps: [
          'Khối lượng đường nguyên chất có trong bình là: 400 × 15 : 100 = 60 (gam).',
          'Lượng đường 60 gam không đổi và chiếm 20% khối lượng dung dịch nước đường mới.',
          'Khối lượng dung dịch nước đường lúc sau là: 60 : 20 × 100 = 300 (gam).',
          'Khối lượng nước cần đun bay hơi là: 400 - 300 = 100 (gam).'
        ],
        svgType: 'pct_solution',
        svgData: { val1: '400 gam (15% đường = 60 gam)', val2: 'Bay hơi nước → 20% đường' }
      },
      {
        id: 75,
        title: 'Bài toán phơi hạt tươi thành hạt khô',
        question: 'Có 450 kg hạt tươi chứa 20% nước. Người ta đem phơi khô để lượng hạt đó chỉ còn chứa 10% nước. Hỏi sau khi phơi khô thu được bao nhiêu ki-lô-gam hạt khô?',
        options: ['360 kg', '380 kg', '400 kg', '410 kg'],
        correctIndex: 2,
        hint: 'Khi phơi khô, chỉ có nước bay hơi đi còn lượng hạt khô nguyên chất không hề thay đổi.',
        solution: 'Lượng hạt nguyên chất là 360 kg chiếm 90% hạt khô, nên thu được 400 kg hạt khô.',
        steps: [
          'Tỉ lệ phần hạt nguyên chất trong hạt tươi là: 100% - 20% = 80%.',
          'Khối lượng hạt nguyên chất là: 450 × 80 : 100 = 360 (kg).',
          'Khi phơi khô còn 10% nước, tỉ lệ phần hạt nguyên chất trong hạt khô là: 100% - 10% = 90%.',
          'Khối lượng hạt khô thu được sau khi phơi là: 360 : 90 × 100 = 400 (kg).'
        ],
        svgType: 'pct_seed',
        svgData: { val1: '450 kg (20% nước)', val2: '? kg (10% nước)', val3: 'Khối lượng hạt khô thu được: ?' }
      },
      {
        id: 76,
        title: 'Chiết khấu thương mại giảm giá hai lần liên tiếp',
        question: 'Một chiếc xe đạp điện có giá niêm yết là 12.000.000 đồng. Nhân dịp khai giảng, cửa hàng giảm giá 10% cho tất cả khách hàng; riêng học sinh giỏi được giảm tiếp 5% trên giá đã giảm. Hỏi một bạn học sinh giỏi mua chiếc xe đó phải trả bao nhiêu tiền?',
        options: ['10.200.000 đồng', '10.260.000 đồng', '10.400.000 đồng', '10.800.000 đồng'],
        correctIndex: 1,
        hint: 'Tính giá tiền sau lần giảm thứ nhất (90% giá niêm yết), rồi lấy mức giá mới đó nhân tiếp với 95%.',
        solution: 'Giá sau lần giảm 1 là 10.800.000 đồng, giảm tiếp 5% còn phải trả 10.260.000 đồng.',
        steps: [
          'Giá xe sau lần giảm 10% thứ nhất chiếm 100% - 10% = 90% giá niêm yết.',
          'Giá xe sau lần giảm thứ nhất là: 12.000.000 × 90 : 100 = 10.800.000 (đồng).',
          'Được giảm tiếp 5% trên giá mới, số tiền phải trả chiếm 100% - 5% = 95% của 10.800.000 đồng.',
          'Số tiền bạn học sinh giỏi phải trả là: 10.800.000 × 95 : 100 = 10.260.000 (đồng).'
        ],
        svgType: 'pct_double_disc',
        svgData: { val1: 'Giá gốc: 12.000.000 đồng', val2: 'Giảm 10% rồi giảm tiếp 5% giá mới', val3: 'Số tiền phải trả: ?' }
      },
      {
        id: 77,
        title: 'So sánh tiền lãi và lỗ của hai sản phẩm cùng giá bán',
        question: 'Một cửa hàng bán hai chiếc đồng hồ với cùng một mức giá là 1.200.000 đồng mỗi chiếc. Chiếc thứ nhất bán lãi 20% so với giá vốn, chiếc thứ hai bán lỗ 20% so với giá vốn. Hỏi sau khi bán cả hai chiếc đồng hồ, cửa hàng lãi hay lỗ bao nhiêu tiền?',
        options: ['Hòa vốn', 'Lãi 100.000 đồng', 'Lỗ 100.000 đồng', 'Lỗ 120.000 đồng'],
        correctIndex: 2,
        hint: 'Tính riêng tiền vốn của từng chiếc đồng hồ (1.200.000 đồng ứng với 120% vốn chiếc thứ nhất và 80% vốn chiếc thứ hai), sau đó so sánh tổng tiền vốn với tổng tiền bán.',
        solution: 'Tổng tiền vốn là 2.500.000 đồng, tổng tiền bán là 2.400.000 đồng nên cửa hàng bị lỗ 100.000 đồng.',
        steps: [
          'Giá vốn chiếc đồng hồ thứ nhất là: 1.200.000 : (100% + 20%) × 100% = 1.000.000 (đồng).',
          'Giá vốn chiếc đồng hồ thứ hai là: 1.200.000 : (100% - 20%) × 100% = 1.500.000 (đồng).',
          'Tổng tiền vốn của cả hai chiếc đồng hồ là: 1.000.000 + 1.500.000 = 2.500.000 (đồng).',
          'Tổng tiền bán thu được là: 1.200.000 × 2 = 2.400.000 (đồng). Vì 2.400.000 < 2.500.000 nên cửa hàng bị lỗ: 2.500.000 - 2.400.000 = 100.000 (đồng).'
        ],
        svgType: 'pct_two_items',
        svgData: { val1: 'Bán mỗi chiếc 1.200.000 đồng', val2: 'Chiếc 1 lãi 20% vốn | Chiếc 2 lỗ 20% vốn', val3: 'Kết quả chung: Lãi hay Lỗ?' }
      },
      {
        id: 78,
        title: 'Hòa thêm muối tinh khiết vào dung dịch',
        question: 'Trong 180 gam nước biển có chứa 5% muối. Hỏi cần hòa tan thêm vào đó bao nhiêu gam muối tinh khiết để được dung dịch nước muối mới có nồng độ 10% muối?',
        options: ['9 gam', '10 gam', '12 gam', '15 gam'],
        correctIndex: 1,
        hint: 'Khi chỉ hòa tan thêm muối tinh khiết vào bình thì khối lượng nước nguyên chất trong dung dịch không hề thay đổi.',
        solution: 'Khối lượng nước không đổi là 171 gam ứng với 90% dung dịch mới (190 gam), nên cần thêm 10 gam muối.',
        steps: [
          'Khối lượng muối ban đầu là: 180 × 5 : 100 = 9 (gam).',
          'Khối lượng nước nguyên chất (không đổi) là: 180 - 9 = 171 (gam).',
          'Trong dung dịch mới có 10% muối thì tỉ lệ nước nguyên chất là: 100% - 10% = 90%.',
          'Khối lượng dung dịch mới là: 171 : 90 × 100 = 190 (gam). Khối lượng muối cần hòa thêm là: 190 - 180 = 10 (gam).'
        ],
        svgType: 'pct_solution',
        svgData: { val1: '180 gam (5% muối, 171 gam nước)', val2: 'Thêm muối tinh khiết → 10% muối' }
      },
      {
        id: 79,
        title: 'Giảm giá vé để tăng lượng khách và doanh thu',
        question: 'Giá vé vào cổng khu vui chơi ban đầu là 100.000 đồng. Sau khi giảm giá vé, số lượng khách vào chơi tăng thêm 25% và tổng doanh thu bán vé tăng thêm 5%. Hỏi giá vé sau khi giảm còn bao nhiêu tiền?',
        options: ['75.000 đồng', '80.000 đồng', '84.000 đồng', '85.000 đồng'],
        correctIndex: 2,
        hint: 'Doanh thu bằng số lượng khách nhân với giá vé. Coi số khách và doanh thu ban đầu là 100% để tìm tỉ số phần trăm của giá vé mới so với giá vé cũ.',
        solution: 'Giá vé mới bằng 105% : 125% = 84% giá vé cũ, tức là 84.000 đồng.',
        steps: [
          'Coi số lượng khách ban đầu là 100% và doanh thu ban đầu là 100%.',
          'Số lượng khách sau khi giảm giá vé là: 100% + 25% = 125% (tức 1,25 lần).',
          'Tổng doanh thu sau khi giảm giá vé là: 100% + 5% = 105% (tức 1,05 lần).',
          'Tỉ số giữa giá vé mới và giá vé cũ là: 1,05 : 1,25 = 0,84 = 84%. Giá vé mới là: 100.000 × 84 : 100 = 84.000 (đồng).'
        ],
        svgType: 'percentage_app',
        svgData: { val1: 'Vé cũ 100.000 đồng → Khách +25%', val2: 'Doanh thu +5% → Giá vé mới: ?' }
      },
      {
        id: 80,
        title: 'Tính phần trăm lãi theo vốn từ lãi theo giá bán',
        question: 'Một người bán hàng thu được tiền lãi bằng 20% giá bán của món hàng đó. Hỏi người đó đã lãi bao nhiêu phần trăm so với tiền vốn bỏ ra?',
        options: ['20%', '22,5%', '25%', '30%'],
        correctIndex: 2,
        hint: 'Coi giá bán là 100%, tiền lãi là 20% thì tiền vốn ứng với 80% giá bán. Lấy tiền lãi chia cho tiền vốn.',
        solution: 'Tiền vốn chiếm 80% giá bán, nên tỉ số phần trăm tiền lãi so với tiền vốn là 20% : 80% = 25%.',
        steps: [
          'Coi giá bán của món hàng là 100% thì tiền lãi chiếm 20%.',
          'Tiền vốn bỏ ra chiếm tỉ lệ là: 100% - 20% = 80% (giá bán).',
          'Tỉ số phần trăm của tiền lãi so với tiền vốn là: 20 : 80 = 0,25 = 25%.'
        ],
        svgType: 'percentage_app',
        svgData: { val1: 'Tiền lãi bằng 20% giá bán', val2: 'Tiền lãi bằng bao nhiêu phần trăm giá vốn?' }
      }
    ]
  },

  // ==================== ĐỀ 09: TOÁN CHUYỂN ĐỘNG ĐỀU (10 CÂU) ====================
  {
    id: 'set-9',
    title: 'Đề 9: Bứt phá Toán Chuyển động đều',
    badge: 'Chuyển động đều',
    description: 'Chinh phục bài toán hai xe đi ngược chiều/cùng chiều đuổi nhau, đoàn tàu chui qua cầu/hầm và ca nô xuôi dòng – ngược dòng.',
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
    questions: [
      {
        id: 81,
        title: 'Hai xe đi ngược chiều gặp nhau',
        question: 'Quãng đường AB dài 180 km. Lúc 7 giờ sáng, một ô tô đi từ A về B với vận tốc 50 km/giờ và một xe máy đi từ B về A với vận tốc 40 km/giờ. Hỏi hai xe gặp nhau lúc mấy giờ?',
        options: ['8 giờ 30 phút', '9 giờ 00 phút', '9 giờ 30 phút', '10 giờ 00 phút'],
        correctIndex: 1,
        hint: 'Sau mỗi giờ hai xe tiến lại gần nhau một quãng đường bằng tổng vận tốc của hai xe.',
        solution: 'Tổng vận tốc là 90 km/giờ, thời gian để gặp nhau là 2 giờ, nên hai xe gặp nhau lúc 9 giờ 00 phút.',
        steps: [
          'Tổng vận tốc của hai xe là: 50 + 40 = 90 (km/giờ).',
          'Thời gian hai xe đi để gặp nhau là: 180 : 90 = 2 (giờ).',
          'Hai xe gặp nhau lúc: 7 giờ + 2 giờ = 9 giờ 00 phút.'
        ],
        svgType: 'motion_physics',
        svgData: { val1: 'Quãng đường AB: 180 km', val2: 'Ô tô 50 km/giờ ↔ Xe máy 40 km/giờ' }
      },
      {
        id: 82,
        title: 'Xe máy đuổi theo xe đạp đi cùng chiều',
        question: 'Một người đi xe đạp từ A với vận tốc 12 km/giờ. Sau 2 giờ, một xe máy cũng xuất phát từ A đuổi theo xe đạp với vận tốc 36 km/giờ. Hỏi sau bao lâu kể từ lúc xe máy xuất phát thì đuổi kịp xe đạp?',
        options: ['45 phút', '1 giờ', '1 giờ 15 phút', '1 giờ 30 phút'],
        correctIndex: 1,
        hint: 'Tính quãng đường xe đạp đã đi trước trong 2 giờ, sau đó chia cho hiệu vận tốc của hai xe.',
        solution: 'Xe đạp đi trước 24 km, hiệu vận tốc là 24 km/giờ nên xe máy đuổi kịp sau 1 giờ.',
        steps: [
          'Quãng đường xe đạp đã đi trước trong 2 giờ là: 12 × 2 = 24 (km).',
          'Sau mỗi giờ, xe máy rút ngắn khoảng cách với xe đạp là: 36 - 12 = 24 (km/giờ).',
          'Thời gian để xe máy đuổi kịp xe đạp là: 24 : 24 = 1 (giờ).'
        ],
        svgType: 'motion_chase',
        svgData: { val1: 'Xe đạp đi trước 2 giờ (24 km)', val2: 'Xe máy 36 km/giờ đuổi theo 12 km/giờ' }
      },
      {
        id: 83,
        title: 'Đoàn tàu hỏa chạy qua hết cây cầu',
        question: 'Một đoàn tàu dài 150 m chạy qua một cây cầu dài 450 m với vận tốc 36 km/giờ. Hỏi kể từ lúc đầu tàu bước vào cầu cho đến khi toa cuối cùng qua khỏi cầu mất bao nhiêu giây?',
        options: ['45 giây', '50 giây', '60 giây', '75 giây'],
        correctIndex: 2,
        hint: 'Quãng đường đoàn tàu đi được để qua hoàn toàn cây cầu bằng tổng chiều dài của đoàn tàu và chiều dài của cây cầu.',
        solution: 'Đổi 36 km/giờ bằng 10 m/giây, tổng quãng đường là 600 m nên mất 60 giây.',
        steps: [
          'Đổi đơn vị vận tốc: 36 km/giờ = 36.000 m : 3.600 giây = 10 m/giây.',
          'Quãng đường đoàn tàu cần đi để qua hết cây cầu là: 150 + 450 = 600 (m).',
          'Thời gian đoàn tàu chạy qua hết cây cầu là: 600 : 10 = 60 (giây).'
        ],
        svgType: 'motion_train',
        svgData: { val1: 'Tàu dài 150 m + Cầu dài 450 m', val2: 'Vận tốc tàu: 36 km/giờ' }
      },
      {
        id: 84,
        title: 'Ca nô xuôi dòng và ngược dòng trên sông',
        question: 'Một ca nô đi xuôi dòng từ bến A đến bến B mất 2 giờ và đi ngược dòng từ bến B trở về bến A mất 3 giờ. Biết vận tốc của dòng nước là 3 km/giờ. Tính độ dài quãng đường sông từ bến A đến bến B.',
        options: ['30 km', '36 km', '42 km', '48 km'],
        correctIndex: 1,
        hint: 'Hiệu giữa vận tốc xuôi dòng và vận tốc ngược dòng luôn bằng 2 lần vận tốc dòng nước. Trên cùng một quãng đường, vận tốc và thời gian tỉ lệ nghịch với nhau.',
        solution: 'Vận tốc xuôi dòng là 18 km/giờ, nên quãng đường sông AB dài 36 km.',
        steps: [
          'Hiệu giữa vận tốc xuôi dòng và vận tốc ngược dòng là: 3 × 2 = 6 (km/giờ).',
          'Trên cùng quãng đường AB, tỉ số thời gian xuôi dòng và ngược dòng là 2/3 nên tỉ số vận tốc xuôi dòng và ngược dòng là 3/2.',
          'Vận tốc xuôi dòng của ca nô là: 6 : (3 - 2) × 3 = 18 (km/giờ).',
          'Độ dài quãng đường sông từ A đến B là: 18 × 2 = 36 (km).'
        ],
        svgType: 'motion_river',
        svgData: { val1: 'Xuôi dòng: 2 giờ | Ngược dòng: 3 giờ', val2: 'Vận tốc dòng nước: 3 km/giờ' }
      },
      {
        id: 85,
        title: 'Hai xe đi ngược chiều xuất phát lệch giờ nhau',
        question: 'Quãng đường AB dài 265 km. Lúc 6 giờ 30 phút, một ô tô tải đi từ A về B với vận tốc 45 km/giờ. Đến 7 giờ 30 phút, một xe khách đi từ B về A với vận tốc 65 km/giờ. Hỏi hai xe gặp nhau lúc mấy giờ?',
        options: ['8 giờ 30 phút', '9 giờ 00 phút', '9 giờ 30 phút', '10 giờ 00 phút'],
        correctIndex: 2,
        hint: 'Tính quãng đường ô tô tải đi một mình từ 6 giờ 30 phút đến 7 giờ 30 phút, sau đó tìm thời gian hai xe cùng đi nốt quãng đường còn lại.',
        solution: 'Lúc 7 giờ 30 phút hai xe còn cách nhau 220 km và đi tiếp 2 giờ nữa thì gặp nhau lúc 9 giờ 30 phút.',
        steps: [
          'Thời gian ô tô tải đi trước xe khách là: 7 giờ 30 phút - 6 giờ 30 phút = 1 (giờ).',
          'Quãng đường ô tô tải đã đi trước là: 45 × 1 = 45 (km).',
          'Quãng đường còn lại lúc 7 giờ 30 phút là: 265 - 45 = 220 (km).',
          'Tổng vận tốc hai xe là: 45 + 65 = 110 (km/giờ). Thời gian hai xe đi để gặp nhau là: 220 : 110 = 2 (giờ).',
          'Hai xe gặp nhau lúc: 7 giờ 30 phút + 2 giờ = 9 giờ 30 phút.'
        ],
        svgType: 'motion_physics',
        svgData: { val1: 'Quãng đường AB: 265 km', val2: 'Xe tải đi trước 1 giờ (45 km)' }
      },
      {
        id: 86,
        title: 'Đoàn tàu vượt qua cột điện và cây cầu',
        question: 'Một đoàn tàu hỏa chạy ngang qua một cột điện bên đường mất 12 giây. Cũng với vận tốc đó, đoàn tàu chạy qua hết một cây cầu dài 420 m mất 40 giây. Tính chiều dài của đoàn tàu hỏa đó.',
        options: ['150 m', '160 m', '180 m', '210 m'],
        correctIndex: 2,
        hint: 'Chạy ngang qua cột điện mất 12 giây chính là thời gian tàu đi hết chiều dài của bản thân nó. Thời gian chênh lệch còn lại chính là thời gian đi hết chiều dài cây cầu.',
        solution: 'Vận tốc đoàn tàu là 15 m/giây, suy ra chiều dài đoàn tàu là 180 m.',
        steps: [
          'Thời gian tàu chạy qua cột điện (đi quãng đường bằng chiều dài tàu) là 12 giây.',
          'Thời gian tàu đi hết phần chiều dài cây cầu dài 420 m là: 40 - 12 = 28 (giây).',
          'Vận tốc của đoàn tàu là: 420 : 28 = 15 (m/giây).',
          'Chiều dài của đoàn tàu hỏa là: 15 × 12 = 180 (m).'
        ],
        svgType: 'motion_train',
        svgData: { val1: 'Qua cột điện: 12 giây | Qua cầu 420 m: 40 giây', val2: 'Chiều dài đoàn tàu: ?' }
      },
      {
        id: 87,
        title: 'Hai xe xuất phát từ hai điểm đuổi kịp nhau',
        question: 'Lúc 8 giờ sáng, một xe máy đi từ điểm A với vận tốc 36 km/giờ. Cùng lúc đó, một ô tô xuất phát từ điểm B cách A một khoảng 48 km đuổi theo xe máy (cùng hướng từ B qua A) với vận tốc 52 km/giờ. Hỏi ô tô đuổi kịp xe máy lúc mấy giờ?',
        options: ['10 giờ', '10 giờ 30 phút', '11 giờ', '11 giờ 30 phút'],
        correctIndex: 2,
        hint: 'Lấy khoảng cách ban đầu 48 km chia cho hiệu vận tốc giữa ô tô và xe máy để tìm thời gian đuổi kịp.',
        solution: 'Hiệu vận tốc là 16 km/giờ nên ô tô đuổi kịp sau 3 giờ, tức là lúc 11 giờ.',
        steps: [
          'Sau mỗi giờ, ô tô đuổi gần xe máy thêm: 52 - 36 = 16 (km/giờ).',
          'Thời gian để ô tô đuổi kịp xe máy là: 48 : 16 = 3 (giờ).',
          'Ô tô đuổi kịp xe máy lúc: 8 giờ + 3 giờ = 11 giờ.'
        ],
        svgType: 'motion_chase',
        svgData: { val1: 'Khoảng cách ban đầu: 48 km', val2: 'Ô tô 52 km/giờ đuổi xe máy 36 km/giờ' }
      },
      {
        id: 88,
        title: 'Bài toán đến sớm – đến muộn với hai vận tốc',
        question: 'Một người đi xe máy từ nhà đến cơ quan. Nếu đi với vận tốc 30 km/giờ thì đến muộn 10 phút so với giờ quy định; nếu đi với vận tốc 40 km/giờ thì lại đến sớm 5 phút so với giờ quy định. Tính quãng đường từ nhà đến cơ quan.',
        options: ['24 km', '30 km', '36 km', '40 km'],
        correctIndex: 1,
        hint: 'Hiệu thời gian giữa hai cách đi là 10 + 5 = 15 phút (tức 1/4 giờ). Dùng tỉ số vận tốc và tỉ số thời gian để tìm thời gian đi với vận tốc 30 km/giờ.',
        solution: 'Thời gian đi với vận tốc 30 km/giờ là 1 giờ, nên quãng đường từ nhà đến cơ quan dài 30 km.',
        steps: [
          'Thời gian đi với vận tốc 30 km/giờ nhiều hơn đi với vận tốc 40 km/giờ là: 10 + 5 = 15 (phút) = 1/4 giờ.',
          'Trên cùng một quãng đường, tỉ số hai vận tốc là 30/40 = 3/4 nên tỉ số thời gian tương ứng là 4/3.',
          'Thời gian đi với vận tốc 30 km/giờ là: 1/4 : (4 - 3) × 4 = 1 (giờ).',
          'Quãng đường từ nhà đến cơ quan dài: 30 × 1 = 30 (km).'
        ],
        svgType: 'motion_two_speeds',
        svgData: { val1: 'Chênh lệch thời gian: 15 phút', val2: 'Quãng đường từ nhà đến cơ quan: ?', val3: '30 km/giờ (muộn 10 phút)', val4: '40 km/giờ (sớm 5 phút)' }
      },
      {
        id: 89,
        title: 'Hai ca nô đi ngược chiều gặp nhau trên sông',
        question: 'Hai bến sông A và B cách nhau 105 km. Một ca nô có vận tốc riêng 22 km/giờ đi xuôi dòng từ A đến B, cùng lúc đó một ca nô khác có vận tốc riêng 20 km/giờ đi ngược dòng từ B về A. Biết vận tốc dòng nước là 4 km/giờ. Hỏi nơi hai ca nô gặp nhau cách bến A bao nhiêu ki-lô-mét?',
        options: ['55 km', '60 km', '65 km', '70 km'],
        correctIndex: 2,
        hint: 'Tính vận tốc thực tế của ca nô xuôi dòng (cộng thêm dòng nước) và ca nô ngược dòng (trừ đi dòng nước), tìm thời gian gặp nhau rồi tính quãng đường ca nô từ A đi được.',
        solution: 'Hai ca nô gặp nhau sau 2,5 giờ và vị trí gặp cách bến A đúng 26 × 2,5 = 65 km.',
        steps: [
          'Vận tốc xuôi dòng của ca nô đi từ A là: 22 + 4 = 26 (km/giờ).',
          'Vận tốc ngược dòng của ca nô đi từ B là: 20 - 4 = 16 (km/giờ).',
          'Thời gian hai ca nô đi để gặp nhau là: 105 : (26 + 16) = 105 : 42 = 2,5 (giờ).',
          'Vị trí gặp nhau cách bến A là: 26 × 2,5 = 65 (km).'
        ],
        svgType: 'motion_river',
        svgData: { val1: 'Quãng đường sông AB: 105 km', val2: 'Nơi gặp nhau cách bến A: ?' }
      },
      {
        id: 90,
        title: 'Tính vận tốc trung bình cả lượt đi và về',
        question: 'Một người đi xe đạp từ A đến B với vận tốc 12 km/giờ, sau đó quay trở về từ B về A với vận tốc 20 km/giờ. Tính vận tốc trung bình của người đó trên cả quãng đường đi và về.',
        options: ['14 km/giờ', '15 km/giờ', '16 km/giờ', '16,5 km/giờ'],
        correctIndex: 1,
        hint: 'Vận tốc trung bình bằng tổng quãng đường cả đi lẫn về chia cho tổng thời gian cả đi lẫn về (chọn quãng đường AB là 60 km để tính thuận tiện).',
        solution: 'Giả sử quãng đường AB dài 60 km, tổng quãng đường 120 km chia tổng thời gian 8 giờ được vận tốc trung bình 15 km/giờ.',
        steps: [
          'Giả sử độ dài quãng đường AB là 60 km (chia hết cho cả 12 và 20).',
          'Thời gian người đó đi từ A đến B là: 60 : 12 = 5 (giờ). Thời gian đi về từ B về A là: 60 : 20 = 3 (giờ).',
          'Tổng quãng đường cả đi và về là: 60 + 60 = 120 (km). Tổng thời gian cả đi và về là: 5 + 3 = 8 (giờ).',
          'Vận tốc trung bình trên cả quãng đường đi và về là: 120 : 8 = 15 (km/giờ).'
        ],
        svgType: 'motion_two_speeds',
        svgData: { val1: 'Vận tốc trung bình cả đi và về: ?', val2: 'Tổng quãng đường : Tổng thời gian', val3: 'Lượt đi: 12 km/giờ', val4: 'Lượt về: 20 km/giờ' }
      }
    ]
  },

  // ==================== ĐỀ 10: TỈ LỆ BẢN ĐỒ & ĐỊA HÌNH THỰC TẾ (10 CÂU) ====================
  {
    id: 'set-10',
    title: 'Đề 10: Ứng dụng Tỉ lệ Bản đồ & Địa hình Thực tế',
    badge: 'Ứng dụng tỉ lệ bản đồ',
    description: 'Chuyên đề thực tế về tính khoảng cách, thời gian lộ trình và diện tích mảnh đất/công trình trên bản đồ quy hoạch.',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-600',
    questions: [
      {
        id: 91,
        title: 'Tính thời gian lộ trình theo bản đồ giao thông',
        question: 'Trên bản đồ giao thông tỉ lệ 1 : 500.000, khoảng cách từ Hà Nội đến Ninh Bình đo được là 18,6 cm. Một ô tô chạy trên tuyến đường này với vận tốc 62 km/giờ thì đi từ Hà Nội đến Ninh Bình mất bao nhiêu thời gian?',
        options: ['1 giờ 15 phút', '1 giờ 30 phút', '1 giờ 45 phút', '2 giờ'],
        correctIndex: 1,
        hint: 'Tính khoảng cách thực tế theo đơn vị xăng-ti-mét rồi đổi sang ki-lô-mét, sau đó chia cho vận tốc ô tô.',
        solution: 'Quãng đường thực tế là 93 km, thời gian ô tô di chuyển là 1,5 giờ hay 1 giờ 30 phút.',
        steps: [
          'Khoảng cách thực tế từ Hà Nội đến Ninh Bình là: 18,6 × 500.000 = 9.300.000 (cm) = 93 (km).',
          'Thời gian ô tô đi hết tuyến đường này là: 93 : 62 = 1,5 (giờ) = 1 giờ 30 phút.'
        ],
        svgType: 'map_scale_diagram',
        svgData: { val1: 'Trên bản đồ: 18,6 cm', val2: 'Vận tốc ô tô: 62 km/giờ', val3: 'Tỉ lệ 1 : 500.000' }
      },
      {
        id: 92,
        title: 'Diện tích thửa ruộng trên bản đồ địa chính',
        question: 'Một thửa ruộng hình chữ nhật có chu vi 280 m và chiều dài hơn chiều rộng 20 m. Trên bản đồ địa chính tỉ lệ 1 : 2.000, diện tích của thửa ruộng đó là bao nhiêu xăng-ti-mét vuông?',
        options: ['6 cm²', '8 cm²', '12 cm²', '16 cm²'],
        correctIndex: 2,
        hint: 'Tìm chiều dài và chiều rộng thực tế, đổi sang xăng-ti-mét rồi chia cho 2.000 để ra kích thước trên bản đồ trước khi tính diện tích.',
        solution: 'Kích thước trên bản đồ là dài 4 cm, rộng 3 cm nên diện tích là 12 cm².',
        steps: [
          'Nửa chu vi thực tế của thửa ruộng là: 280 : 2 = 140 (m).',
          'Chiều dài thực tế là: (140 + 20) : 2 = 80 (m) = 8.000 cm. Chiều rộng thực tế là: 80 - 20 = 60 (m) = 6.000 cm.',
          'Chiều dài trên bản đồ là: 8.000 : 2.000 = 4 (cm). Chiều rộng trên bản đồ là: 6.000 : 2.000 = 3 (cm).',
          'Diện tích thửa ruộng trên bản đồ là: 4 × 3 = 12 (cm²).'
        ],
        svgType: 'map_rect_area',
        svgData: { val1: 'Thực tế: dài 80 m, rộng 60 m', val2: 'Diện tích trên bản đồ: ? cm²', val3: 'Tỉ lệ 1 : 2.000' }
      },
      {
        id: 93,
        title: 'Chuyển đổi khoảng cách giữa hai bản đồ khác tỉ lệ',
        question: 'Trên bản đồ thứ nhất tỉ lệ 1 : 100.000, khoảng cách giữa hai huyện là 35 cm. Nếu vẽ lại khoảng cách giữa hai huyện đó trên một bản đồ thứ hai có tỉ lệ 1 : 250.000 thì đoạn thẳng đó dài bao nhiêu xăng-ti-mét?',
        options: ['12 cm', '14 cm', '15 cm', '17,5 cm'],
        correctIndex: 1,
        hint: 'Tính khoảng cách thực tế giữa hai huyện từ bản đồ thứ nhất, rồi chia cho mẫu số tỉ lệ của bản đồ thứ hai.',
        solution: 'Khoảng cách thực tế là 3.500.000 cm (35 km), trên bản đồ thứ hai dài 14 cm.',
        steps: [
          'Khoảng cách thực tế giữa hai huyện là: 35 × 100.000 = 3.500.000 (cm) = 35 (km).',
          'Độ dài đoạn thẳng biểu diễn khoảng cách đó trên bản đồ thứ hai là: 3.500.000 : 250.000 = 14 (cm).'
        ],
        svgType: 'map_dual_scale',
        svgData: { val1: 'Bản đồ 1 (1 : 100.000): 35 cm', val2: 'Bản đồ 2 (1 : 250.000): ? cm', val3: 'Chuyển đổi tỉ lệ' }
      },
      {
        id: 94,
        title: 'Chu vi thực tế của công viên hình vuông',
        question: 'Một công viên hình vuông có diện tích trên bản đồ tỉ lệ 1 : 5.000 là 16 cm². Hỏi chu vi trên thực tế của công viên đó là bao nhiêu mét?',
        options: ['400 m', '600 m', '800 m', '1.000 m'],
        correctIndex: 2,
        hint: 'Từ diện tích 16 cm² trên bản đồ, tìm độ dài cạnh công viên trên bản đồ rồi nhân với 5.000 để tính cạnh thực tế.',
        solution: 'Cạnh công viên trên bản đồ là 4 cm, cạnh thực tế là 200 m và chu vi thực tế là 800 m.',
        steps: [
          'Vì 4 × 4 = 16 nên độ dài cạnh của công viên trên bản đồ là 4 cm.',
          'Độ dài cạnh công viên trên thực tế là: 4 × 5.000 = 20.000 (cm) = 200 (m).',
          'Chu vi trên thực tế của công viên là: 200 × 4 = 800 (m).'
        ],
        svgType: 'map_rect_area',
        svgData: { val1: 'Diện tích bản đồ: 16 cm²', val2: 'Chu vi thực tế: ? m', val3: 'Tỉ lệ 1 : 5.000' }
      },
      {
        id: 95,
        title: 'Xác định tỉ lệ bản đồ du lịch',
        question: 'Khoảng cách thực tế giữa hai thành phố là 144 km. Trên một tấm bản đồ du lịch, khoảng cách giữa hai thành phố đó đo được là 12 cm. Hỏi tấm bản đồ đó được vẽ theo tỉ lệ nào?',
        options: ['1 : 120.000', '1 : 600.000', '1 : 1.200.000', '1 : 2.400.000'],
        correctIndex: 2,
        hint: 'Đổi 144 km ra đơn vị xăng-ti-mét rồi lấy khoảng cách trên bản đồ chia cho khoảng cách thực tế (rút gọn phân số về tử số bằng 1).',
        solution: 'Đổi 144 km = 14.400.000 cm, rút gọn 12 : 14.400.000 được tỉ lệ 1 : 1.200.000.',
        steps: [
          'Đổi khoảng cách thực tế sang xăng-ti-mét: 144 km = 14.400.000 cm.',
          'Tỉ số giữa khoảng cách trên bản đồ và khoảng cách thực tế là: 12 : 14.400.000.',
          'Chia cả hai số cho 12, ta được tỉ lệ bản đồ là: 1 : 1.200.000.'
        ],
        svgType: 'map_scale_diagram',
        svgData: { val1: 'Bản đồ: 12 cm | Thực tế: 144 km', val2: 'Tìm tỉ lệ bản đồ: 1 : ?', val3: 'Tỉ lệ 1 : ?' }
      },
      {
        id: 96,
        title: 'Diện tích thực tế khu đất hình thang trên bản đồ',
        question: 'Trên bản đồ quy hoạch tỉ lệ 1 : 1.000, một khu đất hình thang có đáy bé dài 4 cm, đáy lớn dài 6 cm và chiều cao bằng 3 cm. Hỏi diện tích trên thực tế của khu đất đó là bao nhiêu mét vuông?',
        options: ['150 m²', '1.200 m²', '1.500 m²', '3.000 m²'],
        correctIndex: 2,
        hint: 'Tính độ dài hai đáy và chiều cao thực tế theo đơn vị mét trước, sau đó mới tính diện tích hình thang thực tế.',
        solution: 'Hai đáy thực tế là 40 m và 60 m, chiều cao 30 m nên diện tích thực tế là 1.500 m².',
        steps: [
          'Đáy bé thực tế là: 4 × 1.000 = 4.000 (cm) = 40 (m).',
          'Đáy lớn thực tế là: 6 × 1.000 = 6.000 (cm) = 60 (m).',
          'Chiều cao thực tế là: 3 × 1.000 = 3.000 (cm) = 30 (m).',
          'Diện tích trên thực tế của khu đất hình thang là: (40 + 60) × 30 : 2 = 1.500 (m²).'
        ],
        svgType: 'map_trap_land',
        svgData: { val1: 'Đáy lớn 6 cm, cao 3 cm (1 : 1.000)', val2: 'Diện tích thực tế: ? m²', val3: 'Đáy bé: 4 cm' }
      },
      {
        id: 97,
        title: 'Tìm diện tích sân vận động trên bản đồ',
        question: 'Một sân vận động hình chữ nhật có chiều dài thực tế là 150 m và chiều rộng bằng 2/3 chiều dài. Hỏi trên bản đồ tỉ lệ 1 : 2.500, diện tích của sân vận động đó là bao nhiêu xăng-ti-mét vuông?',
        options: ['12 cm²', '18 cm²', '24 cm²', '36 cm²'],
        correctIndex: 2,
        hint: 'Tìm chiều rộng thực tế, đổi cả chiều dài và chiều rộng sang xăng-ti-mét rồi chia cho 2.500 để ra kích thước trên bản đồ.',
        solution: 'Trên bản đồ chiều dài 6 cm, chiều rộng 4 cm nên diện tích là 24 cm².',
        steps: [
          'Chiều rộng thực tế của sân vận động là: 150 × 2 : 3 = 100 (m).',
          'Đổi kích thước thực tế: 150 m = 15.000 cm; 100 m = 10.000 cm.',
          'Chiều dài trên bản đồ là: 15.000 : 2.500 = 6 (cm). Chiều rộng trên bản đồ là: 10.000 : 2.500 = 4 (cm).',
          'Diện tích sân vận động trên bản đồ là: 6 × 4 = 24 (cm²).'
        ],
        svgType: 'map_rect_area',
        svgData: { val1: 'Thực tế: dài 150 m, rộng 100 m', val2: 'Diện tích trên bản đồ: ? cm²', val3: 'Tỉ lệ 1 : 2.500' }
      },
      {
        id: 98,
        title: 'Quy đổi diện tích khu sinh thái ra đơn vị héc-ta',
        question: 'Trên bản đồ tỉ lệ 1 : 10.000, một khu rừng sinh thái hình chữ nhật có chiều dài 8 cm và chiều rộng 5 cm. Hỏi diện tích thực tế của khu rừng sinh thái đó bằng bao nhiêu héc-ta?',
        options: ['4 héc-ta', '20 héc-ta', '40 héc-ta', '400 héc-ta'],
        correctIndex: 2,
        hint: 'Tính chiều dài và chiều rộng thực tế theo đơn vị mét, tính diện tích theo mét vuông rồi chia cho 10.000 để đổi ra héc-ta.',
        solution: 'Chiều dài 800 m, chiều rộng 500 m nên diện tích là 400.000 m² = 40 héc-ta.',
        steps: [
          'Chiều dài thực tế của khu rừng là: 8 × 10.000 = 80.000 (cm) = 800 (m).',
          'Chiều rộng thực tế của khu rừng là: 5 × 10.000 = 50.000 (cm) = 500 (m).',
          'Diện tích thực tế của khu rừng là: 800 × 500 = 400.000 (m²).',
          'Đổi sang đơn vị héc-ta (1 héc-ta bằng 10.000 m²): 400.000 : 10.000 = 40 (héc-ta).'
        ],
        svgType: 'map_rect_area',
        svgData: { val1: 'Bản đồ: 8 cm × 5 cm (1 : 10.000)', val2: 'Diện tích thực tế: ? héc-ta', val3: 'Khu rừng sinh thái' }
      },
      {
        id: 99,
        title: 'Sản lượng thóc trên cánh đồng tam giác theo bản đồ',
        question: 'Trên bản đồ địa chính tỉ lệ 1 : 4.000, một mảnh ruộng hình tam giác có cạnh đáy 5 cm và chiều cao 3 cm. Trên thực tế, trung bình cứ 100 m² thu hoạch được 65 kg thóc. Hỏi cả mảnh ruộng đó thu hoạch được bao nhiêu ki-lô-gam thóc?',
        options: ['3.900 kg', '6.500 kg', '7.800 kg', '15.600 kg'],
        correctIndex: 2,
        hint: 'Tính cạnh đáy và chiều cao thực tế theo đơn vị mét, tìm diện tích thực tế rồi tính số ki-lô-gam thóc thu hoạch.',
        solution: 'Diện tích thực tế là 12.000 m² nên sản lượng thu hoạch được là 7.800 kg thóc.',
        steps: [
          'Cạnh đáy thực tế là: 5 × 4.000 = 20.000 (cm) = 200 (m).',
          'Chiều cao thực tế là: 3 × 4.000 = 12.000 (cm) = 120 (m).',
          'Diện tích thực tế của mảnh ruộng là: 200 × 120 : 2 = 12.000 (m²).',
          'Số ki-lô-gam thóc thu hoạch được là: 12.000 : 100 × 65 = 7.800 (kg).'
        ],
        svgType: 'map_tri_land',
        svgData: { val1: 'Đáy 5 cm, cao 3 cm (1 : 4.000)', val2: 'Sản lượng (65 kg mỗi 100 m²): ?' }
      },
      {
        id: 100,
        title: 'Tính giờ đến nơi trên lộ trình hai chặng của bản đồ',
        question: 'Trên bản đồ tỉ lệ 1 : 400.000, tuyến đường từ thị xã A đến thị trấn B dài 12 cm, từ thị trấn B đến điểm du lịch C dài 18 cm. Một đoàn xe xuất phát lúc 7 giờ 15 phút đi từ A qua B để đến C với vận tốc 48 km/giờ và có nghỉ tại B hết 15 phút. Hỏi đoàn xe đến C lúc mấy giờ?',
        options: ['9 giờ 45 phút', '10 giờ 00 phút', '10 giờ 15 phút', '10 giờ 30 phút'],
        correctIndex: 1,
        hint: 'Tính tổng độ dài quãng đường AC trên bản đồ rồi đổi sang quãng đường thực tế theo ki-lô-mét. Sau đó tính thời gian chạy cộng thêm 15 phút nghỉ.',
        solution: 'Tổng quãng đường thực tế là 120 km, xe chạy hết 2 giờ 30 phút và nghỉ 15 phút nên đến nơi lúc 10 giờ 00 phút.',
        steps: [
          'Tổng độ dài tuyến đường từ A đến C trên bản đồ là: 12 + 18 = 30 (cm).',
          'Quãng đường thực tế từ A đến C là: 30 × 400.000 = 12.000.000 (cm) = 120 (km).',
          'Thời gian xe chạy (không tính thời gian nghỉ) là: 120 : 48 = 2,5 (giờ) = 2 giờ 30 phút.',
          'Thời điểm đoàn xe đến điểm C là: 7 giờ 15 phút + 2 giờ 30 phút + 15 phút = 10 giờ 00 phút.'
        ],
        svgType: 'map_scale_diagram',
        svgData: { val1: 'Đoạn AB 12 cm + đoạn BC 18 cm', val2: 'Vận tốc 48 km/giờ, nghỉ 15 phút', val3: 'Tỉ lệ 1 : 400.000' }
      }
    ]
  }
];
