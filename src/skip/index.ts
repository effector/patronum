import {
  Event,
  Store,
  Unit,
  combine,
  createEvent,
  createStore,
  is,
  sample,
} from 'effector';

export function skip<T>({
  clock,
  count,
  reset,
}: {
  clock?: Unit<T>;
  count: Store<number> | number;
  reset?: Unit<T>;
}): Event<T> {
  const $count = is.store(count) ? count : createStore(count);

  const $skipped = createStore(0);

  const $canTrigger = combine(
    [$skipped, $count],
    ([skipped, count]) => skipped >= count,
  );

  clock = is.unit(clock) ? clock : createEvent();

  reset = is.unit(reset) ? reset : createEvent();

  const event = sample({
    clock,
    source: $skipped,
    filter: $canTrigger,
    fn: (_, params) => params,
  });

  sample({
    clock,
    source: $skipped,
    filter: $canTrigger.map((canTrigger) => !canTrigger),
    fn: (skipped) => skipped + 1,
    target: $skipped,
  });

  sample({
    clock: [$count, reset],
    target: $skipped.reinit,
  });

  return event;
}
