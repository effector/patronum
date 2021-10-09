import {
  Event,
  Store,
  createEvent,
  createEffect,
  createStore,
  guard,
  sample,
  is,
} from 'effector';

export function interval({
  timeout,
  start,
  stop,
  leading = false,
  trailing = false,
}: {
  timeout: number | Store<number>;
  start: Event<void>;
  stop?: Event<void>;
  leading?: boolean;
  trailing?: boolean;
}): { tick: Event<void>; isRunning: Store<boolean> } {
  const tick = createEvent();
  const $isRunning = createStore(false);
  const $timeout = toStoreNumber(timeout);

  const $notRunning = $isRunning.map((running) => !running);

  let timeoutId: NodeJS.Timeout;

  const timeoutFx = createEffect<number, void>((timeout) => {
    return new Promise((resolve) => {
      timeoutId = setTimeout(resolve, timeout);
    });
  });

  const cleanupFx = createEffect(() => {
    clearTimeout(timeoutId);
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
