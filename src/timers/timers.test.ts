import 'regenerator-runtime/runtime';
import {
  createEvent,
  fork, allSettled
} from 'effector';
import { wait, watch } from '../../test-library';
import { setupTimers, Timers } from '.'
import { throttle } from '../throttle';
import { delay } from '../delay';
import { interval } from '../interval';
import { debounce } from '../debounce';

const customSetTimeout: Timers['setTimeout'] = (handler, _, ...args) => setTimeout(handler, 50, ...args) as unknown as NodeJS.Timeout;

describe('Custom time functions', () => {
  test('interval', async () => {
    const scope = fork();
    const mockedSetTimeout = jest.fn(customSetTimeout);

    await allSettled(setupTimers, { scope, params: { setTimeout: mockedSetTimeout } });

    const start = createEvent();
    const stop = createEvent();
    const { tick } = interval({ timeout: 500, start, stop });
    const fn = watch(tick);

    allSettled(start, { scope });

    expect(mockedSetTimeout).toBeCalled();

    await wait(52);
    await allSettled(stop, { scope });

    expect(fn).toBeCalled();
  });

  test('throttle', async () => {
    const scope = fork();
    const mockedSetTimeout = jest.fn(customSetTimeout);

    await allSettled(setupTimers, { scope, params: { setTimeout: mockedSetTimeout } });

    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = throttle({ source: trigger, timeout: 500 });

    throttled.watch(watcher);

    allSettled(trigger, { scope });
    allSettled(trigger, { scope });
    allSettled(trigger, { scope });

    expect(watcher).not.toBeCalled();
    expect(mockedSetTimeout).toBeCalled();

    await wait(52);

    expect(watcher).toBeCalledTimes(1);
  });

  test('delay', async () => {
    const scope = fork();
    const mockedSetTimeout = jest.fn(customSetTimeout);

    await allSettled(setupTimers, { scope, params: { setTimeout: mockedSetTimeout } });

    const trigger = createEvent();
    const triggered = delay({ source: trigger, timeout: 500 });

    const fn = watch(triggered);

    allSettled(trigger, { scope });

    expect(mockedSetTimeout).toBeCalled();
    expect(fn).not.toBeCalled();

    await wait(52);

    expect(fn).toBeCalled();
  });

  test('debounce', async () => {
    const scope = fork();
    const mockedSetTimeout = jest.fn(customSetTimeout);

    await allSettled(setupTimers, { scope, params: { setTimeout: mockedSetTimeout } });

    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce({ source: trigger, timeout: 500 });

    debounced.watch(watcher);

    allSettled(trigger, { scope });
    allSettled(trigger, { scope });
    allSettled(trigger, { scope });

    expect(watcher).not.toBeCalled();
    expect(mockedSetTimeout).toBeCalled();

    await wait(52);
    expect(watcher).toBeCalledTimes(1);
  });
});
