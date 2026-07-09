/**
 * Structural smoke tests — no React renderer needed (hook logic is exercised
 * end-to-end by the reference app + the production web client). These verify
 * the public surface and the VisionClient structural contract.
 */
import { describe, it, expect } from 'vitest';
import * as pkg from './index';
import type { VisionClient } from './client';

describe('@primate-intelligence/vision-react surface', () => {
  it('exports the provider + hooks + components', () => {
    expect(typeof pkg.PrimateProvider).toBe('function');
    expect(typeof pkg.usePrimateClient).toBe('function');
    expect(typeof pkg.useVideoUpload).toBe('function');
    expect(typeof pkg.useAnalysis).toBe('function');
    expect(typeof pkg.useVideoAnalysis).toBe('function');
    expect(typeof pkg.AnalysisProgress).toBe('function');
    expect(typeof pkg.ClipsTimeline).toBe('function');
    expect(pkg.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('noopTelemetry never throws', () => {
    expect(() => pkg.noopTelemetry.track('x', {})).not.toThrow();
    expect(() => pkg.noopTelemetry.trackError(new Error('x'))).not.toThrow();
  });

  it('VisionClient is structurally satisfied by an SDK-shaped object', () => {
    // Compile-time contract: this object matches what `new Primate()` provides.
    const fake: VisionClient = {
      videos: {
        upload: async () => ({ id: 'video_x' } as never),
        retrieve: async () => ({ id: 'video_x' } as never),
      },
      analyses: {
        create: async () => ({ id: 'analysis_x' } as never),
        retrieve: async () => ({ id: 'analysis_x' } as never),
        cancel: async () => ({ id: 'analysis_x' } as never),
      },
    };
    expect(fake.videos).toBeDefined();
  });
});
