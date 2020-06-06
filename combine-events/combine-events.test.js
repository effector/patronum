const { createEvent } = require('effector');
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
