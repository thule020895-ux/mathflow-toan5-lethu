import { ArenaDiagramSpec } from './ArenaIllustrations';

export type GameType =
  | 'tri_area'
  | 'trap_area'
  | 'circle_area'
  | 'rect_sxq'
  | 'cube_stp'
  | 'volume'
  | 'velocity'
  | 'distance'
  | 'time'
  | 'relative_motion'
  | 'units_convert'
  | 'sum_diff_game'
  | 'ratio_game'
  | 'fraction_game'
  | 'percentage_game'
  | 'stats_game';

export type ArenaDifficulty = 'Cơ bản' | 'Thông hiểu' | 'Vận dụng';

export interface ArenaQuestion {
  index: number; // 0..9
  difficulty: ArenaDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
  diagram: ArenaDiagramSpec;
}

export const formatNum = (n: number): string => {
  const rounded = Math.round(n * 10000) / 10000;
  return rounded.toLocaleString('vi-VN', { maximumFractionDigits: 4 });
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildQuestion = (
  index: number,
  question: string,
  correctVal: number,
  candidateWrongs: number[],
  unit: string,
  diagram: ArenaDiagramSpec
): ArenaQuestion => {
  const difficulty: ArenaDifficulty =
    index < 3 ? 'Cơ bản' : index < 7 ? 'Thông hiểu' : 'Vận dụng';

  const cleanCorrect = Math.round(correctVal * 10000) / 10000;
  const uniqueWrongs: number[] = [];

  for (const w of candidateWrongs) {
    const cleanW = Math.round(w * 10000) / 10000;
    if (cleanW > 0 && cleanW !== cleanCorrect && !uniqueWrongs.includes(cleanW)) {
      uniqueWrongs.push(cleanW);
    }
    if (uniqueWrongs.length === 3) break;
  }

  let step = cleanCorrect >= 100 ? 10 : cleanCorrect >= 10 ? 2 : 1;
  while (uniqueWrongs.length < 3) {
    const cand = Math.round((cleanCorrect + step) * 10000) / 10000;
    if (cand > 0 && cand !== cleanCorrect && !uniqueWrongs.includes(cand)) {
      uniqueWrongs.push(cand);
    }
    step = step > 0 ? -step : -step + (cleanCorrect >= 100 ? 15 : 3);
  }

  const formatWithUnit = (val: number) =>
    unit === '%' ? `${formatNum(val)}%` : `${formatNum(val)} ${unit}`;
  const correctStr = formatWithUnit(cleanCorrect);
  const allOptions = shuffle([correctStr, ...uniqueWrongs.map(formatWithUnit)]);

  return {
    index,
    difficulty,
    question,
    options: allOptions,
    correctIndex: allOptions.indexOf(correctStr),
    diagram
  };
};

// =========================================================================
// 1. THỢ SĂN TAM GIÁC (tri_area)
// =========================================================================
const generateTriAreaSet = (): ArenaQuestion[] => {
  const basic = shuffle([
    { b: 12, h: 8, u: 'cm', u2: 'cm²' },
    { b: 16, h: 9, u: 'cm', u2: 'cm²' },
    { b: 24, h: 15, u: 'cm', u2: 'cm²' },
    { b: 18, h: 11, u: 'dm', u2: 'dm²' },
    { b: 20, h: 13, u: 'm', u2: 'm²' },
    { b: 14, h: 10, u: 'cm', u2: 'cm²' }
  ]).slice(0, 3);

  const midDec = shuffle([
    { b: 24.5, h: 12, u: 'cm', u2: 'cm²' },
    { b: 32.4, h: 15, u: 'cm', u2: 'cm²' },
    { b: 45, h: 18.4, u: 'm', u2: 'm²' },
    { b: 28.5, h: 16, u: 'dm', u2: 'dm²' }
  ]).slice(0, 2);

  const midConv = shuffle([
    {
      bText: '12 dm',
      hText: '1,5 m',
      bDiagram: 'Đáy: 12 dm',
      hDiagram: 'Chiều cao: 1,5 m',
      bNum: 12,
      hNum: 15,
      targetUnitName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      bText: '2,4 m',
      hText: '15 dm',
      bDiagram: 'Đáy: 2,4 m',
      hDiagram: 'Chiều cao: 15 dm',
      bNum: 24,
      hNum: 15,
      targetUnitName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      bText: '3,5 dm',
      hText: '20 cm',
      bDiagram: 'Đáy: 3,5 dm',
      hDiagram: 'Chiều cao: 20 cm',
      bNum: 35,
      hNum: 20,
      targetUnitName: 'xăng-ti-mét vuông',
      u2: 'cm²'
    },
    {
      bText: '40 cm',
      hText: '2,5 dm',
      bDiagram: 'Đáy: 40 cm',
      hDiagram: 'Chiều cao: 2,5 dm',
      bNum: 40,
      hNum: 25,
      targetUnitName: 'xăng-ti-mét vuông',
      u2: 'cm²'
    }
  ]).slice(0, 2);

  const invHeight = pick([
    { area: 216, b: 24, h: 18, u: 'cm', u2: 'cm²' },
    { area: 270, b: 30, h: 18, u: 'cm', u2: 'cm²' },
    { area: 336, b: 28, h: 24, u: 'dm', u2: 'dm²' }
  ]);

  const invBase = pick([
    { area: 375, h: 25, b: 30, u: 'm', u2: 'm²' },
    { area: 432, h: 24, b: 36, u: 'cm', u2: 'cm²' },
    { area: 288, h: 16, b: 36, u: 'dm', u2: 'dm²' }
  ]);

  const twoStep = pick([
    { b: 40, h: 25, pct: 60, ans: 300, crop: 'trồng hoa' },
    { b: 50, h: 32, pct: 45, ans: 360, crop: 'trồng rau sạch' },
    { b: 45, h: 24, pct: 70, ans: 378, crop: 'trồng cây ăn quả' }
  ]);

  return [
    ...basic.map((item, i) => {
      const ans = (item.b * item.h) / 2;
      return buildQuestion(
        i,
        `Tính diện tích hình tam giác có độ dài đáy là ${formatNum(item.b)} ${item.u} và chiều cao là ${formatNum(item.h)} ${item.u}.`,
        ans,
        [item.b * item.h, ans + 12, (item.b + item.h) * 2],
        item.u2,
        {
          kind: 'triangle',
          baseLabel: `Đáy: ${formatNum(item.b)} ${item.u}`,
          heightLabel: `Chiều cao: ${formatNum(item.h)} ${item.u}`
        }
      );
    }),
    ...midDec.map((item, i) => {
      const ans = (item.b * item.h) / 2;
      return buildQuestion(
        3 + i,
        `Một tấm biển quảng cáo hình tam giác có độ dài đáy là ${formatNum(item.b)} ${item.u} và chiều cao là ${formatNum(item.h)} ${item.u}. Tính diện tích tấm biển quảng cáo đó.`,
        ans,
        [item.b * item.h, ans + 15, ans - 12],
        item.u2,
        {
          kind: 'triangle',
          baseLabel: `Đáy: ${formatNum(item.b)} ${item.u}`,
          heightLabel: `Chiều cao: ${formatNum(item.h)} ${item.u}`
        }
      );
    }),
    ...midConv.map((item, i) => {
      const ans = (item.bNum * item.hNum) / 2;
      return buildQuestion(
        5 + i,
        `Một hình tam giác có độ dài đáy là ${item.bText} và chiều cao là ${item.hText}. Tính diện tích hình tam giác đó theo đơn vị ${item.targetUnitName}.`,
        ans,
        [item.bNum * item.hNum, ans / 10, ans + 20],
        item.u2,
        {
          kind: 'triangle',
          baseLabel: item.bDiagram,
          heightLabel: item.hDiagram
        }
      );
    }),
    buildQuestion(
      7,
      `Một hình tam giác có diện tích là ${formatNum(invHeight.area)} ${invHeight.u2} và độ dài đáy là ${formatNum(invHeight.b)} ${invHeight.u}. Tính chiều cao của hình tam giác đó.`,
      invHeight.h,
      [invHeight.h / 2, invHeight.h + 4, invHeight.h + 6],
      invHeight.u,
      {
        kind: 'triangle',
        baseLabel: `Đáy: ${formatNum(invHeight.b)} ${invHeight.u}`,
        heightLabel: 'Chiều cao: ?',
        extraBadge: `Diện tích: ${formatNum(invHeight.area)} ${invHeight.u2}`
      }
    ),
    buildQuestion(
      8,
      `Một mảnh đất hình tam giác có diện tích là ${formatNum(invBase.area)} ${invBase.u2} và chiều cao là ${formatNum(invBase.h)} ${invBase.u}. Tính độ dài cạnh đáy của mảnh đất đó.`,
      invBase.b,
      [invBase.b / 2, invBase.b + 5, invBase.b - 4],
      invBase.u,
      {
        kind: 'triangle',
        baseLabel: 'Đáy: ?',
        heightLabel: `Chiều cao: ${formatNum(invBase.h)} ${invBase.u}`,
        extraBadge: `Diện tích: ${formatNum(invBase.area)} ${invBase.u2}`
      }
    ),
    buildQuestion(
      9,
      `Một thửa ruộng hình tam giác có độ dài đáy là ${twoStep.b} m và chiều cao là ${twoStep.h} m. Người ta sử dụng ${twoStep.pct}% diện tích thửa ruộng để ${twoStep.crop}. Tính diện tích phần đất dùng để ${twoStep.crop}.`,
      twoStep.ans,
      [(twoStep.b * twoStep.h) / 2, twoStep.ans * 2, twoStep.ans + 40],
      'm²',
      {
        kind: 'triangle',
        baseLabel: `Đáy: ${twoStep.b} m`,
        heightLabel: `Chiều cao: ${twoStep.h} m`,
        extraBadge: `Đất ${twoStep.crop}: ${twoStep.pct}% diện tích`
      }
    )
  ];
};

// =========================================================================
// 2. KỸ SƯ HÌNH THANG (trap_area)
// =========================================================================
const generateTrapAreaSet = (): ArenaQuestion[] => {
  const basic = shuffle([
    { b1: 16, b2: 10, h: 8, u: 'cm', u2: 'cm²' },
    { b1: 22, b2: 14, h: 10, u: 'cm', u2: 'cm²' },
    { b1: 25, b2: 15, h: 12, u: 'dm', u2: 'dm²' },
    { b1: 18, b2: 12, h: 9, u: 'm', u2: 'm²' },
    { b1: 20, b2: 12, h: 11, u: 'cm', u2: 'cm²' }
  ]).slice(0, 3);

  const midDec = shuffle([
    { b1: 36.5, b2: 23.5, h: 18, u: 'cm', u2: 'cm²' },
    { b1: 42.4, b2: 27.6, h: 15, u: 'm', u2: 'm²' },
    { b1: 28.5, b2: 17.5, h: 14, u: 'dm', u2: 'dm²' },
    { b1: 34.2, b2: 25.8, h: 22, u: 'cm', u2: 'cm²' }
  ]).slice(0, 2);

  const midConv = shuffle([
    {
      b1Text: '2,4 m',
      b2Text: '16 dm',
      hText: '15 dm',
      b1Num: 24,
      b2Num: 16,
      hNum: 15,
      targetUnitName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      b1Text: '3,2 m',
      b2Text: '18 dm',
      hText: '14 dm',
      b1Num: 32,
      b2Num: 18,
      hNum: 14,
      targetUnitName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      b1Text: '3,5 dm',
      b2Text: '25 cm',
      hText: '20 cm',
      b1Num: 35,
      b2Num: 25,
      hNum: 20,
      targetUnitName: 'xăng-ti-mét vuông',
      u2: 'cm²'
    },
    {
      b1Text: '45 cm',
      b2Text: '2,5 dm',
      hText: '18 cm',
      b1Num: 45,
      b2Num: 25,
      hNum: 18,
      targetUnitName: 'xăng-ti-mét vuông',
      u2: 'cm²'
    }
  ]).slice(0, 2);

  const invHeight = pick([
    { area: 360, b1: 28, b2: 17, h: 16, u: 'cm', u2: 'cm²' },
    { area: 450, b1: 35, b2: 25, h: 15, u: 'm', u2: 'm²' },
    { area: 540, b1: 38, b2: 22, h: 18, u: 'dm', u2: 'dm²' }
  ]);

  const invBase = pick([
    { area: 600, b2: 22, h: 20, b1: 38, u: 'm', u2: 'm²' },
    { area: 480, b2: 18, h: 16, b1: 42, u: 'cm', u2: 'cm²' },
    { area: 720, b2: 26, h: 24, b1: 34, u: 'dm', u2: 'dm²' }
  ]);

  const twoStep = pick([
    { b1: 46, b2: 34, h: 25, pct: 45, ans: 450, work: 'đào ao nuôi cá' },
    { b1: 52, b2: 28, h: 30, pct: 35, ans: 420, work: 'trồng cây ăn quả' },
    { b1: 44, b2: 36, h: 20, pct: 65, ans: 520, work: 'trồng hoa màu' }
  ]);

  return [
    ...basic.map((item, i) => {
      const ans = ((item.b1 + item.b2) * item.h) / 2;
      return buildQuestion(
        i,
        `Tính diện tích hình thang có độ dài đáy lớn là ${item.b1} ${item.u}, đáy bé là ${item.b2} ${item.u} và chiều cao là ${item.h} ${item.u}.`,
        ans,
        [(item.b1 + item.b2) * item.h, ans + 20, (item.b1 * item.b2) / 2],
        item.u2,
        {
          kind: 'trapezoid',
          topBaseLabel: `Đáy bé: ${item.b2} ${item.u}`,
          bottomBaseLabel: `Đáy lớn: ${item.b1} ${item.u}`,
          heightLabel: `Chiều cao: ${item.h} ${item.u}`
        }
      );
    }),
    ...midDec.map((item, i) => {
      const ans = ((item.b1 + item.b2) * item.h) / 2;
      return buildQuestion(
        3 + i,
        `Một mảnh vườn hình thang có đáy lớn là ${formatNum(item.b1)} ${item.u}, đáy bé là ${formatNum(item.b2)} ${item.u} và chiều cao là ${formatNum(item.h)} ${item.u}. Tính diện tích mảnh vườn đó.`,
        ans,
        [(item.b1 + item.b2) * item.h, ans + 30, ans - 25],
        item.u2,
        {
          kind: 'trapezoid',
          topBaseLabel: `Đáy bé: ${formatNum(item.b2)} ${item.u}`,
          bottomBaseLabel: `Đáy lớn: ${formatNum(item.b1)} ${item.u}`,
          heightLabel: `Chiều cao: ${formatNum(item.h)} ${item.u}`
        }
      );
    }),
    ...midConv.map((item, i) => {
      const ans = ((item.b1Num + item.b2Num) * item.hNum) / 2;
      return buildQuestion(
        5 + i,
        `Tính diện tích hình thang có đáy lớn là ${item.b1Text}, đáy bé là ${item.b2Text} và chiều cao là ${item.hText} theo đơn vị ${item.targetUnitName}.`,
        ans,
        [(item.b1Num + item.b2Num) * item.hNum, ans / 10, ans + 45],
        item.u2,
        {
          kind: 'trapezoid',
          topBaseLabel: `Đáy bé: ${item.b2Text}`,
          bottomBaseLabel: `Đáy lớn: ${item.b1Text}`,
          heightLabel: `Chiều cao: ${item.hText}`
        }
      );
    }),
    buildQuestion(
      7,
      `Một hình thang có diện tích là ${invHeight.area} ${invHeight.u2}, độ dài đáy lớn là ${invHeight.b1} ${invHeight.u} và đáy bé là ${invHeight.b2} ${invHeight.u}. Tính chiều cao của hình thang đó.`,
      invHeight.h,
      [invHeight.h / 2, invHeight.h + 4, invHeight.h + 8],
      invHeight.u,
      {
        kind: 'trapezoid',
        topBaseLabel: `Đáy bé: ${invHeight.b2} ${invHeight.u}`,
        bottomBaseLabel: `Đáy lớn: ${invHeight.b1} ${invHeight.u}`,
        heightLabel: 'Chiều cao: ?',
        extraBadge: `Diện tích: ${invHeight.area} ${invHeight.u2}`
      }
    ),
    buildQuestion(
      8,
      `Một hình thang có diện tích là ${invBase.area} ${invBase.u2}, chiều cao là ${invBase.h} ${invBase.u} và đáy bé là ${invBase.b2} ${invBase.u}. Tính độ dài đáy lớn của hình thang đó.`,
      invBase.b1,
      [invBase.b1 + invBase.b2, invBase.b1 - 6, invBase.b1 + 8],
      invBase.u,
      {
        kind: 'trapezoid',
        topBaseLabel: `Đáy bé: ${invBase.b2} ${invBase.u}`,
        bottomBaseLabel: 'Đáy lớn: ?',
        heightLabel: `Chiều cao: ${invBase.h} ${invBase.u}`,
        extraBadge: `Diện tích: ${invBase.area} ${invBase.u2}`
      }
    ),
    buildQuestion(
      9,
      `Một mảnh đất hình thang có đáy lớn là ${twoStep.b1} m, đáy bé là ${twoStep.b2} m và chiều cao là ${twoStep.h} m. Người ta dành ${twoStep.pct}% diện tích mảnh đất để ${twoStep.work}. Tính diện tích phần đất dùng để ${twoStep.work}.`,
      twoStep.ans,
      [((twoStep.b1 + twoStep.b2) * twoStep.h) / 2, twoStep.ans + 50, twoStep.ans - 40],
      'm²',
      {
        kind: 'trapezoid',
        topBaseLabel: `Đáy bé: ${twoStep.b2} m`,
        bottomBaseLabel: `Đáy lớn: ${twoStep.b1} m`,
        heightLabel: `Chiều cao: ${twoStep.h} m`,
        extraBadge: `Phần ${twoStep.work}: ${twoStep.pct}% diện tích`
      }
    )
  ];
};

// =========================================================================
// 3. VÒNG TRÒN KỲ DIỆU (circle_area)
// =========================================================================
const generateCircleSet = (): ArenaQuestion[] => {
  const q1 = pick([
    { r: 5, ans: 31.4, u: 'cm' },
    { r: 4, ans: 25.12, u: 'cm' },
    { r: 6, ans: 37.68, u: 'cm' }
  ]);
  const q2 = pick([
    { r: 5, ans: 78.5, u: 'cm', u2: 'cm²' },
    { r: 10, ans: 314, u: 'cm', u2: 'cm²' },
    { r: 4, ans: 50.24, u: 'dm', u2: 'dm²' }
  ]);
  const q3 = pick([
    { d: 12, ans: 37.68, u: 'cm' },
    { d: 14, ans: 43.96, u: 'dm' },
    { d: 20, ans: 62.8, u: 'm' }
  ]);

  const q4 = pick([
    { r: 4.5, ans: 28.26, u: 'cm' },
    { r: 7.5, ans: 47.1, u: 'dm' },
    { r: 12.5, ans: 78.5, u: 'm' }
  ]);
  const q5 = pick([
    { d: 16, ans: 200.96, u: 'cm', u2: 'cm²' },
    { d: 14, ans: 153.86, u: 'dm', u2: 'dm²' },
    { d: 24, ans: 452.16, u: 'cm', u2: 'cm²' }
  ]);
  const q6 = pick([
    { rText: '0,5 m', targetName: 'xăng-ti-mét', ans: 314, u: 'cm' },
    { rText: '1,2 m', targetName: 'đề-xi-mét', ans: 75.36, u: 'dm' }
  ]);
  const q7 = pick([
    { dText: '1,6 m', targetName: 'đề-xi-mét vuông', ans: 200.96, u2: 'dm²' },
    { dText: '1,2 m', targetName: 'đề-xi-mét vuông', ans: 113.04, u2: 'dm²' }
  ]);

  const q8 = pick([
    { circ: 31.4, r: 5, u: 'cm' },
    { circ: 62.8, r: 10, u: 'dm' },
    { circ: 37.68, r: 6, u: 'cm' }
  ]);
  const q9 = pick([
    { area: 78.5, d: 10, u: 'dm', u2: 'dm²' },
    { area: 314, d: 20, u: 'cm', u2: 'cm²' },
    { area: 113.04, d: 12, u: 'cm', u2: 'cm²' }
  ]);
  const q10 = pick([
    { r: 0.35, turns: 100, ans: 219.8 },
    { r: 0.4, turns: 150, ans: 376.8 },
    { r: 0.25, turns: 200, ans: 314 }
  ]);

  return [
    buildQuestion(
      0,
      `Tính chu vi của hình tròn có bán kính là ${q1.r} ${q1.u}.`,
      q1.ans,
      [q1.r * 3.14, q1.r * q1.r * 3.14, q1.ans + 6.28],
      q1.u,
      { kind: 'circle', mode: 'radius', measureLabel: `r = ${q1.r} ${q1.u}` }
    ),
    buildQuestion(
      1,
      `Tính diện tích của hình tròn có bán kính là ${q2.r} ${q2.u}.`,
      q2.ans,
      [q2.r * 2 * 3.14, q2.r * 3.14, q2.ans + 12.56],
      q2.u2,
      { kind: 'circle', mode: 'radius', measureLabel: `r = ${q2.r} ${q2.u}` }
    ),
    buildQuestion(
      2,
      `Tính chu vi của hình tròn có đường kính là ${q3.d} ${q3.u}.`,
      q3.ans,
      [q3.d * 2 * 3.14, (q3.d / 2) * (q3.d / 2) * 3.14, q3.ans + 3.14],
      q3.u,
      { kind: 'circle', mode: 'diameter', measureLabel: `d = ${q3.d} ${q3.u}` }
    ),
    buildQuestion(
      3,
      `Một chiếc đĩa hình tròn có bán kính là ${formatNum(q4.r)} ${q4.u}. Tính chu vi của chiếc đĩa đó.`,
      q4.ans,
      [q4.r * 3.14, q4.ans + 6.28, q4.ans - 3.14],
      q4.u,
      { kind: 'circle', mode: 'radius', measureLabel: `r = ${formatNum(q4.r)} ${q4.u}` }
    ),
    buildQuestion(
      4,
      `Một mặt bàn hình tròn có đường kính là ${q5.d} ${q5.u}. Tính diện tích của mặt bàn đó.`,
      q5.ans,
      [q5.d * q5.d * 3.14, q5.d * 3.14, q5.ans / 2],
      q5.u2,
      { kind: 'circle', mode: 'diameter', measureLabel: `d = ${q5.d} ${q5.u}` }
    ),
    buildQuestion(
      5,
      `Một vòng hoa hình tròn có bán kính là ${q6.rText}. Tính chu vi vòng hoa đó theo đơn vị ${q6.targetName}.`,
      q6.ans,
      [q6.ans / 10, q6.ans / 2, q6.ans + 31.4],
      q6.u,
      { kind: 'circle', mode: 'radius', measureLabel: `r = ${q6.rText}` }
    ),
    buildQuestion(
      6,
      `Một tấm bảng hiệu hình tròn có đường kính là ${q7.dText}. Tính diện tích tấm bảng hiệu đó theo đơn vị ${q7.targetName}.`,
      q7.ans,
      [q7.ans * 4, q7.ans / 10, q7.ans + 25.12],
      q7.u2,
      { kind: 'circle', mode: 'diameter', measureLabel: `d = ${q7.dText}` }
    ),
    buildQuestion(
      7,
      `Một hình tròn có chu vi là ${formatNum(q8.circ)} ${q8.u}. Tính bán kính của hình tròn đó.`,
      q8.r,
      [q8.r * 2, q8.r + 2, q8.r + 4],
      q8.u,
      {
        kind: 'circle',
        mode: 'radius',
        measureLabel: 'r = ?',
        extraBadge: `Chu vi: ${formatNum(q8.circ)} ${q8.u}`
      }
    ),
    buildQuestion(
      8,
      `Một bồn hoa hình tròn có diện tích là ${formatNum(q9.area)} ${q9.u2}. Tính đường kính của bồn hoa đó.`,
      q9.d,
      [q9.d / 2, q9.d + 4, q9.d * 2],
      q9.u,
      {
        kind: 'circle',
        mode: 'diameter',
        measureLabel: 'd = ?',
        extraBadge: `Diện tích: ${formatNum(q9.area)} ${q9.u2}`
      }
    ),
    buildQuestion(
      9,
      `Một bánh xe đạp có bán kính là ${formatNum(q10.r)} m. Hỏi khi bánh xe lăn trên mặt đường đúng ${q10.turns} vòng thì xe đi được quãng đường dài bao nhiêu mét?`,
      q10.ans,
      [q10.ans / 2, q10.ans + 31.4, q10.ans - 15.7],
      'm',
      {
        kind: 'circle',
        mode: 'radius',
        measureLabel: `r = ${formatNum(q10.r)} m`,
        extraBadge: `Số vòng lăn: ${q10.turns} vòng`
      }
    )
  ];
};

// =========================================================================
// 4. SIÊU NHÍ HÌNH HỘP (rect_sxq)
// =========================================================================
const generateRectSxqSet = (): ArenaQuestion[] => {
  const basic = shuffle([
    { l: 10, w: 6, h: 5, u: 'cm', u2: 'cm²' },
    { l: 12, w: 8, h: 6, u: 'cm', u2: 'cm²' },
    { l: 15, w: 9, h: 7, u: 'dm', u2: 'dm²' },
    { l: 14, w: 10, h: 8, u: 'm', u2: 'm²' }
  ]).slice(0, 3);

  const midDec = shuffle([
    { l: 12.5, w: 7.5, h: 8, u: 'cm', u2: 'cm²' },
    { l: 15.6, w: 9.4, h: 10, u: 'dm', u2: 'dm²' },
    { l: 22.5, w: 12.5, h: 14, u: 'cm', u2: 'cm²' },
    { l: 18.4, w: 11.6, h: 12, u: 'm', u2: 'm²' }
  ]).slice(0, 2);

  const midConv = shuffle([
    {
      lText: '1,5 m',
      wText: '8 dm',
      hText: '10 dm',
      lNum: 15,
      wNum: 8,
      hNum: 10,
      targetName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      lText: '2,2 m',
      wText: '12 dm',
      hText: '15 dm',
      lNum: 22,
      wNum: 12,
      hNum: 15,
      targetName: 'đề-xi-mét vuông',
      u2: 'dm²'
    },
    {
      lText: '3,5 dm',
      wText: '25 cm',
      hText: '16 cm',
      lNum: 35,
      wNum: 25,
      hNum: 16,
      targetName: 'xăng-ti-mét vuông',
      u2: 'cm²'
    }
  ]).slice(0, 2);

  const invH = pick([
    { l: 15, w: 10, h: 8, sxq: 400, u: 'cm', u2: 'cm²' },
    { l: 18, w: 12, h: 11, sxq: 660, u: 'dm', u2: 'dm²' },
    { l: 24, w: 16, h: 9, sxq: 720, u: 'cm', u2: 'cm²' }
  ]);

  const invL = pick([
    { l: 16, w: 9, h: 10, sxq: 500, u: 'cm', u2: 'cm²' },
    { l: 20, w: 14, h: 12, sxq: 816, u: 'dm', u2: 'dm²' },
    { l: 18, w: 12, h: 15, sxq: 900, u: 'cm', u2: 'cm²' }
  ]);

  const twoStep = pick([
    { l: 25, w: 15, h: 12, ans: 1335, u: 'cm', u2: 'cm²' },
    { l: 20, w: 14, h: 10, ans: 960, u: 'dm', u2: 'dm²' },
    { l: 30, w: 20, h: 15, ans: 2100, u: 'cm', u2: 'cm²' }
  ]);

  return [
    ...basic.map((item, i) => {
      const ans = 2 * (item.l + item.w) * item.h;
      return buildQuestion(
        i,
        `Tính diện tích xung quanh của hình hộp chữ nhật có chiều dài là ${item.l} ${item.u}, chiều rộng là ${item.w} ${item.u} và chiều cao là ${item.h} ${item.u}.`,
        ans,
        [(item.l + item.w) * item.h, ans + 2 * item.l * item.w, item.l * item.w * item.h],
        item.u2,
        {
          kind: 'box3d',
          lengthLabel: `Dài: ${item.l} ${item.u}`,
          widthLabel: `Rộng: ${item.w} ${item.u}`,
          heightLabel: `Cao: ${item.h} ${item.u}`
        }
      );
    }),
    ...midDec.map((item, i) => {
      const ans = 2 * (item.l + item.w) * item.h;
      return buildQuestion(
        3 + i,
        `Một thùng hàng hình hộp chữ nhật có chiều dài là ${formatNum(item.l)} ${item.u}, chiều rộng là ${formatNum(item.w)} ${item.u} và chiều cao là ${formatNum(item.h)} ${item.u}. Tính diện tích xung quanh của thùng hàng đó.`,
        ans,
        [(item.l + item.w) * item.h, ans + 40, ans - 30],
        item.u2,
        {
          kind: 'box3d',
          lengthLabel: `Dài: ${formatNum(item.l)} ${item.u}`,
          widthLabel: `Rộng: ${formatNum(item.w)} ${item.u}`,
          heightLabel: `Cao: ${formatNum(item.h)} ${item.u}`
        }
      );
    }),
    ...midConv.map((item, i) => {
      const ans = 2 * (item.lNum + item.wNum) * item.hNum;
      return buildQuestion(
        5 + i,
        `Một hình hộp chữ nhật có chiều dài là ${item.lText}, chiều rộng là ${item.wText} và chiều cao là ${item.hText}. Tính diện tích xung quanh của hình hộp chữ nhật đó theo đơn vị ${item.targetName}.`,
        ans,
        [(item.lNum + item.wNum) * item.hNum, ans / 10, ans + 120],
        item.u2,
        {
          kind: 'box3d',
          lengthLabel: `Dài: ${item.lText}`,
          widthLabel: `Rộng: ${item.wText}`,
          heightLabel: `Cao: ${item.hText}`
        }
      );
    }),
    buildQuestion(
      7,
      `Một hình hộp chữ nhật có diện tích xung quanh là ${invH.sxq} ${invH.u2}, chiều dài là ${invH.l} ${invH.u} và chiều rộng là ${invH.w} ${invH.u}. Tính chiều cao của hình hộp chữ nhật đó.`,
      invH.h,
      [invH.h * 2, invH.h + 3, invH.h - 2],
      invH.u,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${invH.l} ${invH.u}`,
        widthLabel: `Rộng: ${invH.w} ${invH.u}`,
        heightLabel: 'Cao: ?',
        extraBadge: `Diện tích xung quanh: ${invH.sxq} ${invH.u2}`
      }
    ),
    buildQuestion(
      8,
      `Một hình hộp chữ nhật có diện tích xung quanh là ${invL.sxq} ${invL.u2}, chiều cao là ${invL.h} ${invL.u} và chiều rộng là ${invL.w} ${invL.u}. Tính chiều dài của hình hộp chữ nhật đó.`,
      invL.l,
      [invL.l + invL.w, invL.l + 4, invL.l - 3],
      invL.u,
      {
        kind: 'box3d',
        lengthLabel: 'Dài: ?',
        widthLabel: `Rộng: ${invL.w} ${invL.u}`,
        heightLabel: `Cao: ${invL.h} ${invL.u}`,
        extraBadge: `Diện tích xung quanh: ${invL.sxq} ${invL.u2}`
      }
    ),
    buildQuestion(
      9,
      `Người ta làm một chiếc hộp không nắp dạng hình hộp chữ nhật có chiều dài là ${twoStep.l} ${twoStep.u}, chiều rộng là ${twoStep.w} ${twoStep.u} và chiều cao là ${twoStep.h} ${twoStep.u}. Tính diện tích bìa cần dùng để làm chiếc hộp đó (không tính mép dán).`,
      twoStep.ans,
      [2 * (twoStep.l + twoStep.w) * twoStep.h, twoStep.ans + twoStep.l * twoStep.w, twoStep.ans - 100],
      twoStep.u2,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${twoStep.l} ${twoStep.u}`,
        widthLabel: `Rộng: ${twoStep.w} ${twoStep.u}`,
        heightLabel: `Cao: ${twoStep.h} ${twoStep.u}`,
        extraBadge: 'Hộp không nắp (5 mặt)'
      }
    )
  ];
};

// =========================================================================
// 5. LẬP PHƯƠNG THÔNG THÁI (cube_stp)
// =========================================================================
const generateCubeStpSet = (): ArenaQuestion[] => {
  const basic = shuffle([
    { e: 4, u: 'cm', u2: 'cm²' },
    { e: 5, u: 'cm', u2: 'cm²' },
    { e: 7, u: 'dm', u2: 'dm²' },
    { e: 9, u: 'm', u2: 'm²' },
    { e: 6, u: 'cm', u2: 'cm²' }
  ]).slice(0, 3);

  const midDec = shuffle([
    { e: 12.5, u: 'cm', u2: 'cm²' },
    { e: 2.5, u: 'dm', u2: 'dm²' },
    { e: 1.5, u: 'm', u2: 'm²' },
    { e: 11.5, u: 'cm', u2: 'cm²' }
  ]).slice(0, 2);

  const midConv = shuffle([
    { eText: '0,5 m', eNum: 5, targetName: 'đề-xi-mét vuông', u2: 'dm²' },
    { eText: '0,8 m', eNum: 8, targetName: 'đề-xi-mét vuông', u2: 'dm²' },
    { eText: '1,2 dm', eNum: 12, targetName: 'xăng-ti-mét vuông', u2: 'cm²' }
  ]).slice(0, 2);

  const invEdge = pick([
    { e: 7, stp: 294, u: 'cm', u2: 'cm²' },
    { e: 8, stp: 384, u: 'dm', u2: 'dm²' },
    { e: 9, stp: 486, u: 'cm', u2: 'cm²' },
    { e: 12, stp: 864, u: 'cm', u2: 'cm²' }
  ]);

  const sxqToStp = pick([
    { e: 8, sxq: 256, stp: 384, u: 'dm', u2: 'dm²' },
    { e: 10, sxq: 400, stp: 600, u: 'cm', u2: 'cm²' },
    { e: 12, sxq: 576, stp: 864, u: 'cm', u2: 'cm²' }
  ]);

  const fiveFaces = pick([
    { e: 15, ans: 1125, u: 'cm', u2: 'cm²' },
    { e: 14, ans: 980, u: 'dm', u2: 'dm²' },
    { e: 20, ans: 2000, u: 'cm', u2: 'cm²' }
  ]);

  return [
    ...basic.map((item, i) => {
      const ans = item.e * item.e * 6;
      return buildQuestion(
        i,
        `Tính diện tích toàn phần của hình lập phương có độ dài cạnh là ${item.e} ${item.u}.`,
        ans,
        [item.e * item.e * 4, item.e * item.e * item.e, ans + 24],
        item.u2,
        { kind: 'cube3d', edgeLabel: `Cạnh: ${item.e} ${item.u}` }
      );
    }),
    ...midDec.map((item, i) => {
      const ans = item.e * item.e * 6;
      return buildQuestion(
        3 + i,
        `Một khối gỗ hình lập phương có độ dài cạnh là ${formatNum(item.e)} ${item.u}. Tính diện tích toàn phần của khối gỗ đó.`,
        ans,
        [item.e * item.e * 4, item.e * item.e * 5, ans + 12],
        item.u2,
        { kind: 'cube3d', edgeLabel: `Cạnh: ${formatNum(item.e)} ${item.u}` }
      );
    }),
    ...midConv.map((item, i) => {
      const ans = item.eNum * item.eNum * 6;
      return buildQuestion(
        5 + i,
        `Một hình lập phương có độ dài cạnh là ${item.eText}. Tính diện tích toàn phần của hình lập phương đó theo đơn vị ${item.targetName}.`,
        ans,
        [item.eNum * item.eNum * 4, ans / 10, ans + 60],
        item.u2,
        { kind: 'cube3d', edgeLabel: `Cạnh: ${item.eText}` }
      );
    }),
    buildQuestion(
      7,
      `Một hình lập phương có diện tích toàn phần là ${formatNum(invEdge.stp)} ${invEdge.u2}. Tính độ dài cạnh của hình lập phương đó.`,
      invEdge.e,
      [invEdge.e * invEdge.e, invEdge.e + 2, invEdge.e - 2],
      invEdge.u,
      {
        kind: 'cube3d',
        edgeLabel: 'Cạnh: ?',
        extraBadge: `Diện tích toàn phần: ${formatNum(invEdge.stp)} ${invEdge.u2}`
      }
    ),
    buildQuestion(
      8,
      `Một hình lập phương có diện tích xung quanh là ${formatNum(sxqToStp.sxq)} ${sxqToStp.u2}. Tính diện tích toàn phần của hình lập phương đó.`,
      sxqToStp.stp,
      [sxqToStp.sxq / 4, sxqToStp.e * sxqToStp.e * 5, sxqToStp.stp + 64],
      sxqToStp.u2,
      {
        kind: 'cube3d',
        edgeLabel: 'Cạnh: ?',
        extraBadge: `Diện tích xung quanh: ${formatNum(sxqToStp.sxq)} ${sxqToStp.u2}`
      }
    ),
    buildQuestion(
      9,
      `Người ta làm một chiếc hộp không nắp dạng hình lập phương bằng bìa cứng có cạnh là ${fiveFaces.e} ${fiveFaces.u}. Tính diện tích bìa cần dùng để làm chiếc hộp đó.`,
      fiveFaces.ans,
      [fiveFaces.e * fiveFaces.e * 6, fiveFaces.e * fiveFaces.e * 4, fiveFaces.ans + 100],
      fiveFaces.u2,
      {
        kind: 'cube3d',
        edgeLabel: `Cạnh: ${fiveFaces.e} ${fiveFaces.u}`,
        extraBadge: 'Hộp không nắp (5 mặt)'
      }
    )
  ];
};

// =========================================================================
// 6. KIẾN TRÚC SƯ THỂ TÍCH (volume)
// =========================================================================
const generateVolumeSet = (): ArenaQuestion[] => {
  const q1 = pick([
    { l: 8, w: 5, h: 4, u: 'cm', u3: 'cm³' },
    { l: 10, w: 6, h: 5, u: 'dm', u3: 'dm³' },
    { l: 9, w: 4, h: 5, u: 'cm', u3: 'cm³' }
  ]);
  const q2 = pick([
    { e: 5, u: 'cm', u3: 'cm³' },
    { e: 6, u: 'dm', u3: 'dm³' },
    { e: 7, u: 'cm', u3: 'cm³' }
  ]);
  const q3 = pick([
    { l: 12, w: 7, h: 5, u: 'dm', u3: 'dm³' },
    { l: 14, w: 6, h: 5, u: 'cm', u3: 'cm³' }
  ]);

  const q4 = pick([
    { l: 12.5, w: 8, h: 6, u: 'cm', u3: 'cm³' },
    { l: 15.5, w: 12, h: 10, u: 'dm', u3: 'dm³' },
    { l: 2.5, w: 1.6, h: 1.5, u: 'm', u3: 'm³' }
  ]);
  const q5 = pick([
    { e: 12, u: 'cm', u3: 'cm³' },
    { e: 15, u: 'dm', u3: 'dm³' },
    { e: 4.5, u: 'dm', u3: 'dm³' }
  ]);
  const q6 = pick([
    {
      lText: '1,2 m',
      wText: '8 dm',
      hText: '5 dm',
      lNum: 12,
      wNum: 8,
      hNum: 5,
      targetName: 'đề-xi-mét khối',
      u3: 'dm³'
    },
    {
      lText: '1,5 m',
      wText: '10 dm',
      hText: '8 dm',
      lNum: 15,
      wNum: 10,
      hNum: 8,
      targetName: 'đề-xi-mét khối',
      u3: 'dm³'
    }
  ]);
  const q7 = pick([
    {
      lText: '2,5 dm',
      wText: '16 cm',
      hText: '12 cm',
      lNum: 25,
      wNum: 16,
      hNum: 12,
      targetName: 'xăng-ti-mét khối',
      u3: 'cm³'
    },
    {
      lText: '3 dm',
      wText: '15 cm',
      hText: '14 cm',
      lNum: 30,
      wNum: 15,
      hNum: 14,
      targetName: 'xăng-ti-mét khối',
      u3: 'cm³'
    }
  ]);

  const invH = pick([
    { vol: 540, l: 12, w: 9, h: 5, u: 'cm', u3: 'cm³' },
    { vol: 960, l: 16, w: 10, h: 6, u: 'dm', u3: 'dm³' },
    { vol: 1260, l: 15, w: 12, h: 7, u: 'cm', u3: 'cm³' }
  ]);
  const invCube = pick([
    { e: 7, vol: 343, u: 'dm', u3: 'dm³' },
    { e: 8, vol: 512, u: 'cm', u3: 'cm³' },
    { e: 9, vol: 729, u: 'cm', u3: 'cm³' }
  ]);
  const tank = pick([
    { l: 2, w: 1.5, h: 1.2, pct: 75, ans: 2700 },
    { l: 2.5, w: 1.6, h: 1.2, pct: 65, ans: 3120 },
    { l: 2.4, w: 1.5, h: 1.5, pct: 80, ans: 4320 }
  ]);

  return [
    buildQuestion(
      0,
      `Tính thể tích của hình hộp chữ nhật có chiều dài là ${q1.l} ${q1.u}, chiều rộng là ${q1.w} ${q1.u} và chiều cao là ${q1.h} ${q1.u}.`,
      q1.l * q1.w * q1.h,
      [2 * (q1.l + q1.w) * q1.h, q1.l * q1.w * q1.h + 40, q1.l * q1.w + q1.h],
      q1.u3,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${q1.l} ${q1.u}`,
        widthLabel: `Rộng: ${q1.w} ${q1.u}`,
        heightLabel: `Cao: ${q1.h} ${q1.u}`
      }
    ),
    buildQuestion(
      1,
      `Tính thể tích của hình lập phương có độ dài cạnh là ${q2.e} ${q2.u}.`,
      q2.e * q2.e * q2.e,
      [q2.e * q2.e * 6, q2.e * q2.e * 4, q2.e * q2.e * q2.e + 25],
      q2.u3,
      { kind: 'cube3d', edgeLabel: `Cạnh: ${q2.e} ${q2.u}` }
    ),
    buildQuestion(
      2,
      `Tính thể tích của hình hộp chữ nhật có chiều dài là ${q3.l} ${q3.u}, chiều rộng là ${q3.w} ${q3.u} và chiều cao là ${q3.h} ${q3.u}.`,
      q3.l * q3.w * q3.h,
      [2 * (q3.l + q3.w) * q3.h, q3.l * q3.w * q3.h + 60, q3.l * q3.w * q3.h - 40],
      q3.u3,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${q3.l} ${q3.u}`,
        widthLabel: `Rộng: ${q3.w} ${q3.u}`,
        heightLabel: `Cao: ${q3.h} ${q3.u}`
      }
    ),
    buildQuestion(
      3,
      `Một khối hộp chữ nhật có chiều dài là ${formatNum(q4.l)} ${q4.u}, chiều rộng là ${formatNum(q4.w)} ${q4.u} và chiều cao là ${formatNum(q4.h)} ${q4.u}. Tính thể tích của khối hộp đó.`,
      q4.l * q4.w * q4.h,
      [q4.l * q4.w * q4.h + 50, q4.l * q4.w * q4.h / 2, 2 * (q4.l + q4.w) * q4.h],
      q4.u3,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${formatNum(q4.l)} ${q4.u}`,
        widthLabel: `Rộng: ${formatNum(q4.w)} ${q4.u}`,
        heightLabel: `Cao: ${formatNum(q4.h)} ${q4.u}`
      }
    ),
    buildQuestion(
      4,
      `Một khối lập phương có độ dài cạnh là ${formatNum(q5.e)} ${q5.u}. Tính thể tích của khối lập phương đó.`,
      q5.e * q5.e * q5.e,
      [q5.e * q5.e * 6, q5.e * q5.e * 4, q5.e * q5.e * q5.e + 100],
      q5.u3,
      { kind: 'cube3d', edgeLabel: `Cạnh: ${formatNum(q5.e)} ${q5.u}` }
    ),
    buildQuestion(
      5,
      `Một bể chứa hình hộp chữ nhật có chiều dài là ${q6.lText}, chiều rộng là ${q6.wText} và chiều cao là ${q6.hText}. Tính thể tích của bể chứa đó theo đơn vị ${q6.targetName}.`,
      q6.lNum * q6.wNum * q6.hNum,
      [(q6.lNum * q6.wNum * q6.hNum) / 10, q6.lNum * q6.wNum * q6.hNum + 80, q6.lNum * q6.wNum],
      q6.u3,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${q6.lText}`,
        widthLabel: `Rộng: ${q6.wText}`,
        heightLabel: `Cao: ${q6.hText}`
      }
    ),
    buildQuestion(
      6,
      `Một hộp đựng đồ chơi hình hộp chữ nhật có chiều dài là ${q7.lText}, chiều rộng là ${q7.wText} và chiều cao là ${q7.hText}. Tính thể tích chiếc hộp đó theo đơn vị ${q7.targetName}.`,
      q7.lNum * q7.wNum * q7.hNum,
      [(q7.lNum * q7.wNum * q7.hNum) / 10, q7.lNum * q7.wNum * q7.hNum + 400, 2 * (q7.lNum + q7.wNum) * q7.hNum],
      q7.u3,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${q7.lText}`,
        widthLabel: `Rộng: ${q7.wText}`,
        heightLabel: `Cao: ${q7.hText}`
      }
    ),
    buildQuestion(
      7,
      `Một hình hộp chữ nhật có thể tích là ${formatNum(invH.vol)} ${invH.u3}, chiều dài là ${invH.l} ${invH.u} và chiều rộng là ${invH.w} ${invH.u}. Tính chiều cao của hình hộp chữ nhật đó.`,
      invH.h,
      [invH.h + 2, invH.h + 4, invH.h * 2],
      invH.u,
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${invH.l} ${invH.u}`,
        widthLabel: `Rộng: ${invH.w} ${invH.u}`,
        heightLabel: 'Cao: ?',
        extraBadge: `Thể tích: ${formatNum(invH.vol)} ${invH.u3}`
      }
    ),
    buildQuestion(
      8,
      `Một khối lập phương có thể tích là ${formatNum(invCube.vol)} ${invCube.u3}. Tính độ dài cạnh của khối lập phương đó.`,
      invCube.e,
      [invCube.e + 2, invCube.e - 1, invCube.e * 2],
      invCube.u,
      {
        kind: 'cube3d',
        edgeLabel: 'Cạnh: ?',
        extraBadge: `Thể tích: ${formatNum(invCube.vol)} ${invCube.u3}`
      }
    ),
    buildQuestion(
      9,
      `Một bể nước hình hộp chữ nhật có kích thước trong lòng bể là chiều dài ${formatNum(tank.l)} m, chiều rộng ${formatNum(tank.w)} m và chiều cao ${formatNum(tank.h)} m. Hiện lượng nước trong bể chiếm ${tank.pct}% thể tích bể. Hỏi trong bể đang có bao nhiêu lít nước? (Biết 1 lít bằng 1 đề-xi-mét khối)`,
      tank.ans,
      [tank.l * tank.w * tank.h * 1000, tank.ans + 300, tank.ans - 240],
      'lít',
      {
        kind: 'box3d',
        lengthLabel: `Dài: ${formatNum(tank.l)} m`,
        widthLabel: `Rộng: ${formatNum(tank.w)} m`,
        heightLabel: `Cao: ${formatNum(tank.h)} m`,
        extraBadge: `Lượng nước: ${tank.pct}% thể tích bể`
      }
    )
  ];
};

// =========================================================================
// CÁC TRÒ CHƠI KHÁC TRONG ĐẤU TRƯỜNG (CHUẨN HÓA ĐỦ 10 CÂU KHÔNG VIẾT TẮT)
// =========================================================================
const generateOtherArenaSet = (type: GameType): ArenaQuestion[] => {
  switch (type) {
    case 'velocity': {
      const items = [
        { q: 'Một xe máy đi quãng đường dài 90 km hết 2 giờ. Tính vận tốc của xe máy đó.', ans: 45, wrongs: [40, 50, 180], u: 'km/giờ', s: '90 km', t: '2 giờ' },
        { q: 'Một ô tô đi quãng đường dài 180 km hết 3 giờ. Tính vận tốc của ô tô đó.', ans: 60, wrongs: [55, 65, 540], u: 'km/giờ', s: '180 km', t: '3 giờ' },
        { q: 'Một người đi xe đạp đi quãng đường dài 48 km hết 3 giờ. Tính vận tốc của người đi xe đạp.', ans: 16, wrongs: [14, 18, 24], u: 'km/giờ', s: '48 km', t: '3 giờ' },
        { q: 'Một ca nô đi quãng đường dài 67,5 km hết 2 giờ 30 phút. Tính vận tốc của ca nô đó.', ans: 27, wrongs: [25, 29, 30], u: 'km/giờ', s: '67,5 km', t: '2,5 giờ' },
        { q: 'Một ô tô đi quãng đường dài 192 km hết 3 giờ 12 phút. Tính vận tốc của ô tô đó.', ans: 60, wrongs: [56, 62, 64], u: 'km/giờ', s: '192 km', t: '3,2 giờ' },
        { q: 'Một người chạy bộ quãng đường dài 1.500 mét hết 5 phút. Tính vận tốc chạy của người đó theo đơn vị mét/phút.', ans: 300, wrongs: [250, 350, 400], u: 'm/phút', s: '1.500 m', t: '5 phút' },
        { q: 'Một đoàn tàu đi quãng đường dài 162 km trong thời gian 2 giờ 15 phút. Tính vận tốc của đoàn tàu đó.', ans: 72, wrongs: [68, 75, 76], u: 'km/giờ', s: '162 km', t: '2,25 giờ' },
        { q: 'Một xe tải khởi hành từ A lúc 7 giờ và đến B lúc 10 giờ 30 phút, biết quãng đường AB dài 157,5 km. Tính vận tốc của xe tải đó.', ans: 45, wrongs: [42, 48, 52.5], u: 'km/giờ', s: '157,5 km', t: '3,5 giờ' },
        { q: 'Một người đi xe máy trên quãng đường dài 126 km. Sau khi đi với vận tốc đều, người đó đến nơi sớm hơn dự định và hết tổng cộng 2 giờ 48 phút. Tính vận tốc của xe máy đó.', ans: 45, wrongs: [42, 48, 50], u: 'km/giờ', s: '126 km', t: '2,8 giờ' },
        { q: 'Một ô tô đi từ A đến B dài 120 km hết 2 giờ, rồi đi tiếp từ B đến C dài 150 km hết 3 giờ. Tính vận tốc trung bình của ô tô trên cả quãng đường từ A đến C.', ans: 54, wrongs: [55, 52, 56], u: 'km/giờ', s: '270 km', t: '5 giờ' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'motion',
          pointA: 'Điểm A',
          pointB: 'Điểm B',
          topLabel: 'Vận tốc: ?',
          bottomLabel: `Quãng đường: ${it.s} · Thời gian: ${it.t}`
        })
      );
    }

    case 'distance': {
      const items = [
        { q: 'Một ô tô đi với vận tốc 52 km/giờ trong thời gian 3 giờ. Tính quãng đường ô tô đi được.', ans: 156, wrongs: [152, 160, 146], u: 'km', v: '52 km/giờ', t: '3 giờ' },
        { q: 'Một xe máy đi với vận tốc 40 km/giờ trong thời gian 4 giờ. Tính quãng đường xe máy đi được.', ans: 160, wrongs: [120, 180, 150], u: 'km', v: '40 km/giờ', t: '4 giờ' },
        { q: 'Một người đi xe đạp với vận tốc 15 km/giờ trong thời gian 2 giờ. Tính quãng đường người đó đi được.', ans: 30, wrongs: [25, 35, 45], u: 'km', v: '15 km/giờ', t: '2 giờ' },
        { q: 'Một ô tô đi với vận tốc 48,5 km/giờ trong thời gian 3 giờ 30 phút. Tính quãng đường ô tô đã đi.', ans: 169.75, wrongs: [145.5, 165.75, 179.75], u: 'km', v: '48,5 km/giờ', t: '3,5 giờ' },
        { q: 'Một xe máy đi với vận tốc 42 km/giờ trong thời gian 2 giờ 15 phút. Tính quãng đường xe máy đi được.', ans: 94.5, wrongs: [84, 90.5, 96.5], u: 'km', v: '42 km/giờ', t: '2,25 giờ' },
        { q: 'Một vận động viên chạy với vận tốc 240 mét/phút trong thời gian 15 phút. Tính quãng đường chạy được theo đơn vị ki-lô-mét.', ans: 3.6, wrongs: [36, 3.2, 4.2], u: 'km', v: '240 m/phút', t: '15 phút' },
        { q: 'Một ca nô đi với vận tốc 28,4 km/giờ trong thời gian 2 giờ 30 phút. Tính quãng đường ca nô đi được.', ans: 71, wrongs: [68, 74, 56.8], u: 'km', v: '28,4 km/giờ', t: '2,5 giờ' },
        { q: 'Một xe khách xuất phát lúc 6 giờ 30 phút và đến nơi lúc 9 giờ 15 phút với vận tốc 56 km/giờ. Tính độ dài quãng đường xe khách đã đi.', ans: 154, wrongs: [140, 168, 148], u: 'km', v: '56 km/giờ', t: '2,75 giờ' },
        { q: 'Một người đi xe máy khởi hành lúc 7 giờ 15 phút, đến 10 giờ thì tới nơi (dọc đường nghỉ 15 phút). Biết vận tốc xe máy là 44 km/giờ. Tính quãng đường người đó đã đi.', ans: 110, wrongs: [121, 99, 105], u: 'km', v: '44 km/giờ', t: '2,5 giờ chạy' },
        { q: 'Một ô tô đi trong 2 giờ đầu với vận tốc 50 km/giờ, sau đó đi tiếp 1 giờ 30 phút với vận tốc 60 km/giờ. Tính tổng quãng đường ô tô đã đi.', ans: 190, wrongs: [180, 200, 175], u: 'km', v: 'Hai chặng', t: '3,5 giờ' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'motion',
          pointA: 'Điểm A',
          pointB: 'Điểm B',
          topLabel: it.v,
          bottomLabel: `Quãng đường: ? · Thời gian: ${it.t}`
        })
      );
    }

    case 'time': {
      const items = [
        { q: 'Một ô tô đi quãng đường dài 180 km với vận tốc 60 km/giờ. Tính thời gian ô tô đi hết quãng đường đó.', ans: 3, wrongs: [2, 4, 2.5], u: 'giờ', v: '60 km/giờ', s: '180 km' },
        { q: 'Một xe máy đi quãng đường dài 140 km với vận tốc 35 km/giờ. Tính thời gian xe máy đi hết quãng đường đó.', ans: 4, wrongs: [3, 5, 3.5], u: 'giờ', v: '35 km/giờ', s: '140 km' },
        { q: 'Một người đi xe đạp quãng đường dài 36 km với vận tốc 12 km/giờ. Tính thời gian người đó đi hết quãng đường.', ans: 3, wrongs: [2, 4, 3.5], u: 'giờ', v: '12 km/giờ', s: '36 km' },
        { q: 'Một ô tô đi quãng đường dài 192,5 km với vận tốc 55 km/giờ. Tính thời gian ô tô đi hết quãng đường đó.', ans: 3.5, wrongs: [3.2, 3.8, 4], u: 'giờ', v: '55 km/giờ', s: '192,5 km' },
        { q: 'Một ca nô đi quãng đường dài 61,2 km với vận tốc 25,5 km/giờ. Tính thời gian ca nô đi hết quãng đường đó.', ans: 2.4, wrongs: [2.2, 2.5, 2.8], u: 'giờ', v: '25,5 km/giờ', s: '61,2 km' },
        { q: 'Một người đi bộ quãng đường dài 2,7 km với vận tốc 75 mét/phút. Hỏi người đó đi hết quãng đường trong bao nhiêu phút?', ans: 36, wrongs: [32, 40, 45], u: 'phút', v: '75 m/phút', s: '2,7 km' },
        { q: 'Một tàu hỏa đi quãng đường dài 210 km với vận tốc 52,5 km/giờ. Tính thời gian tàu hỏa đi hết quãng đường đó.', ans: 4, wrongs: [3.5, 4.5, 5], u: 'giờ', v: '52,5 km/giờ', s: '210 km' },
        { q: 'Một xe máy đi quãng đường dài 108 km với vận tốc 45 km/giờ, dọc đường người đó dừng nghỉ 15 phút. Tính tổng thời gian cả đi và nghỉ của người đó theo đơn vị phút.', ans: 159, wrongs: [144, 150, 165], u: 'phút', v: '45 km/giờ', s: '108 km' },
        { q: 'Một ô tô đi quãng đường dài 135 km hết tổng thời gian là 2 giờ 30 phút bao gồm 15 phút nghỉ dọc đường. Tính thời gian thực tế ô tô chạy trên đường theo đơn vị giờ.', ans: 2.25, wrongs: [2.5, 2.75, 2], u: 'giờ', v: 'Chạy thực tế', s: '135 km' },
        { q: 'Quãng đường AB dài 150 km. Một ô tô đi nửa quãng đường đầu với vận tốc 50 km/giờ và nửa quãng đường sau với vận tốc 75 km/giờ. Tính tổng thời gian ô tô đi từ A đến B.', ans: 2.5, wrongs: [2.4, 3, 2.8], u: 'giờ', v: 'Hai chặng', s: '150 km' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'motion',
          pointA: 'Điểm A',
          pointB: 'Điểm B',
          topLabel: it.v,
          bottomLabel: `Quãng đường: ${it.s} · Thời gian: ?`
        })
      );
    }

    case 'relative_motion': {
      const items = [
        { q: 'Hai xe đi ngược chiều nhau với vận tốc lần lượt là 45 km/giờ và 35 km/giờ. Tính tổng vận tốc của hai xe.', ans: 80, wrongs: [70, 85, 10], u: 'km/giờ', opp: true, l1: '45 km/giờ', l2: '35 km/giờ', bot: 'Tổng vận tốc: ?' },
        { q: 'Hai xe đi cùng chiều với vận tốc lần lượt là 54 km/giờ và 36 km/giờ. Tính hiệu vận tốc của hai xe.', ans: 18, wrongs: [16, 20, 90], u: 'km/giờ', opp: false, l1: '54 km/giờ', l2: '36 km/giờ', bot: 'Hiệu vận tốc: ?' },
        { q: 'Hai tỉnh A và B cách nhau 180 km. Hai xe xuất phát cùng lúc đi ngược chiều nhau với vận tốc 50 km/giờ và 40 km/giờ. Hỏi sau bao lâu thì hai xe gặp nhau?', ans: 2, wrongs: [3, 1.5, 2.5], u: 'giờ', opp: true, l1: '50 km/giờ', l2: '40 km/giờ', bot: 'AB = 180 km · Gặp nhau sau: ?' },
        { q: 'Quãng đường AB dài 214,5 km. Hai xe khởi hành cùng lúc đi ngược chiều với vận tốc 48,5 km/giờ và 37,3 km/giờ. Sau bao lâu thì hai xe gặp nhau?', ans: 2.5, wrongs: [2.2, 3, 2.8], u: 'giờ', opp: true, l1: '48,5 km/giờ', l2: '37,3 km/giờ', bot: 'AB = 214,5 km · Gặp nhau sau: ?' },
        { q: 'Hai xe xuất phát cùng lúc từ hai điểm cách nhau 60 km đi cùng chiều để đuổi theo nhau. Xe đi sau có vận tốc 55 km/giờ, xe đi trước có vận tốc 40 km/giờ. Sau bao lâu xe sau đuổi kịp xe trước?', ans: 4, wrongs: [3, 5, 2.5], u: 'giờ', opp: false, l1: '55 km/giờ', l2: '40 km/giờ', bot: 'Cách nhau 60 km · Đuổi kịp sau: ?' },
        { q: 'Hai tỉnh cách nhau 225 km. Hai xe đi ngược chiều nhau và gặp nhau sau 2 giờ 30 phút. Biết vận tốc xe thứ nhất là 48 km/giờ. Tính vận tốc của xe thứ hai.', ans: 42, wrongs: [45, 38, 40], u: 'km/giờ', opp: true, l1: '48 km/giờ', l2: 'Vận tốc: ?', bot: 'AB = 225 km · Gặp sau 2,5 giờ' },
        { q: 'Hai người đi bộ ngược chiều nhau xuất phát từ hai điểm cách nhau 13,5 km với vận tốc 4,2 km/giờ và 4,8 km/giờ. Hỏi sau bao nhiêu phút thì hai người gặp nhau?', ans: 90, wrongs: [75, 80, 105], u: 'phút', opp: true, l1: '4,2 km/giờ', l2: '4,8 km/giờ', bot: 'Cách nhau 13,5 km · Gặp sau: ? phút' },
        { q: 'Lúc 7 giờ 15 phút, hai xe xuất phát cùng lúc từ A và B cách nhau 234 km đi ngược chiều với vận tốc 52 km/giờ và 38 km/giờ. Hỏi hai xe gặp nhau sau bao nhiêu giờ?', ans: 2.6, wrongs: [2.4, 2.5, 3], u: 'giờ', opp: true, l1: '52 km/giờ', l2: '38 km/giờ', bot: 'AB = 234 km · Thời gian: ?' },
        { q: 'Một xe máy đi từ A với vận tốc 36 km/giờ. Sau 1 giờ 30 phút, một ô tô đuổi theo từ A với vận tốc 54 km/giờ. Hỏi sau bao lâu kể từ lúc ô tô xuất phát thì ô tô đuổi kịp xe máy?', ans: 3, wrongs: [2.5, 3.5, 4], u: 'giờ', opp: false, l1: 'Ô tô: 54 km/giờ', l2: 'Xe máy trước 1,5 giờ', bot: 'Thời gian đuổi kịp: ?' },
        { q: 'Quãng đường AB dài 240 km. Lúc 6 giờ một ô tô đi từ A với vận tốc 55 km/giờ, cùng lúc một xe máy đi từ B ngược chiều với vận tốc 41 km/giờ. Sau 1 giờ 30 phút, hai xe còn cách nhau bao nhiêu ki-lô-mét?', ans: 96, wrongs: [144, 86, 104], u: 'km', opp: true, l1: '55 km/giờ', l2: '41 km/giờ', bot: 'AB = 240 km · Sau 1,5 giờ còn cách: ?' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'motion',
          pointA: 'Điểm A',
          pointB: 'Điểm B',
          topLabel: it.l1,
          opposite: it.opp,
          secondTopLabel: it.l2,
          bottomLabel: it.bot
        })
      );
    }

    case 'units_convert': {
      const items = [
        { q: 'Đổi đơn vị đo độ dài: 4 km 350 m bằng bao nhiêu mét?', ans: 4350, wrongs: [4035, 435, 43500], u: 'm' },
        { q: 'Đổi đơn vị đo khối lượng: 6 tấn 50 kg bằng bao nhiêu ki-lô-gam?', ans: 6050, wrongs: [6500, 650, 60050], u: 'kg' },
        { q: 'Đổi đơn vị đo diện tích: 5 héc-ta bằng bao nhiêu mét vuông?', ans: 50000, wrongs: [5000, 500, 500000], u: 'm²' },
        { q: 'Viết số thích hợp: 3,45 mét vuông bằng bao nhiêu đề-xi-mét vuông?', ans: 345, wrongs: [34.5, 3450, 3.45], u: 'dm²' },
        { q: 'Viết số thích hợp: 4,08 mét khối bằng bao nhiêu đề-xi-mét khối?', ans: 4080, wrongs: [408, 40800, 480], u: 'dm³' },
        { q: 'Đổi đơn vị thời gian: 2 giờ 45 phút bằng bao nhiêu giờ?', ans: 2.75, wrongs: [2.45, 2.5, 2.8], u: 'giờ' },
        { q: 'Một khu rừng có diện tích 12,5 ki-lô-mét vuông. Diện tích khu rừng đó bằng bao nhiêu héc-ta?', ans: 1250, wrongs: [125, 12500, 12.5], u: 'ha' },
        { q: 'Một xe tải chở 3 tấn 450 kg gạo chia đều vào các bao, mỗi bao 50 kg. Hỏi có tất cả bao nhiêu bao gạo?', ans: 69, wrongs: [65, 70, 79], u: 'bao gạo' },
        { q: 'Một bể chứa có dung tích 2,4 mét khối. Hỏi bể đó chứa được tối đa bao nhiêu lít nước? (Biết 1 lít bằng 1 đề-xi-mét khối)', ans: 2400, wrongs: [240, 24000, 24], u: 'lít' },
        { q: 'Một máy bơm trong 1 giờ 15 phút bơm được 9.000 lít nước. Trung bình mỗi phút máy bơm được bao nhiêu mét khối nước?', ans: 0.12, wrongs: [1.2, 0.15, 0.18], u: 'm³' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'badge_visual',
          title: 'Quy đổi đơn vị đo đại lượng Toán 5',
          subtitle: 'Độ dài · Khối lượng · Diện tích · Thể tích · Thời gian',
          accent: 'teal'
        })
      );
    }

    case 'sum_diff_game': {
      const items = [
        { q: 'Tổng của hai số là 86 và hiệu của hai số đó là 14. Tìm số lớn.', ans: 50, wrongs: [36, 48, 52], u: 'đơn vị', f: 'Tổng = 86 · Hiệu = 14' },
        { q: 'Hai lớp 5A và 5B quyên góp được tất cả 120 quyển vở. Lớp 5A góp nhiều hơn lớp 5B là 18 quyển. Hỏi lớp 5B góp được bao nhiêu quyển vở?', ans: 51, wrongs: [69, 54, 48], u: 'quyển vở', f: 'Tổng = 120 · Hiệu = 18' },
        { q: 'Hai kho chứa tất cả 250 tấn thóc. Kho thứ nhất chứa nhiều hơn kho thứ hai 30 tấn. Hỏi kho thứ nhất chứa bao nhiêu tấn thóc?', ans: 140, wrongs: [110, 130, 145], u: 'tấn', f: 'Tổng = 250 · Hiệu = 30' },
        { q: 'Một khu vườn hình chữ nhật có nửa chu vi là 145 m, chiều dài hơn chiều rộng 27 m. Tính chiều dài khu vườn đó.', ans: 86, wrongs: [59, 82, 88], u: 'm', f: 'Tổng = 145 m · Hiệu = 27 m' },
        { q: 'Tổng số học sinh của hai khối 4 và 5 là 645 học sinh, biết khối 5 ít hơn khối 4 là 35 học sinh. Hỏi khối 5 có bao nhiêu học sinh?', ans: 305, wrongs: [340, 315, 295], u: 'học sinh', f: 'Tổng = 645 · Hiệu = 35' },
        { q: 'Một mảnh đất hình chữ nhật có chu vi là 220 m, chiều dài hơn chiều rộng 24 m. Tính chiều rộng của mảnh đất đó.', ans: 43, wrongs: [67, 98, 45], u: 'm', f: 'Chu vi = 220 m · Hiệu = 24 m' },
        { q: 'Trung bình cộng của hai số là 184,5 và hiệu của hai số là 45. Tìm số lớn.', ans: 207, wrongs: [162, 114.75, 212], u: 'đơn vị', f: 'Trung bình cộng = 184,5 · Hiệu = 45' },
        { q: 'Hai kho chứa 840 tấn gạo. Nếu chuyển 40 tấn từ kho thứ nhất sang kho thứ hai thì hai kho bằng nhau. Hỏi lúc đầu kho thứ nhất có bao nhiêu tấn gạo?', ans: 460, wrongs: [440, 380, 480], u: 'tấn', f: 'Tổng = 840 tấn · Chuyển 40 tấn' },
        { q: 'Hiện nay tổng số tuổi của hai mẹ con là 48 tuổi. Biết mẹ hơn con 26 tuổi. Hỏi 3 năm nữa mẹ bao nhiêu tuổi?', ans: 40, wrongs: [37, 39, 43], u: 'tuổi', f: 'Hiện nay: Tổng = 48 · Hiệu = 26' },
        { q: 'Một mảnh vườn hình chữ nhật có chu vi 180 m, chiều dài hơn chiều rộng 18 m. Tính diện tích mảnh vườn đó.', ans: 1944, wrongs: [1844, 2025, 1984], u: 'm²', f: 'Chu vi = 180 m · Dài − Rộng = 18 m' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'segments',
          label1: 'Số lớn',
          parts1: 4,
          label2: 'Số bé',
          parts2: 3,
          footer: it.f
        })
      );
    }

    case 'ratio_game': {
      const items = [
        { q: 'Tổng của hai số là 90, tỉ số của hai số đó là 2/3. Tìm số bé.', ans: 36, wrongs: [54, 30, 40], u: 'đơn vị', p1: 2, p2: 3, f: 'Tổng = 90 · Tỉ số = 2/3' },
        { q: 'Một trang trại nuôi 140 con gà và vịt, biết số gà bằng 3/4 số vịt. Hỏi trang trại đó nuôi bao nhiêu con gà?', ans: 60, wrongs: [80, 70, 50], u: 'con gà', p1: 3, p2: 4, f: 'Tổng = 140 con · Tỉ số = 3/4' },
        { q: 'Thư viện có 240 quyển sách gồm sách giáo khoa và truyện, biết số sách giáo khoa bằng 3/5 số truyện. Tính số sách giáo khoa.', ans: 90, wrongs: [150, 80, 100], u: 'quyển sách', p1: 3, p2: 5, f: 'Tổng = 240 · Tỉ số = 3/5' },
        { q: 'Một mảnh vườn hình chữ nhật có nửa chu vi là 120 m, chiều rộng bằng 3/5 chiều dài. Tính chiều dài mảnh vườn đó.', ans: 75, wrongs: [45, 70, 80], u: 'm', p1: 3, p2: 5, f: 'Nửa chu vi = 120 m · Tỉ số = 3/5' },
        { q: 'Số học sinh nữ bằng 4/5 số học sinh nam và ít hơn số học sinh nam là 48 em. Hỏi có bao nhiêu học sinh nữ?', ans: 192, wrongs: [240, 160, 200], u: 'học sinh', p1: 4, p2: 5, f: 'Hiệu = 48 em · Tỉ số = 4/5' },
        { q: 'Một hình chữ nhật có chu vi 160 m, chiều rộng bằng 3/5 chiều dài. Tính chiều rộng hình chữ nhật đó.', ans: 30, wrongs: [50, 60, 40], u: 'm', p1: 3, p2: 5, f: 'Chu vi = 160 m · Tỉ số = 3/5' },
        { q: 'Trung bình cộng của hai số là 225, biết số bé bằng 2/3 số lớn. Tìm số lớn.', ans: 270, wrongs: [180, 135, 250], u: 'đơn vị', p1: 2, p2: 3, f: 'Trung bình cộng = 225 · Tỉ số = 2/3' },
        { q: 'Tuổi con bằng 2/7 tuổi bố và kém tuổi bố 30 tuổi. Hỏi 4 năm nữa bố bao nhiêu tuổi?', ans: 46, wrongs: [42, 44, 48], u: 'tuổi', p1: 2, p2: 7, f: 'Hiệu = 30 tuổi · Tỉ số = 2/7' },
        { q: 'Hiệu hai số là 162,4. Biết số lớn gấp 5 lần số bé. Tìm số bé.', ans: 40.6, wrongs: [32.48, 45.6, 203], u: 'đơn vị', p1: 1, p2: 5, f: 'Hiệu = 162,4 · Gấp 5 lần' },
        { q: 'Một mảnh đất hình chữ nhật có nửa chu vi là 96 m, chiều rộng bằng 3/5 chiều dài. Tính diện tích mảnh đất đó.', ans: 2160, wrongs: [2060, 2240, 1860], u: 'm²', p1: 3, p2: 5, f: 'Nửa chu vi = 96 m · Tỉ số = 3/5' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'segments',
          label1: 'Phần 1',
          parts1: it.p1,
          label2: 'Phần 2',
          parts2: it.p2,
          footer: it.f
        })
      );
    }

    case 'fraction_game': {
      const items = [
        { q: 'Tìm 3/4 của 48 ki-lô-gam.', ans: 36, wrongs: [32, 40, 24], u: 'kg' },
        { q: 'Tìm 2/5 của 75 mét vải.', ans: 30, wrongs: [25, 35, 45], u: 'm' },
        { q: 'Một lớp học có 40 học sinh, trong đó 3/5 số học sinh đạt loại Giỏi. Hỏi lớp đó có bao nhiêu học sinh đạt loại Giỏi?', ans: 24, wrongs: [16, 20, 28], u: 'học sinh' },
        { q: 'Một kho chứa 360 tấn gạo. Người ta đã xuất đi 5/9 số gạo đó. Hỏi đã xuất đi bao nhiêu tấn gạo?', ans: 200, wrongs: [160, 180, 220], u: 'tấn' },
        { q: 'Một thùng dầu chứa 180 lít. Lần đầu lấy ra 2/5 số dầu trong thùng. Hỏi trong thùng còn lại bao nhiêu lít dầu?', ans: 108, wrongs: [72, 96, 118], u: 'lít' },
        { q: 'Tìm một số biết 3/7 của số đó bằng 135 tấn.', ans: 315, wrongs: [295, 325, 405], u: 'tấn' },
        { q: 'Một mảnh đất có diện tích 450 m². Người ta dùng 4/9 diện tích để trồng hoa, phần còn lại trồng rau. Tính diện tích phần đất trồng rau.', ans: 250, wrongs: [200, 240, 260], u: 'm²' },
        { q: 'Một cửa hàng nhập 600 kg đường. Buổi sáng bán 1/3 số đường, buổi chiều bán 2/5 số đường ban đầu. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam đường?', ans: 160, wrongs: [200, 240, 180], u: 'kg' },
        { q: 'Một người đọc một cuốn sách dày 320 trang. Ngày đầu đọc 3/8 số trang, ngày thứ hai đọc 2/5 số trang còn lại. Hỏi còn bao nhiêu trang chưa đọc?', ans: 120, wrongs: [140, 100, 160], u: 'trang' },
        { q: 'Một tấm vải dài 120 m. Sau khi bán đi 3/8 tấm vải, người ta chia đều phần vải còn lại thành 5 mảnh bằng nhau. Hỏi mỗi mảnh dài bao nhiêu mét?', ans: 15, wrongs: [12, 18, 20], u: 'm' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'badge_visual',
          title: 'Phân số và bài toán có lời văn',
          subtitle: 'Tìm phân số của một số & Tìm một số biết giá trị phân số',
          accent: 'rose'
        })
      );
    }

    case 'percentage_game': {
      const items = [
        { q: 'Tìm 25% của 120 tấn gạo.', ans: 30, wrongs: [25, 35, 40], u: 'tấn' },
        { q: 'Tìm tỉ số phần trăm của 18 và 60.', ans: 30, wrongs: [25, 35, 40], u: '%' },
        { q: 'Một lớp có 40 học sinh, trong đó có 18 học sinh nữ. Hỏi số học sinh nữ chiếm bao nhiêu phần trăm số học sinh cả lớp?', ans: 45, wrongs: [40, 48, 55], u: '%' },
        { q: 'Một trường tiểu học có 1.200 học sinh, trong đó 55% là học sinh nam. Hỏi trường đó có bao nhiêu học sinh nam?', ans: 660, wrongs: [540, 640, 680], u: 'học sinh' },
        { q: 'Biết 35% số tiền tiết kiệm của Nam là 140.000 đồng. Hỏi tổng số tiền tiết kiệm của Nam là bao nhiêu đồng?', ans: 400000, wrongs: [350000, 450000, 500000], u: 'đồng' },
        { q: 'Một cửa hàng giảm giá 15% cho một chiếc ba lô có giá niêm yết 360.000 đồng. Số tiền được giảm là bao nhiêu đồng?', ans: 54000, wrongs: [48000, 56000, 306000], u: 'đồng' },
        { q: 'Một kho chứa 850 tấn xi măng. Sau khi xuất đi 40% lượng xi măng, trong kho còn lại bao nhiêu tấn xi măng?', ans: 510, wrongs: [340, 490, 520], u: 'tấn' },
        { q: 'Một xưởng may dự định may 1.500 bộ quần áo nhưng thực tế đã may được 1.725 bộ. Xưởng may đã vượt mức kế hoạch bao nhiêu phần trăm?', ans: 15, wrongs: [12, 18, 25], u: '%' },
        { q: 'Một người gửi tiết kiệm 20.000.000 đồng với lãi suất 0,6% một tháng. Sau một tháng người đó nhận được cả vốn lẫn lãi là bao nhiêu đồng?', ans: 20120000, wrongs: [20100000, 20150000, 21200000], u: 'đồng' },
        { q: 'Giá một chiếc xe đạp là 2.000.000 đồng. Tháng trước tăng giá 10%, tháng này giảm giá 10% so với giá tháng trước. Giá chiếc xe đạp hiện nay là bao nhiêu đồng?', ans: 1980000, wrongs: [2000000, 1960000, 2020000], u: 'đồng' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'badge_visual',
          title: 'Tỉ số phần trăm thực tế',
          subtitle: 'Tìm tỉ số % · Tìm giá trị % · Lãi suất & Giảm giá',
          accent: 'amber'
        })
      );
    }

    case 'stats_game':
    default: {
      const items = [
        { q: 'Trường có 400 học sinh, trong đó 35% tham gia câu lạc bộ Thể thao. Hỏi có bao nhiêu học sinh tham gia câu lạc bộ Thể thao?', ans: 140, wrongs: [120, 150, 160], u: 'học sinh' },
        { q: 'Một hộp có 200 viên bi gồm bi đỏ, bi xanh và bi vàng. Biết bi đỏ chiếm 40% và bi xanh chiếm 35%. Hỏi có bao nhiêu viên bi vàng?', ans: 50, wrongs: [40, 60, 75], u: 'viên bi' },
        { q: 'Tung một đồng xu 100 lần, thấy mặt ngửa xuất hiện 54 lần. Hỏi mặt sấp xuất hiện bao nhiêu lần?', ans: 46, wrongs: [44, 54, 48], u: 'lần' },
        { q: 'Thư viện cho mượn sách trong 4 quý lần lượt là 320, 410, 380 và 490 quyển sách. Tính tổng số sách đã cho mượn trong cả năm.', ans: 1600, wrongs: [1500, 1580, 1620], u: 'quyển sách' },
        { q: 'Khảo sát 1.200 học sinh: 45% thích Bóng đá, 25% thích Cầu lông, còn lại thích Bơi lội. Hỏi số học sinh thích Bơi lội là bao nhiêu em?', ans: 360, wrongs: [300, 420, 540], u: 'học sinh' },
        { q: 'Gieo một con xúc xắc 250 lần, trong đó mặt 6 chấm xuất hiện 45 lần. Tính tỉ số phần trăm số lần xuất hiện mặt 6 chấm so với tổng số lần gieo.', ans: 18, wrongs: [16, 20, 22], u: '%' },
        { q: 'Một nông trại thu hoạch được 450 kg xoài, chiếm 30% tổng sản lượng hoa quả của nông trại. Tính tổng sản lượng hoa quả của nông trại đó.', ans: 1500, wrongs: [1350, 1600, 1800], u: 'kg' },
        { q: 'Quay vòng quay may mắn 300 lần, tỉ số số lần kim chỉ vào ô trúng thưởng là 7/20. Hỏi có bao nhiêu lần kim chỉ vào ô không trúng thưởng?', ans: 195, wrongs: [105, 185, 205], u: 'lần' },
        { q: 'Biểu đồ cột ghi lượng mưa tháng 8 là 320 mm và tháng 9 là 400 mm. Hỏi lượng mưa tháng 9 tăng thêm bao nhiêu phần trăm so với tháng 8?', ans: 25, wrongs: [20, 30, 80], u: '%' },
        { q: 'Kiểm tra 500 sản phẩm của nhà máy thấy có 15 sản phẩm lỗi. Theo tỉ lệ đó, nếu kiểm tra 2.000 sản phẩm cùng loại thì ước tính có bao nhiêu sản phẩm đạt chuẩn?', ans: 1940, wrongs: [1920, 1950, 1960], u: 'sản phẩm' }
      ];
      return items.map((it, idx) =>
        buildQuestion(idx, it.q, it.ans, it.wrongs, it.u, {
          kind: 'badge_visual',
          title: 'Thống kê & Tỉ số xác suất',
          subtitle: 'Đọc số liệu biểu đồ · So sánh tỉ lệ · Tần suất sự kiện',
          accent: 'violet'
        })
      );
    }
  }
};

export const generateArenaSession = (type: GameType): ArenaQuestion[] => {
  switch (type) {
    case 'tri_area':
      return generateTriAreaSet();
    case 'trap_area':
      return generateTrapAreaSet();
    case 'circle_area':
      return generateCircleSet();
    case 'rect_sxq':
      return generateRectSxqSet();
    case 'cube_stp':
      return generateCubeStpSet();
    case 'volume':
      return generateVolumeSet();
    default:
      return generateOtherArenaSet(type);
  }
};
