import { combine, Store } from 'effector';

export function includes <T extends string>(
  a: Store<T>,
  b: Store<T> | T,
): Store<boolean>
export function includes <T extends string | number>(
  a: Store<Array<T>>,
  b: Store<T> | T,
): Store<boolean>
export function includes <T extends string | number>(
  a: Store<T | Array<T>>,
  b: Store<T> | T,
): Store<boolean> {
  return combine(a, b, (a, b) => {
    if (Array.isArray(a)) {
      return a.includes(b);
    }

    if (typeof a === 'number') {
      throw new Error('first argument should be an unit of array or string');
    }

    return a.includes(b as string);
  });
}
