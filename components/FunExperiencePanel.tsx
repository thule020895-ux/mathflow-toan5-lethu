import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Gamepad2, 
  Sparkles,
  Target
} from 'lucide-react';
import QuizPanel from './QuizPanel';
import GamePanel from './GamePanel';
import PercentHuntGame from './PercentHuntGame';

export type FunSubTab = 'quiz' | 'game' | 'percent_hunt';

interface FunExperiencePanelProps {
  initialSubTab?: FunSubTab;
}

export const FunExperiencePanel: React.FC<FunExperiencePanelProps> = ({ initialSubTab }) => {
  const [subTab, setSubTab] = useState<FunSubTab>(initialSubTab ?? 'quiz');

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

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
          <div className="flex flex-wrap items-center justify-center bg-blue-700/60 p-1 rounded-2xl border border-blue-400/40 gap-1">
            <button
              onClick={() => setSubTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                subTab === 'quiz'
                  ? 'bg-white text-blue-900 shadow-xs font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap size={16} className={subTab === 'quiz' ? 'text-blue-700' : 'text-blue-200'} />
              <span>Luyện Tập Toán 5</span>
            </button>

            <button
              onClick={() => setSubTab('game')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                subTab === 'game'
                  ? 'bg-amber-400 text-slate-900 shadow-xs font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 size={16} className={subTab === 'game' ? 'text-slate-900' : 'text-amber-300'} />
              <span>Đấu Trường Trò Chơi</span>
            </button>

            <button
              onClick={() => setSubTab('percent_hunt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                subTab === 'percent_hunt'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Target size={16} className={subTab === 'percent_hunt' ? 'text-slate-950' : 'text-emerald-300'} />
              <span>Săn Tìm Đáp Án Đúng</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content View with Animation */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {subTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <QuizPanel onOpenPercentHunt={() => setSubTab('percent_hunt')} />
            </motion.div>
          )}
          {subTab === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <GamePanel onOpenPercentHunt={() => setSubTab('percent_hunt')} />
            </motion.div>
          )}
          {subTab === 'percent_hunt' && (
            <motion.div
              key="percent_hunt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PercentHuntGame onBack={() => setSubTab('game')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FunExperiencePanel;
