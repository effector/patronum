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

// Allows to receive only literals as branches
{
  const $filter = createStore(true);
  expectType<Store<string | number>>(either($filter, 1, ''));
}

// Doens't allow to pass non-store as branches
{
  const $filter = createStore(true);

  // @ts-expect-error
  either($filter, createEvent(), createStore(''));

  // @ts-expect-error
  either($filter, createStore(''), createEvent());

  // @ts-expect-error
  either($filter, createEffect(), createEvent());

  // @ts-expect-error
  either($filter, createEffect(), createDomain());
}

// With config returns always store with merged type
{
  const $filter = createStore(true);
  const $first = createStore(0);
  const $second = createStore('');

  expectType<Store<number | string>>(
    either({ filter: $filter, then: $first, other: $second }),
  );
}

// With config doesn't allow non-boolean store as filter
{
  const $first = createStore(0);
  const $second = createStore('');

  // @ts-expect-error
  either({ filter: createStore(0), then: $first, other: $second });

  // @ts-expect-error
  either({ filter: createStore(''), then: $first, other: $second });

  // @ts-expect-error
  either({ filter: createStore([]), then: $first, other: $second });

  // @ts-expect-error
  either({ filter: createStore(null), then: $first, other: $second });
}

// With config doens't allow to pass non-store as branches
{
  const $filter = createStore(true);

  // @ts-expect-error
  either({ filter: $filter, then: createEvent(), other: createStore('') });

  // @ts-expect-error
  either({ filter: $filter, then: createStore(''), other: createEvent() });

  // @ts-expect-error
  either({ filter: $filter, then: createEffect(), other: createEvent() });

  // @ts-expect-error
  either({ filter: $filter, then: createEffect(), other: createDomain() });
}

// With config allows to receive only literals as branches
{
  const $filter = createStore(true);
  expectType<Store<string | number>>(either({ filter: $filter, then: 1, other: '' }));
}
