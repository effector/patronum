import { createEvent, createStore, restore } from 'effector';
import { either } from './index';
import { not } from '../not';
import { argumentHistory, watch } from '../../test-library';

test('selects correct store', () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $other = createStore({ another: true });
  const $result = either($filter, $then, $other);

  expect($result.getState()).toBe('first');

  toggle();
  expect($result.getState()).toEqual({ another: true });
});

test('selects correct literal for second argument or store', () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $result = either($filter, $then, { another: true });

  expect($result.getState()).toBe('first');

  toggle();
  expect($result.getState()).toEqual({ another: true });
});

test('selects correct literal for first argument or store', () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $other = createStore({ another: true });
  const $result = either($filter, 'first', $other);

  expect($result.getState()).toBe('first');

  toggle();
  expect($result.getState()).toEqual({ another: true });
});

test('selects correct literals', () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $result = either($filter, 'first', { another: true });

  expect($result.getState()).toBe('first');

  toggle();
  expect($result.getState()).toEqual({ another: true });
});

test('works with not', () => {
  const toggle = createEvent();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first');
  const $other = createStore({ another: true });
  const $result = either(not($filter), $then, $other);

  expect($result.getState()).toEqual({ another: true });

  toggle();
  expect($result.getState()).toEqual('first');
});

test('result updates with the selected argument', () => {
  const toggle = createEvent();
  const updateFirst = createEvent<string>();
  const updateSecond = createEvent<number>();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first').on(updateFirst, (_, arg) => arg);
  const $other = createStore(0).on(updateSecond, (_, arg) => arg);

  const $result = either($filter, $then, $other);
  const fn = watch($result);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
    ]
  `);

  updateFirst('second');
  toggle();
  updateSecond(1);
  updateSecond(2);

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

test('result don`t updates for not selected argument', () => {
  const toggle = createEvent();
  const updateFirst = createEvent<string>();
  const updateSecond = createEvent<number>();
  const $filter = createStore(true).on(toggle, (is) => !is);
  const $then = createStore('first').on(updateFirst, (_, arg) => arg);
  const $other = createStore(0).on(updateSecond, (_, arg) => arg);

  const $result = either($filter, $then, $other);
  const fn = watch($result);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
    ]
  `);

  updateSecond(1);
  updateSecond(2);
  toggle();
  updateFirst('second');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      "first",
      2,
    ]
  `);
});
