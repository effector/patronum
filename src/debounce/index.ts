import { createEffect, createEvent, Event, forward, is, Unit } from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function debounce<T>(_: {
  source: Unit<T>;
  timeout: number;
  name?: string;
}): EventAsReturnType<T>;
export function debounce<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number;
  target: Target;
  name?: string;
}): Target;
export function debounce<T>({
  source,
  timeout,
  target,
}: {
  source: Unit<T>;
  timeout?: number;
  /** @deprecated */
  name?: string;
  target?: Unit<T>;
}): typeof target extends undefined ? EventAsReturnType<T> : typeof target {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (is.domain(source)) throw new TypeError('source cannot be domain');

  if (typeof timeout !== 'number' || timeout < 0 || !Number.isFinite(timeout))
    throw new Error(
      `timeout must be positive number or zero. Received: "${timeout}"`,
    );

  let rejectPromise: (() => void) | void;
  let timeoutId: NodeJS.Timeout;

  const tick = target ?? createEvent();

  const timerFx = createEffect<T, T>((parameter) => {
    clearTimeout(timeoutId);
    if (rejectPromise) rejectPromise();
    return new Promise((resolve, reject) => {
      rejectPromise = reject;
      timeoutId = setTimeout(resolve, timeout, parameter);
    });
  });

  forward({
    from: source,
    to: timerFx,
  });

  forward({
    from: timerFx.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}
