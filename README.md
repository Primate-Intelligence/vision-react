# @primate-intelligence/vision-react

React components and headless hooks for the [Primate Vision public API](https://primateintelligence.ai/docs) — upload video, run analyses, and consume real-time streams.

> **Status: pre-release skeleton (v0.0.x).** This package is being built in the open as part of Primate Vision Public API v1 (Day-0 open-sourcing). The API surface below is the design target; expect churn until v0.1.0.

## What this will provide

- **Headless hooks:** `useVideoUpload`, `useAnalysis`, `usePromptCompile`, `useStream`
- **Components:** upload dropzone, prompt input with compile preview, progress pipeline, clips timeline, results panel, confidence display
- **Transport:** built on the official Primate Vision TypeScript SDK; auth via API key (server), ephemeral client tokens (browser), or your own token mint
- **Telemetry:** injectable `TelemetryProvider` (default: none — no analytics baked in)

## Install

```bash
npm install @primate-intelligence/vision-react
```

## Reference implementation

See [`primate-vision-client`](https://github.com/Primate-Intelligence/primate-vision-client) — an open-source, runnable reference app built on this package.

## License

Apache-2.0. See [NOTICE](./NOTICE) for trademark restrictions (the Primate marks and brand assets are **not** licensed).
