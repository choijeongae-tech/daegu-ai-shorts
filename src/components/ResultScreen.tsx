import React from 'react';
import type { ShortsResult, ShortsTemplate } from '../types';
import { BottomBar, CopyButton, PrimaryButton, SectionTitle, TemplateThumb } from './ui';

interface Props {
  template: ShortsTemplate;
  subjectLabel: string;
  result: ShortsResult;
  notice: string | null;
  onRemake: () => void;
  onNext: () => void;
}

export const ResultScreen: React.FC<Props> = ({ template, subjectLabel, result, notice, onRemake, onNext }) => {
  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">내 자막이 나왔어요</h2>
      <p className="mt-2 text-[14px] text-muted">
        {template.title} · {subjectLabel}
      </p>
      {notice && <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-[13px] text-muted">{notice}</p>}

      {/* 자막 */}
      <section className="mt-8">
        <SectionTitle hint="캔바 장면에 하나씩 붙여 넣어요">자막 3줄</SectionTitle>
        <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          {result.captions.map((c, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <span className="w-12 shrink-0 text-[12px] font-bold text-muted">장면 {i + 1}</span>
              <p className="flex-1 text-[15px] font-semibold leading-snug">{c}</p>
              <CopyButton text={c} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-end">
          <CopyButton text={result.captions.join('\n')} label="3줄 한꺼번에 복사" />
        </div>
      </section>

      {/* 이 영상을 만든 프롬프트 */}
      <section className="mt-8">
        <SectionTitle>이 영상은 AI가 이렇게 만들었어요</SectionTitle>
        <div className="rounded-2xl bg-ink p-5 text-white">
          <div className="flex gap-4">
            <div className="w-16 shrink-0">
              <TemplateThumb template={template} showTitle={false} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white/60">구글 Flow에 이렇게 주문했어요</p>
              <p className="mt-1 text-[15px] font-semibold leading-snug">{result.sceneKo}</p>
            </div>
          </div>
          <p className="mt-4 border-t border-white/15 pt-4 text-[13px] leading-relaxed text-white/75" lang="en">
            {result.flowPrompt}
          </p>
          <CopyButton
            text={result.flowPrompt}
            label="프롬프트 복사"
            doneLabel="복사됨"
            className="mt-4 w-full !bg-white !text-ink"
          />
        </div>
        <p className="mt-3 rounded-2xl bg-surface p-4 text-[14px] leading-relaxed">
          <span className="font-bold">찾아보기</span> · 캔바에서 영상을 열면 프롬프트와 비교해 보세요. 주문에 없었는데 AI가 마음대로
          만들어 넣은 건 무엇일까요?
        </p>
      </section>

      <BottomBar>
        <PrimaryButton onClick={onNext}>캔바에서 완성하기</PrimaryButton>
        <button type="button" onClick={onRemake} className="mt-2 w-full py-2 text-[13px] font-semibold text-muted">
          자막 다시 만들기
        </button>
      </BottomBar>
    </div>
  );
};
