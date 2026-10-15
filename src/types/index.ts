export type AppStep = 'home' | 'quiz' | 'make' | 'result' | 'finish';

export type TemplateId = 'pet-creator' | 'creator-junho' | 'retro-arcade' | 'fair-review';

export type MoodId = 'cheerful' | 'emotional' | 'informative';

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  categoryLabel: string;
  question: string;
  context: string;
  options: QuizOption[];
  explanation: string;
}

/** 템플릿별 "주인공(또는 방송 주제)" 선택지 */
export interface SubjectOption {
  id: string;
  label: string;
  /** Flow 영문 프롬프트에 들어가는 묘사 */
  en: string;
}

export interface ShortsTemplate {
  id: TemplateId;
  title: string;
  oneLiner: string;
  canvaUrl: string;
  /** public/thumbnails/ 아래 파일명. 파일이 없으면 색 배경 썸네일로 대체됩니다. */
  thumbnail: string;
  tint: [string, string];
  subjectQuestion: string;
  /** character: 선택지가 곧 주인공 / theme: 주인공은 고정(protagonistEn), 선택지는 방송 주제 */
  subjectRole: 'character' | 'theme';
  protagonistEn?: string;
  subjects: SubjectOption[];
  keywordPlaceholder: string;
  /** Flow 영상의 화면 스타일 (영문) */
  styleEn: string;
  /** Gemini에게 주는 템플릿 설명 (한글) */
  briefKo: string;
  fallback: {
    captions: [string, string, string];
    sceneEn: string;
    sceneKo: string;
  };
  hashtags: string[];
}

export interface MoodInfo {
  id: MoodId;
  label: string;
  tonePrompt: string;
}

export interface ShortsResult {
  captions: [string, string, string];
  /** 영상 장면 한 줄 설명 (관람객용 한글) */
  sceneKo: string;
  /** Flow에 붙여넣을 최종 영문 프롬프트 */
  flowPrompt: string;
  hashtags: string[];
  mode: 'ai' | 'fallback';
}

export interface GenerateRequest {
  sessionId: string;
  templateId: TemplateId;
  subjectId: string;
  moodId: MoodId;
  keyword: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: ShortsResult;
  remaining?: number;
  notice?: string;
  error?: string;
}
