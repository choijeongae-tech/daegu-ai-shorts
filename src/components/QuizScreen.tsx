import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { BottomBar, PrimaryButton } from './ui';

export const QuizScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[index];
  const total = QUIZ_QUESTIONS.length;
  const pickedOption = q.options.find((o) => o.id === picked);

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (q.options.find((o) => o.id === id)?.isCorrect) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="rise">
        <p className="text-[13px] font-semibold text-muted">퀴즈 완료</p>
        <h2 className="mt-2 font-display text-[40px] leading-tight">
          {total}문제 중 {score}개 정답
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          이제 영상을 만들어요. 방금 확인한 세 가지는 영상을 올릴 때도 그대로 지켜 주세요.
        </p>
        <ul className="mt-6 space-y-2.5 rounded-2xl bg-surface p-5 text-[15px]">
          <li>허락받은 음원만 쓰기</li>
          <li>다른 사람 얼굴은 동의받거나 가리기</li>
          <li>AI가 만든 정보는 확인하고 쓰기</li>
        </ul>
        <BottomBar>
          <PrimaryButton onClick={onComplete}>영상 만들러 가기</PrimaryButton>
        </BottomBar>
      </div>
    );
  }

  return (
    <div key={q.id} className="rise">
      <p className="text-[13px] font-semibold text-muted">
        {index + 1} / {total} · {q.categoryLabel}
      </p>
      <h2 className="mt-2 text-[22px] font-extrabold leading-snug">{q.question}</h2>
      <p className="mt-2 text-[14px] text-muted">{q.context}</p>

      <div className="mt-6 space-y-2.5">
        {q.options.map((o) => {
          let style = 'border-line bg-surface';
          if (picked) {
            if (o.isCorrect) style = 'border-ok bg-ok-soft';
            else if (o.id === picked) style = 'border-rec bg-rec-soft';
            else style = 'border-line bg-surface opacity-50';
          }
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => pick(o.id)}
              disabled={!!picked}
              className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-[15px] leading-snug transition-colors ${style}`}
            >
              <span className="font-bold text-muted">{o.label}</span>
              <span className="flex-1 font-medium">{o.text}</span>
              {picked && o.isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-ok" />}
              {picked && o.id === picked && !o.isCorrect && <XCircle className="h-5 w-5 shrink-0 text-rec" />}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="rise mt-5">
          <p className={`text-[15px] font-bold ${pickedOption?.isCorrect ? 'text-ok' : 'text-rec'}`}>
            {pickedOption?.isCorrect ? '정답이에요' : '정답은 초록색 보기예요'}
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{q.explanation}</p>
          <BottomBar>
            <PrimaryButton onClick={next}>{index + 1 < total ? '다음 문제' : '결과 보기'}</PrimaryButton>
          </BottomBar>
        </div>
      )}
    </div>
  );
};
