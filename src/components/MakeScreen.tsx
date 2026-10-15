import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { TEMPLATES, MOODS, getTemplate, buildFallbackResult } from '../data/templates';
import { BOOTH } from '../config/booth';
import { getSessionId } from '../services/session';
import type { GenerateResponse, MoodId, ShortsResult, TemplateId } from '../types';
import { BottomBar, Chip, PrimaryButton, SectionTitle, TemplateThumb } from './ui';

interface Props {
  templateId: TemplateId | null;
  protagonistId: string | null;
  subjectId: string | null;
  moodId: MoodId;
  keyword: string;
  remaining: number | null;
  onChange: (patch: {
    templateId?: TemplateId;
    protagonistId?: string | null;
    subjectId?: string | null; moodId?: MoodId; keyword?: string }) => void;
  onGenerated: (result: ShortsResult, remaining: number | null, notice: string | null) => void;
}

export const MakeScreen: React.FC<Props> = ({
  templateId,
  protagonistId,
  subjectId,
  moodId,
  keyword,
  remaining,
  onChange,
  onGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const template = getTemplate(templateId || undefined);
  const needsProtagonist = !!template?.protagonists?.length;
  const ready = !!template && !!subjectId && (!needsProtagonist || !!protagonistId);

  const generate = async () => {
    if (!template || !subjectId || !ready) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          templateId: template.id,
          protagonistId,
          subjectId,
          moodId,
          keyword: keyword.trim(),
        }),
      });
      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as GenerateResponse;
        setError(body.error || '지금 만드는 중이에요. 잠시만 기다려 주세요.');
        return;
      }
      const body = (await res.json()) as GenerateResponse;
      if (body.success && body.data) {
        onGenerated(body.data, body.remaining ?? null, body.notice ?? null);
        return;
      }
      throw new Error(body.error || 'BAD_RESPONSE');
    } catch {
      // 서버에 닿지 않아도 체험은 이어갑니다
      onGenerated(buildFallbackResult(template, subjectId, keyword, protagonistId), remaining, '인터넷 연결이 불안정해 준비된 문구로 보여드려요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">어떤 쇼츠를 만들까요?</h2>
      <p className="mt-2 text-[14px] text-muted">템플릿을 하나 골라 주세요.</p>

      <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="쇼츠 템플릿">
        {TEMPLATES.map((t) => {
          const selected = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                t.id !== templateId && onChange({ templateId: t.id, protagonistId: null, subjectId: null })
              }
              className="text-left"
            >
              <div
                className={`relative rounded-[20px] p-1 transition-colors ${selected ? 'bg-rec' : 'bg-transparent'}`}
              >
                <TemplateThumb template={t} />
                {selected && (
                  <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-rec text-white ring-2 ring-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="mt-2 px-1">
                <div className="text-[15px] font-bold leading-tight">{t.title}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-muted">{t.oneLiner}</div>
              </div>
            </button>
          );
        })}
      </div>

      {template && (
        <div key={template.id} className="rise mt-10 space-y-8">
          {template.protagonists && (
            <section>
              <SectionTitle>{template.protagonistQuestion || '주인공은?'}</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {template.protagonists.map((p) => (
                  <Chip key={p.id} selected={p.id === protagonistId} onClick={() => onChange({ protagonistId: p.id })}>
                    {p.label}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle>{template.subjectQuestion}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {template.subjects.map((s) => (
                <Chip key={s.id} selected={s.id === subjectId} onClick={() => onChange({ subjectId: s.id })}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>자막 분위기</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={m.id} selected={m.id === moodId} onClick={() => onChange({ moodId: m.id })}>
                  {m.label}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle hint="선택">자막에 넣고 싶은 말</SectionTitle>
            <input
              type="text"
              value={keyword}
              maxLength={30}
              onChange={(e) => onChange({ keyword: e.target.value.slice(0, 30) })}
              placeholder={template.keywordPlaceholder}
              className="w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] placeholder:text-muted/60 focus:border-ink focus:outline-none"
            />
          </section>
        </div>
      )}

      <BottomBar>
        {error && <p className="mb-2 text-center text-[13px] font-semibold text-rec">{error}</p>}
        <PrimaryButton onClick={generate} disabled={!ready || loading}>
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              자막 만드는 중
            </>
          ) : !template ? (
            '템플릿을 골라 주세요'
          ) : needsProtagonist && !protagonistId ? (
            '주인공을 골라 주세요'
          ) : !subjectId ? (
            template.subjectRole === 'theme' ? '방송 주제를 골라 주세요' : '주인공을 골라 주세요'
          ) : (
            '내 자막 만들기'
          )}
        </PrimaryButton>
        <p className="mt-2 text-center text-[12px] text-muted">
          AI 생성 {remaining ?? BOOTH.maxGenerations}회 남음
        </p>
      </BottomBar>
    </div>
  );
};
