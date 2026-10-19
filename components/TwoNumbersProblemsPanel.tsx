import React, { useState } from 'react';
import { 
  Scale, 
  Split, 
  PieChart, 
  Sparkles, 
  Calculator, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import SumDifferencePanel from './SumDifferencePanel';
import RatioFractionPanel from './RatioFractionPanel';

export type TwoNumbersTab = 'sum_diff' | 'sum_ratio' | 'diff_ratio' | 'fraction';

interface TwoNumbersTabItem {
  id: TwoNumbersTab;
  title: string;
  subTitle: string;
  badge: string;
  icon: React.ReactNode;
  activeColor: string;
}

const TWO_NUMBERS_TABS: TwoNumbersTabItem[] = [
  {
    id: 'sum_diff',
    title: '1. Tổng – Hiệu',
    subTitle: 'Biết Tổng và Hiệu hai số',
    badge: 'Số lớn / Số bé',
    icon: <Scale size={18} />,
    activeColor: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
  },
  {
    id: 'sum_ratio',
    title: '2. Tổng – Tỉ',
    subTitle: 'Biết Tổng và Tỉ số hai số',
    badge: 'Tổng số phần bằng nhau',
    icon: <Split size={18} />,
    activeColor: 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
  },
  {
    id: 'diff_ratio',
    title: '3. Hiệu – Tỉ',
    subTitle: 'Biết Hiệu và Tỉ số hai số',
    badge: 'Hiệu số phần bằng nhau',
    icon: <Split size={18} />,
    activeColor: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
  },
  {
    id: 'fraction',
    title: '4. Phân Số Của Một Số',
    subTitle: 'Tìm m/n của một đại lượng',
    badge: 'Phép nhân phân số',
    icon: <PieChart size={18} />,
    activeColor: 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
  }
];

export const TwoNumbersProblemsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TwoNumbersTab>('sum_diff');

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-[82vh]">
      {/* Sub-header điều hướng Bài toán tìm hai số */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-fuchsia-900 text-white px-4 py-3 shadow-md shrink-0 border-b border-indigo-600/40">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <Calculator size={20} className="animate-bounce-subtle" />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white uppercase drop-shadow-xs">
              Bài Toán Tìm Hai Số
            </h2>
          </div>

          {/* Thanh chuyển đổi 4 phân mục bài toán tìm hai số */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full p-1 bg-black/25 rounded-2xl border border-white/20 backdrop-blur-md">
            {TWO_NUMBERS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? `${tab.activeColor} scale-[1.02]`
                      : 'text-indigo-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Hiển thị nội dung dạng toán tương ứng */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sum_diff' && <SumDifferencePanel />}
        {activeTab === 'sum_ratio' && <RatioFractionPanel initialSubMode="sum_ratio" />}
        {activeTab === 'diff_ratio' && <RatioFractionPanel initialSubMode="diff_ratio" />}
        {activeTab === 'fraction' && <RatioFractionPanel initialSubMode="fraction_of_num" />}
      </div>
    </div>
  );
};

export default TwoNumbersProblemsPanel;
