import { expectType } from 'tsd';
import { Store, createStore, createEvent } from 'effector';
import { previousValue } from '../dist/previous-value';

{
  const $foo = createStore('a');
  const $fooPrev = previousValue($foo);

  expectType<Store<string | null>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previousValue($foo, 'b');

  expectType<Store<string>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previousValue($foo, 0);

  expectType<Store<string | number>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previousValue($foo, undefined);

  expectType<Store<string | void>>($fooPrev);
}
{
  const foo = createEvent();

  // @ts-expect-error
  previousValue(foo, 0);
}
