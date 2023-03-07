import { createEffect, Effect, Event, forward, restore, Store } from 'effector';

const defaultNow = <Time = number>() => Date.now() as unknown as Time;

type NoInfer<T> = [T][T extends any ? 0 : never];

export function time<Time = number>({
  clock,
  getNow,
  initial,
}: {
  clock: Event<any> | Effect<any, any, any> | Store<any>;
  getNow?: () => Time;
  initial?: NoInfer<Time>;
}): Store<Time> {
  const timeReader = getNow ?? defaultNow;
  const readNowFx = createEffect<void, Time>(timeReader);
  const $time = restore(readNowFx, initial ?? timeReader());
  forward({ from: clock, to: readNowFx });
  return $time;
}
