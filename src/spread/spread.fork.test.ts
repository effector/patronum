import { createDomain, restore, fork, serialize, allSettled } from 'effector';

import { spread } from './index';

test('works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number; third: string }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const $thirdA = app.createStore('');
  const $thirdB = app.createStore('');

  const $first = app.createStore('').on(first, (_, p) => p);
  const $second = restore(second, 0);

  spread({
    source,
    targets: { first, second, third: [$thirdA, $thirdB] },
  });

  const scope = fork();

  await allSettled(source, {
    scope,
    params: { first: 'sergey', second: 26, third: '30' },
  });

  expect(scope.getState($first)).toBe('sergey');
  expect(scope.getState($second)).toBe(26);
  expect(scope.getState($thirdA)).toBe('30');
  expect(scope.getState($thirdB)).toBe('30');
});

test('do not affects original store state', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number; third: string }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const $thirdA = app.createStore('');
  const $thirdB = app.createStore('');

  const $first = app.createStore('').on(first, (_, p) => p);
  const $second = restore(second, 0);

  spread({
    source,
    targets: { first, second, third: [$thirdA, $thirdB] },
  });

  const scope = fork();

  await allSettled(source, {
    scope,
    params: { first: 'sergey', second: 26, third: '30' },
  });

  expect(scope.getState($first)).toBe('sergey');
  expect(scope.getState($second)).toBe(26);
  expect(scope.getState($thirdA)).toBe('30');
  expect(scope.getState($thirdB)).toBe('30');

  expect($first.getState()).toBe('');
  expect($second.getState()).toBe(0);
  expect($thirdA.getState()).toBe('');
  expect($thirdB.getState()).toBe('');
});

test('do not affects another scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number; third: string }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const $thirdA = app.createStore('');
  const $thirdB = app.createStore('');

  const $first = app.createStore('').on(first, (_, p) => p);
  const $second = restore(second, 0);

  spread({
    source,
    targets: { first, second, third: [$thirdA, $thirdB] },
  });

  const scope1 = fork();
  const scope2 = fork();

  await Promise.all([
    allSettled(source, {
      scope: scope1,
      params: { first: 'sergey', second: 26, third: '30' },
    }),
    allSettled(source, {
      scope: scope2,
      params: { first: 'Anon', second: 90, third: '154' },
    }),
  ]);

  expect(scope1.getState($first)).toBe('sergey');
  expect(scope1.getState($second)).toBe(26);
  expect(scope1.getState($thirdA)).toBe('30');
  expect(scope1.getState($thirdB)).toBe('30');

  expect(scope2.getState($first)).toBe('Anon');
  expect(scope2.getState($second)).toBe(90);
  expect(scope2.getState($thirdA)).toBe('154');
  expect(scope2.getState($thirdB)).toBe('154');
});
