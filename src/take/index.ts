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
  clock: Unit<T>;
  count: Store<number> | number;
  reset?: Unit<T>;
}): Event<T> {
  const $count = is.store(count) ? count : createStore(count);

  const $taken = createStore(0);

  const $canTrigger = combine([$taken, $count], ([taken, count]) => taken >= count);

  clock = is.unit(clock) ? clock : createEvent();

  reset = is.unit(reset) ? reset : createEvent();

  const event = sample({
    clock,
    source: $taken,
    filter: $canTrigger,
    fn: (_, params) => params,
  });

  sample({
    clock,
    source: $taken,
    filter: $canTrigger.map((canTrigger) => !canTrigger),
    fn: (taken) => taken + 1,
    target: $taken,
  });

  sample({
    clock: [$count, reset],
    target: $taken.reinit,
  });

  return event;
}
