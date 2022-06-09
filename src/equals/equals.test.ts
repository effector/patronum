import { createEvent, createStore } from 'effector';
import { equals } from './index';

test('boolean', () => {
  const toggle = createEvent();
  const $a = createStore(true).on(toggle, (a) => !a);
  const $b = createStore(true);
  const $result = equals($a, $b);

  expect($result.getState()).toBe(true);

  toggle();
  expect($result.getState()).toBe(false);
});

test('numbers', () => {
  const increment = createEvent();
  const $a = createStore(1).on(increment, (a) => a + 1);
  const $b = createStore(2);
  const $result = equals($a, $b);

  expect($result.getState()).toBe(false);

  increment();
  expect($result.getState()).toBe(true);
});
