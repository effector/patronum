import { createStore, createEvent } from 'effector';
import { argumentHistory } from '../../test-library';
import { some } from './index';

test('boolean predicate', () => {
  const fn = jest.fn();
  const changeOne = createEvent();
  const changeAnother = createEvent();

  const $first = createStore(false).on(changeAnother, () => true);
  const $second = createStore(false).on(changeOne, () => true);
  const $third = createStore(false).on(changeAnother, () => true);

  const $result = some({ predicate: true, stores: [$first, $second, $third] });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
    ]
  `);

  changeOne();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
      true,
    ]
  `);

  changeAnother();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
      true,
    ]
  `);
});

test('number predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(4);
  const $second = createStore(2).on(change, () => 4);
  const $third = createStore(4);

  const $result = some({ predicate: 2, stores: [$first, $second, $third] });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(true);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      true,
      false,
    ]
  `);
});

test('function predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(0);
  const $second = createStore(0).on(change, () => 5);
  const $third = createStore(0);

  const $result = some({
    predicate: (value) => value > 0,
    stores: [$first, $second, $third],
  });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      false,
      true,
    ]
  `);
});

test('allow predicate to use store', () => {
  const setSource = createEvent<boolean>();
  const setPredicate = createEvent<boolean>();

  const $predicate = createStore(false).on(setPredicate, (_, value) => value);

  const $first = createStore(true);
  const $second = createStore(true).on(setSource, (_, value) => value);
  const $third = createStore(true);

  const $result = some({ predicate: $predicate, stores: [$first, $second, $third] });
  expect($result.getState()).toBeFalsy();

  setSource(false);
  expect($result.getState()).toBeTruthy();

  setPredicate(true);
  expect($result.getState()).toBeTruthy();

  setSource(true);
  expect($result.getState()).toBeTruthy();
});

describe('Shorthand form', () => {
  test('boolean predicate', () => {
    const fn = jest.fn();
    const changeOne = createEvent();
    const changeAnother = createEvent();

    const $first = createStore(false).on(changeAnother, () => true);
    const $second = createStore(false).on(changeOne, () => true);
    const $third = createStore(false).on(changeAnother, () => true);

    const $result = some([$first, $second, $third], true);

    $result.watch(fn);
    expect(fn).toHaveBeenCalledWith(false);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
      ]
    `);

    changeOne();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);

    changeAnother();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);
  });

  test('number predicate', () => {
    const fn = jest.fn();
    const change = createEvent();

    const $first = createStore(4);
    const $second = createStore(2).on(change, () => 4);
    const $third = createStore(4);

    const $result = some([$first, $second, $third], 2);

    $result.watch(fn);
    expect(fn).toHaveBeenCalledWith(true);

    change();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        true,
        false,
      ]
    `);
  });

  test('function predicate', () => {
    const fn = jest.fn();
    const change = createEvent();

    const $first = createStore(0);
    const $second = createStore(0).on(change, () => 5);
    const $third = createStore(0);

    const $result = some([$first, $second, $third], (value) => value > 0);

    $result.watch(fn);
    expect(fn).toHaveBeenCalledWith(false);

    change();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);
  });

  test('allow predicate to use store', () => {
    const setSource = createEvent<boolean>();
    const setPredicate = createEvent<boolean>();

    const $predicate = createStore(false).on(setPredicate, (_, value) => value);

    const $first = createStore(true);
    const $second = createStore(true).on(setSource, (_, value) => value);
    const $third = createStore(true);

    const $result = some([$first, $second, $third], $predicate);
    expect($result.getState()).toBeFalsy();

    setSource(false);
    expect($result.getState()).toBeTruthy();

    setPredicate(true);
    expect($result.getState()).toBeTruthy();

    setSource(false);
    expect($result.getState()).toBeTruthy();
  });
});

test('initially true', () => {
  const fn = jest.fn();

  const $first = createStore(0);
  const $second = createStore(2);
  const $third = createStore(0);

  const $result = some({
    predicate: (value) => value > 0,
    stores: [$first, $second, $third],
  });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(true);
});

test('initially false', () => {
  const fn = jest.fn();

  const $first = createStore(0);
  const $second = createStore(0);
  const $third = createStore(0);

  const $result = some({
    predicate: (value) => value > 0,
    stores: [$first, $second, $third],
  });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);
});
