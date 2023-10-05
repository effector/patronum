import { createEffect, createEvent, createStore, is, launch } from 'effector';
import { once } from './index';

it('should source only once', () => {
  const fn = jest.fn();

  const source = createEvent<void>();
  const derived = once(source);

  derived.watch(fn);
  expect(fn).toHaveBeenCalledTimes(0);

  source();
  source();

  expect(fn).toHaveBeenCalledTimes(1);
});

it('supports effect as an argument', () => {
  const fn = jest.fn();

  const triggerFx = createEffect<void, void>(jest.fn());
  const derived = once(triggerFx);

  derived.watch(fn);
  expect(fn).toHaveBeenCalledTimes(0);

  triggerFx();

  expect(fn).toHaveBeenCalledTimes(1);
});

it('supports store as an argument', () => {
  const fn = jest.fn();

  const increment = createEvent<void>();
  const $source = createStore<number>(0).on(increment, (n) => n + 1);
  const derived = once($source);

  derived.watch(fn);
  expect(fn).toHaveBeenCalledTimes(0);

  increment();

  expect(fn).toHaveBeenCalledTimes(1);
});

it('always returns event', () => {
  const event = createEvent<string>();
  const effect = createEffect<string, void>();
  const $store = createStore<string>('');

  expect(is.event(once(event))).toBe(true);
  expect(is.event(once(effect))).toBe(true);
  expect(is.event(once($store))).toBe(true);
});

it('only triggers once in race conditions', () => {
  const fn = jest.fn();

  const source = createEvent<string>();
  const derived = once(source);

  derived.watch(fn);
  expect(fn).toHaveBeenCalledTimes(0);

  launch({
    target: [source, source],
    params: ['a', 'b'],
  });

  expect(fn).toHaveBeenCalledTimes(1);
});

it('calling derived event does not lock once', () => {
  const fn = jest.fn();

  const source = createEvent<void>();
  const derived = once(source);

  derived.watch(fn);
  expect(fn).toHaveBeenCalledTimes(0);

  derived();
  source();

  expect(fn).toHaveBeenCalledTimes(2);
});

it('supports config as an argument', () => {
  const fn = jest.fn();

  const source = createEvent<void>();
  const derived = once({ source });

  derived.watch(fn);

  source();
  source();

  expect(fn).toHaveBeenCalledTimes(1);
});

it('supports resetting via config', () => {
  const fn = jest.fn();

  const source = createEvent<void>();
  const reset = createEvent<void>();

  const derived = once({ source, reset });

  derived.watch(fn);

  source();
  reset();
  source();

  expect(fn).toHaveBeenCalledTimes(2);
});
