import { createEvent, createStore, restore } from 'effector';

import { previousValue } from './index';

it('has null when store is not changed', () => {
  const $initalStore = createStore(10);
  const $prevValue = previousValue($initalStore);

  expect($prevValue.getState()).toBe(null);
});

it('has initial value when defined', () => {
  const $initalStore = createStore(10);
  const $prevValue = previousValue($initalStore, 0);

  expect($prevValue.getState()).toBe(0);
});

it('has first value on update', () => {
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previousValue($initalStore);

  changeInitialStore(20);

  expect($prevValue.getState()).toBe(10);
});

it('has previous value on multiple updates', () => {
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previousValue($initalStore);

  changeInitialStore(20);
  changeInitialStore(30);
  changeInitialStore(40);

  expect($prevValue.getState()).toBe(30);
});
