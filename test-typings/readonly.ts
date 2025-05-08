import { createDomain, createEffect, createEvent, createStore, Store, Event } from 'effector';
import { expectType } from 'tsd';
import { readonly } from '../dist/readonly';

// Always returns the store
{
  const $store = createStore<number>(1);

  expectType<Store<number>>(readonly($store));
}

// Always returns the store
{
  const $store = createStore<number>(1);
  const $mapped = $store.map(store => store)

  expectType<Store<number>>(readonly($mapped));
}

// Always returns the event
{
  const event = createEvent<void>();

  expectType<Event<void>>(readonly(event));
}

// Always returns the event
{
  const event = createEvent<void>();
  const mapped = event.map(event => event)

  expectType<Event<void>>(readonly(mapped));
}

// Should not receive non-store or non-event as argument
{
  // @ts-expect-error
  readonly(createEffect());
  
  // @ts-expect-error
  readonly(createDomain());

  // @ts-expect-error
  readonly(1);

  // @ts-expect-error
  readonly(true);

  // @ts-expect-error
  readonly({});
}
