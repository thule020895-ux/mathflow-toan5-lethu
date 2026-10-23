import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  ChevronRight, 
  Compass, 
  Sparkles, 
  Trophy, 
  Bell, 
  BookOpen, 
  Map, 
  Timer, 
  Scale, 
  Percent, 
  BarChart3, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { ExploreTopicId } from './ExplorePanel';
import { ConquerSubTab } from './ConquerHubPanel';

export type SearchCategory = 'all' | 'explore' | 'fun' | 'conquer' | 'tools';

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'explore' | 'fun' | 'conquer' | 'tools';
  categoryLabel: string;
  categoryColor: string;
  icon: string | React.ReactNode;
  keywords: string[];
  tab: 'home' | 'explore' | 'fun' | 'conquer' | 'admin';
  exploreTopicId?: ExploreTopicId;
  conquerSubTab?: ConquerSubTab;
  anchor?: string;
  previewTags?: string[];
}

interface AppSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (
    tab: 'home' | 'explore' | 'fun' | 'conquer' | 'admin', 
    exploreTopicId?: ExploreTopicId, 
    conquerSubTab?: ConquerSubTab,
    anchor?: string
  ) => void;
}

const SEARCH_DATABASE: SearchItem[] = [
  // --- 6 CHUYÊN ĐỀ KHÁM PHÁ ---
  {
    id: 'explore-geom-measure',
    title: 'Hình Học & Đo Lường',
    subtitle: 'Hình tam giác, hình thang, hình tròn, hình lập phương, hình hộp chữ nhật, khai triển 3D & bảng đổi đơn vị',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '📐',
    keywords: [
      'hình học', 'đo lường', 'hình tam giác', 'hình thang', 'hình tròn', 'chu vi', 'diện tích',
      'đáy', 'chiều cao', 'bán kính', 'đường kính', '3.14', 'hình hộp chữ nhật', 'hình lập phương',
      'diện tích xung quanh', 'diện tích toàn phần', 'thể tích', 'khai triển 3d', 'bảng đổi đơn vị',
      'km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm', 'kg', 'tấn', 'tạ', 'yến', 'm2', 'ha', 'm3', 'lít', 'lit'
    ],
    tab: 'explore',
    exploreTopicId: 'geom_measure',
    previewTags: ['Tam giác', 'Hình thang', 'Hình tròn', 'Thể tích 3D', 'Đổi đơn vị']
  },
  {
    id: 'explore-map-scale',
    title: 'Tỉ Lệ Bản Đồ & Ứng Dụng Thực Tế',
    subtitle: 'Bản đồ Việt Nam tương tác, thước đo khoảng cách thực tế giữa các tỉnh thành, tỉ lệ xích và bản vẽ mặt bằng',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '🗺️',
    keywords: [
      'tỉ lệ bản đồ', 'ti le ban do', 'bản đồ', 'ban do', 'khoảng cách thực tế', 'thước đo',
      'tỉ lệ xích', '1:100000', '1:1000000', '1:2000000', 'hà nội', 'đà nẵng', 'hải phòng', 'tp hcm',
      'cần thơ', 'mặt bằng', 'thửa ruộng', 'bản đồ địa chính', 'thực địa', 'đo khoảng cách'
    ],
    tab: 'explore',
    exploreTopicId: 'map_scale',
    previewTags: ['Bản đồ tương tác', 'Thước đo tỉ lệ', 'Khoảng cách thực tế', 'Bản vẽ mặt bằng']
  },
  {
    id: 'explore-motion',
    title: 'Toán Chuyển Động Đều',
    subtitle: 'Công thức s = v × t, mô phỏng 2 xe chạy cùng chiều, ngược chiều, chuyển động dòng nước xuôi ngược',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '🚗',
    keywords: [
      'chuyển động đều', 'chuyen dong deu', 'vận tốc', 'quãng đường', 'thời gian', 's = v * t', 's = v x t',
      'cùng chiều', 'ngược chiều', 'thời gian gặp nhau', 'hai xe', 'ô tô', 'xe máy', 'dòng nước',
      'xuôi dòng', 'ngược dòng', 'vận tốc thực', 'vận tốc dòng chảy', 'ca nô', 'thuyền'
    ],
    tab: 'explore',
    exploreTopicId: 'motion',
    previewTags: ['s = v × t', 'Cùng chiều', 'Ngược chiều', 'Dòng nước']
  },
  {
    id: 'explore-two-numbers',
    title: 'Tìm Hai Số Khi Biết Tổng & Tỉ, Hiệu & Tỉ Số',
    subtitle: 'Sơ đồ đoạn thẳng trực quan, tìm giá trị một phần, xác định số lớn và số bé theo tỉ số',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '⚖️',
    keywords: [
      'tổng tỉ', 'hiệu tỉ', 'tong ti', 'hieu ti', 'tìm hai số khi biết tổng và tỉ số', 'tìm hai số khi biết hiệu và tỉ số',
      'sơ đồ đoạn thẳng', 'số lớn', 'số bé', 'giá trị một phần', 'tổng số phần bằng nhau', 'hiệu số phần bằng nhau',
      'bài toán tuổi', 'tỉ số'
    ],
    tab: 'explore',
    exploreTopicId: 'two_numbers',
    previewTags: ['Tổng - Tỉ', 'Hiệu - Tỉ', 'Sơ đồ đoạn thẳng', 'Số lớn - Số bé']
  },
  {
    id: 'explore-percentage',
    title: 'Tỉ Số Phần Trăm & Ứng Dụng Thực Tế',
    subtitle: '3 bài toán cơ bản về tỉ số %, tính giá trị phần trăm, bài toán thực tế giảm giá, khuyến mãi, lãi suất',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '📊',
    keywords: [
      'tỉ số phần trăm', 'ti so phan tram', 'phần trăm', '%', 'tính phần trăm', 'lãi suất', 'giảm giá',
      'khuyến mãi', 'vốn và lãi', 'tiền gửi ngân hàng', 'tìm tỉ số phần trăm', 'bài toán phần trăm'
    ],
    tab: 'explore',
    exploreTopicId: 'percentage',
    previewTags: ['Khái niệm %', 'Tính giá trị %', 'Bài toán giảm giá', 'Lãi suất']
  },
  {
    id: 'explore-prob-stats',
    title: 'Xác Suất & Thống Kê Toán 5',
    subtitle: 'Biểu đồ hình quạt tròn, bảng số liệu thống kê, mô phỏng vòng quay may mắn và xác suất thực nghiệm',
    category: 'explore',
    categoryLabel: 'Chuyên đề Khám phá',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '🎲',
    keywords: [
      'xác suất', 'thống kê', 'xac suat', 'thong ke', 'biểu đồ hình quạt tròn', 'bảng số liệu',
      'vòng quay may mắn', 'xác suất thực nghiệm', 'chắc chắn', 'có thể', 'không thể xảy ra'
    ],
    tab: 'explore',
    exploreTopicId: 'prob_stats',
    previewTags: ['Biểu đồ quạt', 'Vòng quay may mắn', 'Thực nghiệm']
  },

  // --- TRẢI NGHIỆM VUI HỌC ---
  {
    id: 'fun-quiz',
    title: 'Trắc Nghiệm Toán 5 Theo Chuyên Đề',
    subtitle: 'Hệ thống câu hỏi trắc nghiệm rèn luyện kỹ năng, giải thích đáp án chi tiết và tự động chấm điểm',
    category: 'fun',
    categoryLabel: 'Vui Học & Trò Chơi',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '✨',
    keywords: [
      'trắc nghiệm', 'trac nghiem', 'luyện tập', 'luyen tap', 'kiểm tra', 'tự chấm điểm',
      'câu hỏi ôn tập', 'vui học', 'bài tập trắc nghiệm'
    ],
    tab: 'fun',
    previewTags: ['Trắc nghiệm nhanh', 'Tự chấm điểm', 'Giải thích chi tiết']
  },
  {
    id: 'fun-match-game',
    title: 'Trò Chơi Nối Phép Tính & Mini Game Toán',
    subtitle: 'Vừa chơi vừa học, ghép nối các cặp phép tính tương đương và rèn luyện phản xạ tính nhẩm nhanh',
    category: 'fun',
    categoryLabel: 'Vui Học & Trò Chơi',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🎮',
    keywords: [
      'trò chơi', 'tro choi', 'nối phép tính', 'game toán', 'tính nhẩm', 'phản xạ', 'mini game'
    ],
    tab: 'fun',
    previewTags: ['Nối phép tính', 'Tính nhẩm nhanh', 'Học qua trò chơi']
  },

  // --- CHINH PHỤC ĐỈNH CAO ---
  {
    id: 'conquer-bell',
    title: 'Đấu Trường Rung Chuông Vàng',
    subtitle: '5 vòng thi đấu kịch tính đếm ngược thời gian, cứu trợ thông minh và bảng vinh danh thành tích',
    category: 'conquer',
    categoryLabel: 'Chinh Phục Đỉnh Cao',
    categoryColor: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: '🔔',
    keywords: [
      'rung chuông vàng', 'rung chuong vang', 'chuông vàng', 'đấu trường', 'thi đấu',
      'bảng vàng', 'top điểm cao', 'bảng xếp hạng', '5 vòng thi', 'tính giờ đếm ngược'
    ],
    tab: 'conquer',
    conquerSubTab: 'bell',
    previewTags: ['5 Vòng thi đấu', 'Đếm ngược 30s', 'Bảng vàng vinh danh']
  },
  {
    id: 'conquer-challenge',
    title: '10 Bộ Đề Thử Thách Học Sinh Giỏi',
    subtitle: 'Kho 10 bộ đề thi học sinh giỏi toán nâng cao, kèm sơ đồ hình vẽ SVG trực quan và lời giải chuẩn mực',
    category: 'conquer',
    categoryLabel: 'Chinh Phục Đỉnh Cao',
    categoryColor: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: '🏆',
    keywords: [
      '10 bộ đề', 'thử thách', 'học sinh giỏi', 'toán nâng cao', 'đề thi', 'lời giải chi tiết',
      'sơ đồ svg', 'toán hsg', 'ôn thi học sinh giỏi'
    ],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['10 Bộ đề HSG', 'Sơ đồ hình vẽ SVG', 'Bài giải từng bước']
  },

  // --- CHI TIẾT 10 BỘ ĐỀ HSG ---
  {
    id: 'challenge-set-1',
    title: 'Đề 1: Tỉ Số Diện Tích & Hình Học Nâng Cao',
    subtitle: 'Kéo dài cạnh tam giác, tỉ số diện tích tam giác và bài toán hình học cắt ghép',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 1', 'tỉ số diện tích', 'tam giác nâng cao', 'kéo dài cạnh'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 1', 'Tam giác', 'Tỉ số diện tích']
  },
  {
    id: 'challenge-set-2',
    title: 'Đề 2: Hình Tròn & Hình Vuông Nội Tiếp',
    subtitle: 'Tính diện tích phần gạch chéo giữa hình vuông và hình tròn nội tiếp đường kính 20 cm',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 2', 'hình tròn', 'hình vuông nội tiếp', 'diện tích phần gạch chéo'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 2', 'Hình tròn', 'Hình vuông']
  },
  {
    id: 'challenge-set-3',
    title: 'Đề 3: Chu Vi & Diện Tích Hình Chữ Nhật Biến Đổi',
    subtitle: 'Tăng giảm chiều dài chiều rộng hình chữ nhật và tìm diện tích ban đầu',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 3', 'hình chữ nhật', 'chu vi', 'tăng giảm chiều dài rộng'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 3', 'Hình chữ nhật', 'Biến đổi kích thước']
  },
  {
    id: 'challenge-set-4',
    title: 'Đề 4: Đường Chéo Hình Thang & Tỉ Số Diện Tích',
    subtitle: 'Hai đường chéo hình thang cắt nhau tại O, so sánh diện tích tam giác hai bên',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 4', 'đường chéo hình thang', 'giao điểm o', 'tỉ số diện tích'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 4', 'Hình thang', 'Đường chéo']
  },
  {
    id: 'challenge-set-5',
    title: 'Đề 5: Sơn Các Mặt Khối Lập Phương Lớn',
    subtitle: 'Ghép khối lập phương lớn từ khối nhỏ, đếm số khối được sơn 3 mặt, 2 mặt, 1 mặt và 0 mặt',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 5', 'sơn khối lập phương', 'sơn 3 mặt', 'sơn 2 mặt', 'sơn 1 mặt', 'không sơn mặt nào'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 5', 'Khối lập phương', 'Sơn mặt']
  },
  {
    id: 'challenge-set-6',
    title: 'Đề 6: Quy Luật Dãy Số & Tìm Số Hạng Thứ n',
    subtitle: 'Quy luật dãy số cách đều, dãy phân số lặp lại, tìm số hạng thứ 100 và tính tổng dãy',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 6', 'quy luật dãy số', 'dãy số cách đều', 'số hạng thứ n', 'tổng dãy số', 'chữ số'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 6', 'Quy luật dãy số', 'Số hạng thứ n']
  },
  {
    id: 'challenge-set-7',
    title: 'Đề 7: Tổng - Hiệu - Tỉ Số Nâng Cao',
    subtitle: 'Bài toán sơ đồ đoạn thẳng nhiều đại lượng, chuyển đổi đơn vị và tuổi tác nâng cao',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 7', 'tổng hiệu tỉ', 'sơ đồ đoạn thẳng', 'bài toán nâng cao'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 7', 'Tổng - Hiệu - Tỉ', 'Sơ đồ nâng cao']
  },
  {
    id: 'challenge-set-8',
    title: 'Đề 8: Ứng Dụng Tỉ Số Phần Trăm & Giá Bán Lãi Suất',
    subtitle: 'Bài toán giá vốn, giá bán, phần trăm lãi theo vốn hoặc giá bán, hạ giá dịp lễ',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 8', 'tỉ số phần trăm', 'lãi theo giá vốn', 'lãi theo giá bán', 'giảm giá'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 8', 'Tỉ số %', 'Lãi suất', 'Giá vốn - Giá bán']
  },
  {
    id: 'challenge-set-9',
    title: 'Đề 9: Chuyển Động Đều Cùng Chiều, Ngược Chiều & Dòng Sông',
    subtitle: 'Hai ô tô đuổi kịp nhau, thời gian gặp nhau và bài toán ca nô xuôi dòng ngược dòng',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 9', 'chuyển động đều', 'hai xe đuổi nhau', 'xuôi dòng', 'ngược dòng sông'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 9', 'Chuyển động đều', 'Đuổi nhau', 'Dòng nước']
  },
  {
    id: 'challenge-set-10',
    title: 'Đề 10: Ứng Dụng Tỉ Lệ Bản Đồ & Địa Hình Thực Tế',
    subtitle: 'Tính thời gian lộ trình ô tô theo bản đồ, diện tích thửa ruộng trên bản đồ địa chính',
    category: 'conquer',
    categoryLabel: 'Bộ Đề Thử Thách',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: '📝',
    keywords: ['đề 10', 'tỉ lệ bản đồ', 'thời gian lộ trình', 'diện tích thửa ruộng', 'địa chính'],
    tab: 'conquer',
    conquerSubTab: 'challenge',
    previewTags: ['Đề số 10', 'Tỉ lệ bản đồ', 'Thửa ruộng', 'Địa hình']
  },

  // --- CÔNG CỤ & TIỆN ÍCH KHÁC ---
  {
    id: 'tools-unit-conversion',
    title: 'Bảng Đổi Đơn Vị Đo Lường Toàn Diện',
    subtitle: 'Bảng quy đổi tương tác 4 hệ đo lường: Độ dài, Khối lượng, Diện tích và Thể tích',
    category: 'tools',
    categoryLabel: 'Công Cụ Tiện Ích',
    categoryColor: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: '🔄',
    keywords: ['đổi đơn vị', 'doi don vi', 'km', 'm', 'cm', 'mm', 'kg', 'tấn', 'ha', 'm2', 'm3', 'lít'],
    tab: 'explore',
    exploreTopicId: 'geom_measure',
    previewTags: ['Độ dài', 'Khối lượng', 'Diện tích', 'Thể tích']
  },
  {
    id: 'tools-study-guide',
    title: 'Hướng Dẫn Học Tập & Khai Thác Ứng Dụng',
    subtitle: 'Phương pháp học tập tự chủ, chế độ toàn màn hình, bảng tương tác tự chấm điểm và nút gợi ý',
    category: 'tools',
    categoryLabel: 'Hướng Dẫn',
    categoryColor: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: '📖',
    keywords: ['hướng dẫn', 'huong dan', 'cách học', 'toàn màn hình', 'gợi ý', 'giáo viên'],
    tab: 'home',
    anchor: 'huong-dan-hoc-tap',
    previewTags: ['Toàn màn hình', 'Gợi ý giải bài', 'Dành cho lớp học']
  },
  {
    id: 'tools-author-info',
    title: 'Thông Tin Tác Giả: Cô giáo Lê Thị Thu',
    subtitle: 'Trường PTDT Bán trú Tiểu học Hội Nga, xã Quỳ Châu, tỉnh Nghệ An · Sứ mệnh nâng cánh ước mơ học toán vùng cao',
    category: 'tools',
    categoryLabel: 'Tác Giả & Sứ Mệnh',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '👩‍🏫',
    keywords: ['tác giả', 'tac gia', 'cô giáo lê thị thu', 'hội nga', 'quỳ châu', 'nghệ an', 'vùng cao'],
    tab: 'home',
    anchor: 'tac-gia',
    previewTags: ['Cô giáo Thu', 'Quỳ Châu', 'Nghệ An', 'Sứ mệnh vùng cao']
  },
  {
    id: 'tools-admin-center',
    title: 'Trung Tâm Quản Trị Hệ Thống',
    subtitle: 'Nắm bắt số lượng tài khoản học sinh, giáo viên tham gia (dành riêng cho thule020895@gmail.com)',
    category: 'tools',
    categoryLabel: 'Quản Trị',
    categoryColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '🛡️',
    keywords: ['quản trị', 'quan tri', 'admin', 'thule020895@gmail.com', 'học sinh', 'giáo viên', 'thống kê'],
    tab: 'admin',
    previewTags: ['Quản lý tài khoản', 'Chuyên cần', 'Bảng vàng']
  }
];

const POPULAR_SEARCH_TAGS = [
  'Hình thang',
  'Tỉ lệ bản đồ',
  'Chuyển động đều',
  'Rung Chuông Vàng',
  'Tổng - Tỉ số',
  'Phần trăm %',
  'Đổi đơn vị',
  '10 Bộ đề HSG',
  'Quy luật dãy số'
];

export const AppSearchModal: React.FC<AppSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setSearchTerm('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Handle keyboard navigation & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return SEARCH_DATABASE.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;

      // Match in title, subtitle, or keywords
      const titleMatch = item.title.toLowerCase().includes(query);
      const subtitleMatch = item.subtitle.toLowerCase().includes(query);
      const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(query));

      return titleMatch || subtitleMatch || keywordMatch;
    });
  }, [searchTerm, selectedCategory]);

  const handleItemClick = (item: SearchItem) => {
    onNavigate(item.tab, item.exploreTopicId, item.conquerSubTab, item.anchor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 w-full max-w-3xl overflow-hidden flex flex-col my-auto transition-all max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER TÌM KIẾM NỘI DUNG ================= */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shrink-0">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md border border-amber-300">
                <Search size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>Tìm Kiếm Nội Dung Trong MathFlow</span>
                  <span className="text-[10px] font-bold bg-white/20 text-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline">
                    Toán 5
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100">
                  Tìm nhanh 6 chuyên đề, 10 bộ đề thi, đấu trường Chuông Vàng và các bảng công thức
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-emerald-100 hover:text-white hover:bg-rose-500/80 rounded-xl transition-all cursor-pointer"
              title="Đóng tìm kiếm (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Ô nhập từ khóa tìm kiếm */}
          <div className="relative mt-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên chuyên đề, dạng toán, công thức hoặc số đề thi... (Ví dụ: hình thang, tỉ lệ bản đồ, s = v × t)"
              className="w-full pl-11 pr-10 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold rounded-2xl outline-none border-2 border-emerald-300 focus:border-amber-400 shadow-md transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Xóa từ khóa"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ================= THANH BỘ LỌC DANH MỤC & TỪ KHÓA GỢI Ý ================= */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 px-4 space-y-2 shrink-0">
          
          {/* Bộ lọc danh mục */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-black text-slate-500 whitespace-nowrap mr-1">
              Danh mục:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              Tất cả ({SEARCH_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('explore')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'explore'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              📐 6 Chuyên đề Khám phá
            </button>
            <button
              onClick={() => setSelectedCategory('conquer')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'conquer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              🏆 Chuông Vàng & 10 Bộ đề HSG
            </button>
            <button
              onClick={() => setSelectedCategory('fun')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'fun'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              🎮 Vui học & Trò chơi
            </button>
            <button
              onClick={() => setSelectedCategory('tools')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'tools'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              ⚙️ Công cụ & Quản trị
            </button>
          </div>

          {/* Gợi ý từ khóa phổ biến */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">
              Gợi ý nhanh:
            </span>
            {POPULAR_SEARCH_TAGS.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(tag)}
                className="text-[11px] font-semibold text-slate-600 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-0.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* ================= DANH SÁCH KẾT QUẢ TÌM KIẾM ================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-white custom-scrollbar">
          {filteredResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 px-1 flex items-center justify-between">
                <span>Tìm thấy {filteredResults.length} nội dung phù hợp:</span>
                <span className="text-[10px] italic">Bấm vào mục để chuyển đến ngay</span>
              </div>

              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex items-start gap-3.5 shadow-2xs hover:shadow-md"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.categoryColor}`}>
                        {item.categoryLabel}
                      </span>
                    </div>

                    <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {item.previewTags && item.previewTags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {item.previewTags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Go to arrow */}
                  <div className="self-center p-2 rounded-xl text-slate-400 group-hover:text-emerald-700 group-hover:bg-emerald-100 transition-all shrink-0">
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-700">
                Không tìm thấy nội dung phù hợp với &quot;{searchTerm}&quot;
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Em có thể thử tìm với các từ khóa thông dụng như: <br />
                <span className="font-semibold text-emerald-700">hình thang, tỉ lệ bản đồ, chuyển động, rung chuông vàng, phần trăm, đổi đơn vị</span>
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Hiển thị lại toàn bộ nội dung
              </button>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-3 px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Phím tắt:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-2xs">ESC</kbd>
            <span className="hidden sm:inline">để đóng</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span>MathFlow · Tra cứu nhanh kiến thức Toán 5</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppSearchModal;
