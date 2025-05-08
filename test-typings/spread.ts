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

  expectType<Store<{ first: string; last: string; foo: number }>>(
    spread({
      source: createStore({ first: '', last: '', foo: 1 }),
      targets: {
        first,
        last,
        foo: [createEvent<number>(), createStore(1)],
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

  spread({
    source: createEvent<{ first: string; last: number }>(),
    targets: {
      first: createEvent<string>(),
      last: [
        createEvent<number>(),
        // TODO: should expect error
        createEvent<string>(),
      ],
    },
  });

  spread({
    source: createEvent<{ first: string; last: number }>(),
    targets: {
      // @ts-expect-error
      last: [createEvent<string>(), createEvent<string>()],
      first: createEvent<string>(),
    },
  });

  sample({
    // @ts-expect-error
    source: createEvent<{ first: string; last: number }>(),
    target: spread({
      first: createEvent<string>(),
      last: [createEvent<string>(), createEvent<string>()],
    }),
  });

  sample({
    // @ts-expect-error
    source: createEvent<{ first: string; last: number }>(),
    target: spread({
      targets: {
        first: createEvent<string>(),
        last: [createEvent<string>(), createEvent<string>()],
      },
    }),
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

// Check input source type with output (targets: array of units)
{
  expectType<Event<{ foo: string; bar: number; baz: boolean }>>(
    spread({
      source: createEvent<{ foo: string; bar: number; baz: boolean }>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
        baz: [createEvent<boolean>(), createEvent<boolean>()],
      },
    }),
  );

  expectType<Store<{ random: string; bar: number; baz: boolean }>>(
    spread({
      source: createStore({ random: '', bar: 5, baz: true }),
      targets: {
        random: createEvent<string>(),
        bar: createEvent<number>(),
        baz: [createEvent<boolean>(), createEvent<boolean>()],
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number; baz: boolean }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number; baz: boolean }, void>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
        baz: [createEvent<boolean>(), createEvent<boolean>()],
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

// Check target different units (targets: array of units)
{
  expectType<Event<{ foo: string; bar: number; baz: boolean }>>(
    spread({
      source: createEvent<{ foo: string; bar: number; baz: boolean }>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
        baz: [createEvent<boolean>(), createStore(true)],
      },
    }),
  );

  expectType<Store<{ foo: string; bar: number; baz: boolean }>>(
    spread({
      source: createStore({ foo: '', bar: 5, baz: true }),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
        baz: [createEvent<boolean>(), createEffect<boolean, void>()],
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number; baz: boolean }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number; baz: boolean }, void>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
        baz: [createStore(true), createEffect<boolean, void>()],
      },
    }),
  );
}

// Check target is prepended if type is given to generic or callback
{
  expectType<Event<{ foo: string; bar: number; baz: string }>>(
    spread({
      source: createEvent<{ foo: string; bar: number; baz: string }>(),
      targets: {
        foo: createEvent<number>().prepend<string>((string) => string.length),
        bar: createEvent<number>(),
        baz: createEvent<boolean>().prepend((str: string) => Boolean(str)),
      },
    }),
  );

  expectType<Event<{ foo: string; bar: number; baz: string }>>(
    // @ts-expect-error
    spread({
      source: createEvent<{ foo: string; bar: number; baz: string }>(),
      targets: {
        // @ts-expect-error (Type 'boolean' is not assignable to type 'number')
        foo: createEvent<number>().prepend<boolean>((str) => str),
        bar: createEvent<number>(),
        // @ts-expect-error (Type 'string' is not assignable to type 'boolean')
        baz: createEvent<boolean>().prepend((str: string) => str),
      },
    }),
  );

  expectType<Event<{ foo: string; bar: number; baz: boolean; zoo: string }>>(
    spread({
      source: createEvent<{ foo: string; bar: number; baz: boolean; zoo: string }>(),
      targets: {
        foo: createEvent<number>().prepend((string: string) => string.length),
        bar: createEvent<number>(),
        baz: [
          createEvent<string>().prepend<boolean>((bool) =>
            Boolean(expectType<boolean>(bool)) ? 'true' : 'false',
          ),
          createEvent<number>().prepend((bool: boolean) =>
            Boolean(expectType<boolean>(bool)) ? 1 : 0,
          ),
        ],
        zoo: [createEvent<string>()],
      },
    }),
  );

  expectType<Event<{ foo: string; bar: number; baz: boolean; zoo: string }>>(
    // @ts-expect-error
    spread({
      source: createEvent<{ foo: string; bar: number; baz: boolean; zoo: string }>(),
      targets: {
        // @ts-expect-error
        foo: createEvent<number>().prepend<boolean>((str) => str),
        bar: createEvent<number>(),
        baz: [
          // @ts-expect-error
          createEvent<string>().prepend<boolean>((bool) => bool),
          // @ts-expect-error
          createEvent<number>().prepend((bool: boolean) => bool),
        ],
        zoo: [createEvent<string>()],
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

  const spreadToUnits = spread({
    targets: {
      foo: createStore(''),
      bar: createEffect<number, void>(),
      baz: createEvent<boolean>(),
      last: [createEvent<null>(), createStore(null)],
    },
  });

  expectType<Event<{ foo?: string; bar?: number; baz?: boolean; last?: null }>>(
    spreadToUnits,
  );
}
{
  const spreadToStores = spread({
    foo: createStore(''),
    bar: createEffect<number, void>(),
    baz: createEvent<boolean>(),
  });

  expectType<Event<{ foo?: string; bar?: number; baz?: boolean }>>(spreadToStores);

  const spreadToUnits = spread({
    foo: createStore(''),
    baz: createEvent<boolean>(),
    last: [createEvent<null>(), createStore(null)],
  });

  expectType<Event<{ foo?: string; bar?: number; baz?: boolean; last?: null }>>(
    spreadToUnits,
  );
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
  spread({
    source: createEffect<{ first: string; last: string }, void>(),
    targets: {
      first: [createEvent<string>(), createStore('')],
    },
  });
}

// Payload type should extend target type
{
  spread({
    source: createStore({ data: 0 }),
    targets: {
      // number should extend number | null
      data: createStore<number | null>(0),
    },
  });
}

// allows nested
{
  const $source = createStore({ first: '', last: { nested: '', other: '' } });
  const $secondSource = createStore({
    first: '',
    last: { nested: '', other: '', arr: 1 },
  });
  const first = createEvent<string>();
  const nested = createEvent<string>();
  const other = createEvent<string>();
  const arrayOfUnits = [createEvent<number>(), createStore(1)];

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

  spread({
    source: $secondSource,
    targets: {
      first,
      last: spread({
        targets: {
          nested,
          other,
          arr: arrayOfUnits,
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

  const secondOut = spread({
    targets: {
      nested,
      other,
      arr: arrayOfUnits,
    },
  });

  spread({
    source: $secondSource,
    targets: {
      first,
      last: secondOut,
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

  sample({
    clock: $secondSource,
    target: spread({
      targets: {
        first,
        last: spread({
          targets: {
            nested,
            other,
            arr: arrayOfUnits,
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
{
  const $source = createStore({ first: '', last: { nested: '', other: '' } });
  const $secondSource = createStore({
    first: '',
    last: { nested: '', other: '', arr: 1 },
  });
  const first = createEvent<string>();
  const nested = createEvent<string>();
  const other = createEvent<string>();
  const arrayOfUnits = [createEvent<number>(), createStore(1)];

  // nested full match
  spread({
    source: $source,
    targets: {
      first,
      last: spread({
        nested,
        other,
      }),
    },
  });

  spread({
    source: $secondSource,
    targets: {
      first,
      last: spread({
        nested,
        other,
        arr: arrayOfUnits,
      }),
    },
  });

  // nested partial match
  spread({
    source: $source,
    targets: {
      first,
      last: spread({ nested }),
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
    nested,
    other,
  });

  spread({
    source: $source,
    targets: {
      first,
      last: out,
    },
  });

  const secondOut = spread({
    nested,
    other,
    arr: arrayOfUnits,
  });

  spread({
    source: $secondSource,
    targets: {
      first,
      last: secondOut,
    },
  });

  // nested partial match outer
  const outPart = spread({ nested });

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
    target: spread({ first }),
  });

  // sample full match
  sample({
    clock: $source,
    target: spread({
      first,
      last: spread({
        nested,
        other,
      }),
    }),
  });

  sample({
    clock: $secondSource,
    target: spread({
      first,
      last: spread({
        nested,
        other,
        arr: arrayOfUnits,
      }),
    }),
  });

  // sample wrong match
  sample({
    // @ts-expect-error
    clock: $source,
    target: spread({
      first,
      last: other,
    }),
  });
}
