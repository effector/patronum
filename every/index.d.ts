import { Store } from 'effector';

export function every<T>(
  predicate: (value: T) => boolean,
  stores: Array<Store<T>>,
): Store<boolean>;

export function every<T extends string>(
  value: T,
  stores: Array<Store<T>>,
): Store<boolean>;

export function every<T>(value: T, stores: Array<Store<T>>): Store<boolean>;
