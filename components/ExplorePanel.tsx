import React, { useState } from 'react';
import { 
  Compass, 
  Timer,
  Scale, 
  Percent, 
  BarChart3, 
  Sparkles,
  Layers,
  BookOpen,
  Map
} from 'lucide-react';
import GeometryMeasurementPanel from './GeometryMeasurementPanel';
import MotionPanel from './MotionPanel';
import TwoNumbersProblemsPanel from './TwoNumbersProblemsPanel';
import PercentagePanel from './PercentagePanel';
import ProbabilityStatsPanel from './ProbabilityStatsPanel';
import MapScalePanel from './MapScalePanel';

export type ExploreTopicId = 'geom_measure' | 'motion' | 'two_numbers' | 'percentage' | 'prob_stats' | 'map_scale';

interface ExploreTopic {
  id: ExploreTopicId;
  label: string;
  badge: string;
  icon: React.ReactNode;
  activeColor: string;
  subColor: string;
}

const EXPLORE_TOPICS: ExploreTopic[] = [
  {
    id: 'geom_measure',
    label: 'Hình Học & Đo Lường',
    badge: 'Hình phẳng, 3D & Bảng đổi đơn vị',
    icon: <Compass size={18} />,
    activeColor: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    subColor: 'text-emerald-700'
  },
  {
    id: 'map_scale',
    label: 'Tỉ Lệ Bản Đồ',
    badge: 'Mô phỏng bản đồ & thước đo',
    icon: <Map size={18} />,
    activeColor: 'bg-amber-600 text-white shadow-md shadow-amber-600/30',
    subColor: 'text-amber-700'
  },
  {
    id: 'motion',
    label: 'Chuyển Động Đều',
    badge: 'v - s - t & Bài toán hai xe',
    icon: <Timer size={18} />,
    activeColor: 'bg-orange-600 text-white shadow-md shadow-orange-600/30',
    subColor: 'text-orange-700'
  },
  {
    id: 'two_numbers',
    label: 'Bài Toán Tìm Hai Số',
    badge: 'Tổng - Hiệu - Tỉ & Phân số',
    icon: <Scale size={18} />,
    activeColor: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    subColor: 'text-purple-700'
  },
  {
    id: 'percentage',
    label: 'Tỉ Số Phần Trăm',
    badge: '3 bài toán cơ bản',
    icon: <Percent size={18} />,
    activeColor: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
    subColor: 'text-rose-700'
  },
  {
    id: 'prob_stats',
    label: 'Xác Suất & Thống Kê',
    badge: 'Biểu đồ & Vòng quay',
    icon: <BarChart3 size={18} />,
    activeColor: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
    subColor: 'text-teal-700'
  }
];

interface ExplorePanelProps {
  initialTopicId?: ExploreTopicId;
}

export const ExplorePanel: React.FC<ExplorePanelProps> = ({ initialTopicId }) => {
  const [activeTopic, setActiveTopic] = useState<ExploreTopicId>(initialTopicId || 'geom_measure');

  React.useEffect(() => {
    if (initialTopicId) {
      setActiveTopic(initialTopicId);
    }
  }, [initialTopicId]);

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-[82vh]">
      {/* Sub-header điều hướng các chuyên đề khám phá */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-4 py-3 shadow-md shrink-0 border-b border-emerald-600/40">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white uppercase drop-shadow-xs">
              Chuyên Đề Khám Phá
            </h2>
          </div>

          {/* Thanh chuyển đổi các chuyên đề */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full p-1 bg-black/25 rounded-2xl border border-white/20 backdrop-blur-md">
            {EXPLORE_TOPICS.map((topic) => {
              const isActive = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? `${topic.activeColor} scale-[1.02]`
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Nội dung chuyên đề đang chọn */}
      <div className="flex-1 overflow-y-auto">
        {activeTopic === 'geom_measure' && <GeometryMeasurementPanel />}
        {activeTopic === 'map_scale' && <MapScalePanel />}
        {activeTopic === 'motion' && <MotionPanel />}
        {activeTopic === 'two_numbers' && <TwoNumbersProblemsPanel />}
        {activeTopic === 'percentage' && <PercentagePanel />}
        {activeTopic === 'prob_stats' && <ProbabilityStatsPanel />}
      </div>
    </div>
  );
};

export default ExplorePanel;
