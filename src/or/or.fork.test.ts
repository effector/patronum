import { allSettled, createEvent, createStore, fork } from 'effector';
import { or } from './index';
import { argumentHistory, watch } from '../../test-library';

it('should be true when at least one store has truthy value', async () => {
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

  const scope = fork();

  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });
  await allSettled(iterate, { scope });

  expect(fn).toHaveBeenCalledTimes(2); // twice because of scope and initial
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    [
      true,
      true,
    ]
  `);
  expect(scope.getState($result)).toBe(true);
});

test('Returns boolean value for single store', async () => {
  const $storeOne = createStore('hello');

  const $andIncorrect = or($storeOne);

  const scope = fork();

  expect(scope.getState($andIncorrect)).toBe(true);
});
