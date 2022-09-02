import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
} from 'effector';

import { throttle } from './index';
import { wait } from '../../test-library';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent();

  const $counter = app.createStore(0);

  const throttled = throttle({ source, timeout: 40 });

  $counter.on(throttled, (value) => value + 1);

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "-8kcech": 1,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const throttled = throttle({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

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
    {
      "vohh62": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    {
      "vohh62": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const throttled = throttle({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

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
    {
      "m78ag8": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});

describe('timeout as store', () => {
  test('new timeout is used after previous timeout is over', async () => {
    const watcher = jest.fn();
    const changeTimeout = createEvent<number>();
    const $timeout = createStore(40);

    const trigger = createEvent();
    const throttled = throttle({ source: trigger, timeout: $timeout });
    $timeout.on(changeTimeout, (_, timeout) => timeout);

    throttled.watch(watcher);

    const scope = fork();

    allSettled(trigger, { scope }).then(() => {});
    await wait(30);
    allSettled(changeTimeout, { scope, params: 100 }).then(() => {});

    allSettled(trigger, { scope }).then(() => {});
    await wait(10);
    expect(watcher).toBeCalledTimes(1);

    allSettled(trigger, { scope }).then(() => {});
    await wait(50);
    allSettled(trigger, { scope }).then(() => {});
    await wait(50);
    expect(watcher).toBeCalledTimes(2);
  });
});
