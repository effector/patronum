import { Store } from 'effector';

import { equals } from '../equals';

export function empty<A>(source: Store<A | null>): Store<boolean> {
  return source.map(value => value === null);
}
