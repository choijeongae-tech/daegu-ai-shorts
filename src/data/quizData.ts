import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    categoryLabel: '저작권 미션',
    question: '쇼츠 영상에 유행하는 인기가요를 배경음악으로 넣을 때 올바른 방법은?',
    context: '음원 저작권은 창작자의 고유한 권리입니다.',
    options: [
      {
        id: '1-a',
        label: 'A',
        text: '15초 이하의 짧은 영상이니 허락 없이 써도 된다.',
        isCorrect: false,
      },
      {
        id: '1-b',
        label: 'B',
        text: '플랫폼 무료 오디오 보관함이나 허가된 음원을 쓴다.',
        isCorrect: true,
      },
      {
        id: '1-c',
        label: 'C',
        text: '영상 설명란에 출처 한 줄만 적으면 무조건 괜찮다.',
        isCorrect: false,
      },
    ],
    explanation: '짧은 쇼츠라도 상업적 음원을 무단 사용하면 저작권 침해가 됩니다. 무료 보관함이나 라이선스 음원을 사용해야 안전합니다.',
  },
  {
    id: 2,
    categoryLabel: '초상권 미션',
    question: '행사장 촬영 중 다른 관람객의 얼굴이 또렷이 찍혔을 때 필수 조치는?',
    context: '타인의 얼굴 이미지를 무단 공개하지 않을 권리가 있습니다.',
    options: [
      {
        id: '2-a',
        label: 'A',
        text: '공개 행사장 축제이므로 허락 없이 그대로 올려도 된다.',
        isCorrect: false,
      },
      {
        id: '2-b',
        label: 'B',
        text: '당사자 동의를 구하거나 모자이크(스티커) 처리한다.',
        isCorrect: true,
      },
      {
        id: '2-c',
        label: 'C',
        text: '조회수를 위해 타인의 얼굴을 썸네일로 크게 강조한다.',
        isCorrect: false,
      },
    ],
    explanation: '공개 행사장이라도 타인의 얼굴이 무단 노출되면 안 됩니다. 당사자 동의를 얻거나 모자이크·스티커 처리가 기본 매너입니다.',
  },
  {
    id: 3,
    categoryLabel: 'AI 정보 검증 미션',
    question: '생성형 AI가 알려준 역사나 상식 정보를 쇼츠 대본에 쓸 때 올바른 태도는?',
    context: '생성형 AI는 사실과 다른 허위 정보(환각)를 만들 수 있습니다.',
    options: [
      {
        id: '3-a',
        label: 'A',
        text: 'AI는 똑똑하므로 의심 없이 100% 그대로 믿고 쓴다.',
        isCorrect: false,
      },
      {
        id: '3-b',
        label: 'B',
        text: '재미만 있다면 틀린 정보라도 과장해서 쇼츠로 만든다.',
        isCorrect: false,
      },
      {
        id: '3-c',
        label: 'C',
        text: '공식 기관 자료나 뉴스로 팩트체크(교차 검증) 후 사용한다.',
        isCorrect: true,
      },
    ],
    explanation: '생성형 AI는 그럴듯한 거짓말(환각 현상)을 할 수 있습니다. 공공기관 공식 자료로 1분만 팩트체크하는 습관이 중요합니다.',
  },
];
