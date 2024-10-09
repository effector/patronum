import {
  attach,
  createEffect,
  createEvent,
  createStore,
  Event,
  EventCallable,
  is,
  sample,
  Store
} from 'effector'

type IntervalCanceller = {
  timeoutId: NodeJS.Timeout;
  reject: () => void;
};

export type IntervalTimeoutFxProps = {
  canceller: IntervalCanceller;
  timeout: number;
  running: boolean;
};

export type IntervalCleanupFxProps = IntervalCanceller;

const timeoutFx = createEffect(({ canceller, timeout, running }: IntervalTimeoutFxProps) => {
  if (!running) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    canceller.timeoutId = setTimeout(resolve, timeout);
    canceller.reject = reject;
  });
})

const cleanupFx = createEffect(({ reject, timeoutId }: IntervalCleanupFxProps) => {
  reject();
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

  const $canceller = createStore<IntervalCanceller | null>(null);

  const innerTimeoutFx = attach({
    source: { canceller: $canceller as Store<IntervalCanceller>, running: $isRunning, timeout: $timeout },
    mapParams: (_, source) => source,
    effect: timeoutFx,
  });

  const innerCleanupFx = attach({
    source: $canceller as Store<IntervalCanceller>,
    mapParams: (_, source) => source,
    effect: cleanupFx,
  });

  sample({
    clock: setup,
    source: $canceller,
    filter: $notRunning,
    fn: (canceller) => canceller ?? {},
    target: [innerTimeoutFx, $canceller],
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
