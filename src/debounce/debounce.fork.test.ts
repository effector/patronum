import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
} from 'effector';
import { wait, watch } from '../../test-library';

import { debounce } from './index';

test('debounce works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value) => value + 1);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-3fze9r": 1,
    }
  `);
});

test('debounce do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "-xa6bxy": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "-xa6bxy": 200,
    }
  `);
});

test('debounce do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "s9ojbc": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});

test('debounce does not break parallel scopes', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const dummy = app.createEvent();
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork(app);
  const scopeB = fork(app);

  allSettled(trigger, {
    scope: scopeA,
    params: 10,
  });

  allSettled(trigger, {
    scope: scopeB,
    params: 20,
  });

  await new Promise((r) => setTimeout(r, 20));

  allSettled(trigger, {
    scope: scopeA,
    params: 10,
  });

  allSettled(trigger, {
    scope: scopeB,
    params: 20,
  });

  await Promise.all([
    allSettled(dummy, { scope: scopeA }),
    allSettled(dummy, { scope: scopeB }),
  ]);

  expect(serialize(scopeA)).toEqual({
    [$counter.sid!]: 10,
  });

  expect(serialize(scopeB)).toEqual({
    [$counter.sid!]: 20,
  });
});

describe('timeout as store', () => {
  test('new timeout is used after source trigger', async () => {
    const trigger = createEvent();
    const changeTimeout = createEvent<number>();
    const $timeout = createStore(40);
    const debounced = debounce({ source: trigger, timeout: $timeout });
    $timeout.on(changeTimeout, (_, timeout) => timeout);
    const watcher = watch(debounced);

    const scope = fork();

    allSettled(trigger, { scope }).then(() => {});
    await wait(30);
    allSettled(changeTimeout, { scope, params: 100 }).then(() => {});

    allSettled(trigger, { scope }).then(() => {});
    await wait(10);
    expect(watcher).toBeCalledTimes(0);
    await wait(90);
    expect(watcher).toBeCalledTimes(1);

    allSettled(trigger, { scope }).then(() => {});
    await wait(100);
    expect(watcher).toBeCalledTimes(2);
  });
});
