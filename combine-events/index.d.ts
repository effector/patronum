import { Unit, Store, Event, Effect } from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Results = { [key: string]: any } | Tuple<any>;
type Events<Result> = {
  [Key in keyof Result]: Event<Result[Key]>;
};

type ReturnTarget<Result, Target> = Target extends Store<infer S>
  ? S extends Result
    ? Store<S>
    : Store<Result>
  : Target extends Event<infer E>
  ? E extends Result
    ? Event<E>
    : Event<Result>
  : Target extends Effect<infer P, infer D, infer F>
  ? P extends Result
    ? Effect<P, D, F>
    : Effect<Result, D, F>
  : Unit<Result>;

export function combineEvents<T extends Results>(config: {
  events: Events<T>;
  reset?: Unit<any>;
}): Event<T>;

export function combineEvents<
  T extends Results,
  Target extends Unit<Results>
>(config: {
  events: Events<T>;
  target: Target;
  reset?: Unit<any>;
}): ReturnTarget<T, Target>;
