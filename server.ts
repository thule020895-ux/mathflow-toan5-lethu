import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Chatbot API endpoint for Grade 5 Math
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra Settings > Secrets.' 
      });
    }

    const systemInstruction = `Bạn là Trợ lý Toán học AI (MathFlow AI Tutor) dành riêng cho học sinh Tiểu học lớp 5 và giáo viên tại Việt Nam, đồng hành cùng Cô giáo Lê Thị Thu.
Nhiệm vụ của bạn:
1. Giải đáp các thắc mắc về môn Toán lớp 5:
   - Hình học & Đo lường (Hình tam giác, hình thang, hình tròn, hình hộp chữ nhật, hình lập phương, diện tích xung quanh, toàn phần, thể tích).
   - Tỉ lệ bản đồ và ứng dụng thực tế (khoảng cách trên bản đồ, tỉ lệ xích, khoảng cách thực địa).
   - Toán chuyển động đều (Vận tốc, quãng đường, thời gian; 2 xe chuyển động cùng chiều, ngược chiều, dòng nước).
   - Các dạng toán tỉ số: Tìm hai số khi biết Tổng - Tỉ, Hiệu - Tỉ, Tỉ số phần trăm, Toán về tỉ lệ thuận/nghịch.
   - Dãy số có quy luật, phân số, số thập phân và 4 phép tính.
2. Phương pháp sư phạm:
   - Luôn sử dụng ngôn từ gần gũi, ấm áp, khích lệ ("Em làm rất tốt!", "Chúng mình cùng giải bài này từng bước nhé!").
   - Hướng dẫn tư duy từng bước rõ ràng, dễ hiểu theo phương pháp Tiểu học (vẽ sơ đồ đoạn thẳng, quy về đơn vị...). KHÔNG dùng đại số cao cấp (phương trình phức tạp ẩn x) trừ khi được yêu cầu.
   - Sử dụng định dạng rõ ràng, gạch đầu dòng, công thức nổi bật để học sinh dễ nhìn.
3. Độ an toàn & Tập trung:
   - Chỉ giải đáp và hỗ trợ về học tập, toán học, tư duy logic và kiến thức khoa học lành mạnh cho học sinh.`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text || '') }]
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'Xin lỗi, hiện tại trợ lý chưa nhận được câu trả lời. Em vui lòng thử lại nhé!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: error?.message || 'Có lỗi xảy ra khi kết nối với Gemini AI.' 
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
