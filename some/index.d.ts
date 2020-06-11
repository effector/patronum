import { Store } from 'effector';

export function some<T>(
  predicate: (value: T) => boolean,
  stores: Array<Store<T>>,
): Store<boolean>;

export function some<T extends string>(
  value: T,
  stores: Array<Store<T>>,
): Store<boolean>;

export function some<T>(value: T, stores: Array<Store<T>>): Store<boolean>;
