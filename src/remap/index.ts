import { Store, StoreValue, is } from 'effector';

export function remap<T extends Record<string, any>>(
  source: Store<T | null>,
  key: keyof T | (keyof T)[],
): Store<T[string] | null> | Store<T[string]>[] {
  if (!is.store(source)) {
    throw new TypeError('[patronum/remap] first argument must be a store');
  }

  if (is.unit(key)) {
    throw new TypeError(
      '[patronum/remap] key for remap must be a mapper. Unit is not supported',
    );
  }

  if (typeof key === 'string') {
    return source.map((value) => {
      if (typeof value !== 'object') {
        throw new TypeError(
          '[patronum/remap] value of the store should contain only objects',
        );
      }
      if (value === null) return null;
      return value[key as string] ?? null;
    });
  }

  if (typeof key === 'object') {
    if (key === null) {
      throw new TypeError('[patronum/remap] key for remap must be a mapper');
    }
    if (Array.isArray(key)) {
      if (key.length === 0) {
        throw new TypeError('[patronum/remap] string mapper is empty');
      }

      return key.map((name) => {
        if (typeof name === 'string') {
          return source.map((value) => {
            if (typeof value !== 'object') {
              throw new TypeError(
                '[patronum/remap] value of the store should contain only objects',
              );
            }
            return value?.[name] ?? null;
          });
        }
        if (typeof name === 'function' && !is.unit(name)) {
          return source.map((value) => {
            if (typeof value !== 'object') {
              throw new TypeError(
                '[patronum/remap] value of the store should contain only objects',
              );
            }
            if (value === null) return null;
            return name(value) ?? null;
          });
        }
        throw new TypeError(
          '[patronum/remap] key in the list mapper must be a string mapper or function',
        );
      });
    }

    if (Object.prototype.toString.call(key) !== '[object Object]') {
      const type = Object.prototype.toString
        .call(key)
        .replace('[object ', '')
        .replace(']', '');
      throw new TypeError(
        `[patronum/remap] key for remap must be a mapper. "${type}" is not supported`,
      );
    }

    return {};
  }

  throw new TypeError('[patronum/remap] key for remap must be a mapper');
}
