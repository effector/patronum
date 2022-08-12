import { Store } from 'effector';

export function empty<A>(a: Store<A | null>): Store<boolean> {
  return a.map((value) => value === null);
}
