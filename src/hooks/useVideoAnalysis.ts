/**
 * useVideoAnalysis — the one-call happy path: upload a file, run a prompt,
 * poll to completion. Composes useVideoUpload + useAnalysis.
 *
 *   const { run, status, analysis } = useVideoAnalysis();
 *   …
 *   await run(file, 'Is there a person in this video?');
 */
import { useCallback } from 'react';
import { useVideoUpload } from './useVideoUpload';
import { useAnalysis, type UseAnalysisOptions } from './useAnalysis';

export function useVideoAnalysis(opts: UseAnalysisOptions = {}) {
  const uploadHook = useVideoUpload();
  const analysisHook = useAnalysis(opts);

  const run = useCallback(
    async (file: File | Blob, prompt: string, extra?: { model?: string; filename?: string }) => {
      const video = await uploadHook.upload(file, { filename: extra?.filename });
      return analysisHook.run({ video_id: video.id, prompt, model: extra?.model });
    },
    [uploadHook, analysisHook],
  );

  return {
    run,
    cancel: analysisHook.cancel,
    reset: () => { uploadHook.reset(); analysisHook.reset(); },
    uploadStatus: uploadHook.status,
    status: analysisHook.status,
    analysis: analysisHook.analysis,
    error: analysisHook.status === 'error' ? analysisHook.error
      : uploadHook.status === 'error' ? uploadHook.error : undefined,
  };
}
