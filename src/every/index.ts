import { combine, Store } from 'effector';

export function every<T>(_: {
  predicate: (value: T) => boolean;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function every<T extends string>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function every<T>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function every<T>({
  predicate,
  stores,
}: {
  predicate: T | ((value: T) => boolean);
  stores: Array<Store<T>>;
}): Store<boolean> {
  const checker = isFunction(predicate)
    ? predicate
    : (value: T) => value === predicate;

  return combine(stores, (values) => values.every(checker));
}

function isFunction<T>(value: unknown): value is (value: T) => boolean {
  return typeof value === 'function';
}
