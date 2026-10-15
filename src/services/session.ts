import type { AppStep, MoodId, ShortsResult, TemplateId } from '../types';

/**
 * 캔바에 다녀와도 진행 상황이 남도록 브라우저에 저장합니다.
 * (저장이 막힌 환경에서도 앱은 정상 동작합니다)
 */
const STATE_KEY = 'daegu_shorts_state_v2';
const SESSION_KEY = 'daegu_shorts_session_v2';

export interface SavedState {
  step: AppStep;
  templateId: TemplateId | null;
  protagonistId?: string | null;
  subjectId: string | null;
  moodId: MoodId;
  keyword: string;
  result: ShortsResult | null;
  remaining: number | null;
}

export function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* 저장 불가 환경은 무시 */
  }
}

function newId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

let memorySessionId: string | null = null;

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = newId();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    memorySessionId = memorySessionId || newId();
    return memorySessionId;
  }
}

/** '처음부터' — 부스 공용 기기에서 다음 방문객이 새 횟수로 시작하도록 세션도 새로 만듭니다. */
export function resetSession(): void {
  memorySessionId = null;
  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* 무시 */
  }
}
