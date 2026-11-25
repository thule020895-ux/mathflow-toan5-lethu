export type PercentHuntVisualType =
  | 'school_bag'
  | 'stationery_kit'
  | 'sports_club'
  | 'ergonomic_backpack'
  | 'book_set'
  | 'art_club'
  | 'desk_lamp'
  | 'sports_shoes';

export interface PercentHuntScenario {
  id: string;
  level: 1 | 2 | 3 | 4;
  levelTitle: string;
  question: string;
  options: string[];
  correctAnswer: string;
  calculationSteps: string[];
  hintText: string;
  visualType: PercentHuntVisualType;
  visualBadge: string;
  visualTagValue: string;
  isRandom?: boolean;
}

export function formatVnNumber(num: number): string {
  if (Number.isInteger(num)) {
    const str = Math.abs(num).toString();
    const formatted = str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return num < 0 ? `-${formatted}` : formatted;
  }
  const [intPart, decPart] = Math.abs(num).toString().split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${num < 0 ? '-' : ''}${formattedInt},${decPart}`;
}

export function shuffleOptions(options: string[]): string[] {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PRESET_PERCENT_HUNT_SCENARIOS: PercentHuntScenario[] = [
  {
    id: 'preset-1',
    level: 1,
    levelTitle: 'Mức 1 · Khởi động',
    question:
      'Một chiếc cặp có giá 200 000 đồng, cửa hàng giảm giá 15%. Hỏi số tiền được giảm là bao nhiêu?',
    options: ['30 000 đồng', '15 000 đồng', '170 000 đồng', '20 000 đồng'],
    correctAnswer: '30 000 đồng',
    calculationSteps: ['200 000 × 15 : 100 = 30 000 (đồng).'],
    hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
    visualType: 'school_bag',
    visualBadge: '-15%',
    visualTagValue: '200 000 đ'
  },
  {
    id: 'preset-2',
    level: 2,
    levelTitle: 'Mức 2 · Thông hiểu',
    question:
      'Một bộ đồ dùng học tập có giá 120 000 đồng, nhân dịp khai giảng được giảm giá 25%. Hỏi số tiền được giảm là bao nhiêu?',
    options: ['30 000 đồng', '25 000 đồng', '90 000 đồng', '24 000 đồng'],
    correctAnswer: '30 000 đồng',
    calculationSteps: ['120 000 × 25 : 100 = 30 000 (đồng).'],
    hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
    visualType: 'stationery_kit',
    visualBadge: '-25%',
    visualTagValue: '120 000 đ'
  },
  {
    id: 'preset-3',
    level: 3,
    levelTitle: 'Mức 3 · Vận dụng số thập phân',
    question:
      'Khối lớp 5 của một trường có 160 học sinh, trong đó có 52,5% số học sinh tham gia câu lạc bộ Thể thao. Hỏi có bao nhiêu học sinh tham gia câu lạc bộ Thể thao?',
    options: ['84 học sinh', '76 học sinh', '80 học sinh', '82 học sinh'],
    correctAnswer: '84 học sinh',
    calculationSteps: ['160 × 52,5 : 100 = 84 (học sinh).'],
    hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
    visualType: 'sports_club',
    visualBadge: '52,5%',
    visualTagValue: '160 HS'
  },
  {
    id: 'preset-4',
    level: 4,
    levelTitle: 'Mức 4 · Vận dụng nâng cao 2 bước tính',
    question:
      'Một chiếc ba lô chống gù có giá 450 000 đồng, cửa hàng giảm giá 20%. Hỏi sau khi giảm giá, người mua phải trả bao nhiêu tiền để mua chiếc ba lô đó?',
    options: ['360 000 đồng', '90 000 đồng', '430 000 đồng', '380 000 đồng'],
    correctAnswer: '360 000 đồng',
    calculationSteps: [
      'Số tiền được giảm là: 450 000 × 20 : 100 = 90 000 (đồng).',
      'Số tiền người mua phải trả là: 450 000 - 90 000 = 360 000 (đồng).'
    ],
    hintText:
      'Muốn tìm a% của B, ta lấy B × a : 100 (Sau đó lấy giá ban đầu trừ đi số tiền được giảm).',
    visualType: 'ergonomic_backpack',
    visualBadge: '-20%',
    visualTagValue: '450 000 đ'
  }
];

function buildUniqueOptions(
  correctVal: number,
  unit: string,
  candidateDistractors: number[],
  stepUnit: number
): string[] {
  const seen = new Set<number>([correctVal]);
  const distractors: number[] = [];

  for (const val of candidateDistractors) {
    if (val > 0 && Number.isInteger(val) && !seen.has(val)) {
      seen.add(val);
      distractors.push(val);
      if (distractors.length === 3) break;
    }
  }

  let offset = 1;
  while (distractors.length < 3) {
    const up = correctVal + offset * stepUnit;
    const down = correctVal - offset * stepUnit;
    if (!seen.has(up)) {
      seen.add(up);
      distractors.push(up);
    }
    if (distractors.length < 3 && down > 0 && !seen.has(down)) {
      seen.add(down);
      distractors.push(down);
    }
    offset++;
  }

  const all = [
    `${formatVnNumber(correctVal)} ${unit}`,
    ...distractors.slice(0, 3).map((d) => `${formatVnNumber(d)} ${unit}`)
  ];
  return shuffleOptions(all);
}

export function generateRandomPercentScenario(prevId?: string): PercentHuntScenario {
  const levels: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  const chosenLevel = levels[Math.floor(Math.random() * levels.length)];
  const uid = `random-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  if (chosenLevel === 1) {
    const items: { name: string; visual: PercentHuntVisualType }[] = [
      { name: 'chiếc cặp sách', visual: 'school_bag' },
      { name: 'bộ sách tham khảo', visual: 'book_set' },
      { name: 'chiếc đèn bàn học sinh', visual: 'desk_lamp' }
    ];
    const item = items[Math.floor(Math.random() * items.length)];
    const prices = [100000, 150000, 200000, 250000, 300000, 400000];
    const percents = [10, 15, 20, 25, 30, 40];
    const price = prices[Math.floor(Math.random() * prices.length)];
    const percent = percents[Math.floor(Math.random() * percents.length)];
    const discount = (price * percent) / 100;

    const options = buildUniqueOptions(
      discount,
      'đồng',
      [percent * 1000, price - discount, discount + 10000, discount + 15000, price / 10],
      5000
    );

    const scenario: PercentHuntScenario = {
      id: uid,
      level: 1,
      levelTitle: 'Mức 1 · Thực hành mở rộng',
      question: `Một ${item.name} có giá ${formatVnNumber(price)} đồng, cửa hàng giảm giá ${percent}%. Hỏi số tiền được giảm là bao nhiêu?`,
      options,
      correctAnswer: `${formatVnNumber(discount)} đồng`,
      calculationSteps: [
        `${formatVnNumber(price)} × ${percent} : 100 = ${formatVnNumber(discount)} (đồng).`
      ],
      hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
      visualType: item.visual,
      visualBadge: `-${percent}%`,
      visualTagValue: `${formatVnNumber(price)} đ`,
      isRandom: true
    };
    if (prevId && scenario.question === prevId) {
      return generateRandomPercentScenario();
    }
    return scenario;
  }

  if (chosenLevel === 2) {
    const items: { name: string; visual: PercentHuntVisualType }[] = [
      { name: 'bộ đồ dùng học tập', visual: 'stationery_kit' },
      { name: 'bộ truyện khoa học thiếu nhi', visual: 'book_set' },
      { name: 'chiếc đèn học chống cận', visual: 'desk_lamp' }
    ];
    const item = items[Math.floor(Math.random() * items.length)];
    const prices = [120000, 140000, 160000, 180000, 240000, 320000];
    const percents = [15, 20, 25, 35];
    const price = prices[Math.floor(Math.random() * prices.length)];
    const percent = percents[Math.floor(Math.random() * percents.length)];
    const discount = (price * percent) / 100;

    const options = buildUniqueOptions(
      discount,
      'đồng',
      [percent * 1000, price - discount, discount - 6000, discount + 8000, discount + 12000],
      4000
    );

    return {
      id: uid,
      level: 2,
      levelTitle: 'Mức 2 · Thực hành mở rộng',
      question: `Một ${item.name} có giá ${formatVnNumber(price)} đồng, nhân dịp năm học mới được giảm giá ${percent}%. Hỏi số tiền được giảm là bao nhiêu?`,
      options,
      correctAnswer: `${formatVnNumber(discount)} đồng`,
      calculationSteps: [
        `${formatVnNumber(price)} × ${percent} : 100 = ${formatVnNumber(discount)} (đồng).`
      ],
      hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
      visualType: item.visual,
      visualBadge: `-${percent}%`,
      visualTagValue: `${formatVnNumber(price)} đ`,
      isRandom: true
    };
  }

  if (chosenLevel === 3) {
    const clubs: { name: string; visual: PercentHuntVisualType }[] = [
      { name: 'câu lạc bộ Thể thao', visual: 'sports_club' },
      { name: 'câu lạc bộ Mỹ thuật', visual: 'art_club' },
      { name: 'câu lạc bộ Bóng đá', visual: 'sports_club' }
    ];
    const club = clubs[Math.floor(Math.random() * clubs.length)];
    const cleanPairs: [number, number][] = [
      [120, 37.5],
      [160, 42.5],
      [160, 62.5],
      [200, 32.5],
      [200, 47.5],
      [240, 37.5],
      [240, 12.5],
      [320, 27.5],
      [160, 17.5],
      [120, 22.5]
    ];
    const [totalStudents, percent] = cleanPairs[Math.floor(Math.random() * cleanPairs.length)];
    const result = Math.round((totalStudents * percent) / 100);

    const options = buildUniqueOptions(
      result,
      'học sinh',
      [totalStudents - result, result + 4, result - 4, Math.round(totalStudents / 2), result + 6],
      2
    );

    return {
      id: uid,
      level: 3,
      levelTitle: 'Mức 3 · Vận dụng số thập phân',
      question: `Khối lớp 5 của một trường có ${totalStudents} học sinh, trong đó có ${formatVnNumber(percent)}% số học sinh tham gia ${club.name}. Hỏi có bao nhiêu học sinh tham gia ${club.name}?`,
      options,
      correctAnswer: `${formatVnNumber(result)} học sinh`,
      calculationSteps: [
        `${totalStudents} × ${formatVnNumber(percent)} : 100 = ${formatVnNumber(result)} (học sinh).`
      ],
      hintText: 'Muốn tìm a% của B, ta lấy B × a : 100',
      visualType: club.visual,
      visualBadge: `${formatVnNumber(percent)}%`,
      visualTagValue: `${totalStudents} HS`,
      isRandom: true
    };
  }

  // Level 4: 2-step calculation (amount paid after discount)
  const items4: { name: string; visual: PercentHuntVisualType }[] = [
    { name: 'chiếc ba lô chống gù', visual: 'ergonomic_backpack' },
    { name: 'đôi giày thể thao học sinh', visual: 'sports_shoes' },
    { name: 'chiếc đèn bàn thông minh', visual: 'desk_lamp' }
  ];
  const item4 = items4[Math.floor(Math.random() * items4.length)];
  const prices4 = [300000, 350000, 400000, 500000, 600000, 800000];
  const percents4 = [10, 15, 20, 25, 30];
  const price4 = prices4[Math.floor(Math.random() * prices4.length)];
  const percent4 = percents4[Math.floor(Math.random() * percents4.length)];
  const discount4 = (price4 * percent4) / 100;
  const paid4 = price4 - discount4;

  const options4 = buildUniqueOptions(
    paid4,
    'đồng',
    [discount4, price4 - percent4 * 1000, paid4 + 20000, paid4 - 20000, paid4 + 30000],
    10000
  );

  return {
    id: uid,
    level: 4,
    levelTitle: 'Mức 4 · Vận dụng 2 bước tính',
    question: `Một ${item4.name} có giá ${formatVnNumber(price4)} đồng, cửa hàng giảm giá ${percent4}%. Hỏi sau khi giảm giá, người mua phải trả bao nhiêu tiền để mua món đồ đó?`,
    options: options4,
    correctAnswer: `${formatVnNumber(paid4)} đồng`,
    calculationSteps: [
      `Số tiền được giảm là: ${formatVnNumber(price4)} × ${percent4} : 100 = ${formatVnNumber(discount4)} (đồng).`,
      `Số tiền người mua phải trả là: ${formatVnNumber(price4)} - ${formatVnNumber(discount4)} = ${formatVnNumber(paid4)} (đồng).`
    ],
    hintText:
      'Muốn tìm a% của B, ta lấy B × a : 100 (Sau đó lấy giá ban đầu trừ đi số tiền được giảm).',
    visualType: item4.visual,
    visualBadge: `-${percent4}%`,
    visualTagValue: `${formatVnNumber(price4)} đ`,
    isRandom: true
  };
}
