import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
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
          src={`/thumbnails/${template.thumbnail}`}
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
