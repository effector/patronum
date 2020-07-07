import { expectType, expectError } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
  sample,
} from 'effector';
import { condition } from '../condition';

// Correct pass type from source to then, else, and if
{
  const $source = createStore(0);

  expectType<Store<number>>(
    condition({
      source: $source,
      if: 1,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: 1,
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: 1,
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );

  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );

  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore(false),
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore(false),
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore(false),
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );
}

// Source can be any unit and correctly returns its type
{
  expectType<Store<string>>(
    condition({
      source: createStore(''),
      if: '',
      then: createEvent<string>(),
    }),
  );
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: '',
      then: createEvent<string>(),
    }),
  );
  expectType<Effect<string, number, boolean>>(
    condition({
      source: createEffect<string, number, boolean>(),
      if: '',
      then: createEvent<string>(),
    }),
  );
}

// Then and Else can be void
{
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: '',
      then: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: '',
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: '',
      then: createEvent<string>(),
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: '',
      then: createEvent<void>(),
      else: createEvent<void>(),
    }),
  );
}

// Infer type of source from result type
{
  condition({
    source: createStore(''),
    if: '',
    then: condition({
      if: '',
      then: createEvent(),
    }),
  });
}
