import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Info, 
  RefreshCw, 
  Layers, 
  MousePointer2, 
  LayoutTemplate, 
  Tag, 
  Sparkles, 
  Edit3, 
  CheckCircle2, 
  HelpCircle, 
  Shapes, 
  RotateCcw, 
  Check, 
  XCircle, 
  Lightbulb, 
  ArrowRight,
  MoveHorizontal,
  Ruler,
  Scissors,
  Play,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { ShapeType } from '../types';
import MascotCompanion from './MascotCompanion';

// Số liệu ban đầu mặc định của từng hình
const INITIAL_2D_PARAMS = {
  triangle: { base: 12, height: 8 },
  trapezoid: { base: 12, height: 8, baseSmall: 8 },
  circle: { radius: 5 }
};

const CIRCLE_SLICE_OPTIONS = [4, 8, 16, 32, 64] as const;

// Component hiển thị phân số chuẩn Toán học
const Fraction: React.FC<{ num: React.ReactNode; den: React.ReactNode; className?: string }> = ({ num, den, className = "" }) => (
  <div className={`inline-flex flex-col items-center align-middle ${className}`}>
    <div className="px-1.5 font-bold">{num}</div>
    <div className="w-full h-[2px] bg-current rounded-full my-0.5"></div>
    <div className="px-1.5 font-bold">{den}</div>
  </div>
);

// Cấu hình tọa độ cân đối tuyệt đối trong SVG viewBox="0 0 760 460"
// Tâm viewBox: (380, 230)
const getShapeConfig = (shape: ShapeType, mode: number) => {
  if (shape === 'triangle') {
    if (mode === 1) {
      // 1. Tam giác nhọn
      return {
        originX: 280,
        originY: 325,
        baseWidth: 200,
        heightPx: 160,
        apexX: 130,
        apexY: -160,
        points: "0,0 200,0 130,-160",
        leftPiecePoints: "0,0 130,-160 0,-160",
        rightPiecePoints: "200,0 200,-160 130,-160",
        leftInitOffset: { x: -165, y: 0 },
        rightInitOffset: { x: 115, y: 0 },
        needsTwoPieces: true,
        targetDX: 0,
        targetDY: 0,
        separatedPos1: { x: 280, y: 325 },
        separatedPos2: { x: 280, y: 325 },
        snappedPos1: { x: 280, y: 325 },
        snappedPos2: { x: 280, y: 325 },
        altitudeX: 130,
        altitudeBottomX: 130,
        isAltitudeOutside: false
      };
    }
    if (mode === 2) {
      // 2. Tam giác tù (chiều cao rơi ra ngoài cạnh đáy)
      return {
        originX: 310,
        originY: 325,
        baseWidth: 190,
        heightPx: 160,
        apexX: -60,
        apexY: -160,
        points: "0,0 190,0 -60,-160",
        leftPiecePoints: "",
        rightPiecePoints: "190,0 130,-160 -60,-160",
        leftInitOffset: { x: 0, y: 0 },
        rightInitOffset: { x: 105, y: -20 },
        needsTwoPieces: false,
        targetDX: 0,
        targetDY: 0,
        separatedPos1: { x: 310, y: 325 },
        separatedPos2: { x: 310, y: 325 },
        snappedPos1: { x: 310, y: 325 },
        snappedPos2: { x: 310, y: 325 },
        altitudeX: -60,
        altitudeBottomX: -60,
        isAltitudeOutside: true
      };
    }
    if (mode === 3) {
      // 3. Tam giác vuông
      return {
        originX: 280,
        originY: 325,
        baseWidth: 200,
        heightPx: 160,
        apexX: 0,
        apexY: -160,
        points: "0,0 200,0 0,-160",
        leftPiecePoints: "",
        rightPiecePoints: "200,0 200,-160 0,-160",
        leftInitOffset: { x: 0, y: 0 },
        rightInitOffset: { x: 120, y: -15 },
        needsTwoPieces: false,
        targetDX: 0,
        targetDY: 0,
        separatedPos1: { x: 280, y: 325 },
        separatedPos2: { x: 280, y: 325 },
        snappedPos1: { x: 280, y: 325 },
        snappedPos2: { x: 280, y: 325 },
        altitudeX: 0,
        altitudeBottomX: 0,
        isAltitudeOutside: false
      };
    }
    // 4. Tam giác đều (cạnh 200px, chiều cao ~ 173px)
    return {
      originX: 280,
      originY: 330,
      baseWidth: 200,
      heightPx: 173,
      apexX: 100,
      apexY: -173,
      points: "0,0 200,0 100,-173",
      leftPiecePoints: "0,0 100,-173 0,-173",
      rightPiecePoints: "200,0 200,-173 100,-173",
      leftInitOffset: { x: -150, y: 0 },
      rightInitOffset: { x: 130, y: 0 },
      needsTwoPieces: true,
      targetDX: 0,
      targetDY: 0,
      separatedPos1: { x: 280, y: 330 },
      separatedPos2: { x: 280, y: 330 },
      snappedPos1: { x: 280, y: 330 },
      snappedPos2: { x: 280, y: 330 },
      altitudeX: 100,
      altitudeBottomX: 100,
      isAltitudeOutside: false
    };
  }

  if (shape === 'trapezoid') {
    if (mode === 1) {
      // 1. Hình thang thường: tách bằng 2 đường cao thành 1 Hình chữ nhật + 2 Tam giác vuông
      // Gốc tọa độ (245, 325): A=(0,0), B=(250,0), C=(200,-160), D=(50,-160)
      return {
        originX: 245,
        originY: 325,
        baseWidth: 250,
        smallBaseWidth: 150,
        heightPx: 160,
        points: "0,0 250,0 200,-160 50,-160",
        leftAltX: 50,
        rightAltX: 200,
        rectPoints: "50,0 200,0 200,-160 50,-160",
        triLeftPoints: "0,0 50,0 50,-160",
        triRightPoints: "200,0 250,0 200,-160",
        targetRectOffset: { x: -230, y: 0 },     // [295..445] -> [65..215]
        targetTriLeftOffset: { x: 280, y: 0 },   // [245..295] -> [525..575]
        targetTriRightOffset: { x: 130, y: 0 },  // [445..495] -> [575..625]
        targetDX: 0,
        targetDY: 0,
        separatedPos1: { x: 245, y: 325 },
        separatedPos2: { x: 245, y: 325 },
        snappedPos1: { x: 245, y: 325 },
        snappedPos2: { x: 245, y: 325 },
        altitudeX: 50,
        altitudeBottomX: 50,
        isAltitudeOutside: false
      };
    }
    // 2. Hình thang vuông: góc vuông tại A và D; kẻ 1 đường cao từ C xuống đáy tách thành 1 Hình chữ nhật + 1 Tam giác vuông
    // Gốc tọa độ (245, 325): A=(0,0), B=(250,0), C=(150,-160), D=(0,-160)
    return {
      originX: 245,
      originY: 325,
      baseWidth: 250,
      smallBaseWidth: 150,
      heightPx: 160,
      points: "0,0 250,0 150,-160 0,-160",
      leftAltX: 0,
      rightAltX: 150,
      rectPoints: "0,0 150,0 150,-160 0,-160",
      triLeftPoints: "",
      triRightPoints: "150,0 250,0 150,-160",
      targetRectOffset: { x: -180, y: 0 },     // [245..395] -> [65..215]
      targetTriLeftOffset: { x: 0, y: 0 },
      targetTriRightOffset: { x: 130, y: 0 },  // [395..495] -> [525..625]
      targetDX: 0,
      targetDY: 0,
      separatedPos1: { x: 245, y: 325 },
      separatedPos2: { x: 245, y: 325 },
      snappedPos1: { x: 245, y: 325 },
      snappedPos2: { x: 245, y: 325 },
      altitudeX: 150,
      altitudeBottomX: 150,
      isAltitudeOutside: false
    };
  }

  // Hình tròn mặc định
  return {
    points: "",
    targetDX: 0,
    targetDY: 0,
    separatedPos1: { x: 380, y: 230 },
    separatedPos2: { x: 380, y: 230 },
    snappedPos1: { x: 380, y: 230 },
    snappedPos2: { x: 380, y: 230 },
    altitudeX: 0,
    altitudeBottomX: 0,
    isAltitudeOutside: false
  };
};

const Shape2DPanel: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('triangle');
  const [demoMode, setDemoMode] = useState<1 | 2 | 3 | 4>(1); 
  const [params, setParams] = useState({
    base: 12,
    height: 8,
    baseSmall: 8,
    radius: 5,
    unit: 'cm'
  });
  
  // Trạng thái cho bảng giải tương tác khi học sinh đổi số đo
  const [userAreaInput, setUserAreaInput] = useState('');
  const [userCircumInput, setUserCircumInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  const containerRef = useRef<SVGSVGElement>(null);

  // --- Trạng thái riêng cho Hình tam giác: Người dùng tự kẻ chiều cao + Kéo thả ghép thành Hình chữ nhật ---
  const [isAltitudeDrawn, setIsAltitudeDrawn] = useState(false);
  const [isDrawingAltitude, setIsDrawingAltitude] = useState(false);
  const [isClickDrawMode, setIsClickDrawMode] = useState(false);
  const [drawPt, setDrawPt] = useState<{ x: number; y: number } | null>(null);
  const [drawHint, setDrawHint] = useState<string | null>(null);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);

  // Trạng thái các mảnh ghép tam giác thành hình chữ nhật
  const [leftPieceOffset, setLeftPieceOffset] = useState({ x: -165, y: 0 });
  const [rightPieceOffset, setRightPieceOffset] = useState({ x: 115, y: 0 });
  const [leftPieceSnapped, setLeftPieceSnapped] = useState(false);
  const [rightPieceSnapped, setRightPieceSnapped] = useState(false);
  // Bước 3 cho Tam giác tù: kéo phần nhô bên trái sang phải thành hình chữ nhật
  const [obtuseShiftOffset, setObtuseShiftOffset] = useState({ x: 0, y: 0 });
  const [obtuseShifted, setObtuseShifted] = useState(false);
  const [activeTriPiece, setActiveTriPiece] = useState<'left' | 'right' | 'obtuseShift' | null>(null);
  const triDragOffset = useRef({ x: 0, y: 0 });

  // --- Trạng thái riêng cho Hình thang: Tự kẻ chiều cao + Chia thành Hình chữ nhật & Tam giác vuông ---
  const [trapLeftAltDrawn, setTrapLeftAltDrawn] = useState(false);
  const [trapRightAltDrawn, setTrapRightAltDrawn] = useState(false);
  const [activeTrapApex, setActiveTrapApex] = useState<'left' | 'right' | null>(null);
  const [trapClickApex, setTrapClickApex] = useState<'left' | 'right' | null>(null);
  const [trapDrawPt, setTrapDrawPt] = useState<{ x: number; y: number } | null>(null);
  const [trapDrawHint, setTrapDrawHint] = useState<string | null>(null);
  const trapDrawStartRef = useRef<{ x: number; y: number } | null>(null);

  const [trapRectOffset, setTrapRectOffset] = useState({ x: 0, y: 0 });
  const [trapTriLeftOffset, setTrapTriLeftOffset] = useState({ x: 0, y: 0 });
  const [trapTriRightOffset, setTrapTriRightOffset] = useState({ x: 0, y: 0 });
  const [trapRectSnapped, setTrapRectSnapped] = useState(false);
  const [trapTriLeftSnapped, setTrapTriLeftSnapped] = useState(false);
  const [trapTriRightSnapped, setTrapTriRightSnapped] = useState(false);
  const [activeTrapPiece, setActiveTrapPiece] = useState<'rect' | 'triLeft' | 'triRight' | null>(null);
  const trapDragOffset = useRef({ x: 0, y: 0 });

  // --- Trạng thái riêng cho Hình tròn: Khám phá Diện tích (cắt 4/8/16/32/64 phần ghép hình chữ nhật) ---
  const [circleSliceIdx, setCircleSliceIdx] = useState<number>(2); // mặc định 16 phần (mốc index 2)
  const [circleMergeProgress, setCircleMergeProgress] = useState<number>(0); // 0% -> 100%
  const [isCircleAnimating, setIsCircleAnimating] = useState<boolean>(false);
  const [showCircleHints, setShowCircleHints] = useState<boolean>(true);
  const [showCircleFormulaModal, setShowCircleFormulaModal] = useState<boolean>(false);
  const circleSlices = CIRCLE_SLICE_OPTIONS[circleSliceIdx] ?? 16;

  // Kiểm tra xem hiện tại có phải số liệu ban đầu (mặc định) hay không
  const isInitialData = () => {
    if (selectedShape === 'triangle') {
      return params.base === INITIAL_2D_PARAMS.triangle.base && params.height === INITIAL_2D_PARAMS.triangle.height;
    }
    if (selectedShape === 'trapezoid') {
      return (
        params.base === INITIAL_2D_PARAMS.trapezoid.base &&
        params.height === INITIAL_2D_PARAMS.trapezoid.height &&
        params.baseSmall === INITIAL_2D_PARAMS.trapezoid.baseSmall
      );
    }
    if (selectedShape === 'circle') {
      return params.radius === INITIAL_2D_PARAMS.circle.radius;
    }
    return false;
  };

  // Khôi phục lại số liệu gốc ban đầu
  const resetToInitialData = () => {
    setParams(prev => ({
      ...prev,
      base: 12,
      height: 8,
      baseSmall: 8,
      radius: 5
    }));
    setUserAreaInput('');
    setUserCircumInput('');
    setPracticeResult(null);
    resetPuzzle();
  };

  // Cập nhật vị trí khi đổi hình hoặc chế độ
  useEffect(() => {
    const cfg = getShapeConfig(selectedShape, demoMode);

    // Reset trạng thái khám phá Hình tam giác
    setIsAltitudeDrawn(false);
    setIsDrawingAltitude(false);
    setIsClickDrawMode(false);
    setDrawPt(null);
    setDrawHint(null);
    setLeftPieceOffset(cfg.leftInitOffset || { x: -165, y: 0 });
    setRightPieceOffset(cfg.rightInitOffset || { x: 115, y: 0 });
    setLeftPieceSnapped(false);
    setRightPieceSnapped(false);
    setObtuseShiftOffset({ x: 0, y: 0 });
    setObtuseShifted(false);
    setActiveTriPiece(null);

    // Reset trạng thái khám phá Hình thang
    setTrapLeftAltDrawn(selectedShape === 'trapezoid' && demoMode === 2);
    setTrapRightAltDrawn(false);
    setActiveTrapApex(null);
    setTrapClickApex(null);
    setTrapDrawPt(null);
    setTrapDrawHint(null);
    setTrapRectOffset({ x: 0, y: 0 });
    setTrapTriLeftOffset({ x: 0, y: 0 });
    setTrapTriRightOffset({ x: 0, y: 0 });
    setTrapRectSnapped(false);
    setTrapTriLeftSnapped(false);
    setTrapTriRightSnapped(false);
    setActiveTrapPiece(null);

    // Reset trạng thái khám phá Hình tròn
    setIsCircleAnimating(false);
    setShowCircleFormulaModal(false);
    if (selectedShape !== 'circle' || demoMode === 1) {
      setCircleMergeProgress(0);
    }
  }, [selectedShape, demoMode]);

  // Animation mượt 0% <-> 100% khi bấm nút "Cắt và ghép thành hình mới"
  useEffect(() => {
    if (!isCircleAnimating) return;
    let rafId: number;
    let startTime: number | null = null;
    const startVal = circleMergeProgress;
    const targetVal = startVal >= 99 ? 0 : 100;
    const duration = Math.max(450, Math.abs(targetVal - startVal) * 14);

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const ratio = Math.min(1, elapsed / duration);
      const nextVal = Math.round(startVal + (targetVal - startVal) * ratio);
      setCircleMergeProgress(nextVal);
      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsCircleAnimating(false);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isCircleAnimating]);

  const calculateArea = () => {
    switch (selectedShape) {
      case 'triangle': return (params.base * params.height) / 2;
      case 'trapezoid': return ((params.base + params.baseSmall) * params.height) / 2;
      case 'circle': return Number((params.radius * params.radius * 3.14).toFixed(2));
      default: return 0;
    }
  };

  const calculateCircumference = () => {
    if (selectedShape === 'circle') {
      return Number((params.radius * 2 * 3.14).toFixed(2));
    }
    return 0;
  };

  // Chuyển đổi tọa độ con trỏ (Mouse/Touch) sang đúng hệ tọa độ SVG viewBox
  const getSVGPoint = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return null;
    const svg = containerRef.current;
    const pt = svg.createSVGPoint();
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else {
      pt.x = (e as React.MouseEvent).clientX;
      pt.y = (e as React.MouseEvent).clientY;
    }
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const isTriangleRectComplete =
    selectedShape === 'triangle' &&
    isAltitudeDrawn &&
    (demoMode === 1 || demoMode === 4
      ? leftPieceSnapped && rightPieceSnapped
      : demoMode === 3
        ? rightPieceSnapped
        : rightPieceSnapped && obtuseShifted);

  const isTrapAltComplete =
    selectedShape === 'trapezoid' &&
    (demoMode === 1 ? trapLeftAltDrawn && trapRightAltDrawn : trapRightAltDrawn);

  const isTrapExploreComplete =
    isTrapAltComplete &&
    trapRectSnapped &&
    trapTriRightSnapped &&
    (demoMode === 1 ? trapTriLeftSnapped : true);

  // Xử lý kéo thả vẽ chiều cao và ghép mảnh cho Hình tam giác
  const handleApexPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedShape !== 'triangle' || isAltitudeDrawn) return;
    e.stopPropagation();
    const pt = getSVGPoint(e);
    if (!pt) return;
    const cfg = getShapeConfig('triangle', demoMode);
    const apexSvgX = (cfg.originX ?? 280) + (cfg.apexX ?? 130);
    const apexSvgY = (cfg.originY ?? 325) + (cfg.apexY ?? -160);
    drawStartRef.current = { x: pt.x, y: pt.y };
    setIsDrawingAltitude(true);
    setDrawPt({ x: apexSvgX, y: apexSvgY });
    setDrawHint(null);
  };

  const handleTriPiecePointerDown = (
    piece: 'left' | 'right' | 'obtuseShift',
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (selectedShape !== 'triangle' || !isAltitudeDrawn) return;
    if (piece === 'left' && leftPieceSnapped) return;
    if (piece === 'right' && rightPieceSnapped) return;
    if (piece === 'obtuseShift' && (!rightPieceSnapped || obtuseShifted)) return;
    e.stopPropagation();
    const pt = getSVGPoint(e);
    if (!pt) return;

    const currentOffset =
      piece === 'left'
        ? leftPieceOffset
        : piece === 'right'
          ? rightPieceOffset
          : obtuseShiftOffset;

    setActiveTriPiece(piece);
    triDragOffset.current = {
      x: pt.x - currentOffset.x,
      y: pt.y - currentOffset.y
    };
  };

  // Xử lý kéo thả vẽ chiều cao & tách mảnh cho Hình thang
  const handleTrapApexPointerDown = (
    side: 'left' | 'right',
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (selectedShape !== 'trapezoid') return;
    if (side === 'left' && (demoMode === 2 || trapLeftAltDrawn)) return;
    if (side === 'right' && trapRightAltDrawn) return;
    e.stopPropagation();
    const pt = getSVGPoint(e);
    if (!pt) return;

    const cfg = getShapeConfig('trapezoid', demoMode);
    const ox = cfg.originX ?? 245;
    const oy = cfg.originY ?? 325;
    const hp = cfg.heightPx ?? 160;
    const apexLocalX = side === 'left' ? (cfg.leftAltX ?? 50) : (cfg.rightAltX ?? 200);
    trapDrawStartRef.current = { x: pt.x, y: pt.y };
    setActiveTrapApex(side);
    setTrapClickApex(null);
    setTrapDrawPt({ x: ox + apexLocalX, y: oy - hp });
    setTrapDrawHint(null);
  };

  const handleTrapPiecePointerDown = (
    piece: 'rect' | 'triLeft' | 'triRight',
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (selectedShape !== 'trapezoid' || !isTrapAltComplete) return;
    if (piece === 'rect' && trapRectSnapped) return;
    if (piece === 'triLeft' && (demoMode === 2 || trapTriLeftSnapped)) return;
    if (piece === 'triRight' && trapTriRightSnapped) return;
    e.stopPropagation();
    const pt = getSVGPoint(e);
    if (!pt) return;

    const currentOffset =
      piece === 'rect'
        ? trapRectOffset
        : piece === 'triLeft'
          ? trapTriLeftOffset
          : trapTriRightOffset;

    setActiveTrapPiece(piece);
    trapDragOffset.current = {
      x: pt.x - currentOffset.x,
      y: pt.y - currentOffset.y
    };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Click-to-drop chân đường cao Hình tam giác
    if (selectedShape === 'triangle' && !isAltitudeDrawn && isClickDrawMode) {
      const pt = getSVGPoint(e);
      if (!pt) return;
      const cfg = getShapeConfig('triangle', demoMode);
      const footSvgX = (cfg.originX ?? 280) + cfg.altitudeX;
      const footSvgY = cfg.originY ?? 325;
      if (Math.abs(pt.x - footSvgX) <= 36 && Math.abs(pt.y - footSvgY) <= 45) {
        setIsAltitudeDrawn(true);
        setIsDrawingAltitude(false);
        setIsClickDrawMode(false);
        setDrawPt(null);
        setDrawHint(null);
      } else {
        setDrawHint('Hãy bấm vào vị trí vuông góc (90°) trên đường đáy để hạ đường cao!');
      }
      return;
    }

    // Click-to-drop chân đường cao Hình thang
    if (selectedShape === 'trapezoid' && trapClickApex && !isTrapAltComplete) {
      const pt = getSVGPoint(e);
      if (!pt) return;
      const cfg = getShapeConfig('trapezoid', demoMode);
      const ox = cfg.originX ?? 245;
      const oy = cfg.originY ?? 325;
      const footLocalX = trapClickApex === 'left' ? (cfg.leftAltX ?? 50) : (cfg.rightAltX ?? 200);
      const footSvgX = ox + footLocalX;
      const footSvgY = oy;
      if (Math.abs(pt.x - footSvgX) <= 36 && Math.abs(pt.y - footSvgY) <= 45) {
        if (trapClickApex === 'left') setTrapLeftAltDrawn(true);
        else setTrapRightAltDrawn(true);
        setActiveTrapApex(null);
        setTrapClickApex(null);
        setTrapDrawPt(null);
        setTrapDrawHint(null);
      } else {
        setTrapDrawHint('Hãy bấm đúng điểm vuông góc (90°) trên đáy lớn để hoàn tất đường cao!');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    // 1. Kéo kẻ đường cao hình tam giác
    if (selectedShape === 'triangle' && (isDrawingAltitude || isClickDrawMode) && !isAltitudeDrawn) {
      const pt = getSVGPoint(e);
      if (pt) {
        setDrawPt({
          x: Math.max(40, Math.min(pt.x, 720)),
          y: Math.max(60, Math.min(pt.y, 410))
        });
      }
      return;
    }

    // 2. Kéo ghép mảnh hình tam giác thành hình chữ nhật
    if (selectedShape === 'triangle' && activeTriPiece) {
      const pt = getSVGPoint(e);
      if (!pt) return;
      const newOffset = {
        x: Math.max(-240, Math.min(pt.x - triDragOffset.current.x, 260)),
        y: Math.max(-120, Math.min(pt.y - triDragOffset.current.y, 100))
      };
      if (activeTriPiece === 'left') setLeftPieceOffset(newOffset);
      else if (activeTriPiece === 'right') setRightPieceOffset(newOffset);
      else if (activeTriPiece === 'obtuseShift') setObtuseShiftOffset(newOffset);
      return;
    }

    // 3. Kéo kẻ đường cao hình thang
    if (selectedShape === 'trapezoid' && (activeTrapApex || trapClickApex) && !isTrapAltComplete) {
      const pt = getSVGPoint(e);
      if (pt) {
        setTrapDrawPt({
          x: Math.max(40, Math.min(pt.x, 720)),
          y: Math.max(60, Math.min(pt.y, 410))
        });
      }
      return;
    }

    // 4. Kéo ghép mảnh hình thang (Hình chữ nhật + Tam giác vuông)
    if (selectedShape === 'trapezoid' && activeTrapPiece) {
      const pt = getSVGPoint(e);
      if (!pt) return;
      const newOffset = {
        x: Math.max(-290, Math.min(pt.x - trapDragOffset.current.x, 340)),
        y: Math.max(-140, Math.min(pt.y - trapDragOffset.current.y, 100))
      };
      if (activeTrapPiece === 'rect') setTrapRectOffset(newOffset);
      else if (activeTrapPiece === 'triLeft') setTrapTriLeftOffset(newOffset);
      else if (activeTrapPiece === 'triRight') setTrapTriRightOffset(newOffset);
    }
  };

  const handleMouseUp = () => {
    // 1. Hoàn tất thao tác kẻ đường cao hình tam giác
    if (selectedShape === 'triangle' && isDrawingAltitude && !isAltitudeDrawn) {
      const cfg = getShapeConfig('triangle', demoMode);
      const footSvgX = (cfg.originX ?? 280) + cfg.altitudeX;
      const footSvgY = cfg.originY ?? 325;

      const movedDist =
        drawStartRef.current && drawPt
          ? Math.hypot(drawPt.x - drawStartRef.current.x, drawPt.y - drawStartRef.current.y)
          : 0;

      if (movedDist < 10) {
        setIsDrawingAltitude(false);
        setIsClickDrawMode(true);
        setDrawHint('Đã chọn đỉnh! Bây giờ hãy bấm vào vị trí vuông góc trên đường cạnh đáy.');
        return;
      }

      if (drawPt && Math.abs(drawPt.x - footSvgX) <= 34 && Math.abs(drawPt.y - footSvgY) <= 45) {
        setIsAltitudeDrawn(true);
        setIsDrawingAltitude(false);
        setIsClickDrawMode(false);
        setDrawPt(null);
        setDrawHint(null);
      } else {
        setIsDrawingAltitude(false);
        setIsClickDrawMode(false);
        setDrawPt(null);
        setDrawHint('Hãy kéo thẳng đứng từ đỉnh xuống vuông góc với đường đáy (90°) nhé!');
      }
      return;
    }

    // 2. Bắt dính nam châm mảnh ghép hình tam giác -> hình chữ nhật
    if (selectedShape === 'triangle' && activeTriPiece) {
      const cfg = getShapeConfig('triangle', demoMode);
      if (activeTriPiece === 'left') {
        if (Math.hypot(leftPieceOffset.x, leftPieceOffset.y) < 55) {
          setLeftPieceOffset({ x: 0, y: 0 });
          setLeftPieceSnapped(true);
        }
      } else if (activeTriPiece === 'right') {
        if (Math.hypot(rightPieceOffset.x, rightPieceOffset.y) < 55) {
          setRightPieceOffset({ x: 0, y: 0 });
          setRightPieceSnapped(true);
        }
      } else if (activeTriPiece === 'obtuseShift') {
        const targetShiftX = cfg.baseWidth ?? 190;
        if (Math.hypot(obtuseShiftOffset.x - targetShiftX, obtuseShiftOffset.y) < 60) {
          setObtuseShiftOffset({ x: targetShiftX, y: 0 });
          setObtuseShifted(true);
        }
      }
      setActiveTriPiece(null);
      return;
    }

    // 3. Hoàn tất thao tác kẻ đường cao hình thang
    if (selectedShape === 'trapezoid' && activeTrapApex) {
      const cfg = getShapeConfig('trapezoid', demoMode);
      const ox = cfg.originX ?? 245;
      const oy = cfg.originY ?? 325;
      const footLocalX = activeTrapApex === 'left' ? (cfg.leftAltX ?? 50) : (cfg.rightAltX ?? 200);
      const footSvgX = ox + footLocalX;
      const footSvgY = oy;

      const movedDist =
        trapDrawStartRef.current && trapDrawPt
          ? Math.hypot(trapDrawPt.x - trapDrawStartRef.current.x, trapDrawPt.y - trapDrawStartRef.current.y)
          : 0;

      if (movedDist < 10) {
        setTrapClickApex(activeTrapApex);
        setActiveTrapApex(null);
        setTrapDrawHint('Đã chọn đỉnh đáy nhỏ! Hãy bấm xuống điểm vuông góc (90°) trên đáy lớn.');
        return;
      }

      if (trapDrawPt && Math.abs(trapDrawPt.x - footSvgX) <= 34 && Math.abs(trapDrawPt.y - footSvgY) <= 45) {
        if (activeTrapApex === 'left') setTrapLeftAltDrawn(true);
        else setTrapRightAltDrawn(true);
        setActiveTrapApex(null);
        setTrapClickApex(null);
        setTrapDrawPt(null);
        setTrapDrawHint(null);
      } else {
        setActiveTrapApex(null);
        setTrapClickApex(null);
        setTrapDrawPt(null);
        setTrapDrawHint('Hãy kéo thẳng đứng từ đỉnh đáy nhỏ xuống vuông góc với đáy lớn (90°)!');
      }
      return;
    }

    // 4. Bắt dính nam châm mảnh ghép hình thang (HCN & Tam giác vuông)
    if (selectedShape === 'trapezoid' && activeTrapPiece) {
      const cfg = getShapeConfig('trapezoid', demoMode);
      if (activeTrapPiece === 'rect' && cfg.targetRectOffset) {
        if (Math.hypot(trapRectOffset.x - cfg.targetRectOffset.x, trapRectOffset.y - cfg.targetRectOffset.y) < 60) {
          setTrapRectOffset(cfg.targetRectOffset);
          setTrapRectSnapped(true);
        }
      } else if (activeTrapPiece === 'triLeft' && cfg.targetTriLeftOffset) {
        if (Math.hypot(trapTriLeftOffset.x - cfg.targetTriLeftOffset.x, trapTriLeftOffset.y - cfg.targetTriLeftOffset.y) < 60) {
          setTrapTriLeftOffset(cfg.targetTriLeftOffset);
          setTrapTriLeftSnapped(true);
        }
      } else if (activeTrapPiece === 'triRight' && cfg.targetTriRightOffset) {
        if (Math.hypot(trapTriRightOffset.x - cfg.targetTriRightOffset.x, trapTriRightOffset.y - cfg.targetTriRightOffset.y) < 60) {
          setTrapTriRightOffset(cfg.targetTriRightOffset);
          setTrapTriRightSnapped(true);
        }
      }
      setActiveTrapPiece(null);
    }
  };

  // Đặt lại trạng thái ban đầu (hình tam giác / hình thang quay về chưa kẻ đường cao)
  const resetPuzzle = () => {
    const cfg = getShapeConfig(selectedShape, demoMode);

    setIsAltitudeDrawn(false);
    setIsDrawingAltitude(false);
    setIsClickDrawMode(false);
    setDrawPt(null);
    setDrawHint(null);
    setLeftPieceOffset(cfg.leftInitOffset || { x: -165, y: 0 });
    setRightPieceOffset(cfg.rightInitOffset || { x: 115, y: 0 });
    setLeftPieceSnapped(false);
    setRightPieceSnapped(false);
    setObtuseShiftOffset({ x: 0, y: 0 });
    setObtuseShifted(false);
    setActiveTriPiece(null);

    setTrapLeftAltDrawn(selectedShape === 'trapezoid' && demoMode === 2);
    setTrapRightAltDrawn(false);
    setActiveTrapApex(null);
    setTrapClickApex(null);
    setTrapDrawPt(null);
    setTrapDrawHint(null);
    setTrapRectOffset({ x: 0, y: 0 });
    setTrapTriLeftOffset({ x: 0, y: 0 });
    setTrapTriRightOffset({ x: 0, y: 0 });
    setTrapRectSnapped(false);
    setTrapTriLeftSnapped(false);
    setTrapTriRightSnapped(false);
    setActiveTrapPiece(null);
  };

  // Nút bấm chuyển đổi nhanh cho Hình thang / Hình tam giác
  const toggleSnap = () => {
    const cfg = getShapeConfig(selectedShape, demoMode);
    if (selectedShape === 'triangle') {
      if (!isAltitudeDrawn) {
        setIsAltitudeDrawn(true);
        setIsDrawingAltitude(false);
        setIsClickDrawMode(false);
        setDrawPt(null);
        setDrawHint(null);
        return;
      }
      if (isTriangleRectComplete) {
        setLeftPieceOffset(cfg.leftInitOffset || { x: -165, y: 0 });
        setRightPieceOffset(cfg.rightInitOffset || { x: 115, y: 0 });
        setLeftPieceSnapped(false);
        setRightPieceSnapped(false);
        setObtuseShiftOffset({ x: 0, y: 0 });
        setObtuseShifted(false);
      } else {
        setLeftPieceOffset({ x: 0, y: 0 });
        setRightPieceOffset({ x: 0, y: 0 });
        setLeftPieceSnapped(true);
        setRightPieceSnapped(true);
        setObtuseShiftOffset({ x: cfg.baseWidth ?? 190, y: 0 });
        setObtuseShifted(true);
      }
      return;
    }

    if (selectedShape === 'trapezoid') {
      if (!isTrapAltComplete) {
        setTrapLeftAltDrawn(true);
        setTrapRightAltDrawn(true);
        setActiveTrapApex(null);
        setTrapClickApex(null);
        setTrapDrawPt(null);
        setTrapDrawHint(null);
        return;
      }
      if (isTrapExploreComplete) {
        setTrapRectOffset({ x: 0, y: 0 });
        setTrapTriLeftOffset({ x: 0, y: 0 });
        setTrapTriRightOffset({ x: 0, y: 0 });
        setTrapRectSnapped(false);
        setTrapTriLeftSnapped(false);
        setTrapTriRightSnapped(false);
      } else {
        setTrapRectOffset(cfg.targetRectOffset || { x: -230, y: 0 });
        setTrapTriLeftOffset(cfg.targetTriLeftOffset || { x: 280, y: 0 });
        setTrapTriRightOffset(cfg.targetTriRightOffset || { x: 130, y: 0 });
        setTrapRectSnapped(true);
        setTrapTriLeftSnapped(true);
        setTrapTriRightSnapped(true);
      }
    }
  };

  const generateRandom = () => {
    const newBase = Math.floor(Math.random() * 14) + 10; // 10..23
    const newBaseSmall = Math.floor(Math.random() * (newBase - 5)) + 4; // luôn nhỏ hơn đáy lớn
    const newHeight = Math.floor(Math.random() * 15) + 5;
    setParams({
      ...params,
      base: newBase,
      height: newHeight,
      baseSmall: newBaseSmall,
      radius: Math.floor(Math.random() * 10) + 2
    });
    setUserAreaInput('');
    setUserCircumInput('');
    setPracticeResult(null);
    resetPuzzle();
  };

  const handleCheckAnswer = () => {
    const area = calculateArea();
    const circum = calculateCircumference();
    const userArea = parseFloat(userAreaInput.trim().replace(',', '.'));
    
    if (selectedShape === 'circle') {
      const userCircum = parseFloat(userCircumInput.trim().replace(',', '.'));
      const isAreaOk = !isNaN(userArea) && Math.abs(userArea - area) <= 0.15;
      const isCircumOk = !isNaN(userCircum) && Math.abs(userCircum - circum) <= 0.15;
      setPracticeResult({
        isChecked: true,
        isCorrect: isAreaOk && isCircumOk
      });
    } else {
      const isAreaOk = !isNaN(userArea) && Math.abs(userArea - area) <= 0.05;
      setPracticeResult({
        isChecked: true,
        isCorrect: isAreaOk
      });
    }
  };

  const handleRetry = () => {
    setPracticeResult(null);
    setUserAreaInput('');
    setUserCircumInput('');
  };

  const getFormulaText = () => {
    switch (selectedShape) {
      case 'triangle':
        return {
          title: 'Diện tích hình Tam giác',
          formula: (
            <div className="flex items-center justify-center gap-2">
              <span className="font-serif">S =</span>
              <Fraction num="a × h" den="2" />
            </div>
          ),
          labels: [
            { key: 'S', desc: 'Diện tích tam giác', color: 'text-sky-700 bg-sky-100' },
            { key: 'a', desc: 'Độ dài cạnh đáy', color: 'text-blue-700 bg-blue-100' },
            { key: 'h', desc: 'Chiều cao tương ứng', color: 'text-rose-700 bg-rose-100' }
          ],
          step: (
            <div className="flex items-center gap-2 font-mono text-base">
              <span className="font-serif">S =</span>
              <Fraction num={`${params.base} × ${params.height}`} den="2" />
              <span>= {calculateArea()} {params.unit}²</span>
            </div>
          ),
          resultLabel: 'Diện tích:'
        };
      case 'trapezoid':
        return {
          title: 'Diện tích hình Thang',
          formula: (
            <div className="flex items-center justify-center gap-2">
              <span className="font-serif">S =</span>
              <Fraction num="(a + b) × h" den="2" />
            </div>
          ),
          labels: [
            { key: 'S', desc: 'Diện tích hình thang', color: 'text-purple-700 bg-purple-100' },
            { key: 'a', desc: 'Độ dài đáy lớn', color: 'text-indigo-700 bg-indigo-100' },
            { key: 'b', desc: 'Độ dài đáy nhỏ', color: 'text-blue-700 bg-blue-100' },
            { key: 'h', desc: 'Chiều cao', color: 'text-rose-700 bg-rose-100' }
          ],
          step: (
            <div className="flex items-center gap-2 font-mono text-base">
              <span className="font-serif">S =</span>
              <Fraction num={`(${params.base} + ${params.baseSmall}) × ${params.height}`} den="2" />
              <span>= {calculateArea()} {params.unit}²</span>
            </div>
          ),
          resultLabel: 'Diện tích:'
        };
      case 'circle':
        return {
          title: 'Hình Tròn',
          formula: (
            <div className="flex flex-col items-center gap-1 font-serif text-xl">
              <div>S = r × r × 3,14</div>
              <div>C = d × 3,14 = r × 2 × 3,14</div>
            </div>
          ),
          labels: [
            { key: 'S', desc: 'Diện tích hình tròn', color: 'text-amber-700 bg-amber-100' },
            { key: 'C', desc: 'Chu vi hình tròn', color: 'text-emerald-700 bg-emerald-100' },
            { key: 'r', desc: 'Bán kính hình tròn', color: 'text-rose-700 bg-rose-100' },
            { key: 'd', desc: 'Đường kính (d = r × 2)', color: 'text-sky-700 bg-sky-100' }
          ],
          step: (
            <div className="space-y-1.5 font-mono text-sm">
              <p>S = {params.radius} × {params.radius} × 3,14 = <span className="font-bold text-amber-700">{calculateArea().toLocaleString('vi-VN')} {params.unit}²</span></p>
              <p>C = {params.radius * 2} × 3,14 = <span className="font-bold text-emerald-700">{calculateCircumference().toLocaleString('vi-VN')} {params.unit}</span></p>
            </div>
          ),
          resultLabel: 'Kết quả:'
        };
      default: return { title: '', formula: null, labels: [], step: null, resultLabel: '' };
    }
  };

  const info = getFormulaText();
  const config = getShapeConfig(selectedShape, demoMode);

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px]">
      {/* ================= BẢNG ĐIỀU KHIỂN BÊN TRÁI ================= */}
      <div className="w-full lg:w-80 bg-slate-50/90 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
        
        {/* Nhóm 1: Chọn Hình Phẳng */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Shapes size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Chọn Hình Phẳng
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              { 
                id: 'triangle', 
                label: 'Hình Tam Giác', 
                icon: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 3 22 21 2 21 12 3" />
                  </svg>
                )
              },
              { 
                id: 'trapezoid', 
                label: 'Hình Thang', 
                icon: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 5 18 5 22 19 2 19" />
                  </svg>
                )
              },
              { 
                id: 'circle', 
                label: 'Hình Tròn', 
                icon: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )
              }
            ].map((shape) => {
              const isCurrent = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => { setSelectedShape(shape.id as ShapeType); setDemoMode(1); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-bold flex items-center justify-between group ${
                    isCurrent 
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 translate-y-[-1px]' 
                      : 'bg-white hover:bg-sky-50/70 text-slate-700 border border-slate-200/90 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isCurrent ? 'text-white' : 'text-sky-600 group-hover:scale-110 transition-transform'}>
                      {shape.icon}
                    </span>
                    <span className="text-sm">{shape.label}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhóm 2: Minh họa trực quan */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutTemplate size={14} className="text-sky-600" />
            {selectedShape === 'circle' ? 'Chế độ khám phá' : 'Minh họa ghép hình'}
          </h4>
          <div className="grid grid-cols-1 gap-1.5">
            {selectedShape === 'triangle' && (
              <>
                <button 
                  onClick={() => setDemoMode(1)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 1 
                      ? 'bg-sky-100 text-sky-800 border border-sky-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  1. Tam giác nhọn
                </button>
                <button 
                  onClick={() => setDemoMode(2)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 2 
                      ? 'bg-sky-100 text-sky-800 border border-sky-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2. Tam giác tù (chiều cao ngoài)
                </button>
                <button 
                  onClick={() => setDemoMode(3)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 3 
                      ? 'bg-sky-100 text-sky-800 border border-sky-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  3. Tam giác vuông
                </button>
                <button 
                  onClick={() => setDemoMode(4)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 4 
                      ? 'bg-sky-100 text-sky-800 border border-sky-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  4. Tam giác đều
                </button>
              </>
            )}
            
            {selectedShape === 'trapezoid' && (
              <>
                <button 
                  onClick={() => setDemoMode(1)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 1 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  1. Hình thang thường
                </button>
                <button 
                  onClick={() => setDemoMode(2)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 2 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2. Hình thang vuông
                </button>
              </>
            )}

            {selectedShape === 'circle' && (
              <>
                <button 
                  onClick={() => setDemoMode(1)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 1 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  1. Chu vi hình tròn (r & d)
                </button>
                <button 
                  onClick={() => setDemoMode(2)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 2 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2. Khám phá Diện tích hình tròn
                </button>
              </>
            )}
          </div>
        </div>

        {/* Nhóm 3: Số đo thực tế */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Calculator size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Số đo thực tế ({params.unit})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {selectedShape !== 'circle' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Cạnh đáy (a):</label>
                  <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">đáy</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={params.base} 
                    onChange={(e) => setParams({...params, base: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-sky-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{params.unit}</span>
                </div>
              </div>
            )}

            {selectedShape === 'trapezoid' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Đáy nhỏ (b):</label>
                  <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">đáy nhỏ</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={params.baseSmall} 
                    onChange={(e) => setParams({...params, baseSmall: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-purple-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{params.unit}</span>
                </div>
              </div>
            )}

            {selectedShape !== 'circle' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Chiều cao (h):</label>
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">đường cao</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={params.height} 
                    onChange={(e) => setParams({...params, height: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-rose-600 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{params.unit}</span>
                </div>
              </div>
            )}

            {selectedShape === 'circle' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Bán kính (r):</label>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">bán kính</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    value={params.radius} 
                    onChange={(e) => setParams({...params, radius: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-amber-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{params.unit}</span>
                </div>
              </div>
            )}

            {/* Chọn đơn vị */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
              <label className="text-xs font-bold text-slate-500 block mb-1">Đơn vị đo:</label>
              <select 
                value={params.unit} 
                onChange={(e) => setParams({...params, unit: e.target.value})} 
                className="w-full text-sm font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
              >
                <option value="cm">cm (Xăng-ti-mét)</option>
                <option value="dm">dm (Đề-xi-mét)</option>
                <option value="m">m (Mét)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {selectedShape === 'triangle' && (
            <>
              <button 
                onClick={toggleSnap} 
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xs transition-all active:scale-[0.98] ${
                  !isAltitudeDrawn
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 shadow-md'
                    : isTriangleRectComplete
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md'
                }`}
              >
                {!isAltitudeDrawn ? (
                  <>
                    <Ruler size={16} /> Kẻ đường cao mẫu
                  </>
                ) : isTriangleRectComplete ? (
                  <>
                    <RefreshCw size={16} /> Tách rời để kéo ghép lại
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Ghép thành Hình chữ nhật
                  </>
                )}
              </button>
              {isAltitudeDrawn && (
                <button
                  onClick={resetPuzzle}
                  className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                >
                  <RotateCcw size={14} /> Kẻ lại đường cao từ đầu
                </button>
              )}
            </>
          )}
          {selectedShape === 'trapezoid' && (
            <>
              <button 
                onClick={toggleSnap} 
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xs transition-all active:scale-[0.98] ${
                  !isTrapAltComplete
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 shadow-md'
                    : isTrapExploreComplete
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md'
                }`}
              >
                {!isTrapAltComplete ? (
                  <>
                    <Ruler size={16} /> Kẻ đường cao mẫu
                  </>
                ) : isTrapExploreComplete ? (
                  <>
                    <RefreshCw size={16} /> Đưa các mảnh về hình thang
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Tách thành HCN & Tam giác
                  </>
                )}
              </button>
              {(trapRightAltDrawn || (demoMode === 1 && trapLeftAltDrawn)) && (
                <button
                  onClick={resetPuzzle}
                  className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                >
                  <RotateCcw size={14} /> Kẻ lại đường cao từ đầu
                </button>
              )}
            </>
          )}
          <button 
            onClick={generateRandom} 
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all active:scale-[0.98]"
          >
            <Sparkles size={16} className="text-sky-600" />
            Đổi số đo ngẫu nhiên
          </button>
          {!isInitialData() && (
            <button 
              onClick={resetToInitialData} 
              className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-[0.98]"
            >
              <RotateCcw size={14} className="text-emerald-600" />
              Khôi phục số liệu gốc (Bài giải mẫu)
            </button>
          )}
        </div>

      </div>

      {/* ================= KHU VỰC THỰC HÀNH HÌNH HỌC BÊN PHẢI ================= */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-white overflow-hidden">
        
        {/* BẢNG TƯƠNG TÁC HÌNH HỌC (LƯỚI Ô VUÔNG GIẤY VỞ TOÁN) */}
        <div className={`w-full ${selectedShape === 'circle' && demoMode === 2 ? 'min-h-[540px]' : 'aspect-[16/10] md:min-h-[460px]'} math-grid-bg rounded-3xl border-2 border-emerald-200 shadow-md board-shadow relative flex flex-col justify-between overflow-hidden`}>
          
          {/* Vùng Canvas chính chứa Header + SVG + Mascot */}
          <div className="relative flex-1 flex items-center justify-center min-h-[380px]">
          
          {/* Header Bảng tương tác */}
          <div className={`absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none ${selectedShape === 'circle' ? 'max-w-[52%]' : 'max-w-[70%]'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md w-fit">
              <Sparkles size={14} className="text-amber-300" />
              BẢNG TƯƠNG TÁC HÌNH HỌC
            </div>
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 border border-emerald-100 shadow-xs flex items-center gap-2 w-fit">
              <MousePointer2 size={13} className="text-emerald-600 shrink-0" />
              {selectedShape === 'triangle' ? (
                !isAltitudeDrawn ? (
                  <span className="text-rose-700 font-extrabold">
                    {drawHint || 'Bước 1: Kéo từ đỉnh trên xuống vuông góc với cạnh đáy để tự kẻ chiều cao (h)!'}
                  </span>
                ) : isTriangleRectComplete ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Đã ghép thành Hình chữ nhật (dài = a, rộng = h) ➜ S(tam giác) = (a × h) : 2
                  </span>
                ) : demoMode === 2 && rightPieceSnapped && !obtuseShifted ? (
                  <span className="text-amber-800 font-extrabold">
                    Bước 3: Kéo phần tam giác nhô bên trái sang cạnh phải để tạo Hình chữ nhật!
                  </span>
                ) : (
                  <span className="text-sky-800 font-extrabold">
                    Bước 2: Kéo các mảnh ghép vào khung để biến hình tam giác thành Hình chữ nhật!
                  </span>
                )
              ) : selectedShape === 'trapezoid' ? (
                !isTrapAltComplete ? (
                  <span className="text-rose-700 font-extrabold">
                    {trapDrawHint ||
                      (demoMode === 1
                        ? !trapLeftAltDrawn && !trapRightAltDrawn
                          ? 'Bước 1: Kéo từ 2 đỉnh đáy nhỏ xuống vuông góc với đáy lớn để tự kẻ chiều cao (h)!'
                          : 'Rất tốt! Hãy kéo kẻ nốt chiều cao thứ 2 xuống đáy lớn (90°)!'
                        : 'Bước 1: Kéo từ đỉnh trên bên phải xuống vuông góc với đáy lớn để kẻ chiều cao (h)!')}
                  </span>
                ) : isTrapExploreComplete ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    S = S(HCN) + S({demoMode === 1 ? '2 Tam giác vuông' : 'Tam giác vuông'}) ➜ S = (a + b) × h : 2
                  </span>
                ) : (
                  <span className="text-purple-800 font-extrabold">
                    Bước 2: Kéo Hình chữ nhật sang khung trái và {demoMode === 1 ? '2 Tam giác vuông' : 'Tam giác vuông'} sang khung phải để tính diện tích!
                  </span>
                )
              ) : demoMode === 1 ? (
                <span>Khám phá bán kính (r), đường kính (d = r × 2) và chu vi hình tròn</span>
              ) : (
                <span className="text-teal-900 font-extrabold">
                  Chia thành {circleSlices} phần bằng nhau rồi cắt ghép thành hình gần giống hình chữ nhật!
                </span>
              )}
            </div>
          </div>

          {/* Thanh chuyển đổi 2 tab cho Hình tròn ở góc trên bên phải */}
          {selectedShape === 'circle' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-emerald-200 shadow-md">
              <button
                onClick={() => setDemoMode(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  demoMode === 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                Chu vi hình tròn
              </button>
              <button
                onClick={() => setDemoMode(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  demoMode === 2
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <Scissors size={13} />
                Khám phá Diện tích hình tròn
              </button>
            </div>
          )}

          {/* Nút hành động nhanh trên góc phải bảng tương tác */}
          {selectedShape !== 'circle' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              {((selectedShape === 'triangle' && isAltitudeDrawn) ||
                (selectedShape === 'trapezoid' && (trapRightAltDrawn || (demoMode === 1 && trapLeftAltDrawn)))) && (
                <button
                  onClick={resetPuzzle}
                  className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-white/95 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  title="Kẻ lại chiều cao từ đầu"
                >
                  <RotateCcw size={13} />
                  Kẻ lại h
                </button>
              )}
              <button
                onClick={toggleSnap}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  selectedShape === 'triangle'
                    ? !isAltitudeDrawn
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : isTriangleRectComplete
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : !isTrapAltComplete
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : isTrapExploreComplete
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedShape === 'triangle' ? (
                  !isAltitudeDrawn ? (
                    <>
                      <Ruler size={14} /> Kẻ chiều cao mẫu
                    </>
                  ) : isTriangleRectComplete ? (
                    <>
                      <RefreshCw size={14} /> Tách rời mảnh
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Ghép thành HCN
                    </>
                  )
                ) : !isTrapAltComplete ? (
                  <>
                    <Ruler size={14} /> Kẻ chiều cao mẫu
                  </>
                ) : isTrapExploreComplete ? (
                  <>
                    <RefreshCw size={14} /> Đưa về hình thang
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Tách HCN & Tam giác
                  </>
                )}
              </button>
            </div>
          )}

          {/* SVG Canvas chứa các khối hình - viewBox="0 0 760 460" */}
          <svg 
            ref={containerRef} 
            width="100%" 
            height="100%" 
            viewBox="0 0 760 460" 
            preserveAspectRatio="xMidYMid meet"
            className="select-none w-full h-full" 
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUp} 
            onMouseLeave={handleMouseUp} 
            onTouchMove={handleMouseMove} 
            onTouchEnd={handleMouseUp}
          >
            {/* Lưới tọa độ bổ trợ & tâm điểm */}
            <defs>
              <filter id="shapeShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.12" />
              </filter>
              <linearGradient id="gridGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* ================= 1. HÌNH TAM GIÁC (TỰ KẺ ĐƯỜNG CAO + GHÉP THÀNH HÌNH CHỮ NHẬT) ================= */}
            {selectedShape === 'triangle' && (() => {
              const ox = config.originX ?? 280;
              const oy = config.originY ?? 325;
              const bw = config.baseWidth ?? 200;
              const hp = config.heightPx ?? 160;
              const ax = config.apexX ?? 130;
              const ay = config.apexY ?? -160;
              const altX = config.altitudeX;
              const apexSvgX = ox + ax;
              const apexSvgY = oy + ay;
              const footSvgX = ox + altX;
              const footSvgY = oy;
              const isNearRightAngle =
                drawPt !== null &&
                Math.abs(drawPt.x - footSvgX) <= 34 &&
                Math.abs(drawPt.y - footSvgY) <= 45;

              // Cho Tam giác tù: tọa độ điểm cắt K trên cạnh CB tại x = 0
              const kY = -123.08;

              return (
                <>
                  {/* Khung gợi ý Hình chữ nhật sau khi đã kẻ xong chiều cao */}
                  {isAltitudeDrawn && !isTriangleRectComplete && (
                    <g transform={`translate(${ox}, ${oy})`}>
                      <rect
                        x="0"
                        y={-hp}
                        width={bw}
                        height={hp}
                        fill="#10b981"
                        fillOpacity="0.04"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        rx="2"
                      />
                      <text
                        x={bw / 2}
                        y={-hp - 10}
                        textAnchor="middle"
                        className="text-[11px] font-extrabold fill-emerald-700"
                      >
                        Khung Hình Chữ Nhật (Dài = a, Rộng = h)
                      </text>
                    </g>
                  )}

                  {/* Khối Hình Tam Giác Gốc (tại vị trí trung tâm ox, oy) */}
                  <g transform={`translate(${ox}, ${oy})`} filter="url(#shapeShadow)">
                    {/* Với Tam giác tù ở Bước 3 (đã ghép thành hình bình hành): tách phần bên trái x < 0 để kéo sang phải */}
                    {demoMode === 2 && rightPieceSnapped ? (
                      <>
                        {/* Phần cố định nằm trong khung hình chữ nhật [0..bw] của Tam giác 1 */}
                        <polygon
                          points={`0,0 ${bw},0 0,${kY}`}
                          fill="#0284c7"
                          fillOpacity="0.28"
                          stroke="#0284c7"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {/* Phần cố định nằm trong khung hình chữ nhật [0..bw] của Tam giác 2 */}
                        <polygon
                          points={`${bw},0 ${bw - 60},${-hp} 0,${-hp} 0,${kY}`}
                          fill="#10b981"
                          fillOpacity="0.28"
                          stroke="#059669"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />

                        {/* Mảnh nhô bên trái x < 0 (gồm 2 phần thuộc Tam giác 1 & Tam giác 2) để kéo sang phải thành HCN */}
                        <g
                          transform={`translate(${obtuseShiftOffset.x}, ${obtuseShiftOffset.y})`}
                          onMouseDown={(e) => handleTriPiecePointerDown('obtuseShift', e)}
                          onTouchStart={(e) => handleTriPiecePointerDown('obtuseShift', e)}
                          className={obtuseShifted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                        >
                          <polygon
                            points={`0,0 -60,${-hp} 0,${kY}`}
                            fill="#0284c7"
                            fillOpacity="0.32"
                            stroke="#0284c7"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points={`-60,${-hp} 0,${-hp} 0,${kY}`}
                            fill="#10b981"
                            fillOpacity="0.32"
                            stroke="#059669"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          {!obtuseShifted && (
                            <g className="pointer-events-none">
                              <path
                                d="M -25 -95 Q 75 -135 170 -95"
                                fill="none"
                                stroke="#d97706"
                                strokeWidth="2.5"
                                strokeDasharray="5 4"
                              />
                              <polygon points="166,-102 178,-92 164,-90" fill="#d97706" />
                              <rect x="-56" y="-110" width="52" height="20" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
                              <text x="-30" y="-96" textAnchor="middle" className="text-[10px] font-black fill-amber-900">
                                Kéo sang ➜
                              </text>
                            </g>
                          )}
                        </g>
                      </>
                    ) : (
                      /* Tam giác gốc bình thường */
                      <polygon
                        points={config.points}
                        fill="#0284c7"
                        fillOpacity={isTriangleRectComplete ? "0.26" : "0.32"}
                        stroke="#0284c7"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Ký hiệu 3 cạnh bằng nhau cho 4. Tam giác đều */}
                    {demoMode === 4 && !isTriangleRectComplete && (
                      <g stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none">
                        {/* Cạnh đáy */}
                        <line x1="100" y1="-5" x2="100" y2="5" />
                        {/* Cạnh trái */}
                        <line x1="45" y1="-89" x2="55" y2="-84" />
                        {/* Cạnh phải */}
                        <line x1="155" y1="-89" x2="145" y2="-84" />
                      </g>
                    )}

                    {/* Đoạn kéo dài cạnh đáy cho Tam giác tù */}
                    {demoMode === 2 && (isAltitudeDrawn || isDrawingAltitude || isClickDrawMode) && !isTriangleRectComplete && (
                      <line
                        x1="0"
                        y1="0"
                        x2={altX}
                        y2="0"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Đường cao h (CHỈ HIỆN SAU KHI NGƯỜI DÙNG ĐÃ KẺ) */}
                    {isAltitudeDrawn && (
                      <g className="pointer-events-none">
                        <line
                          x1={altX}
                          y1="0"
                          x2={altX}
                          y2={-hp}
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                        />
                        {/* Ký hiệu góc vuông chân đường cao */}
                        <rect
                          x={altX > 0 ? altX - 12 : altX}
                          y="-12"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="1.8"
                        />
                        {/* Nhãn chiều cao h */}
                        {(() => {
                          const hText = `h = ${params.height} ${params.unit}`;
                          const hW = Math.max(78, hText.length * 7.5 + 18);
                          return (
                            <>
                              <rect
                                x={altX > 0 ? altX + 8 : altX - hW - 8}
                                y={-hp / 2 - 11}
                                width={hW}
                                height="22"
                                rx="6"
                                fill="#ffffff"
                                stroke="#fca5a5"
                                strokeWidth="1.5"
                              />
                              <text
                                x={altX > 0 ? altX + 8 + hW / 2 : altX - 8 - hW / 2}
                                y={-hp / 2 + 4}
                                textAnchor="middle"
                                className="text-xs font-black fill-rose-600 font-mono"
                              >
                                {hText}
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    )}

                    {/* Nhãn cạnh đáy a */}
                    {(() => {
                      const aText = `a = ${params.base} ${params.unit}`;
                      const aW = Math.max(82, aText.length * 7.5 + 18);
                      return (
                        <>
                          <rect
                            x={bw / 2 - aW / 2}
                            y="14"
                            width={aW}
                            height="22"
                            rx="6"
                            fill="#ffffff"
                            stroke="#bae6fd"
                            strokeWidth="1.5"
                          />
                          <text
                            x={bw / 2}
                            y="29"
                            textAnchor="middle"
                            className="text-xs font-black fill-sky-800 font-mono"
                          >
                            {aText}
                          </text>
                        </>
                      );
                    })()}

                    {/* Nhãn Tam giác gốc */}
                    {!isTriangleRectComplete && !(demoMode === 2 && rightPieceSnapped) && (
                      <text
                        x={demoMode === 2 ? bw / 2 - 20 : ax}
                        y={-36}
                        textAnchor="middle"
                        className="text-xs font-black fill-sky-900 pointer-events-none"
                      >
                        {demoMode === 4 ? 'Tam giác đều' : 'Tam giác gốc'}
                      </text>
                    )}

                    {/* Các đỉnh tam giác */}
                    <circle cx="0" cy="0" r="5" fill="#0284c7" />
                    <circle cx={bw} cy="0" r="5" fill="#0284c7" />

                    {/* Điểm đỉnh C tương tác để kéo kẻ chiều cao (khi chưa kẻ) */}
                    {!isAltitudeDrawn ? (
                      <g
                        onMouseDown={handleApexPointerDown}
                        onTouchStart={handleApexPointerDown}
                        className="cursor-crosshair"
                      >
                        {/* Đường gióng gợi ý hướng vuông góc mờ khi đang kéo */}
                        {(isDrawingAltitude || isClickDrawMode) && (
                          <g className="pointer-events-none">
                            <line
                              x1={ax}
                              y1={ay}
                              x2={altX}
                              y2="0"
                              stroke="#94a3b8"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              opacity="0.7"
                            />
                            <circle
                              cx={altX}
                              cy="0"
                              r="12"
                              fill={isNearRightAngle ? '#10b981' : '#f43f5e'}
                              fillOpacity="0.22"
                              stroke={isNearRightAngle ? '#059669' : '#e11d48'}
                              strokeWidth="2"
                              strokeDasharray="3 2"
                            />
                          </g>
                        )}
                        <circle
                          cx={ax}
                          cy={ay}
                          r="16"
                          fill="#f43f5e"
                          fillOpacity="0.18"
                          className="animate-ping"
                        />
                        <circle
                          cx={ax}
                          cy={ay}
                          r="9"
                          fill="#e11d48"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                        <circle cx={ax} cy={ay} r="22" fill="transparent" />
                        {/* Nhãn hướng dẫn kéo từ đỉnh */}
                        <g transform={`translate(${ax}, ${ay - 28})`} className="pointer-events-none">
                          <rect
                            x="-92"
                            y="-12"
                            width="184"
                            height="22"
                            rx="8"
                            fill="#be123c"
                            opacity="0.95"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            className="text-[10px] font-black fill-white"
                          >
                            ⬇ Kéo từ đỉnh xuống đáy kẻ h
                          </text>
                        </g>
                      </g>
                    ) : (
                      <circle cx={ax} cy={ay} r="5" fill="#0284c7" />
                    )}
                  </g>

                  {/* Nét vẽ đường cao tạm thời khi người dùng đang kéo */}
                  {(isDrawingAltitude || isClickDrawMode) && drawPt && !isAltitudeDrawn && (
                    <g className="pointer-events-none">
                      <line
                        x1={apexSvgX}
                        y1={apexSvgY}
                        x2={isNearRightAngle ? footSvgX : drawPt.x}
                        y2={isNearRightAngle ? footSvgY : drawPt.y}
                        stroke={isNearRightAngle ? '#059669' : '#e11d48'}
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                      <circle
                        cx={isNearRightAngle ? footSvgX : drawPt.x}
                        cy={isNearRightAngle ? footSvgY : drawPt.y}
                        r="6"
                        fill={isNearRightAngle ? '#10b981' : '#e11d48'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {isNearRightAngle && (
                        <g transform={`translate(${footSvgX}, ${footSvgY})`}>
                          <rect
                            x={altX > 0 ? -12 : 0}
                            y="-12"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2"
                          />
                          <rect x="-46" y="10" width="92" height="20" rx="6" fill="#065f46" />
                          <text x="0" y="24" textAnchor="middle" className="text-[10px] font-black fill-white">
                            ✓ Vuông góc 90°!
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* GIAI ĐOẠN 2: CÁC MẢNH GHÉP THÀNH HÌNH CHỮ NHẬT (chỉ hiện sau khi đã kẻ chiều cao) */}
                  {isAltitudeDrawn && (
                    <>
                      {/* Mảnh ghép Trái (cho Tam giác nhọn & Tam giác đều) */}
                      {(demoMode === 1 || demoMode === 4) && config.leftPiecePoints && (
                        <g
                          transform={`translate(${ox + leftPieceOffset.x}, ${oy + leftPieceOffset.y})`}
                          onMouseDown={(e) => handleTriPiecePointerDown('left', e)}
                          onTouchStart={(e) => handleTriPiecePointerDown('left', e)}
                          className={leftPieceSnapped ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                          filter="url(#shapeShadow)"
                        >
                          <polygon
                            points={config.leftPiecePoints}
                            fill="#10b981"
                            fillOpacity={leftPieceSnapped ? "0.26" : "0.45"}
                            stroke="#059669"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            strokeDasharray={leftPieceSnapped ? "none" : "6 4"}
                          />
                          {!leftPieceSnapped && (
                            <g className="pointer-events-none">
                              <text
                                x={altX * 0.38}
                                y={-hp * 0.68}
                                textAnchor="middle"
                                className="text-[11px] font-black fill-emerald-950"
                              >
                                Mảnh trái
                              </text>
                              <text
                                x={altX * 0.38}
                                y={-hp * 0.54}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-emerald-800"
                              >
                                Kéo ghép ➜
                              </text>
                            </g>
                          )}
                        </g>
                      )}

                      {/* Mảnh ghép Phải (dùng cho mọi tam giác; với Tam giác vuông & tù là cả tam giác quay 180°) */}
                      {!(demoMode === 2 && rightPieceSnapped) && (
                        <g
                          transform={`translate(${ox + rightPieceOffset.x}, ${oy + rightPieceOffset.y})`}
                          onMouseDown={(e) => handleTriPiecePointerDown('right', e)}
                          onTouchStart={(e) => handleTriPiecePointerDown('right', e)}
                          className={rightPieceSnapped ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                          filter="url(#shapeShadow)"
                        >
                          <polygon
                            points={config.rightPiecePoints}
                            fill="#10b981"
                            fillOpacity={rightPieceSnapped ? "0.26" : "0.45"}
                            stroke="#059669"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            strokeDasharray={rightPieceSnapped ? "none" : "6 4"}
                          />
                          {!rightPieceSnapped && (
                            <g className="pointer-events-none">
                              <text
                                x={demoMode === 2 ? 75 : demoMode === 3 ? bw * 0.65 : (bw + altX) / 2 + 12}
                                y={-hp * 0.68}
                                textAnchor="middle"
                                className="text-[11px] font-black fill-emerald-950"
                              >
                                {demoMode === 1 || demoMode === 4 ? 'Mảnh phải' : 'Tam giác 2'}
                              </text>
                              <text
                                x={demoMode === 2 ? 75 : demoMode === 3 ? bw * 0.65 : (bw + altX) / 2 + 12}
                                y={-hp * 0.54}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-emerald-800"
                              >
                                ⬅ Kéo ghép
                              </text>
                            </g>
                          )}
                        </g>
                      )}
                    </>
                  )}

                  {/* Viền nổi bật & Kết luận Hình Chữ Nhật khi ghép hoàn chỉnh */}
                  {isTriangleRectComplete && (
                    <g transform={`translate(${ox}, ${oy})`} className="pointer-events-none">
                      <rect
                        x="0"
                        y={-hp}
                        width={bw}
                        height={hp}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="4"
                        rx="2"
                      />
                      {/* Nhãn Chiều rộng hình chữ nhật ở cạnh trái */}
                      <rect x="-86" y={-hp / 2 - 12} width="78" height="24" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                      <text x="-47" y={-hp / 2 + 4} textAnchor="middle" className="text-[11px] font-black fill-emerald-800 font-mono">
                        Rộng = h
                      </text>

                      {/* Banner kết luận phía trên Hình chữ nhật */}
                      <g transform={`translate(${bw / 2}, ${-hp - 18})`}>
                        <rect
                          x="-185"
                          y="-16"
                          width="370"
                          height="28"
                          rx="9"
                          fill="#065f46"
                          opacity="0.95"
                        />
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          className="text-xs font-black fill-emerald-50 font-sans"
                        >
                          ✓ Hình chữ nhật (S = a × h) = 2 × Tam giác ➜ S = (a × h) : 2
                        </text>
                      </g>
                    </g>
                  )}
                </>
              );
            })()}

            {/* ================= 2. HÌNH THANG (TỰ KẺ ĐƯỜNG CAO + TÁCH THÀNH HCN & 2 TAM GIÁC VUÔNG) ================= */}
            {selectedShape === 'trapezoid' && (() => {
              const ox = config.originX ?? 245;
              const oy = config.originY ?? 325;
              const bw = config.baseWidth ?? 250;
              const sbw = config.smallBaseWidth ?? 150;
              const hp = config.heightPx ?? 160;
              const leftAltX = config.leftAltX ?? 50;
              const rightAltX = config.rightAltX ?? 200;

              const activeApexSide = activeTrapApex ?? trapClickApex;
              const activeApexLocalX = activeApexSide === 'left' ? leftAltX : rightAltX;
              const activeApexSvgX = ox + activeApexLocalX;
              const activeApexSvgY = oy - hp;
              const activeFootSvgX = ox + activeApexLocalX;
              const activeFootSvgY = oy;

              const isNearTrapRightAngle =
                trapDrawPt !== null &&
                activeApexSide !== null &&
                Math.abs(trapDrawPt.x - activeFootSvgX) <= 34 &&
                Math.abs(trapDrawPt.y - activeFootSvgY) <= 45;

              const rectAreaVal = Number((params.baseSmall * params.height).toFixed(2));
              const diffBaseVal = Number((params.base - params.baseSmall).toFixed(2));
              const triAreaVal = Number((((params.base - params.baseSmall) * params.height) / 2).toFixed(2));
              const rightTargetDone = trapTriRightSnapped && (demoMode === 2 || trapTriLeftSnapped);

              return (
                <>
                  {/* GIAI ĐOẠN 2: KHUNG ĐÍCH TÁCH HÌNH (Trái: Hình chữ nhật | Phải: Tam giác vuông) */}
                  {isTrapAltComplete && (
                    <g className="pointer-events-none">
                      {/* Khung 1 (Bên trái): Hình chữ nhật [65..215, y: 165..325] */}
                      <g transform="translate(65, 165)">
                        <rect
                          x="0"
                          y="0"
                          width={sbw}
                          height={hp}
                          fill={trapRectSnapped ? "#ede9fe" : "#7c3aed"}
                          fillOpacity={trapRectSnapped ? "0.25" : "0.05"}
                          stroke="#7c3aed"
                          strokeWidth={trapRectSnapped ? "2.5" : "2"}
                          strokeDasharray={trapRectSnapped ? "none" : "6 4"}
                          rx="2"
                        />
                        <text
                          x={sbw / 2}
                          y="-12"
                          textAnchor="middle"
                          className="text-[11px] font-black fill-purple-800"
                        >
                          1. Hình chữ nhật
                        </text>
                        {trapRectSnapped ? (
                          <>
                            <rect x="-10" y="-42" width={sbw + 20} height="22" rx="6" fill="#7c3aed" />
                            <text x={sbw / 2} y="-27" textAnchor="middle" className="text-[10px] font-black fill-white font-mono">
                              S₁ = b × h = {rectAreaVal} {params.unit}²
                            </text>
                            {(() => {
                              const bTrapText = `b = ${params.baseSmall} ${params.unit}`;
                              const bTrapW = Math.max(76, bTrapText.length * 7 + 16);
                              const hTrapText = `h = ${params.height} ${params.unit}`;
                              const hTrapW = Math.max(66, hTrapText.length * 7 + 16);
                              return (
                                <>
                                  <rect x={sbw / 2 - bTrapW / 2} y={hp + 10} width={bTrapW} height="20" rx="5" fill="#ffffff" stroke="#c4b5fd" strokeWidth="1.2" />
                                  <text x={sbw / 2} y={hp + 24} textAnchor="middle" className="text-[11px] font-black fill-purple-800 font-mono">
                                    {bTrapText}
                                  </text>
                                  <rect x={-hTrapW - 6} y={hp / 2 - 11} width={hTrapW} height="22" rx="5" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.2" />
                                  <text x={-hTrapW / 2 - 6} y={hp / 2 + 4} textAnchor="middle" className="text-[11px] font-black fill-rose-600 font-mono">
                                    {hTrapText}
                                  </text>
                                </>
                              );
                            })()}
                          </>
                        ) : (
                          <text x={sbw / 2} y={hp / 2 + 4} textAnchor="middle" className="text-[11px] font-bold fill-purple-400">
                            Kéo HCN vào đây
                          </text>
                        )}
                      </g>

                      {/* Khung 2 (Bên phải): 2 Tam giác vuông ghép hoặc 1 Tam giác vuông [525..625, y: 165..325] */}
                      <g transform="translate(525, 165)">
                        {demoMode === 1 ? (
                          <>
                            <polygon
                              points="0,160 100,160 50,0"
                              fill={rightTargetDone ? "#d1fae5" : "#0284c7"}
                              fillOpacity={rightTargetDone ? "0.22" : "0.05"}
                              stroke="#059669"
                              strokeWidth={rightTargetDone ? "2.5" : "2"}
                              strokeDasharray={rightTargetDone ? "none" : "6 4"}
                            />
                            <line
                              x1="50"
                              y1="0"
                              x2="50"
                              y2="160"
                              stroke="#dc2626"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                          </>
                        ) : (
                          <polygon
                            points="0,160 100,160 0,0"
                            fill={rightTargetDone ? "#d1fae5" : "#10b981"}
                            fillOpacity={rightTargetDone ? "0.22" : "0.05"}
                            stroke="#059669"
                            strokeWidth={rightTargetDone ? "2.5" : "2"}
                            strokeDasharray={rightTargetDone ? "none" : "6 4"}
                          />
                        )}
                        <text
                          x="50"
                          y="-12"
                          textAnchor="middle"
                          className="text-[11px] font-black fill-emerald-800"
                        >
                          {demoMode === 1 ? '2. Ghép 2 Tam giác vuông' : '2. Tam giác vuông'}
                        </text>
                        {rightTargetDone ? (
                          <>
                            <rect x="-32" y="-42" width="164" height="22" rx="6" fill="#059669" />
                            <text x="50" y="-27" textAnchor="middle" className="text-[10px] font-black fill-white font-mono">
                              S₂ = (a-b)×h:2 = {triAreaVal} {params.unit}²
                            </text>
                            {(() => {
                              const diffText = `Đáy = a - b = ${diffBaseVal} ${params.unit}`;
                              const diffW = Math.max(128, diffText.length * 6.5 + 16);
                              return (
                                <>
                                  <rect x={50 - diffW / 2} y={hp + 10} width={diffW} height="20" rx="5" fill="#ffffff" stroke="#6ee7b7" strokeWidth="1.2" />
                                  <text x="50" y={hp + 24} textAnchor="middle" className="text-[10px] font-black fill-emerald-800 font-mono">
                                    {diffText}
                                  </text>
                                </>
                              );
                            })()}
                          </>
                        ) : (
                          <text x="50" y={hp / 2 + 26} textAnchor="middle" className="text-[10px] font-bold fill-emerald-600">
                            {demoMode === 1 ? 'Ghép 2 TG vào đây' : 'Kéo TG vào đây'}
                          </text>
                        )}
                      </g>
                    </g>
                  )}

                  {/* HÌNH THANG GỐC TẠI TRUNG TÂM */}
                  <g transform={`translate(${ox}, ${oy})`} filter="url(#shapeShadow)">
                    <polygon
                      points={config.points}
                      fill="#7c3aed"
                      fillOpacity={isTrapAltComplete ? "0.08" : "0.28"}
                      stroke="#7c3aed"
                      strokeWidth={isTrapAltComplete ? "2.5" : "3.5"}
                      strokeDasharray={isTrapAltComplete ? "6 4" : "none"}
                      strokeLinejoin="round"
                    />

                    {/* Hình thang vuông: ký hiệu sẵn góc vuông bên trái tại A(0,0) và D(0,-160) */}
                    {demoMode === 2 && (
                      <g className="pointer-events-none">
                        <rect x="0" y="-12" width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="2" />
                        <rect x="0" y={-hp} width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="2" />
                        {!isTrapAltComplete && (() => {
                          const hSqText = `h = ${params.height} ${params.unit}`;
                          const hSqW = Math.max(76, hSqText.length * 7.5 + 16);
                          return (
                            <>
                              <rect x={-hSqW - 8} y={-hp / 2 - 11} width={hSqW} height="22" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                              <text x={-hSqW / 2 - 8} y={-hp / 2 + 4} textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                                {hSqText}
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    )}

                    {/* Đường cao trái (chế độ 1: chỉ hiện sau khi người dùng đã tự kẻ) */}
                    {demoMode === 1 && trapLeftAltDrawn && (() => {
                      const hLeftText = `h = ${params.height} ${params.unit}`;
                      const hLeftW = Math.max(74, hLeftText.length * 7.5 + 16);
                      return (
                        <g className="pointer-events-none">
                          <line x1={leftAltX} y1="0" x2={leftAltX} y2={-hp} stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
                          <rect x={leftAltX} y="-12" width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="1.8" />
                          <rect x={leftAltX - hLeftW - 8} y={-hp / 2 - 11} width={hLeftW} height="22" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                          <text x={leftAltX - 8 - hLeftW / 2} y={-hp / 2 + 4} textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                            {hLeftText}
                          </text>
                        </g>
                      );
                    })()}

                    {/* Đường cao phải (cả chế độ 1 & 2: chỉ hiện sau khi người dùng đã tự kẻ) */}
                    {trapRightAltDrawn && (() => {
                      const hRightText = `h = ${params.height} ${params.unit}`;
                      const hRightW = Math.max(74, hRightText.length * 7.5 + 16);
                      return (
                        <g className="pointer-events-none">
                          <line x1={rightAltX} y1="0" x2={rightAltX} y2={-hp} stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
                          <rect x={rightAltX - 12} y="-12" width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="1.8" />
                          <rect x={rightAltX + 8} y={-hp / 2 - 11} width={hRightW} height="22" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                          <text x={rightAltX + 8 + hRightW / 2} y={-hp / 2 + 4} textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                            {hRightText}
                          </text>
                        </g>
                      );
                    })()}

                    {/* Nhãn Đáy lớn a & Đáy nhỏ b trên Hình thang gốc */}
                    {(() => {
                      const aTrapText = `a = ${params.base} ${params.unit}`;
                      const aTrapW = Math.max(84, aTrapText.length * 7.5 + 18);
                      const bTrapTopText = `b = ${params.baseSmall} ${params.unit}`;
                      const bTrapTopW = Math.max(82, bTrapTopText.length * 7.5 + 18);
                      const bCenterX = demoMode === 1 ? bw / 2 : sbw / 2;
                      return (
                        <>
                          <rect x={bw / 2 - aTrapW / 2} y="12" width={aTrapW} height="22" rx="6" fill="#ffffff" stroke="#ddd6fe" strokeWidth="1.5" />
                          <text x={bw / 2} y="27" textAnchor="middle" className="text-xs font-black fill-purple-800 font-mono">
                            {aTrapText}
                          </text>

                          <rect
                            x={bCenterX - bTrapTopW / 2}
                            y={-hp - 30}
                            width={bTrapTopW}
                            height="22"
                            rx="6"
                            fill="#ffffff"
                            stroke="#ddd6fe"
                            strokeWidth="1.5"
                          />
                          <text
                            x={bCenterX}
                            y={-hp - 15}
                            textAnchor="middle"
                            className="text-xs font-black fill-purple-700 font-mono"
                          >
                            {bTrapTopText}
                          </text>
                        </>
                      );
                    })()}

                    {!isTrapAltComplete ? (
                      <text x={bw / 2} y={-hp / 2 + 5} textAnchor="middle" className="text-xs font-black fill-purple-900 pointer-events-none">
                        {demoMode === 1 ? 'Hình thang thường' : 'Hình thang vuông'}
                      </text>
                    ) : (
                      <text x={bw / 2} y={-hp / 2 + 5} textAnchor="middle" className="text-[11px] font-bold fill-purple-400 pointer-events-none">
                        Hình thang ban đầu
                      </text>
                    )}

                    {/* Đỉnh đáy lớn */}
                    <circle cx="0" cy="0" r="5" fill="#7c3aed" />
                    <circle cx={bw} cy="0" r="5" fill="#7c3aed" />

                    {/* Điểm kéo kẻ chiều cao trái (chỉ dùng cho 1. Hình thang thường) */}
                    {demoMode === 1 && !trapLeftAltDrawn ? (
                      <g
                        onMouseDown={(e) => handleTrapApexPointerDown('left', e)}
                        onTouchStart={(e) => handleTrapApexPointerDown('left', e)}
                        className="cursor-crosshair"
                      >
                        {activeApexSide === 'left' && (
                          <g className="pointer-events-none">
                            <line x1={leftAltX} y1={-hp} x2={leftAltX} y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                            <circle
                              cx={leftAltX}
                              cy="0"
                              r="12"
                              fill={isNearTrapRightAngle ? '#10b981' : '#f43f5e'}
                              fillOpacity="0.22"
                              stroke={isNearTrapRightAngle ? '#059669' : '#e11d48'}
                              strokeWidth="2"
                              strokeDasharray="3 2"
                            />
                          </g>
                        )}
                        <circle cx={leftAltX} cy={-hp} r="15" fill="#f43f5e" fillOpacity="0.18" className="animate-ping" />
                        <circle cx={leftAltX} cy={-hp} r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
                        <circle cx={leftAltX} cy={-hp} r="22" fill="transparent" />
                        <g transform={`translate(${leftAltX - 20}, ${-hp - 28})`} className="pointer-events-none">
                          <rect x="-66" y="-12" width="132" height="22" rx="8" fill="#be123c" opacity="0.95" />
                          <text x="0" y="3" textAnchor="middle" className="text-[10px] font-black fill-white">
                            ⬇ Kéo kẻ h₁ xuống đáy
                          </text>
                        </g>
                      </g>
                    ) : (
                      <circle cx={leftAltX} cy={-hp} r="5" fill="#7c3aed" />
                    )}

                    {/* Điểm kéo kẻ chiều cao phải (dùng cho cả 1. Hình thang thường & 2. Hình thang vuông) */}
                    {!trapRightAltDrawn ? (
                      <g
                        onMouseDown={(e) => handleTrapApexPointerDown('right', e)}
                        onTouchStart={(e) => handleTrapApexPointerDown('right', e)}
                        className="cursor-crosshair"
                      >
                        {activeApexSide === 'right' && (
                          <g className="pointer-events-none">
                            <line x1={rightAltX} y1={-hp} x2={rightAltX} y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                            <circle
                              cx={rightAltX}
                              cy="0"
                              r="12"
                              fill={isNearTrapRightAngle ? '#10b981' : '#f43f5e'}
                              fillOpacity="0.22"
                              stroke={isNearTrapRightAngle ? '#059669' : '#e11d48'}
                              strokeWidth="2"
                              strokeDasharray="3 2"
                            />
                          </g>
                        )}
                        <circle cx={rightAltX} cy={-hp} r="15" fill="#f43f5e" fillOpacity="0.18" className="animate-ping" />
                        <circle cx={rightAltX} cy={-hp} r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
                        <circle cx={rightAltX} cy={-hp} r="22" fill="transparent" />
                        <g transform={`translate(${rightAltX + 26}, ${-hp - 28})`} className="pointer-events-none">
                          <rect x="-70" y="-12" width="140" height="22" rx="8" fill="#be123c" opacity="0.95" />
                          <text x="0" y="3" textAnchor="middle" className="text-[10px] font-black fill-white">
                            {demoMode === 1 ? '⬇ Kéo kẻ h₂ xuống đáy' : '⬇ Kéo kẻ h chia hình'}
                          </text>
                        </g>
                      </g>
                    ) : (
                      <circle cx={rightAltX} cy={-hp} r="5" fill="#7c3aed" />
                    )}
                  </g>

                  {/* Nét vẽ đường cao tạm thời khi người dùng đang kéo trên Hình thang */}
                  {activeApexSide !== null && trapDrawPt && !isTrapAltComplete && (
                    <g className="pointer-events-none">
                      <line
                        x1={activeApexSvgX}
                        y1={activeApexSvgY}
                        x2={isNearTrapRightAngle ? activeFootSvgX : trapDrawPt.x}
                        y2={isNearTrapRightAngle ? activeFootSvgY : trapDrawPt.y}
                        stroke={isNearTrapRightAngle ? '#059669' : '#e11d48'}
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                      <circle
                        cx={isNearTrapRightAngle ? activeFootSvgX : trapDrawPt.x}
                        cy={isNearTrapRightAngle ? activeFootSvgY : trapDrawPt.y}
                        r="6"
                        fill={isNearTrapRightAngle ? '#10b981' : '#e11d48'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {isNearTrapRightAngle && (
                        <g transform={`translate(${activeFootSvgX}, ${activeFootSvgY})`}>
                          <rect x={activeApexSide === 'left' ? 0 : -12} y="-12" width="12" height="12" fill="none" stroke="#059669" strokeWidth="2" />
                          <rect x="-46" y="10" width="92" height="20" rx="6" fill="#065f46" />
                          <text x="0" y="24" textAnchor="middle" className="text-[10px] font-black fill-white">
                            ✓ Vuông góc 90°!
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* GIAI ĐOẠN 2: CÁC MẢNH ĐÃ CHIA TỪ HÌNH THANG ĐỂ KÉO THẢ */}
                  {isTrapAltComplete && (
                    <>
                      {/* Mảnh Hình chữ nhật ở giữa */}
                      <g
                        transform={`translate(${ox + trapRectOffset.x}, ${oy + trapRectOffset.y})`}
                        onMouseDown={(e) => handleTrapPiecePointerDown('rect', e)}
                        onTouchStart={(e) => handleTrapPiecePointerDown('rect', e)}
                        className={trapRectSnapped ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                        filter="url(#shapeShadow)"
                      >
                        <polygon
                          points={config.rectPoints}
                          fill="#8b5cf6"
                          fillOpacity={trapRectSnapped ? "0.32" : "0.45"}
                          stroke="#6d28d9"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {!trapRectSnapped ? (
                          <g className="pointer-events-none">
                            <text
                              x={(leftAltX + rightAltX) / 2}
                              y={-hp * 0.56}
                              textAnchor="middle"
                              className="text-xs font-black fill-purple-950"
                            >
                              Hình chữ nhật
                            </text>
                            <text
                              x={(leftAltX + rightAltX) / 2}
                              y={-hp * 0.4}
                              textAnchor="middle"
                              className="text-[10px] font-bold fill-purple-800"
                            >
                              ⬅ Kéo sang khung 1
                            </text>
                          </g>
                        ) : (
                          <text
                            x={(leftAltX + rightAltX) / 2}
                            y={-hp * 0.48}
                            textAnchor="middle"
                            className="text-xs font-black fill-purple-950 pointer-events-none"
                          >
                            S₁ = b × h
                          </text>
                        )}
                      </g>

                      {/* Mảnh Tam giác vuông trái (chế độ 1: Hình thang thường) */}
                      {demoMode === 1 && config.triLeftPoints && (
                        <g
                          transform={`translate(${ox + trapTriLeftOffset.x}, ${oy + trapTriLeftOffset.y})`}
                          onMouseDown={(e) => handleTrapPiecePointerDown('triLeft', e)}
                          onTouchStart={(e) => handleTrapPiecePointerDown('triLeft', e)}
                          className={trapTriLeftSnapped ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                          filter="url(#shapeShadow)"
                        >
                          <polygon
                            points={config.triLeftPoints}
                            fill="#0ea5e9"
                            fillOpacity={trapTriLeftSnapped ? "0.36" : "0.52"}
                            stroke="#0284c7"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          {!trapTriLeftSnapped ? (
                            <g className="pointer-events-none">
                              <text x="31" y={-hp * 0.36} textAnchor="middle" className="text-[10px] font-black fill-sky-950">
                                TG 1
                              </text>
                              <text x="31" y={-hp * 0.22} textAnchor="middle" className="text-[9px] font-bold fill-sky-900">
                                Kéo ➜
                              </text>
                            </g>
                          ) : (
                            <text x="34" y={-hp * 0.25} textAnchor="middle" className="text-[10px] font-black fill-sky-950 pointer-events-none">
                              TG 1
                            </text>
                          )}
                        </g>
                      )}

                      {/* Mảnh Tam giác vuông phải (cả 2 chế độ) */}
                      <g
                        transform={`translate(${ox + trapTriRightOffset.x}, ${oy + trapTriRightOffset.y})`}
                        onMouseDown={(e) => handleTrapPiecePointerDown('triRight', e)}
                        onTouchStart={(e) => handleTrapPiecePointerDown('triRight', e)}
                        className={trapTriRightSnapped ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                        filter="url(#shapeShadow)"
                      >
                        <polygon
                          points={config.triRightPoints}
                          fill="#10b981"
                          fillOpacity={trapTriRightSnapped ? "0.36" : "0.52"}
                          stroke="#059669"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {!trapTriRightSnapped ? (
                          <g className="pointer-events-none">
                            <text
                              x={demoMode === 1 ? 218 : 185}
                              y={-hp * 0.36}
                              textAnchor="middle"
                              className="text-[10px] font-black fill-emerald-950"
                            >
                              {demoMode === 1 ? 'TG 2' : 'Tam giác'}
                            </text>
                            <text
                              x={demoMode === 1 ? 218 : 185}
                              y={-hp * 0.22}
                              textAnchor="middle"
                              className="text-[9px] font-bold fill-emerald-900"
                            >
                              Kéo ➜
                            </text>
                          </g>
                        ) : (
                          <text
                            x={demoMode === 1 ? 217 : 185}
                            y={-hp * 0.25}
                            textAnchor="middle"
                            className="text-[10px] font-black fill-emerald-950 pointer-events-none"
                          >
                            {demoMode === 1 ? 'TG 2' : 'Tam giác'}
                          </text>
                        )}
                      </g>

                      {/* Banner rút ra công thức diện tích Hình thang sau khi ghép đủ các mảnh */}
                      {isTrapExploreComplete && (
                        <g transform="translate(335, 382)" className="pointer-events-none">
                          <rect x="-255" y="-4" width="510" height="46" rx="10" fill="#065f46" opacity="0.96" />
                          <text x="0" y="14" textAnchor="middle" className="text-[11px] font-extrabold fill-emerald-100 font-sans">
                            S(hình thang) = S(Hình chữ nhật) + S({demoMode === 1 ? '2 Tam giác vuông' : 'Tam giác vuông'})
                          </text>
                          <text x="0" y="33" textAnchor="middle" className="text-xs font-black fill-white font-mono">
                            = b×h + (a-b)×h:2 = (a + b) × h : 2 = {calculateArea()} {params.unit}²
                          </text>
                        </g>
                      )}
                    </>
                  )}
                </>
              );
            })()}

            {/* ================= 3. HÌNH TRÒN ================= */}
            {selectedShape === 'circle' && (
              demoMode === 1 ? (
                /* Tab 1: Chu vi hình tròn (Bán kính & Đường kính) */
                <g transform="translate(380, 232)" filter="url(#shapeShadow)">
                  {/* Đường tròn chính */}
                  <circle 
                    r="128" 
                    fill="#10b981" 
                    fillOpacity="0.14" 
                    stroke="#059669" 
                    strokeWidth="4" 
                  />
                  
                  {/* Vành chu vi phát sáng nhẹ */}
                  <circle 
                    r="128" 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="8" 
                    strokeOpacity="0.25"
                  />

                  {/* Bán kính r (đỏ từ tâm lên trên) */}
                  <line x1="0" y1="0" x2="0" y2="-128" stroke="#dc2626" strokeWidth="3" />
                  <circle cx="0" cy="0" r="5" fill="#dc2626" />
                  <circle cx="0" cy="-128" r="4" fill="#dc2626" />
                  
                  {/* Nhãn r */}
                  {(() => {
                    const rText = `r = ${params.radius} ${params.unit}`;
                    const rW = Math.max(82, rText.length * 7.5 + 18);
                    return (
                      <>
                        <rect x="10" y="-75" width={rW} height="24" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                        <text x={10 + rW / 2} y="-59" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                          {rText}
                        </text>
                      </>
                    );
                  })()}

                  {/* Đường kính d (xanh dương nét đứt nằm ngang) */}
                  <line x1="-128" y1="0" x2="128" y2="0" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" />
                  <circle cx="-128" cy="0" r="4" fill="#0284c7" />
                  <circle cx="128" cy="0" r="4" fill="#0284c7" />

                  {/* Nhãn d */}
                  <rect x="-55" y="12" width="110" height="24" rx="6" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
                  <text x="0" y="28" textAnchor="middle" className="text-xs font-black fill-sky-700 font-mono">
                    d = {params.radius * 2} {params.unit}
                  </text>
                  
                  {/* Nhãn Tâm O */}
                  <circle cx="0" cy="0" r="4" fill="#1e293b" />
                  <text x="-16" y="-8" className="text-sm font-black fill-slate-800 font-serif">O</text>

                  {/* Nhãn Chu vi C viền ngoài */}
                  <rect x="-95" y="142" width="190" height="26" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="159" textAnchor="middle" className="text-xs font-black fill-emerald-800 font-mono">
                    C = d × 3,14 = {calculateCircumference()} {params.unit}
                  </text>
                </g>
              ) : (() => {
                /* Tab 2: Khám phá Diện tích hình tròn — Cắt N phần bằng nhau (4, 8, 16, 32, 64) ghép hình chữ nhật */
                const N = circleSlices;
                const M = N / 2;
                const R = 104;
                const circX = 380;
                const circY = 228;
                const theta = (2 * Math.PI) / N;
                const halfTheta = theta / 2;

                // Path chuẩn 1 hình quạt đỉnh tại (0, 0), hướng lên trên (-90 độ)
                const arcX1 = -R * Math.sin(halfTheta);
                const arcY1 = -R * Math.cos(halfTheta);
                const arcX2 = R * Math.sin(halfTheta);
                const arcY2 = -R * Math.cos(halfTheta);
                const sectorPath = `M 0 0 L ${arcX1.toFixed(3)} ${arcY1.toFixed(3)} A ${R} ${R} 0 0 1 ${arcX2.toFixed(3)} ${arcY2.toFixed(3)} Z`;

                // Thông số hình ghép ở trạng thái 100%
                const step = 2 * R * Math.sin(halfTheta);
                const rectH = R * Math.cos(halfTheta);
                const startX = circX - ((M - 0.5) * step) / 2;
                const yBot = circY + rectH / 2;
                const yTop = circY - rectH / 2;

                // Tham số nội suy animation mượt (0..1)
                const u = circleMergeProgress / 100;
                const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
                const sep = Math.sin(u * Math.PI);

                // Tọa độ dấu ngoặc nhọn dưới đáy (chiều dài = 3,14 x r) & chiều rộng r
                const bx1 = startX;
                const bx2 = startX + M * step;
                const bmid = (bx1 + bx2) / 2;
                const sagitta = R - rectH;
                const yBrace = yBot + sagitta + 12;
                const bracePath = `M ${bx1} ${yBrace} Q ${bx1} ${yBrace + 10} ${bx1 + 12} ${yBrace + 10} L ${bmid - 10} ${yBrace + 10} Q ${bmid} ${yBrace + 10} ${bmid} ${yBrace + 18} Q ${bmid} ${yBrace + 10} ${bmid + 10} ${yBrace + 10} L ${bx2 - 12} ${yBrace + 10} Q ${bx2} ${yBrace + 10} ${bx2} ${yBrace}`;

                // Cạnh bên phải của miếng ngoài cùng để hiển thị bán kính r
                const sideTopX = startX + (M - 0.5) * step + 14;
                const sideTopY = yTop;
                const sideBotX = startX + M * step + 14;
                const sideBotY = yBot;
                const sideMidX = (sideTopX + sideBotX) / 2;
                const sideMidY = (sideTopY + sideBotY) / 2;

                const hintOpacity = Math.max(0, Math.min(1, (u - 0.65) / 0.3));
                const circleRadiusOpacity = Math.max(0, 1 - u * 3);

                return (
                  <g>
                    {/* Nhãn hai nửa hình tròn khi đang ở giữa quá trình tách */}
                    {u > 0.12 && u < 0.88 && (
                      <g className="pointer-events-none" opacity={sep}>
                        <rect x="305" y="72" width="150" height="22" rx="8" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.2" />
                        <text x="380" y="87" textAnchor="middle" className="text-[10px] font-black fill-teal-900">
                          Nửa trên ({M} miếng xanh ngọc)
                        </text>
                        <rect x="302" y="372" width="156" height="22" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
                        <text x="380" y="387" textAnchor="middle" className="text-[10px] font-black fill-amber-900">
                          Nửa dưới ({M} miếng vàng cam)
                        </text>
                      </g>
                    )}

                    {/* Các hình quạt cắt từ hình tròn: nửa trên (xanh ngọc) & nửa dưới (vàng cam nhạt) */}
                    <g filter="url(#shapeShadow)">
                      {/* Nửa trên (Teal) */}
                      {Array.from({ length: M }).map((_, i) => {
                        const alpha = -Math.PI + (i + 0.5) * theta;
                        const rotStart = (alpha * 180) / Math.PI + 90;
                        const rotEnd = 0;
                        const xEnd = startX + i * step;
                        const yEnd = yBot;
                        const x = circX + (xEnd - circX) * e;
                        const y = circY + (yEnd - circY) * e - 34 * sep;
                        const rot = rotStart + (rotEnd - rotStart) * e;
                        return (
                          <path
                            key={`top-${i}`}
                            d={sectorPath}
                            transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`}
                            fill={i % 2 === 0 ? "#2dd4bf" : "#14b8a6"}
                            fillOpacity="0.88"
                            stroke="#0f766e"
                            strokeWidth={N >= 32 ? "0.9" : "1.6"}
                            strokeLinejoin="round"
                          />
                        );
                      })}

                      {/* Nửa dưới (Warm Amber / Yellow) */}
                      {Array.from({ length: M }).map((_, k) => {
                        const j = M - 1 - k;
                        const alpha = (k + 0.5) * theta;
                        const rotStart = (alpha * 180) / Math.PI + 90;
                        const rotEnd = 180;
                        const xEnd = startX + (j + 0.5) * step;
                        const yEnd = yTop;
                        const x = circX + (xEnd - circX) * e;
                        const y = circY + (yEnd - circY) * e + 34 * sep;
                        const rot = rotStart + (rotEnd - rotStart) * e;
                        return (
                          <path
                            key={`bot-${k}`}
                            d={sectorPath}
                            transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`}
                            fill={k % 2 === 0 ? "#fcd34d" : "#fbbf24"}
                            fillOpacity="0.9"
                            stroke="#d97706"
                            strokeWidth={N >= 32 ? "0.9" : "1.6"}
                            strokeLinejoin="round"
                          />
                        );
                      })}
                    </g>

                    {/* Tâm O & Bán kính r trên hình tròn ban đầu (khi chưa tách) */}
                    {circleRadiusOpacity > 0.05 && (
                      <g className="pointer-events-none" opacity={circleRadiusOpacity}>
                        <line x1={circX} y1={circY} x2={circX + R} y2={circY} stroke="#dc2626" strokeWidth="3" />
                        <circle cx={circX} cy={circY} r="4.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={circX - 15} y={circY - 8} className="text-sm font-black fill-slate-900 font-serif">O</text>
                        {showCircleHints && (() => {
                          const r2Text = `r = ${params.radius} ${params.unit}`;
                          const r2W = Math.max(80, r2Text.length * 7.5 + 16);
                          return (
                            <>
                              <rect x={circX + R * 0.28} y={circY - 26} width={r2W} height="22" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                              <text x={circX + R * 0.28 + r2W / 2} y={circY - 11} textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                                {r2Text}
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    )}

                    {/* Kích thước & gợi ý khi đã ghép (Hiển thị kích thước & gợi ý Bật/Tắt) */}
                    {showCircleHints && hintOpacity > 0.02 && (
                      <g className="pointer-events-none" opacity={hintOpacity}>
                        {/* Dấu ngoặc nhọn chiều dài đáy = 3,14 x r */}
                        <path d={bracePath} fill="none" stroke="#0f766e" strokeWidth="2.4" strokeLinecap="round" />
                        <rect x={bmid - 92} y={yBrace + 22} width="184" height="26" rx="8" fill="#ffffff" stroke="#14b8a6" strokeWidth="1.8" />
                        <text x={bmid} y={yBrace + 39} textAnchor="middle" className="text-xs font-black fill-teal-900 font-mono">
                          3,14 × r (= {(params.radius * 3.14).toFixed(1)} {params.unit})
                        </text>

                        {/* Nhãn chiều rộng = r ở cạnh bên */}
                        <line x1={sideTopX} y1={sideTopY} x2={sideBotX} y2={sideBotY} stroke="#dc2626" strokeWidth="2.4" />
                        <line x1={sideTopX - 5} y1={sideTopY} x2={sideTopX + 5} y2={sideTopY} stroke="#dc2626" strokeWidth="2" />
                        <line x1={sideBotX - 5} y1={sideBotY} x2={sideBotX + 5} y2={sideBotY} stroke="#dc2626" strokeWidth="2" />
                        <rect x={sideMidX + 10} y={sideMidY - 13} width="76" height="24" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.6" />
                        <text x={sideMidX + 48} y={sideMidY + 3} textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                          r = {params.radius} {params.unit}
                        </text>

                        {/* Khung nét đứt minh họa hình chữ nhật chuẩn khi N >= 16 */}
                        {N >= 16 && u > 0.92 && (
                          <rect
                            x={startX - step / 2}
                            y={yTop}
                            width={(M + 0.5) * step}
                            height={rectH}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            rx="2"
                          />
                        )}
                      </g>
                    )}
                  </g>
                );
              })()
            )}
          </svg>

          {/* HỘP THOẠI KHÁM PHÁ CÔNG THỨC DIỆN TÍCH HÌNH TRÒN */}
          {selectedShape === 'circle' && demoMode === 2 && showCircleFormulaModal && (
            <div className="absolute inset-0 z-30 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border-2 border-emerald-400 shadow-2xl max-w-lg w-full p-5 relative animate-in zoom-in-95">
                <button
                  onClick={() => setShowCircleFormulaModal(false)}
                  className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Đóng hộp thoại"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-950">Gợi ý khám phá công thức</h4>
                    <p className="text-[11px] font-bold text-teal-700">Diện tích hình tròn (Toán 5)</p>
                  </div>
                </div>
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-sm text-slate-800 leading-relaxed mb-3">
                  Khi chia hình tròn thành càng nhiều phần nhỏ, hình ghép được càng giống <strong>hình chữ nhật</strong> có chiều dài = <strong className="text-teal-800">3,14 × r</strong> và chiều rộng = <strong className="text-rose-600">r</strong>. Vậy Diện tích hình tròn = <strong className="text-emerald-800">(3,14 × r) × r = r × r × 3,14</strong>.
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-mono text-amber-950 mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span>Với bán kính <strong>r = {params.radius} {params.unit}</strong>:</span>
                  <span className="font-black text-emerald-800">
                    S = {params.radius} × {params.radius} × 3,14 = {calculateArea().toLocaleString('vi-VN')} {params.unit}²
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowCircleFormulaModal(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    Em đã hiểu!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NHÂN VẬT ĐỒNG HÀNH Ở GÓC DƯỚI BÊN PHẢI BẢNG */}
          <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
            <MascotCompanion 
              message={
                selectedShape === 'circle' 
                  ? demoMode === 1
                    ? "Đường kính dài gấp 2 lần bán kính: d = r × 2 đấy các em!" 
                    : circleMergeProgress === 0
                      ? `Hình tròn đang chia thành ${circleSlices} phần! Hãy kéo thanh trượt hoặc bấm "Cắt và ghép" nhé!`
                      : circleMergeProgress < 100
                        ? "Quan sát hai nửa xanh ngọc và vàng cam tách ra rồi đan xen vào nhau nhé!"
                        : circleSlices <= 8
                          ? `Đã ghép ${circleSlices} miếng! Hãy kéo mốc lên 16, 32 hoặc 64 phần để thấy giống hình chữ nhật hơn nhé!`
                          : `Tuyệt vời! Ghép ${circleSlices} phần tạo thành hình giống hình chữ nhật dài 3,14 × r, rộng r!`
                  : selectedShape === 'triangle'
                    ? !isAltitudeDrawn
                      ? "Em hãy kéo từ đỉnh xuống vuông góc với đáy để kẻ chiều cao h nhé!"
                      : isTriangleRectComplete
                        ? "Tuyệt vời! Hình chữ nhật có S = a × h gấp đôi tam giác nên S(tam giác) = (a × h) : 2!"
                        : "Kéo các mảnh ghép vào khung để tạo thành Hình chữ nhật nhé!"
                    : !isTrapAltComplete
                      ? "Em hãy tự kéo từ đỉnh đáy nhỏ xuống vuông góc với đáy lớn để kẻ chiều cao h nhé!"
                      : isTrapExploreComplete
                        ? `Tuyệt vời! Hình thang = Hình chữ nhật + ${demoMode === 1 ? '2 Tam giác vuông' : 'Tam giác vuông'} ➜ S = (a + b) × h : 2!`
                        : "Kéo Hình chữ nhật sang trái và Tam giác vuông sang phải để tính tổng diện tích nhé!"
              }
              subMessage={
                selectedShape === 'circle' && demoMode === 2 && circleMergeProgress >= 95 && circleSlices >= 16
                  ? "Rút ra: S = (3,14 × r) × r = r × r × 3,14"
                  : selectedShape === 'triangle' && isTriangleRectComplete
                    ? "Rút ra: S = (đáy × chiều cao) : 2"
                    : selectedShape === 'trapezoid' && isTrapExploreComplete
                      ? "Rút ra: S = (đáy lớn + đáy nhỏ) × chiều cao : 2"
                      : undefined
              }
              isHappy={
                selectedShape === 'circle'
                  ? demoMode === 2 && circleMergeProgress >= 95
                  : selectedShape === 'triangle'
                    ? isTriangleRectComplete
                    : isTrapExploreComplete
              }
            />
          </div>

          </div>

          {/* BẢNG ĐIỀU KHIỂN TRỰC QUAN CHO TAB "KHÁM PHÁ DIỆN TÍCH HÌNH TRÒN" */}
          {selectedShape === 'circle' && demoMode === 2 && (
            <div className="bg-white/95 backdrop-blur-md border-t-2 border-emerald-100 px-4 py-3.5 z-20">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
                
                {/* Thanh trượt 1: Chia hình tròn thành 4, 8, 16, 32, 64 phần */}
                <div className="xl:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl px-3.5 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <SlidersHorizontal size={13} className="text-emerald-600" />
                      Chia hình tròn thành các phần bằng nhau:
                    </span>
                    <span className="text-xs font-black text-white bg-emerald-600 px-2 py-0.5 rounded-lg">
                      {circleSlices} phần
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={CIRCLE_SLICE_OPTIONS.length - 1}
                    step={1}
                    value={circleSliceIdx}
                    onChange={(e) => setCircleSliceIdx(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 rounded-lg"
                  />
                  <div className="flex justify-between mt-1">
                    {CIRCLE_SLICE_OPTIONS.map((count, idx) => (
                      <button
                        key={count}
                        onClick={() => setCircleSliceIdx(idx)}
                        className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                          circleSliceIdx === idx
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nút bấm + Thanh trượt 2: Cắt và ghép thành hình mới (0% - 100%) */}
                <div className="xl:col-span-4 bg-teal-50/70 border border-teal-200 rounded-2xl px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <button
                      onClick={() => setIsCircleAnimating(true)}
                      disabled={isCircleAnimating}
                      className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {circleMergeProgress >= 99 ? <RotateCcw size={12} /> : <Play size={12} />}
                      {circleMergeProgress >= 99 ? 'Thu về hình tròn' : 'Cắt và ghép thành hình mới'}
                    </button>
                    <span className="text-xs font-black text-teal-800 font-mono">
                      {circleMergeProgress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={circleMergeProgress}
                    onChange={(e) => {
                      setIsCircleAnimating(false);
                      setCircleMergeProgress(Number(e.target.value));
                    }}
                    className="w-full accent-teal-600 cursor-pointer h-2 bg-teal-200 rounded-lg"
                  />
                </div>

                {/* Ô chọn Hiển thị kích thước & gợi ý + Nút Khám phá công thức */}
                <div className="xl:col-span-3 flex flex-row xl:flex-col gap-2 justify-between">
                  <label className="flex items-center gap-2 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={showCircleHints}
                      onChange={(e) => setShowCircleHints(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Eye size={13} className="text-emerald-600" />
                      Hiển thị kích thước & gợi ý
                    </span>
                  </label>
                  <button
                    onClick={() => setShowCircleFormulaModal(true)}
                    className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Lightbulb size={14} />
                    Khám phá công thức
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ================= THÔNG TIN GIẢI THÍCH & CÁCH TÍNH CHI TIẾT ================= */}
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Cột 1: Kí hiệu & Công thức */}
          <div className="bg-sky-50/70 p-4 md:p-5 rounded-2xl border border-sky-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sky-900 font-extrabold text-sm mb-3 flex items-center gap-2">
                <Info size={17} className="text-sky-600" /> 
                {info.title} - Kí hiệu & Công thức
              </h4>
              
              <div className="bg-white p-3.5 rounded-xl border border-sky-100 text-center shadow-xs min-h-[90px] flex items-center justify-center mb-3">
                <div className="text-2xl font-black text-sky-800 tracking-tight">
                  {info.formula}
                </div>
              </div>

              {selectedShape === 'triangle' && (
                <div className={`p-3 rounded-xl border mb-3 text-xs leading-relaxed transition-all ${
                  isTriangleRectComplete
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-white/90 border-sky-200 text-slate-700'
                }`}>
                  <p className="font-black text-sky-900 mb-1 flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-500" />
                    Khám phá từ Hình chữ nhật:
                  </p>
                  <p>
                    Ghép <strong>2 hình tam giác bằng nhau</strong> thành <strong>Hình chữ nhật</strong> có chiều dài bằng đáy <strong>a</strong>, chiều rộng bằng chiều cao <strong>h</strong>. Vì diện tích hình chữ nhật là <strong>a × h</strong> nên diện tích một hình tam giác là <strong>(a × h) : 2</strong>.
                  </p>
                </div>
              )}

              {selectedShape === 'trapezoid' && (
                <div className={`p-3 rounded-xl border mb-3 text-xs leading-relaxed transition-all ${
                  isTrapExploreComplete
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-white/90 border-purple-200 text-slate-700'
                }`}>
                  <p className="font-black text-purple-900 mb-1 flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-500" />
                    Khám phá từ Hình chữ nhật & 2 Tam giác vuông:
                  </p>
                  <p>
                    Kẻ đường cao <strong>h</strong> chia hình thang thành <strong>1 Hình chữ nhật</strong> (diện tích <strong>b × h</strong>) và <strong>{demoMode === 1 ? '2 Tam giác vuông' : '1 Tam giác vuông'}</strong> ghép lại có đáy <strong>(a - b)</strong> (diện tích <strong>(a - b) × h : 2</strong>). Cộng lại ta được: <strong>S = b × h + (a - b) × h : 2 = (a + b) × h : 2</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {info.labels.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white/80 px-2.5 py-1.5 rounded-lg border border-sky-100/80">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-md font-black text-xs shrink-0 ${item.color}`}>
                    {item.key}
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2: Cách tính chi tiết (Số liệu gốc) HOẶC Bảng giải tương tác (Khi đổi số đo) */}
          {isInitialData() ? (
            <div className="bg-emerald-50/70 p-4 md:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-emerald-900 font-extrabold text-sm flex items-center gap-2">
                    <Calculator size={17} className="text-emerald-600" /> 
                    Bài giải mẫu chi tiết
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Số liệu mẫu gốc
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs min-h-[85px] flex flex-col justify-center mb-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Thay số vào công thức:</p>
                  <div className="text-emerald-900 font-bold">
                    {info.step}
                  </div>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Em có biết:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi số đo ngẫu nhiên"</em> ở cột bên trái, bảng này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em tự thực hành và kiểm tra kết quả!
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                  <Tag size={11} /> {info.resultLabel}
                </span>
                {selectedShape === 'circle' ? (
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 mr-1.5">S =</span>
                      <span className="text-2xl font-black text-amber-600">{calculateArea().toLocaleString('vi-VN')}</span>
                      <span className="text-xs font-bold text-amber-600 ml-1">{params.unit}²</span>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-200"></div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 mr-1.5">C =</span>
                      <span className="text-2xl font-black text-emerald-700">{calculateCircumference().toLocaleString('vi-VN')}</span>
                      <span className="text-xs font-bold text-emerald-700 ml-1">{params.unit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-700 tracking-tight">
                      {calculateArea().toLocaleString('vi-VN')}
                    </span>
                    <span className="text-base font-extrabold text-emerald-600 ml-1.5">{params.unit}²</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* BẢNG GIẢI TƯƠNG TÁC CHO HỌC SINH */
            <div className="bg-amber-50/60 p-4 md:p-5 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-amber-950 font-extrabold text-sm flex items-center gap-2">
                    <Edit3 size={17} className="text-amber-600" /> 
                    Bảng giải tương tác cho học sinh
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    Em tự thực hành
                  </span>
                </div>

                {/* Đề bài tóm tắt */}
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs mb-3 text-xs leading-relaxed text-slate-800">
                  <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Đề bài luyện tập:
                  </p>
                  {selectedShape === 'triangle' && (
                    <p>Cho hình tam giác có độ dài cạnh đáy <strong>a = {params.base} {params.unit}</strong> và chiều cao tương ứng <strong>h = {params.height} {params.unit}</strong>. Em hãy tính diện tích hình tam giác.</p>
                  )}
                  {selectedShape === 'trapezoid' && (
                    <p>Cho hình thang có đáy lớn <strong>a = {params.base} {params.unit}</strong>, đáy bé <strong>b = {params.baseSmall} {params.unit}</strong> và chiều cao <strong>h = {params.height} {params.unit}</strong>. Em hãy tính diện tích hình thang.</p>
                  )}
                  {selectedShape === 'circle' && (
                    <p>Cho hình tròn có bán kính <strong>r = {params.radius} {params.unit}</strong>. Em hãy tính chu vi (C) và diện tích (S) hình tròn.</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Gợi ý: {selectedShape === 'triangle' ? 'S = (a × h) : 2' : selectedShape === 'trapezoid' ? 'S = (a + b) × h : 2' : 'C = r × 2 × 3,14 | S = r × r × 3,14'}
                  </p>
                </div>

                {/* Khu vực học sinh nhập kết quả */}
                {selectedShape === 'circle' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Nhập Chu vi (C):</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Ví dụ: 31.4"
                          value={userCircumInput}
                          onChange={(e) => { setUserCircumInput(e.target.value); setPracticeResult(null); }}
                          disabled={practiceResult?.isCorrect}
                          className="w-full text-sm font-black text-emerald-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-mono"
                        />
                        <span className="text-xs font-bold text-slate-500 shrink-0">{params.unit}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Nhập Diện tích (S):</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Ví dụ: 78.5"
                          value={userAreaInput}
                          onChange={(e) => { setUserAreaInput(e.target.value); setPracticeResult(null); }}
                          disabled={practiceResult?.isCorrect}
                          className="w-full text-sm font-black text-amber-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-mono"
                        />
                        <span className="text-xs font-bold text-slate-500 shrink-0">{params.unit}²</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-amber-200 mb-3">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Nhập kết quả Diện tích (S) của em:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nhập kết quả tính được..."
                        value={userAreaInput}
                        onChange={(e) => { setUserAreaInput(e.target.value); setPracticeResult(null); }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-base font-black text-amber-900 bg-amber-50/40 p-2.5 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-sm font-black text-slate-600 shrink-0 px-2.5 py-2 bg-slate-100 rounded-lg">{params.unit}²</span>
                    </div>
                  </div>
                )}

                {/* Kết quả phản hồi đúng / sai */}
                {practiceResult?.isChecked && (
                  <div className={`p-3 rounded-xl mb-3 border text-xs ${
                    practiceResult.isCorrect 
                      ? 'bg-emerald-500 text-white border-emerald-600 animate-in zoom-in-95' 
                      : 'bg-rose-50 text-rose-900 border-rose-300 animate-in shake'
                  }`}>
                    {practiceResult.isCorrect ? (
                      <div className="space-y-1.5">
                        <p className="font-black text-sm flex items-center gap-1.5">
                          <CheckCircle2 size={18} className="text-white" />
                          Hoan hô! Em đã tính hoàn toàn chính xác! 🎉
                        </p>
                        <div className="bg-white/20 p-2 rounded-lg font-mono text-white text-[11px]">
                          {selectedShape === 'circle' ? (
                            <>
                              <p>✓ C = {params.radius * 2} × 3,14 = {calculateCircumference()} {params.unit}</p>
                              <p>✓ S = {params.radius} × {params.radius} × 3,14 = {calculateArea()} {params.unit}²</p>
                            </>
                          ) : selectedShape === 'triangle' ? (
                            <p>✓ S = ({params.base} × {params.height}) : 2 = {calculateArea()} {params.unit}²</p>
                          ) : (
                            <p>✓ S = ({params.base} + {params.baseSmall}) × {params.height} : 2 = {calculateArea()} {params.unit}²</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                          <XCircle size={18} className="text-rose-600" />
                          Kết quả chưa chính xác rồi! Em hãy tính nháp lại nhé.
                        </p>
                        <p className="text-rose-800">
                          Hãy kiểm tra lại thứ tự thực hiện phép tính và số dư nhân/chia nhé!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              <div className="space-y-2 pt-2 border-t border-amber-200/80">
                {!practiceResult?.isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userAreaInput && (selectedShape !== 'circle' || !userCircumInput)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Check size={18} />
                    Kiểm tra kết quả
                  </button>
                ) : practiceResult.isCorrect ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={generateRandom}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} /> Thử số khác
                    </button>
                    <button
                      onClick={resetToInitialData}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Về bài giải mẫu
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRetry}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Làm lại
                    </button>
                    <button
                      onClick={resetToInitialData}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <Calculator size={14} /> Xem bài mẫu
                    </button>
                  </div>
                )}

                <button
                  onClick={resetToInitialData}
                  className="w-full text-center text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline pt-1 block"
                >
                  ← Khôi phục số liệu gốc (Hiển thị lại bài giải chi tiết mẫu)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shape2DPanel;
