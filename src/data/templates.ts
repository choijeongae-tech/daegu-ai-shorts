/**
 * 쇼츠 템플릿 4종 — 앱(화면)과 서버(server.ts)가 함께 쓰는 설정 파일입니다.
 *
 * [운영자 안내]
 * - 영상은 행사 전에 미리 만들어 둡니다: 템플릿 4개 × 주인공 4개 = 16개.
 *   각 영상의 Flow 프롬프트는 docs/flow-prompts.md 에 정리돼 있습니다. (npm run prompts 로 다시 만들 수 있음)
 * - 영상을 넣은 캔바 템플릿 사본의 링크를 각 주인공의 canvaUrl에 넣어 주세요.
 *   비워 두면 그 템플릿의 기본 링크(canvaUrl)가 열립니다.
 * - 썸네일 이미지는 public/thumbnails/ 폴더에 thumbnail 이름 그대로(9:16 세로 이미지) 넣어 주세요.
 *   파일이 없으면 색 배경 썸네일이 자동으로 보입니다.
 * - '크리에이터 첫 방송'의 주인공(준호·하은) 이름·생김새는 protagonists에서 고칠 수 있어요.
 *
 * ※ Flow 영상 프롬프트(en, styleEn, sceneEn)에는 실제 지명·기관명·행사명을 넣지 마세요.
 *   실존 장소를 사실처럼 보여 주는 영상은 Flow가 거부할 수 있어요. (자막을 쓰는 briefKo에는 괜찮습니다)
 *
 * ※ 서버가 이 파일을 직접 불러오므로 타입은 반드시 `import type`으로만 가져옵니다.
 */
import type { ShortsTemplate, MoodInfo, TemplateId, MoodId, ShortsResult } from '../types';

export const TEMPLATES: ShortsTemplate[] = [
  {
    id: 'pet-creator',
    title: '반려동물 크리에이터',
    oneLiner: '우리 집 반려동물이 크리에이터로 데뷔해요',
    canvaUrl: 'https://canva.link/k1ufehbdp3b1655',
    thumbnail: 'pet-creator.jpg',
    tint: ['#FFB547', '#FF6B6B'],
    subjectQuestion: '주인공 반려동물은?',
    subjectRole: 'character',
    subjects: [
      { id: 'dog', label: '강아지', en: 'a fluffy small dog with bright eyes', canvaUrl: '' },
      { id: 'cat', label: '고양이', en: 'a curious cat with soft fur', canvaUrl: '' },
      { id: 'hamster', label: '햄스터', en: 'a tiny round hamster', canvaUrl: '' },
      { id: 'rabbit', label: '토끼', en: 'a fluffy rabbit with long ears', canvaUrl: '' },
    ],
    keywordPlaceholder: '예: 간식 리뷰, 산책 브이로그',
    styleEn: 'Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood',
    briefKo: '반려동물이 1인 크리에이터처럼 카메라 앞에서 방송하는 귀엽고 유쾌한 쇼츠',
    audio: { soundEn: 'cute pet sounds and soft, cheerful background music' },
    fallback: {
      captions: ['오늘부터 우리 집 막내도 크리에이터!', '카메라만 켜면 표정 연기가 시작돼요', '구독과 간식은 언제나 환영이에요'],
      sceneEn:
        'The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel.',
      sceneKo: '작은 링라이트 앞에 앉은 반려동물이 고개를 갸웃하다 앞발로 녹화 버튼을 톡 누르는 장면',
    },
    hashtags: ['#반려동물크리에이터', '#펫튜버'],
  },
  {
    id: 'creator-junho',
    title: '크리에이터 첫 방송',
    oneLiner: '1인미디어센터 스튜디오에서 첫 방송을 시작해요',
    canvaUrl: 'https://canva.link/8jvnmcka6hljch6',
    thumbnail: 'creator-junho.jpg',
    tint: ['#3D3DF5', '#F0313B'],
    subjectQuestion: '첫 방송 주제는?',
    subjectRole: 'theme',
    protagonistQuestion: '주인공은?',
    protagonists: [
      {
        id: 'male',
        label: '남성 · 준호',
        nameKo: '준호',
        en: 'Junho, a friendly Korean man in his early 20s with short black hair, wearing a casual hoodie',
        lineKo: '안녕하세요, 크리에이터 준호입니다! 오늘 첫 방송 시작할게요!',
      },
      {
        id: 'female',
        label: '여성 · 하은',
        nameKo: '하은',
        en: 'Haeun, a friendly Korean woman in her early 20s with shoulder-length black hair, wearing a casual hoodie',
        lineKo: '안녕하세요, 크리에이터 하은입니다! 오늘 첫 방송 시작할게요!',
      },
    ],
    subjects: [
      {
        id: 'game',
        label: '게임 방송',
        en: 'a live game stream, wearing a gaming headset with a controller in hand',
        canvaUrl: '',
        lineKo: '안녕하세요, {name}입니다! 첫 게임 방송 시작할게요!',
        captions: ['신인 크리에이터 {name}, 첫 방송 ON!', '오늘은 내가 좋아하는 게임 이야기', '구독하고 다음 판도 같이 해요!'],
      },
      {
        id: 'mukbang',
        label: '먹방',
        en: 'a mukbang, tasting spicy tteokbokki and Korean street food at the desk',
        canvaUrl: '',
        lineKo: '안녕하세요, {name}입니다! 오늘은 떡볶이 먹방이에요!',
        captions: ['{name}의 첫 먹방, 지금 시작!', '매콤한 떡볶이 한 입에 텐션 업', '맛있게 먹는 것도 콘텐츠예요!'],
      },
      {
        id: 'travel',
        label: '여행 브이로그',
        en: 'a travel vlog show, holding a small camera and a paper map, with colorful travel photos pinned on the wall',
        canvaUrl: '',
        lineKo: '안녕하세요, {name}입니다! 첫 여행 이야기 들려드릴게요!',
        captions: ['{name}의 여행 채널 첫 방송!', '지도 한 장, 카메라 하나면 준비 끝', '다음 여행지는 댓글로 알려 주세요!'],
      },
      {
        id: 'music',
        label: '음악 방송',
        en: 'a music show, standing at a studio microphone with a guitar',
        canvaUrl: '',
        lineKo: '안녕하세요, {name}입니다! 첫 음악 방송 시작할게요!',
        captions: ['{name}의 첫 음악 방송, ON AIR!', '좋아하는 음악을 나누는 시간', '다음 곡 신청은 댓글로 받아요!'],
      },
    ],
    keywordPlaceholder: '예: 채널 이름, 첫 인사말',
    styleEn:
      'Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting',
    briefKo: '신인 크리에이터가 1인미디어센터 스튜디오에서 첫 방송을 시작하는 쇼츠',
    audio: {
      // 실제 대사는 위 protagonists의 lineKo를 씁니다
      soundEn: 'light upbeat studio background music',
    },
    fallback: {
      captions: ['신인 크리에이터, 오늘 첫 방송 시작!', '좋아하는 걸 이야기하면 그게 콘텐츠', '지금 온에어 버튼을 함께 눌러요'],
      sceneEn:
        'The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in.',
      sceneKo: '크리에이터가 책상에 앉아 헤드폰을 쓰고, 뒤에 ON AIR 불이 켜지자 카메라에 손을 흔드는 장면',
    },
    hashtags: ['#크리에이터첫방송', '#1인미디어'],
  },
  {
    id: 'retro-arcade',
    title: '레트로 아케이드 게임',
    oneLiner: '내가 만든 캐릭터가 게임 주인공이 돼요',
    canvaUrl: 'https://canva.link/pkyc09hgv2bcu6f',
    thumbnail: 'retro-arcade.jpg',
    tint: ['#1B1B4B', '#7B2FF7'],
    subjectQuestion: '내 캐릭터는?',
    subjectRole: 'character',
    subjects: [
      { id: 'cat-knight', label: '고양이 기사', en: 'a brave cat knight with a tiny sword', canvaUrl: '' },
      { id: 'robot', label: '로봇 히어로', en: 'a small round robot hero with glowing eyes', canvaUrl: '' },
      { id: 'astronaut', label: '우주 탐험가', en: 'a little astronaut explorer in a white suit', canvaUrl: '' },
      { id: 'wizard', label: '꼬마 마법사', en: 'a young wizard with a glowing star staff', canvaUrl: '' },
    ],
    keywordPlaceholder: '예: 빨간 망토, 별 모양 방패',
    styleEn: '16-bit retro pixel art video game, side-scrolling arcade stage, chunky pixels, vivid CRT colors',
    briefKo: '내가 만든 캐릭터가 레트로 픽셀 게임 속 주인공이 되어 스테이지를 클리어하는 쇼츠',
    audio: { soundEn: '8-bit chiptune game music, coin and jump sound effects' },
    fallback: {
      captions: ['게임 스타트! 내 캐릭터가 등장했다', '퀘스트: 콘텐츠페어의 보물을 찾아라', '미션 클리어! 다음 스테이지로 가요'],
      sceneEn:
        'The character jumps across floating platforms, collects spinning gold coins and a glowing star, then strikes a victory pose as pixel fireworks burst in the sky. Side-scrolling camera.',
      sceneKo: '캐릭터가 발판을 뛰어넘으며 금화와 별을 모으고, 픽셀 불꽃놀이 속에서 승리 포즈를 취하는 장면',
    },
    hashtags: ['#레트로게임', '#내캐릭터'],
  },
  {
    id: 'fair-review',
    title: '콘텐츠페어 방문 후기',
    oneLiner: '오늘 본 콘텐츠페어를 후기 영상으로 남겨요',
    canvaUrl: 'https://canva.link/s60zykh8980bxvf',
    thumbnail: 'fair-review.jpg',
    tint: ['#00A3A3', '#3D7BF5'],
    subjectQuestion: '영상 속 주인공은?',
    subjectRole: 'character',
    subjects: [
      { id: 'twenties', label: '20대 청년', en: 'a Korean woman in her 20s holding a small camera', canvaUrl: '' },
      { id: 'student', label: '10대 학생', en: 'a cheerful Korean teenage student in a hoodie', canvaUrl: '' },
      { id: 'friends', label: '친구 둘', en: 'two Korean friends in their 20s', canvaUrl: '' },
      { id: 'family', label: '가족', en: 'a Korean family of three', canvaUrl: '' },
    ],
    keywordPlaceholder: '예: 가장 재밌었던 부스, VR 체험',
    styleEn:
      'Bright, cheerful vlog-style video inside a large modern convention hall at a fictional content festival, colorful creative booths, friendly crowd, handheld gimbal shot',
    briefKo: '2026 대구 콘텐츠페어에 다녀온 관람객의 방문 후기 쇼츠',
    audio: {
      lineKo: '와, 대구 콘텐츠페어 진짜 재밌다!',
      soundEn: 'lively exhibition hall ambience and upbeat background music',
    },
    fallback: {
      captions: ['대구 콘텐츠페어, 직접 와 봤어요!', '보고 듣고 만들고, 하루가 짧았어요', '내년에도 꼭 다시 올 거예요'],
      sceneEn:
        'They walk through the hall looking around excitedly, stop at a booth to try a hands-on experience, then turn to the camera with a big thumbs up. Gimbal tracking shot.',
      sceneKo: '전시장을 둘러보다 체험 부스에 들러 직접 해 보고, 카메라를 보며 엄지를 드는 장면',
    },
    hashtags: ['#콘텐츠페어후기', '#엑스코'],
  },
];

export const MOODS: MoodInfo[] = [
  { id: 'cheerful', label: '발랄하게', tonePrompt: '밝고 경쾌한 숏폼 말투, 느낌표를 적당히 활용' },
  { id: 'emotional', label: '감성적으로', tonePrompt: '따뜻하고 잔잔한 브이로그 말투' },
  { id: 'informative', label: '깔끔하게', tonePrompt: '군더더기 없이 명확한 정보형 말투' },
];

/** 모든 영상에 공통으로 붙는 해시태그 */
export const COMMON_HASHTAGS = ['#2026대구콘텐츠페어', '#대구1인미디어센터', '#AI생성영상'];

export function getTemplate(id: string | undefined): ShortsTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function isMoodId(id: unknown): id is MoodId {
  return MOODS.some((m) => m.id === id);
}

export function isTemplateId(id: unknown): id is TemplateId {
  return TEMPLATES.some((t) => t.id === id);
}

/** 문구 속 {name}을 주인공 이름으로 바꿉니다 */
export function fillName(text: string, name?: string): string {
  return text.replace(/\{name\}/g, name || '크리에이터');
}

/** 이 영상의 한국어 대사 (주제별 → 주인공별 → 템플릿 기본 순) */
export function getLineKo(template: ShortsTemplate, subjectId: string, protagonistId?: string | null): string | undefined {
  const subject = template.subjects.find((s) => s.id === subjectId) || template.subjects[0];
  const protagonist = getProtagonist(template, protagonistId);
  const raw = subject.lineKo || protagonist?.lineKo || template.audio.lineKo;
  return raw ? fillName(raw, protagonist?.nameKo) : undefined;
}

/** 이름 뒤 주격 조사: 받침 있으면 '이', 없으면 '가' (하은이 / 준호가) */
function withSubjectParticle(name: string): string {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  const hasFinal = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${name}${hasFinal ? '이' : '가'}`;
}

export function getProtagonist(template: ShortsTemplate, protagonistId?: string | null) {
  if (!template.protagonists?.length) return undefined;
  return template.protagonists.find((p) => p.id === protagonistId) || template.protagonists[0];
}

/**
 * Flow 최종 프롬프트 조립.
 * 주인공 묘사는 AI가 아니라 앱이 항상 같은 자리에 넣습니다.
 * (주인공 설정이 빠지거나 서로 모순되는 일이 없습니다)
 */
export function buildFlowPrompt(
  template: ShortsTemplate,
  subjectId: string,
  sceneEn: string,
  protagonistId?: string | null,
): string {
  const subject = template.subjects.find((s) => s.id === subjectId) || template.subjects[0];
  const protagonist = getProtagonist(template, protagonistId);
  const who =
    template.subjectRole === 'theme' && protagonist
      ? `Main character: ${protagonist.en}. The video is ${subject.en}.`
      : `Main character: ${subject.en}.`;
  const lineKo = getLineKo(template, subject.id, protagonistId);
  const audio = lineKo
    ? `Audio: the person on screen says in Korean, "${lineKo}" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: ${template.audio.soundEn}.`
    : `Audio: no dialogue, no narration, no singing, no voice of any kind. Only ${template.audio.soundEn}.`;
  return `Vertical 9:16 video. ${template.styleEn}. ${who} ${sceneEn.trim()} ${audio} No on-screen text, no subtitles, no logos.`;
}

/** 준비된 결과 — AI를 쓸 수 없을 때의 자막 + 미리 만든 영상의 프롬프트·캔바 링크 (서버·앱 공용) */
export function buildFallbackResult(
  template: ShortsTemplate,
  subjectId: string,
  keyword = '',
  protagonistId?: string | null,
): ShortsResult {
  const kwTag = keyword.trim() ? `#${keyword.trim().replace(/[\s,#]+/g, '').slice(0, 15)}` : '';
  const subject = template.subjects.find((s) => s.id === subjectId) || template.subjects[0];
  const protagonist = getProtagonist(template, protagonistId);
  const lineKo = getLineKo(template, subject.id, protagonist?.id);
  const sceneKo = protagonist
    ? template.fallback.sceneKo.replace(/^크리에이터가/, withSubjectParticle(protagonist.nameKo))
    : template.fallback.sceneKo;
  return {
    captions: (subject.captions || template.fallback.captions).map((c) => fillName(c, protagonist?.nameKo)) as [
      string,
      string,
      string,
    ],
    sceneKo: lineKo ? `${sceneKo} (대사: "${lineKo}")` : `${sceneKo} (대사 없이 음악·효과음만)`,
    flowPrompt: buildFlowPrompt(template, subject.id, template.fallback.sceneEn, protagonist?.id),
    canvaUrl:
      (protagonist && subject.canvaUrlByProtagonist?.[protagonist.id]) || subject.canvaUrl || template.canvaUrl,
    hashtags: [...template.hashtags, ...(kwTag ? [kwTag] : [])],
    mode: 'fallback',
  };
}
