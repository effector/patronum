import { createEffect, createEvent, Event, guard, is, sample, Unit } from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number;
  name?: string;
}): EventAsReturnType<T>;
export function throttle<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number;
  target: Target;
  name?: string;
}): Target;
export function throttle<T>({
  source,
  timeout,
  target = createEvent<T>(),
}: {
  source: Unit<T>;
  timeout: number;
  name?: string;
  target?: Unit<any>;
}): EventAsReturnType<T> {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const timerFx = createEffect(
    () => new Promise((resolve) => setTimeout(resolve, timeout)),
  );

  guard({
    source,
    filter: timerFx.pending.map((pending) => !pending),
    target: timerFx,
  });

  sample({ source, clock: timerFx.done, target });

  return target as any;
}
