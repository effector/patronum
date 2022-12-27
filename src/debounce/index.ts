import {
  createEffect,
  createEvent,
  createStore,
  Event,
  is,
  sample,
  Store,
  Unit,
  attach,
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

  const saveTimeoutId = createEvent<NodeJS.Timeout>();
  const $timeoutId = createStore<NodeJS.Timeout | null>(null, {
    serialize: 'ignore',
  }).on(saveTimeoutId, (_, id) => id);
  const saveReject = createEvent<() => void>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const $rejecter = createStore<(() => void) | null>(null, {
    serialize: 'ignore',
  }).on(saveReject, (_, rj) => rj);

  const tick = target ?? createEvent();

  const timerBaseFx = createEffect<
    {
      parameter: T;
      timeout: number;
      rejectPromise: (() => void) | null;
      timeoutId: NodeJS.Timeout | null;
    },
    T
  >(({ parameter, timeout, timeoutId, rejectPromise }) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (rejectPromise) rejectPromise();
    return new Promise((resolve, reject) => {
      saveReject(reject);
      saveTimeoutId(setTimeout(resolve, timeout, parameter));
    });
  });
  const timerFx = attach({
    source: {
      timeoutId: $timeoutId,
      rejectPromise: $rejecter,
    },
    mapParams: (
      { parameter, timeout }: { parameter: T; timeout: number },
      { timeoutId, rejectPromise },
    ) => {
      return {
        parameter,
        timeout,
        timeoutId,
        rejectPromise,
      };
    },
    effect: timerBaseFx,
  });
  $rejecter.reset(timerFx.done);
  $timeoutId.reset(timerFx.done);

  sample({
    source: $timeout,
    clock: source,
    fn: (timeout, parameter) => ({ timeout, parameter }),
    target: timerFx,
  });

  sample({
    clock: timerFx.done,
    fn: ({ result }) => result,
    target: tick,
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
