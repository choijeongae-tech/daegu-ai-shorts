import React from 'react';
import { ExternalLink } from 'lucide-react';
import { BOOTH } from '../config/booth';
import { COMMON_HASHTAGS } from '../data/templates';
import type { ShortsResult, ShortsTemplate } from '../types';
import { BottomBar, CopyButton, SectionTitle, TemplateThumb } from './ui';

interface Props {
  template: ShortsTemplate;
  result: ShortsResult;
  onBack: () => void;
  onRestart: () => void;
}

const STEPS = [
  { title: '썸네일을 눌러 캔바 템플릿 열기', body: 'AI 영상이 이미 들어 있는 템플릿이 열려요.' },
  { title: '장면마다 자막 붙여 넣기', body: '자막 칸을 누르고, 아래 자막을 하나씩 복사해 넣어요.' },
  {
    title: '나만의 컷 더하기 (선택)',
    body: '부스에서 직접 찍은 3초 영상이나 사진을 한 장면에 넣어 보세요. 세상에 하나뿐인 쇼츠가 돼요.',
  },
  { title: '다운로드하고 공유하기', body: '[공유] → [다운로드]에서 MP4로 저장해요. 올릴 때 AI로 만든 영상이라고 밝혀 주세요.' },
];

export const FinishScreen: React.FC<Props> = ({ template, result, onBack, onRestart }) => {
  const hashtags = [...result.hashtags, ...COMMON_HASHTAGS].join(' ');
  const canvaUrl = result.canvaUrl || template.canvaUrl;

  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">캔바에서 완성해요</h2>

      <a
        href={canvaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mx-auto mt-6 block w-[62%] max-w-[240px]"
        aria-label={`${template.title} 캔바 템플릿 열기`}
      >
        <div className="rounded-[22px] bg-rec p-1 shadow-[0_16px_40px_-16px_rgba(232,41,58,0.7)] transition-transform group-active:scale-[0.98]">
          <TemplateThumb template={template} big />
        </div>
        <span className="mt-3 flex items-center justify-center gap-1.5 text-[15px] font-bold text-rec">
          캔바에서 열기 <ExternalLink className="h-4 w-4" />
        </span>
      </a>

      <p className="mt-4 text-center text-[13px] text-muted">캔바 계정이 없다면 부스 태블릿에서 만들 수 있어요.</p>

      <ol className="mt-8 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[15px] font-bold leading-snug">{s.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-8">
        <SectionTitle>자막</SectionTitle>
        <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          {result.captions.map((c, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="w-12 shrink-0 text-[12px] font-bold text-muted">장면 {i + 1}</span>
              <p className="flex-1 text-[14px] font-semibold leading-snug">{c}</p>
              <CopyButton text={c} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>올릴 때 쓸 해시태그</SectionTitle>
        <div className="rounded-2xl bg-surface p-4">
          <p className="text-[14px] leading-relaxed text-ink">{hashtags}</p>
          <CopyButton text={hashtags} label="해시태그 복사" className="mt-3" />
        </div>
      </section>

      {BOOTH.surveyUrl && (
        <a
          href={BOOTH.surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-between rounded-2xl bg-surface px-4 py-4 text-[15px] font-semibold"
        >
          체험 소감 남기기 (1분)
          <ExternalLink className="h-4 w-4 text-muted" />
        </a>
      )}

      <BottomBar>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-2xl border border-line bg-surface py-4 text-[15px] font-bold active:bg-paper"
          >
            프롬프트 다시 보기
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-2xl bg-ink py-4 text-[15px] font-bold text-white active:scale-[0.98]"
          >
            처음부터
          </button>
        </div>
      </BottomBar>
    </div>
  );
};
