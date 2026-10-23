import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  Home as HomeIcon,
  Compass as CompassIcon,
  Sparkles as SparklesIcon,
  Trophy as TrophyIcon,
  LogIn as LogInIcon,
  LogOut as LogOutIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Menu as MenuIcon,
  X as XIcon,
  Search as SearchIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { auth } from './firebase';
import { useFirebase } from './components/FirebaseProvider';
import AppLogo from './components/AppLogo';
import HomeLandingPanel from './components/HomeLandingPanel';
import ExplorePanel, { ExploreTopicId } from './components/ExplorePanel';
import FunExperiencePanel from './components/FunExperiencePanel';
import ConquerHubPanel, { ConquerSubTab } from './components/ConquerHubPanel';
import AdminPanel from './components/AdminPanel';
import AppSearchModal from './components/AppSearchModal';

type TabId = 'home' | 'explore' | 'fun' | 'conquer' | 'admin';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  inactiveColor: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedExploreTopic, setSelectedExploreTopic] = useState<ExploreTopicId>('geom_measure');
  const [selectedConquerSubTab, setSelectedConquerSubTab] = useState<ConquerSubTab>('challenge');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Lắng nghe phím tắt Ctrl+K hoặc Cmd+K để mở hộp thoại tìm kiếm nhanh
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchNavigate = (
    tab: TabId,
    exploreTopicId?: ExploreTopicId,
    conquerSubTab?: ConquerSubTab,
    anchor?: string
  ) => {
    setActiveTab(tab);
    if (exploreTopicId) {
      setSelectedExploreTopic(exploreTopicId);
    }
    if (conquerSubTab) {
      setSelectedConquerSubTab(conquerSubTab);
    }
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const { user, userProfile, isAdmin, loading, signOutUser } = useFirebase();

  const isMasterAdmin = !user?.isAnonymous && (user?.email === 'thule020895@gmail.com' || isAdmin);

  // Navigation items: Trang Chủ, Khám Phá, Trải Nghiệm Vui Học, Chinh Phục + Quản Trị
  const baseNavItems: NavItem[] = [
    { 
      id: 'home', 
      label: 'Trang Chủ', 
      icon: <HomeIcon size={18} />, 
      activeColor: 'bg-emerald-600 text-white shadow-sm',
      inactiveColor: 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80'
    },
    { 
      id: 'explore', 
      label: 'Khám Phá', 
      icon: <CompassIcon size={18} />, 
      activeColor: 'bg-teal-600 text-white shadow-sm',
      inactiveColor: 'text-slate-700 hover:text-teal-700 hover:bg-teal-50/80'
    },
    { 
      id: 'fun', 
      label: 'Trải Nghiệm Vui Học', 
      icon: <SparklesIcon size={18} />, 
      activeColor: 'bg-blue-600 text-white shadow-sm',
      inactiveColor: 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/80'
    },
    { 
      id: 'conquer', 
      label: 'Chinh Phục', 
      icon: <TrophyIcon size={18} />, 
      activeColor: 'bg-amber-600 text-white shadow-sm',
      inactiveColor: 'text-slate-700 hover:text-amber-700 hover:bg-amber-50/80'
    },
  ];

  const adminNavItem: NavItem = {
    id: 'admin',
    label: 'Quản Trị',
    icon: <ShieldCheckIcon size={18} />,
    activeColor: 'bg-slate-900 text-emerald-400 shadow-sm border border-emerald-500/50',
    inactiveColor: 'text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 font-black'
  };

  const navItems = isMasterAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(err => {
      console.error("Login error:", err);
    });
  };

  const logout = async () => {
    try {
      await signOutUser();
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-extrabold text-emerald-900 text-sm">Đang kết nối MathFlow - TOÁN 5...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ================= THANH ĐIỀU HƯỚNG TRÊN CÙNG: XANH LÁ CÂY & TRẮNG ================= */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-40 border-b-2 border-emerald-800">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Logo MathFlow & Tên ứng dụng ấn tượng (Click về Trang Chủ) */}
            <button 
              onClick={() => setActiveTab('home')} 
              className="text-left cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 focus:outline-hidden"
              title="Về Trang Chủ MathFlow"
            >
              <AppLogo size="md" showText={true} textColor="light" />
            </button>

            {/* Các tab chức năng - Nền trắng trang nhã, phân chia rõ ràng */}
            <div className="hidden lg:flex items-center overflow-x-auto no-scrollbar py-1">
              <nav className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-200">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? item.activeColor
                          : `${item.inactiveColor} bg-transparent`
                      }`}
                    >
                      <span className={isActive ? 'scale-110' : ''}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Khu vực hành động bên phải: Chatbot AI (Kính Lúp) / Login / Fullscreen / Mobile Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Nút Tìm kiếm với biểu tượng Kính lúp (Search) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md shadow-amber-500/20 transition-all border border-amber-300 cursor-pointer"
                title="Tìm kiếm nhanh nội dung trong app (Ctrl+K)"
              >
                <SearchIcon size={16} className="text-slate-950 stroke-[2.5]" />
                <span className="hidden sm:inline">Tìm Kiếm</span>
                <span className="hidden md:inline text-[10px] bg-slate-900/15 text-slate-950 px-1.5 py-0.5 rounded font-mono">⌘K</span>
              </button>

              {!user || user.isAnonymous ? (
                <button
                  onClick={login}
                  className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-black transition-all border border-emerald-200 shadow-xs cursor-pointer"
                  title="Đăng nhập tài khoản"
                >
                  <LogInIcon size={15} className="text-emerald-600" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex flex-col text-right leading-none">
                    <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                      {userProfile?.displayName || user.displayName || user.email}
                    </span>
                    <span className="text-[9px] text-emerald-200 font-bold">
                      {isMasterAdmin ? '👑 Quản trị viên' : userProfile?.role === 'teacher' ? '👨‍🏫 Giáo viên' : '🎓 Học sinh'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-rose-500/80 active:scale-95 text-white px-2.5 py-1.5 rounded-xl text-xs font-black transition-all border border-white/20 cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOutIcon size={15} />
                    <span className="hidden sm:inline">Thoát</span>
                  </button>
                </div>
              )}

              <button
                onClick={toggleFullScreen}
                className="p-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
                title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              >
                {isFullscreen ? <MinimizeIcon size={16} /> : <MaximizeIcon size={16} />}
              </button>

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-all cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-emerald-900/95 backdrop-blur-md px-4 py-3 border-t border-emerald-600/40 animate-in slide-in-from-top-2 space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? item.activeColor
                        : 'bg-white text-slate-800 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth button */}
            <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between">
              {user && !user.isAnonymous ? (
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                      {userProfile?.displayName || user.displayName || user.email}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      {isMasterAdmin ? '👑 Quản trị viên' : userProfile?.role === 'teacher' ? '👨‍🏫 Giáo viên' : '🎓 Học sinh'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                  >
                    <LogOutIcon size={14} />
                    <span>Thoát</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-800 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <LogInIcon size={15} />
                  <span>Đăng nhập Google</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= NỘI DUNG CHÍNH (MAIN CONTENT) ================= */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-2 sm:p-4 md:p-6 pb-12">
        <div className="bg-white rounded-3xl shadow-md border-2 border-emerald-500 overflow-hidden min-h-[82vh] flex flex-col">
          {activeTab === 'home' && (
            <HomeLandingPanel 
              onNavigateTab={(tab) => setActiveTab(tab)}
              onNavigateExploreTopic={(topicId) => {
                setSelectedExploreTopic(topicId);
                setActiveTab('explore');
              }}
              onNavigateConquerSubTab={(subTab) => {
                setSelectedConquerSubTab(subTab);
                setActiveTab('conquer');
              }}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}
          {activeTab === 'explore' && <ExplorePanel initialTopicId={selectedExploreTopic} />}
          {activeTab === 'fun' && <FunExperiencePanel />}
          {activeTab === 'conquer' && <ConquerHubPanel initialSubTab={selectedConquerSubTab} />}
          {activeTab === 'admin' && <AdminPanel />}
        </div>
      </main>

      {/* Nút bấm Kính Lúp Tìm kiếm nội dung trong app nổi ở góc phải màn hình */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-emerald-500/40 border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
        title="Kính lúp Tìm kiếm nội dung trong app (Ctrl+K) - Bấm để tìm bài học, công cụ, trò chơi!"
      >
        <SearchIcon size={24} className="stroke-[2.5] text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
        <div className="absolute right-full mr-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          🔍 Tìm kiếm nội dung trong app (Ctrl+K)
        </div>
      </button>

      {/* Hộp thoại Tìm kiếm nội dung MathFlow */}
      <AppSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={handleSearchNavigate} 
      />

      {/* Chân trang nền trắng với dòng chữ động nổi bật "Học chủ động - Vững tư duy" */}
      <footer className="w-full bg-white border-t border-emerald-100/80 py-5 sm:py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs select-none max-w-[1600px] mx-auto">
        <style>{`
          @keyframes mottoShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .anim-motto-shimmer {
            background: linear-gradient(90deg, #047857 0%, #10b981 25%, #d97706 50%, #10b981 75%, #047857 100%);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: mottoShimmer 5s linear infinite;
          }
        `}</style>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <SearchIcon size={14} className="text-amber-500" />
            <span>Tìm kiếm nội dung trong app (Ctrl+K)</span>
          </button>
        </div>

        <div className="relative inline-flex items-center gap-2.5 sm:gap-3.5">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 animate-spin" style={{ animationDuration: '7s' }} />
          <span className="text-base sm:text-lg font-black uppercase tracking-widest anim-motto-shimmer drop-shadow-xs">
            Học chủ động - Vững tư duy
          </span>
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }} />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            onClick={() => setActiveTab('admin')}
            className="hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
            title="Dành cho Quản trị viên"
          >
            <ShieldCheckIcon size={14} className="text-emerald-600" />
            <span>Quản trị (thule020895@gmail.com)</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
