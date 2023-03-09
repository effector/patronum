import { createDomain, allSettled, fork, createEvent, createStore } from 'effector';
import { snapshot } from './index';

test('works in forked scope', async () => {
  const app = createDomain();

  const changeValue = app.createEvent<number>();
  const copy = app.createEvent();

  const $original = app.createStore(1).on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    clock: copy,
  });

  const scope = fork();

  expect(scope.getState($copy)).toBe(1);

  await allSettled(changeValue, { scope, params: 2 });
  await allSettled(copy, { scope });

  expect(scope.getState($copy)).toBe(2);
});

test('does not affects another scope', async () => {
  const app = createDomain();

  const changeValue = app.createEvent<number>();
  const copy = app.createEvent();

  const $original = app.createStore(1).on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    clock: copy,
  });

  const scope1 = fork(app);
  const scope2 = fork(app);

  expect(scope1.getState($copy)).toBe(1);
  expect(scope2.getState($copy)).toBe(1);

  await allSettled(changeValue, { scope: scope1, params: 2 });
  await allSettled(copy, { scope: scope1 });

  expect(scope1.getState($copy)).toBe(2);
  expect(scope2.getState($copy)).toBe(1);
});

test('does not affect original store state', async () => {
  const app = createDomain();

  const changeValue = app.createEvent<number>();
  const copy = app.createEvent();

  const $original = app.createStore(1).on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    clock: copy,
  });

  const scope = fork(app);

  expect(scope.getState($copy)).toBe(1);
  expect($copy.getState()).toBe(1);

  await allSettled(changeValue, { scope, params: 2 });
  await allSettled(copy, { scope });

  expect(scope.getState($copy)).toBe(2);
  expect($copy.getState()).toBe(1);
});

test('store clock from one scope does not affect another', async () => {
  const app = createDomain();

  const updateOriginal = createEvent<string>({ domain: app });
  const updateTrigger = createEvent<void>({ domain: app });

  const $original = createStore('first', { domain: app }).on(
    updateOriginal,
    (_, newValue) => newValue,
  );

  const $trigger = createStore(0, { domain: app }).on(
    updateTrigger,
    (state) => state + 1,
  );

  const $copy = snapshot({ source: $original, clock: $trigger });

  const scope1 = fork(app);
  const scope2 = fork(app);

  expect(scope1.getState($copy)).toBe('first');
  expect(scope2.getState($copy)).toBe('first');

  await allSettled(updateOriginal, { scope: scope1, params: 'second' });
  await allSettled(updateOriginal, { scope: scope2, params: 'second' });

  await allSettled(updateTrigger, { scope: scope1 });

  expect(scope1.getState($copy)).toBe('second');
  expect(scope2.getState($copy)).toBe('first');
});
