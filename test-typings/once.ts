import { expectType } from 'tsd';
import {
  Event,
  createStore,
  createEvent,
  createEffect,
  createDomain,
  fork,
} from 'effector';
import { once } from '../src/once';

// Supports Event, Effect and Store as an argument
{
  expectType<Event<string>>(once(createEvent<string>()));
  expectType<Event<string>>(once(createEffect<string, void>()));
  expectType<Event<string>>(once(createStore<string>('')));
}

// Does not allow scope or domain as a first argument
{
  // @ts-expect-error
  once(createDomain());
  // @ts-expect-error
  once(fork());
}

// Correctly passes through complex types
{
  const source = createEvent<'string' | false>();
  expectType<Event<'string' | false>>(once(source));
}
