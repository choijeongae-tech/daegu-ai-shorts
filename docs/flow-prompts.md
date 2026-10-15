# 구글 Flow 영상 프롬프트 (23개)

각 프롬프트를 Flow에 그대로 붙여 넣어 영상을 만든 뒤, 해당 캔바 템플릿 사본에 넣어 주세요.
영상에 영어 말소리가 섞여 나오면 다시 생성하세요. (대사가 있는 템플릿은 한국어 대사만, 나머지는 대사 없이 만들도록 지정돼 있어요)
캔바 사본 링크는 `src/data/templates.ts`에서 표의 "캔바 링크 넣을 곳"에 넣으면 됩니다.

| 확인 | 템플릿 | 주인공 | 파일 이름 제안 | 캔바 링크 넣을 곳 |
|---|---|---|---|---|
| ☐ | 반려동물 크리에이터 | 강아지 | pet-creator_dog.mp4 | `pet-creator` → `dog` → canvaUrl |
| ☐ | 반려동물 크리에이터 | 고양이 | pet-creator_cat.mp4 | `pet-creator` → `cat` → canvaUrl |
| ☐ | 반려동물 크리에이터 | 햄스터 | pet-creator_hamster.mp4 | `pet-creator` → `hamster` → canvaUrl |
| ☐ | 반려동물 크리에이터 | 토끼 | pet-creator_rabbit.mp4 | `pet-creator` → `rabbit` → canvaUrl |
| ☐ | 반려동물 크리에이터 | 거북이 | pet-creator_turtle.mp4 | `pet-creator` → `turtle` → canvaUrl |
| ☐ | 크리에이터 첫 방송 | 남성 · 준호 / 게임 방송 | creator-junho_male_game.mp4 | `creator-junho` → `game` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 남성 · 준호 / 먹방 | creator-junho_male_mukbang.mp4 | `creator-junho` → `mukbang` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 남성 · 준호 / 여행 브이로그 | creator-junho_male_travel.mp4 | `creator-junho` → `travel` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 남성 · 준호 / 음악 방송 | creator-junho_male_music.mp4 | `creator-junho` → `music` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 여성 · 하은 / 게임 방송 | creator-junho_female_game.mp4 | `creator-junho` → `game` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 여성 · 하은 / 먹방 | creator-junho_female_mukbang.mp4 | `creator-junho` → `mukbang` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 여성 · 하은 / 여행 브이로그 | creator-junho_female_travel.mp4 | `creator-junho` → `travel` → canvaUrl (주인공 공통) |
| ☐ | 크리에이터 첫 방송 | 여성 · 하은 / 음악 방송 | creator-junho_female_music.mp4 | `creator-junho` → `music` → canvaUrl (주인공 공통) |
| ☐ | 레트로 아케이드 게임 | 고양이 기사 | retro-arcade_cat-knight.mp4 | `retro-arcade` → `cat-knight` → canvaUrl |
| ☐ | 레트로 아케이드 게임 | 로봇 히어로 | retro-arcade_robot.mp4 | `retro-arcade` → `robot` → canvaUrl |
| ☐ | 레트로 아케이드 게임 | 우주 탐험가 | retro-arcade_astronaut.mp4 | `retro-arcade` → `astronaut` → canvaUrl |
| ☐ | 레트로 아케이드 게임 | 꼬마 마법사 | retro-arcade_wizard.mp4 | `retro-arcade` → `wizard` → canvaUrl |
| ☐ | 레트로 아케이드 게임 | 강아지 기사 | retro-arcade_dog-knight.mp4 | `retro-arcade` → `dog-knight` → canvaUrl |
| ☐ | 레트로 아케이드 게임 | 쿼카 기사 | retro-arcade_quokka-knight.mp4 | `retro-arcade` → `quokka-knight` → canvaUrl |
| ☐ | 콘텐츠페어 방문 후기 | 20대 청년 | fair-review_twenties.mp4 | `fair-review` → `twenties` → canvaUrl |
| ☐ | 콘텐츠페어 방문 후기 | 10대 학생 | fair-review_student.mp4 | `fair-review` → `student` → canvaUrl |
| ☐ | 콘텐츠페어 방문 후기 | 친구 둘 | fair-review_friends.mp4 | `fair-review` → `friends` → canvaUrl |
| ☐ | 콘텐츠페어 방문 후기 | 가족 | fair-review_family.mp4 | `fair-review` → `family` → canvaUrl |

## 반려동물 크리에이터

장면: 작은 링라이트 앞에 앉은 반려동물이 고개를 갸웃하다 앞발로 녹화 버튼을 톡 누르는 장면

소리: 대사 없이 음악·효과음만

### 강아지  (`pet-creator_dog.mp4`)

```
Vertical 9:16 video. Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood. Main character: a fluffy small dog with bright eyes. The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel. Audio: no dialogue, no narration, no singing, no voice of any kind. Only cute pet sounds and soft, cheerful background music. No on-screen text, no subtitles, no logos.
```

### 고양이  (`pet-creator_cat.mp4`)

```
Vertical 9:16 video. Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood. Main character: a curious cat with soft fur. The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel. Audio: no dialogue, no narration, no singing, no voice of any kind. Only cute pet sounds and soft, cheerful background music. No on-screen text, no subtitles, no logos.
```

### 햄스터  (`pet-creator_hamster.mp4`)

```
Vertical 9:16 video. Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood. Main character: a tiny round hamster. The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel. Audio: no dialogue, no narration, no singing, no voice of any kind. Only cute pet sounds and soft, cheerful background music. No on-screen text, no subtitles, no logos.
```

### 토끼  (`pet-creator_rabbit.mp4`)

```
Vertical 9:16 video. Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood. Main character: a fluffy rabbit with long ears. The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel. Audio: no dialogue, no narration, no singing, no voice of any kind. Only cute pet sounds and soft, cheerful background music. No on-screen text, no subtitles, no logos.
```

### 거북이  (`pet-creator_turtle.mp4`)

```
Vertical 9:16 video. Bright and cozy home vlog look, soft natural window light, shallow depth of field, cute and playful mood. Main character: a turtle with long neck. The pet sits in front of a tiny ring light and a smartphone on a mini tripod, tilts its head at the camera, then playfully taps the screen with a paw as if pressing record. Slow push-in, handheld vlog feel. Audio: no dialogue, no narration, no singing, no voice of any kind. Only cute pet sounds and soft, cheerful background music. No on-screen text, no subtitles, no logos.
```

## 크리에이터 첫 방송

장면: 크리에이터가 책상에 앉아 헤드폰을 쓰고, 뒤에 ON AIR 불이 켜지자 카메라에 손을 흔드는 장면

소리: 주인공·주제마다 다른 한국어 대사 (아래 각 프롬프트 참고)

### 남성 · 준호 · 게임 방송  (`creator-junho_male_game.mp4`)

- 대사: 안녕하세요, 준호입니다! 첫 게임 방송 시작할게요!
- 기본 자막: 신인 크리에이터 준호, 첫 방송 ON! / 오늘은 내가 좋아하는 게임 이야기 / 구독하고 다음 판도 같이 해요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Junho, a friendly Korean man in his early 20s with short black hair, wearing a casual hoodie. The video is a live game stream, wearing a gaming headset with a controller in hand. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 준호입니다! 첫 게임 방송 시작할게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 남성 · 준호 · 먹방  (`creator-junho_male_mukbang.mp4`)

- 대사: 안녕하세요, 준호입니다! 오늘은 떡볶이 먹방이에요!
- 기본 자막: 준호의 첫 먹방, 지금 시작! / 매콤한 떡볶이 한 입에 텐션 업 / 맛있게 먹는 것도 콘텐츠예요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Junho, a friendly Korean man in his early 20s with short black hair, wearing a casual hoodie. The video is a mukbang, tasting spicy tteokbokki and Korean street food at the desk. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 준호입니다! 오늘은 떡볶이 먹방이에요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 남성 · 준호 · 여행 브이로그  (`creator-junho_male_travel.mp4`)

- 대사: 안녕하세요, 준호입니다! 첫 여행 이야기 들려드릴게요!
- 기본 자막: 준호의 여행 채널 첫 방송! / 지도 한 장, 카메라 하나면 준비 끝 / 다음 여행지는 댓글로 알려 주세요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Junho, a friendly Korean man in his early 20s with short black hair, wearing a casual hoodie. The video is a travel vlog show, holding a small camera and a paper map, with colorful travel photos pinned on the wall. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 준호입니다! 첫 여행 이야기 들려드릴게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 남성 · 준호 · 음악 방송  (`creator-junho_male_music.mp4`)

- 대사: 안녕하세요, 준호입니다! 첫 음악 방송 시작할게요!
- 기본 자막: 준호의 첫 음악 방송, ON AIR! / 좋아하는 음악을 나누는 시간 / 다음 곡 신청은 댓글로 받아요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Junho, a friendly Korean man in his early 20s with short black hair, wearing a casual hoodie. The video is a music show, standing at a studio microphone with a guitar. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 준호입니다! 첫 음악 방송 시작할게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 여성 · 하은 · 게임 방송  (`creator-junho_female_game.mp4`)

- 대사: 안녕하세요, 하은입니다! 첫 게임 방송 시작할게요!
- 기본 자막: 신인 크리에이터 하은, 첫 방송 ON! / 오늘은 내가 좋아하는 게임 이야기 / 구독하고 다음 판도 같이 해요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Haeun, a friendly Korean woman in her early 20s with shoulder-length black hair, wearing a casual hoodie. The video is a live game stream, wearing a gaming headset with a controller in hand. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 하은입니다! 첫 게임 방송 시작할게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 여성 · 하은 · 먹방  (`creator-junho_female_mukbang.mp4`)

- 대사: 안녕하세요, 하은입니다! 오늘은 떡볶이 먹방이에요!
- 기본 자막: 하은의 첫 먹방, 지금 시작! / 매콤한 떡볶이 한 입에 텐션 업 / 맛있게 먹는 것도 콘텐츠예요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Haeun, a friendly Korean woman in her early 20s with shoulder-length black hair, wearing a casual hoodie. The video is a mukbang, tasting spicy tteokbokki and Korean street food at the desk. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 하은입니다! 오늘은 떡볶이 먹방이에요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 여성 · 하은 · 여행 브이로그  (`creator-junho_female_travel.mp4`)

- 대사: 안녕하세요, 하은입니다! 첫 여행 이야기 들려드릴게요!
- 기본 자막: 하은의 여행 채널 첫 방송! / 지도 한 장, 카메라 하나면 준비 끝 / 다음 여행지는 댓글로 알려 주세요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Haeun, a friendly Korean woman in her early 20s with shoulder-length black hair, wearing a casual hoodie. The video is a travel vlog show, holding a small camera and a paper map, with colorful travel photos pinned on the wall. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 하은입니다! 첫 여행 이야기 들려드릴게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

### 여성 · 하은 · 음악 방송  (`creator-junho_female_music.mp4`)

- 대사: 안녕하세요, 하은입니다! 첫 음악 방송 시작할게요!
- 기본 자막: 하은의 첫 음악 방송, ON AIR! / 좋아하는 음악을 나누는 시간 / 다음 곡 신청은 댓글로 받아요!

```
Vertical 9:16 video. Modern broadcast studio in a community media center, a red ON AIR light glowing, colorful LED panels, crisp cinematic lighting. Main character: Haeun, a friendly Korean woman in her early 20s with shoulder-length black hair, wearing a casual hoodie. The video is a music show, standing at a studio microphone with a guitar. The creator sits down at the desk, puts on headphones, smiles at the camera as the ON AIR light turns on in the background, then waves to the viewers. Smooth dolly-in. Audio: the person on screen says in Korean, "안녕하세요, 하은입니다! 첫 음악 방송 시작할게요!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: light upbeat studio background music. No on-screen text, no subtitles, no logos.
```

## 레트로 아케이드 게임

장면: 캐릭터가 발판을 뛰어넘으며 금화와 별을 모으고, 픽셀 불꽃놀이 속에서 승리 포즈를 취하는 장면

소리: 대사 없이 음악·효과음만

### 고양이 기사  (`retro-arcade_cat-knight.mp4`)

```
Vertical 9:16 video. 16-bit retro pixel art video game, side-scrolling arcade stage, chunky pixels, vivid CRT colors. Main character: a brave cat knight with a tiny sword. The character jumps across floating platforms, collects spinning gold coins and a glowing star, then strikes a victory pose as pixel fireworks burst in the sky. Side-scrolling camera. Audio: no dialogue, no narration, no singing, no voice of any kind. Only 8-bit chiptune game music, coin and jump sound effects. No on-screen text, no subtitles, no logos.
```

### 로봇 히어로  (`retro-arcade_robot.mp4`)

```
Vertical 9:16 video. 16-bit retro pixel art video game, side-scrolling arcade stage, chunky pixels, vivid CRT colors. Main character: a small round robot hero with glowing eyes. The character jumps across floating platforms, collects spinning gold coins and a glowing star, then strikes a victory pose as pixel fireworks burst in the sky. Side-scrolling camera. Audio: no dialogue, no narration, no singing, no voice of any kind. Only 8-bit chiptune game music, coin and jump sound effects. No on-screen text, no subtitles, no logos.
```

### 우주 탐험가  (`retro-arcade_astronaut.mp4`)

```
Vertical 9:16 video. 16-bit retro pixel art video game, side-scrolling arcade stage, chunky pixels, vivid CRT colors. Main character: a little astronaut explorer in a white suit. The character jumps across floating platforms, collects spinning gold coins and a glowing star, then strikes a victory pose as pixel fireworks burst in the sky. Side-scrolling camera. Audio: no dialogue, no narration, no singing, no voice of any kind. Only 8-bit chiptune game music, coin and jump sound effects. No on-screen text, no subtitles, no logos.
```

### 꼬마 마법사  (`retro-arcade_wizard.mp4`)

```
Vertical 9:16 video. 16-bit retro pixel art video game, side-scrolling arcade stage, chunky pixels, vivid CRT colors. Main character: a young wizard with a glowing star staff. The character jumps across floating platforms, collects spinning gold coins and a glowing star, then strikes a victory pose as pixel fireworks burst in the sky. Side-scrolling camera. Audio: no dialogue, no narration, no singing, no voice of any kind. Only 8-bit chiptune game music, coin and jump sound effects. No on-screen text, no subtitles, no logos.
```

### 강아지 기사  (`retro-arcade_dog-knight.mp4`)

```
PIXEL QUEST 12초짜리 미션 수행형 레트로 픽셀 게임 영상.영상 기본 설정: 세로형 1080×1920px 총 12초 3장면, 각 4초16비트 레트로 게임 스타일네온 퍼플, 코발트블루, 픽셀 그린 게임 시작 및 아이템 획득 효과음 포함SCENE 01: GAME START (0~4초)픽셀 게임 도시 배경PLAYER 1 LOGIN게임 로딩바콘텐츠 큐브 3개 수집 미션. 캐릭터 등장hookSCENE 02: QUEST ACTION (4~8초). 첨부된 캐릭터가 픽셀 큐브 3개를 순차적으로 획득하는 애니메이션. 진행바 0/3 → 1/3 → 2/3 → 3/3+100 점수 팝업, 획득 반짝임, 점프 효과SCENE 03: MISSION CLEAR (8~12초)MISSION CLEAR 타이틀LEVEL UP 그래픽픽셀 폭죽과 트로피callToAction. 텍스트 편집 영역. 2026 대구 콘텐츠페어 표기(한글 오타 주의)
```

### 쿼카 기사  (`retro-arcade_quokka-knight.mp4`)

```
PIXEL QUEST 12초짜리 미션 수행형 레트로 픽셀 게임 영상.영상 기본 설정: 세로형 1080×1920px 총 12초 3장면, 각 4초16비트 레트로 게임 스타일네온 퍼플, 코발트블루, 픽셀 그린 게임 시작 및 아이템 획득 효과음 포함SCENE 01: GAME START (0~4초)픽셀 게임 도시 배경PLAYER 1 LOGIN게임 로딩바콘텐츠 큐브 3개 수집 미션. 캐릭터 등장hookSCENE 02: QUEST ACTION (4~8초). 첨부된 캐릭터가 픽셀 큐브 3개를 순차적으로 획득하는 애니메이션. 진행바 0/3 → 1/3 → 2/3 → 3/3+100 점수 팝업, 획득 반짝임, 점프 효과SCENE 03: MISSION CLEAR (8~12초)MISSION CLEAR 타이틀LEVEL UP 그래픽픽셀 폭죽과 트로피callToAction. 텍스트 편집 영역. 2026 대구 콘텐츠페어 표기(한글 오타 주의)
```

## 콘텐츠페어 방문 후기

장면: 전시장을 둘러보다 체험 부스에 들러 직접 해 보고, 카메라를 보며 엄지를 드는 장면

소리: 한국어 대사 "와, 대구 콘텐츠페어 진짜 재밌다!"

### 20대 청년  (`fair-review_twenties.mp4`)

- 대사: 와, 대구 콘텐츠페어 진짜 재밌다!

```
Vertical 9:16 video. Bright, cheerful vlog-style video inside a large modern convention hall at a fictional content festival, colorful creative booths, friendly crowd, handheld gimbal shot. Main character: a Korean woman in her 20s holding a small camera. They walk through the hall looking around excitedly, stop at a booth to try a hands-on experience, then turn to the camera with a big thumbs up. Gimbal tracking shot. Audio: the person on screen says in Korean, "와, 대구 콘텐츠페어 진짜 재밌다!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: lively exhibition hall ambience and upbeat background music. No on-screen text, no subtitles, no logos.
```

### 10대 학생  (`fair-review_student.mp4`)

- 대사: 와, 대구 콘텐츠페어 진짜 재밌다!

```
Vertical 9:16 video. Bright, cheerful vlog-style video inside a large modern convention hall at a fictional content festival, colorful creative booths, friendly crowd, handheld gimbal shot. Main character: a cheerful Korean teenage student in a hoodie. They walk through the hall looking around excitedly, stop at a booth to try a hands-on experience, then turn to the camera with a big thumbs up. Gimbal tracking shot. Audio: the person on screen says in Korean, "와, 대구 콘텐츠페어 진짜 재밌다!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: lively exhibition hall ambience and upbeat background music. No on-screen text, no subtitles, no logos.
```

### 친구 둘  (`fair-review_friends.mp4`)

- 대사: 와, 대구 콘텐츠페어 진짜 재밌다!

```
Vertical 9:16 video. Bright, cheerful vlog-style video inside a large modern convention hall at a fictional content festival, colorful creative booths, friendly crowd, handheld gimbal shot. Main character: two Korean friends in their 20s. They walk through the hall looking around excitedly, stop at a booth to try a hands-on experience, then turn to the camera with a big thumbs up. Gimbal tracking shot. Audio: the person on screen says in Korean, "와, 대구 콘텐츠페어 진짜 재밌다!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: lively exhibition hall ambience and upbeat background music. No on-screen text, no subtitles, no logos.
```

### 가족  (`fair-review_family.mp4`)

- 대사: 와, 대구 콘텐츠페어 진짜 재밌다!

```
Vertical 9:16 video. Bright, cheerful vlog-style video inside a large modern convention hall at a fictional content festival, colorful creative booths, friendly crowd, handheld gimbal shot. Main character: a Korean family of three. They walk through the hall looking around excitedly, stop at a booth to try a hands-on experience, then turn to the camera with a big thumbs up. Gimbal tracking shot. Audio: the person on screen says in Korean, "와, 대구 콘텐츠페어 진짜 재밌다!" Spoken language is Korean only, natural native Korean pronunciation; no English speech, no narration. Background: lively exhibition hall ambience and upbeat background music. No on-screen text, no subtitles, no logos.
```
