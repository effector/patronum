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

beforeEach(() => {
  global.console.info = fn = jest.fn();
  global.console.groupCollapsed = fn;
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
      "[event] app/event 5",
      "[store] app/$store 5",
    ]
  `);

  allSettled(effect, { scope, params: 'demo' });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] app/event 5",
      "[store] app/$store 5",
      "[effect] app/effect demo",
    ]
  `);

  await 1;
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] app/event 5",
      "[store] app/$store 5",
      "[effect] app/effect demo",
      "[effect] app/effect.done {\\"params\\":\\"demo\\",\\"result\\":\\"result demo\\"}",
      "[store] app/$store 500",
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
    ]
  `);

  const scope = fork();

  await allSettled(inputChanged, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $form 0",
      "[store] $form 1",
      "[store] $form trace",
      "<- [store] $form 1",
      "<- [$form.on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
    ]
  `);

  await allSettled(buttonClicked, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $form 0",
      "[store] $form 1",
      "[store] $form trace",
      "<- [store] $form 1",
      "<- [$form.on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
      "[effect] submitFx 1",
      "[effect] submitFx trace",
      "<- [effect] submitFx 1",
      "<- [sample]  1",
      "<- [event] buttonClicked ",
      "[effect] submitFx.done {\\"params\\":1}",
      "[store] $form 2",
      "[store] $form trace",
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
