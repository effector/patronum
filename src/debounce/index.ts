import {
  createEffect,
  createEvent,
  createStore,
  Event,
  forward,
  is,
  sample,
  Store,
  Unit,
} from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function debounce<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
}): EventAsReturnType<T>;
export function debounce<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  name?: string;
}): Target;
export function debounce<T>({
  source,
  timeout,
  target,
}: {
  source: Unit<T>;
  timeout?: number | Store<number>;
  /** @deprecated */
  name?: string;
  target?: Unit<T>;
}): typeof target extends undefined ? EventAsReturnType<T> : typeof target {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (is.domain(source)) throw new TypeError('source cannot be domain');

  const $timeout = toStoreNumber(timeout);

  let rejectPromise: (() => void) | void;
  let timeoutId: NodeJS.Timeout;

  const tick = target ?? createEvent();

  const timerFx = createEffect<{ parameter: T; timeout: number }, T>(
    ({ parameter, timeout }) => {
      clearTimeout(timeoutId);
      if (rejectPromise) rejectPromise();
      return new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = setTimeout(resolve, timeout, parameter);
      });
    },
  );

  sample({
    source: $timeout,
    clock: source,
    fn: (timeout, parameter) => ({ timeout, parameter }),
    target: timerFx,
  });

  forward({
    from: timerFx.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}

function toStoreNumber(value: number | Store<number> | unknown): Store<number> {
  if (is.store(value)) return value;
  if (typeof value === 'number') {
    if (value < 0 || !Number.isFinite(value))
      throw new Error(
        `timeout must be positive number or zero. Received: "${value}"`,
      );
    return createStore(value, { name: '$timeout' });
  }

  throw new TypeError(
    `timeout parameter in interval method should be number or Store. "${typeof value}" was passed`,
  );
}
