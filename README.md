# 2026 대구 콘텐츠페어 · AI 쇼츠 스튜디오

퀴즈 3문제 → 템플릿·주인공 고르기 → 자막 3줄 + 구글 Flow 프롬프트 → 캔바 템플릿에서 완성

## 행사 전에 채울 곳
| 파일 | 항목 |
|---|---|
| `src/config/booth.ts` | 카카오톡 오픈채팅 주소, 공개 배포 주소(QR용), 만족도 조사 링크 |
| `src/data/templates.ts` | 캔바 링크, 템플릿별 주인공·장면 문구, '크리에이터 준호' 생김새 |
| `public/thumbnails/` | 썸네일 이미지 4장 (파일 이름은 폴더 안 README.txt 참고) |

## 실행
1. `npm install`
2. `.env.local`에 `GEMINI_API_KEY` 설정
3. `npm run dev`

AI 키가 없거나 AI 응답이 늦으면 템플릿별로 준비된 문구가 자동으로 나옵니다.
