import {
  createEvent,
  createStore,
  Effect,
  EventCallable,
  EventAsReturnType,
  is,
  sample,
  Store,
  Unit,
  UnitTargetable,
  withRegion,
} from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Shape = Record<string, unknown> | Tuple;

type Events<Result> = {
  [Key in keyof Result]: EventCallable<Result[Key]>;
};

type ReturnTarget<Result, Target> = Target extends Store<infer S>
  ? S extends Result
    ? Store<S>
    : Store<Result>
  : Target extends EventCallable<infer P>
  ? P extends Result
    ? EventCallable<P>
    : EventCallable<Result>
  : Target extends Effect<infer P, infer D, infer F>
  ? P extends Result
    ? Effect<P, D, F>
    : Effect<Result, D, F>
  : Unit<Result>;

export function combineEvents<P extends Shape>(config: {
  events: Events<P>;
  reset?: Unit<any>;
}): EventAsReturnType<P>;

export function combineEvents<
  P extends Shape,
  T extends UnitTargetable<P extends Tuple ? P : Partial<P>>,
>(config: { events: Events<P>; target: T; reset?: Unit<any> }): ReturnTarget<P, T>;

export function combineEvents<P extends Shape>(
  events: Events<P>,
): EventAsReturnType<P>;

export function combineEvents<P>(
  args:
    | {
        events: Events<any>;
        reset?: Unit<any>;
        target?: UnitTargetable<any> | Unit<any>;
      }
    | Events<any>,
) {
  const argsShape = isEventsShape(args) ? { events: args } : args;
  const { events, reset, target = createEvent() } = argsShape;
  if (!(is.unit(target) && is.targetable(target)))
    throwError('target should be a targetable unit');
  if (reset && !is.unit(reset)) throwError('reset should be a unit');

  withRegion(target, () => {
    const keys = Object.keys(events);
    const defaultShape = Array.isArray(events) ? [...keys].fill('') : {};

    const $counter = createStore(keys.length, { serialize: 'ignore' });
    const $results = createStore(defaultShape, { serialize: 'ignore' });

    sample({ source: target, target: $counter.reinit });
    $results.reset(target);

    if (reset) {
      sample({ source: reset, target: $counter.reinit });
      $results.reset(reset);
    }

    for (const key of keys) {
      const $isDone = createStore(false, { serialize: 'ignore' })
        .on(events[key], () => true)
        .reset(target);

      if (reset) {
        $isDone.reset(reset);
      }

      $counter.on($isDone, (value) => value - 1);
      $results.on(events[key], (shape, payload) => {
        const newShape = (Array.isArray(shape) ? [...shape] : { ...shape }) as any;
        newShape[key] = payload;
        return newShape;
      });
    }

    const eventsTrriggered = sample({
      source: $results,
      clock: [...(Object.values(events) as Unit<any>[])],
    });

    sample({
      source: eventsTrriggered,
      filter: $counter.map((value) => value === 0, { skipVoid: false }),
      target: target as UnitTargetable<any>,
    });
  });

  return target;
}

function isEventsShape<P>(args: any): args is Events<any> {
  return Object.keys(args).some(
    (key) => !['events', 'reset', 'target'].includes(key) && is.unit(args[key]),
  );
}

function throwError(message: string) {
  throw new Error(message);
}
