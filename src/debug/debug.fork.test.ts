import {
  createDomain,
  fork,
  allSettled,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

import { argumentsHistory } from '../../test-library';
import { debug } from './index';

const stringArguments = (ƒ: any) =>
  argumentsHistory(ƒ).map((value) =>
    value.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '),
  );

const originalCollapsed = global.console.groupCollapsed;
const original = global.console.info;
let fn: any;

const setMocks = () => {
  global.console.info = fn = jest.fn();
  global.console.groupCollapsed = fn;
};
const clearConsole = setMocks;

beforeEach(() => {
  setMocks();
});
afterEach(() => {
  global.console.info = original;
  global.console.groupCollapsed = originalCollapsed;
});

test('works in forked scope', async () => {
  const app = createDomain();
  const event = app.createEvent<number>();
  const effect = app.createEffect(async (payload: string) => `result ${payload}`);
  const $store = app
    .createStore(0)
    .on(event, (counter, payload) => counter + payload)
    .on(effect.done, (counter) => counter * 100);
  debug($store, event, effect);
  const scope = fork(app);

  await allSettled(event, { scope, params: 5 });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] (scope: unknown_scope_1) app/event 5",
      "[store] (scope: unknown_scope_1) app/$store 5",
    ]
  `);

  allSettled(effect, { scope, params: 'demo' });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] (scope: unknown_scope_1) app/event 5",
      "[store] (scope: unknown_scope_1) app/$store 5",
      "[effect] (scope: unknown_scope_1) app/effect demo",
    ]
  `);

  await 1;
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] (scope: unknown_scope_1) app/event 5",
      "[store] (scope: unknown_scope_1) app/$store 5",
      "[effect] (scope: unknown_scope_1) app/effect demo",
      "[effect] (scope: unknown_scope_1) app/effect.done {\\"params\\":\\"demo\\",\\"result\\":\\"result demo\\"}",
      "[store] (scope: unknown_scope_1) app/$store 500",
    ]
  `);
});

test('trace support', async () => {
  const buttonClicked = createEvent();
  const inputChanged = createEvent();
  const $form = createStore(0).on(inputChanged, (s) => s + 1);
  const $formValid = $form.map((s) => s > 0);
  const submitFx = createEffect(() => {});

  $form.on(submitFx.doneData, (s) => s + 1);

  sample({
    source: $form,
    clock: buttonClicked,
    filter: $formValid,
    target: submitFx,
  });

  debug({ trace: true }, $form, submitFx);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $form 0",
      "[store] (scope: unknown_scope_1) $form 0",
    ]
  `);

  const scope = fork();

  await allSettled(inputChanged, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $form 0",
      "[store] (scope: unknown_scope_1) $form 0",
      "[store] (scope: unknown_scope_2) $form 1",
      "[store] (scope: unknown_scope_2) $form trace",
      "<- [store] $form 1",
      "<- [$form.on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
    ]
  `);

  await allSettled(buttonClicked, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $form 0",
      "[store] (scope: unknown_scope_1) $form 0",
      "[store] (scope: unknown_scope_2) $form 1",
      "[store] (scope: unknown_scope_2) $form trace",
      "<- [store] $form 1",
      "<- [$form.on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
      "[effect] (scope: unknown_scope_2) submitFx 1",
      "[effect] (scope: unknown_scope_2) submitFx trace",
      "<- [effect] submitFx 1",
      "<- [sample]  1",
      "<- [event] buttonClicked ",
      "[effect] (scope: unknown_scope_2) submitFx.done {\\"params\\":1}",
      "[store] (scope: unknown_scope_2) $form 2",
      "[store] (scope: unknown_scope_2) $form trace",
      "<- [store] $form 2",
      "<- [$form.on] $form.on(submitFx.doneData) 2",
      "<- [event] submitFx.doneData ",
      "<- [map]  ",
      "<- [event] submitFx.done {\\"params\\":1}",
      "<- [filterMap]  {\\"params\\":1}",
      "<- [event] submitFx.finally {\\"status\\":\\"done\\",\\"params\\":1}",
    ]
  `);
});

test('can detect and save unknown scopes', async () => {
  const up = createEvent();
  const $count = createStore([]).on(up, () => []);
  const fx = createEffect(() => {});
  sample({
    clock: $count,
    target: fx,
  });

  debug(fx);

  const scopeA = fork();
  const scopeB = fork();

  await allSettled(up, { scope: scopeA });
  const firstRun = stringArguments(fn);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: unknown_scope_3) fx []",
      "[effect] (scope: unknown_scope_3) fx.done {\\"params\\":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeB });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: unknown_scope_4) fx []",
      "[effect] (scope: unknown_scope_4) fx.done {\\"params\\":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeA });
  const secondRun = stringArguments(fn);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: unknown_scope_3) fx []",
      "[effect] (scope: unknown_scope_3) fx.done {\\"params\\":[]}",
    ]
  `);
  expect(secondRun).toEqual(firstRun);
});

test('can detect registered scopes', async () => {
  const up = createEvent();
  const $count = createStore([]).on(up, () => []);
  const fx = createEffect(() => {});
  sample({
    clock: $count,
    target: fx,
  });

  debug(fx);

  const scopeA = fork();
  const scopeB = fork();

  debug.registerScope(scopeA, { name: 'scope_a' });
  debug.registerScope(scopeB, { name: 'scope_b' });

  await allSettled(up, { scope: scopeA });
  const firstRun = stringArguments(fn);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: scope_a) fx []",
      "[effect] (scope: scope_a) fx.done {\\"params\\":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeB });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: scope_b) fx []",
      "[effect] (scope: scope_b) fx.done {\\"params\\":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeA });
  const secondRun = stringArguments(fn);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[effect] (scope: scope_a) fx []",
      "[effect] (scope: scope_a) fx.done {\\"params\\":[]}",
    ]
  `);
  expect(secondRun).toEqual(firstRun);
});

test('prints default state for store in each of the known scopes', () => {
  const $count = createStore(0);

  const scopeA = fork({
    values: [[$count, 42]],
  });
  const scopeB = fork({
    values: [[$count, 1337]],
  });

  debug.unregisterAllScopes();
  debug.registerScope(scopeA, { name: 'scope_42' });
  debug.registerScope(scopeB, { name: 'scope_1337' });

  debug($count);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $count 0",
      "[store] (scope: scope_42) $count 42",
      "[store] (scope: scope_1337) $count 1337",
    ]
  `);
});

test('individual scope can be unregistered', () => {
  const $count = createStore(0);

  const scopeA = fork({
    values: [[$count, 42]],
  });
  const scopeB = fork({
    values: [[$count, 1337]],
  });

  debug.unregisterAllScopes();
  const unreg = debug.registerScope(scopeA, { name: 'scope_42' });
  debug.registerScope(scopeB, { name: 'scope_1337' });

  unreg();
  debug($count);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $count 0",
      "[store] (scope: scope_1337) $count 1337",
    ]
  `);
});

test('traces have scope', () => {});
