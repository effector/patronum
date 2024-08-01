import { createEffect, createEvent, createStore, is } from 'effector';
import { argumentHistory } from '../../test-library';
import { splitMap } from './index';

test('map from event', () => {
  const source = createEvent<{ first?: string; another?: boolean }>();
  const out = splitMap({
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
  const out = splitMap({
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
    [
      {
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
  const out = splitMap({
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
    [
      "first",
    ]
  `);

  source({ second: true });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
      "second",
    ]
  `);

  source({ default: 1000 });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
      "second",
      {
        "default": 1000,
      },
    ]
  `);
});

test('map from store', () => {
  const change = createEvent<string>();
  const $source = createStore('').on(change, (_, value) => value);

  const out = splitMap({
    source: $source,
    cases: {
      twoWords: (payload) => {
        const pair = payload.split(' ');
        return pair.length === 2 ? pair : undefined;
      },
      word: (payload) => (payload.match(/\w+/gim) ? payload : undefined),
    },
  });
  expect(is.event(out.twoWords)).toBe(true);
  expect(is.event(out.word)).toBe(true);

  const fn = jest.fn();
  out.twoWords.watch(fn);
  out.word.watch(fn);

  change('Demo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "Demo",
    ]
  `);

  change('Hello World');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "Demo",
      [
        "Hello",
        "World",
      ],
    ]
  `);
});

test('from readme', () => {
  const watchUpdate = jest.fn();
  const watchCreated = jest.fn();
  const watchDefault = jest.fn();

  type Action =
    | { type: 'update'; content: string }
    | { type: 'created'; value: number }
    | { type: 'another' };

  const serverActionReceived = createEvent<Action>();

  const received = splitMap({
    source: serverActionReceived,
    cases: {
      update: (action) => (action.type === 'update' ? action.content : undefined),
      created: (action) => (action.type === 'created' ? action.value : undefined),
    },
  });

  received.update.watch(watchUpdate);
  received.created.watch(watchCreated);
  received.__.watch(watchDefault);

  serverActionReceived({ type: 'created', value: 1 });
  expect(argumentHistory(watchCreated)).toMatchInlineSnapshot(`
    [
      1,
    ]
  `);
  expect(argumentHistory(watchUpdate)).toMatchInlineSnapshot(`[]`);
  expect(argumentHistory(watchDefault)).toMatchInlineSnapshot(`[]`);
  watchCreated.mockClear();
  watchUpdate.mockClear();
  watchDefault.mockClear();

  serverActionReceived({ type: 'update', content: 'demo' });
  expect(argumentHistory(watchCreated)).toMatchInlineSnapshot(`[]`);
  expect(argumentHistory(watchUpdate)).toMatchInlineSnapshot(`
    [
      "demo",
    ]
  `);
  expect(argumentHistory(watchDefault)).toMatchInlineSnapshot(`[]`);
  watchCreated.mockClear();
  watchUpdate.mockClear();
  watchDefault.mockClear();

  serverActionReceived({ type: 'another' });
  expect(argumentHistory(watchCreated)).toMatchInlineSnapshot(`[]`);
  expect(argumentHistory(watchUpdate)).toMatchInlineSnapshot(`[]`);
  expect(argumentHistory(watchDefault)).toMatchInlineSnapshot(`
    [
      {
        "type": "another",
      },
    ]
  `);
  watchCreated.mockClear();
  watchUpdate.mockClear();
  watchDefault.mockClear();
});

describe('with targets', () => {
  it('should trigger units in targets', () => {
    const source = createEvent<{ name?: string; age?: number }>();

    const ageTarget = createEvent<number>();
    const $nameTarget1 = createStore('');
    const nameTarget2 = createEvent<string>();
    const defaultCaseTarget = createEffect<void, void>();

    const { nameStringed, ageNumbered, __ } = splitMap({
      source,
      cases: {
        ageNumbered: ({ age }) => age,
        nameStringed: ({ name }) => name,
      },
      targets: {
        ageNumbered: ageTarget,
        nameStringed: [$nameTarget1, nameTarget2],
        __: defaultCaseTarget,
      },
    });

    const fnTargetAge = jest.fn();
    const fnTargetName1 = jest.fn();
    const fnTargetName2 = jest.fn();
    const fnTargetDefault = jest.fn();

    const fnAgeNumbered = jest.fn();
    const fnNameStringed = jest.fn();
    const fnDefaultCase = jest.fn();

    ageTarget.watch(fnTargetAge);
    $nameTarget1.updates.watch(fnTargetName1);
    nameTarget2.watch(fnTargetName2);
    defaultCaseTarget.watch(fnTargetDefault);

    ageNumbered.watch(fnAgeNumbered);
    nameStringed.watch(fnNameStringed);
    __.watch(fnDefaultCase);

    source({ age: 100 });

    expect(fnAgeNumbered).toHaveBeenNthCalledWith(1, 100);
    expect(fnTargetAge).toHaveBeenNthCalledWith(1, 100);

    source({ name: 'John' });

    expect(fnNameStringed).toHaveBeenNthCalledWith(1, 'John');
    expect(fnTargetName1).toHaveBeenNthCalledWith(1, 'John');

    source({});

    expect(fnDefaultCase).toBeCalledTimes(1);
    expect(fnTargetDefault).toBeCalledTimes(1);
  });

  it('should trigger all units in default case', () => {
    const source = createEvent<string>();

    const target1 = createEvent<string>();
    const $target2 = createStore('');
    const target3 = createEffect<string, void>();

    splitMap({
      source,
      cases: {},
      targets: {
        __: [target1, $target2, target3],
      },
    });

    const fnTarget1 = jest.fn();
    const fnTarget2 = jest.fn();
    const fnTarget3 = jest.fn();

    target1.watch(fnTarget1);
    $target2.updates.watch(fnTarget2);
    target3.watch(fnTarget3);

    source('Demo');

    expect(fnTarget1).toHaveBeenNthCalledWith(1, 'Demo');
    expect(fnTarget2).toHaveBeenNthCalledWith(1, 'Demo');
    expect(fnTarget3).toHaveBeenNthCalledWith(1, 'Demo');
  });
});
