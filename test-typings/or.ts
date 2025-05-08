import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createDomain,
  createEvent,
  createEffect,
} from 'effector';
import { or } from '../dist/or';

// Returns always store with boolean
{
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  expectType<Store<boolean>>(or($a, $b, $c, $d, $e, $f, $g));
}

// Doesn't allow to pass non-store as argument
{
  // @ts-expect-error
  or(createDomain());

  // @ts-expect-error
  or(createEvent());

  // @ts-expect-error
  or(createEffect());
}

// Allows to receive derived stores
{
  const $source = createStore(1);
  const $derived = $source.map((i) => i * 100);
  const fx = createEffect();

  expectType<Store<boolean>>(or($derived, fx.pending));
}
