import { combine, Store } from 'effector';

export function or(...stores: Array<Store<any>>): Store<boolean> {
  return combine(stores, (values) =>
    values.reduce(
      (all, current) => Boolean(all) || Boolean(current),
      Boolean(values[0]),
    ),
  ) as Store<boolean>;
}
