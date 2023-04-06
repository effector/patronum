import {
  createEffect,
  createEvent,
  forward,
  is,
  sample,
  Unit,
  Event,
  Store,
  Effect,
  combine,
  createStore,
  launch,
} from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function delay<T>({
  source,
  timeout,
  target = createEvent<T>(),
  cancel,
}: {
  source: Unit<T>;
  timeout: ((_payload: T) => number) | Store<number> | number;
  target?:
    | Store<T>
    | Event<T>
    | Effect<T, any, any>
    | Event<void>
    | Effect<void, any, any>;
  cancel?: Event<any>;
}): EventAsReturnType<T> {
  if (!is.unit(source)) throw new TypeError('source must be a unit from effector');

  if (!is.unit(target)) throw new TypeError('target must be a unit from effector');

  const ms = validateTimeout(timeout);

  const $timeout = createStore<NodeJS.Timeout | null>(null);

  const timerFx = createEffect<{ payload: T; milliseconds: number }, T>(
    ({ payload, milliseconds }) =>
      new Promise((resolve) => {
        launch($timeout, setTimeout(resolve, milliseconds, payload));
      }),
  );

  sample({
    // ms can be Store<number> | number
    // converts object of stores or object of values to store
    source: combine({ milliseconds: ms }),
    clock: source,
    fn: ({ milliseconds }, payload) => ({
      payload,
      milliseconds:
        typeof milliseconds === 'function' ? milliseconds(payload) : milliseconds,
    }),
    target: timerFx,
  });

  // @ts-expect-error
  forward({ from: timerFx.doneData, to: target });

  if (cancel) {
    sample({
      clock: cancel,
      source: $timeout,
      filter: (x): x is NonNullable<typeof x> => x !== null,
    }).watch(clearTimeout);
  }

  return timerFx.doneData;
}

function validateTimeout<T>(
  timeout: number | ((_: T) => number) | Store<number> | unknown,
) {
  if (
    is.store(timeout) ||
    typeof timeout === 'function' ||
    typeof timeout === 'number'
  ) {
    return timeout;
  }

  throw new TypeError(
    `'timeout' argument must be a function, Store, or a number. Passed "${typeof timeout}"`,
  );
}
