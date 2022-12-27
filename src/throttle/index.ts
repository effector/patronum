import {
  createEffect,
  createEvent,
  createStore,
  Event,
  guard,
  is,
  sample,
  Store,
  Unit,
} from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
}): EventAsReturnType<T>;
export function throttle<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  name?: string;
}): Target;
export function throttle<T>({
  source,
  timeout,
  target = createEvent<T>(),
}: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
  target?: Unit<any>;
}): EventAsReturnType<T> {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  const $timeout = toStoreNumber(timeout);

  const timerFx = createEffect<number, void>(
    (timeout) => new Promise((resolve) => setTimeout(resolve, timeout)),
  );

  // It's ok - nothing will ever start unless source is triggered
  const $payload = createStore<T>(null as unknown as T, { serialize: 'ignore' }).on(
    source,
    (_, payload) => payload,
  );

  const triggerTick = createEvent();

  const $canTick = createStore(true, { serialize: 'ignore' })
    .on(triggerTick, () => false)
    .on(target, () => true);

  guard({
    clock: source as Unit<void>,
    filter: $canTick,
    target: triggerTick,
  });

  sample({
    source: $timeout,
    clock: triggerTick as Unit<any>,
    target: timerFx,
  });

  sample({
    source: $payload,
    clock: timerFx.done,
    target,
  });

  return target as any;
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
    `timeout parameter should be number or Store. "${typeof value}" was passed`,
  );
}
