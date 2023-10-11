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
  leading?: boolean | Store<boolean>;
  trailing?: boolean | Store<boolean>;
  name?: string;
}): EventAsReturnType<T>;
export function throttle<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  leading?: boolean | Store<boolean>;
  trailing?: boolean | Store<boolean>;
  name?: string;
}): Target;
export function throttle<T>({
  source,
  timeout,
  leading,
  trailing,
  target = createEvent<T>(),
}: {
  source: Unit<T>;
  timeout: number | Store<number>;
  leading?: boolean | Store<boolean>;
  trailing?: boolean | Store<boolean>;
  name?: string;
  target?: Unit<any>;
}): EventAsReturnType<T> {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  const $timeout = toStoreNumber(timeout);

  const timerFx = createEffect<number, void>({
    name: `throttle(${(source as Event<T>).shortName || source.kind}) effect`,
    handler: (timeout) => new Promise((resolve) => setTimeout(resolve, timeout)),
  });

  // It's ok - nothing will ever start unless source is triggered
  const $payload = createStore<T>(null as unknown as T, {
    serialize: 'ignore',
  }).on(source, (_, payload) => payload);

  const triggerTick = createEvent<T>();

  const $leading = toStoreBoolean(leading, '$leading', false);
  const $trailing = toStoreBoolean(trailing, '$trailing', true);

  const $neverCalled = createStore(true).on(target, () => false);
  const $lastCalled = createStore<number>(0).on(target, () => Date.now());

  const $canTick = createStore(true, { serialize: 'ignore' })
    .on(triggerTick, () => false)
    .on(target, () => true);

  guard({
    clock: source,
    filter: $canTick,
    target: triggerTick,
  });

  sample({
    source: $timeout,
    clock: triggerTick as Unit<any>,
    target: timerFx,
  });

  sample({
    clock: $payload,
    source: [$leading, $neverCalled],
    filter: ([leading, neverCalled]) => leading && neverCalled,
    target,
  });

  sample({
    source: [$trailing, $payload] as const,
    clock: timerFx.done,
    filter: ([trailing]) => trailing,
    fn: ([_, payload]) => payload,
    target,
  });
  sample({
    clock: $payload,
    source: { trailing: $trailing, lastCalled: $lastCalled, timeout: $timeout },
    filter: ({ trailing, lastCalled, timeout }) =>
      !trailing && lastCalled + timeout < Date.now(),
    fn: (_src, clk) => clk,
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

function toStoreBoolean(
  value: boolean | Store<boolean> | undefined,
  name: string,
  defaultValue: boolean,
): Store<boolean> {
  if (is.store(value)) return value;
  if (typeof value === 'boolean') {
    return createStore(value, { name });
  } else {
    return createStore(defaultValue, { name });
  }
}
