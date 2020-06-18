import { expectType, expectError } from 'tsd';
import { Store, createStore } from 'effector';
import { some } from '../some';

// Check invalid type for number predicate
{
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some({ predicate: 0, stores: [$a, $b] }));

  expectError(some({ predicate: 0, stores: [$a, $invalid] }));
}

// Check types for string enum
{
  type Enum = 'a' | 'b' | 'c';
  const $a = createStore<Enum>('a');
  const $b = createStore<Enum>('c');
  const $invalid = createStore('d');

  const value: Enum = 'c';

  expectType<Store<boolean>>(some({ predicate: value, stores: [$a, $b] }));
  expectError(some({ predicate: value, stores: [$a, $invalid] }));
  expectError(some({ predicate: 'demo', stores: [$a, $b] }));
}

// Check function predicate
{
  const predicate = (value: number) => value > 0;
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some({ predicate, stores: [$a, $b] }));
  expectError(some({ predicate, stores: [$a, $invalid] }));
}
