import 'regenerator-runtime/runtime';
import {
  createDomain,
  fork,
  serialize,
  allSettled,
  createEvent,
  createStore,
  sample,
} from 'effector';

import { throttle } from './index';
import { wait } from '../../test-library';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent();

  const $counter = app.createStore(0);

  const throttled = throttle({ source, timeout: 40 });

  $counter.on(throttled, (value) => value + 1);

  const scope = fork();

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchObject({
    [$counter.sid!]: 1
  });
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const throttled = throttle({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

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
    [$counter.sid!]: 2
  });

  expect(serialize(scopeB)).toMatchObject({
    [$counter.sid!]: 200
  });
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const throttled = throttle({ source: trigger, timeout: 40 });

  $counter.on(throttled, (value, payload) => value + payload);

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
    [$counter.sid!]: 2
  });

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
    await wait(32);
    allSettled(changeTimeout, { scope, params: 100 }).then(() => {});

    allSettled(trigger, { scope }).then(() => {});
    await wait(12);
    expect(watcher).toBeCalledTimes(1);

    allSettled(trigger, { scope }).then(() => {});
    await wait(50);
    allSettled(trigger, { scope }).then(() => {});
    await wait(50);
    expect(watcher).toBeCalledTimes(2);
  });
});

describe('edge cases', () => {
  test('does not call target twice for sample chain doubles', async () => {
    const trigger = createEvent();

    const tr = throttle({ source: trigger, timeout: 100 });

    const listener = jest.fn();
    tr.watch(listener);

    const start = createEvent();
    const secondTrigger = createEvent();

    sample({ clock: start, fn: () => 'one', target: [secondTrigger, trigger] });
    sample({ clock: secondTrigger, fn: () => 'two', target: [trigger] });

    const scope = fork();

    await allSettled(start, { scope });

    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith('two');
  });
})
