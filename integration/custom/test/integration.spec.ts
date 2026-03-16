import { createEffect, EventCallable } from 'effector';
import { status } from '@effector/patronum/status';
import { pending } from '@effector/patronum/macro';

test('change status: initial -> pending -> done', async () => {
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $status = status({ effect });
  const fn = jest.fn();

  $status.watch(fn);
  expect(fn).lastCalledWith('initial');

  effect();
  expect(fn).lastCalledWith('pending');

  await waitFor(effect.finally);
  expect(fn).lastCalledWith('done');
});

test('status has sid', () => {
  const effect = createEffect();

  expect(effect.sid).toBeDefined();
  expect(effect.sid).toMatchInlineSnapshot(`"uct7ws"`);

  const $status = status({ effect });

  expect($status.sid).toBeDefined();
  expect($status.sid).not.toBeNull();
  expect($status.sid).toMatchInlineSnapshot(`"-o5m1b3|ph7d4u"`);
});

test('pending macro works as expected', () => {
  const effect = createEffect();
  const $pending = pending({ effects: [effect] });

  expect($pending.sid).toBeDefined();
  expect($pending.sid).not.toBeNull();
  expect($pending.sid).toMatchInlineSnapshot(`"-hszfx7|a4upb3"`);
});

function waitFor<T>(unit: EventCallable<T>) {
  return new Promise<T>((resolve) => {
    const unsubscribe = unit.watch((payload) => {
      resolve(payload);
      unsubscribe();
    });
  });
}
