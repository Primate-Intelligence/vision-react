/**
 * useAnalysis — create an analysis and poll it to a terminal state.
 *
 * Poll cadence mirrors the production web client (2s). Terminal states per
 * the v1 state machine (§14.2): completed | failed | canceled.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrimateClient, useTelemetry } from '../provider';
import type { Analysis } from '../resources';

const TERMINAL = new Set(['completed', 'failed', 'canceled']);

export interface UseAnalysisOptions {
  /** Poll interval ms (default 2000 — same cadence as the Primate web client). */
  pollIntervalMs?: number;
}

export type AnalysisState =
  | { status: 'idle'; analysis: null }
  | { status: 'running'; analysis: Analysis }
  | { status: 'completed'; analysis: Analysis }
  | { status: 'failed'; analysis: Analysis }
  | { status: 'canceled'; analysis: Analysis }
  | { status: 'error'; analysis: Analysis | null; error: Error };

export function useAnalysis(opts: UseAnalysisOptions = {}) {
  const client = usePrimateClient();
  const telemetry = useTelemetry();
  const [state, setState] = useState<AnalysisState>({ status: 'idle', analysis: null });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(
    async (id: string) => {
      if (activeIdRef.current !== id) return; // superseded
      try {
        const analysis = await client.analyses.get(id);
        if (activeIdRef.current !== id) return;
        if (TERMINAL.has(analysis.status)) {
          setState({ status: analysis.status as 'completed' | 'failed' | 'canceled', analysis });
          telemetry.track('analysis_finished', { analysis_id: id, status: analysis.status });
          return;
        }
        setState({ status: 'running', analysis });
        timerRef.current = setTimeout(() => void poll(id), opts.pollIntervalMs ?? 2000);
      } catch (e) {
        if (activeIdRef.current !== id) return;
        const error = e instanceof Error ? e : new Error(String(e));
        setState((prev) => ({ status: 'error', analysis: prev.analysis, error }));
        telemetry.trackError(error, { hook: 'useAnalysis', analysis_id: id });
      }
    },
    [client, telemetry, opts.pollIntervalMs],
  );

  const run = useCallback(
    async (params: { video_id: string; prompt?: string; query?: Record<string, unknown>; model?: string }) => {
      stopPolling();
      try {
        const analysis = await client.analyses.create(params);
        activeIdRef.current = analysis.id;
        if (TERMINAL.has(analysis.status)) {
          // Test-mode keys complete synchronously.
          setState({ status: analysis.status as 'completed' | 'failed' | 'canceled', analysis });
        } else {
          setState({ status: 'running', analysis });
          timerRef.current = setTimeout(() => void poll(analysis.id), opts.pollIntervalMs ?? 2000);
        }
        telemetry.track('analysis_created', { analysis_id: analysis.id, video_id: params.video_id });
        return analysis;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        setState({ status: 'error', analysis: null, error });
        telemetry.trackError(error, { hook: 'useAnalysis' });
        throw error;
      }
    },
    [client, telemetry, poll, stopPolling, opts.pollIntervalMs],
  );

  const cancel = useCallback(async () => {
    const id = activeIdRef.current;
    if (!id) return;
    stopPolling();
    try {
      const analysis = await client.analyses.cancel(id);
      setState({ status: 'canceled', analysis });
    } catch {
      // Cancel raced completion — refresh the terminal state.
      const analysis = await client.analyses.get(id).catch(() => null);
      if (analysis && TERMINAL.has(analysis.status)) {
        setState({ status: analysis.status as 'completed' | 'failed' | 'canceled', analysis });
      }
    }
  }, [client, stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    activeIdRef.current = null;
    setState({ status: 'idle', analysis: null });
  }, [stopPolling]);

  return { ...state, run, cancel, reset };
}
