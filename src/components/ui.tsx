import React, { useState } from 'react';
import { Check, Copy, Download, Loader2 } from 'lucide-react';
import { ASSET_VERSION, IS_STATIC, getDownloads } from '../config/runtime';
import type { ShortsTemplate } from '../types';

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 방식으로 재시도 */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export const CopyButton: React.FC<{
  text: string;
  label?: string;
  doneLabel?: string;
  variant?: 'quiet' | 'solid';
  className?: string;
}> = ({ text, label = '복사', doneLabel = '복사됨', variant = 'quiet', className = '' }) => {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    if (await copyText(text)) {
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    }
  };
  const base =
    variant === 'solid'
      ? done
        ? 'bg-ok text-white'
        : 'bg-ink text-white active:scale-[0.98]'
      : done
        ? 'bg-ok-soft text-ok'
        : 'bg-paper text-ink active:bg-line';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${base} ${className}`}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{done ? doneLabel : label}</span>
    </button>
  );
};

/** 화면 아래에 붙는 주 행동 버튼 영역 — 한 화면에 큰 버튼은 하나만 */
export const BottomBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="sticky bottom-0 z-20 -mx-5 mt-8 bg-gradient-to-t from-paper via-paper to-paper/0 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
    {children}
  </div>
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <button
    type="button"
    {...props}
    className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-rec px-5 py-4 text-[16px] font-bold text-white shadow-[0_8px_24px_-8px_rgba(232,41,58,0.6)] transition-transform active:scale-[0.98] disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const Chip: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({
  selected,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-full border px-4 py-2.5 text-[14px] font-semibold transition-colors ${
      selected ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink active:bg-paper'
    }`}
  >
    {children}
  </button>
);

/** 9:16 세로 썸네일. public/thumbnails/ 이미지가 없으면 색 배경으로 대신 보여줍니다. */
export const TemplateThumb: React.FC<{
  template: ShortsTemplate;
  className?: string;
  big?: boolean;
  showTitle?: boolean;
}> = ({ template, className = '', big = false, showTitle = true }) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div
      className={`relative aspect-[9/16] w-full overflow-hidden rounded-2xl ${className}`}
      style={{ background: `linear-gradient(160deg, ${template.tint[0]}, ${template.tint[1]})` }}
    >
      {imgOk && (
        <img
          src={`thumbnails/${template.thumbnail}?v=${ASSET_VERSION}`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgOk(false)}
          loading="lazy"
        />
      )}
      {!imgOk && showTitle && (
        <div className="absolute inset-0 flex flex-col justify-end p-3">
          <span
            className={`font-display leading-[1.05] text-white ${big ? 'text-[34px]' : 'text-[22px]'}`}
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
          >
            {template.title}
          </span>
        </div>
      )}
      <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-rec" />
        12s
      </span>
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-3 flex items-baseline justify-between gap-3">
    <h3 className="text-[15px] font-bold text-ink">{children}</h3>
    {hint && <span className="text-[12px] text-muted">{hint}</span>}
  </div>
);

/**
 * 영상 저장 버튼.
 * - 일반 웹사이트(AI Studio, GitHub Pages 등): 일반 다운로드 링크
 * - claude.ai 게시 페이지: 다운로드 확인 창을 먼저 시도하고, 안 되면 '새 창에서 열기'로 저장하게 안내
 */
export const SaveVideoButton: React.FC<{ url: string; filename: string; className?: string; dark?: boolean }> = ({
  url,
  filename,
  className = '',
  dark = false,
}) => {
  const [state, setState] = useState<'idle' | 'working' | 'saved' | 'error'>('idle');
  const base = `flex w-full items-center justify-center gap-2 rounded-full py-3 text-[15px] font-bold active:scale-[0.98] ${className}`;
  const inClaude = IS_STATIC && typeof window !== 'undefined' && !!(window as unknown as { claude?: unknown }).claude;
  const absoluteUrl = typeof window !== 'undefined' ? new URL(url, window.location.href).href : url;
  const hint = dark ? 'text-white/70' : 'text-muted';

  if (!inClaude) {
    return (
      <a href={url} download={filename} className={base}>
        <Download className="h-4 w-4" />
        영상 저장하기
      </a>
    );
  }

  const save = async () => {
    setState('working');
    try {
      const downloads = await getDownloads();
      if (!downloads) throw new Error('unavailable');
      const blob = await (await fetch(url)).blob();
      await downloads.save({ filename, data: blob });
      setState('saved');
    } catch (e) {
      const code = (e as { code?: string })?.code;
      setState(code === 'declined' ? 'idle' : 'error');
    }
  };

  return (
    <div className="w-full">
      <button type="button" onClick={save} disabled={state === 'working'} className={base}>
        {state === 'working' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state === 'saved' ? (
          <Check className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {state === 'saved' ? '저장했어요' : state === 'working' ? '준비 중' : '영상 저장하기'}
      </button>
      <a
        href={absoluteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 block text-center text-[13px] font-semibold underline underline-offset-2 ${hint}`}
      >
        저장이 안 되면 여기를 눌러 새 창에서 영상 열기
      </a>
      <p className={`mt-1 text-center text-[12px] leading-relaxed ${hint}`}>
        {state === 'error' ? '이 화면에서는 바로 저장이 안 돼요. ' : ''}새 창에서 아이폰은 공유 → [비디오 저장],
        안드로이드는 ⋮ → [다운로드]를 눌러요.
      </p>
    </div>
  );
};
