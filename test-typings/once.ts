import { expectType } from 'tsd';
import {
  Event,
  createStore,
  createEvent,
  createEffect,
  createDomain,
  fork,
} from 'effector';
import { once } from '../dist/once';

// Supports Event, Effect and Store as an argument
{
  expectType<Event<string>>(once(createEvent<string>()));
  expectType<Event<string>>(once(createEffect<string, void>()));
  expectType<Event<string>>(once(createStore<string>('')));
}

// Supports Event, Effect and Store as source in config
{
  expectType<Event<string>>(once({ source: createEvent<string>() }));
  expectType<Event<string>>(once({ source: createEffect<string, void>() }));
  expectType<Event<string>>(once({ source: createStore<string>('') }));
}

// Correctly passes through complex types
{
  const source = createEvent<'string' | false>();
  expectType<Event<'string' | false>>(once(source));
}

// Requires source in config form
{
  // @ts-expect-error
  once({
    /* No source */
  });

  // @ts-expect-error
  once({
    /* No source */
    reset: createEvent<void>(),
  });
}

// Accepts reset in config form
{
  const source = createEvent<string>();

  expectType<Event<string>>(once({ source, reset: createEvent<'string'>() }));
  expectType<Event<string>>(once({ source, reset: createStore('string') }));
  expectType<Event<string>>(once({ source, reset: createEffect<number, void>() }));
}
