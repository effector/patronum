import { Unit, Event } from 'effector';

export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number;
  name?: string;
}): Event<T>;
