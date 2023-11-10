/* eslint-disable @typescript-eslint/no-unused-vars */
import { combine, Store, Unit } from 'effector';

export function equals<A, B>(
  a: A extends Unit<any>
    ? A extends Store<infer First>
      ? Store<First>
      : { error: `equals supports only stores and generic values` }
    : A,
  b: B extends Unit<any>
    ? B extends Store<infer Second>
      ? A extends Store<infer First>
        ? Second extends First
          ? Store<Second extends boolean ? boolean : Second>
          : { error: 'argument b should extends a' }
        : Second extends A
        ? Second
        : { error: 'argument b should extends a' }
      : { error: `equals supports only stores and generic values` }
    : A extends Store<infer First>
    ? B extends First
      ? B
      : { error: 'argument b should extends a' }
    : B extends A
    ? B
    : { error: 'argument b should extends a' },
): Store<boolean> {
  return combine(a as Store<A>, b as Store<A>, (a, b) => a === b, { skipVoid: true });
}
