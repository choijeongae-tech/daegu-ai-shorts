import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MOODS,
  getTemplate,
  isMoodId,
  buildFallbackResult,
} from './src/data/templates.ts';
import type { ShortsResult } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MODEL = 'gemini-3.8-flash';

app.use(express.json({ limit: '20kb' }));

/* ------------------------------------------------------------------
 * 1. 사용량 관리
 *  - 방문객(세션)당 5회. 같은 와이파이·같은 기종이어도 서로 막지 않습니다.
 *    (이전 버전의 'IP+브라우저' 기기 묶음 제한은 부스 와이파이에서 다른 방문객까지 막아서 제거)
 *  - 서버 전체 상한(분당·시간당)으로 API 비용을 보호합니다.
 *  - 한도에 걸려도 오류로 멈추지 않고 준비된 문구로 체험을 이어갑니다.
 * ------------------------------------------------------------------ */
const MAX_PER_SESSION = 5;
const COOLDOWN_MS = 2000;
const AI_TIMEOUT_MS = 12000;
const GLOBAL_MAX_PER_MINUTE = 40;
const GLOBAL_MAX_PER_HOUR = 400;

interface SessionRecord {
  count: number;
  inFlight: boolean;
  lastRequestTime: number;
}
const sessions = new Map<string, SessionRecord>();

let minuteCount = 0;
let minuteReset = Date.now() + 60_000;
let hourCount = 0;
let hourReset = Date.now() + 3_600_000;

setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of sessions.entries()) {
    if (!rec.inFlight && now - rec.lastRequestTime > 6 * 3_600_000) sessions.delete(key);
  }
}, 10 * 60_000);

function globalBudgetAvailable(): boolean {
  const now = Date.now();
  if (now > minuteReset) {
    minuteCount = 0;
    minuteReset = now + 60_000;
  }
  if (now > hourReset) {
    hourCount = 0;
    hourReset = now + 3_600_000;
  }
  return minuteCount < GLOBAL_MAX_PER_MINUTE && hourCount < GLOBAL_MAX_PER_HOUR;
}

/* ------------------------------------------------------------------
 * 2. 지어낸 행사 정보(날짜·경품·가격) 거르기 — 자막과 장면 설명에만 적용
 * ------------------------------------------------------------------ */
const FORBIDDEN_PATTERNS = [
  /\d{1,2}월\s*\d{1,2}일/,
  /\d{1,2}시\s*\d{1,2}분/,
  /(무료|공짜)\s*(입장|티켓|음료|커피|쿠폰|선물)/,
  /(선착순|추첨)\s*\d+명/,
  /(상금|상품권|경품|\d+만\s*원|\d+%\s*할인|전원\s*증정)/,
];

function hasForbidden(text: string): boolean {
  return FORBIDDEN_PATTERNS.some((p) => p.test(text));
}

function cleanCaption(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback;
  let text = raw.trim().replace(/[\r\n\t]+/g, ' ').replace(/^["'“”]+|["'“”]+$/g, '');
  if (Array.from(text).length < 6 || hasForbidden(text)) return fallback;
  if (Array.from(text).length > 30) {
    text = Array.from(text).slice(0, 29).join('').trimEnd();
  }
  return text;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/* ------------------------------------------------------------------
 * 3. POST /api/generate — 자막 3줄 (+ 미리 만든 영상의 Flow 프롬프트)
 * ------------------------------------------------------------------ */
app.post('/api/generate', async (req, res) => {
  const { sessionId, templateId, subjectId, moodId, keyword } = req.body || {};

  const template = getTemplate(templateId);
  const subject = template?.subjects.find((s) => s.id === subjectId);
  if (!template || !subject || !isMoodId(moodId) || typeof sessionId !== 'string' || !sessionId) {
    return res.status(400).json({ success: false, error: '템플릿과 주인공을 먼저 골라 주세요.' });
  }

  const userKeyword = typeof keyword === 'string' ? keyword.trim().slice(0, 30) : '';
  const fallback = buildFallbackResult(template, subject.id, userKeyword);
  const sid = sessionId.slice(0, 64);

  let rec = sessions.get(sid);
  if (!rec) {
    rec = { count: 0, inFlight: false, lastRequestTime: 0 };
    sessions.set(sid, rec);
  }
  const now = Date.now();
  if (rec.inFlight && now - rec.lastRequestTime > AI_TIMEOUT_MS + 3000) rec.inFlight = false;

  if (rec.inFlight || now - rec.lastRequestTime < COOLDOWN_MS) {
    return res.status(429).json({ success: false, error: '지금 만드는 중이에요. 잠시만 기다려 주세요.' });
  }

  // 횟수를 다 썼거나 서버 전체 상한에 걸리면 → 준비된 문구로 계속
  if (rec.count >= MAX_PER_SESSION) {
    return res.json({
      success: true,
      data: fallback,
      remaining: 0,
      notice: `AI 생성 ${MAX_PER_SESSION}회를 모두 썼어요. 준비된 문구로 이어서 만들어요.`,
    });
  }
  if (!globalBudgetAvailable()) {
    console.warn(`[GLOBAL_CAP] min ${minuteCount}/${GLOBAL_MAX_PER_MINUTE}, hour ${hourCount}/${GLOBAL_MAX_PER_HOUR}`);
    return res.json({
      success: true,
      data: fallback,
      remaining: MAX_PER_SESSION - rec.count,
      notice: '지금 부스가 붐벼서 준비된 문구로 보여드려요.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('[API_KEY] GEMINI_API_KEY가 없어 준비된 문구를 보냅니다.');
    return res.json({ success: true, data: fallback, remaining: MAX_PER_SESSION - rec.count });
  }

  // 시작 시점에 횟수 예약, 실패하면 돌려줌
  rec.inFlight = true;
  rec.count += 1;
  rec.lastRequestTime = now;
  minuteCount += 1;
  hourCount += 1;
  let refund = false;

  const mood = MOODS.find((m) => m.id === moodId)!;
  const who =
    template.subjectRole === 'theme'
      ? `주인공은 '크리에이터 준호'(20대 한국인 남성)이고, 방송 주제는 '${subject.label}'입니다.`
      : `주인공은 '${subject.label}'입니다.`;

  const prompt = `
당신은 '2026 대구 콘텐츠페어' 대구1인미디어센터 부스의 쇼츠 작가입니다.
관람객이 캔바 템플릿으로 완성할 12초 쇼츠의 자막을 써 주세요. (영상은 부스에서 미리 만들어 둔 구글 Flow 영상을 씁니다)

[템플릿] ${template.title} — ${template.briefKo}
[주인공] ${who}
[영상 장면] ${template.fallback.sceneKo}
[분위기] ${mood.label} (${mood.tonePrompt})
[관람객 키워드] ${userKeyword || '없음'}

[작성 규칙]
1. captions: 자막 3줄. 1줄=도입(시선 끌기), 2줄=핵심, 3줄=마무리. 각 줄 공백 포함 15~25자, 자연스러운 한국어 구어체.
   관람객 키워드가 있으면 자막에 자연스럽게 녹여 주세요. 같은 조건이라도 매번 새로운 표현으로 써 주세요.
2. hashtags: 영상에 어울리는 한국어 해시태그 2개 (# 포함).
3. 날짜, 시간, 무료 혜택, 경품, 할인, 초청 게스트 같은 확인되지 않은 행사 정보는 절대 지어내지 마세요.
`.trim();

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          temperature: 1.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              captions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '자막 3줄' },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '해시태그 2개' },
            },
            required: ['captions', 'hashtags'],
          },
        },
      }),
      AI_TIMEOUT_MS,
    );

    const text = response.text;
    if (!text) throw new Error('MODEL_EMPTY_RESPONSE');
    const parsed = JSON.parse(text);

    const fc = template.fallback.captions;
    const caps: unknown[] = Array.isArray(parsed.captions) ? parsed.captions : [];
    const captions: [string, string, string] = [
      cleanCaption(caps[0], fc[0]),
      cleanCaption(caps[1], fc[1]),
      cleanCaption(caps[2], fc[2]),
    ];

    const aiTags: string[] = Array.isArray(parsed.hashtags)
      ? parsed.hashtags
          .filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 1)
          .map((t: string) => `#${t.trim().replace(/^#+/, '').replace(/\s+/g, '')}`)
          .slice(0, 2)
      : [];

    // 영상과 프롬프트는 미리 만든 것을 그대로 보여 줍니다 (부스에서 실제로 쓴 프롬프트)
    const result: ShortsResult = {
      captions,
      sceneKo: fallback.sceneKo,
      flowPrompt: fallback.flowPrompt,
      canvaUrl: fallback.canvaUrl,
      hashtags: aiTags.length ? aiTags : template.hashtags,
      mode: 'ai',
    };

    console.log(`[SUCCESS] ${template.id}/${subject.id}/${moodId}`);
    return res.json({ success: true, data: result, remaining: MAX_PER_SESSION - rec.count });
  } catch (error: any) {
    refund = true; // AI 실패는 횟수에서 빼지 않음
    const msg = error?.message || String(error);
    console.error(`[AI_ERROR] ${msg}`);
    return res.json({
      success: true,
      data: fallback,
      remaining: MAX_PER_SESSION - (rec.count - 1),
      notice: 'AI 연결이 늦어 준비된 문구로 보여드려요. (횟수는 차감되지 않았어요)',
    });
  } finally {
    rec.inFlight = false;
    rec.lastRequestTime = Date.now();
    if (refund) rec.count = Math.max(0, rec.count - 1);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: MODEL, sessions: sessions.size, timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Daegu Shorts Studio] http://0.0.0.0:${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
