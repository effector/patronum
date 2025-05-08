import { createEffect, Unit, restore, sample, Store, is } from 'effector';

const defaultNow = <Time = number>() => Date.now() as unknown as Time;

type NoInfer<T> = [T][T extends any ? 0 : never];

export function time(clock: Unit<any>): Store<number>;
export function time<Time = number>(config: {
  clock: Unit<any>;
  getNow?: () => Time;
  initial?: NoInfer<Time>;
}): Store<Time>;
export function time<Time = number>(
  args:
    | {
        clock: Unit<any>;
        getNow?: () => Time;
        initial?: NoInfer<Time>;
      }
    | Unit<any>,
): Store<Time> {
  const argsShape = is.unit(args) ? { clock: args } : args;
  const { clock, getNow, initial } = argsShape;
  const timeReader = getNow ?? defaultNow;
  const readNowFx = createEffect<void, Time>(timeReader);
  const $time = restore(readNowFx, initial ?? timeReader());
  sample({ clock, target: readNowFx });
  return $time;
}
