import { createStore, createEvent, restore } from 'effector';
import { argumentHistory, monitor } from '../../test-library';
import { condition } from './index';

test('source: event, if: store, then: event', () => {
  const source = createEvent<string>();
  const $if = createStore(false);
  const target = createEvent<string>();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source,
    if: $if,
    then: target,
  });

  source('bar');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`[]`);

  // @ts-expect-error setState is internal
  $if.setState(true);
  source('foo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "foo",
    ]
  `);
});

test('source: event, if: store, then: event, else: event', () => {
  const source = createEvent<string>();
  const $if = createStore(false);
  const target = createEvent<string>();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source,
    if: $if,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  source('bar');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: bar",
    ]
  `);

  // @ts-expect-error setState is internal
  $if.setState(true);
  source('foo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: bar",
      "then: foo",
    ]
  `);
});

test('source: store, if: store, then: event, else: event', () => {
  const change = createEvent<number>();
  const $source = restore(change, 0);

  const setCond = createEvent<boolean>();
  const $if = restore(setCond, false);

  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: $if,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
    ]
  `);

  setCond(true);
  change(2);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
      "then: 2",
    ]
  `);
});

test('source: store, if: function, then: event, else: event', () => {
  const change = createEvent<number>();
  const $source = restore(change, 0);

  const target = createEvent<string>();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: (value) => value > 2,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
    ]
  `);

  change(3);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
      "then: 3",
    ]
  `);
});

test('source: store, if: literal, then: event, else: event', () => {
  const change = createEvent<number>();
  const $source = restore(change, 0);

  const target = createEvent<string>();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: (a) => a === 2,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
    ]
  `);

  change(2);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "else: 1",
      "then: 2",
    ]
  `);
});

test('source: event, if: store, then: event, else: condition', () => {
  const source = createEvent<number>();
  const target = createEvent<string>();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source,
    if: (value) => value < 2,
    then: target.prepend((value) => `${value} < 2`),
    else: condition({
      if: (value) => value < 4,
      then: target.prepend((value) => `2 <= ${value} < 4`),
      else: target.prepend((value) => `4 <= ${value}`),
    }),
  });

  source(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "1 < 2",
    ]
  `);

  source(3);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "1 < 2",
      "2 <= 3 < 4",
    ]
  `);

  source(5);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "1 < 2",
      "2 <= 3 < 4",
      "4 <= 5",
    ]
  `);
});

test('does not trigger twice if branch change predicate state', () => {
  const randomTrigger = createEvent();
  const thenEvent = createEvent();
  const elseEvent = createEvent();
  const $predicate = createStore(true);

  $predicate.on(thenEvent, () => false);
  condition({
    source: randomTrigger,
    if: $predicate,
    then: thenEvent,
    else: elseEvent,
  });
  const history = monitor([randomTrigger, thenEvent, elseEvent, $predicate]);

  const onThen = jest.fn();
  const onElse = jest.fn();

  thenEvent.watch(onThen);
  elseEvent.watch(onElse);

  randomTrigger();

  expect(history()).toMatchInlineSnapshot(`
    [
      [
        "Store $predicate",
        true,
      ],
      [
        "Event randomTrigger",
        undefined,
      ],
      [
        "Event thenEvent",
        undefined,
      ],
      [
        "Store $predicate",
        false,
      ],
    ]
  `);

  expect(onThen).toHaveBeenCalledTimes(1);
  expect(onElse).not.toHaveBeenCalled();
});
