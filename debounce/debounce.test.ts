import 'regenerator-runtime/runtime';
import { createStore, createEvent, createEffect, createDomain } from 'effector';
import { debounce } from '.';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('event', () => {
  test('debounce event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce event with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounced event triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced event works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('calls target', async () => {
    const watcher = jest.fn();

    const source = createEvent<number>();
    const target = createEvent<number>();

    debounce({ source, timeout: 40, target });

    target.watch(watcher);

    source(1);
    source(2);
    source(3);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });

  test('with target returns target', async () => {
    const source = createEvent();
    const target = createEvent();

    const result = debounce({ source, timeout: 40, target });

    expect(result).toBe(target);
  });

  test('name correctly assigned from trigger', () => {
    const demo = createEvent();
    const debouncedDemo = debounce({ source: demo, timeout: 20 });

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(`"demoDebounceTick"`);
  });
});

describe('effect', () => {
  test('debounce effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce effect with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounced effect triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced effect works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('calls target', async () => {
    const watcher = jest.fn();

    const source = createEvent<number>();
    const target = createEffect<number, void>().use(() => undefined);

    debounce({ source, timeout: 40, target });

    target.watch(watcher);

    source(1);
    source(2);
    source(3);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });

  test('with target returns target', async () => {
    const source = createEffect<number, void>().use(() => undefined);
    const target = createEffect<number, void>().use(() => undefined);

    const result = debounce({ source, timeout: 40, target });

    expect(result).toBe(target);
  });

  test('name correctly assigned from trigger', () => {
    const demoFx = createEffect();
    const debouncedDemo = debounce({ source: demoFx, timeout: 20 });

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(
      `"demoFxDebounceTick"`,
    );
  });
});

describe('store', () => {
  test('debounce store and pass values', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const $store = createStore(0);

    $store.on(trigger, (_, value) => value);

    const debounced = debounce({ source: $store, timeout: 40 });

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('name correctly assigned from trigger', () => {
    const $demo = createStore(0);
    const debouncedDemo = debounce({ source: $demo, timeout: 20 });

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(
      `"$demoDebounceTick"`,
    );
  });
});

test('debounce do not affect another instance', async () => {
  const watcherFirst = jest.fn();
  const triggerFirst = createEvent<number>();
  const debouncedFirst = debounce({ source: triggerFirst, timeout: 20 });
  debouncedFirst.watch(watcherFirst);

  const watcherSecond = jest.fn();
  const triggerSecond = createEvent<string>();
  const debouncedSecond = debounce({ source: triggerSecond, timeout: 60 });
  debouncedSecond.watch(watcherSecond);

  triggerFirst(0);

  expect(watcherFirst).not.toBeCalled();
  await wait(20);

  expect(watcherFirst).toBeCalledWith(0);
  expect(watcherSecond).not.toBeCalled();

  triggerSecond('foo');
  triggerFirst(1);
  await wait(20);
  triggerFirst(2);
  await wait(20);

  expect(watcherFirst).toBeCalledWith(2);
  expect(watcherSecond).not.toBeCalled();

  await wait(20);

  expect(watcherSecond).toBeCalledWith('foo');
});

test('name correctly assigned from params', () => {
  const demo = createEvent();
  const debouncedDemo = debounce({
    source: demo,
    timeout: 20,
    name: 'Example',
  });

  expect(debouncedDemo.shortName).toMatchInlineSnapshot(
    `"ExampleDebounceTick"`,
  );
});

test('name should not be in domain', () => {
  const domain = createDomain();
  const event = domain.createEvent();
  const debouncedDemo = debounce({ source: event, timeout: 20 });

  expect(debouncedDemo.shortName).toMatchInlineSnapshot(`"eventDebounceTick"`);
});

test('source event, target store', async () => {
  const watcher = jest.fn();

  const source = createEvent<number>();
  const target = createStore<number>(0);

  debounce({ source, timeout: 40, target });

  target.updates.watch(watcher);

  source(1);
  source(2);
  source(3);

  expect(watcher).not.toBeCalled();

  await wait(40);

  expect(watcher).toBeCalledTimes(1);
  expect(watcher.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        3,
      ],
    ]
  `);
});

test('source event, target effect', async () => {
  const watcher = jest.fn();

  const source = createEvent<number>();
  const target = createEffect<number, void>().use(() => undefined);

  debounce({ source, timeout: 40, target });

  target.watch(watcher);

  source(0);
  source(1);
  source(2);

  expect(watcher).not.toBeCalled();

  await wait(40);

  expect(watcher).toBeCalledTimes(1);
  expect(watcher.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
    ]
  `);
});

test('source store, target effect', async () => {
  const watcher = jest.fn();

  const change = createEvent();
  const source = createStore<number>(0).on(change, (state) => state + 1);
  const target = createEffect<number, void>().use(() => undefined);

  debounce({ source, timeout: 40, target });

  target.watch(watcher);

  change();
  change();
  change();

  expect(watcher).not.toBeCalled();

  await wait(40);

  expect(watcher).toBeCalledTimes(1);
  expect(watcher.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        3,
      ],
    ]
  `);
});
