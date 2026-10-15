import React from 'react';
import { TEMPLATES } from '../data/templates';
import { BOOTH } from '../config/booth';
import { BottomBar, PrimaryButton, TemplateThumb } from './ui';

export const HomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="rise">
    <p className="text-[13px] font-semibold text-muted">
      {BOOTH.eventName} · {BOOTH.boothName}
    </p>
    <h1 className="mt-2 font-display text-[44px] leading-[1.08] text-ink">
      12초 쇼츠,
      <br />
      AI랑 찍어요
    </h1>
    <p className="mt-3 text-[15px] leading-relaxed text-muted">
      퀴즈 3문제를 풀고 템플릿과 주인공을 고르면, 구글 Flow로 만든 AI 영상에 내 자막을 얹어 12초 쇼츠가 완성돼요.
    </p>

    <div className="mt-7 grid grid-cols-4 gap-2" aria-hidden="true">
      {TEMPLATES.map((t, i) => (
        <div key={t.id} className={i % 2 === 1 ? 'translate-y-4' : ''}>
          <TemplateThumb template={t} showTitle={false} />
        </div>
      ))}
    </div>

    <ol className="mt-12 space-y-3 text-[14px]">
      {['미디어 리터러시 퀴즈 3문제', '템플릿과 주인공 고르기', '자막 고르고 완성 쇼츠 저장'].map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
            {i + 1}
          </span>
          <span className="font-medium text-ink">{s}</span>
        </li>
      ))}
    </ol>

    <BottomBar>
      <PrimaryButton onClick={onStart}>시작하기</PrimaryButton>
      <p className="mt-2 text-center text-[12px] text-muted">약 3분 · 앱 설치 없이 스마트폰으로</p>
    </BottomBar>
  </div>
);
