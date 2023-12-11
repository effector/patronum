import {
  createEvent,
  createStore,
  is,
  sample,
  Store,
  Unit,
  attach,
  merge,
  UnitTargetable,
  EventAsReturnType,
} from 'effector';
import { $timers } from '../timers'

export function debounce<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
}): EventAsReturnType<T>;
export function debounce<
  T,
  Target extends UnitTargetable<T> | UnitTargetable<void>,
>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  name?: string;
}): Target;
export function debounce<T>({
  source,
  timeout,
  target,
  name,
}: {
  source: Unit<T>;
  timeout?: number | Store<number>;
  target?: UnitTargetable<T> | Unit<T>;
  name?: string;
}): typeof target extends undefined ? EventAsReturnType<T> : typeof target {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (is.domain(source)) throw new TypeError('source cannot be domain');

  const $timeout = toStoreNumber(timeout);

  const saveCancel = createEvent<[NodeJS.Timeout, () => void]>();
  const $canceller = createStore<[NodeJS.Timeout, () => void] | []>([], { serialize: 'ignore' })
    .on(saveCancel, (_, payload) => payload)

  const tick = (target as UnitTargetable<T>) ?? createEvent();

  const timerFx = attach({
    name: name || `debounce(${(source as any)?.shortName || source.kind}) effect`,
    source: { canceller: $canceller, timers: $timers },
    effect({ canceller: [ timeoutId, rejectPromise ], timers }, timeout: number) {
      if (timeoutId) timers.clearTimeout(timeoutId);
      if (rejectPromise) rejectPromise();

      return new Promise((resolve, reject) => {
        saveCancel([
          timers.setTimeout(resolve, timeout),
          reject
        ])
      });
    }
  });
  $canceller.reset(timerFx.done);

  // It's ok - nothing will ever start unless source is triggered
  const $payload = createStore<T[]>([], { serialize: 'ignore', skipVoid: false }).on(
    source,
    (_, payload) => [payload],
  );

  const $canTick = createStore(true, { serialize: 'ignore' });

  const triggerTick = createEvent();

  $canTick
    .on(triggerTick, () => false)
    .on(
      [
        tick,
        // debounce timeout should be restarted on timeout change
        $timeout,
        // debounce timeout can be restarted in later ticks
        timerFx,
      ],
      () => true,
    );

  const requestTick = merge([
    source,
    // debounce timeout is restarted on timeout change
    sample({ clock: $timeout, filter: timerFx.pending }),
  ]);

  sample({
    clock: requestTick,
    filter: $canTick,
    target: triggerTick,
  });

  sample({
    source: $timeout,
    clock: triggerTick,
    target: timerFx,
  });

  sample({
    source: $payload,
    clock: timerFx.done,
    fn: ([payload]) => payload,
    target: tick,
  });

  return tick as any;
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
