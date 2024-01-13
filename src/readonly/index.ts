import { Store, Event } from 'effector';

export function readonly<T extends unknown>(source: Store<T>): Store<T>;
export function readonly<T extends unknown>(source: Event<T>): Event<T>;

export function readonly<T extends unknown>(source: Store<T> | Event<T>) {
  return source.map((value) => value, { skipVoid: false });
}
