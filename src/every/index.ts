/* eslint-disable @typescript-eslint/no-unused-vars */
import { combine, is, Store } from 'effector';

export function every<T>(_: {
  predicate: Store<T>;
  stores: Array<Store<T>>;
}): Store<boolean>;

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

export function every<T>(stores: Store<T>[], predicate: Store<T>): Store<boolean>;
export function every<T>(stores: Store<T>[], predicate: T): Store<boolean>;
export function every<T>(
  stores: Store<T>[],
  predicate: (value: T) => boolean,
): Store<boolean>;

export function every<T>(
  configOrStores:
    | {
        predicate: T | ((value: T) => boolean) | Store<T>;
        stores: Array<Store<T>>;
      }
    | Store<T>[],
  predicateOrNone?: Store<T> | T | ((value: T) => boolean),
): Store<boolean> {
  let stores: Store<T>[] = [];
  let predicate: Store<T> | T | ((value: T) => boolean) = () => false;
  if (Array.isArray(configOrStores)) {
    stores = configOrStores;
    predicate = predicateOrNone!;
  } else if (Array.isArray(configOrStores.stores)) {
    stores = configOrStores.stores;
    predicate = configOrStores.predicate;
  }

  let checker;
  if (isFunction(predicate)) {
    checker = predicate;
  } else if (is.store(predicate)) {
    checker = predicate.map((value) => (required: T) => value === required);
  } else {
    checker = (value: T) => value === predicate;
  }

  const $values = combine(stores);
  // Combine pass simple values as is
  const $checker = checker as Store<(value: T) => boolean>;

  return combine($checker, $values, (checker, values) => values.every(checker));
}

function isFunction<T>(value: unknown): value is (value: T) => boolean {
  return typeof value === 'function';
}
