import React, { useState } from 'react';
import { 
  Triangle, 
  Box, 
  Layers, 
  Timer, 
  Scale, 
  Sparkles,
  Compass
} from 'lucide-react';
import Shape2DPanel from './Shape2DPanel';
import Shape3DPanel from './Shape3DPanel';
import VolumePanel from './VolumePanel';
import UnitConversionPanel from './UnitConversionPanel';

export type GeoMeasureSubTab = '2d' | '3d' | 'volume' | 'unit';

interface SubTabItem {
  id: GeoMeasureSubTab;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  activeColor: string;
  badge: string;
}

const SUB_TABS: SubTabItem[] = [
  {
    id: '2d',
    label: 'Hình Phẳng',
    subLabel: 'Tam giác, hình thang, hình tròn',
    icon: <Triangle size={18} />,
    activeColor: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
    badge: 'Chu vi & Diện tích'
  },
  {
    id: '3d',
    label: 'Khai Triển 3D',
    subLabel: 'Hình hộp chữ nhật & hình lập phương',
    icon: <Box size={18} />,
    activeColor: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    badge: 'Diện tích XQ & Toàn phần'
  },
  {
    id: 'volume',
    label: 'Thể Tích',
    subLabel: 'Thể tích hình khối, xếp khối',
    icon: <Layers size={18} />,
    activeColor: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
    badge: 'Mô phỏng 3D'
  },
  {
    id: 'unit',
    label: 'Đổi Đơn Vị Đo',
    subLabel: 'Khối lượng, độ dài, dung tích, diện tích, thể tích',
    icon: <Scale size={18} />,
    activeColor: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    badge: 'Bảng quy đổi đại lượng'
  }
];

interface Props {
  initialSubTab?: GeoMeasureSubTab;
}

export const GeometryMeasurementPanel: React.FC<Props> = ({ initialSubTab = '2d' }) => {
  const [activeSubTab, setActiveSubTab] = useState<GeoMeasureSubTab>(initialSubTab);

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-[82vh]">
      {/* Sub-navigation Header cho Hình học và Đo lường */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 text-white px-4 py-3 shadow-md shrink-0 border-b border-emerald-600/40">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-200 shadow-inner">
              <Compass size={20} className="animate-spin-slow" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white uppercase drop-shadow-xs">
              Hình Học Và Đo Lường
            </h2>
          </div>

          {/* Thanh chuyển đổi 4 phân mục con */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full p-1 bg-black/25 rounded-2xl border border-white/20 backdrop-blur-md">
            {SUB_TABS.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? `${tab.activeColor} scale-[1.02]`
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
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

      {/* Hiển thị phân mục tương ứng */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === '2d' && <Shape2DPanel />}
        {activeSubTab === '3d' && <Shape3DPanel />}
        {activeSubTab === 'volume' && <VolumePanel />}
        {activeSubTab === 'unit' && <UnitConversionPanel />}
      </div>
    </div>
  );
};

export default GeometryMeasurementPanel;
