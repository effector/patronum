import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createDomain,
  createEvent,
  createEffect,
} from 'effector';
import { either } from '../src/either';

// Returns always store with merged type
{
  const $filter = createStore(true);
  const $first = createStore(0);
  const $second = createStore('');

  expectType<Store<number | string>>(either($filter, $first, $second));
}

// Doesn't allow non-boolean store as filter
{
  const $first = createStore(0);
  const $second = createStore('');

  // @ts-expect-error
  either(createStore(0), $first, $second);

  // @ts-expect-error
  either(createStore(''), $first, $second);

  // @ts-expect-error
  either(createStore([]), $first, $second);

  // @ts-expect-error
  either(createStore(null), $first, $second);
}

// Doens't allow to pass non-store as branches
{
  const $filter = createStore(true);

  // TODO: fix that
  either($filter, createEvent(), createStore(''));

  // TODO: fix that
  either($filter, createStore(''), createEvent());

  // TODO: fix that
  either($filter, createEffect(), createEvent());

  // TODO: fix that
  either($filter, createEffect(), createDomain());
}
