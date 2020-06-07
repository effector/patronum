const { createEvent, restore } = require('effector');
const { combineEvents } = require('./index');

const argumentHistory = (fn) => fn.mock.calls.map(([argument]) => argument);

test('source: shape', () => {
  const fn = jest.fn();

  const event1 = createEvent();
  const event2 = createEvent();
  const event3 = createEvent();
  const event4 = createEvent();
  const event5 = createEvent();

  const event = combineEvents({
    event1,
    event2,
    event3,
    event4,
    event5,
  });

  event.watch(fn);

  event1();
  event1();
  event2('-');
  event3('c');
  event2('b');
  event2();
  event4();
  event4('d');
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
    ]
  `);

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3();

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
    ]
  `);

  event4('-');
  event4();
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
    ]
  `);

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');
  event4('-');
  event4('4');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
    ]
  `);

  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
      Object {
        "event1": "1",
        "event2": "2",
        "event3": "3",
        "event4": "4",
        "event5": "5",
      },
    ]
  `);
});

test('source: array', () => {
  const fn = jest.fn();

  const event1 = createEvent();
  const event2 = createEvent();
  const event3 = createEvent();
  const event4 = createEvent();
  const event5 = createEvent();

  const event = combineEvents([event1, event2, event3, event4, event5]);

  event.watch(fn);

  event1();
  event1();
  event2('-');
  event3('c');
  event2('b');
  event2();
  event4();
  event4('d');
  event5('e');

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3();
  event4('-');
  event4();
  event5('e');

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');
  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        undefined,
        undefined,
        "c",
        "d",
        "e",
      ],
      Array [
        "a",
        "b",
        undefined,
        undefined,
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);
});

test('example from readme', () => {
  const fn = jest.fn();

  const event1 = createEvent();
  const event2 = createEvent();
  const event3 = createEvent();

  const event = combineEvents({
    event1,
    event2,
    event3,
  });

  event.watch(fn);

  event1(true);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event2('demo');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event3(5);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": true,
        "event2": "demo",
        "event3": 5,
      },
    ]
  `);
});

test('reset', () => {
  const fn = jest.fn();

  const event1 = createEvent();
  const event2 = createEvent();
  const event3 = createEvent();
  const event4 = createEvent();
  const event5 = createEvent();

  const event = combineEvents([event1, event2, event3, event4, event5]);

  event.watch(fn);

  event1();
  event1();
  event2('-');
  event3('c');
  event2('b');
  event2();
  event4();
  event4('d');
  event5('e');

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3();
  event4('-');
  event4();
  event5('e');

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');
  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        undefined,
        undefined,
        "c",
        "d",
        "e",
      ],
      Array [
        "a",
        "b",
        undefined,
        undefined,
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);
});

test('reset', () => {
  const fn = jest.fn();

  const event1 = createEvent();
  const event2 = createEvent();
  const event3 = createEvent();
  const event4 = createEvent();
  const event5 = createEvent();
  const reset = createEvent();

  const event = combineEvents([event1, event2, event3, event4, event5], reset);

  event.watch(fn);

  event1();
  event1('a');
  event2('-');
  event3('c');
  event2('b');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event2();
  event4();
  reset(); // reset

  event4('d');
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3(); // triggers

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4();
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  reset();

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  event4('-');
  event4('4');
  reset();
  event5('5');
  event5('-');

  const a = createEvent();
  const b = createEvent();
  const c = createEvent();
  const renew = createEvent();
  const store = restore(renew, null);

  const abc = combineEvents({ a, b, c }, store);

  abc.watch(fn);

  a({ x: 0 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  b(() => true);
  c();

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => false);
  renew(1);
  a({ x: 1 });
  c();
  a({ x: 2 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => true);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
      Object {
        "a": Object {
          "x": 2,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);
});
