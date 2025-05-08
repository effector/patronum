import { expectType, expectError } from 'tsd';
import { Store, createStore } from 'effector';
import { every } from '../dist/every';

// Check invalid type for number predicate
{
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(every({ predicate: 0, stores: [$a, $b] }));

  // @ts-expect-error
  every({ predicate: 0, stores: [$a, $invalid] });
}

// Check types for string enum
{
  type Enum = 'a' | 'b' | 'c';
  const $a = createStore<Enum>('a');
  const $b = createStore<Enum>('c');
  const $invalid = createStore('d');

  const value: Enum = 'c';

  expectType<Store<boolean>>(every({ predicate: value, stores: [$a, $b] }));
  expectType<Store<boolean>>(
    every({ predicate: (c) => c === 'c', stores: [$a, $b] }),
  );

  /**
   * @todo Fix this edge-case in the future
   *
   */
  // should be error but is not
  every({ predicate: value, stores: [$a, $invalid] });
  // should be error but is not
  every({ predicate: 'demo', stores: [$a, $b] });
  // @ts-expect-error
  every({ predicate: (v) => v === 'demo', stores: [$a, $b] });
}

// Check function predicate
{
  const predicate = (value: number) => value > 0;
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(every({ predicate, stores: [$a, $b] }));

  // @ts-expect-error
  every({ predicate, stores: [$a, $invalid] });
}

// Check store predicate
{
  const $predicate = createStore(0);
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid1 = createStore('');
  const $invalid2 = createStore(true);
  const $invalid3 = createStore<Record<any, any>>({});

  expectType<Store<boolean>>(every({ predicate: $predicate, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(every({ predicate: $invalid1, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(every({ predicate: $invalid2, stores: [$a, $b] }));

  // @ts-expect-error
  expectType<Store<boolean>>(every({ predicate: $invalid3, stores: [$a, $b] }));
}

// Short
{
  const predicate = (value: number) => value > 0;
  const $predicate = createStore(0);
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid1 = createStore('');
  const $invalid2 = createStore(true);
  const $invalid3 = createStore<Record<any, any>>({});

  expectType<Store<boolean>>(every([$a, $b], 0));
  // @ts-expect-error
  every([$a, $invalid1], 0);

  expectType<Store<boolean>>(every([$a, $b], predicate));
  // @ts-expect-error
  every([$a, $invalid1], predicate);

  expectType<Store<boolean>>(every([$a, $b], $predicate));
  // @ts-expect-error
  expectType<Store<boolean>>(every([$a, $b], $invalid1));
  // @ts-expect-error
  expectType<Store<boolean>>(every([$a, $b], $invalid2));
  // @ts-expect-error
  expectType<Store<boolean>>(every([$a, $b], $invalid3));
}
