import { Store } from 'effector';

export function empty<A>(source: Store<A | null | undefined>): Store<boolean> {
  return source.map((value) => value == null, { skipVoid: false });
}
