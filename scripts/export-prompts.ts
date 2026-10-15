/**
 * 미리 만든 Flow 영상들의 프롬프트를 docs/flow-prompts.md 로 정리합니다.
 * 실행: npm run prompts
 */
import fs from 'fs';
import path from 'path';
import { TEMPLATES, buildFlowPrompt, getLineKo, fillName } from '../src/data/templates.ts';

const lines: string[] = [
  `# 구글 Flow 영상 프롬프트 (${TEMPLATES.reduce((n, t) => n + t.subjects.length * (t.protagonists?.length || 1), 0)}개)`,
  '',
  '각 프롬프트를 Flow에 그대로 붙여 넣어 영상을 만든 뒤, 해당 캔바 템플릿 사본에 넣어 주세요.',
  '영상에 영어 말소리가 섞여 나오면 다시 생성하세요. (대사가 있는 템플릿은 한국어 대사만, 나머지는 대사 없이 만들도록 지정돼 있어요)',
  '캔바 사본 링크는 `src/data/templates.ts`에서 표의 "캔바 링크 넣을 곳"에 넣으면 됩니다.',
  '',
  '| 확인 | 템플릿 | 주인공 | 파일 이름 제안 | 캔바 링크 넣을 곳 |',
  '|---|---|---|---|---|',
];

const combos = (t: (typeof TEMPLATES)[number]) =>
  (t.protagonists?.length ? t.protagonists : [undefined]).flatMap((p) => t.subjects.map((s) => ({ p, s })));

for (const t of TEMPLATES) {
  for (const { p, s } of combos(t)) {
    const who = p ? `${p.label} / ${s.label}` : s.label;
    const file = p ? `${t.id}_${p.id}_${s.id}.mp4` : `${t.id}_${s.id}.mp4`;
    const where = s.canvaUrlByProtagonist
      ? `\`${t.id}\` → \`${s.id}\` → canvaUrlByProtagonist.${p?.id}`
      : `\`${t.id}\` → \`${s.id}\` → canvaUrl${p ? ' (주인공 공통)' : ''}`;
    lines.push(`| ☐ | ${t.title} | ${who} | ${file} | ${where} |`);
  }
}

for (const t of TEMPLATES) {
  const sound = t.protagonists?.length
    ? '주인공·주제마다 다른 한국어 대사 (아래 각 프롬프트 참고)'
    : t.audio.lineKo
      ? `한국어 대사 "${t.audio.lineKo}"`
      : '대사 없이 음악·효과음만';
  lines.push('', `## ${t.title}`, '', `장면: ${t.fallback.sceneKo}`, '', `소리: ${sound}`);
  for (const { p, s } of combos(t)) {
    const title = p ? `${p.label} · ${s.label}` : s.label;
    const file = p ? `${t.id}_${p.id}_${s.id}.mp4` : `${t.id}_${s.id}.mp4`;
    const line = getLineKo(t, s.id, p?.id);
    const caps = s.captions?.map((c) => fillName(c, p?.nameKo));
    lines.push('', `### ${title}  (\`${file}\`)`);
    if (line) lines.push('', `- 대사: ${line}`);
    if (caps) lines.push(`- 기본 자막: ${caps.join(' / ')}`);
    lines.push('', '```', s.flowPromptOverride || buildFlowPrompt(t, s.id, t.fallback.sceneEn, p?.id), '```');
  }
}

const out = path.resolve('docs/flow-prompts.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join('\n') + '\n');
console.log(`저장: ${out}`);
