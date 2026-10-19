import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Search, 
  Trash2, 
  UserCheck, 
  Lock, 
  LogIn, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Award,
  GraduationCap,
  Briefcase,
  UserPlus,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Mail,
  ChevronRight,
  Shield
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  getDocs,
  writeBatch,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useFirebase, AppUserProfile, UserRole } from './FirebaseProvider';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error(`Firestore Error (${operationType}) on ${path}:`, error);
}

interface AttendanceEntry {
  name: string;
  count: number;
  lastPlayed: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  round: number;
  date: string;
}

type AdminViewTab = 'users' | 'attendance' | 'leaderboard';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminViewTab>('users');
  const [usersList, setUsersList] = useState<AppUserProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { user, userProfile, isAdmin } = useFirebase();

  const isMasterAdmin = user?.email === 'thule020895@gmail.com' || isAdmin;

  // Real-time listener for users collection
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        uid: doc.id,
        displayName: doc.data().displayName || 'Người dùng',
        email: doc.data().email || '',
        role: doc.data().role || 'student',
        photoURL: doc.data().photoURL || '',
        createdAt: doc.data().createdAt || '',
        lastLogin: doc.data().lastLogin || ''
      })) as AppUserProfile[];
      setUsersList(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Attendance
    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      const attendanceList = snapshot.docs.map(doc => ({
        name: doc.data().name,
        count: doc.data().count,
        lastPlayed: doc.data().lastPlayed ? new Date(doc.data().lastPlayed).toLocaleString('vi-VN') : 'Gần đây'
      }));
      setAttendance(attendanceList.sort((a, b) => b.count - a.count));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'attendance');
    });

    // Scores
    const qScores = query(collection(db, 'scores'), orderBy('score', 'desc'));
    const unsubScores = onSnapshot(qScores, (snapshot) => {
      const combined = snapshot.docs.map(doc => ({
        name: doc.data().name,
        score: doc.data().score,
        round: doc.data().round,
        date: doc.data().date
      }));
      setAllScores(combined);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scores');
    });

    return () => {
      unsubUsers();
      unsubAttendance();
      unsubScores();
    };
  }, [user]);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Switch a user's role
  const handleUpdateRole = async (targetUid: string, targetEmail: string, newRole: UserRole) => {
    if (!isMasterAdmin) return;
    if (targetEmail === 'thule020895@gmail.com' && newRole !== 'admin') {
      alert('Không thể hạ quyền của tài khoản Quản trị viên tối cao thule020895@gmail.com.');
      return;
    }

    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, { role: newRole });
      showNotification(`Đã cập nhật vai trò thành công!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
      alert('Có lỗi xảy ra khi cập nhật vai trò người dùng.');
    }
  };

  // Delete user account
  const handleDeleteUser = async (targetUid: string, targetEmail: string) => {
    if (!isMasterAdmin) return;
    if (targetEmail === 'thule020895@gmail.com') {
      alert('Không thể xóa tài khoản Quản trị viên tối cao thule020895@gmail.com.');
      return;
    }

    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa tài khoản "${targetEmail}" khỏi hệ thống?`)) {
      try {
        await deleteDoc(doc(db, 'users', targetUid));
        showNotification('Đã xóa tài khoản thành công!');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${targetUid}`);
        alert('Có lỗi xảy ra khi xóa tài khoản.');
      }
    }
  };

  // Seed sample student & teacher accounts if database is empty
  const handleSeedDemoData = async () => {
    if (!isMasterAdmin || isSeeding) return;
    setIsSeeding(true);

    try {
      const batch = writeBatch(db);
      const demoUsers: Partial<AppUserProfile>[] = [
        {
          uid: 'student_ha_anh',
          displayName: 'Nguyễn Hà Anh',
          email: 'haanh.toan5@gmail.com',
          role: 'student',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          uid: 'student_minh_khoi',
          displayName: 'Trần Minh Khôi',
          email: 'minhkhoi.lop5a@gmail.com',
          role: 'student',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          lastLogin: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          uid: 'student_bao_chau',
          displayName: 'Lê Bảo Châu',
          email: 'baochau.quychau@gmail.com',
          role: 'student',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          uid: 'teacher_mai_huong',
          displayName: 'Cô giáo Nguyễn Mai Hương',
          email: 'maihuong.c1hoinga@gmail.com',
          role: 'teacher',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          uid: 'teacher_van_duc',
          displayName: 'Thầy giáo Phan Văn Đức',
          email: 'ducphan.toan5@gmail.com',
          role: 'teacher',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          lastLogin: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ];

      for (const u of demoUsers) {
        const ref = doc(db, 'users', u.uid!);
        batch.set(ref, u, { merge: true });
      }

      await batch.commit();
      showNotification('Đã tạo 5 tài khoản học sinh & giáo viên mẫu để kiểm thử!');
    } catch (err) {
      console.error('Seed error:', err);
      alert('Không thể tạo tài khoản mẫu.');
    } finally {
      setIsSeeding(false);
    }
  };

  const resetGameData = async () => {
    if (!isMasterAdmin) return;
    
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử thi đấu Rung Chuông Vàng và điểm danh chuyên cần? (Dữ liệu tài khoản người dùng sẽ được giữ nguyên).')) {
      try {
        const batch = writeBatch(db);
        const attendanceSnap = await getDocs(collection(db, 'attendance'));
        attendanceSnap.forEach((d) => batch.delete(d.ref));
        
        const scoresSnap = await getDocs(collection(db, 'scores'));
        scoresSnap.forEach((d) => batch.delete(d.ref));
        
        await batch.commit();
        showNotification('Đã xóa dữ liệu thi đấu thành công!');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'reset-scores');
        alert('Lỗi khi xóa dữ liệu thi đấu.');
      }
    }
  };

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(err => {
      console.error("Login error:", err);
    });
  };

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const studentCount = usersList.filter(u => u.role === 'student').length;
  const teacherCount = usersList.filter(u => u.role === 'teacher').length;
  const adminCount = usersList.filter(u => u.role === 'admin' || u.email === 'thule020895@gmail.com').length;
  const totalUsers = usersList.length;

  // Filtered attendance & scores
  const filteredAttendance = attendance.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredScores = allScores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Authentication gate for non-admins
  if (!user || user.isAnonymous || !isMasterAdmin) {
    return (
      <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-2 border-emerald-500 max-w-md w-full space-y-5">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-xs border border-emerald-300">
            <ShieldCheck size={36} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Khu Vực Quản Trị Hệ Thống
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              Dành Cho Tài Khoản Quản Trị
            </h2>
            <p className="text-slate-600 mt-1 text-xs sm:text-sm font-medium leading-relaxed">
              Khu vực dành riêng cho Quản trị viên <strong className="text-emerald-800 font-bold">thule020895@gmail.com</strong> (Cô giáo Lê Thị Thu) để quản lý danh sách học sinh và giáo viên tham gia ứng dụng.
            </p>
          </div>

          {user && !user.isAnonymous && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              Bạn đang đăng nhập với tài khoản: <br />
              <strong className="font-bold">{user.email}</strong> (Không có quyền quản trị tối cao).
            </div>
          )}

          <button 
            onClick={login}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-sm font-black shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <LogIn size={18} /> 
            <span>ĐĂNG NHẬP VỚI GOOGLE</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      
      {/* ================= HEADER QUẢN TRỊ ================= */}
      <div className="bg-white p-5 md:p-6 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    TRUNG TÂM QUẢN TRỊ HỆ THỐNG
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    thule020895@gmail.com
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Nắm bắt số lượng tài khoản học sinh, giáo viên tham gia và phân tích dữ liệu học tập
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSeedDemoData}
              disabled={isSeeding}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Tạo thêm tài khoản học sinh & giáo viên mẫu để kiểm thử"
            >
              <UserPlus size={15} />
              <span>{isSeeding ? 'Đang tạo...' : '+ Tạo tài khoản mẫu'}</span>
            </button>
            <button
              onClick={resetGameData}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Xóa dữ liệu thi đấu Rung Chuông Vàng để mở đợt mới"
            >
              <Trash2 size={15} />
              <span>Reset điểm thi</span>
            </button>
          </div>
        </div>

        {/* ================= 4 CHỈ SỐ THỐNG KÊ TỔNG QUAN ================= */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng tài khoản</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">{totalUsers}</div>
              <span className="text-[10px] text-emerald-400 font-medium">Đã tham gia MathFlow</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-sm border border-emerald-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Học sinh</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">{studentCount}</div>
              <span className="text-[10px] text-emerald-100 font-medium">Tài khoản học tập</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <GraduationCap size={24} />
            </div>
          </div>

          <div className="bg-violet-700 text-white rounded-2xl p-4 shadow-sm border border-violet-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-violet-200 uppercase tracking-wider">Giáo viên</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">{teacherCount}</div>
              <span className="text-[10px] text-violet-200 font-medium">Tài khoản giảng dạy</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Briefcase size={24} />
            </div>
          </div>

          <div className="bg-amber-500 text-slate-950 rounded-2xl p-4 shadow-sm border border-amber-600 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">Lượt thi đấu</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 mt-0.5">{attendance.reduce((sum, a) => sum + a.count, 0)}</div>
              <span className="text-[10px] text-amber-900 font-bold">Rung Chuông Vàng</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center text-slate-950">
              <Trophy size={24} />
            </div>
          </div>

        </div>

        {/* Toast thông báo hành động */}
        {actionSuccess && (
          <div className="max-w-7xl mx-auto mt-3 p-2.5 px-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* ================= TAB NAVIGATION & SEARCH ================= */}
      <div className="bg-white border-b border-slate-200 px-5 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* 3 Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              <span>Quản lý Tài Khoản ({usersList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={15} />
              <span>Chuyên Cần ({attendance.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy size={15} />
              <span>Bảng Vàng ({allScores.length})</span>
            </button>
          </div>

          {/* Search bar & Role Filter */}
          <div className="flex items-center gap-2">
            {activeTab === 'users' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="student">🎓 Học sinh ({studentCount})</option>
                <option value="teacher">👨‍🏫 Giáo viên ({teacherCount})</option>
                <option value="admin">👑 Quản trị ({adminCount})</option>
              </select>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder={activeTab === 'users' ? "Tìm theo tên hoặc email..." : "Tìm học sinh..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl outline-none font-bold text-xs text-slate-800 transition-all"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================= NỘI DUNG CHÍNH CỦA CÁC TAB ================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          {/* TAB 1: QUẢN LÝ TÀI KHOẢN HỌC SINH & GIÁO VIÊN */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-emerald-400" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Danh Sách Tài Khoản Đã Đăng Ký ({filteredUsers.length} / {totalUsers})
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-300 font-bold">
                  Dữ liệu tự động cập nhật thời gian thực
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-4">Tài khoản & Họ tên</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Vai trò</th>
                      <th className="py-3 px-4">Ngày đăng ký</th>
                      <th className="py-3 px-4">Hoạt động gần nhất</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => {
                        const isPrimaryAdmin = u.email === 'thule020895@gmail.com';
                        return (
                          <tr key={u.uid} className="hover:bg-emerald-50/40 transition-colors">
                            {/* Avatar & Display Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {u.photoURL ? (
                                  <img 
                                    src={u.photoURL} 
                                    alt={u.displayName} 
                                    className="w-9 h-9 rounded-full object-cover border border-emerald-300 shrink-0" 
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                                    {u.displayName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                                    <span>{u.displayName}</span>
                                    {isPrimaryAdmin && (
                                      <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-extrabold">
                                        Tác giả
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">UID: {u.uid.slice(0, 10)}...</span>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-700 font-medium">
                              {u.email || <span className="italic text-slate-400">Ẩn danh</span>}
                            </td>

                            {/* Role Badge */}
                            <td className="py-3.5 px-4 text-center">
                              {u.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black">
                                  <Shield size={12} />
                                  <span>Quản trị viên</span>
                                </span>
                              ) : u.role === 'teacher' ? (
                                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-800 border border-violet-200 px-2.5 py-1 rounded-full text-xs font-black">
                                  <Briefcase size={12} />
                                  <span>Giáo viên</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-black">
                                  <GraduationCap size={12} />
                                  <span>Học sinh</span>
                                </span>
                              )}
                            </td>

                            {/* Ngày tham gia */}
                            <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                            </td>

                            {/* Lần đăng nhập cuối */}
                            <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN') : '—'}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isPrimaryAdmin && (
                                  <>
                                    {u.role === 'student' ? (
                                      <button
                                        onClick={() => handleUpdateRole(u.uid, u.email, 'teacher')}
                                        className="px-2.5 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                        title="Chuyển thành Giáo viên"
                                      >
                                        + Giáo viên
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUpdateRole(u.uid, u.email, 'student')}
                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                        title="Chuyển thành Học sinh"
                                      >
                                        + Học sinh
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteUser(u.uid, u.email)}
                                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Xóa tài khoản này"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-14 text-center text-slate-400 text-xs italic">
                          Chưa tìm thấy tài khoản nào phù hợp với bộ lọc tìm kiếm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CHUYÊN CẦN */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-sky-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Theo dõi chuyên cần làm bài ({filteredAttendance.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">Thời gian thực</span>
              </div>
              
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-2.5 pl-3">Học sinh</th>
                      <th className="pb-2.5 text-center">Số lượt làm bài</th>
                      <th className="pb-2.5 text-right pr-3">Lần gần nhất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendance.length > 0 ? filteredAttendance.map((a, i) => (
                      <tr key={i} className="hover:bg-sky-50/50 transition-colors">
                        <td className="py-3 pl-3 font-bold text-slate-800 text-xs sm:text-sm">{a.name}</td>
                        <td className="py-3 text-center">
                          <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-black text-xs font-mono">
                            {a.count} lượt
                          </span>
                        </td>
                        <td className="py-3 text-right pr-3 text-xs font-semibold text-slate-400 font-mono">{a.lastPlayed}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-slate-400 text-xs italic">
                          Chưa có lượt học nào được ghi nhận
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BẢNG VÀNG THÀNH TÍCH */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-amber-500 p-4 text-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={18} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Bảng Vàng Thành Tích Rung Chuông Vàng ({filteredScores.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-slate-950/10 px-2.5 py-0.5 rounded-full">Top điểm cao</span>
              </div>
              
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-2.5 pl-3">Hạng</th>
                      <th className="pb-2.5">Học sinh</th>
                      <th className="pb-2.5 text-center">Mã đề thi</th>
                      <th className="pb-2.5 text-right pr-3">Điểm số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredScores.length > 0 ? filteredScores.map((s, i) => (
                      <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 pl-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                            i === 0 ? 'bg-amber-400 text-slate-900 shadow-xs' : 
                            i === 1 ? 'bg-slate-300 text-slate-800' : 
                            i === 2 ? 'bg-amber-600 text-white' : 
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="py-3 font-bold text-slate-800 text-xs sm:text-sm">{s.name}</td>
                        <td className="py-3 text-center">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-extrabold text-xs">
                            ĐỀ {s.round}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-3 font-mono font-black text-sm text-amber-600">{s.score} đ</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-xs italic">
                          Chưa có dữ liệu xếp hạng điểm số
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
