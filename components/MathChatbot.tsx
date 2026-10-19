import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface MathChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PROMPTS = [
  "🔍 Giải thích công thức tính diện tích hình thang",
  "🚗 Cách giải bài toán chuyển động ngược chiều",
  "⚖️ Dạng toán tìm hai số khi biết Tổng và Tỉ số",
  "🗺️ Cách tính khoảng cách thực tế từ tỉ lệ bản đồ 1 : 1 000 000",
  "🔢 Tính tổng dãy số cách đều: 1, 4, 7, 10, ... 100",
  "📐 Diện tích xung quanh và toàn phần hình lập phương"
];

export const MathChatbot: React.FC<MathChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Chào em! Thầy/Cô là **Trợ lý Toán học AI** đồng hành cùng cô giáo Lê Thị Thu tại **MathFlow** (được kết nối với **Google Gemini AI**). 🌟\n\nEm đang gặp khó khăn ở bài toán nào hay muốn tìm hiểu công thức gì trong chương trình Toán lớp 5? Hãy nhập đề bài hoặc bấm chọn câu hỏi gợi ý bên dưới để Thầy/Cô hướng dẫn em từng bước nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    } else {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history for context
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history
        })
      });

      const data = await res.json();
      
      let replyText = data.reply;
      if (!res.ok) {
        replyText = data.error || 'Có lỗi xảy ra khi kết nối với máy chủ AI. Em vui lòng thử lại sau giây lát!';
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Hiện tại đường truyền mạng đang bận hoặc chưa nhận được phản hồi từ Google Gemini. Em kiểm tra lại kết nối mạng hoặc thử lại nhé! 🍀`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text from markdown stars or backticks for reading
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Cuộc trò chuyện đã được làm mới! Thầy/Cô sẵn sàng giải đáp bài toán tiếp theo cho em. 🚀`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-emerald-500 flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isExpanded 
            ? 'h-full sm:h-[94vh] max-w-4xl' 
            : 'h-[90vh] sm:h-[700px] max-w-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER CHATBOT ================= */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 px-5 flex items-center justify-between shadow-md shrink-0 border-b border-emerald-600/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-300 animate-pulse">
              <Search size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
                  <span>Kính Lúp Trợ Lý Toán AI</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Gemini AI
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-300" />
                <span>Hỏi đáp & hướng dẫn giải bài tập Toán 5 trực tiếp</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-2 text-emerald-100 hover:text-white hover:bg-emerald-600/60 rounded-xl transition-all"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:inline-flex p-2 text-emerald-100 hover:text-white hover:bg-emerald-600/60 rounded-xl transition-all"
              title={isExpanded ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn cảnh'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-emerald-100 hover:text-white hover:bg-rose-500/80 rounded-xl transition-all"
              title="Đóng hộp thoại"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= GỢI Ý CÂU HỎI NHANH ================= */}
        <div className="bg-emerald-50/80 border-b border-emerald-100 p-2.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-black text-emerald-900 whitespace-nowrap flex items-center gap-1">
            <Lightbulb size={13} className="text-amber-500" />
            Gợi ý:
          </span>
          <div className="flex items-center gap-1.5">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.replace(/^🔍 |^🚗 |^⚖️ |^🗺️ |^🔢 |^📐 /, ''))}
                disabled={isLoading}
                className="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100/80 border border-emerald-200/90 hover:border-emerald-400 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ================= NỘI DUNG TIN NHẮN (MESSAGE FEED) ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60 custom-scrollbar">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Search size={16} className="stroke-[2.5]" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isAI 
                    ? 'bg-white border border-emerald-200/90 text-slate-800 rounded-tl-sm' 
                    : 'bg-emerald-600 text-white rounded-tr-sm shadow-md shadow-emerald-700/20'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  <div className={`mt-2.5 pt-2 flex items-center justify-between text-[10px] ${
                    isAI ? 'border-t border-slate-100 text-slate-400' : 'border-t border-emerald-500/60 text-emerald-100'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`p-1 rounded-md transition-colors ${
                            speakingId === msg.id 
                              ? 'text-emerald-700 bg-emerald-100 font-bold' 
                              : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                          }`}
                          title={speakingId === msg.id ? 'Dừng đọc' : 'Nghe AI đọc câu trả lời'}
                        >
                          {speakingId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Sao chép câu trả lời"
                        >
                          {copiedId === msg.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
                <Search size={16} />
              </div>
              <div className="bg-white border border-emerald-200 rounded-2xl p-3.5 px-4 text-xs text-slate-600 rounded-tl-sm shadow-xs flex items-center gap-2.5">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <span className="font-semibold text-emerald-800">Trợ lý AI đang tư duy và phân tích lời giải cho em...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ================= KHU VỰC NHẬP CÂU HỎI (INPUT FOOTER) ================= */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 border-2 border-emerald-200 focus-within:border-emerald-600 focus-within:bg-white rounded-2xl p-1.5 transition-all shadow-inner">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi hoặc bài toán lớp 5 cần giải đáp... (Enter để gửi, Shift+Enter xuống dòng)"
              rows={2}
              className="flex-1 bg-transparent border-0 outline-hidden resize-none p-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all shrink-0 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Gửi câu hỏi"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Bot size={13} className="text-emerald-600" />
              <span>Gia sư AI Toán 5 · Tích hợp mô hình Google Gemini</span>
            </span>
            <span className="hidden sm:inline italic">Nhấn Enter để gửi</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MathChatbot;
