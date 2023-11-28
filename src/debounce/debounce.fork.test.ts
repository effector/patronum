import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
  sample,
  createWatch,
} from 'effector';
import { wait, watch } from '../../test-library';

import { debounce } from './index';

test('debounce works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value) => value + 1);

  const scope = fork();

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchObject({
    [$counter.sid!]: 1,
  });
});

test('debounce do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork();
  const scopeB = fork();

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

  expect(serialize(scopeA)).toMatchObject({
    [$counter.sid!]: 2,
  });

  expect(serialize(scopeB)).toMatchObject({
    [$counter.sid!]: 200,
  });
});

test('debounce do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scope = fork();

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchObject({
    [$counter.sid!]: 2,
  });

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});

test('debounce does not break parallel scopes', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const dummy = app.createEvent();
  const trigger = app.createEvent<number>();

  const debounced = debounce({ source: trigger, timeout: 40 });

  $counter.on(debounced, (value, payload) => value + payload);

  const scopeA = fork();
  const scopeB = fork();

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
    await wait(32);
    allSettled(changeTimeout, { scope, params: 100 }).then(() => {});

    allSettled(trigger, { scope }).then(() => {});
    await wait(12);
    expect(watcher).toBeCalledTimes(0);
    await wait(92);
    expect(watcher).toBeCalledTimes(1);

    allSettled(trigger, { scope }).then(() => {});
    await wait(120);
    expect(watcher).toBeCalledTimes(2);
  });
});

describe('edge cases', () => {
  test('does not call target twice for sample chain doubles', async () => {
    const trigger = createEvent();

    const db = debounce({ source: trigger, timeout: 100 });

    const listener = jest.fn();
    db.watch(listener);

    const start = createEvent();
    const secondTrigger = createEvent();

    sample({ clock: start, fn: () => 'one', target: [secondTrigger, trigger] });
    sample({ clock: secondTrigger, fn: () => 'two', target: [trigger] });

    const scope = fork();

    await allSettled(start, { scope });

    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith('two');
  });

  test('no trigger call, but timeout change on the fly', async () => {
    const trigger = createEvent();

    const changeTimeout = createEvent<number>();
    const $timeout = createStore(40).on(changeTimeout, (_, x) => x);
    const db = debounce({ source: trigger, timeout: $timeout });

    const listener = jest.fn();
    const triggerListener = jest.fn();
    const scope = fork()
    createWatch({
      unit: db,
      fn: listener,
      scope,
    })
    createWatch({
      unit: trigger,
      fn: triggerListener,
      scope,
    })

    await allSettled(changeTimeout, { scope, params: 10 });

    expect(listener).toBeCalledTimes(0);
    expect(triggerListener).toBeCalledTimes(0);
  })
});
