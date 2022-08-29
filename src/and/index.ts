import { combine, Store } from 'effector';

export function and(...stores: Array<Store<any>>): Store<boolean> {
  return combine(stores, (values) => {
    for (const value of values) {
      if (!Boolean(value)) {
        return false
      }
    }
    return Boolean(values.length) // `false` if zero stores were given
  }) as Store<boolean>;
}
