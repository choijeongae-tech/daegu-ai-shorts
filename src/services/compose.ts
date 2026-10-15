/**
 * 휴대폰 브라우저 안에서 '닉네임 첫 장면 + AI 영상 + 자막 3줄 + 하단 로고'를 하나의 쇼츠 파일로 만듭니다.
 * 캔버스에 화면을 그리면서 녹화하는 방식이라, 완성 영상 길이만큼(7~12초) 실시간으로 걸려요.
 *
 * 화면 배치 (720×1280)
 *   - 위 36~80px: 'AI로 만든 영상' 표시
 *   - 가운데 아래(세로 66% 지점): 자막 상자
 *   - 맨 아래 64px 띄우고: 대구1인미디어센터 로고  ← 자막 상자 바닥과 최소 100px 떨어지도록 배치
 */

export const W = 720;
export const H = 1280;
export const INTRO_SECONDS = 2;
export const MIN_SECONDS = 7;
export const MAX_SECONDS = 12;

/** 자막 상자 중심 높이 (화면 위에서부터 비율) — 미리보기도 같은 값을 씁니다 */
export const CAPTION_CENTER = 0.66;
/** 로고 영역: 아래에서 64px 띄우고 높이 72px */
const LOGO_BOTTOM = 64;
const LOGO_MAX_H = 72;
const LOGO_MAX_W = 380;

export interface ComposeResult {
  blob: Blob;
  ext: 'mp4' | 'webm';
  seconds: number;
}

function pickMime(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1,mp4a',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  return (
    candidates.find((m) => {
      try {
        return MediaRecorder.isTypeSupported(m);
      } catch {
        return false;
      }
    }) ?? null
  );
}

export function canCompose(): boolean {
  return (
    typeof document !== 'undefined' &&
    !!pickMime() &&
    typeof (HTMLCanvasElement.prototype as { captureStream?: unknown }).captureStream === 'function'
  );
}

/** 완성 영상 전체 길이 (첫 장면 2초 + 영상, 7~12초) */
export function totalSeconds(videoDuration: number): number {
  const d = isFinite(videoDuration) && videoDuration > 0 ? videoDuration : 8;
  return Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, INTRO_SECONDS + d));
}

/** 영상 구간에서 지금 보여 줄 자막 번호 (영상 구간을 3등분) */
export function captionIndexAt(time: number, duration: number): number {
  if (!duration || !isFinite(duration)) return 0;
  return Math.min(2, Math.max(0, Math.floor((time / duration) * 3)));
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width <= maxWidth || !line) line = next;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines.flatMap((l) => {
    if (ctx.measureText(l).width <= maxWidth) return [l];
    const out: string[] = [];
    let cur = '';
    for (const ch of Array.from(l)) {
      if (ctx.measureText(cur + ch).width > maxWidth && cur) {
        out.push(cur);
        cur = ch;
      } else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const DISPLAY = '"Black Han Sans", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
const SANS = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
const CAPTION_FONT = `800 54px ${DISPLAY}`;

function drawVideo(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  const vw = video.videoWidth || W;
  const vh = video.videoHeight || H;
  const scale = Math.max(W / vw, H / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  try {
    ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } catch {
    /* 아직 그릴 프레임이 없음 */
  }
}

function drawCaption(ctx: CanvasRenderingContext2D, caption: string) {
  if (!caption) return;
  ctx.font = CAPTION_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lines = wrapLines(ctx, caption, W - 140).slice(0, 3);
  const lineH = 70;
  const boxH = lines.length * lineH + 36;
  const boxW = Math.min(W - 60, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64);
  const cy = H * CAPTION_CENTER;
  ctx.fillStyle = 'rgba(10, 10, 25, 0.62)';
  roundRect(ctx, (W - boxW) / 2, cy - boxH / 2, boxW, boxH, 22);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, cy - ((lines.length - 1) * lineH) / 2 + i * lineH));
}

function drawBadge(ctx: CanvasRenderingContext2D) {
  ctx.font = `700 24px ${SANS}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const badge = 'AI로 만든 영상';
  const bw = ctx.measureText(badge).width + 32;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  roundRect(ctx, W - 30 - bw, 36, bw, 44, 22);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badge, W - 46, 58);
}

function drawLogo(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null) {
  // 로고 뒤를 살짝 어둡게 해서 어떤 영상 위에서도 잘 보이게
  const grad = ctx.createLinearGradient(0, H - 220, 0, H);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 220, W, 220);

  if (logo && logo.naturalWidth) {
    const s = Math.min(LOGO_MAX_W / logo.naturalWidth, LOGO_MAX_H / logo.naturalHeight);
    const lw = logo.naturalWidth * s;
    const lh = logo.naturalHeight * s;
    ctx.drawImage(logo, (W - lw) / 2, H - LOGO_BOTTOM - lh, lw, lh);
    return;
  }
  // 로고 파일(public/logo.png)이 없을 때: 글자로 표시
  ctx.font = `800 30px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('대구1인미디어센터', W / 2, H - LOGO_BOTTOM - 22);
}

function drawIntro(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, name: string, subtitle: string, t: number) {
  drawVideo(ctx, video);
  ctx.fillStyle = 'rgba(12, 12, 30, 0.72)';
  ctx.fillRect(0, 0, W, H);
  const fade = Math.min(1, t / 0.4);
  ctx.globalAlpha = fade;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#e8293a';
  ctx.font = `800 30px ${SANS}`;
  ctx.fillText('2026 대구 콘텐츠페어', W / 2, H * 0.36);
  ctx.fillStyle = '#ffffff';
  ctx.font = `400 96px ${DISPLAY}`;
  const title = name ? `${name}의 쇼츠` : '나의 AI 쇼츠';
  const lines = wrapLines(ctx, title, W - 120).slice(0, 2);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, H * 0.45 + i * 110));
  ctx.font = `600 32px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(subtitle, W / 2, H * 0.45 + lines.length * 110 + 10);
  ctx.globalAlpha = 1;
}

function loadLogo(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'logo.png';
  });
}

export interface ComposeOptions {
  videoUrl: string;
  captions: readonly string[];
  name: string;
  subtitle: string;
  onProgress: (ratio: number) => void;
}

/**
 * 반드시 버튼을 누른 순간(사용자 동작 안)에 호출하세요.
 * 휴대폰은 소리 있는 영상 재생과 오디오 처리를 사용자 동작이 있을 때만 허락합니다.
 */
export function composeShorts({ videoUrl, captions, name, subtitle, onProgress }: ComposeOptions): Promise<ComposeResult> {
  const mime = pickMime();
  if (!mime) return Promise.reject(new Error('unsupported'));

  // ---- 사용자 동작 안에서 바로 실행해야 하는 부분 ----
  const AudioCtx =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  let audioCtx: AudioContext | null = null;
  try {
    audioCtx = AudioCtx ? new AudioCtx() : null;
    void audioCtx?.resume();
  } catch {
    audioCtx = null;
  }
  const video = document.createElement('video');
  video.src = videoUrl;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'auto';
  // 화면 밖에 붙여 두기: 문서에 없는 영상은 휴대폰이 재생을 멈추는 경우가 있어요
  video.style.cssText = 'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
  document.body.appendChild(video);
  const unlock = video.play().catch(() => undefined);

  let audioDest: MediaStreamAudioDestinationNode | null = null;
  try {
    if (audioCtx) {
      const src = audioCtx.createMediaElementSource(video);
      audioDest = audioCtx.createMediaStreamDestination();
      src.connect(audioDest); // 스피커로는 내보내지 않음 (만드는 동안 조용히)
    }
  } catch {
    audioDest = null;
  }
  // ----------------------------------------------------

  return (async () => {
    try {
      await unlock;
      video.pause();
      const [logo] = await Promise.all([
        loadLogo(),
        document.fonts?.load(CAPTION_FONT).catch(() => undefined),
        document.fonts?.load(`400 96px ${DISPLAY}`).catch(() => undefined),
      ]);
      if (video.readyState < 2) {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('video_timeout')), 15000);
          video.addEventListener('loadeddata', () => (clearTimeout(timer), resolve()), { once: true });
          video.addEventListener('error', () => (clearTimeout(timer), reject(new Error('video_error'))), { once: true });
        });
      }
      video.currentTime = 0;
      await new Promise<void>((resolve) => {
        if (!video.seeking) return resolve();
        video.addEventListener('seeked', () => resolve(), { once: true });
      });

      const total = totalSeconds(video.duration);
      const videoPhase = total - INTRO_SECONDS;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');
      drawIntro(ctx, video, name, subtitle, 0);
      drawLogo(ctx, logo);

      const stream = (canvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(30);
      audioDest?.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));

      // 시간은 영상이 아니라 앱의 시계로 잽니다 → 영상이 짧거나 멈춰도 정해진 길이만큼 녹화
      recorder.start();
      const t0 = performance.now();
      let playing = false;
      await new Promise<void>((resolve) => {
        const tick = () => {
          const t = (performance.now() - t0) / 1000;
          if (t >= total) return resolve();
          if (t < INTRO_SECONDS) {
            drawIntro(ctx, video, name, subtitle, t);
          } else {
            if (!playing) {
              playing = true;
              void video.play().catch(() => undefined);
            } else if (video.paused && !video.ended) {
              void video.play().catch(() => undefined);
            }
            const vt = t - INTRO_SECONDS;
            drawVideo(ctx, video); // 영상이 먼저 끝나면 마지막 장면이 그대로 남아요
            drawCaption(ctx, captions[captionIndexAt(vt, videoPhase)] || '');
            drawBadge(ctx);
          }
          drawLogo(ctx, logo);
          onProgress(t / total);
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      recorder.stop();
      await stopped;
      onProgress(1);

      const type = mime.split(';')[0];
      return { blob: new Blob(chunks, { type }), ext: type === 'video/mp4' ? 'mp4' : 'webm', seconds: total };
    } finally {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.remove();
        await audioCtx?.close();
      } catch {
        /* 무시 */
      }
    }
  })();
}
