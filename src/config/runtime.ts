/**
 * 게시 방식
 * - 기본(AI Studio): 서버(server.ts)가 Gemini로 자막을 만듭니다.
 * - VITE_STATIC=true (claude.ai 게시 버전): 서버 없이, 미리 써 둔 자막 세트에서 골라 보여 줍니다.
 */
export const IS_STATIC = import.meta.env.VITE_STATIC === 'true';

/** claude.ai 게시 페이지에서만 있는 다운로드 기능 (없으면 null) */
interface DownloadsApi {
  save(req: { filename: string; data: Blob }): Promise<{ status: 'saved' | 'delivered' }>;
}

export async function getDownloads(): Promise<DownloadsApi | null> {
  try {
    const c = (window as unknown as { claude?: { use?: (name: string) => Promise<unknown> } }).claude;
    if (!c?.use) return null;
    return ((await c.use('downloads')) as DownloadsApi | null) ?? null;
  } catch {
    return null;
  }
}

/** 이미지가 바뀌었을 때 휴대폰에 남은 예전 사진(캐시) 대신 새 사진을 받도록 붙이는 번호 (빌드할 때마다 바뀜) */
export const ASSET_VERSION: string = __BUILD_ID__;
