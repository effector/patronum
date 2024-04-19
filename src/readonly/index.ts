import { Store, Event, is, combine } from 'effector';

export function readonly<T extends unknown>(source: Store<T>): Store<T>;
export function readonly<T extends unknown>(source: Event<T>): Event<T>;

export function readonly<T extends unknown>(source: Store<T> | Event<T>) {
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
