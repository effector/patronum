import { expectType, expectError } from 'tsd';
import { Store, createStore } from 'effector';
import { some } from '../some';

// Check invalid type for number predicate
{
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some(0, [$a, $b]));

  expectError(some(0, [$a, $invalid]));
}

// Check types for string enum
{
  type Enum = 'a' | 'b' | 'c';
  const $a = createStore<Enum>('a');
  const $b = createStore<Enum>('c');
  const $invalid = createStore('d');

  const value: Enum = 'c';

  expectType<Store<boolean>>(some(value, [$a, $b]));
  expectError(some(value, [$a, $invalid]));
  expectError(some('demo', [$a, $b]));
}

// Check function predicate
{
  const predicate = (value: number) => value > 0;
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(some(predicate, [$a, $b]));
  expectError(some(predicate, [$a, $invalid]));
}
