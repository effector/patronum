import { createDomain, createEffect, createStore, Store } from 'effector';
import { expectType } from 'tsd';
import { not } from '../dist/not';

// Always returns the store
{
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  expectType<Store<boolean>>(not($a));
  expectType<Store<boolean>>(not($b));
  expectType<Store<boolean>>(not($c));
  expectType<Store<boolean>>(not($d));
  expectType<Store<boolean>>(not($e));
  expectType<Store<boolean>>(not($f));
  expectType<Store<boolean>>(not($g));
}

// Should not receive non-store as argument
{
  // @ts-expect-error
  not(createEffect());

  // @ts-expect-error
  not(createEvent());

  // @ts-expect-error
  not(createDomain());

  // @ts-expect-error
  not(1);

  // @ts-expect-error
  not(true);

  // @ts-expect-error
  not({});
}
