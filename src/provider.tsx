/**
 * PrimateProvider — supplies the VisionClient to hooks; injectable telemetry.
 *
 * Telemetry is OFF by default (no analytics baked into the package). The
 * host app may inject a tracker; the same seam pattern the Primate
 * Intelligence web client uses internally.
 */
import { createContext, useContext, type ReactNode } from 'react';
import type { VisionClient } from './client';

export interface Telemetry {
  track(event: string, props?: Record<string, unknown>): void;
  trackError(error: Error, context?: Record<string, unknown>): void;
}

export const noopTelemetry: Telemetry = { track: () => {}, trackError: () => {} };

interface PrimateContextValue {
  client: VisionClient | null;
  telemetry: Telemetry;
}

const PrimateContext = createContext<PrimateContextValue>({ client: null, telemetry: noopTelemetry });

export function PrimateProvider({
  client,
  telemetry,
  children,
}: {
  client: VisionClient;
  telemetry?: Telemetry;
  children: ReactNode;
}) {
  return (
    <PrimateContext.Provider value={{ client, telemetry: telemetry ?? noopTelemetry }}>
      {children}
    </PrimateContext.Provider>
  );
}

export function usePrimateClient(): VisionClient {
  const { client } = useContext(PrimateContext);
  if (!client) {
    throw new Error(
      'usePrimateClient: no client found. Wrap your tree in <PrimateProvider client={…}> — see the primate-vision-client reference app.',
    );
  }
  return client;
}

export function useTelemetry(): Telemetry {
  return useContext(PrimateContext).telemetry;
}
