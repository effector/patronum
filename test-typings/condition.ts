import { expectType } from 'tsd';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  Effect,
  Event,
  EventCallable,
  Store,
} from 'effector';
import { condition } from '../dist/condition';

// Correct pass type from source to then, else, and if
{
  const $source = createStore(0);

  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
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
      if: createStore<boolean>(false),
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore<boolean>(false),
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore<boolean>(false),
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
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
  expectType<Effect<string, number, boolean>>(
    condition({
      source: createEffect<string, number, boolean>(),
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
}

// Then and Else can be void
{
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<string>(),
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<void>(),
      else: createEvent<void>(),
    }),
  );
}

// Infer type of source from result type
{
  expectType<Store<string>>(
    condition({
      source: createStore(''),
      if: (a: string) => true,
      then: condition({
        if: (a) => typeof a === 'string',
        then: createEvent(),
      }),
    }),
  );
}

// If can be Store, function, or value
{
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: (v) => v === 1,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: createStore<boolean>(true),
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: (value: number) => value === 1,
      then: createEvent<number>(),
    }),
  );
  const source = createStore(0);
  const another = createStore(0);
  expectType<Store<number>>(
    condition({
      source,
      if: combine(source, another, (a, b) => a === b),
      then: createEvent<number>(),
    }),
  );
}

{
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: 1,
      then: createEvent<number>(),
    }),
  );

  expectType<Store<string>>(
    condition({
      source: createStore('hi'),
      if: 'hi',
      then: createEvent<string>(),
    }),
  );

  expectType<Store<boolean>>(
    condition({
      source: createStore(true),
      if: true,
      then: createEvent<boolean>(),
    }),
  );
}

// Disallow pass invalid type to then/else/if
{
  condition({
    source: createStore(0),
    if: 0,
    // @ts-expect-error 'string' is not assignable to 'number | void'
    then: createEvent<string>(),
  });

  condition({
    source: createStore<boolean>(false),
    // @ts-expect-error 'Console' is not assignable to `if`
    if: console,
    then: createEvent(),
  });

  condition({
    source: createStore<string>(''),
    // @ts-expect-error 'number' is not assignable to type 'boolean'
    if: (a) => 1,
    then: createEvent(),
  });
}

// Check source: void and if: Store<bool>
// https://github.com/effector/patronum/issues/81
{
  const fxVoid = createEffect<void, void, void>();
  const fxOtherVoid = createEffect<void, void, void>();
  const someEvent = createEvent<void>();
  const boolStore = createStore<boolean>(true);

  condition({
    source: someEvent,
    if: boolStore,
    then: fxVoid,
    else: fxOtherVoid,
  });
}

// allows nesting conditions
{
  condition({
    source: createEvent<'a' | 'b' | 1>(),
    if: (value): value is 'a' | 'b' => typeof value === 'string',
    then: condition<'a' | 'b'>({
      if: () => true,
      then: createEvent<'a'>(),
      else: createEvent<'b'>(),
    }),
  });
}

// returns `typeof source` when source is provided
{
  const source = createEvent<string | number>();

  expectType<typeof source>(
    condition({
      source,
      if: 'string?',
      then: createEvent<void>(),
    }),
  );
}

// Correctly passes type to `if`
{
  condition({
    source: createEvent<string>(),
    if: (payload) => (expectType<string>(payload), true),
    then: createEvent<string>(),
  });

  condition({
    source: createEvent<'complex' | 'type'>(),
    if: (payload) => (expectType<'complex' | 'type'>(payload), true),
    then: createEvent<void>(),
  });

  condition({
    source: createEvent<string>(),
    // @ts-expect-error 'string' is not assignable to type 'number'
    if: (_: number) => true,
    then: createEvent<void>(),
  });
}

// `Boolean` as type guard: disallows invalid type in `then`
{
  condition({
    source: createEvent<string | null>(),
    if: Boolean,
    // @ts-expect-error 'number' is not assignable to type 'string | void'
    then: createEvent<number>(),
  });
}

// `Boolean` as type guard: disallows invalid type in then/else
{
  condition({
    source: createEvent<string | null>(),
    if: Boolean,
    // @ts-expect-error 'number' is not assignable to type 'string | void'
    then: createEvent<number>(),
  });

  condition({
    source: createEvent<string | null>(),
    if: Boolean,
    // @ts-expect-error 'number' is not assignable to type 'string | void'
    else: createEvent<number>(),
  });
}

// `Boolean` as type guard: works for all sources
{
  expectType<EventCallable<string | null>>(
    condition({
      source: createEvent<string | null>(),
      if: Boolean,
      then: createEvent<string>(),
      else: createEvent<null>(),
    }),
  );

  expectType<EventCallable<string | null>>(
    condition({
      source: createStore<string | null>(null),
      if: Boolean,
      then: createEvent<string>(),
      else: createEvent<null>(),
    }),
  );

  expectType<EventCallable<string | null>>(
    condition({
      source: createEffect<string | null, void>(),
      if: Boolean,
      then: createEvent<string>(),
      else: createEvent<null>(),
    }),
  );
}

// `Boolean` as type guard: disallows invalid type in then/else
{
  condition({
    source: createEvent<string | null>(),
    if: Boolean,
    // @ts-expect-error
    then: createEvent<number>(),
  });

  condition({
    source: createEvent<string | null>(),
    if: Boolean,
    // @ts-expect-error
    else: createEvent<number>(),
  });
}
