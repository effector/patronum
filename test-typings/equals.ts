import { expectType } from 'tsd';
import { createStore, Store } from 'effector';
import { equals } from '../dist/equals';

// Should receive stores with the same type
{
  expectType<Store<boolean>>(equals(createStore(true), createStore(false)));
  expectType<Store<boolean>>(equals(createStore(0), createStore(1)));
  expectType<Store<boolean>>(equals(createStore(''), createStore('a')));
  expectType<Store<boolean>>(equals(createStore([]), createStore([])));
  expectType<Store<boolean>>(equals(createStore([1]), createStore([2])));
  expectType<Store<boolean>>(
    equals(createStore<null | { b: number }>({ b: 2 }), createStore({ b: 1 })),
  );
}

// Should reject stores with different values
{
  // @ts-expect-error
  equals(createStore(true), createStore(1));
  // @ts-expect-error
  equals(createStore(''), createStore(1));
  // @ts-expect-error
  equals(createStore(''), createStore(true));
  // @ts-expect-error
  equals(createStore([1]), createStore(['']));
  // @ts-expect-error
  equals(createStore({ b: 2 }), createStore({ a: 1 }));
}

// Should reject stores and literals with different types
{
  // @ts-expect-error
  equals(createStore(true), 1);
  // @ts-expect-error
  equals('', createStore(1));
  // @ts-expect-error
  equals(createStore(''), true);
  // @ts-expect-error
  equals([1], createStore(['']));
  // @ts-expect-error
  equals(createStore({ b: 2 }), { a: 1 });
}

// Should allow to compare with literal
{
  expectType<Store<boolean>>(equals(createStore(true), false));
  expectType<Store<boolean>>(equals(createStore(0), 1));
  expectType<Store<boolean>>(equals(createStore(''), 'a'));
  expectType<Store<boolean>>(equals(createStore([]), []));
  expectType<Store<boolean>>(equals(createStore([1]), [2]));
  expectType<Store<boolean>>(
    equals(createStore<null | { b: number }>({ b: 2 }), { b: 1 }),
  );
}
