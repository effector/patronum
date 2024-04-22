import {
  Event,
  EventCallable,
  Store,
  createEvent,
  createStore,
  sample,
  attach,
  is,
  createEffect
} from 'effector'

type SaveTimeoutEventProps = {
  timeoutId: NodeJS.Timeout;
  reject: () => void;
};

export type IntervalTimeoutFxProps = {
  timeout: number;
  running: boolean;
  saveTimeout: EventCallable<SaveTimeoutEventProps>;
};

export type IntervalCleanupFxProps = {
  timeoutId: NodeJS.Timeout | null;
  rejecter: () => void;
};

const timeoutFx = createEffect(({ timeout, running, saveTimeout }: IntervalTimeoutFxProps) => {
  if (!running) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, timeout);
    saveTimeout({ timeoutId, reject });
  });
})

const cleanupFx = createEffect(({ rejecter, timeoutId }: IntervalCleanupFxProps) => {
  rejecter();
  if (timeoutId) clearTimeout(timeoutId);
});

function _interval<S extends unknown, F extends unknown>(config: {
  timeout: number | Store<number>;
  start: Event<S>;
  stop?: Event<F>;
  leading?: boolean;
  trailing?: boolean;
}): { tick: Event<void>; isRunning: Store<boolean> };

function _interval(config: {
  timeout: number | Store<number>;
  leading?: boolean;
  trailing?: boolean;
}): TriggerProtocol;

function _interval<S extends unknown, F extends unknown>({
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
  const setup = createEvent();

  if (start) {
    sample({
      clock: start,
      target: setup,
    });
  }

  const teardown = createEvent();

  if (stop) {
    sample({
      clock: stop,
      target: teardown,
    });
  }

  const tick = createEvent();
  const $isRunning = createStore(false);
  const $timeout = toStoreNumber(timeout);

  const $notRunning = $isRunning.map((running) => !running, { skipVoid: false });

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

  const innerTimeoutFx = attach({
    source: { timeout: $timeout, running: $isRunning },
    mapParams: (_, source) => ({ saveTimeout, ...source }),
    effect: timeoutFx,
  });

  const innerCleanupFx = attach({
    source: { timeoutId: $timeoutId, rejecter: $rejecter },
    effect: cleanupFx,
  });

  sample({
    clock: setup,
    source: $timeout,
    filter: $notRunning,
    target: innerTimeoutFx,
  });

  if (leading) {
    const onReady = sample({ clock: setup, filter: $notRunning });
    sample({ clock: onReady, target: tick });
  }

  sample({
    clock: setup,
    fn: () => true,
    target: $isRunning,
  });

  sample({
    clock: innerTimeoutFx.done,
    source: $timeout,
    filter: $isRunning,
    target: innerTimeoutFx,
  });

  sample({
    clock: innerTimeoutFx.done,
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
    target: innerCleanupFx,
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

export const interval = Object.assign(_interval, {
  timeoutFx,
  cleanupFx
});

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
    setup: EventCallable<void>;
    teardown: EventCallable<void>;
    fired: Event<unknown> | Event<void>;
  };
};
