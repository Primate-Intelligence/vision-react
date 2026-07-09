# @primate-intelligence/vision-react

React components and headless hooks for the [Primate Vision public API](https://primateintelligence.ai/docs) — upload video, run analyses, and consume real-time streams.

> **Status: v0.1.0 — functional pre-release.** Built in the open as part of Primate Vision Public API v1 (Day-0 open-sourcing). Upload → analyze → results works end-to-end; streaming hooks land next.

## What's inside

- **Headless hooks:** `useVideoUpload`, `useAnalysis` (2s polling to terminal state, cancel-safe), `useVideoAnalysis` (one-call upload+analyze)
- **Components:** `<AnalysisProgress />`, `<ClipsTimeline />` — unstyled by default, `render`-prop for full control
- **Transport:** bring the official SDK — `new Primate(…)` from `@primate-intelligence/sdk/browser` satisfies the `VisionClient` seam as-is. Auth via API key (server), ephemeral `pvct_` client tokens (browser), or your own token mint
- **Telemetry:** injectable and OFF by default — no analytics baked in

## Install

```bash
npm install @primate-intelligence/vision-react @primate-intelligence/sdk
```

## Quickstart

```tsx
import { Primate } from '@primate-intelligence/sdk/browser';
import { PrimateProvider, useVideoAnalysis, AnalysisProgress, ClipsTimeline } from '@primate-intelligence/vision-react';

// Browser auth: mint short-lived client tokens from YOUR server
// (~20 lines — see the reference app's server/mint.js). Never ship pv_ keys.
const client = new Primate({
  authToken: async () => (await fetch('/api/token', { method: 'POST' }).then(r => r.json())).token,
});

function App() {
  return (
    <PrimateProvider client={client}>
      <Analyzer />
    </PrimateProvider>
  );
}

function Analyzer() {
  const { run, status, analysis } = useVideoAnalysis();
  return (
    <>
      <input type="file" accept="video/mp4,video/quicktime"
        onChange={(e) => e.target.files && run(e.target.files[0], 'Is there a person in this video?')} />
      <AnalysisProgress analysis={analysis} />
      {status === 'completed' && analysis?.result && (
        <>
          <p>{analysis.result.answer} ({Math.round(analysis.result.confidence * 100)}%)</p>
          <ClipsTimeline result={analysis.result} />
        </>
      )}
    </>
  );
}
```

## Reference implementation

See [`primate-vision-client`](https://github.com/Primate-Intelligence/primate-vision-client) — an open-source, runnable reference app built on this package.

## License

Apache-2.0. See [NOTICE](./NOTICE) for trademark restrictions (the Primate marks and brand assets are **not** licensed).
