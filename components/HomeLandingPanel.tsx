import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Trophy, 
  Bell, 
  BookOpen, 
  ArrowRight, 
  HeartHandshake, 
  ChevronRight,
  Search
} from 'lucide-react';
import { ExploreTopicId } from './ExplorePanel';
import { ConquerSubTab } from './ConquerHubPanel';

interface HomeLandingPanelProps {
  onNavigateTab: (tab: 'explore' | 'fun' | 'conquer') => void;
  onNavigateExploreTopic?: (topicId: ExploreTopicId) => void;
  onNavigateConquerSubTab?: (subTab: ConquerSubTab) => void;
  onOpenSearch?: () => void;
}

export const HomeLandingPanel: React.FC<HomeLandingPanelProps> = ({
  onNavigateTab,
  onNavigateExploreTopic,
  onNavigateConquerSubTab,
  onOpenSearch,
}) => {
  // Ảnh chân dung cố định của tác giả Cô giáo Lê Thị Thu (ĐÃ KHÓA CỐ ĐỊNH)
  const teacherPhoto = "https://i.ibb.co/zHLQGR6Y/1.png";
  const exploreTopicsList: { id: ExploreTopicId; title: string; subtitle: string; icon: string; bg: string }[] = [
    {
      id: 'geom_measure',
      title: 'Hình Học & Đo Lường',
      subtitle: 'Hình phẳng, Khai triển 3D, Thể tích & Bảng đổi đơn vị',
      icon: '📐',
      bg: 'hover:border-emerald-400 hover:bg-emerald-50/50'
    },
    {
      id: 'map_scale',
      title: 'Tỉ Lệ Bản Đồ & Ứng Dụng',
      subtitle: 'Mô phỏng bản đồ tương tác, thước đo, tính khoảng cách thực tế và bản vẽ mặt bằng',
      icon: '🗺️',
      bg: 'hover:border-amber-400 hover:bg-amber-50/50'
    },
    {
      id: 'motion',
      title: 'Toán Chuyển Động Đều',
      subtitle: 'Mô phỏng 2 xe chạy cùng chiều, ngược chiều, s = v × t',
      icon: '🚗',
      bg: 'hover:border-orange-400 hover:bg-orange-50/50'
    },
    {
      id: 'two_numbers',
      title: 'Bài Toán Tìm Hai Số',
      subtitle: 'Tổng – Hiệu, Tổng – Tỉ, Hiệu – Tỉ & Tìm phân số của một số',
      icon: '⚖️',
      bg: 'hover:border-purple-400 hover:bg-purple-50/50'
    },
    {
      id: 'percentage',
      title: 'Tỉ Số Phần Trăm',
      subtitle: 'Mô phỏng 100 ô, 3 bài toán cơ bản, bài toán lãi suất thực tế',
      icon: '📊',
      bg: 'hover:border-rose-400 hover:bg-rose-50/50'
    },
    {
      id: 'prob_stats',
      title: 'Xác Suất & Thống Kê',
      subtitle: 'Vòng quay may mắn, tung xúc xắc, biểu đồ quạt tròn và cột',
      icon: '🎲',
      bg: 'hover:border-teal-400 hover:bg-teal-50/50'
    }
  ];

  const handleTopicClick = (topicId: ExploreTopicId) => {
    if (onNavigateExploreTopic) {
      onNavigateExploreTopic(topicId);
    } else {
      onNavigateTab('explore');
    }
  };

  const handleConquerSubClick = (subTab: ConquerSubTab) => {
    if (onNavigateConquerSubTab) {
      onNavigateConquerSubTab(subTab);
    } else {
      onNavigateTab('conquer');
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* ================= 1. HERO BANNER CHÍNH GỌN GÀNG & TRUYỀN CẢM HỨNG ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/30">
        
        {/* Họa tiết trang trí toán học nền tinh tế */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mathGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mathGrid)" />
          </svg>
        </div>

        {/* Các quả cầu ánh sáng mờ */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-3.5">
          {/* Tiêu đề chính */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
            Khám Phá Toán Học Cùng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
              MathFlow 5
            </span>
          </h1>

          {/* Câu mô tả mục tiêu giáo dục bổ sung theo yêu cầu */}
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-medium max-w-3xl mx-auto leading-relaxed">
            Ứng dụng giúp các em khám phá Toán học qua mô phỏng trực quan, trò chơi tương tác và trải nghiệm học tập thú vị.
          </p>

          {/* 3 Chỉ số nổi bật thiết kế làm gọn */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 border-t border-emerald-700/40 text-emerald-200 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-lg md:text-xl font-black text-white">6 Chuyên đề</span>
              <span className="text-[11px] text-emerald-300">Trọng tâm Toán 5</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-lg md:text-xl font-black text-white">100% Trực quan</span>
              <span className="text-[11px] text-emerald-300">Mô phỏng 3D sinh động</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base sm:text-lg md:text-xl font-black text-white">Tự sửa lỗi</span>
              <span className="text-[11px] text-emerald-300">Bảng tính tự chấm điểm</span>
            </div>
          </div>

          {/* Nút bấm Kính lúp Tìm kiếm nhanh nội dung trong app */}
          {onOpenSearch && (
            <div className="pt-2">
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 border-2 border-amber-200 cursor-pointer"
                title="Bấm để mở công cụ tìm kiếm nhanh tất cả nội dung trong MathFlow"
              >
                <Search size={18} className="stroke-[2.5]" />
                <span>Tìm Kiếm Nhanh Chuyên Đề & Bài Học Trong App</span>
                <span className="hidden sm:inline text-[11px] bg-slate-900/15 px-2 py-0.5 rounded-md font-mono">Ctrl + K</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= 2. BA TRỤ CỘT HỌC TẬP CHÍNH (KHÁM PHÁ - VUI HỌC - CHINH PHỤC) ================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="text-emerald-600" />
            Lộ trình học tập toàn diện
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ba Không Gian Học Tập Đỉnh Cao
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Lựa chọn không gian phù hợp với mục tiêu học tập của em hôm nay: 
            học bài mới, luyện tập qua trò chơi hay thi đấu vinh quang.
          </p>
        </div>

        {/* Lưới 3 thẻ Trụ cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TRỤ CỘT 1: KHÁM PHÁ */}
          <div className="group bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <Compass className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Không gian 1 · Kiến thức nền tảng
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-emerald-700 transition-colors">
                  Khám Phá Tri Thức
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Hiểu sâu bản chất công thức qua mô phỏng 3D, thanh trượt tương tác và bảng thực hành tự sửa lỗi.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('explore')}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Vào Khám Phá Ngay</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* TRỤ CỘT 2: TRẢI NGHIỆM VUI HỌC */}
          <div className="group bg-white rounded-3xl p-6 border-2 border-violet-100 hover:border-violet-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                  Không gian 2 · Chơi mà học
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-violet-700 transition-colors">
                  Trải Nghiệm Vui Học
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Củng cố kỹ năng giải toán qua hệ thống trắc nghiệm theo chuyên đề và các mini-game toán học hào hứng.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('fun')}
              className="mt-6 w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Vào Vui Học Ngay</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* TRỤ CỘT 3: CHINH PHỤC */}
          <div className="group bg-white rounded-3xl p-6 border-2 border-rose-100 hover:border-rose-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Không gian 3 · Khẳng định tài năng
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-rose-700 transition-colors">
                  Chinh Phục Đỉnh Cao
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Thi đấu đấu trường Rung Chuông Vàng kịch tính và chinh phục 10 bộ đề thi học sinh giỏi toán nâng cao.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => handleConquerSubClick('challenge')}
                className="py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trophy size={14} />
                <span>Thử Thách</span>
              </button>
              <button
                onClick={() => handleConquerSubClick('bell')}
                className="py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Bell size={14} />
                <span>Chuông Vàng</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. TRUY CẬP NHANH CÁC CHUYÊN ĐỀ KHÁM PHÁ ================= */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-700/60 pb-6 mb-6">
            <div>
              <span className="text-amber-300 text-xs font-black uppercase tracking-wider">Chọn nhanh chuyên đề</span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Các Dạng Toán Trọng Tâm Toán 5
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('explore')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Xem toàn bộ chuyên đề</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {exploreTopicsList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTopicClick(item.id)}
                className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex items-start gap-3.5"
              >
                <span className="text-2xl p-2 rounded-xl bg-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80 line-clamp-2 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <ChevronRight size={16} className="text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0 self-center" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. PHẦN HƯỚNG DẪN HỌC TẬP THÔNG MINH (STUDY GUIDE) ================= */}
      <section id="huong-dan-hoc-tap" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Tiêu đề mục Hướng dẫn học tập */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
            <BookOpen size={14} className="text-blue-600" />
            Phương pháp học tập tự chủ & hiệu quả
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Hướng Dẫn Học Tập Cùng MathFlow
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Các tính năng thông minh giúp các em học sinh và Quý Thầy Cô khai thác hiệu quả nhất trong học tập và giảng dạy.
          </p>
        </div>

        {/* 4 Hướng dẫn cốt lõi khi học Toán 5 trên MathFlow */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm">
                ⛶
              </div>
              <h5 className="font-bold text-sm text-white">Chế độ Toàn màn hình</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bấm nút phóng to góc trên bên phải để học tập tập trung tối đa, không bị ảnh hưởng bởi thông báo khác.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm">
                🔄
              </div>
              <h5 className="font-bold text-sm text-white">Bảng Tương Tác & Bài Giải Mẫu</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Xem bài giải mẫu ở số liệu đầu tiên. Khi đổi số đo, tự điền kết quả vào bảng tính, hệ thống tự chấm điểm và cho làm lại khi sai.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-sm">
                💡
              </div>
              <h5 className="font-bold text-sm text-white">Tận dụng Nút Gợi ý</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khi gặp bài toán khó, đừng vội nản lòng. Hãy bấm &quot;Xem gợi ý&quot; để mở khóa nút thắt của bài toán.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-sm">
                📺
              </div>
              <h5 className="font-bold text-sm text-white">Dành cho Thầy Cô & Lớp học</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Giao diện được tối ưu hóa cho màn hình cảm ứng, bảng thông minh và máy chiếu giảng dạy trực quan tại lớp.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. THÔNG ĐIỆP TÁC GIẢ & Ý NGHĨA SƯ PHẠM (NỀN TRẮNG HOÀN TOÀN, KHUNG XANH LÁ CÂY) ================= */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:border-emerald-600 transition-all flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          {/* Khung ảnh chân dung Cô giáo Lê Thị Thu (ĐÃ KHÓA CỐ ĐỊNH) */}
          <div className="relative shrink-0 select-none">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-700/20 bg-emerald-50 flex items-center justify-center">
              <img 
                src={teacherPhoto} 
                alt="Cô giáo Lê Thị Thu" 
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-red-600 tracking-wide select-none">
              MathFlow – Nâng Cánh Ước Mơ Học Toán Vùng Cao
            </h4>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
              &quot;Với tâm huyết mang công nghệ số và phương pháp học tập trực quan sinh động đến với các em học sinh lớp 5, đặc biệt là đối với các em nhỏ vùng cao, MathFlow được xây dựng với mong muốn biến những con số, hình khối khô khan thành những trải nghiệm đầy hứng khởi và niềm vui khám phá.&quot;
            </p>

            <p className="text-xs sm:text-sm font-bold text-emerald-800 pt-1 border-t border-emerald-100">
              Tác giả phần mềm: Cô giáo Lê Thị Thu – Trường PTDT Bán trú Tiểu học Hội Nga, xã Quỳ Châu, tỉnh Nghệ An.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomeLandingPanel;
