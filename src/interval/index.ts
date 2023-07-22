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

export function interval<S extends unknown, F extends unknown>(config: {
  timeout: number | Store<number>;
  start: Event<S>;
  stop?: Event<F>;
  leading?: boolean;
  trailing?: boolean;
}): { tick: Event<void>; isRunning: Store<boolean> };

export function interval(config: {
  timeout: number | Store<number>;
  leading?: boolean;
  trailing?: boolean;
}): TriggerProtocol;

export function interval<S extends unknown, F extends unknown>({
  timeout,
  start,
  stop,
  leading = false,
  trailing = false,
}: {
  timeout: number | Store<number>;
  start?: Event<S>;
  stop?: Event<F>;
  leading?: boolean;
  trailing?: boolean;
}): { tick: Event<void>; isRunning: Store<boolean> } & TriggerProtocol {
  const setup = (start ?? createEvent()) as Event<void>;
  const teardown = (stop ?? createEvent()) as Event<void>;

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
    clock: setup,
    source: $timeout,
    filter: $notRunning,
    target: timeoutFx,
  });

  if (leading) {
    const onReady = guard({ clock: setup, filter: $notRunning });
    sample({ clock: onReady, target: tick });
  }

  sample({
    clock: setup,
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

  if (trailing) {
    sample({
      clock: teardown,
      target: tick,
    });
  }

  $isRunning.on(teardown, () => false);

  sample({
    clock: teardown,
    target: cleanupFx,
  });

  return {
    tick,
    isRunning: $isRunning,
    '@@trigger': () => ({
      setup,
      teardown,
      fired: tick,
    }),
  };
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

/**
 * @see {@link https://withease.pages.dev/protocols/trigger.html}
 */
export type TriggerProtocol = {
  '@@trigger': () => {
    setup: Event<void>;
    teardown: Event<void>;
    fired: Event<unknown> | Event<void>;
  };
};
