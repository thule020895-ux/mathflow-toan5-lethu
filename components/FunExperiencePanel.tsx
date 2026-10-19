import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Gamepad2, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Flame,
  Star
} from 'lucide-react';
import QuizPanel from './QuizPanel';
import GamePanel from './GamePanel';

export const FunExperiencePanel: React.FC = () => {
  const [subTab, setSubTab] = useState<'quiz' | 'game'>('quiz');

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Sub-navigation Switcher Header */}
      <div className="bg-blue-600 text-white p-3 md:p-3.5 shadow-xs shrink-0 border-b-2 border-blue-700">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-amber-300">
              <Sparkles size={18} />
            </div>
            <h2 className="text-sm md:text-base font-black uppercase tracking-tight text-white">
              Trải Nghiệm Vui Học
            </h2>
          </div>

          {/* Switcher Buttons */}
          <div className="flex items-center bg-blue-700/60 p-1 rounded-2xl border border-blue-400/40">
            <button
              onClick={() => setSubTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                subTab === 'quiz'
                  ? 'bg-white text-blue-900 shadow-xs font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap size={16} className={subTab === 'quiz' ? 'text-blue-700' : 'text-blue-200'} />
              <span>Luyện Tập Chuyên Đề</span>
            </button>

            <button
              onClick={() => setSubTab('game')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                subTab === 'game'
                  ? 'bg-amber-400 text-slate-900 shadow-xs font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 size={16} className={subTab === 'game' ? 'text-slate-900' : 'text-amber-300'} />
              <span>Đấu Trường Trò Chơi</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content View with Animation */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {subTab === 'quiz' ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <QuizPanel />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <GamePanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FunExperiencePanel;
