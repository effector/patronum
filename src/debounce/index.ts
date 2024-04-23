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
  createEffect
} from 'effector'
import { spread } from '../spread'

type DebounceCanceller = { timeoutId?: NodeJS.Timeout; rejectPromise?: () => void; };

export type DebounceTimerFxProps = {
  canceller: DebounceCanceller;
  timeout: number;
};

const timerFx = createEffect(({ canceller, timeout }: DebounceTimerFxProps) => {
  const { timeoutId, rejectPromise } = canceller;

  if (timeoutId) clearTimeout(timeoutId);
  if (rejectPromise) rejectPromise();

  return new Promise((resolve, reject) => {
    canceller.timeoutId = setTimeout(resolve, timeout);
    canceller.rejectPromise = reject;
  });
});

export function _debounce<T>(
  source: Unit<T>,
  timeout: number | Store<number>,
): EventAsReturnType<T>;
export function _debounce<T>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  name?: string;
}): EventAsReturnType<T>;
export function _debounce<
  T,
  Target extends UnitTargetable<T> | UnitTargetable<void>,
>(_: {
  source: Unit<T>;
  timeout: number | Store<number>;
  target: Target;
  name?: string;
}): Target;
export function _debounce<T>(
  ...args:
    | [
        {
          source: Unit<T>;
          timeout?: number | Store<number>;
          target?: UnitTargetable<T> | Unit<T>;
          name?: string;
        },
      ]
    | [source: Unit<T>, timeout: number | Store<number>]
) {
  const argsShape =
    args.length === 2 ? { source: args[0], timeout: args[1] } : args[0];
  const { source, timeout, target, name } = argsShape;
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (is.domain(source)) throw new TypeError('source cannot be domain');

  const $timeout = toStoreNumber(timeout);

  const $canceller = createStore<DebounceCanceller | null>(null, {
    serialize: 'ignore',
  });

  const tick = (target as UnitTargetable<T>) ?? createEvent();

  const innerTimerFx = attach({
    name: name || `debounce(${(source as any)?.shortName || source.kind}) effect`,
    source: $canceller as Store<DebounceCanceller>,
    mapParams: (timeout: number, source: DebounceCanceller) => ({ canceller: source, timeout }),
    effect: timerFx,
  });

  $canceller.reset(innerTimerFx.done);

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
        innerTimerFx,
      ],
      () => true,
    );

  const requestTick = merge([
    source,
    // debounce timeout is restarted on timeout change
    sample({ clock: $timeout, filter: innerTimerFx.pending }),
  ]);

  sample({
    clock: requestTick,
    filter: $canTick,
    target: triggerTick,
  });

  sample({
    source: { timeout: $timeout, canceller: $canceller },
    clock: triggerTick,
    fn: ({ timeout, canceller }) => ({ timeout, canceller: canceller ?? {} }),
    target: spread({
      timeout: innerTimerFx,
      canceller: $canceller
    }),
  });

  sample({
    source: $payload,
    clock: innerTimerFx.done,
    fn: ([payload]) => payload,
    target: tick,
  });

  return tick as any;
}

export const debounce = Object.assign(_debounce, {
  timerFx
});

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
