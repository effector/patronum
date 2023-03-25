import {
  createEvent,
  createStore,
  Effect,
  Event,
  EventAsReturnType,
  guard,
  is,
  merge,
  sample,
  Store,
  Unit,
  withRegion,
} from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Shape = Record<string, unknown> | Tuple;

type Events<Result> = {
  [Key in keyof Result]: Event<Result[Key]>;
};

type ReturnTarget<Result, Target> = Target extends Store<infer S>
  ? S extends Result
    ? Store<S>
    : Store<Result>
  : Target extends Event<infer P>
  ? P extends Result
    ? Event<P>
    : Event<Result>
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
  T extends Unit<P extends Tuple ? P : Partial<P>>,
>(config: { events: Events<P>; target: T; reset?: Unit<any> }): ReturnTarget<P, T>;

export function combineEvents<P>({
  events,
  reset,
  target = createEvent(),
}: {
  events: Events<P>;
  reset?: Unit<any>;
  target?: Unit<any>;
}) {
  if (!is.unit(target)) throwError('target should be a unit');
  if (reset && !is.unit(reset)) throwError('reset should be a unit');

  withRegion(target, () => {
    const keys = Object.keys(events);
    const defaultShape = Array.isArray(events) ? [...keys].fill('') : {};

    const $counter = createStore(keys.length, { serialize: 'ignore' });
    const $results = createStore(defaultShape, { serialize: 'ignore' });

    $counter.reset(sample({ source: target }));
    $results.reset(target);

    if (reset) {
      $counter.reset(sample({ source: reset }));
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
        const newShape = Array.isArray(shape) ? [...shape] : { ...shape };
        newShape[key] = payload;
        return newShape;
      });
    }

    guard({
      source: sample({ source: $results, clock: merge(Object.values(events)) }),
      filter: $counter.map((value) => value === 0),
      target,
    });
  });

  return target;
}

function throwError(message: string) {
  throw new Error(message);
}
