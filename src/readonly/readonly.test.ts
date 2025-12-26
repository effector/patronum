import { createEvent, createStore, is } from 'effector';
import { readonly } from './index';

it('should convert store to readonly store', () => {
  const $store = createStore({});
  const $result = readonly($store);

  expect(is.targetable($result)).toBe(false);
});

it('should convert event to readonly event', () => {
  const event = createEvent();
  const result = readonly(event);

  expect(is.targetable(result)).toBe(false);
});

it('should return store as-is if it is already derived', () => {
  const $store = createStore({});
  const $mapped = $store.map((state) => state);
  const $result = readonly($mapped);

  expect($result).toBe($mapped);
});

it('should return event as-is if it is already derived', () => {
  const event = createEvent();
  const mapped = event.map((value) => value);
  const result = readonly(mapped);

  expect(result).toBe(mapped);
});

it('should convert non unit value to store', () => {
  expect(is.store(readonly(1))).toBe(true);
  expect(is.store(readonly('12'))).toBe(true);
  expect(is.store(readonly(''))).toBe(true);
  expect(is.store(readonly(true))).toBe(true);
  expect(is.store(readonly(false))).toBe(true);
  expect(is.store(readonly([]))).toBe(true);
  expect(is.store(readonly({}))).toBe(true);
  expect(is.store(readonly(null))).toBe(true);
  expect(is.store(readonly(null))).toBe(true);

  expect(is.targetable(readonly(1))).toBe(false);
  expect(is.targetable(readonly('12'))).toBe(false);
  expect(is.targetable(readonly(''))).toBe(false);
  expect(is.targetable(readonly(true))).toBe(false);
  expect(is.targetable(readonly(false))).toBe(false);
  expect(is.targetable(readonly([]))).toBe(false);
  expect(is.targetable(readonly({}))).toBe(false);
  expect(is.targetable(readonly(null))).toBe(false);
  expect(is.targetable(readonly(null))).toBe(false);
});

it('sould return value as-is if it is not unit and function or undefined', () => {
  expect(is.store(readonly(() => {}))).toBe(false);
  expect(is.store(readonly(undefined))).toBe(false);
  expect(is.targetable(readonly(() => {}))).toBe(false);
  expect(is.targetable(readonly(undefined))).toBe(false);
});
