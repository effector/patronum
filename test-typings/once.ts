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

// Supports Event, Effect and Store as source in config
{
  expectType<Event<string>>(once({ source: createEvent<string>() }));
  expectType<Event<string>>(once({ source: createEffect<string, void>() }));
  expectType<Event<string>>(once({ source: createStore<string>('') }));
}

// Does not allow scope or domain as source or reset
{
  // @ts-expect-error
  once(createDomain());
  // @ts-expect-error
  once(fork());

  // @ts-expect-error
  once({ source: createDomain() });
  // @ts-expect-error
  once({ source: fork() });

  // @ts-expect-error
  once({ source: createEvent(), reset: createDomain() });
  // @ts-expect-error
  once({ source: createEvent(), reset: fork() });
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
