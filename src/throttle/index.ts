import {
  createEffect,
  createEvent,
  createStore,
  Event,
  is,
  sample,
  Store,
  Unit,
  UnitTargetable,
} from 'effector';
import { $timers, Timers } from '../timers';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
}): EventAsReturnType<T>;
export function throttle<T, Target extends UnitTargetable<T>>(_: {
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
  target?: UnitTargetable<any>;
}): EventAsReturnType<T> {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  const $timeout = toStoreNumber(timeout);

  const timerFx = createEffect<{ timeout: number; timers: Timers }, void>({
    name: `throttle(${(source as Event<T>).shortName || source.kind}) effect`,
    handler: ({ timeout, timers }) => new Promise((resolve) => timers.setTimeout(resolve, timeout)),
  });

  // It's ok - nothing will ever start unless source is triggered
  const $payload = createStore<T>(null as unknown as T, {
    serialize: 'ignore',
    skipVoid: false,
  }).on(source, (_, payload) => payload);

  const triggerTick = createEvent<T>();

  const $canTick = createStore(true, { serialize: 'ignore' })
    .on(triggerTick, () => false)
    .on(target, () => true);

  sample({
    clock: source,
    filter: $canTick,
    target: triggerTick,
  });

  sample({
    source: { timeout: $timeout, timers: $timers },
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
