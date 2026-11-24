import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Type, Trash2, X } from 'lucide-react';

interface PracticeScratchpadProps {
  onClose: () => void;
}

export const PracticeScratchpad: React.FC<PracticeScratchpadProps> = ({ onClose }) => {
  const [padMode, setPadMode] = useState<'text' | 'draw'>('text');
  const [notes, setNotes] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (padMode !== 'draw' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
      canvas.width = Math.max(300, Math.floor(rect.width));
      canvas.height = 170;
    }
  }, [padMode]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getCoords(e);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearPad = () => {
    if (padMode === 'text') {
      setNotes('');
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const appendSymbol = (sym: string) => {
    setNotes(prev => `${prev}${sym}`);
  };

  return (
    <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-3 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-amber-950">Bảng nháp nhanh</span>
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-amber-200 ml-1">
            <button
              type="button"
              onClick={() => setPadMode('text')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                padMode === 'text' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              <Type size={12} /> Gõ tính
            </button>
            <button
              type="button"
              onClick={() => setPadMode('draw')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                padMode === 'draw' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              <PenTool size={12} /> Viết tay
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearPad}
            className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={12} /> Xóa nháp
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer"
            title="Thu gọn bảng nháp"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {padMode === 'text' ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 flex-wrap">
            {['+', '-', '×', ':', '=', ',', '%', '(', ')'].map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => appendSymbol(sym === '=' ? ' = ' : sym)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-xs font-black text-slate-800 cursor-pointer transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Em viết các bước tính nháp vào đây nhé... (Ví dụ: (14 + 8) × 6 : 2 = 66)"
            className="w-full rounded-xl border border-amber-200 bg-white p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-amber-500 resize-none math-grid-light"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 overflow-hidden bg-white math-grid-bg">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-[170px] touch-none cursor-crosshair block"
          />
        </div>
      )}
    </div>
  );
};

export default PracticeScratchpad;
