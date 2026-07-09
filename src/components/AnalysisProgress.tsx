/**
 * <AnalysisProgress /> — unstyled-by-default progress readout for an Analysis.
 * Headless-friendly: pass `render` to fully own the markup.
 */
import type { Analysis } from '../resources';
import type { ReactNode } from 'react';

export interface AnalysisProgressProps {
  analysis: Analysis | null;
  render?: (info: { percent: number; stage: string; queuePosition: number | null }) => ReactNode;
  className?: string;
}

export function AnalysisProgress({ analysis, render, className }: AnalysisProgressProps) {
  if (!analysis) return null;
  const percent = analysis.progress?.percent ?? (analysis.status === 'completed' ? 100 : 0);
  const stage = analysis.progress?.stage ?? analysis.status;
  const queuePosition = analysis.queue_position;

  if (render) return <>{render({ percent, stage, queuePosition })}</>;

  return (
    <div className={className} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <span>{stage}</span>
      {queuePosition != null && <span> (queue position {queuePosition})</span>}
      <span> — {Math.round(percent)}%</span>
    </div>
  );
}
