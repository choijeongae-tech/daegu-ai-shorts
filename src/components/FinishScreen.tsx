import React, { useEffect, useMemo, useState } from 'react';
import { Check, Download, ExternalLink, Share2 } from 'lucide-react';
import { BOOTH } from '../config/booth';
import { COMMON_HASHTAGS } from '../data/templates';
import { getDownloads } from '../config/runtime';
import type { ComposeResult } from '../services/compose';
import type { ShortsResult, ShortsTemplate } from '../types';
import { BottomBar, CopyButton, SectionTitle } from './ui';

interface Props {
  template: ShortsTemplate;
  result: ShortsResult;
  composed: ComposeResult;
  onBack: () => void;
  onRestart: () => void;
}

export const FinishScreen: React.FC<Props> = ({ template, result, composed, onBack, onRestart }) => {
  const hashtags = [...result.hashtags, ...COMMON_HASHTAGS].join(' ');
  const filename = `ai-shorts-${new Date().toISOString().slice(0, 10)}.${composed.ext}`;
  const url = useMemo(() => URL.createObjectURL(composed.blob), [composed.blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const file = useMemo(() => new File([composed.blob], filename, { type: composed.blob.type }), [composed.blob, filename]);
  const canShare = typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [file] });
  const inClaude = !!(window as unknown as { claude?: unknown }).claude;
  const [saved, setSaved] = useState(false);

  const share = async () => {
    try {
      await navigator.share({ files: [file] });
      setSaved(true);
    } catch {
      /* 취소 */
    }
  };

  const saveInClaude = async () => {
    try {
      const d = await getDownloads();
      if (!d) return;
      await d.save({ filename, data: composed.blob });
      setSaved(true);
    } catch {
      /* 취소 또는 불가 */
    }
  };

  const btn =
    'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[16px] font-bold transition-transform active:scale-[0.98]';

  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">내 쇼츠가 완성됐어요</h2>

      <div className="mx-auto mt-6 w-[64%] max-w-[260px] overflow-hidden rounded-2xl bg-black shadow-[0_16px_40px_-20px_rgba(23,23,46,0.6)]">
        <video src={url} className="aspect-[9/16] w-full object-cover" controls playsInline loop />
      </div>

      <div className="mt-6 space-y-2">
        {canShare && (
          <button type="button" onClick={share} className={`${btn} bg-rec text-white`}>
            <Share2 className="h-5 w-5" />
            사진첩에 저장 · 공유하기
          </button>
        )}
        {inClaude ? (
          <button type="button" onClick={saveInClaude} className={`${btn} border border-line bg-surface text-ink`}>
            <Download className="h-5 w-5" />
            파일로 저장
          </button>
        ) : (
          <a
            href={url}
            download={filename}
            onClick={() => setSaved(true)}
            className={`${btn} ${canShare ? 'border border-line bg-surface text-ink' : 'bg-rec text-white'}`}
          >
            <Download className="h-5 w-5" />
            파일로 저장
          </a>
        )}
        {saved && (
          <p className="flex items-center justify-center gap-1 text-[13px] font-semibold text-ok">
            <Check className="h-4 w-4" /> 저장했어요
          </p>
        )}
        <p className="text-center text-[12px] leading-relaxed text-muted">
          아이폰은 [사진첩에 저장 · 공유하기] → [비디오 저장]을 누르면 사진첩에 들어가요.
        </p>
      </div>

      <section className="mt-8">
        <SectionTitle>올릴 때 지켜요</SectionTitle>
        <ul className="space-y-1.5 rounded-2xl bg-surface p-4 text-[14px] leading-relaxed">
          <li>AI로 만든 영상이라고 밝혀요. 영상 오른쪽 위에 표시가 들어가 있어요.</li>
          <li>영상에 음악을 더한다면 허락받은 음원만 써요.</li>
          <li>다른 사람 얼굴이 나온 사진을 더한다면 동의를 받아요.</li>
        </ul>
      </section>

      <section className="mt-8">
        <SectionTitle>해시태그</SectionTitle>
        <div className="rounded-2xl bg-surface p-4">
          <p className="text-[14px] leading-relaxed text-ink">{hashtags}</p>
          <CopyButton text={hashtags} label="해시태그 복사" className="mt-3" />
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>이 영상은 AI가 이렇게 만들었어요</SectionTitle>
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-[13px] font-semibold text-white/60">구글 Flow에 이렇게 주문했어요</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug">{result.sceneKo}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/75">{result.flowPrompt}</p>
          <CopyButton text={result.flowPrompt} label="프롬프트 복사" className="mt-4 w-full !bg-white/10 !text-white" />
        </div>
        <p className="mt-3 rounded-2xl bg-surface p-4 text-[14px] leading-relaxed">
          <span className="font-bold">찾아보기</span> · 영상과 프롬프트를 비교해 보세요. 주문에 없었는데 AI가 마음대로
          만들어 넣은 건 무엇일까요?
        </p>
      </section>

      <a
        href={result.canvaUrl || template.canvaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center justify-between rounded-2xl bg-surface px-4 py-4 text-[15px] font-semibold"
      >
        <span>
          캔바에서 더 꾸미기 <span className="font-normal text-muted">(선택)</span>
        </span>
        <ExternalLink className="h-4 w-4 text-muted" />
      </a>

      {BOOTH.surveyUrl && (
        <a
          href={BOOTH.surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-between rounded-2xl bg-surface px-4 py-4 text-[15px] font-semibold"
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
            자막 바꿔 다시 만들기
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
