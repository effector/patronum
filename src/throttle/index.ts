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

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function throttle<T>(
  source: Unit<T>,
  timeout: number | Store<number>,
): EventAsReturnType<T>;
export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
  leading?: boolean;
}): EventAsReturnType<T>;
export function throttle<T, Target extends UnitTargetable<T>>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  name?: string;
  leading?: boolean;
}): Target;
export function throttle<T>(
  ...args:
    | [
        {
          source: Unit<T>;
          timeout: number | Store<number>;
          name?: string;
          target?: UnitTargetable<any>;
          leading?: boolean;
        },
      ]
    | [Unit<T>, number | Store<number>]
): EventAsReturnType<T> {
  const argsShape =
    args.length === 2 ? { source: args[0], timeout: args[1] } : args[0];
  const { source, timeout, leading, target = createEvent<T>() } = argsShape;
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  const $timeout = toStoreNumber(timeout);
  const $leading = toStoreBoolean(leading ?? false);

  const timerFx = createEffect<number, void>({
    name: `throttle(${(source as Event<T>).shortName || source.kind}) effect`,
    handler: (timeout) => new Promise((resolve) => setTimeout(resolve, timeout)),
  });

  // It's ok - nothing will ever start unless source is triggered
  const $payload = createStore<T>(null as unknown as T, {
    serialize: 'ignore',
    skipVoid: false,
  }).on(source, (_, payload) => payload);

  const trailingTick = createEvent<void>();
  const leadingTick = createEvent<void>();

  const $canTrailingTick = createStore(true, { serialize: 'ignore' })
    .on(trailingTick, () => false)
    .on(timerFx.done, () => true);

  const $canLeadingTick = createStore(true, { serialize: 'ignore' })
    .on(leadingTick, () => false)
    .on(timerFx.done, () => true);

  sample({
    clock: source,
    source: [$canTrailingTick, $leading, $canLeadingTick],
    filter: ([canTrailingTick, leading, canLeadingTick]) =>
      canTrailingTick && ((!canLeadingTick && leading) || !leading),
    fn: (_, clock) => clock,
    target: trailingTick,
  });

  sample({
    clock: source,
    source: [$canTrailingTick, $canLeadingTick],
    filter: ([canTrailingTick, canLeadingTick]) => canTrailingTick && canLeadingTick,
    fn: (_, clock) => clock,
    target: [target, leadingTick],
  });

  sample({
    source: $timeout,
    clock: trailingTick as Unit<any>,
    target: timerFx,
  });

  sample({
    source: $payload,
    clock: timerFx.done,
    target: target,
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

function toStoreBoolean(value: boolean | Store<boolean> | unknown): Store<boolean> {
  if (is.store(value)) return value;

  if (typeof value !== 'boolean') {
    throw new TypeError(
      `leading parameter should be boolean or Store. "${typeof value}" was passed`,
    );
  }

  return createStore(value, { name: '$leading' });
}
