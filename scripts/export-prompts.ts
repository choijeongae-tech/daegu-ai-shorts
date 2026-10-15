/**
 * 행사 전에 미리 만들 Flow 영상 16개의 프롬프트를 docs/flow-prompts.md 로 정리합니다.
 * 실행: npm run prompts
 */
import fs from 'fs';
import path from 'path';
import { TEMPLATES, buildFlowPrompt } from '../src/data/templates.ts';

const lines: string[] = [
  '# 미리 만들 구글 Flow 영상 프롬프트 (16개)',
  '',
  '각 프롬프트를 Flow에 그대로 붙여 넣어 영상을 만든 뒤, 해당 캔바 템플릿 사본에 넣어 주세요.',
  '영상에 영어 말소리가 섞여 나오면 다시 생성하세요. (대사가 있는 템플릿은 한국어 대사만, 나머지는 대사 없이 만들도록 지정돼 있어요)',
  '캔바 사본 링크는 `src/data/templates.ts`에서 같은 주인공의 `canvaUrl`에 넣으면 됩니다.',
  '',
  '| 확인 | 템플릿 | 주인공 | 파일 이름 제안 | 캔바 링크 넣을 곳 |',
  '|---|---|---|---|---|',
];

for (const t of TEMPLATES) {
  for (const s of t.subjects) {
    lines.push(`| ☐ | ${t.title} | ${s.label} | ${t.id}_${s.id}.mp4 | \`${t.id}\` → \`${s.id}\` |`);
  }
}

for (const t of TEMPLATES) {
  lines.push('', `## ${t.title}`, '', `장면: ${t.fallback.sceneKo}`, '', `소리: ${t.audio.lineKo ? `한국어 대사 "${t.audio.lineKo}"` : '대사 없이 음악·효과음만'}`);
  for (const s of t.subjects) {
    lines.push('', `### ${s.label}  (\`${t.id}_${s.id}.mp4\`)`, '', '```', buildFlowPrompt(t, s.id, t.fallback.sceneEn), '```');
  }
}

const out = path.resolve('docs/flow-prompts.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join('\n') + '\n');
console.log(`저장: ${out}`);
