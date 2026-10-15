import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { BOOTH } from '../config/booth';
import type { ShortsResult, ShortsTemplate } from '../types';
import { BottomBar, CopyButton, PrimaryButton, SectionTitle, copyText } from './ui';

interface Props {
  template: ShortsTemplate;
  subjectLabel: string;
  result: ShortsResult;
  notice: string | null;
  onRemake: () => void;
  onNext: () => void;
}

export const ResultScreen: React.FC<Props> = ({ template, subjectLabel, result, notice, onRemake, onNext }) => {
  const [nickname, setNickname] = useState('');
  const [sent, setSent] = useState(false);
  const captionsText = result.captions.join('\n');

  const requestMessage = `[Flow 영상 요청] ${nickname.trim() || '관람객'}
템플릿: ${template.title} / ${subjectLabel}

${result.flowPrompt}`;

  // 복사는 터치 직후 바로 시작하고, 채팅방은 링크로 엽니다 (모바일 팝업 차단 방지)
  const sendToOperator = () => {
    void copyText(requestMessage);
    setSent(true);
  };

  return (
    <div className="rise">
      <h2 className="font-display text-[32px] leading-tight">자막과 프롬프트가 나왔어요</h2>
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
          <CopyButton text={captionsText} label="3줄 한꺼번에 복사" />
        </div>
      </section>

      {/* Flow 프롬프트 */}
      <section className="mt-8">
        <SectionTitle>구글 Flow 영상 프롬프트</SectionTitle>
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-[13px] font-semibold text-white/60">이런 영상이 만들어져요</p>
          <p className="mt-1 text-[16px] font-semibold leading-snug">{result.sceneKo}</p>
          <p className="mt-4 border-t border-white/15 pt-4 text-[13px] leading-relaxed text-white/75" lang="en">
            {result.flowPrompt}
          </p>
          <CopyButton
            text={result.flowPrompt}
            label="프롬프트 복사"
            doneLabel="복사됨 · Flow에 붙여 넣으세요"
            className="mt-4 w-full !bg-white !text-ink"
          />
        </div>
      </section>

      {/* 운영자에게 영상 요청 */}
      <section className="mt-8">
        <SectionTitle>영상은 부스에서 만들어 드려요</SectionTitle>
        {BOOTH.kakaoOpenChatUrl ? (
          <div className="rounded-2xl bg-surface p-4">
            <label className="text-[13px] font-semibold text-muted" htmlFor="nickname">
              오픈채팅방에서 쓸 이름
            </label>
            <input
              id="nickname"
              value={nickname}
              maxLength={12}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 민지"
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-[15px] focus:border-ink focus:outline-none"
            />
            <a
              href={BOOTH.kakaoOpenChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={sendToOperator}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3.5 text-[15px] font-bold text-[#191919] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              오픈채팅으로 영상 요청하기
            </a>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {sent
                ? '요청 내용이 복사됐어요. 채팅방 입력창을 길게 눌러 붙여 넣고 보내 주세요.'
                : '누르면 요청 내용이 복사되고 부스 채팅방이 열려요.'}
            </p>
          </div>
        ) : (
          <p className="rounded-2xl bg-surface p-4 text-[14px] leading-relaxed">
            이 화면을 부스 스태프에게 보여 주세요. Flow로 영상을 만들어 보내 드려요.
          </p>
        )}
      </section>

      <BottomBar>
        <PrimaryButton onClick={onNext}>캔바에서 완성하기</PrimaryButton>
        <button type="button" onClick={onRemake} className="mt-2 w-full py-2 text-[13px] font-semibold text-muted">
          다시 만들기
        </button>
      </BottomBar>
    </div>
  );
};
