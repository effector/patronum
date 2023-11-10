import { Store } from 'effector';

export function not<T extends unknown>(source: Store<T>): Store<boolean> {
  return source.map((value) => !value, { skipVoid: true });
}
