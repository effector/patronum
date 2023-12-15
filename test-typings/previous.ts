import { expectType } from 'tsd';
import { Store, createStore, createEvent } from 'effector';
import { previous } from '../dist/previous';

{
  const $foo = createStore('a');
  const $fooPrev = previous($foo);

  expectType<Store<string | null>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previous($foo, 'b');

  expectType<Store<string>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previous($foo, 0);

  expectType<Store<string | number>>($fooPrev);
}
{
  const $foo = createStore('a');
  const $fooPrev = previous($foo, undefined);

  expectType<Store<string | void>>($fooPrev);
}
{
  const foo = createEvent();

  // @ts-expect-error
  previous(foo, 0);
}
