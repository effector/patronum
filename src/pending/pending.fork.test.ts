import { createDomain, forward, fork, allSettled } from 'effector';

import { pending } from './index';

// jest.useFakeTimers();

test('works in forked scope', async () => {
  const app = createDomain();
  const effect1 = app.createEffect(
    () => new Promise((resolve) => setTimeout(resolve, 10)),
  );
  const effect2 = app.createEffect(
    () => new Promise((resolve) => setTimeout(resolve, 10)),
  );
  const $pending = pending({ effects: [effect1, effect2] });
  const scope = fork();

  const finish = allSettled(effect1, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
}, 500);
//
test('works in forked scope with domain', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const $pending = pending({ domain: app });
  const scope = fork(app);

  const finish = allSettled(effect1, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});

test('concurrent run of different effects', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 50)),
  });
  const $pending = pending({ effects: [effect1, effect2] });
  const run = app.createEvent();
  forward({ from: run, to: [effect1, effect2] });

  const scope = fork(app);
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);

  const finish = allSettled(run, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});

test('concurrent run of different effects with domain', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 50)),
  });
  const $pending = pending({ domain: app });
  const run = app.createEvent();
  forward({ from: run, to: [effect1, effect2] });

  const scope = fork(app);
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);

  const finish = allSettled(run, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});
