import { Store, Event, Domain, is, createStore } from 'effector';

type RejectUndefinedAndFunction<T> = T extends undefined
  ? never
  : T extends (...args: any[]) => any
  ? never
  : T extends Domain
  ? never
  : T;

export function readonly<T extends unknown>(source: Store<T>): Store<T>;
export function readonly<T extends unknown>(source: Event<T>): Event<T>;
export function readonly<T>(source: RejectUndefinedAndFunction<T>): Store<T>;
export function readonly<T extends unknown>(source: Store<T> | Event<T>) {
  if (!is.unit(source)) {
    if (typeof source === 'function' || source === undefined) {
      return source;
    }

    return createStore(source).map((value) => value, { skipVoid: false });
  }

  if (!is.targetable(source)) {
    return source;
  }

  if (is.store(source)) {
    return source.map((value) => value, { skipVoid: false });
  }

  if (is.event(source)) {
    return source.map((value) => value);
  }

  return source;
}
