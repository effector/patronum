import { combine, Store } from 'effector';

export function and(...stores: Array<Store<any>>): Store<boolean> {
  return combine(
    stores,
    (values) => {
      for (const value of values) {
        if (!value) {
          return false;
        }
      }
      return true;
    },
    { skipVoid: true },
  ) as Store<boolean>;
}
