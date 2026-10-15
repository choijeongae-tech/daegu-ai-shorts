/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import type { AppStep, MoodId, ShortsResult, TemplateId } from './types';
import { getTemplate } from './data/templates';
import { loadState, resetSession, saveState } from './services/session';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { MakeScreen } from './components/MakeScreen';
import { ResultScreen } from './components/ResultScreen';
import { FinishScreen } from './components/FinishScreen';
import { QRCodeModal } from './components/QRCodeModal';

export const App: React.FC = () => {
  const saved = loadState();
  const [step, setStep] = useState<AppStep>(saved?.result ? saved.step : 'home');
  const [templateId, setTemplateId] = useState<TemplateId | null>(saved?.templateId ?? null);
  const [protagonistId, setProtagonistId] = useState<string | null>(saved?.protagonistId ?? null);
  const [subjectId, setSubjectId] = useState<string | null>(saved?.subjectId ?? null);
  const [moodId, setMoodId] = useState<MoodId>(saved?.moodId ?? 'cheerful');
  const [keyword, setKeyword] = useState(saved?.keyword ?? '');
  const [result, setResult] = useState<ShortsResult | null>(saved?.result ?? null);
  const [remaining, setRemaining] = useState<number | null>(saved?.remaining ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  // 캔바에 다녀와도 그대로 이어지도록 저장
  useEffect(() => {
    saveState({ step, templateId, protagonistId, subjectId, moodId, keyword, result, remaining });
  }, [step, templateId, protagonistId, subjectId, moodId, keyword, result, remaining]);

  const go = (next: AppStep) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    resetSession();
    setTemplateId(null);
    setProtagonistId(null);
    setSubjectId(null);
    setMoodId('cheerful');
    setKeyword('');
    setResult(null);
    setRemaining(null);
    setNotice(null);
    go('home');
  };

  const template = getTemplate(templateId ?? undefined);
  const subjectName = template?.subjects.find((s) => s.id === subjectId)?.label ?? '';
  const protagonistName = template?.protagonists?.find((p) => p.id === protagonistId)?.label;
  const subjectLabel = protagonistName ? `${protagonistName} · ${subjectName}` : subjectName;
  const hasResult = !!(template && result);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-paper">
      <Header step={step} onHome={restart} onOpenQR={() => setQrOpen(true)} />

      <main className="flex flex-1 flex-col px-5 pb-4 pt-4">
        {step === 'home' && <HomeScreen onStart={() => go('quiz')} />}

        {step === 'quiz' && <QuizScreen onComplete={() => go('make')} />}

        {(step === 'make' || ((step === 'result' || step === 'finish') && !hasResult)) && (
          <MakeScreen
            templateId={templateId}
            protagonistId={protagonistId}
            subjectId={subjectId}
            moodId={moodId}
            keyword={keyword}
            remaining={remaining}
            onChange={(p) => {
              if (p.templateId !== undefined) setTemplateId(p.templateId);
              if (p.protagonistId !== undefined) setProtagonistId(p.protagonistId);
              if (p.subjectId !== undefined) setSubjectId(p.subjectId);
              if (p.moodId !== undefined) setMoodId(p.moodId);
              if (p.keyword !== undefined) setKeyword(p.keyword);
            }}
            onGenerated={(r, rem, n) => {
              setResult(r);
              if (rem !== null) setRemaining(rem);
              setNotice(n);
              go('result');
            }}
          />
        )}

        {step === 'result' && hasResult && (
          <ResultScreen
            template={template!}
            subjectLabel={subjectLabel}
            result={result!}
            notice={notice}
            onRemake={() => go('make')}
            onNext={() => go('finish')}
          />
        )}

        {step === 'finish' && hasResult && (
          <FinishScreen template={template!} result={result!} onBack={() => go('result')} onRestart={restart} />
        )}
      </main>

      <QRCodeModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default App;
