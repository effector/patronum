import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createDomain,
  createEvent,
  createEffect,
} from 'effector';
import { and } from '../src/and';

// Returns always store with boolean
{
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  expectType<Store<boolean>>(and($a, $b, $c, $d, $e, $f, $g));
}

// Doesn't allow to pass non-store as argument
{
  // @ts-expect-error
  and(createDomain());

  // @ts-expect-error
  and(createEvent());

  // @ts-expect-error
  and(createEffect());
}

// Allows to receive derived stores
{
  const $source = createStore(1);
  const $derived = $source.map((i) => i * 100);
  const fx = createEffect();

  expectType<Store<boolean>>(and($derived, fx.pending));
}
