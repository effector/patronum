import { Event, Store, Unit, createEvent, createStore, is, sample } from 'effector';

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

  const $skipped = createStore(0);

  reset = is.unit(reset) ? reset : createEvent();

  const $canTrigger = sample({
    source: [$skipped, $count],
    fn: ([skp, cnt]) => skp >= cnt,
  });

  const event = sample({
    clock,
    source: $skipped,
    filter: $canTrigger,
    fn: (_, params) => params,
  });

  sample({
    clock,
    source: $skipped,
    filter: $canTrigger.map((can) => !can),
    fn: (skp) => skp + 1,
    target: $skipped,
  });

  sample({
    clock: [$count, reset],
    target: $skipped.reinit,
  });

  return event;
}
