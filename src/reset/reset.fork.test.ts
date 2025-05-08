import { allSettled, createEvent, fork, restore } from 'effector';

import { reset } from './index';

test('works in forked scope', async () => {
  const setSource = createEvent<number>();
  const $source = restore(setSource, 0);
  const resetEvent = createEvent();
  reset({ clock: resetEvent, target: $source });

  const scope = fork();
  await allSettled(setSource, { scope, params: 100 });
  expect(scope.getState($source)).toEqual(100);

  await allSettled(resetEvent, { scope });
  expect(scope.getState($source)).toEqual(0);
});

test('do not affects another scope', async () => {
  const setSource = createEvent<number>();
  const $source = restore(setSource, 0);
  const resetEvent = createEvent();
  reset({ clock: resetEvent, target: $source });

  const scopeA = fork();
  const scopeB = fork();
  await allSettled(setSource, { scope: scopeA, params: 100 });
  expect(scopeA.getState($source)).toEqual(100);
  expect(scopeB.getState($source)).toEqual(0);

  await allSettled(resetEvent, { scope: scopeA });
  expect(scopeA.getState($source)).toEqual(0);
  expect(scopeB.getState($source)).toEqual(0);

  await allSettled(setSource, { scope: scopeB, params: 100 });
  expect(scopeA.getState($source)).toEqual(0);
  expect(scopeB.getState($source)).toEqual(100);
});

test('do not affects original store state', async () => {
  const setSource = createEvent<number>();
  const $source = restore(setSource, 0);
  const resetEvent = createEvent();
  reset({ clock: resetEvent, target: $source });

  const scope = fork();
  setSource(200);
  await allSettled(setSource, { scope, params: 100 });
  expect(scope.getState($source)).toEqual(100);
  expect($source.getState()).toEqual(200);

  await allSettled(resetEvent, { scope });
  expect(scope.getState($source)).toEqual(0);
  expect($source.getState()).toEqual(200);

  resetEvent();
  expect(scope.getState($source)).toEqual(0);
  expect($source.getState()).toEqual(0);
});

test('works in forked scope without passed clock', async () => {
  const setSource = createEvent<number>();
  const $source = restore(setSource, 0);
  const resetEvent = reset({ target: $source });

  const scope = fork();
  await allSettled(setSource, { scope, params: 100 });
  expect(scope.getState($source)).toEqual(100);

  await allSettled(resetEvent, { scope });
  expect(scope.getState($source)).toEqual(0);
});
