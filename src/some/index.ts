import { combine, Store } from 'effector';

export function some<T>(_: {
  predicate: (value: T) => boolean;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function some<T extends string>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function some<T>(_: { predicate: T; stores: Array<Store<T>> }): Store<boolean>;
export function some<T>({
  predicate,
  stores,
}: {
  predicate: ((value: T) => boolean) | T;
  stores: Array<Store<T>>;
}) {
  const checker = isFunction(predicate)
    ? predicate
    : (value: T) => value === predicate;

  return combine(stores, (values) => values.some(checker));
}

function isFunction<T>(value: unknown): value is (value: T) => boolean {
  return typeof value === 'function';
}
