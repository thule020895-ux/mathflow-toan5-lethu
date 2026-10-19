import React, { useState, useRef } from 'react';
import { 
  Calculator, 
  Box, 
  Info, 
  LayoutTemplate, 
  Square, 
  RotateCw, 
  Layers, 
  Sparkles,
  MousePointer2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Lightbulb,
  Edit3
} from 'lucide-react';
import MascotCompanion from './MascotCompanion';

type VolumeShape = 'rect_prism' | 'cube';

const INITIAL_VOL_PARAMS = {
  rect_prism: { length: 12, width: 8, height: 10 },
  cube: { side: 10 }
};

const VolumePanel: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<VolumeShape>('rect_prism');
  const [params, setParams] = useState({
    length: 12,
    width: 8,
    height: 10,
    side: 10,
    unit: 'cm'
  });

  // State bảng thực hành tương tác
  const [userVolumeInput, setUserVolumeInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<{ isChecked: boolean; isCorrect: boolean } | null>(null);

  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const isInitialData = () => {
    if (selectedShape === 'rect_prism') {
      return params.length === INITIAL_VOL_PARAMS.rect_prism.length &&
             params.width === INITIAL_VOL_PARAMS.rect_prism.width &&
             params.height === INITIAL_VOL_PARAMS.rect_prism.height;
    }
    if (selectedShape === 'cube') {
      return params.side === INITIAL_VOL_PARAMS.cube.side;
    }
    return false;
  };

  const resetToInitialData = () => {
    setParams({
      length: 12,
      width: 8,
      height: 10,
      side: 10,
      unit: 'cm'
    });
    setUserVolumeInput('');
    setPracticeResult(null);
  };

  const calculateVolume = () => {
    if (selectedShape === 'rect_prism') {
      return params.length * params.width * params.height;
    }
    return params.side * params.side * params.side;
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const generateRandom = () => {
    const r = () => Math.floor(Math.random() * 15) + 5;
    setParams({
      ...params,
      length: r(),
      width: r(),
      height: r(),
      side: r()
    });
    setUserVolumeInput('');
    setPracticeResult(null);
  };

  const handleCheckAnswer = () => {
    const vol = calculateVolume();
    const userVol = parseFloat(userVolumeInput.trim().replace(',', '.'));
    const isOk = !isNaN(userVol) && Math.abs(userVol - vol) <= 0.05;
    setPracticeResult({
      isChecked: true,
      isCorrect: isOk
    });
  };

  const handleRetry = () => {
    setPracticeResult(null);
    setUserVolumeInput('');
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;
    setRotation(prev => ({ x: prev.x - deltaY * 0.5, y: prev.y + deltaX * 0.5 }));
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const getStepText = () => {
    if (selectedShape === 'rect_prism') {
      return `${params.length} × ${params.width} × ${params.height} = ${calculateVolume().toLocaleString('vi-VN')}`;
    }
    return `${params.side} × ${params.side} × ${params.side} = ${calculateVolume().toLocaleString('vi-VN')}`;
  };

  const getFormula = () => {
    if (selectedShape === 'rect_prism') {
      return {
        title: 'Thể tích hình hộp chữ nhật',
        formula: 'V = a × b × h',
        desc: 'Muốn tính thể tích hình hộp chữ nhật, ta lấy chiều dài nhân với chiều rộng rồi nhân với chiều cao (cùng đơn vị đo).'
      };
    }
    return {
      title: 'Thể tích hình lập phương',
      formula: 'V = a × a × a',
      desc: 'Muốn tính thể tích hình lập phương, ta lấy cạnh nhân với cạnh rồi nhân với cạnh.'
    };
  };

  const info = getFormula();
  const volume = calculateVolume();

  const scale = 12;
  const curL = selectedShape === 'rect_prism' ? params.length * scale : params.side * scale;
  const curW = selectedShape === 'rect_prism' ? params.width * scale : params.side * scale;
  const curH = selectedShape === 'rect_prism' ? params.height * scale : params.side * scale;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-slate-50/90 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <LayoutTemplate size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Chọn Hình Khối
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'rect_prism', label: 'Hình Hộp Chữ Nhật', icon: <Box size={18} /> },
              { id: 'cube', label: 'Hình Lập Phương', icon: <Square size={18} /> }
            ].map(shape => {
              const isCurrent = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id as VolumeShape)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-bold flex items-center justify-between ${
                    isCurrent 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 translate-y-[-1px]' 
                      : 'bg-white hover:bg-teal-50/70 text-slate-700 border border-slate-200/90 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isCurrent ? 'text-white' : 'text-teal-600'}>
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

        {/* Nhập số đo */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Calculator size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Nhập số đo ({params.unit})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2.5">
            {selectedShape === 'rect_prism' ? (
              <>
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Chiều dài (a):</label>
                  <input 
                    type="number" 
                    min="1"
                    value={params.length} 
                    onChange={(e) => setParams({...params, length: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-sky-700 outline-none" 
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Chiều rộng (b):</label>
                  <input 
                    type="number" 
                    min="1"
                    value={params.width} 
                    onChange={(e) => setParams({...params, width: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-indigo-700 outline-none" 
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Chiều cao (h):</label>
                  <input 
                    type="number" 
                    min="1"
                    value={params.height} 
                    onChange={(e) => setParams({...params, height: Math.max(1, Number(e.target.value))})} 
                    className="w-full text-base font-black text-rose-600 outline-none" 
                  />
                </div>
              </>
            ) : (
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <label className="text-xs font-bold text-slate-500 block mb-1">Độ dài cạnh (a):</label>
                <input 
                  type="number" 
                  min="1"
                  value={params.side} 
                  onChange={(e) => setParams({...params, side: Math.max(1, Number(e.target.value))})} 
                  className="w-full text-base font-black text-sky-700 outline-none" 
                />
              </div>
            )}
            
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

        <div className="pt-1 space-y-2">
          <button 
            onClick={generateRandom}
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-all active:scale-[0.98]"
          >
            <RotateCw size={16} className="text-teal-600" /> Đổi số đo ngẫu nhiên
          </button>
          {!isInitialData() && (
            <button 
              onClick={resetToInitialData}
              className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-[0.98]"
            >
              <RotateCcw size={14} className="text-emerald-600" /> Khôi phục số liệu gốc (Bài mẫu)
            </button>
          )}
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-white overflow-hidden">
        
        {/* BẢNG MÔ PHỎNG 3D VỚI LƯỚI Ô VUÔNG TOÁN */}
        <div 
          className="w-full aspect-[16/10] md:min-h-[460px] math-grid-bg rounded-3xl border-2 border-teal-200 shadow-md board-shadow relative flex items-center justify-center cursor-grab active:cursor-grabbing perspective overflow-hidden select-none"
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
            <div className="inline-flex items-center gap-2 bg-teal-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles size={14} className="text-amber-300" />
              MÔ PHỎNG THỂ TÍCH 3D
            </div>
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 border border-teal-100 shadow-xs flex items-center gap-2">
              <MousePointer2 size={13} className="text-teal-600" />
              <span>Kéo chuột để xoay khối hình và quan sát các kích thước</span>
            </div>
          </div>

          <button 
            onClick={() => setRotation({ x: -25, y: 45 })}
            className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-md hover:bg-teal-50 border border-teal-100 transition-all z-20 text-teal-700 active:scale-95"
            title="Đặt lại góc nhìn chuẩn"
          >
            <RotateCw size={18} />
          </button>

          {/* KHỐI 3D */}
          <div 
            className="relative transition-transform duration-100 ease-out" 
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              width: curL,
              height: curH,
            }}
          >
            {/* Front face (CHỨA NHÃN a VÀ h) */}
            <div 
              className="absolute inset-0 bg-teal-500/80 border-2 border-teal-700 flex flex-col items-center justify-center" 
              style={{ transform: `translateZ(${curW / 2}px)` }}
            >
               <span className="text-white font-black text-[10px] opacity-25 uppercase">Mặt trước</span>
               
               {/* Nhãn a - Dài */}
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono font-black text-teal-800 text-xs bg-white px-2 py-0.5 rounded-md border border-teal-200 whitespace-nowrap shadow-xs">
                 a = {selectedShape === 'rect_prism' ? params.length : params.side}
               </div>
               
               {/* Nhãn h - Cao */}
               {selectedShape === 'rect_prism' && (
                 <div className="absolute -left-12 top-1/2 -translate-y-1/2 font-mono font-black text-rose-600 text-xs bg-white px-2 py-0.5 rounded-md border border-rose-200 whitespace-nowrap shadow-xs -rotate-90">
                   h = {params.height}
                 </div>
               )}
            </div>

            {/* Right face (CHỨA NHÃN b) */}
            <div 
              className="absolute inset-0 bg-sky-500/80 border-2 border-sky-700 flex items-center justify-center" 
              style={{ 
                width: curW, 
                left: '50%', 
                transform: `translateX(-50%) rotateY(90deg) translateZ(${curL / 2}px)` 
              }}
            >
               {selectedShape === 'rect_prism' && (
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono font-black text-sky-800 text-xs bg-white px-2 py-0.5 rounded-md border border-sky-200 whitespace-nowrap shadow-xs">
                   b = {params.width}
                 </div>
               )}
            </div>

            {/* Các mặt khác */}
            <div className="absolute inset-0 bg-teal-600/60 border border-teal-800" style={{ transform: `rotateY(180deg) translateZ(${curW / 2}px)` }} />
            <div className="absolute inset-0 bg-sky-600/80 border-2 border-sky-700" style={{ width: curW, left: '50%', transform: `translateX(-50%) rotateY(-90deg) translateZ(${curL / 2}px)` }} />
            <div className="absolute inset-0 bg-teal-400/80 border-2 border-teal-600" style={{ height: curW, top: '50%', transform: `translateY(-50%) rotateX(90deg) translateZ(${curH / 2}px)` }} />
            <div className="absolute inset-0 bg-teal-700/80 border-2 border-teal-900" style={{ height: curW, top: '50%', transform: `translateY(-50%) rotateX(-90deg) translateZ(${curH / 2}px)` }} />
          </div>

          {/* Mascot Companion */}
          <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
            <MascotCompanion 
              message="Thể tích tính bằng số khối lập phương đơn vị lấp đầy bên trong!"
              subMessage="1 mét khối = 1000 đề-xi-mét khối = 1.000.000 cm³"
            />
          </div>
        </div>

        {/* Thông tin công thức & Cách giải */}
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-50/70 p-4 md:p-5 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-teal-900 font-extrabold text-sm mb-3 flex items-center gap-2">
                <Info size={17} className="text-teal-600" />
                {info.title}
              </h4>
              <div className="bg-white p-3.5 rounded-xl border border-teal-100 text-center shadow-xs mb-3">
                <span className="text-2xl font-black text-teal-800 font-serif italic">{info.formula}</span>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-teal-100">
              {info.desc}
            </p>
          </div>

          {/* CỘT 2: LỜI GIẢI MẪU CHI TIẾT (SỐ LIỆU GỐC) HOẶC BẢNG GIẢI TƯƠNG TÁC (KHI ĐỔI SỐ LIỆU) */}
          {isInitialData() ? (
            <div className="bg-sky-50/70 p-4 md:p-5 rounded-2xl border border-sky-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sky-900 font-extrabold text-sm flex items-center gap-2">
                    <Calculator size={17} className="text-sky-600" />
                    Lời giải mẫu chi tiết
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                    Số liệu mẫu gốc
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-xs">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Bước 1: Viết phép tính & thay số</p>
                    <p className="text-sky-900 font-mono font-bold text-sm">V = {getStepText()} ({params.unit}³)</p>
                  </div>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Em có biết:</strong> Khi em đổi số đo hoặc bấm <em>"Đổi số đo ngẫu nhiên"</em> ở cột bên trái, bảng này sẽ chuyển thành <strong>Bảng giải tương tác</strong> để em tự thực hành và kiểm tra kết quả!
                  </span>
                </div>
              </div>

              <div className="text-right pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase block">Đáp số thể tích:</span>
                <span className="text-3xl font-black text-sky-700 tracking-tight font-mono">
                  {volume.toLocaleString('vi-VN')}
                </span>
                <span className="text-base font-extrabold text-sky-600 ml-1.5">{params.unit}³</span>
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
                    <p>Cho hình hộp chữ nhật có chiều dài <strong>a = {params.length} cm</strong>, chiều rộng <strong>b = {params.width} cm</strong> và chiều cao <strong>h = {params.height} cm</strong>. Em hãy tính thể tích V của hình hộp chữ nhật.</p>
                  ) : (
                    <p>Cho hình lập phương có độ dài cạnh <strong>a = {params.side} cm</strong>. Em hãy tính thể tích V của hình lập phương.</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Gợi ý: {selectedShape === 'rect_prism' ? 'V = a × b × h' : 'V = a × a × a'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 mb-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Nhập kết quả Thể tích (V) của em:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập thể tích tính được..."
                      value={userVolumeInput}
                      onChange={(e) => { setUserVolumeInput(e.target.value); setPracticeResult(null); }}
                      disabled={practiceResult?.isCorrect}
                      className="w-full text-base font-black text-teal-800 bg-amber-50/40 p-2.5 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-sm font-black text-slate-600 shrink-0 px-2.5 py-2 bg-slate-100 rounded-lg">{params.unit}³</span>
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
                          Hoan hô! Em đã tính chính xác 100% thể tích! 🎉
                        </p>
                        <div className="bg-white/20 p-2 rounded-lg font-mono text-white text-[11px]">
                          ✓ V = {getStepText()} {params.unit}³
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                          <XCircle size={18} className="text-rose-600" />
                          Kết quả chưa chính xác rồi! Em hãy tính nháp lại nhé.
                        </p>
                        <p className="text-rose-800">
                          Em hãy kiểm tra lại phép nhân 3 kích thước ({selectedShape === 'rect_prism' ? 'dài × rộng × cao' : 'cạnh × cạnh × cạnh'}) nhé!
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
                    disabled={!userVolumeInput}
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

        {/* Ghi nhớ đơn vị thể tích */}
        <div className="mt-4 bg-slate-900 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl text-teal-300">
              <Layers size={22} />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Ghi nhớ quy đổi đơn vị thể tích</h5>
              <p className="text-slate-300 text-xs">Mỗi đơn vị thể tích gấp 1.000 lần đơn vị bé hơn tiếp liền.</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center font-mono text-xs">
              <span className="text-slate-300 block text-[9px] uppercase">1 m³</span>
              <span className="font-bold text-teal-300">1.000 dm³</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center font-mono text-xs">
              <span className="text-slate-300 block text-[9px] uppercase">1 dm³ (1 lít)</span>
              <span className="font-bold text-emerald-300">1.000 cm³</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolumePanel;
