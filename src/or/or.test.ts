import { createEvent, createStore } from 'effector';
import { or } from './index';
import { argumentHistory, watch } from '../../test-library';

it('should be true when at least one thruthy value is present', () => {
  const $a = createStore(0);
  const $b = createStore('');
  const $c = createStore(false);
  const $d = createStore([]);

  const $result = or($a, $b, $c, $d);
  const fn = watch($result);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(true);
});

it('should be true when at least one store has truthy value', () => {
  const $counter = createStore(0);
  const iterate = createEvent();
  $counter.on(iterate, (i) => i + 1);
  const $a = $counter.map((i) => (i === 0 ? 1 : 0));
  const $b = $counter.map((i) => (i === 1 ? 'a' : ''));
  const $c = $counter.map((i) => (i === 2 ? true : false));
  const $d = $counter.map((i) => (i === 3 ? [] : null));
  const $e = $counter.map((i) => (i === 4 ? { a: 1 } : null));
  const $f = $counter.map((i) => (i === 5 ? () => {} : null));
  const $g = $counter.map((i) => (i === 6 ? Symbol.for('demo') : null));

  const $result = or($a, $b, $c, $d, $e, $f, $g);
  const fn = watch($result);

  iterate();
  iterate();
  iterate();
  iterate();
  iterate();
  iterate();

  expect(fn).toHaveBeenCalledTimes(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      true,
    ]
  `);
});

it('should be false if no truthy values is provided', () => {
  const $a = createStore(0);
  const $b = createStore('');
  const $c = createStore(false);
  const $d = createStore(null);
  const $e = createStore(NaN);

  const $result = or($a, $b, $c, $d, $e);
  const fn = watch($result);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(false);
});
