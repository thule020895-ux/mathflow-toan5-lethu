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
  MoveHorizontal
} from 'lucide-react';
import { ShapeType } from '../types';
import MascotCompanion from './MascotCompanion';

// Số liệu ban đầu mặc định của từng hình
const INITIAL_2D_PARAMS = {
  triangle: { base: 12, height: 8 },
  trapezoid: { base: 12, height: 8, baseSmall: 8 },
  circle: { radius: 5 }
};

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
      // A=(0,0), B=(200,0), C=(140,-160)
      // M trên BC = (170, -80) => 2M = (340, -160)
      return {
        points: "0,0 200,0 140,-160",
        targetDX: 340,
        targetDY: -160,
        separatedPos1: { x: 110, y: 310 },
        separatedPos2: { x: 650, y: 150 },
        snappedPos1: { x: 210, y: 310 },
        snappedPos2: { x: 550, y: 150 },
        altitudeX: 140,
        altitudeBottomX: 140,
        isAltitudeOutside: false
      };
    }
    if (mode === 2) {
      // 2. Tam giác tù (chiều cao rơi ra ngoài cạnh đáy)
      // A=(0,0), B=(200,0), C=(-60,-160)
      // M trên BC = (70, -80) => 2M = (140, -160)
      return {
        points: "0,0 200,0 -60,-160",
        targetDX: 140,
        targetDY: -160,
        separatedPos1: { x: 150, y: 310 },
        separatedPos2: { x: 610, y: 150 },
        snappedPos1: { x: 280, y: 310 },
        snappedPos2: { x: 420, y: 150 },
        altitudeX: -60,
        altitudeBottomX: -60,
        isAltitudeOutside: true
      };
    }
    // 3. Tam giác vuông
    // A=(0,0), B=(200,0), C=(200,-160)
    // M trên BC = (200, -80) => 2M = (400, -160)
    return {
      points: "0,0 200,0 200,-160",
      targetDX: 400,
      targetDY: -160,
      separatedPos1: { x: 110, y: 310 },
      separatedPos2: { x: 650, y: 150 },
      snappedPos1: { x: 180, y: 310 },
      snappedPos2: { x: 580, y: 150 },
      altitudeX: 200,
      altitudeBottomX: 200,
      isAltitudeOutside: false
    };
  }

  if (shape === 'trapezoid') {
    if (mode === 1) {
      // 1. Hình thang thường
      // A=(0,0), B=(250,0), C=(200,-160), D=(50,-160)
      // M trên BC = ((250+200)/2, -80) = (225, -80) => 2M = (450, -160)
      return {
        points: "0,0 250,0 200,-160 50,-160",
        targetDX: 450,
        targetDY: -160,
        separatedPos1: { x: 80, y: 310 },
        separatedPos2: { x: 680, y: 150 },
        snappedPos1: { x: 155, y: 310 },
        snappedPos2: { x: 605, y: 150 },
        altitudeX: 50,
        altitudeBottomX: 50,
        isAltitudeOutside: false
      };
    }
    // 2. Hình thang vuông
    // A=(0,0), B=(250,0), C=(250,-160), D=(100,-160)
    // M trên BC = (250, -80) => 2M = (500, -160)
    return {
      points: "0,0 250,0 250,-160 100,-160",
      targetDX: 500,
      targetDY: -160,
      separatedPos1: { x: 80, y: 310 },
      separatedPos2: { x: 680, y: 150 },
      snappedPos1: { x: 130, y: 310 },
      snappedPos2: { x: 630, y: 150 },
      altitudeX: 100,
      altitudeBottomX: 100,
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
  const [demoMode, setDemoMode] = useState<1 | 2 | 3>(1); 
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

  // Vị trí tọa độ 2 mảnh
  const initialConfig = getShapeConfig(selectedShape, demoMode);
  const [pos1, setPos1] = useState(initialConfig.separatedPos1);
  const [pos2, setPos2] = useState(initialConfig.separatedPos2);
  
  const [activeShape, setActiveShape] = useState<1 | 2 | null>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<SVGSVGElement>(null);

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
    setPos1(cfg.separatedPos1);
    setPos2(cfg.separatedPos2);
    setIsSnapped(false);
    setActiveShape(null);
  }, [selectedShape, demoMode]);

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

  const handleMouseDown = (shapeId: 1 | 2, e: React.MouseEvent | React.TouchEvent) => {
    const pt = getSVGPoint(e);
    if (!pt) return;

    if (isSnapped) {
      setActiveShape(1);
      dragStartOffset.current = {
        x: pt.x - pos1.x,
        y: pt.y - pos1.y
      };
    } else {
      setActiveShape(shapeId);
      const currentPos = shapeId === 1 ? pos1 : pos2;
      dragStartOffset.current = {
        x: pt.x - currentPos.x,
        y: pt.y - currentPos.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeShape === null) return;
    const pt = getSVGPoint(e);
    if (!pt) return;

    const rawX = pt.x - dragStartOffset.current.x;
    const rawY = pt.y - dragStartOffset.current.y;

    // Giữ an toàn trong vùng vẽ SVG (0 đến 760, 0 đến 460)
    const newPos = {
      x: Math.max(20, Math.min(rawX, 740)),
      y: Math.max(70, Math.min(rawY, 410))
    };

    if (isSnapped) {
      const dx = newPos.x - pos1.x;
      const dy = newPos.y - pos1.y;
      setPos1(newPos);
      setPos2(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else {
      if (activeShape === 1) setPos1(newPos);
      else setPos2(newPos);
    }
  };

  const handleMouseUp = () => {
    if (activeShape === null) return;
    const cfg = getShapeConfig(selectedShape, demoMode);
    
    const currentDX = pos2.x - pos1.x;
    const currentDY = pos2.y - pos1.y;

    // Hút nam châm khi kéo gần vị trí ghép chuẩn (sai số < 55px)
    if (!isSnapped && Math.abs(currentDX - cfg.targetDX) < 55 && Math.abs(currentDY - cfg.targetDY) < 55) {
      setPos1(cfg.snappedPos1);
      setPos2(cfg.snappedPos2);
      setIsSnapped(true);
    }

    setActiveShape(null);
  };

  // Đặt lại 2 mảnh tách rời cân đối 2 bên
  const resetPuzzle = () => {
    const cfg = getShapeConfig(selectedShape, demoMode);
    setPos1(cfg.separatedPos1);
    setPos2(cfg.separatedPos2);
    setIsSnapped(false);
    setActiveShape(null);
  };

  // Nút bấm chuyển đổi nhanh Ghép hình / Tách mảnh
  const toggleSnap = () => {
    const cfg = getShapeConfig(selectedShape, demoMode);
    if (isSnapped) {
      setPos1(cfg.separatedPos1);
      setPos2(cfg.separatedPos2);
      setIsSnapped(false);
    } else {
      setPos1(cfg.snappedPos1);
      setPos2(cfg.snappedPos2);
      setIsSnapped(true);
    }
  };

  const generateRandom = () => {
    const randomVal = () => Math.floor(Math.random() * 20) + 5;
    setParams({
      ...params,
      base: randomVal(),
      height: randomVal(),
      baseSmall: Math.floor(Math.random() * 10) + 5,
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
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  1. Bán kính (r) & Đường kính (d)
                </button>
                <button 
                  onClick={() => setDemoMode(2)} 
                  className={`py-2 px-3 text-xs font-bold rounded-lg text-left transition-all ${
                    demoMode === 2 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2. Cắt 16 nan quạt ghép hình chữ nhật
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
          {selectedShape !== 'circle' && (
            <button 
              onClick={toggleSnap} 
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xs transition-all active:scale-[0.98] ${
                isSnapped
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md'
              }`}
            >
              {isSnapped ? <RefreshCw size={16} /> : <CheckCircle2 size={16} />}
              {isSnapped ? 'Tách rời 2 mảnh hình' : 'Ghép thành hình bình hành ngay'}
            </button>
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
        <div className="w-full aspect-[16/10] md:min-h-[460px] math-grid-bg rounded-3xl border-2 border-sky-200 shadow-md board-shadow relative flex items-center justify-center overflow-hidden">
          
          {/* Header Bảng tương tác */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none max-w-[70%]">
            <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md w-fit">
              <Sparkles size={14} className="text-amber-300" />
              BẢNG TƯƠNG TÁC HÌNH HỌC
            </div>
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 border border-sky-100 shadow-xs flex items-center gap-2 w-fit">
              <MousePointer2 size={13} className="text-sky-600 shrink-0" />
              {selectedShape !== 'circle' ? (
                isSnapped ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" /> Đã ghép thành công thành hình bình hành!
                  </span>
                ) : (
                  <span>Kéo mảnh số 2 ghép với mảnh 1 (hoặc bấm nút "Ghép hình") để khám phá công thức!</span>
                )
              ) : demoMode === 1 ? (
                <span>Khám phá bán kính (r) và đường kính (d = r × 2) trên mặt phẳng tọa độ ô ly</span>
              ) : (
                <span className="text-amber-900 font-extrabold">Cắt ghép 16 nan quạt thành hình chữ nhật để chứng minh S = r × r × 3,14!</span>
              )}
            </div>
          </div>

          {/* Nút hành động nhanh trên góc phải bảng tương tác */}
          {selectedShape !== 'circle' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={toggleSnap}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSnapped
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSnapped ? <RefreshCw size={14} /> : <CheckCircle2 size={14} />}
                {isSnapped ? 'Tách rời mảnh' : 'Ghép hình ngay'}
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

            {/* ================= 1. HÌNH TAM GIÁC ================= */}
            {selectedShape === 'triangle' && (
              <>
                {/* Đường nối hướng dẫn khi chưa ghép */}
                {!isSnapped && (
                  <g opacity="0.45" strokeDasharray="4 4" stroke="#0284c7" strokeWidth="1.5">
                    <line x1={pos1.x + 200} y1={pos1.y} x2={pos2.x - 200} y2={pos2.y} />
                    <text 
                      x={(pos1.x + 200 + pos2.x - 200) / 2} 
                      y={pos1.y - 10} 
                      textAnchor="middle" 
                      className="text-[10px] font-bold fill-sky-700 font-mono"
                    >
                      Kéo ghép tại đây ➜
                    </text>
                  </g>
                )}

                {/* Mảnh 1 (Tam giác gốc) */}
                <g 
                  transform={`translate(${pos1.x}, ${pos1.y})`} 
                  onMouseDown={(e) => handleMouseDown(1, e)} 
                  onTouchStart={(e) => handleMouseDown(1, e)} 
                  className="cursor-grab active:cursor-grabbing transition-opacity"
                  filter="url(#shapeShadow)"
                >
                  <polygon 
                    points={config.points} 
                    fill="#0284c7" 
                    fillOpacity={isSnapped ? "0.25" : "0.32"} 
                    stroke="#0284c7" 
                    strokeWidth="3.5" 
                    strokeLinejoin="round"
                  />

                  {/* Đoạn kéo dài cạnh đáy cho tam giác tù */}
                  {demoMode === 2 && (
                    <line 
                      x1="0" 
                      y1="0" 
                      x2="-60" 
                      y2="0" 
                      stroke="#dc2626" 
                      strokeWidth="2" 
                      strokeDasharray="4 4" 
                    />
                  )}

                  {/* Đường cao h */}
                  <line 
                    x1={config.altitudeX} 
                    y1="0" 
                    x2={config.altitudeX} 
                    y2="-160" 
                    stroke="#dc2626" 
                    strokeWidth="3" 
                    strokeDasharray="6 4" 
                  />

                  {/* Ký hiệu góc vuông chân đường cao */}
                  <rect 
                    x={config.altitudeX > 0 ? config.altitudeX - 12 : config.altitudeX} 
                    y="-12" 
                    width="12" 
                    height="12" 
                    fill="none" 
                    stroke="#dc2626" 
                    strokeWidth="1.5" 
                  />

                  {/* Nhãn chiều cao h */}
                  <rect 
                    x={config.altitudeX > 0 ? config.altitudeX + 8 : config.altitudeX - 60} 
                    y="-92" 
                    width="54" 
                    height="22" 
                    rx="6" 
                    fill="#ffffff" 
                    stroke="#fca5a5" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x={config.altitudeX > 0 ? config.altitudeX + 35 : config.altitudeX - 33} 
                    y="-77" 
                    textAnchor="middle" 
                    className="text-xs font-black fill-rose-600 font-mono"
                  >
                    h = {params.height}
                  </text>
                  
                  {/* Nhãn cạnh đáy a */}
                  <rect 
                    x="75" 
                    y="14" 
                    width="54" 
                    height="22" 
                    rx="6" 
                    fill="#ffffff" 
                    stroke="#bae6fd" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x="102" 
                    y="29" 
                    textAnchor="middle" 
                    className="text-xs font-black fill-sky-800 font-mono"
                  >
                    a = {params.base}
                  </text>

                  {/* Nhãn mảnh số 1 */}
                  {!isSnapped && (
                    <text 
                      x="90" 
                      y="-45" 
                      textAnchor="middle" 
                      className="text-xs font-black fill-sky-900 pointer-events-none"
                    >
                      Mảnh 1 (gốc)
                    </text>
                  )}

                  {/* Các đỉnh A, B, C */}
                  <circle cx="0" cy="0" r="5" fill="#0284c7" />
                  <circle cx="200" cy="0" r="5" fill="#0284c7" />
                  <circle cx={config.altitudeX} cy="-160" r="5" fill="#0284c7" />
                </g>

                {/* Mảnh 2 (Tam giác ghép quay 180 độ) */}
                <g 
                  transform={`translate(${pos2.x}, ${pos2.y}) rotate(180)`} 
                  onMouseDown={(e) => handleMouseDown(2, e)} 
                  onTouchStart={(e) => handleMouseDown(2, e)} 
                  className="cursor-grab active:cursor-grabbing"
                  filter="url(#shapeShadow)"
                >
                  <polygon 
                    points={config.points} 
                    fill={isSnapped ? "#10b981" : "#38bdf8"} 
                    fillOpacity={isSnapped ? "0.25" : "0.5"} 
                    stroke={isSnapped ? "#059669" : "#0284c7"} 
                    strokeWidth="3.5" 
                    strokeLinejoin="round"
                    strokeDasharray={isSnapped ? "none" : "8 4"}
                  />
                  {!isSnapped && (
                    <text 
                      x="100" 
                      y="-50" 
                      transform="rotate(180 100 -50)"
                      textAnchor="middle" 
                      className="text-xs font-black fill-sky-900 pointer-events-none"
                    >
                      Mảnh 2 (quay 180°)
                    </text>
                  )}
                </g>

                {/* Banner giải thích khi ghép thành công */}
                {isSnapped && (
                  <g transform={`translate(${pos1.x + 100}, ${pos1.y - 180})`}>
                    <rect 
                      x="-130" 
                      y="-25" 
                      width="260" 
                      height="26" 
                      rx="8" 
                      fill="#065f46" 
                      opacity="0.9"
                    />
                    <text 
                      x="0" 
                      y="-8" 
                      textAnchor="middle" 
                      className="text-xs font-black fill-emerald-100 font-sans"
                    >
                      ✓ Hình bình hành: Đáy = a, Chiều cao = h
                    </text>
                  </g>
                )}
              </>
            )}

            {/* ================= 2. HÌNH THANG ================= */}
            {selectedShape === 'trapezoid' && (
              <>
                {/* Đường nối hướng dẫn khi chưa ghép */}
                {!isSnapped && (
                  <g opacity="0.45" strokeDasharray="4 4" stroke="#7c3aed" strokeWidth="1.5">
                    <line x1={pos1.x + 250} y1={pos1.y} x2={pos2.x - 250} y2={pos2.y} />
                    <text 
                      x={(pos1.x + 250 + pos2.x - 250) / 2} 
                      y={pos1.y - 10} 
                      textAnchor="middle" 
                      className="text-[10px] font-bold fill-purple-700 font-mono"
                    >
                      Kéo ghép tại đây ➜
                    </text>
                  </g>
                )}

                {/* Mảnh 1 (Hình thang gốc) */}
                <g 
                  transform={`translate(${pos1.x}, ${pos1.y})`} 
                  onMouseDown={(e) => handleMouseDown(1, e)} 
                  onTouchStart={(e) => handleMouseDown(1, e)} 
                  className="cursor-grab active:cursor-grabbing"
                  filter="url(#shapeShadow)"
                >
                  <polygon 
                    points={config.points} 
                    fill="#7c3aed" 
                    fillOpacity={isSnapped ? "0.22" : "0.3"} 
                    stroke="#7c3aed" 
                    strokeWidth="3.5" 
                    strokeLinejoin="round"
                  />

                  {/* Chiều cao h */}
                  <line 
                    x1={config.altitudeX} 
                    y1="-160" 
                    x2={config.altitudeBottomX} 
                    y2="0" 
                    stroke="#dc2626" 
                    strokeWidth="3" 
                    strokeDasharray="6 4" 
                  />

                  {/* Nhãn chiều cao h */}
                  <rect 
                    x={config.altitudeX > 50 ? config.altitudeX + 8 : config.altitudeX - 58} 
                    y="-92" 
                    width="54" 
                    height="22" 
                    rx="6" 
                    fill="#ffffff" 
                    stroke="#fca5a5" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x={config.altitudeX > 50 ? config.altitudeX + 35 : config.altitudeX - 31} 
                    y="-77" 
                    textAnchor="middle" 
                    className="text-xs font-black fill-rose-600 font-mono"
                  >
                    h = {params.height}
                  </text>
                  
                  {/* Đáy lớn a */}
                  <rect 
                    x="95" 
                    y="14" 
                    width="60" 
                    height="22" 
                    rx="6" 
                    fill="#ffffff" 
                    stroke="#ddd6fe" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x="125" 
                    y="29" 
                    textAnchor="middle" 
                    className="text-xs font-black fill-purple-800 font-mono"
                  >
                    a = {params.base}
                  </text>

                  {/* Đáy nhỏ b */}
                  <rect 
                    x={demoMode === 1 ? "95" : "145"} 
                    y="-192" 
                    width="60" 
                    height="22" 
                    rx="6" 
                    fill="#ffffff" 
                    stroke="#ddd6fe" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x={demoMode === 1 ? "125" : "175"} 
                    y="-177" 
                    textAnchor="middle" 
                    className="text-xs font-black fill-purple-700 font-mono"
                  >
                    b = {params.baseSmall}
                  </text>

                  {/* Nhãn mảnh số 1 */}
                  {!isSnapped && (
                    <text 
                      x="125" 
                      y="-45" 
                      textAnchor="middle" 
                      className="text-xs font-black fill-purple-900 pointer-events-none"
                    >
                      Mảnh 1 (gốc)
                    </text>
                  )}

                  {/* 4 đỉnh */}
                  <circle cx="0" cy="0" r="5" fill="#7c3aed" />
                  <circle cx="250" cy="0" r="5" fill="#7c3aed" />
                  <circle cx={demoMode === 1 ? "200" : "250"} cy="-160" r="5" fill="#7c3aed" />
                  <circle cx={demoMode === 1 ? "50" : "100"} cy="-160" r="5" fill="#7c3aed" />
                </g>

                {/* Mảnh 2 (Hình thang ghép quay 180 độ) */}
                <g 
                  transform={`translate(${pos2.x}, ${pos2.y}) rotate(180)`} 
                  onMouseDown={(e) => handleMouseDown(2, e)} 
                  onTouchStart={(e) => handleMouseDown(2, e)} 
                  className="cursor-grab active:cursor-grabbing"
                  filter="url(#shapeShadow)"
                >
                  <polygon 
                    points={config.points} 
                    fill={isSnapped ? "#10b981" : "#a855f7"} 
                    fillOpacity={isSnapped ? "0.22" : "0.45"} 
                    stroke={isSnapped ? "#059669" : "#7c3aed"} 
                    strokeWidth="3.5" 
                    strokeLinejoin="round"
                    strokeDasharray={isSnapped ? "none" : "8 4"}
                  />
                  {!isSnapped && (
                    <text 
                      x="125" 
                      y="-50" 
                      transform="rotate(180 125 -50)"
                      textAnchor="middle" 
                      className="text-xs font-black fill-purple-900 pointer-events-none"
                    >
                      Mảnh 2 (quay 180°)
                    </text>
                  )}
                </g>

                {/* Đoạn kích thước tổng đáy a + b khi ghép thành công */}
                {isSnapped && (
                  <g transform={`translate(${pos1.x}, ${pos1.y + 45})`}>
                    <line 
                      x1="0" 
                      y1="0" 
                      x2={demoMode === 1 ? "400" : "400"} 
                      y2="0" 
                      stroke="#059669" 
                      strokeWidth="2.5" 
                    />
                    <line x1="0" y1="-6" x2="0" y2="6" stroke="#059669" strokeWidth="2.5" />
                    <line x1="400" y1="-6" x2="400" y2="6" stroke="#059669" strokeWidth="2.5" />
                    <rect 
                      x="80" 
                      y="-13" 
                      width="240" 
                      height="26" 
                      rx="6" 
                      fill="#ecfdf5" 
                      stroke="#059669" 
                      strokeWidth="1.5"
                    />
                    <text 
                      x="200" 
                      y="4" 
                      textAnchor="middle" 
                      className="text-xs font-black fill-emerald-800 font-mono"
                    >
                      Đáy hình bình hành = a + b = {params.base + params.baseSmall} {params.unit}
                    </text>
                  </g>
                )}
              </>
            )}

            {/* ================= 3. HÌNH TRÒN ================= */}
            {selectedShape === 'circle' && (
              demoMode === 1 ? (
                /* Chế độ 1: Bán kính & Đường kính */
                <g transform="translate(380, 225)" filter="url(#shapeShadow)">
                  {/* Đường tròn chính */}
                  <circle 
                    r="130" 
                    fill="#f59e0b" 
                    fillOpacity="0.14" 
                    stroke="#d97706" 
                    strokeWidth="4" 
                  />
                  
                  {/* Vành chu vi phát sáng nhẹ */}
                  <circle 
                    r="130" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="8" 
                    strokeOpacity="0.25"
                  />

                  {/* Bán kính r (đỏ từ tâm lên trên) */}
                  <line x1="0" y1="0" x2="0" y2="-130" stroke="#dc2626" strokeWidth="3" />
                  <circle cx="0" cy="0" r="5" fill="#dc2626" />
                  <circle cx="0" cy="-130" r="4" fill="#dc2626" />
                  
                  {/* Nhãn r */}
                  <rect x="10" y="-75" width="62" height="24" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
                  <text x="41" y="-59" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                    r = {params.radius}
                  </text>

                  {/* Đường kính d (xanh dương nét đứt nằm ngang) */}
                  <line x1="-130" y1="0" x2="130" y2="0" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" />
                  <circle cx="-130" cy="0" r="4" fill="#0284c7" />
                  <circle cx="130" cy="0" r="4" fill="#0284c7" />

                  {/* Nhãn d */}
                  <rect x="-55" y="12" width="110" height="24" rx="6" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
                  <text x="0" y="28" textAnchor="middle" className="text-xs font-black fill-sky-700 font-mono">
                    d = {params.radius * 2} {params.unit}
                  </text>
                  
                  {/* Nhãn Tâm O */}
                  <circle cx="0" cy="0" r="4" fill="#1e293b" />
                  <text x="-16" y="-8" className="text-sm font-black fill-slate-800 font-serif">O</text>

                  {/* Nhãn Chu vi C viền ngoài */}
                  <rect x="-90" y="145" width="180" height="26" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="162" textAnchor="middle" className="text-xs font-black fill-emerald-800 font-mono">
                    C = d × 3,14 = {calculateCircumference()} {params.unit}
                  </text>
                </g>
              ) : (
                /* Chế độ 2: Minh họa 16 nan quạt ghép thành hình chữ nhật */
                <g transform="translate(130, 140)">
                  {/* Hình tròn bên trái chia 16 nan quạt */}
                  <g transform="translate(90, 85)">
                    <circle r="75" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line 
                        key={i} 
                        x1={-75 * Math.cos((i * Math.PI) / 8)} 
                        y1={-75 * Math.sin((i * Math.PI) / 8)} 
                        x2={75 * Math.cos((i * Math.PI) / 8)} 
                        y2={75 * Math.sin((i * Math.PI) / 8)} 
                        stroke="#d97706" 
                        strokeWidth="1.2" 
                        strokeDasharray="3 3"
                      />
                    ))}
                    <circle cx="0" cy="0" r="3" fill="#d97706" />
                    <text x="0" y="102" textAnchor="middle" className="text-[11px] font-black fill-amber-900">
                      Hình tròn cắt 16 nan quạt
                    </text>
                  </g>

                  {/* Mũi tên chuyển đổi */}
                  <g transform="translate(205, 85)">
                    <path d="M 0 0 L 35 0 M 25 -7 L 35 0 L 25 7" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="18" y="-12" textAnchor="middle" className="text-[10px] font-extrabold fill-amber-800">
                      Ghép lại
                    </text>
                  </g>

                  {/* 16 nan quạt xen kẽ thành hình chữ nhật bên phải */}
                  <g transform="translate(265, 45)">
                    {/* Vẽ 8 nan hướng lên và 8 nan hướng xuống xen kẽ */}
                    <g>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <g key={i} transform={`translate(${i * 28}, 0)`}>
                          {/* Nan quạt chóp ở dưới, đáy cong ở trên */}
                          <path 
                            d="M 0 80 L 14 0 L 28 80 Z" 
                            fill={i % 2 === 0 ? "#f59e0b" : "#fbbf24"} 
                            stroke="#d97706" 
                            strokeWidth="1.5" 
                            fillOpacity="0.75"
                          />
                        </g>
                      ))}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <g key={`down-${i}`} transform={`translate(${i * 28 + 14}, 0)`}>
                          {/* Nan quạt chóp ở trên, đáy cong ở dưới */}
                          <path 
                            d="M 0 0 L 14 80 L 28 0 Z" 
                            fill={i % 2 === 0 ? "#10b981" : "#34d399"} 
                            stroke="#059669" 
                            strokeWidth="1.5" 
                            fillOpacity="0.75"
                          />
                        </g>
                      ))}
                    </g>

                    {/* Kích thước chiều cao = r */}
                    <line x1="-12" y1="0" x2="-12" y2="80" stroke="#dc2626" strokeWidth="2" />
                    <line x1="-16" y1="0" x2="-8" y2="0" stroke="#dc2626" strokeWidth="2" />
                    <line x1="-16" y1="80" x2="-8" y2="80" stroke="#dc2626" strokeWidth="2" />
                    <text x="-48" y="44" textAnchor="middle" className="text-xs font-black fill-rose-600 font-mono">
                      r = {params.radius}
                    </text>

                    {/* Kích thước chiều dài = r x 3.14 (nửa chu vi) */}
                    <line x1="0" y1="95" x2="224" y2="95" stroke="#0284c7" strokeWidth="2" />
                    <line x1="0" y1="90" x2="0" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="224" y1="90" x2="224" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <text x="112" y="115" textAnchor="middle" className="text-xs font-black fill-sky-800 font-mono">
                      Chiều dài ≈ Nửa chu vi = r × 3,14 = {(params.radius * 3.14).toFixed(1)} {params.unit}
                    </text>

                    {/* Khung kết luận công thức */}
                    <rect x="-10" y="135" width="245" height="32" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                    <text x="112" y="156" textAnchor="middle" className="text-xs font-black fill-amber-950 font-mono">
                      S = Chiều dài × Chiều rộng = r × r × 3,14
                    </text>
                  </g>
                </g>
              )
            )}
          </svg>

          {/* NHÂN VẬT ĐỒNG HÀNH Ở GÓC DƯỚI BÊN PHẢI BẢNG */}
          <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
            <MascotCompanion 
              message={
                selectedShape === 'circle' 
                  ? demoMode === 1
                    ? "Đường kính dài gấp 2 lần bán kính: d = r × 2 đấy các em!" 
                    : "Ghép 16 nan quạt thành hình chữ nhật S = r × r × 3,14!"
                  : isSnapped 
                    ? "Hoan hô! Em ghép hình chuẩn xác rồi! 🎉" 
                    : "Kéo thả mảnh hình để ghép lại nhé!"
              }
              subMessage={isSnapped ? "Diện tích ghép được = 2 lần hình gốc!" : undefined}
              isHappy={isSnapped}
            />
          </div>

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
