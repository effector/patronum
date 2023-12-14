import {
  allSettled,
  createEvent,
  createStore,
  fork,
  restore,
  sample,
} from 'effector';

import { previousValue } from './index';

it('has null when store is not changed', () => {
  const scope = fork();
  const $initalStore = createStore(10);
  const $prevValue = previousValue($initalStore);

  expect(scope.getState($prevValue)).toBe(null);
});

it('has initial value when defined', () => {
  const scope = fork();
  const $initalStore = createStore(10);
  const $prevValue = previousValue($initalStore, 0);

  expect(scope.getState($prevValue)).toBe(0);
});

it('has first value on update', async () => {
  const scope = fork();
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previousValue($initalStore);

  await allSettled(changeInitialStore, { scope, params: 20 });

  expect(scope.getState($prevValue)).toBe(10);
});

it('has previous value on multiple updates', async () => {
  const scope = fork();
  const changeInitialStore = createEvent<number>();
  const $initalStore = restore(changeInitialStore, 10);

  const $prevValue = previousValue($initalStore);

  await allSettled(changeInitialStore, { scope, params: 20 });
  await allSettled(changeInitialStore, { scope, params: 30 });
  await allSettled(changeInitialStore, { scope, params: 40 });

  expect(scope.getState($prevValue)).toBe(30);
});

it('has first scope value after first update', async () => {
  const inc = createEvent();
  const $initalStore = createStore(0);
  const $prevValue = previousValue($initalStore, -1);
  $initalStore.on(inc, (x) => x + 1);
  const scope = fork({ values: [[$initalStore, 10]] });
  await allSettled(inc, { scope });
  expect(scope.getState($prevValue)).toBe(10);
});

test('undefined support', async () => {
  const changeInitialStore = createEvent<string | void>();
  const $initialStore = createStore<string | void>('a', { skipVoid: false });
  const $prevValue = previousValue($initialStore);

  sample({ clock: changeInitialStore, target: $initialStore });

  const scope = fork({ values: [[$initialStore, 'b']] });
  await allSettled(changeInitialStore, { scope, params: undefined });
  expect(scope.getState($prevValue)).toBe('b');
  await allSettled(changeInitialStore, { scope, params: 'c' });
  expect(scope.getState($prevValue)).toBe(undefined);
});

test('undefined as defaultValue support', () => {
  const changeInitialStore = createEvent<string | void>();
  const $initialStore = createStore<string | void>('a', { skipVoid: false });
  const $prevValue = previousValue($initialStore, undefined);

  sample({ clock: changeInitialStore, target: $initialStore });

  const scope = fork({ values: [[$initialStore, 'b']] });
  expect(scope.getState($prevValue)).toBe(undefined);
});
