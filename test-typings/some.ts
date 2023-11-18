import { expectType, expectError } from 'tsd';
import { Store, createStore } from 'effector';
import { some } from '../dist/some';

// Check invalid type for number predicate
{
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some({ predicate: 0, stores: [$a, $b] }));

  // @ts-expect-error
  some({ predicate: 0, stores: [$a, $invalid] });
}

// Check types for string enum
{
  type Enum = 'a' | 'b' | 'c';
  const $a = createStore<Enum>('a');
  const $b = createStore<Enum>('c');
  const $invalid = createStore('d');

  const value: Enum = 'c';

  expectType<Store<boolean>>(some({ predicate: value, stores: [$a, $b] }));
  expectType<Store<boolean>>(some({ predicate: (b) => b === 'b', stores: [$a, $b] }));

  // @ts-expect-error
  some({ predicate: value, stores: [$a, $invalid] });
  // @ts-expect-error
  some({ predicate: 'demo', stores: [$a, $b] });
  // @ts-expect-error
  some({ predicate: (c) => c === 'demo', stores: [$a, $b] });
}

// Check function predicate
{
  const predicate = (value: number) => value > 0;
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some({ predicate, stores: [$a, $b] }));

  // @ts-expect-error
  some({ predicate, stores: [$a, $invalid] });
}

// Check store predicate
{
  const $predicate = createStore(0);
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid1 = createStore('');
  const $invalid2 = createStore(true);
  const $invalid3 = createStore({});

  expectType<Store<boolean>>(some({ predicate: $predicate, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(some({ predicate: $invalid1, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(some({ predicate: $invalid2, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(some({ predicate: $invalid3, stores: [$a, $b] }));
}

// Shorthands
{
  const predicate = (value: number) => value > 0;
  const $predicate = createStore(0);
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid1 = createStore('');
  const $invalid2 = createStore(true);
  const $invalid3 = createStore({});

  expectType<Store<boolean>>(some([$a, $b], 0));
  // @ts-expect-error
  some([$a, $invalid1], 0);

  expectType<Store<boolean>>(some([$a, $b], predicate));
  // @ts-expect-error
  some([$a, $invalid1], predicate);

  expectType<Store<boolean>>(some([$a, $b], $predicate));
  // @ts-expect-error
  expectType<Store<boolean>>(some([$a, $b], $invalid1));
  // @ts-expect-error
  expectType<Store<boolean>>(some([$a, $b], $invalid2));
  // @ts-expect-error
  expectType<Store<boolean>>(some([$a, $b], $invalid3));
}
