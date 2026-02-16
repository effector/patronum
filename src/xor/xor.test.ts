import { createStore, createEvent, fork, allSettled } from 'effector';
import { xor } from './index';

describe('xor', () => {
  test('returns true when exactly one store is truthy', () => {
    const $a = createStore(true);
    const $b = createStore(false);
    const $c = createStore(false);

    const $result = xor($a, $b, $c);

    expect($result.getState()).toBe(true);
  });

  test('returns false when multiple stores are truthy', () => {
    const $a = createStore(true);
    const $b = createStore(true);
    const $c = createStore(false);

    const $result = xor($a, $b, $c);

    expect($result.getState()).toBe(false);
  });

  test('returns false when no stores are truthy', () => {
    const $a = createStore(false);
    const $b = createStore(false);
    const $c = createStore(false);

    const $result = xor($a, $b, $c);

    expect($result.getState()).toBe(false);
  });

  test('updates correctly when source store changes', () => {
    const $a = createStore(true);
    const $b = createStore(false);
    const changeA = createEvent<boolean>();
    const changeB = createEvent<boolean>();
    $a.on(changeA, (_, value) => value);
    $b.on(changeB, (_, value) => value);

    const $result = xor($a, $b);

    expect($result.getState()).toBe(true);

    changeA(false);
    expect($result.getState()).toBe(false);

    changeB(true);
    expect($result.getState()).toBe(true);

    changeA(true);
    expect($result.getState()).toBe(false);
  });

  test('accepts non-boolean values and coerces them', () => {
    const $a = createStore(0);
    const $b = createStore('');
    const $c = createStore(1);

    const $result = xor($a, $b, $c);

    expect($result.getState()).toBe(true);
  });
});
