/**
 * <ClipsTimeline /> — renders result clips as proportional segments on a
 * timeline bar. Unstyled by default; `render` for full control.
 */
import type { AnalysisResult, Clip } from '../resources';
import type { ReactNode } from 'react';

export interface ClipsTimelineProps {
  result: AnalysisResult | null;
  onClipClick?: (clip: Clip, index: number) => void;
  render?: (clips: Clip[], durationS: number) => ReactNode;
  className?: string;
}

export function ClipsTimeline({ result, onClipClick, render, className }: ClipsTimelineProps) {
  if (!result || !result.clips?.length) return null;
  const duration = result.video_duration_s || Math.max(...result.clips.map((c) => c.end_s), 1);

  if (render) return <>{render(result.clips, duration)}</>;

  return (
    <div className={className} style={{ position: 'relative', height: 8, background: 'rgba(127,127,127,0.2)', borderRadius: 4 }}>
      {result.clips.map((clip, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onClipClick?.(clip, i)}
          title={`${clip.start_s.toFixed(1)}s–${clip.end_s.toFixed(1)}s (${Math.round(clip.confidence * 100)}%)`}
          style={{
            position: 'absolute',
            left: `${(clip.start_s / duration) * 100}%`,
            width: `${Math.max(((clip.end_s - clip.start_s) / duration) * 100, 0.5)}%`,
            top: 0,
            bottom: 0,
            background: 'currentColor',
            opacity: 0.4 + clip.confidence * 0.6,
            border: 'none',
            borderRadius: 4,
            cursor: onClipClick ? 'pointer' : 'default',
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}
