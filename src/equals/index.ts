/* eslint-disable @typescript-eslint/no-unused-vars */
import { combine, Store } from 'effector';

export function equals<A, B extends A>(
  a: A | Store<A>,
  b: B | Store<B>,
): Store<boolean> {
  return combine(a as Store<A>, b as Store<B>, (a, b) => a === b);
}
