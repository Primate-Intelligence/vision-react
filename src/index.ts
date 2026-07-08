/**
 * @primate-intelligence/vision-react — pre-release skeleton.
 *
 * Types below mirror the Public API v1 design (resource contracts §13,
 * state machines §14). They will move to the generated SDK when it ships;
 * this package will then re-export and build on them.
 */

/** Canonical analysis lifecycle (public API v1 §14). */
export type AnalysisStatus =
  | "queued"
  | "preparing"
  | "analyzing"
  | "rendering"
  | "completed"
  | "failed"
  | "canceled";

/** Canonical video lifecycle (public API v1 §14.1). */
export type VideoStatus = "awaiting_upload" | "processing" | "ready" | "failed";

/** Canonical stream lifecycle (public API v1 §4.8). */
export type StreamStatus = "queued" | "ready" | "live" | "ended";

export interface AnalysisResult {
  answer: "yes" | "no" | "indeterminate";
  confidence: number;
  clips: Array<{
    start_s: number;
    end_s: number;
    confidence: number;
    terms: Record<string, number>;
  }>;
  term_confidences: Record<string, number>;
  query_type: string;
  video_duration_s: number;
}

export interface Analysis {
  id: string;
  object: "analysis";
  status: AnalysisStatus;
  video_id: string;
  model: string;
  prompt?: string;
  result?: AnalysisResult;
  created_at: string;
  completed_at?: string;
}

/** Placeholder export so the package is importable pre-v0.1. */
export const VERSION = "0.0.1";
