import {
  createEffect,
  Unit,
  restore,
  sample,
  Store,
  is,
  attach, Effect
} from 'effector'

const defaultNow = <Time = number>() => Date.now() as unknown as Time;

type NoInfer<T> = [T][T extends any ? 0 : never];

const readNowFx = createEffect<{ timeReader: () => number }, number>(({ timeReader }) => timeReader());

export function _time(clock: Unit<any>): Store<number>;
export function _time<Time = number>(config: {
  clock: Unit<any>;
  getNow?: () => Time;
  initial?: NoInfer<Time>;
}): Store<Time>;
export function _time<Time = number>(
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
  const innerReadNowFx = attach({
    mapParams: () => ({ timeReader }),
    effect: readNowFx as unknown as Effect<{ timeReader: () => Time }, Time>
  });
  const $time = restore(innerReadNowFx, initial ?? timeReader());
  sample({ clock, target: innerReadNowFx });
  return $time;
}

export const time = Object.assign(_time, {
  readNowFx
});
