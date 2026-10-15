/**
 * 휴대폰 브라우저 안에서 'AI 영상 + 자막 3줄'을 하나의 쇼츠 파일로 만듭니다.
 * 영상을 캔버스에 그리면서 자막을 얹고, 그 화면과 영상 소리를 함께 녹화하는 방식이에요.
 * (영상 길이만큼 실시간으로 걸립니다: 약 10~12초)
 */

const W = 720;
const H = 1280;

export interface ComposeResult {
  blob: Blob;
  ext: 'mp4' | 'webm';
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
  return candidates.find((m) => {
    try {
      return MediaRecorder.isTypeSupported(m);
    } catch {
      return false;
    }
  }) ?? null;
}

export function canCompose(): boolean {
  return (
    typeof document !== 'undefined' &&
    !!pickMime() &&
    typeof (HTMLCanvasElement.prototype as { captureStream?: unknown }).captureStream === 'function'
  );
}

/** 현재 시간에 보여 줄 자막 번호 (영상 길이를 3등분) */
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
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  // 한 단어가 너무 길면 글자 단위로 자르기
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

const CAPTION_FONT = '800 54px "Black Han Sans", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
const BADGE_FONT = '700 24px "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';

function drawFrame(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, caption: string) {
  // 영상: 화면을 꽉 채우도록(cover)
  const vw = video.videoWidth || W;
  const vh = video.videoHeight || H;
  const scale = Math.max(W / vw, H / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);

  // 자막: 아래쪽 1/4 지점, 반투명 상자
  if (caption) {
    ctx.font = CAPTION_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = wrapLines(ctx, caption, W - 140);
    const lineH = 70;
    const boxH = lines.length * lineH + 36;
    const boxW = Math.min(W - 60, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64);
    const cy = H * 0.76;
    ctx.fillStyle = 'rgba(10, 10, 25, 0.62)';
    roundRect(ctx, (W - boxW) / 2, cy - boxH / 2, boxW, boxH, 22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    lines.forEach((l, i) => {
      ctx.fillText(l, W / 2, cy - ((lines.length - 1) * lineH) / 2 + i * lineH);
    });
  }

  // AI 생성 표시 (오른쪽 위)
  ctx.font = BADGE_FONT;
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

/**
 * 반드시 버튼을 누른 순간(사용자 동작 안)에 호출하세요.
 * 휴대폰은 소리 있는 영상 재생과 오디오 처리를 사용자 동작이 있을 때만 허락합니다.
 */
export function composeShorts(
  videoUrl: string,
  captions: readonly string[],
  onProgress: (ratio: number) => void,
): Promise<ComposeResult> {
  const mime = pickMime();
  if (!mime) return Promise.reject(new Error('unsupported'));

  // ---- 사용자 동작 안에서 바로 실행해야 하는 부분 ----
  const AudioCtx =
    (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
      .AudioContext ||
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
      try {
        await document.fonts?.load(CAPTION_FONT);
        await document.fonts?.load(BADGE_FONT);
      } catch {
        /* 글꼴을 못 불러와도 기본 글꼴로 진행 */
      }
      if (video.readyState < 2) {
        await new Promise<void>((resolve, reject) => {
          video.addEventListener('loadeddata', () => resolve(), { once: true });
          video.addEventListener('error', () => reject(new Error('video_error')), { once: true });
        });
      }
      video.currentTime = 0;
      await new Promise<void>((resolve) => {
        if (video.currentTime === 0 && !video.seeking) return resolve();
        video.addEventListener('seeked', () => resolve(), { once: true });
      });

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');
      const duration = video.duration;
      drawFrame(ctx, video, captions[0] || '');

      const stream = (canvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(30);
      audioDest?.stream.getAudioTracks().forEach((t) => stream.addTrack(t));

      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));

      let raf = 0;
      const loop = () => {
        drawFrame(ctx, video, captions[captionIndexAt(video.currentTime, duration)] || '');
        onProgress(duration ? Math.min(1, video.currentTime / duration) : 0);
        if (!video.ended) raf = requestAnimationFrame(loop);
      };

      recorder.start(250);
      await video.play();
      raf = requestAnimationFrame(loop);
      await new Promise<void>((resolve) => video.addEventListener('ended', () => resolve(), { once: true }));
      cancelAnimationFrame(raf);
      drawFrame(ctx, video, captions[2] || '');
      await new Promise((r) => setTimeout(r, 120));
      recorder.stop();
      await stopped;
      onProgress(1);

      const type = mime.split(';')[0];
      return { blob: new Blob(chunks, { type }), ext: type === 'video/mp4' ? 'mp4' : 'webm' };
    } finally {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
        await audioCtx?.close();
      } catch {
        /* 무시 */
      }
    }
  })();
}
