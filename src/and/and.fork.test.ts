import { allSettled, createEvent, createStore, fork } from 'effector';
import { and } from './index';
import { argumentHistory, watch } from '../../test-library';

test('When at least one store has falsy value result must be false', async () => {
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

  const scope = fork();

  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });

  expect(fn).toHaveBeenCalledTimes(2); // twice because of the scope and initial
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      false,
    ]
  `);
  expect(scope.getState($result)).toBe(false);
});
