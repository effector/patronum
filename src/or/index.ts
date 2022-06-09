import { combine, Store } from 'effector';

export function or(...stores: Array<Store<unknown>>): Store<boolean> {
  return combine(stores, (values) =>
    values.reduce((all, current) => Boolean(all) || Boolean(current)),
  ) as Store<boolean>;
}
