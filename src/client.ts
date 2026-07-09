/**
 * VisionClient — the minimal client surface the hooks need.
 *
 * Structurally typed: a `Primate` instance from the official SDK
 * (`@primate-intelligence/sdk` / `…/browser`) satisfies this interface
 * as-is. Defining the seam here (rather than importing SDK types) keeps
 * this package buildable on a clean machine before the npm publish of the
 * SDK lands, and lets tests inject lightweight fakes.
 *
 *   import { Primate } from '@primate-intelligence/sdk/browser';
 *   <PrimateProvider client={new Primate({ authToken: mintToken })}>…
 */
import type { Analysis, Video } from './resources';

export interface VisionClient {
  videos: {
    /** Presign-create → PUT to S3 → complete. Returns the ready/processing Video. */
    upload(file: Blob | File, opts?: { filename?: string; metadata?: Record<string, unknown> }): Promise<Video>;
    get(id: string): Promise<Video>;
  };
  analyses: {
    create(params: {
      video_id: string;
      prompt?: string;
      query?: Record<string, unknown>;
      model?: string;
      metadata?: Record<string, unknown>;
    }): Promise<Analysis>;
    get(id: string): Promise<Analysis>;
    cancel(id: string): Promise<Analysis>;
  };
}
