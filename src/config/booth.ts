/**
 * 부스 운영 설정 — 행사 전에 이 파일만 채우면 됩니다.
 */
export const BOOTH = {
  eventName: '2026 대구 콘텐츠페어',
  boothName: '대구1인미디어센터',

  /**
   * QR 코드에 넣을 공개 주소 (AI Studio에서 배포한 주소).
   * 비워 두면 지금 열린 주소를 씁니다. 개발용 미리보기(ais-dev-…) 주소는 외부인이 못 열 수 있어요.
   */
  publicUrl: '',

  /** 만족도 조사 링크 (구글 폼 등). 비워 두면 버튼이 보이지 않습니다. */
  surveyUrl: '',

  /** 한 사람(세션)당 AI 생성 횟수 — server.ts의 MAX_PER_SESSION과 맞춰 주세요 */
  maxGenerations: 5,
};
