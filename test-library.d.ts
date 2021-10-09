import { Unit, Event, Store, Effect } from 'effector';

export function argumentHistory(fn: jest.Mock): Array<unknown>;
export function argumentsHistory(fn: jest.Mock): Array<Array<unknown>>;

export function time(): {
  diff: () => number;
};
export function toBeCloseWithThreshold(
  received: any,
  expected: any,
  threshold: any,
): {
  pass: boolean;
  message: () => string;
};

export function wait(ms: number): Promise<void>;
export function waitFor<T>(unit: Unit<T>): Promise<T>;

export function watch<T>(
  unit: Event<T> | Store<T> | Effect<T, any, any>,
): jest.Mock<T, [T]>;
