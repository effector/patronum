import { createEvent, createStore, is } from 'effector';
import { argumentHistory } from '../../test-library';
import { cut } from './index';

test('map from event', () => {
  const source = createEvent<{ first?: string; another?: boolean }>();
  const out = cut({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });
  expect(is.event(out.first)).toBe(true);

  const fn = jest.fn();
  out.first.watch(fn);

  source({ first: 'Demo' });
  expect(fn).toBeCalledTimes(1);
  expect(fn).toBeCalledWith('Demo');

  source({ another: true });
  expect(fn).toBeCalledTimes(1);
});

test('default case from event', () => {
  const source = createEvent<{ first?: string; another?: string }>();
  const out = cut({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });
  expect(is.event(out.first)).toBe(true);

  const fnFirst = jest.fn();
  out.first.watch(fnFirst);
  const fnDefault = jest.fn();
  // eslint-disable-next-line no-underscore-dangle
  out.__.watch(fnDefault);

  source({ another: 'Demo' });
  expect(fnFirst).toBeCalledTimes(0);

  expect(fnDefault).toBeCalledTimes(1);
  expect(argumentHistory(fnDefault)).toMatchInlineSnapshot(`
    Array [
      Object {
        "another": "Demo",
      },
    ]
  `);
});

test('fall through from event', () => {
  const source = createEvent<{
    first?: string;
    second?: boolean;
    default?: number;
  }>();
  const out = cut({
    source,
    cases: {
      first: (payload) => (payload.first ? 'first' : undefined),
      second: (payload) => (payload.second ? 'second' : undefined),
    },
  });
  expect(is.event(out.first)).toBe(true);

  const fn = jest.fn();
  out.first.watch(fn);
  out.second.watch(fn);
  // eslint-disable-next-line no-underscore-dangle
  out.__.watch(fn);

  source({ first: 'Demo' });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
    ]
  `);

  source({ second: true });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
      "second",
    ]
  `);

  source({ default: 1000 });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
      "second",
      Object {
        "default": 1000,
      },
    ]
  `);
});

test('map from store', () => {
  const change = createEvent<string>();
  const $source = createStore('').on(change, (_, value) => value);

  const out = cut({
    source: $source,
    cases: {
      twoWords: (payload) => {
        const pair = payload.split(' ');
        return pair.length === 2 ? pair : undefined;
      },
      firstWord: (payload) => {
        const word = payload.match(/^[a-zA-Z]+/);
        return word ? word[0] : undefined;
      },
    },
  });
  expect(is.event(out.twoWords)).toBe(true);
  expect(is.event(out.firstWord)).toBe(true);

  const twoWordsFn = jest.fn();
  const firstWordFn = jest.fn();
  out.twoWords.watch(twoWordsFn);
  out.firstWord.watch(firstWordFn);

  change('Demo');

  expect(argumentHistory(firstWordFn)).toMatchInlineSnapshot(`
  Array [
    "Demo",
  ]
  `);
  expect(argumentHistory(twoWordsFn)).toMatchInlineSnapshot(`Array []`);

  firstWordFn.mockClear();
  twoWordsFn.mockClear();

  change('Hello World');
  expect(argumentHistory(firstWordFn)).toMatchInlineSnapshot(`
  Array [
    "Hello",
  ]
  `);
  expect(argumentHistory(twoWordsFn)).toMatchInlineSnapshot(`
  Array [
    Array [
      "Hello",
      "World",
    ],
  ]
  `);
});

test('all case fired', async () => {
  const watchFailed = jest.fn();
  const watchCompleted = jest.fn();

  type Task = {
    id: number;
    status: 'failed' | 'completed';
  };
  type ActionResult = Task[];

  const taskReceived = createEvent<ActionResult>();

  const received = cut({
    source: taskReceived,
    cases: {
      failed: (tasks) => tasks.filter((task) => task.status === 'failed'),
      completed: (tasks) => tasks.filter((task) => task.status === 'completed'),
    },
  });

  received.failed.watch(watchFailed);
  received.completed.watch(watchCompleted);

  taskReceived([
    { id: 1, status: 'completed' },
    { id: 2, status: 'failed' },
  ]);
  expect(argumentHistory(watchFailed)).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "id": 2,
            "status": "failed",
          },
        ],
      ]
    `);
  expect(argumentHistory(watchCompleted)).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "id": 1,
          "status": "completed",
        },
      ],
    ]
  `);
});

test('from readme', () => {
  type WSInitEvent = { type: 'init'; key: string };
  type WSIncrementEvent = { type: 'increment'; count: number; name: string };
  type WSResetEvent = { type: 'reset'; name: string };
  type WSEvent = WSInitEvent | WSIncrementEvent | WSResetEvent;

  const websocketEventReceived = createEvent<WSEvent[]>();

  const received = cut({
    source: websocketEventReceived,
    cases: {
      init: (events) =>
        events.filter(
          (wsEvent: WSEvent): wsEvent is WSInitEvent => wsEvent.type === 'init',
        ),
      increment: (events) =>
        events.filter(
          (wsEvent: WSEvent): wsEvent is WSIncrementEvent =>
            wsEvent.type === 'increment',
        ),
      reset: (events) =>
        events.filter(
          (wsEvent: WSEvent): wsEvent is WSResetEvent => wsEvent.type === 'reset',
        ),
    },
  });

  const watchInit = jest.fn();
  const watchIncrement = jest.fn();
  const watchReset = jest.fn();

  received.init.watch(watchInit);
  received.increment.watch(watchIncrement);
  received.reset.watch(watchReset);

  websocketEventReceived([
    { type: 'increment', name: 'demo', count: 5 },
    { type: 'increment', name: 'demo', count: 15 },
  ]);
  expect(argumentHistory(watchIncrement)).toMatchInlineSnapshot(`
  Array [
    Array [
      Object {
        "count": 5,
        "name": "demo",
        "type": "increment",
      },
      Object {
        "count": 15,
        "name": "demo",
        "type": "increment",
      },
    ],
  ]
`);
  expect(argumentHistory(watchInit)).toMatchInlineSnapshot(`
  Array [
    Array [],
  ]
`);
  expect(argumentHistory(watchReset)).toMatchInlineSnapshot(`
  Array [
    Array [],
  ]
`);
  watchInit.mockClear();
  watchIncrement.mockClear();
  watchReset.mockClear();
});
