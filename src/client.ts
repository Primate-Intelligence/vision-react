/**
 * VisionClient — the minimal client surface the hooks need.
 *
 * Structurally typed to match the official SDK: a `Primate` instance from
 * `@primate-intelligence/sdk` (or `…/browser`) satisfies this interface
 * as-is — same method names, same shapes. Defining the seam here (rather
 * than importing SDK types) keeps this package buildable standalone and
 * lets tests inject lightweight fakes.
 *
 *   import { Primate } from '@primate-intelligence/sdk/browser';
 *   <PrimateProvider client={new Primate({ authToken: mintToken })}>…
 */
import type { Analysis, Video } from './resources';

export interface VisionClient {
  videos: {
    /** SDK upload helper: presign-create → PUT bytes → complete. */
    upload(
      file: Uint8Array | Blob,
      params: { filename: string; content_type: 'video/mp4' | 'video/quicktime'; metadata?: Record<string, string> },
    ): Promise<Video>;
    retrieve(id: string): Promise<Video>;
  };
  analyses: {
    create(params: {
      video_id: string;
      prompt?: string;
      query?: Record<string, unknown>;
      model?: string;
      metadata?: Record<string, string>;
    }): Promise<Analysis>;
    retrieve(id: string): Promise<Analysis>;
    cancel(id: string): Promise<Analysis>;
  };
}
