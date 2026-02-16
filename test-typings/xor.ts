import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createDomain,
  createEvent,
  createEffect,
} from 'effector';
import { xor } from '../dist/xor';

// Returns always store with boolean
{
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  expectType<Store<boolean>>(xor($a, $b, $c, $d, $e, $f, $g));
}

// Doesn't allow to pass non-store as argument
{
  // @ts-expect-error
  xor(createDomain());

  // @ts-expect-error
  xor(createEvent());

  // @ts-expect-error
  xor(createEffect());
}

// Allows to receive derived stores
{
  const $source = createStore(1);
  const $derived = $source.map((i) => i * 100);
  const fx = createEffect();

  expectType<Store<boolean>>(xor($derived, fx.pending));
}
