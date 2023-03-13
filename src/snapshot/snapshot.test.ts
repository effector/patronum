import { createStore, createEvent, createEffect } from 'effector';
import { snapshot } from './index';

test('snapshot copy original store', () => {
  const changeValue = createEvent<string>();

  const $original = createStore('first').on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
  });

  expect($copy.getState()).toBe('first');

  changeValue('second');

  expect($copy.getState()).toBe('second');
});

test('snapshot copy original store on clock only', () => {
  const changeValue = createEvent<string>();

  const copy = createEvent();

  const $original = createStore('first').on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    clock: copy,
  });

  expect($copy.getState()).toBe('first');

  changeValue('second');

  expect($copy.getState()).toBe('first');
  copy();
  expect($copy.getState()).toBe('second');
});

test('snapshot copy original store with transformation', () => {
  const changeValue = createEvent<number>();

  const $original = createStore(1).on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    fn: (value) => value * 2,
  });

  expect($copy.getState()).toBe(2);

  changeValue(3);

  expect($copy.getState()).toBe(6);
});

test('snapshot copy original store with transformation on trigger', () => {
  const changeValue = createEvent<number>();

  const copy = createEvent();

  const $original = createStore(1).on(changeValue, (_, newValue) => newValue);

  const $copy = snapshot({
    source: $original,
    clock: copy,
    fn: (value) => value * 2,
  });

  expect($copy.getState()).toBe(2);

  changeValue(3);

  expect($copy.getState()).toBe(2);

  copy();

  expect($copy.getState()).toBe(6);
});

test('snapshot supports effect as a clock', () => {
  const updateOriginal = createEvent<string>();

  const trigger = createEffect(() => undefined);

  const $original = createStore('first').on(
    updateOriginal,
    (_, newValue) => newValue,
  );
  const $copy = snapshot({ source: $original, clock: trigger });

  updateOriginal('second');
  expect($copy.getState()).toBe('first');

  trigger();
  expect($copy.getState()).toBe('second');
});

test('snapshot supports store as a clock', () => {
  const updateOriginal = createEvent<string>();
  const updateTrigger = createEvent<void>();

  const $trigger = createStore<number>(0).on(updateTrigger, (state) => state + 1);

  const $original = createStore('first').on(
    updateOriginal,
    (_, newValue) => newValue,
  );
  const $copy = snapshot({ source: $original, clock: $trigger });

  updateOriginal('second');
  expect($copy.getState()).toBe('first');

  updateTrigger();
  expect($copy.getState()).toBe('second');
});
