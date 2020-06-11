import { Event, Store, Unit, Combinable, GetCombinedValue } from 'effector';

// TODO: add type guards

type Cases<T> = Partial<
  {
    [caseName: string]: Unit<T>;
  } & {
    __: Unit<T>;
  }
>;

type Key<T> =
  | string
  | ((source: T) => string)
  | Store<any>
  | {
      [caseName: string]: (source: T) => boolean;
    };

export function split<T>(config: { source: Unit<T>; cases: Cases<T> }): void;

export function split<T, R>(config: {
  source: Unit<T>;
  fn: (source: T) => R;
  cases: Cases<R>;
}): void;

export function split<T>(config: {
  source: Unit<T>;
  key: Key<T>;
  cases: Cases<T>;
}): void;

export function split<T, R>(config: {
  source: Unit<T>;
  key: Key<T>;
  fn: (source: T) => R;
  cases: Cases<R>;
}): void;

export function split<C extends Combinable>(config: {
  source: C;
  cases: Cases<GetCombinedValue<C>>;
}): void;

export function split<C extends Combinable, R>(config: {
  source: C;
  fn: (source: GetCombinedValue<C>) => R;
  cases: Cases<R>;
}): void;

export function split<C extends Combinable>(config: {
  source: C;
  key: Key<GetCombinedValue<C>>;
  cases: Cases<GetCombinedValue<C>>;
}): void;

export function split<C extends Combinable, R>(config: {
  source: C;
  key: Key<GetCombinedValue<C>>;
  fn: (source: GetCombinedValue<C>) => R;
  cases: Cases<R>;
}): void;

export function split<
  S,
  Obj extends { [name: string]: (payload: S) => boolean }
>(
  source: Unit<S>,
  cases: Obj,
): {
  [K in keyof Obj]: Obj[K] extends (p: any) => p is infer R
    ? Event<R>
    : Event<S>;
} & { __: Event<S> };
