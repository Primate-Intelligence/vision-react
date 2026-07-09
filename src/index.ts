/**
 * @primate-intelligence/vision-react — React hooks + components for the
 * Primate Vision public API.
 *
 *   import { Primate } from '@primate-intelligence/sdk/browser';
 *   import { PrimateProvider, useVideoAnalysis } from '@primate-intelligence/vision-react';
 *
 *   const client = new Primate({ authToken: () => mintClientToken() });
 *   <PrimateProvider client={client}>
 *     <App />
 *   </PrimateProvider>
 *
 * Reference app: https://github.com/Primate-Intelligence/primate-vision-client
 */
export { PrimateProvider, usePrimateClient, useTelemetry, noopTelemetry } from './provider';
export type { Telemetry } from './provider';
export type { VisionClient } from './client';
export * from './resources';
export { useVideoUpload } from './hooks/useVideoUpload';
export type { UploadState } from './hooks/useVideoUpload';
export { useAnalysis } from './hooks/useAnalysis';
export type { AnalysisState, UseAnalysisOptions } from './hooks/useAnalysis';
export { useVideoAnalysis } from './hooks/useVideoAnalysis';
export { AnalysisProgress } from './components/AnalysisProgress';
export type { AnalysisProgressProps } from './components/AnalysisProgress';
export { ClipsTimeline } from './components/ClipsTimeline';
export type { ClipsTimelineProps } from './components/ClipsTimeline';

export const VERSION = '0.1.0';
