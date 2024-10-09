import {
  createEffect,
  createEvent,
  is,
  sample,
  Unit,
  Store,
  EventAsReturnType,
  combine,
  Target as TargetType,
  MultiTarget,
  UnitValue,
  UnitTargetable,
  attach,
} from 'effector';

type TimeoutType<Payload> = ((payload: Payload) => number) | Store<number> | number;
export type DelayTimerFxProps = { payload: UnitValue<any>; milliseconds: number };

const timerFx = createEffect<DelayTimerFxProps, UnitValue<any>>(
  ({ payload, milliseconds }) =>
    new Promise((resolve) => {
      setTimeout(resolve, milliseconds, payload);
    }),
)

export function _delay<Source extends Unit<any>>(
  source: Source,
  timeout: TimeoutType<UnitValue<Source>>,
): EventAsReturnType<UnitValue<Source>>;

export function _delay<Source extends Unit<any>, Target extends TargetType>(config: {
  source: Source;
  timeout: TimeoutType<UnitValue<Source>>;
  target: MultiTarget<Target, UnitValue<Source>>;
}): Target;

export function _delay<Source extends Unit<any>>(config: {
  source: Source;
  timeout: TimeoutType<UnitValue<Source>>;
}): EventAsReturnType<UnitValue<Source>>;

export function _delay<
  Source extends Unit<any>,
  Target extends TargetType = TargetType,
>(
  ...args:
    | [
        {
          source: Source;
          timeout: TimeoutType<UnitValue<Source>>;
          target?: MultiTarget<Target, UnitValue<Source>>;
        },
      ]
    | [Source, TimeoutType<UnitValue<Source>>]
) {
  const argsShape =
    args.length === 2 ? { source: args[0], timeout: args[1] } : args[0];

  const { source, timeout, target = createEvent() as any } = argsShape;
  const targets = Array.isArray(target) ? target : [target];

  if (!is.unit(source)) throw new TypeError('source must be a unit from effector');
  if (!targets.every((unit) => is.unit(unit)))
    throw new TypeError('target must be a unit from effector');

  const ms = validateTimeout(timeout);

  const innerTimerFx = attach({
    effect: timerFx
  });

  sample({
    // ms can be Store<number> | number
    // converts object of stores or object of values to store
    source: combine({ milliseconds: ms }),
    clock: source as Unit<any>,
    fn: ({ milliseconds }, payload) => ({
      payload,
      milliseconds:
        typeof milliseconds === 'function' ? milliseconds(payload) : milliseconds,
    }),
    target: innerTimerFx,
  });

  sample({ clock: innerTimerFx.doneData, target: targets as UnitTargetable<any>[] });

  return target as any;
}

export const delay = Object.assign(_delay, {
  timerFx
});

function validateTimeout<T>(
  timeout: number | ((_: T) => number) | Store<number> | unknown,
) {
  if (
    is.store(timeout) ||
    typeof timeout === 'function' ||
    typeof timeout === 'number'
  ) {
    return timeout;
  }

  throw new TypeError(
    `'timeout' argument must be a function, Store, or a number. Passed "${typeof timeout}"`,
  );
}
