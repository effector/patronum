import {
  Event,
  Store,
  createEvent,
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

  const saveTimeout = createEvent<{
    timeoutId: NodeJS.Timeout;
    reject: () => void;
  }>();
  const $timeoutId = createStore<NodeJS.Timeout | null>(null).on(
    saveTimeout,
    (_, { timeoutId }) => timeoutId,
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const $rejecter = createStore<() => void>(() => {}).on(
    saveTimeout,
    (_, { reject }) => reject,
  );

  const timeoutFx = attach({
    source: { timeout: $timeout, running: $isRunning },
    effect: ({ timeout, running }) => {
      if (!running) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, timeout);
        saveTimeout({ timeoutId, reject });
      });
    },
  });

  const cleanupFx = attach({
    source: { timeoutId: $timeoutId, rejecter: $rejecter },
    effect: ({ timeoutId, rejecter }) => {
      rejecter();
      if (timeoutId) clearTimeout(timeoutId);
    },
  });

  guard({
    clock: start,
    source: $timeout,
    filter: $notRunning,
    target: timeoutFx,
  });

  if (leading) {
    const onReady = guard({ clock: start, filter: $notRunning }) as Event<S>;
    sample({ clock: onReady, target: tick });
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

  guard({
    clock: timeoutFx.done,
    filter: $isRunning,
    target: tick.prepend(() => {
      /* to be sure, nothing passed to tick */
    }),
  });

  if (stop) {
    if (trailing) {
      sample({
        clock: stop,
        target: tick,
      });
    }

    $isRunning.on(stop, () => false);

    sample({
      clock: stop,
      target: cleanupFx,
    });
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
