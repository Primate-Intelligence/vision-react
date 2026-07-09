/**
 * Public API v1 resource types (design §13, §14) — mirrors the official SDK.
 *
 * These are structural mirrors of `@primate-intelligence/sdk` types so this
 * package builds standalone; the SDK's resources satisfy them as-is. When
 * the SDK is on npm these become re-exports.
 */

// ── Errors ────────────────────────────────────────────────────────────────────

export interface ErrorObject {
  code: string;
  message: string;
  request_id?: string;
  details?: Record<string, unknown>;
}

// ── Videos (§13.1, §14.1) ─────────────────────────────────────────────────────

export type VideoStatus = 'awaiting_upload' | 'processing' | 'ready' | 'failed';

export interface VideoUpload {
  method: 'PUT';
  url: string;
  headers: Record<string, string>;
  expires_at: string;
}

export interface Video {
  id: string;
  object: 'video';
  status: VideoStatus;
  filename: string | null;
  size_bytes: number | null;
  duration_s: number | null;
  width: number | null;
  height: number | null;
  fps: number | null;
  content_type: string;
  source: 'upload' | 'url';
  upload: VideoUpload | null;
  error: ErrorObject | null;
  metadata?: Record<string, string>;
  expires_at: string | null;
  created_at: string;
}

// ── Analyses (§13.2, §14.2) ───────────────────────────────────────────────────

export type AnalysisStatus = 'queued' | 'analyzing' | 'completed' | 'failed' | 'canceled';

export interface Clip {
  start_s: number;
  end_s: number;
  confidence: number;
  label?: string;
  url?: string;
}

export interface AnalysisResult {
  answer: 'yes' | 'no' | 'indeterminate';
  confidence: number;
  clips: Clip[];
  term_confidences: Record<string, number>;
  query_type: 'object' | 'action' | 'compound' | 'attribute' | 'open_ended';
  video_duration_s: number;
}

export interface AnalysisProgress {
  percent: number;
  stage?: string;
}

export interface Analysis {
  id: string;
  object: 'analysis';
  status: AnalysisStatus;
  video_id: string;
  prompt: string | null;
  query: Record<string, unknown> | null;
  parse_mode: 'llm' | 'heuristic' | 'client' | null;
  model: string;
  options: Record<string, unknown>;
  progress: AnalysisProgress | null;
  queue_position: number | null;
  result: AnalysisResult | null;
  narrative: { text?: string } | null;
  artifacts: Record<string, unknown> | null;
  error: ErrorObject | null;
  usage: { video_seconds?: number; credits?: number } | null;
  metadata?: Record<string, string>;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

// ── Streams (§4.8, §14.3) ─────────────────────────────────────────────────────

export type StreamStatus = 'queued' | 'ready' | 'live' | 'ended';
