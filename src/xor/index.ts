import { combine, Store } from 'effector';

export function xor(...stores: Array<Store<any>>): Store<boolean> {
  return combine(
    stores,
    (values) => {
      let trueCount = 0;

      for (const value of values) {
        if (value) {
          trueCount += 1;
        }
      }

      return trueCount === 1;
    },
    { skipVoid: false },
  ) as Store<boolean>;
}
