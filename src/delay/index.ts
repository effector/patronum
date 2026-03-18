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
} from 'effector';

type TimeoutType<Payload> = ((payload: Payload) => number) | Store<number> | number;

export function delay<Source extends Unit<any>>(
  source: Source,
  timeout: TimeoutType<UnitValue<Source>>,
): EventAsReturnType<UnitValue<Source>>;

export function delay<Source extends Unit<any>, Target extends TargetType>(config: {
  source: Source;
  timeout: TimeoutType<UnitValue<Source>>;
  target: MultiTarget<Target, UnitValue<Source>>;
}): Target;

export function delay<Source extends Unit<any>>(config: {
  source: Source;
  timeout: TimeoutType<UnitValue<Source>>;
}): EventAsReturnType<UnitValue<Source>>;

export function delay<Target extends TargetType>(config: {
  source?: never;
  timeout: TimeoutType<UnitValue<Target>>;
  target: MultiTarget<Target, UnitValue<Target>>;
}): EventAsReturnType<UnitValue<Target>>;

export function delay<
  Source extends Unit<any>,
  Target extends TargetType = TargetType,
>(
  ...args:
    | [
        {
          source?: Source;
          timeout: TimeoutType<UnitValue<Source> & UnitValue<Target>>;
          target?: MultiTarget<Target, UnitValue<Source> & UnitValue<Target>>;
        },
      ]
    | [Source, TimeoutType<UnitValue<Source>>]
) {
  const argsShape =
    args.length === 2 ? { source: args[0], timeout: args[1] } : args[0];

  const { source, timeout, target } = argsShape as {
    source?: Unit<any>;
    timeout: TimeoutType<any>;
    target?: MultiTarget<any, any>;
  };

  if (source === undefined && target !== undefined) {
    return delayWithoutSource(timeout, target);
  }

  const effectiveTarget = target ?? (createEvent() as any);
  const targets = Array.isArray(effectiveTarget)
    ? effectiveTarget
    : [effectiveTarget];

  if (!is.unit(source)) throw new TypeError('source must be a unit from effector');
  if (!targets.every((unit) => is.unit(unit)))
    throw new TypeError('target must be a unit from effector');

  const ms = validateTimeout(timeout);

  const timerFx = createEffect<
    { payload: UnitValue<Source>; milliseconds: number },
    UnitValue<Source>
  >(
    ({ payload, milliseconds }) =>
      new Promise((resolve) => {
        setTimeout(resolve, milliseconds, payload);
      }),
  );

  sample({
    source: combine({ milliseconds: ms }),
    clock: source as Unit<any>,
    fn: ({ milliseconds }, payload) => ({
      payload,
      milliseconds:
        typeof milliseconds === 'function' ? milliseconds(payload) : milliseconds,
    }),
    target: timerFx,
  });

  sample({ clock: timerFx.doneData, target: targets as UnitTargetable<any>[] });

  return effectiveTarget as any;
}

function delayWithoutSource(timeout: TimeoutType<any>, target: any) {
  const targets = Array.isArray(target) ? target : [target];
  if (!targets.every((unit: any) => is.unit(unit)))
    throw new TypeError('target must be a unit from effector');

  const ms = validateTimeout(timeout);
  const trigger = createEvent<any>();

  const timerFx = createEffect<{ payload: any; milliseconds: number }, any>(
    ({ payload, milliseconds }) =>
      new Promise((resolve) => {
        setTimeout(resolve, milliseconds, payload);
      }),
  );

  sample({
    source: combine({ milliseconds: ms }),
    clock: trigger,
    fn: ({ milliseconds }, payload) => ({
      payload,
      milliseconds:
        typeof milliseconds === 'function' ? milliseconds(payload) : milliseconds,
    }),
    target: timerFx,
  });

  sample({ clock: timerFx.doneData, target: targets as UnitTargetable<any>[] });

  return trigger;
}

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
