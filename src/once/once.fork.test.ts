import { allSettled, createEvent, fork, serialize } from 'effector';
import { once } from './index';

it('persists state between scopes', async () => {
  const fn = jest.fn();

  const trigger = createEvent<void>();
  const derived = once(trigger);

  derived.watch(fn);

  const scope1 = fork();
  await allSettled(trigger, { scope: scope1 });

  const scope2 = fork({ values: serialize(scope1) });
  await allSettled(trigger, { scope: scope2 });

  expect(fn).toHaveBeenCalledTimes(1);
});
