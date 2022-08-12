import { expectType } from 'tsd';
import { createStore, Store } from 'effector';
import { format } from '../src/format';

// Allows stores with any value and returns Store<string>
{
  const $string = createStore('foobar');
  const $number = createStore(42);
  const $boolean = createStore(true);
  const $map = createStore(new Map());
  const $arrayAnyValue = createStore([
    'foobar',
    false,
    1,
    null,
    undefined,
    global,
    { foo: 'bar ' },
    new Set(),
    new Map(),
  ]);

  expectType<Store<string>>(format`${$string} ${$number} ${$boolean} ${$map}`);
  expectType<Store<string>>(format`All kind of values ${$arrayAnyValue}`);
}
