import { Store, Unit, Combinable, GetCombinedValue } from 'effector';

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

export function variant<T>(config: { source: Unit<T>; cases: Cases<T> }): void;

export function variant<T, R>(config: {
  source: Unit<T>;
  fn: (source: T) => R;
  cases: Cases<R>;
}): void;

export function variant<T>(config: {
  source: Unit<T>;
  key: Key<T>;
  cases: Cases<T>;
}): void;

export function variant<T, R>(config: {
  source: Unit<T>;
  key: Key<T>;
  fn: (source: T) => R;
  cases: Cases<R>;
}): void;

export function variant<C extends Combinable>(config: {
  source: C;
  cases: Cases<GetCombinedValue<C>>;
}): void;

export function variant<C extends Combinable, R>(config: {
  source: C;
  fn: (source: GetCombinedValue<C>) => R;
  cases: Cases<R>;
}): void;

export function variant<C extends Combinable>(config: {
  source: C;
  key: Key<GetCombinedValue<C>>;
  cases: Cases<GetCombinedValue<C>>;
}): void;

export function variant<C extends Combinable, R>(config: {
  source: C;
  key: Key<GetCombinedValue<C>>;
  fn: (source: GetCombinedValue<C>) => R;
  cases: Cases<R>;
}): void;
