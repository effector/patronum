import {
  Event,
  Store,
  createEvent,
  createEffect,
  createStore,
  guard,
  sample,
  attach,
  is,
} from 'effector';

export function interval<S extends unknown, F extends unknown>({
  timeout,
  start,
  stop,
  leading = false,
  trailing = false,
}: {
  timeout: number | Store<number>;
  start: Event<S>;
  stop?: Event<F>;
  leading?: boolean;
  trailing?: boolean;
}): { tick: Event<void>; isRunning: Store<boolean> } {
  const tick = createEvent();
  const $isRunning = createStore(false);
  const $timeout = toStoreNumber(timeout);

  const $notRunning = $isRunning.map((running) => !running);

  const saveTimeout = createEvent<NodeJS.Timeout>();
  const $timeoutId = createStore<NodeJS.Timeout | null>(null).on(
    saveTimeout,
    (_, id) => id,
  );
  const saveReject = createEvent<() => void>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const $rejecter = createStore<() => void>(() => {}).on(saveReject, (_, rj) => rj);

  const timeoutFx = createEffect<number, void>((timeout) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, timeout);
      saveTimeout(timeoutId);
      saveReject(reject);
    });
  });

  const cleanupFx = attach({
    source: [$timeoutId, $rejecter],
    effect: ([id, rj]) => {
      rj();
      if (id) clearTimeout(id);
    },
  });

  guard({
    clock: start,
    source: $timeout,
    filter: $notRunning,
    target: timeoutFx,
  });

  if (leading) {
    guard({
      clock: start,
      filter: $notRunning,
      target: tick,
    });
  }

  sample({
    clock: start,
    fn: () => true,
    target: $isRunning,
  });

  guard({
    clock: timeoutFx.done,
    source: $timeout,
    filter: $isRunning,
    target: timeoutFx,
  });

  sample({
    clock: timeoutFx.done,
    filter: $isRunning,
    fn: () => {
      /* to be sure, nothing passed to tick */
    },
    target: tick,
  });

  if (stop) {
    if (trailing) {
      sample({
        clock: stop,
        target: tick,
      });
    }

    $isRunning.on(stop, () => false);
    sample({ clock: stop, target: cleanupFx });
  }

  return { tick, isRunning: $isRunning };
}

function toStoreNumber(value: number | Store<number> | unknown): Store<number> {
  if (is.store(value)) return value;
  if (typeof value === 'number') {
    return createStore(value, { name: '$timeout' });
  }

  throw new TypeError(
    `timeout parameter in interval method should be number or Store. "${typeof value}" was passed`,
  );
}
