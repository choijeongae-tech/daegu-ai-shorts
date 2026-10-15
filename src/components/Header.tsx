import React from 'react';
import { QrCode } from 'lucide-react';
import type { AppStep } from '../types';

const STEPS: { key: AppStep; label: string }[] = [
  { key: 'quiz', label: '퀴즈' },
  { key: 'make', label: '고르기' },
  { key: 'result', label: '자막' },
  { key: 'finish', label: '캔바 완성' },
];

export const Header: React.FC<{
  step: AppStep;
  onHome: () => void;
  onOpenQR: () => void;
}> = ({ step, onHome, onOpenQR }) => {
  const index = STEPS.findIndex((s) => s.key === step);

  return (
    <header className="sticky top-0 z-30 bg-paper/90 px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onHome} className="flex items-center gap-2" aria-label="처음 화면으로">
          <span className="rec-dot h-2.5 w-2.5 rounded-full bg-rec" />
          <span className="text-[15px] font-extrabold tracking-tight">AI 쇼츠 스튜디오</span>
        </button>
        <div className="flex items-center gap-1">
          {step !== 'home' && (
            <button
              type="button"
              onClick={onHome}
              className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-muted active:bg-line"
            >
              처음부터
            </button>
          )}
          <button
            type="button"
            onClick={onOpenQR}
            className="rounded-full p-2 text-muted active:bg-line"
            aria-label="접속 QR 코드 보기"
          >
            <QrCode className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {index >= 0 && (
        <div className="mt-3 grid grid-cols-4 gap-1.5" aria-label={`${STEPS.length}단계 중 ${index + 1}단계: ${STEPS[index].label}`}>
          {STEPS.map((s, i) => (
            <div key={s.key}>
              <div className={`h-1 rounded-full ${i <= index ? 'bg-rec' : 'bg-line'}`} />
              <div className={`mt-1 text-[11px] font-semibold ${i === index ? 'text-ink' : 'text-muted/70'}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
