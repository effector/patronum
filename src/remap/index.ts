import { Store, StoreValue, is } from 'effector';

export function remap<T extends {}>(
  source: Store<T>,
  key: keyof T,
): Store<T[typeof key]> {
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
      // list mapper
      return [];
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
