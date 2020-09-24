import { Unit, Store, Event, Effect } from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Payloads = { [key: string]: any } | Tuple<any>;
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

export function combineEvents<P extends Payloads>(config: {
  events: Events<P>;
  reset?: Unit<any>;
}): Event<P>;

export function combineEvents<
  P extends Payloads,
  T extends Unit<Payloads>
>(config: {
  events: Events<P>;
  target: T;
  reset?: Unit<any>;
}): ReturnTarget<P, T>;
