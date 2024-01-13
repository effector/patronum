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
