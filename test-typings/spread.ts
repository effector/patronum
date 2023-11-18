import { expectType } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
  sample,
} from 'effector';
import { spread } from '../dist/spread';

{
  const $source = createStore({ first: '', last: '' });
  const first = createEvent<string>();
  const last = createEvent<string>();

  expectType<Store<{ first: string; last: string }>>(
    spread({
      source: $source,
      targets: {
        first,
        last,
      },
    }),
  );
}

// Expect matching object types
{
  // @ts-expect-error
  spread({
    source: createEvent<{ first: string; last: string }>(),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });

  // @ts-expect-error
  spread({
    source: createStore({ first: '', last: '' }),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });

  // @ts-expect-error
  spread({
    source: createEffect<{ first: string; last: string }, void>(),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });
}

// Check input source type with output
{
  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );

  expectType<Store<{ random: string; bar: number }>>(
    spread({
      source: createStore({ random: '', bar: 5 }),
      targets: {
        random: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number }, void>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );
}

// Check target different units
{
  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );

  expectType<Store<{ foo: string; bar: number }>>(
    spread({
      source: createStore({ foo: '', bar: 5 }),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number }, void>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );
}

// Check target is prepended
{
  const foo = createEvent<number>();

  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: foo.prepend((string) => string.length),
        bar: createEvent<number>(),
      },
    }),
  );
}

// Check target different units without source
{
  const spreadToStores = spread({
    targets: {
      foo: createStore(''),
      bar: createEffect<number, void>(),
      baz: createEvent<boolean>(),
    },
  });

  expectType<Event<{ foo?: string; bar?: number; baz?: boolean }>>(spreadToStores);
}

// Example from readme with nullability
{
  interface Form {
    first: string;
    last: string;
  }

  const save = createEvent<Form | null>();
  const $form = createStore<Form | null>(null).on(save, (_, form) => form);

  const firstNameChanged = createEvent<string>();
  const lastNameChanged = createEvent<string>();

  spread({
    source: $form,
    targets: {
      first: firstNameChanged,
      last: lastNameChanged,
    },
  });
}

// Allow partial
{
  spread({
    source: createEvent<{ first: string; last: string }>(),
    targets: {
      first: createEvent<string>(),
    },
  });
  spread({
    source: createStore({ foo: '', bar: 5 }),
    targets: {
      foo: createEvent<string>(),
    },
  });
  spread({
    source: createEffect<{ first: string; last: string }, void>(),
    targets: {
      first: createEvent<string>(),
    },
  });
}

// allows nested
{
  const $source = createStore({ first: '', last: { nested: '', other: '' } });
  const first = createEvent<string>();
  const nested = createEvent<string>();
  const other = createEvent<string>();

  // nested full match
  spread({
    source: $source,
    targets: {
      first,
      last: spread({
        targets: {
          nested,
          other,
        },
      }),
    },
  });

  // nested partial match
  spread({
    source: $source,
    targets: {
      first,
      last: spread({
        targets: {
          nested,
        },
      }),
    },
  });

  // nested wrong match
  // @ts-expect-error
  spread({
    source: $source,
    targets: {
      first,
      last: other,
    },
  });

  // nested full match outer
  const out = spread({
    targets: {
      nested,
      other,
    },
  });

  spread({
    source: $source,
    targets: {
      first,
      last: out,
    },
  });

  // nested partial match outer
  const outPart = spread({
    targets: {
      nested,
    },
  });

  spread({
    source: $source,
    targets: {
      first,
      last: outPart,
    },
  });

  // sample partial match
  sample({
    clock: $source,
    target: spread({
      targets: {
        first,
      },
    }),
  });

  // sample full match
  sample({
    clock: $source,
    target: spread({
      targets: {
        first,
        last: spread({
          targets: {
            nested,
            other,
          },
        }),
      },
    }),
  });

  // sample wrong match
  sample({
    // @ts-expect-error
    clock: $source,
    target: spread({
      targets: {
        first,
        last: other,
      },
    }),
  });
}
