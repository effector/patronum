import { createEvent, createStore } from 'effector';
import { and } from './index';
import { argumentHistory, watch } from '../../test-library';

test('when each thruthy value is present result should be exactly true', () => {
  const $a = createStore(1);
  const $b = createStore('a');
  const $c = createStore(true);
  const $d = createStore([]);
  const $e = createStore({});
  const $f = createStore(() => {});
  const $g = createStore(Symbol.for('demo'));

  const $result = and($a, $b, $c, $d, $e, $f, $g);
  const fn = watch($result);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(true);
});

test('When at least one store has falsy value result must be false', () => {
  const $counter = createStore(0);
  const iterate = createEvent();
  $counter.on(iterate, (i) => i + 1);
  const $a = $counter.map((i) => (i === 0 ? 0 : 1));
  const $b = $counter.map((i) => (i === 1 ? '' : 'a'));
  const $c = $counter.map((i) => (i === 2 ? false : true));
  const $d = $counter.map((i) => (i === 3 ? null : [1]));
  const $e = $counter.map((i) => (i === 4 ? null : { a: 1 }));
  const $f = $counter.map((i) => (i === 5 ? null : () => {}));
  const $g = $counter.map((i) => (i === 6 ? null : Symbol.for('demo')));

  const $result = and($a, $b, $c, $d, $e, $f, $g);
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
      false,
    ]
  `);
});
