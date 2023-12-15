import { createEvent, createStore, restore, sample } from 'effector';

import { previous } from './index';

it('has null when store is not changed', () => {
  const $initalStore = createStore(10);
  const $prevValue = previous($initalStore);

  expect($prevValue.getState()).toBe(null);
});

it('has initial value when defined', () => {
  const $initalStore = createStore(10);
  const $prevValue = previous($initalStore, 0);

  expect($prevValue.getState()).toBe(0);
});

it('has first value on update', () => {
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previous($initalStore);

  changeInitialStore(20);

  expect($prevValue.getState()).toBe(10);
});

it('has previous value on multiple updates', () => {
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previous($initalStore);

  changeInitialStore(20);
  changeInitialStore(30);
  changeInitialStore(40);

  expect($prevValue.getState()).toBe(30);
});

test('undefined support', () => {
  const changeInitialStore = createEvent<string | void>();
  const $initialStore = createStore<string | void>('a', { skipVoid: false });
  const $prevValue = previous($initialStore);

  sample({ clock: changeInitialStore, target: $initialStore });

  changeInitialStore();
  expect($prevValue.getState()).toBe('a');
  changeInitialStore('b');
  expect($prevValue.getState()).toBe(undefined);
});

test('undefined as defaultValue support', () => {
  const changeInitialStore = createEvent<string | void>();
  const $initialStore = createStore<string | void>('a', { skipVoid: false });
  const $prevValue = previous($initialStore, undefined);

  sample({ clock: changeInitialStore, target: $initialStore });

  expect($prevValue.getState()).toBe(undefined);
});

test('store validation', () => {
  expect(() => {
    // @ts-expect-error
    previous(null);
  }).toThrowErrorMatchingInlineSnapshot(
    `"previous first argument should be a store"`,
  );
});
