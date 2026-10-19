import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini SDK with server-side API key
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Gemini Chat Endpoint
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, mode, systemPrompt } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      if (!ai) {
        // Fallback if API key is not configured in environment
        res.json({
          reply: `[EduGuide Local Knowledge Advisor] Currently operating in offline rule-based mode. Note: To enable live Gemini neural queries, configure GEMINI_API_KEY. However, all EduGuide AI inference engine calculations, forward-chaining rules, study plan generation, and subject prioritization run 100% deterministically in your browser without any external API!`,
          isFallback: true,
        });
        return;
      }

      // Choose model and thinking config based on mode
      let model = 'gemini-3.8-flash';
      let thinkingConfig = undefined;

      if (mode === 'fast') {
        model = 'gemini-3.1-flash-lite';
      } else if (mode === 'thinking') {
        // High reasoning mode for complex academic strategies & viva questions (gemini-4-argon with ThinkingLevel.HIGH)
        model = 'gemini-4-argon';
        thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      // Format previous history into Gemini contents format
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && (item.sender === 'user' || item.sender === 'model' || item.role === 'user' || item.role === 'model')) {
            const role = item.sender === 'user' || item.role === 'user' ? 'user' : 'model';
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Append current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const defaultSystemInstruction = `You are the EduGuide AI Academic Mentor & Viva Coach for Computer Engineering students.
You specialize in rule-based expert systems, study scheduling, forward-chaining reasoning, subject prioritization, and engineering exam preparation.
Provide structured, encouraging, highly technical, and academically rigorous guidance.
Help students understand both their personalized study schedule and the underlying AI concepts (Inference Engine, Knowledge Base, Working Memory, Conflict Resolution).`;

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt || defaultSystemInstruction,
          ...(thinkingConfig ? { thinkingConfig } : {}),
        },
      });

      const reply = response.text || 'No response generated.';
      res.json({ reply, model });
    } catch (err: unknown) {
      console.error('Gemini chat error:', err);
      const errMsg = err instanceof Error ? err.message : 'Internal Gemini API error';
      res.status(500).json({ error: errMsg });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'EduGuide AI' });
  });

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
    console.log(`EduGuide AI server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
