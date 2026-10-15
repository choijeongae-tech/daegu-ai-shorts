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
  /**
   * 이 주인공 영상이 미리 들어 있는 캔바 템플릿 링크.
   * 비워 두면 템플릿 기본 링크(ShortsTemplate.canvaUrl)가 열립니다.
   */
  canvaUrl: string;
  /** 주인공을 고르는 템플릿에서, 주인공별로 캔바 링크를 따로 쓸 때만 (예: { male: '…', female: '…' }) */
  canvaUrlByProtagonist?: Record<string, string>;
  /** 이 주제 영상의 한국어 대사. {name}은 주인공 이름으로 바뀝니다. */
  lineKo?: string;
  /** 이 주제의 기본 자막 3줄 (AI를 못 쓸 때). {name}은 주인공 이름으로 바뀝니다. */
  captions?: [string, string, string];
}

/** 주인공을 바꿀 수 있는 템플릿의 주인공 선택지 (예: 남성 준호 / 여성 하은) */
export interface ProtagonistOption {
  id: string;
  label: string;
  /** 캐릭터 이름 (자막·대사에 쓰임) */
  nameKo: string;
  /** Flow 프롬프트의 주인공 묘사 */
  en: string;
  /** 이 주인공이 말할 한국어 대사 */
  lineKo: string;
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
  /** subjectRole이 theme일 때 고를 수 있는 주인공 (첫 번째가 기본값) */
  protagonists?: ProtagonistOption[];
  protagonistQuestion?: string;
  subjects: SubjectOption[];
  keywordPlaceholder: string;
  /** Flow 영상의 화면 스타일 (영문) */
  styleEn: string;
  /**
   * 영상 소리. 지정하지 않으면 Flow가 영어 대사·내레이션을 넣는 경우가 많습니다.
   * - lineKo가 있으면: 화면 속 인물이 이 한국어 대사만 말하게 합니다.
   * - lineKo가 없으면: 대사·내레이션 없이 음악과 효과음만 넣습니다.
   */
  audio: {
    lineKo?: string;
    /** 배경 소리 (영문) */
    soundEn: string;
  };
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
  /** 미리 만든 영상에 실제로 쓴 Flow 영문 프롬프트 */
  flowPrompt: string;
  /** 열어야 할 캔바 링크 (주인공별) */
  canvaUrl: string;
  hashtags: string[];
  mode: 'ai' | 'fallback';
}

export interface GenerateRequest {
  sessionId: string;
  templateId: TemplateId;
  protagonistId?: string;
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
