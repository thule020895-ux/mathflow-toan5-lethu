import React, { useState } from 'react';
import { 
  Trophy, 
  Bell, 
  Sparkles, 
  Flame, 
  Award,
  Crown
} from 'lucide-react';
import GoldenBellGame from './GoldenBellGame';
import ConquerPanel from './ConquerPanel';

export type ConquerSubTab = 'challenge' | 'bell';

interface ConquerSubTabItem {
  id: ConquerSubTab;
  label: string;
  badge: string;
  icon: React.ReactNode;
  activeColor: string;
}

const CONQUER_SUB_TABS: ConquerSubTabItem[] = [
  {
    id: 'challenge',
    label: 'Thử Thách',
    badge: 'Đề thi học sinh giỏi',
    icon: <Trophy size={18} />,
    activeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
  },
  {
    id: 'bell',
    label: 'Rung Chuông Vàng',
    badge: 'Đấu trường vinh quang',
    icon: <Bell size={18} />,
    activeColor: 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
  }
];

interface ConquerHubPanelProps {
  initialSubTab?: ConquerSubTab;
}

export const ConquerHubPanel: React.FC<ConquerHubPanelProps> = ({ initialSubTab }) => {
  const [subTab, setSubTab] = useState<ConquerSubTab>(initialSubTab || 'challenge');

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 min-h-[82vh]">
      {/* Sub-navigation Switcher Header cho Chinh Phục */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-red-700 text-white p-3 md:p-4 shadow-sm shrink-0 border-b border-rose-500/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 shadow-inner">
              <Crown size={20} className="animate-pulse" />
            </div>
            <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-white drop-shadow-xs">
              Chinh Phục Đỉnh Cao
            </h2>
          </div>

          {/* Switcher Buttons: Rung chuông vàng & Thử thách */}
          <div className="flex items-center bg-black/25 p-1 rounded-2xl border border-white/20 backdrop-blur-md">
            {CONQUER_SUB_TABS.map((tab) => {
              const isActive = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? `${tab.activeColor} font-extrabold scale-[1.02]`
                      : 'text-rose-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 overflow-y-auto">
        {subTab === 'bell' && <GoldenBellGame />}
        {subTab === 'challenge' && <ConquerPanel />}
      </div>
    </div>
  );
};

export default ConquerHubPanel;
