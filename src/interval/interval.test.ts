import { createEvent, createStore } from 'effector';

import { wait, argumentHistory, watch } from '../../test-library';
import { interval } from './index';

describe('timeout', () => {
  test('after timeout tick triggered only once', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 10, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(12);
    expect(fn).toBeCalledTimes(1);

    stop();
  });

  test('tick triggered multiple times after timeout start', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 10, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(12);
    expect(fn).toBeCalledTimes(1);

    await wait(12);
    expect(fn).toBeCalledTimes(2);

    await wait(12);
    expect(fn).toBeCalledTimes(3);

    stop();
  });

  test('after stopping interval tick is not triggered', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 10, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(12);
    expect(fn).toBeCalledTimes(1);

    await wait(12);
    expect(fn).toBeCalledTimes(2);

    stop();
    await wait(20);
    expect(fn).toBeCalledTimes(2);
  });

  test('isRunning should be true when interval is running', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { isRunning } = interval({ timeout: 10, start, stop });
    const fn = watch(isRunning);

    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
      ]
    `);

    start();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);

    await wait(12);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);

    await wait(12);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);

    stop();
    await wait(20);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
        false,
      ]
    `);
  });

  test('after triggering start multiple times tick should be triggered once per timeout', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 20, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    start();
    start();
    start();
    start();
    expect(fn).not.toBeCalled();

    await wait(20);
    expect(fn).toBeCalledTimes(1);
    await wait(12);
    expect(fn).toBeCalledTimes(1);

    await wait(20);
    expect(fn).toBeCalledTimes(2);

    stop();
  });

  test('after triggering start multiple times inside timeout tick should be triggered once per timeout', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 20, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(20);
    expect(fn).toBeCalledTimes(1);

    start();
    start();
    start();
    start();
    await wait(12);
    expect(fn).toBeCalledTimes(1);

    await wait(20);
    expect(fn).toBeCalledTimes(2);

    stop();
  });

  test('timeout can be in store', async () => {
    const start = createEvent();
    const stop = createEvent();
    const $timeout = createStore(10);
    const { tick } = interval({ timeout: $timeout, start, stop });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(12);
    expect(fn).toBeCalledTimes(1);

    stop();
  });

  test('timeout can be changed during running the interval', async () => {
    const start = createEvent();
    const stop = createEvent();
    const increaseTimeout = createEvent();
    const $timeout = createStore(10).on(increaseTimeout, (timeout) => timeout * 2);
    const { tick } = interval({ timeout: $timeout, start, stop });
    const fn = watch(tick);

    start();
    await wait(12);
    expect(fn).toBeCalledTimes(1);

    // timeout will be changed in the next interval tick
    increaseTimeout();
    await wait(12);
    expect(fn).toBeCalledTimes(2);

    // till no tick
    await wait(12);
    expect(fn).toBeCalledTimes(2);

    await wait(12);
    expect(fn).toBeCalledTimes(3);

    // timeout should be 40ms
    increaseTimeout();
    await wait(50);
    expect(fn).toBeCalledTimes(4);

    stop();
  });
});

describe('leading=true', () => {
  test('tick should be triggered on start', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 10, start, stop, leading: true });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).toBeCalledTimes(1);

    await wait(12);
    expect(fn).toBeCalledTimes(2);

    stop();
  });
});

describe('trailing=true', () => {
  test('tick should be triggered on stop', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 10, start, stop, trailing: true });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).not.toBeCalled();

    await wait(12);
    expect(fn).toBeCalledTimes(1);

    stop();
    expect(fn).toBeCalledTimes(2);

    await wait(20);
    expect(fn).toBeCalledTimes(2); // not called after stop
  });
});

describe('leading=true trailing=true', () => {
  test('with trailing and leading tick should be triggered on stop and start', async () => {
    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({
      timeout: 10,
      start,
      stop,
      leading: true,
      trailing: true,
    });
    const fn = watch(tick);

    expect(fn).not.toBeCalled();

    start();
    expect(fn).toBeCalledTimes(1);

    await wait(12);
    expect(fn).toBeCalledTimes(2);

    stop();
    expect(fn).toBeCalledTimes(3);

    await wait(20);
    expect(fn).toBeCalledTimes(3); // not called after stop
  });
});
