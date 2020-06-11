const { createStore, createEvent } = require('effector');
const { argumentHistory } = require('../test-library');
const { some } = require('./index');

test('boolean predicate', () => {
  const fn = jest.fn();
  const changeOne = createEvent();
  const changeAnother = createEvent();

  const $first = createStore(false).on(changeAnother, () => true);
  const $second = createStore(false).on(changeOne, () => true);
  const $third = createStore(false).on(changeAnother, () => true);

  const $result = some(true, [$first, $second, $third]);

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "false",
    ]
  `);

  changeOne();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "false",
      "true",
    ]
  `);

  changeAnother();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "false",
      "true",
    ]
  `);
});

test('number predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(4);
  const $second = createStore(2).on(change, () => 4);
  const $third = createStore(4);

  const $result = some(2, [$first, $second, $third]);

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(true);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "true",
      "false",
    ]
  `);
});

test('function predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(0);
  const $second = createStore(0).on(change, () => 5);
  const $third = createStore(0);

  const $result = some((value) => value > 0, [$first, $second, $third]);

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "false",
      "true",
    ]
  `);
});

test('initially true', () => {
  const fn = jest.fn();

  const $first = createStore(0);
  const $second = createStore(2);
  const $third = createStore(0);

  const $result = some((value) => value > 0, [$first, $second, $third]);

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(true);
});

test('initially false', () => {
  const fn = jest.fn();

  const $first = createStore(0);
  const $second = createStore(0);
  const $third = createStore(0);

  const $result = some((value) => value > 0, [$first, $second, $third]);

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);
});
