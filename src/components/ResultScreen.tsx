import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { ShortsResult, ShortsTemplate } from '../types';
import { CAPTION_CENTER, canCompose, captionIndexAt, composeShorts, type ComposeResult } from '../services/compose';
import { BottomBar, CopyButton, PrimaryButton, SaveVideoButton, SectionTitle } from './ui';

interface Props {
  template: ShortsTemplate;
  subjectLabel: string;
  result: ShortsResult;
  notice: string | null;
  onChangeCaptions: (captions: [string, string, string]) => void;
  onShuffle: () => void;
  onComposed: (composed: ComposeResult) => void;
  onBack: () => void;
  creatorName: string;
  onChangeName: (name: string) => void;
}

const MAX_CAPTION = 24;

export const ResultScreen: React.FC<Props> = ({
  template,
  subjectLabel,
  result,
  notice,
  onChangeCaptions,
  onShuffle,
  onComposed,
  onBack,
  creatorName,
  onChangeName,
}) => {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supported = canCompose();

  // 미리보기: 영상 시간에 맞춰 자막을 바꿔 보여 줌
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    const onTime = () => setCurrent(captionIndexAt(v.currentTime, v.duration));
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [result.videoUrl]);

  const edit = (i: number, value: string) => {
    const next = [...result.captions] as [string, string, string];
    next[i] = Array.from(value).slice(0, MAX_CAPTION).join('');
    onChangeCaptions(next);
  };

  const make = () => {
    setError(null);
    setProgress(0);
    previewRef.current?.pause();
    composeShorts({
      videoUrl: result.videoUrl,
      captions: result.captions,
      name: creatorName.trim(),
      subtitle: template.title,
      onProgress: setProgress,
    })
      .then((composed) => {
        setProgress(null);
        onComposed(composed);
      })
      .catch(() => {
        setProgress(null);
        setError('이 휴대폰에서는 완성 영상을 만들지 못했어요. 부스 태블릿에서 다시 해 보거나, 아래 방법으로 캔바에서 완성해 주세요.');
      });
  };

  const making = progress !== null;

  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">자막을 고르고 완성해요</h2>
      <p className="mt-2 text-[14px] text-muted">
        {template.title} · {subjectLabel}
      </p>

      {/* 미리보기 */}
      <div className="relative mx-auto mt-6 w-[64%] max-w-[260px] overflow-hidden rounded-2xl bg-black shadow-[0_16px_40px_-20px_rgba(23,23,46,0.6)]">
        <video
          ref={previewRef}
          key={result.videoUrl}
          src={result.videoUrl}
          poster={result.posterUrl}
          className="aspect-[9/16] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white">
          AI로 만든 영상
        </span>
        <div
          className="pointer-events-none absolute inset-x-3 flex -translate-y-1/2 justify-center"
          style={{ top: `${CAPTION_CENTER * 100}%` }}
        >
          <span className="rounded-lg bg-[rgba(10,10,25,0.62)] px-3 py-1.5 text-center font-display text-[15px] leading-snug text-white">
            {result.captions[current]}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[17%] items-end justify-center bg-gradient-to-b from-transparent to-black/55 pb-[5%]">
          <img
            src="logo.png"
            alt="대구1인미디어센터"
            className="max-h-[22px] max-w-[52%] object-contain"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = 'none';
              el.nextElementSibling?.removeAttribute('hidden');
            }}
          />
          <span hidden className="text-[10px] font-extrabold text-white">
            대구1인미디어센터
          </span>
        </div>
        {making && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
            <span className="text-[14px] font-bold">완성 영상 만드는 중</span>
            <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/25">
              <div className="h-full bg-rec transition-[width]" style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
            </div>
            <span className="text-[12px] text-white/70">화면을 끄지 말고 잠시 기다려 주세요</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-[12px] text-muted">미리보기는 소리 없이 나와요. 완성 영상은 이름 장면 2초가 더해져 7~12초예요.</p>

      {/* 닉네임 */}
      <section className="mt-8">
        <SectionTitle hint="첫 장면에 크게 들어가요">닉네임</SectionTitle>
        <input
          id="creator-name"
          value={creatorName}
          maxLength={10}
          onChange={(e) => onChangeName(e.target.value.slice(0, 10))}
          disabled={making}
          placeholder="예: 떡볶이요정, 픽셀용사"
          className="w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[16px] font-semibold placeholder:font-normal placeholder:text-muted/60 focus:border-ink focus:outline-none"
        />
        <p className="mt-2 text-[12px] text-muted">
          SNS에 올라가는 영상이니 실명 말고 닉네임을 써 주세요. 첫 장면: “
          {creatorName.trim() ? `${creatorName.trim()}의 쇼츠` : '나의 AI 쇼츠'}”
        </p>
      </section>

      {/* 자막 편집 */}
      <section className="mt-8">
        <SectionTitle hint={`장면마다 ${MAX_CAPTION}자까지`}>자막 3줄</SectionTitle>
        <div className="space-y-2">
          {result.captions.map((c, i) => (
            <label key={i} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-2.5">
              <span className="w-12 shrink-0 text-[12px] font-bold text-muted">장면 {i + 1}</span>
              <input
                id={`caption-${i}`}
                value={c}
                onChange={(e) => edit(i, e.target.value)}
                onFocus={() => setCurrent(i)}
                disabled={making}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] font-semibold outline-none"
              />
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[12px] text-muted">눌러서 내 말로 고쳐 써도 돼요.</p>
          <button
            type="button"
            onClick={onShuffle}
            disabled={making}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-[13px] font-semibold text-ink active:bg-line"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            다른 자막 추천
          </button>
        </div>
        {notice && <p className="mt-3 text-[12px] leading-relaxed text-muted">{notice}</p>}
      </section>

      {error && <p className="mt-6 rounded-2xl bg-rec-soft p-4 text-[14px] leading-relaxed text-ink">{error}</p>}

      {/* 완성 영상을 만들 수 없는 휴대폰: 캔바로 완성 */}
      {(!supported || error) && (
        <section className="mt-6 rounded-2xl bg-surface p-4">
          <SectionTitle>캔바에서 완성하기</SectionTitle>
          <ol className="list-decimal space-y-1 pl-5 text-[14px] leading-relaxed">
            <li>영상을 저장해요.</li>
            <li>캔바 템플릿에 영상을 올리고, 템플릿 배경음악은 꺼 주세요.</li>
            <li>자막을 복사해 장면마다 붙여 넣어요.</li>
          </ol>
          <div className="mt-3 space-y-2">
            <SaveVideoButton
              url={result.videoUrl}
              filename={result.videoUrl.split('?')[0].split('/').pop() || 'ai-shorts.mp4'}
              className="bg-ink text-white"
            />
            <CopyButton text={result.captions.join('\n')} label="자막 3줄 복사" className="w-full" />
            <a
              href={result.canvaUrl || template.canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[14px] font-bold text-rec underline underline-offset-2"
            >
              캔바 템플릿 열기
            </a>
          </div>
        </section>
      )}

      <BottomBar>
        {supported && !error ? (
          <PrimaryButton onClick={make} disabled={making || result.captions.some((c) => !c.trim())}>
            {making ? '만드는 중…' : '완성 쇼츠 만들기'}
          </PrimaryButton>
        ) : null}
        <button type="button" onClick={onBack} disabled={making} className="mt-2 w-full py-2 text-[13px] font-semibold text-muted">
          템플릿·주인공 다시 고르기
        </button>
      </BottomBar>
    </div>
  );
};
