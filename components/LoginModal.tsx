import React, { useState, useEffect } from 'react';
import { X, GraduationCap, BookOpenCheck, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export type LoginRoleOption = 'teacher' | 'student';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginWithGoogle: (role: LoginRoleOption) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginWithGoogle }) => {
  const [selectedRole, setSelectedRole] = useState<LoginRoleOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      setErrorMsg('Vui lòng chọn đối tượng 1. Giáo Viên hoặc 2. Học sinh trước khi đăng nhập.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onLoginWithGoogle(selectedRole);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('Bạn đã đóng cửa sổ đăng nhập Google. Vui lòng thử lại.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg('Trình duyệt đang chặn cửa sổ bật lên. Vui lòng cho phép pop-up để đăng nhập.');
      } else {
        setErrorMsg('Không thể hoàn tất đăng nhập Google. Vui lòng thử lại.');
      }
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full border-2 border-emerald-500 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
              MathFlow · Toán Lớp 5
            </p>
            <h2 id="login-modal-title" className="text-lg font-black tracking-tight">
              Đăng Nhập Tài Khoản
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Đóng hộp thoại đăng nhập"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm font-black text-slate-800 mb-1">
              Chọn đối tượng tham gia:
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Hãy chọn đúng vai trò của bạn trước khi tiếp tục đăng nhập với Google.
            </p>
          </div>

          {/* 2 lựa chọn đối tượng */}
          <div className="space-y-3" role="radiogroup" aria-label="Chọn đối tượng">
            {/* 1. Giáo Viên */}
            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'teacher'}
              onClick={() => {
                setSelectedRole('teacher');
                setErrorMsg(null);
              }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                  selectedRole === 'teacher'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-xs'
                    : 'bg-amber-100/80 text-amber-700 border-amber-200'
                }`}
              >
                <BookOpenCheck size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-600 text-white text-[11px] font-black">
                    1
                  </span>
                  <span className="font-black text-base text-slate-900">
                    Giáo Viên
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                  Giảng dạy, trình chiếu mô phỏng & đồng hành cùng lớp học
                </p>
              </div>
              <div className="shrink-0">
                {selectedRole === 'teacher' ? (
                  <CheckCircle2 size={22} className="text-amber-600 fill-amber-100" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
            </button>

            {/* 2. Học sinh */}
            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'student'}
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg(null);
              }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                selectedRole === 'student'
                  ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/30'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                  selectedRole === 'student'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : 'bg-emerald-100/80 text-emerald-700 border-emerald-200'
                }`}
              >
                <GraduationCap size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-600 text-white text-[11px] font-black">
                    2
                  </span>
                  <span className="font-black text-base text-slate-900">
                    Học sinh
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                  Học tập, luyện tập thử thách & thi Rung Chuông Vàng
                </p>
              </div>
              <div className="shrink-0">
                {selectedRole === 'student' ? (
                  <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
            </button>
          </div>

          {/* Thông báo lỗi nếu chưa chọn hoặc lỗi đăng nhập */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nút đăng nhập Google */}
          <div className="pt-1 space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                selectedRole === 'teacher'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                  : selectedRole === 'student'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-800/15'
              }`}
            >
              {/* Google G Icon */}
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </span>
              <span>
                {isSubmitting
                  ? 'Đang mở đăng nhập Google...'
                  : selectedRole === 'teacher'
                    ? 'Đăng nhập Google · Giáo Viên'
                    : selectedRole === 'student'
                      ? 'Đăng nhập Google · Học sinh'
                      : 'Tiếp tục với Google'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Shield size={12} className="text-emerald-600" />
              <span>Đăng nhập an toàn bằng tài khoản Google của bạn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
