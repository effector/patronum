import { createEvent, createStore } from 'effector';
import { not } from './index';

it('should invert thuthy value into false', () => {
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  expect(not($a).getState()).toBe(false);
  expect(not($b).getState()).toBe(false);
  expect(not($c).getState()).toBe(false);
  expect(not($d).getState()).toBe(false);
  expect(not($e).getState()).toBe(false);
  expect(not($f).getState()).toBe(false);
  expect(not($g).getState()).toBe(false);
});

it('should invert falsey value into true', () => {
  const $a = createStore(0);
  const $b = createStore('');
  const $c = createStore(false);
  const $d = createStore(null);
  const $e = createStore(NaN);

  expect(not($a).getState()).toBe(true);
  expect(not($b).getState()).toBe(true);
  expect(not($c).getState()).toBe(true);
  expect(not($d).getState()).toBe(true);
  expect(not($e).getState()).toBe(true);
});

it('correctly updates when value changes', async () => {
  const changeToFalse = createEvent();
  const $exists = createStore(true).on(changeToFalse, () => false);
  const $absent = not($exists);

  expect($absent.getState()).toBe(false);

  changeToFalse();
  expect($absent.getState()).toBe(true);
});
