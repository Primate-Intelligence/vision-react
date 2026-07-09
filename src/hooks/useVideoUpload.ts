/**
 * useVideoUpload — presigned upload flow (POST /v1/videos → S3 PUT → complete).
 */
import { useCallback, useState } from 'react';
import { usePrimateClient, useTelemetry } from '../provider';
import type { Video } from '../resources';

export type UploadState =
  | { status: 'idle' }
  | { status: 'uploading' }
  | { status: 'ready'; video: Video }
  | { status: 'error'; error: Error };

export function useVideoUpload() {
  const client = usePrimateClient();
  const telemetry = useTelemetry();
  const [state, setState] = useState<UploadState>({ status: 'idle' });

  const upload = useCallback(
    async (file: File | Blob, opts?: { filename?: string; metadata?: Record<string, unknown> }): Promise<Video> => {
      setState({ status: 'uploading' });
      try {
        const video = await client.videos.upload(file, opts);
        setState({ status: 'ready', video });
        telemetry.track('video_uploaded', { video_id: video.id, size_bytes: video.size_bytes });
        return video;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        setState({ status: 'error', error });
        telemetry.trackError(error, { hook: 'useVideoUpload' });
        throw error;
      }
    },
    [client, telemetry],
  );

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { ...state, upload, reset };
}
