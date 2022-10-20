import { allSettled, createEvent, createStore, fork } from 'effector';
import { either } from './index';
import { not } from '../not';
import { argumentHistory, watch } from '../../test-library';

test('selects correct store', async () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $other = createStore({ another: true });
  const $result = either($filter, $then, $other);

  const scope = fork();
  expect(scope.getState($result)).toBe('first');

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toEqual({ another: true });
});

test('selects correct literal for second argument or store', async () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $result = either($filter, $then, { another: true });

  const scope = fork();
  expect(scope.getState($result)).toBe('first');

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toEqual({ another: true });
});

test('selects correct literal for first argument or store', async () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $other = createStore({ another: true });
  const $result = either($filter, 'first', $other);

  const scope = fork();
  expect(scope.getState($result)).toBe('first');

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toEqual({ another: true });
});

test('selects correct literals', async () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $result = either($filter, 'first', { another: true });

  const scope = fork();
  expect(scope.getState($result)).toBe('first');

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toEqual({ another: true });
});

test('works with not', async () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $other = createStore({ another: true });
  const $result = either(not($filter), $then, $other);

  const scope = fork();
  expect(scope.getState($result)).toEqual({ another: true });

  await allSettled(toggle, { scope });
  expect(scope.getState($result)).toEqual('first');
});

test('result updates with the selected argument', async () => {
  const toggle = createEvent();
  const updateFirst = createEvent<string>();
  const updateSecond = createEvent<number>();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first').on(updateFirst, (_, arg) => arg);
  const $other = createStore(0).on(updateSecond, (_, arg) => arg);

  const $result = either($filter, $then, $other);
  const fn = watch($result);

  const scope = fork();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
    ]
  `);

  await allSettled(updateFirst, { scope, params: 'second' });
  await allSettled(toggle, { scope });
  await allSettled(updateSecond, { scope, params: 1 });
  await allSettled(updateSecond, { scope, params: 2 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
      "second",
      0,
      1,
      2,
    ]
  `);
});

test('result don`t updates for not selected argument', async () => {
  const toggle = createEvent();
  const updateFirst = createEvent<string>();
  const updateSecond = createEvent<number>();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first').on(updateFirst, (_, arg) => arg);
  const $other = createStore(0).on(updateSecond, (_, arg) => arg);

  const $result = either($filter, $then, $other);

  const scope = fork();
  const fn = watch($result);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
    ]
  `);

  await allSettled(updateSecond, { scope, params: 1 });
  await allSettled(updateSecond, { scope, params: 2 });
  await allSettled(toggle, { scope });
  await allSettled(updateFirst, { scope, params: 'second' });

  // Second update of the first looks like a bug in effector
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
      "first",
      2,
    ]
  `);
});

test('do not make infinite loop', async () => {
  const $isMobile = createStore(true);

  either({ filter: $isMobile, then: 250, other: 0 });

  const scope = fork();

  await allSettled($isMobile, { scope, params: false });
});
