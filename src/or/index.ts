import { combine, Store } from 'effector';

export function or(...stores: Array<Store<any>>): Store<boolean> {
  return combine(
    stores,
    (values) => {
      for (const value of values) {
        if (value) {
          return true;
        }
      }
      return false;
    },
    { skipVoid: true },
  ) as Store<boolean>;
}
