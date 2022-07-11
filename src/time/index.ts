import { createEffect, Effect, Event, forward, restore, Store } from 'effector';

const defaultNow = <T = number>() => Date.now() as unknown as T;

export function time<T = number>({
  clock,
  getNow,
  initial,
}: {
  clock: Event<any> | Effect<any, any, any> | Store<any>;
  getNow?: () => T;
  initial?: T;
}): Store<T> {
  const timeReader = getNow ?? defaultNow;
  const readNowFx = createEffect<void, T>(timeReader);
  const $time = restore(readNowFx, initial ?? timeReader());
  forward({ from: clock, to: readNowFx });
  return $time;
}
