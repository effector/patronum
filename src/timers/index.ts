import { createStore } from 'effector'
import { clearTimeout } from 'timers'

type Handler = (...args: any[]) => void;

export interface Timers {
  setTimeout(handler: Handler, timeout?: number, ...args: any[]): NodeJS.Timeout;
  clearTimeout(handle: NodeJS.Timeout): void;
  now(): number;
}

export const $timers = createStore<Timers>({
  setTimeout: (handler, timeout, ...args) => setTimeout(handler, timeout, ...args) as unknown as NodeJS.Timeout,
  clearTimeout: (handle) => clearTimeout(handle),
  now: () => Date.now(),
});
