import React, { useState, useRef } from 'react';
import { 
  Calculator, 
  Info, 
  Box, 
  Square, 
  RotateCw, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Sparkles,
  Layers,
  MousePointer2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { ShapeType } from '../types';
import MascotCompanion from './MascotCompanion';

const INITIAL_3D_PARAMS = {
  rect_prism: { valL: 14, valW: 10, valH: 12 },
  cube: { valA: 12 }
};

const Shape3DPanel: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rect_prism');
  const [params, setParams] = useState({
    l: 160, // Chiều dài hiển thị (px)
    w: 100, // Chiều rộng hiển thị (px)
    h: 120, // Chiều cao hiển thị (px)
    a: 120, // Cạnh hình lập phương hiển thị (px)
    r: 50,  // Bán kính hiển thị (px)
    valL: 14, // Giá trị thực (cm)
    valW: 10,
    valH: 12,
    valA: 12,
    unit: 'cm'
  });

  // State bảng tương tác học sinh
  const [userSxqInput, setUserSxqInput] = useState('');
  const [userStpInput, setUserStpInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const isInitialData = () => {
    if (selectedShape === 'rect_prism') {
      return params.valL === INITIAL_3D_PARAMS.rect_prism.valL &&
             params.valW === INITIAL_3D_PARAMS.rect_prism.valW &&
             params.valH === INITIAL_3D_PARAMS.rect_prism.valH;
    }
    if (selectedShape === 'cube') {
      return params.valA === INITIAL_3D_PARAMS.cube.valA;
    }
    return false;
  };

  const resetToInitialData = () => {
    setParams({
      l: 160,
      w: 100,
      h: 120,
      a: 120,
      r: 50,
      valL: 14,
      valW: 10,
      valH: 12,
      valA: 12,
      unit: 'cm'
    });
    setUserSxqInput('');
    setUserStpInput('');
    setPracticeResult(null);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const generateRandom = () => {
    const r = () => Math.floor(Math.random() * 15) + 5;
    const valL = r();
    const valW = r();
    const valH = r();
    const valA = r();
    setParams({
      ...params,
      valL, valW, valH, valA,
      l: Math.min(valL * 10, 180),
      w: Math.min(valW * 10, 180),
      h: Math.min(valH * 10, 180),
      a: Math.min(valA * 10, 180)
    });
    setUserSxqInput('');
    setUserStpInput('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    const sxq = calculateSxqValue();
    const stp = calculateStpValue();
    const userSxq = parseFloat(userSxqInput.trim().replace(',', '.'));
    const userStp = parseFloat(userStpInput.trim().replace(',', '.'));
    
    const isSxqOk = !isNaN(userSxq) && Math.abs(userSxq - sxq) <= 0.05;
    const isStpOk = !isNaN(userStp) && Math.abs(userStp - stp) <= 0.05;
    
    setPracticeResult({
      isChecked: true,
      isCorrect: isSxqOk && isStpOk
    });
  };

  const handleRetry = () => {
    setPracticeResult(null);
    setUserSxqInput('');
    setUserStpInput('');
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;
    
    setRotation(prev => ({ 
      x: prev.x + deltaY * 0.5, 
      y: prev.y + deltaX * 0.5 
    }));
    
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const calculateSxqValue = () => {
    if (selectedShape === 'rect_prism') return 2 * (params.valL + params.valW) * params.valH;
    if (selectedShape === 'cube') return params.valA * params.valA * 4;
    return 0;
  };

  const calculateStpValue = () => {
    const sxq = calculateSxqValue();
    if (selectedShape === 'rect_prism') return sxq + 2 * (params.valL * params.valW);
    if (selectedShape === 'cube') return params.valA * params.valA * 6;
    return 0;
  };

  const getDetailedSteps = () => {
    const sxq = calculateSxqValue();
    const stp = calculateStpValue();
    const fix = (n: number) => Number(n.toFixed(2)).toLocaleString('vi-VN');
    
    if (selectedShape === 'rect_prism') {
      return {
        sxq: `Sxq = (${params.valL} + ${params.valW}) × 2 × ${params.valH} = ${fix(sxq)}`,
        stp: `Stp = ${fix(sxq)} + ${params.valL} × ${params.valW} × 2 = ${fix(stp)}`
      };
    } else {
      return {
        sxq: `Sxq = ${params.valA} × ${params.valA} × 4 = ${fix(sxq)}`,
        stp: `Stp = ${params.valA} × ${params.valA} × 6 = ${fix(stp)}`
      };
    }
  };

  const curL = selectedShape === 'cube' ? params.a : params.l;
  const curW = selectedShape === 'cube' ? params.a : params.w;
  const curH = selectedShape === 'cube' ? params.a : params.h;

  const info = selectedShape === 'rect_prism' ? {
    title: 'Hình Hộp Chữ Nhật',
    sxq: 'Sxq = (a + b) × 2 × h',
    stp: 'Stp = Sxq + a × b × 2',
    labels: [
      { key: 'a', desc: 'Chiều dài đáy', color: 'text-sky-700 bg-sky-100' },
      { key: 'b', desc: 'Chiều rộng đáy', color: 'text-indigo-700 bg-indigo-100' },
      { key: 'h', desc: 'Chiều cao', color: 'text-rose-700 bg-rose-100' }
    ]
  } : {
    title: 'Hình Lập Phương',
    sxq: 'Sxq = a × a × 4',
    stp: 'Stp = a × a × 6',
    labels: [
      { key: 'a', desc: 'Độ dài cạnh', color: 'text-sky-700 bg-sky-100' }
    ]
  };

  const steps = getDetailedSteps();

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-50/90 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Box size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Chọn Hình Khối
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'rect_prism', label: 'Hình Hộp Chữ Nhật', icon: <Box size={18}/> },
              { id: 'cube', label: 'Hình Lập Phương', icon: <Square size={18}/> }
            ].map((shape) => {
              const isCurrent = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => { setSelectedShape(shape.id as ShapeType); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-bold flex items-center justify-between ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-y-[-1px]' 
                      : 'bg-white hover:bg-indigo-50/70 text-slate-700 border border-slate-200/90 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isCurrent ? 'text-white' : 'text-indigo-600'}>
                      {shape.icon}
                    </span>
                    <span className="text-sm">{shape.label}</span>
                  </div>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Số đo thực tế */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Calculator size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Số đo ({params.unit})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {selectedShape === 'rect_prism' && (
              <>
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500">Chiều dài (a):</label>
                    <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">dài</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    value={params.valL} 
                    onChange={(e) => setParams({...params, valL: Number(e.target.value), l: Math.min(Number(e.target.value) * 10, 180)})} 
                    className="w-full text-base font-black text-sky-700 outline-none"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500">Chiều rộng (b):</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">rộng</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    value={params.valW} 
                    onChange={(e) => setParams({...params, valW: Number(e.target.value), w: Math.min(Number(e.target.value) * 10, 180)})} 
                    className="w-full text-base font-black text-indigo-700 outline-none"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500">Chiều cao (h):</label>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">cao</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    value={params.valH} 
                    onChange={(e) => setParams({...params, valH: Number(e.target.value), h: Math.min(Number(e.target.value) * 10, 180)})} 
                    className="w-full text-base font-black text-rose-600 outline-none"
                  />
                </div>
              </>
            )}
            
            {selectedShape === 'cube' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Độ dài cạnh (a):</label>
                  <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">cạnh</span>
                </div>
                <input 
                  type="number" 
                  min="1"
                  value={params.valA} 
                  onChange={(e) => setParams({...params, valA: Number(e.target.value), a: Math.min(Number(e.target.value) * 10, 180)})} 
                  className="w-full text-base font-black text-sky-700 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm active:scale-[0.98] ${
              isOpen 
                ? 'bg-amber-500 text-white shadow-amber-500/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {isOpen ? 'Gập lại thành hình khối 3D' : 'Mở trải hình khai triển phẳng'}
          </button>
          
          <button 
            onClick={generateRandom}
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all active:scale-[0.98]"
          >
            <RotateCw size={16} className="text-sky-600" /> Đổi số đo ngẫu nhiên
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-white overflow-hidden">
        
        {/* BẢNG MÔ PHỎNG 3D VỚI LƯỚI Ô VUÔNG TOÁN */}
        <div 
          className="w-full aspect-[16/10] md:min-h-[460px] math-grid-bg rounded-3xl border-2 border-indigo-200 shadow-md board-shadow relative flex items-center justify-center cursor-grab active:cursor-grabbing perspective overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Header Bảng */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles size={14} className="text-amber-300" />
              {isOpen ? 'SƠ ĐỒ KHAI TRIỂN PHẲNG' : 'MÔ PHỎNG HÌNH KHỐI 3D'}
            </div>
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 border border-indigo-100 shadow-xs flex items-center gap-2">
              <MousePointer2 size={13} className="text-indigo-600" />
              <span>{isOpen ? 'Quan sát 6 mặt phẳng trải rộng của hình' : 'Kéo chuột để xoay và quan sát các mặt 3D'}</span>
            </div>
          </div>

          <button 
            onClick={() => setRotation({ x: -25, y: 45 })}
            className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-md hover:bg-indigo-50 border border-indigo-100 transition-all z-20 text-indigo-700 active:scale-95"
            title="Đặt lại góc nhìn chuẩn"
          >
            <RotateCw size={18} />
          </button>

          {/* 3D Root Container */}
          <div 
            className="relative transition-all duration-300 ease-out flex items-center justify-center" 
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isOpen ? 'rotateX(0deg) rotateY(0deg)' : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              width: curL,
              height: curW
            }}
          >
            {/* --- HÌNH HỘP & LẬP PHƯƠNG --- */}
            <div className="absolute inset-0 flex flex-col items-center justify-center shadow-lg" style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}>
              <div className="absolute inset-0 bg-indigo-500/80 border-2 border-indigo-700 flex flex-col items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {isOpen && <span className="text-white/70 font-black text-xs uppercase">Đáy (1)</span>}
                <div className="absolute left-0 right-0 bg-indigo-400 border-2 border-indigo-700 transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center" style={{ height: curH, top: '100%', transformOrigin: 'top', transform: `rotateX(${isOpen ? 0 : -90}deg)`, transformStyle: 'preserve-3d' }}>
                  {isOpen && <span className="text-white/70 font-black text-xs uppercase">Trước (2)</span>}
                  <div className="absolute left-0 right-0 bg-indigo-300 border-2 border-indigo-700 transition-transform duration-1000 ease-in-out flex items-center justify-center" style={{ height: curW, top: '100%', transformOrigin: 'top', transform: `rotateX(${isOpen ? 0 : -90}deg)`, transformStyle: 'preserve-3d' }}>
                    {isOpen && <span className="text-indigo-900/70 font-black text-xs uppercase">Trên (3)</span>}
                  </div>
                </div>
                <div className="absolute left-0 right-0 bg-indigo-400 border-2 border-indigo-700 transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center" style={{ height: curH, bottom: '100%', transformOrigin: 'bottom', transform: `rotateX(${isOpen ? 0 : 90}deg)`, transformStyle: 'preserve-3d' }}>
                  {isOpen && <span className="text-white/70 font-black text-xs uppercase">Sau (4)</span>}
                </div>
                <div className="absolute top-0 bottom-0 bg-indigo-600/90 border-2 border-indigo-700 transition-transform duration-1000 ease-in-out flex items-center justify-center" style={{ width: curH, right: '100%', transformOrigin: 'right', transform: `rotateY(${isOpen ? 0 : -90}deg)`, transformStyle: 'preserve-3d' }}>
                  {isOpen && <span className="text-white/70 font-black text-xs uppercase -rotate-90">Trái (5)</span>}
                </div>
                <div className="absolute top-0 bottom-0 bg-indigo-600/90 border-2 border-indigo-700 transition-transform duration-1000 ease-in-out flex items-center justify-center" style={{ width: curH, left: '100%', transformOrigin: 'left', transform: `rotateY(${isOpen ? 0 : 90}deg)`, transformStyle: 'preserve-3d' }}>
                  {isOpen && <span className="text-white/70 font-black text-xs uppercase rotate-90">Phải (6)</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Nhân vật đồng hành góc dưới */}
          <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
            <MascotCompanion 
              message={isOpen ? "Hình khối mở ra gồm đúng 6 mặt phẳng đấy!" : "Em thử bấm 'Mở hình khai triển' xem sao nhé!"}
              subMessage={selectedShape === 'rect_prism' ? "S toàn phần = S xung quanh + 2 mặt đáy" : "Lập phương có 6 mặt hình vuông bằng nhau!"}
              isHappy={isOpen}
            />
          </div>
        </div>

        {/* Info & Result Panel */}
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50/70 p-4 md:p-5 rounded-2xl border border-indigo-200/80 shadow-xs">
            <h4 className="text-indigo-900 font-extrabold text-sm mb-3 flex items-center gap-2">
              <Info size={17} className="text-indigo-600" /> {info.title} - Kí hiệu & Công thức
            </h4>
            <div className="space-y-2.5">
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Diện tích xung quanh:</span>
                <span className="font-mono font-black text-indigo-800 text-base">{info.sxq}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Diện tích toàn phần:</span>
                <span className="font-mono font-black text-emerald-800 text-base">{info.stp}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {info.labels.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                    <span className={`w-5 h-5 flex items-center justify-center rounded font-black text-xs ${item.color}`}>{item.key}</span>
                    <span className="text-xs font-bold text-slate-700">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT 2: BÀI GIẢI MẪU (SỐ LIỆU GỐC) HOẶC BẢNG GIẢI TƯƠNG TÁC (KHI ĐỔI SỐ LIỆU) */}
          {isInitialData() ? (
            <div className="bg-emerald-50/70 p-4 md:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-emerald-900 font-extrabold text-sm flex items-center gap-2">
                    <Calculator size={17} className="text-emerald-600" /> Bài giải mẫu chi tiết
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Số liệu mẫu gốc
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">S xung quanh</p>
                    <p className="text-xl font-black text-emerald-700 tracking-tight font-mono">
                      {calculateSxqValue().toLocaleString('vi-VN')} <span className="text-xs font-bold text-emerald-500">{params.unit}²</span>
                    </p>
                  </div>
                  <div className="bg-emerald-600 p-3 rounded-xl shadow-xs text-white border border-emerald-500">
                    <p className="text-[10px] text-emerald-100 font-bold uppercase mb-0.5">S toàn phần</p>
                    <p className="text-xl font-black tracking-tight font-mono">
                      {calculateStpValue().toLocaleString('vi-VN')} <span className="text-xs font-bold text-emerald-200">{params.unit}²</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-800 space-y-1 mb-3">
                  <p>{steps.sxq} {params.unit}²</p>
                  <p>{steps.stp} {params.unit}²</p>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Em có biết:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi số đo ngẫu nhiên"</em>, bảng này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em tự thực hành và kiểm tra kết quả!
                  </span>
                </div>
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

                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs mb-3 text-xs leading-relaxed text-slate-800">
                  <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Đề bài luyện tập:
                  </p>
                  {selectedShape === 'rect_prism' ? (
                    <p>Cho hình hộp chữ nhật có chiều dài <strong>a = {params.valL} cm</strong>, chiều rộng <strong>b = {params.valW} cm</strong> và chiều cao <strong>h = {params.valH} cm</strong>. Em hãy tính:</p>
                  ) : (
                    <p>Cho hình lập phương có độ dài cạnh <strong>a = {params.valA} cm</strong>. Em hãy tính:</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Gợi ý: {selectedShape === 'rect_prism' ? 'Sxq = (a + b) × 2 × h | Stp = Sxq + a × b × 2' : 'Sxq = a × a × 4 | Stp = a × a × 6'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Diện tích xung quanh (Sxq):</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Nhập Sxq..."
                        value={userSxqInput}
                        onChange={(e) => { setUserSxqInput(e.target.value); setPracticeResult(null); }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-sm font-black text-indigo-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">{params.unit}²</span>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Diện tích toàn phần (Stp):</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Nhập Stp..."
                        value={userStpInput}
                        onChange={(e) => { setUserStpInput(e.target.value); setPracticeResult(null); }}
                        disabled={practiceResult?.isCorrect}
                        className="w-full text-sm font-black text-emerald-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-mono"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">{params.unit}²</span>
                    </div>
                  </div>
                </div>

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
                          Hoan hô! Em đã tính đúng cả Sxq và Stp! 🎉
                        </p>
                        <div className="bg-white/20 p-2 rounded-lg font-mono text-white text-[11px] space-y-1">
                          <p>✓ {steps.sxq} {params.unit}²</p>
                          <p>✓ {steps.stp} {params.unit}²</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                          <XCircle size={18} className="text-rose-600" />
                          Kết quả chưa chính xác rồi! Sxq hoặc Stp còn sai sót.
                        </p>
                        <p className="text-rose-800">
                          Em hãy kiểm tra lại từng phép tính nhân và cộng nhé!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-200/80">
                {!practiceResult?.isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userSxqInput || !userStpInput}
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

export default Shape3DPanel;
