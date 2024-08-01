import { expectType } from 'tsd';
import {
  Store,
  Event,
  createStore,
  createEvent,
  createEffect,
  sample,
} from 'effector';
import { splitMap } from '../dist/split-map';

// partial destructuring throws an error #71
{
  const $settings = createStore({
    MIN_LVL: 42,
  });

  const someEvt = createEvent<{ lvl: number }>();

  const happened = sample({
    source: $settings,
    clock: someEvt,
    fn: (settings, payload) => ({ settings, payload }),
  });

  const { highLvl, lowLvl } = splitMap({
    source: happened,
    cases: {
      highLvl: ({ payload }) => (payload.lvl >= 50 ? payload.lvl : undefined),
      lowLvl: ({ settings, payload }) =>
        payload.lvl < settings.MIN_LVL ? payload.lvl : undefined,
    },
  });

  expectType<Event<number>>(highLvl);
  expectType<Event<number>>(lowLvl);
}

// Allow any unit as source
{
  const event = createEvent<number>();
  const $store = createStore(0);
  const effect = createEffect<string, void>();

  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: event,
      cases: {
        demo: () => true,
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: $store,
      cases: {
        demo: () => true,
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<string> }>(
    splitMap({
      source: effect,
      cases: {
        demo: () => true,
      },
    }),
  );
}

// Allow any unit as source (with targets)
{
  const event = createEvent<number>();
  const $store = createStore(0);
  const effect = createEffect<string, void>();

  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: event,
      cases: {
        demo: () => true,
      },
      targets: {
        demo: createEvent<boolean>(),
        __: createStore<number>(0),
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: $store,
      cases: {
        demo: () => true,
      },
      targets: {
        demo: createEffect<boolean, void>(),
        __: createEvent<number>(),
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<string> }>(
    splitMap({
      source: effect,
      cases: {
        demo: () => true,
      },
      targets: {
        demo: createStore<boolean>(true),
        __: createEffect<string, void>(),
      },
    }),
  );
}

// Has default case
{
  expectType<{ __: Event<number> }>(
    splitMap({ source: createEvent<number>(), cases: {} }),
  );
  expectType<{ __: Event<{ demo: number }> }>(
    splitMap({ source: createEvent<{ demo: number }>(), cases: {} }),
  );

  // with targets
  expectType<{ __: Event<number> }>(
    splitMap({
      source: createEvent<number>(),
      cases: {},
      targets: {
        __: createEvent<number>(),
      },
    }),
  );
  expectType<{ __: Event<{ demo: number }> }>(
    splitMap({
      source: createEvent<{ demo: number }>(),
      cases: {},
      targets: {
        __: createEvent<{ demo: number }>(),
      },
    }),
  );
}

// Omit undefined from object type
{
  interface Payload {
    key?: string;
  }
  const source = createEvent<Payload>();

  expectType<{ example: Event<string>; __: Event<Payload> }>(
    splitMap({
      source,
      cases: {
        example: (object) => object.key,
      },
    }),
  );

  expectType<{ example: Event<string>; __: Event<Payload> }>(
    splitMap({
      source,
      cases: {
        example: (object) => object.key,
      },
      targets: {
        example: createEvent<string>(),
        __: createEvent<Payload>(),
      },
    }),
  );
}

// Allow void units in targets
{
  splitMap({
    source: createEvent<{ name?: string; age?: number }>(),
    cases: {
      ageNumbered: ({ age }) => age,
      nameStringed: ({ name }) => name,
      doSome: () => true,
      doAnother: () => null,
    },
    targets: {
      ageNumbered: createEvent<number>(),
      nameStringed: [createStore<string>(''), createEffect<string, void>()],
      doSome: [createEvent<boolean>(), createEvent<void>()],
      doAnother: createEvent<void>(),
      __: createEvent<void>(),
    },
  });
}

// Allow array of units in targets default case
{
  splitMap({
    source: createEvent<string>(),
    cases: {},
    targets: {
      __: [
        createEvent<string>(),
        createStore<string>(''),
        createEffect<string, void>(),
      ],
    },
  });

  // Allow void units in targets default case
  splitMap({
    source: createEvent<string>(),
    cases: {},
    targets: {
      __: [createStore(''), createEvent<void>(), createEffect<void, void>()],
    },
  });
}

// Expect matching targets types with cases
{
  splitMap({
    source: createEvent<{ name?: string; age?: number }>(),
    cases: {
      ageNumbered: ({ age }) => age,
      nameStringed: ({ name }) => name,
      doSome: () => true,
      doAnother: () => null,
      foo: () => '',
    },
    targets: {
      // @ts-expect-error
      ageNumbered: createEvent<string>(),
      nameStringed: [
        // @ts-expect-error
        createStore<number>(''),
        // @ts-expect-error
        createEffect<number, void>(),
      ],
      doSome: [
        // @ts-expect-error
        createEvent<string>(),
        createEvent<void>(),
      ],
      doAnother: [
        // @ts-expect-error
        createEvent<boolean>(),
        // @ts-expect-error
        createEffect<string, void>(),
      ],
      foo: [
        // @ts-expect-error
        createEvent<number>(),
        // @ts-expect-error
        createEvent<number>(),
      ],
    },
  });

  splitMap({
    source: createEvent<string>(),
    cases: {},
    targets: {
      // @ts-expect-error
      __: createEvent<number>(),
    },
  });

  splitMap({
    source: createEvent<Array<number>>(),
    cases: {},
    targets: {
      __: [
        // @ts-expect-error
        createStore<string>(''),
        // @ts-expect-error
        createEvent<number>(),
        // @ts-expect-error
        createEffect<boolean, void>(),

        createEvent<void>(),
      ],
    },
  });
}

// case payloads should extend target units
{
  splitMap({
    source: createEvent<{ first?: string; second?: number }>(),
    cases: {
      first: ({ first }) => first, // will be string
      second: ({ second }) => second, // will be number
    },
    targets: {
      // string should extend string | null
      first: createEvent<string | null>(),

      // number should extend number | null
      // TODO: but not string, should expect error
      second: [createEvent<number | null>(), createEvent<string>()],
    },
  });
}
