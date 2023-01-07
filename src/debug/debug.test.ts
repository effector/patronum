import {
  createEvent,
  createEffect,
  createStore,
  createDomain,
  sample,
  guard,
  forward,
  split,
  merge,
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

test('debug event, store, effect simultaneously', async () => {
  const event = createEvent<number>();
  const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
  const $store = createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);

  debug($store, event, effect);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $store [getState] 0",
    ]
  `);

  event(5);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $store [getState] 0",
      "[event] event 5",
      "[store] $store 5",
    ]
  `);

  effect('demo');
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $store [getState] 0",
      "[event] event 5",
      "[store] $store 5",
      "[effect] effect demo",
    ]
  `);

  await 1;

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $store [getState] 0",
      "[event] event 5",
      "[store] $store 5",
      "[effect] effect demo",
      "[effect] effect.finally {"status":"done","params":"demo","result":"resultdemo"}",
      "[effect] effect.done {"params":"demo","result":"resultdemo"}",
      "[store] $store 50",
    ]
  `);
});

test('debug domain', async () => {
  const domain = createDomain();
  const event = domain.createEvent<number>();
  const effect = domain
    .createEffect()
    .use((payload) => Promise.resolve('result' + payload));
  const _$store = domain
    .createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);

  debug(domain);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] domain/_$store [getState] 0",
    ]
  `);

  event(5);
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] domain/_$store [getState] 0",
      "[event] domain/event 5",
      "[store] domain/_$store 5",
    ]
  `);

  effect('demo');
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] domain/_$store [getState] 0",
      "[event] domain/event 5",
      "[store] domain/_$store 5",
      "[effect] domain/effect demo",
    ]
  `);

  await 1;

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] domain/_$store [getState] 0",
      "[event] domain/event 5",
      "[store] domain/_$store 5",
      "[effect] domain/effect demo",
      "[effect] domain/effect.finally {"status":"done","params":"demo","result":"resultdemo"}",
      "[effect] domain/effect.done {"params":"demo","result":"resultdemo"}",
      "[store] domain/_$store 50",
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
    [
      "[store] $form [getState] 0",
    ]
  `);

  inputChanged();

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $form [getState] 0",
      "[store] $form 1",
      "[store] $form trace",
      "<- [store] $form 1",
      "<- [on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
    ]
  `);

  buttonClicked();

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $form [getState] 0",
      "[store] $form 1",
      "[store] $form trace",
      "<- [store] $form 1",
      "<- [on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
      "[effect] submitFx 1",
      "[effect] submitFx trace",
      "<- [effect] submitFx 1",
      "<- [sample]  1",
      "<- [event] buttonClicked ",
      "[effect] submitFx.finally {"status":"done","params":1}",
      "[effect] submitFx.done {"params":1}",
      "[store] $form 2",
      "[store] $form trace",
      "<- [store] $form 2",
      "<- [on] $form.on(submitFx.doneData) 2",
      "<- [effect] submitFx.doneData ",
      "<- [map]  ",
      "<- [effect] submitFx.done {"params":1}",
      "<- [filterMap]  {"params":1}",
      "<- [effect] submitFx.finally {"status":"done","params":1}",
    ]
  `);
});

test('domain is traceable', async () => {
  const d = createDomain();
  const up = d.createEvent();
  const $c = d.createStore(0).on(up, (s) => s + 1);
  const fx = d.createEffect(() => {});

  sample({
    clock: $c,
    target: fx,
  });

  debug({ trace: true }, d);

  up();

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] d/$c [getState] 0",
      "[event] d/up ",
      "[event] d/up trace",
      "<- [event] up ",
      "[store] d/$c 1",
      "[store] d/$c trace",
      "<- [store] $c 1",
      "<- [on] $c.on(up) 1",
      "<- [event] up ",
      "[effect] d/fx 1",
      "[effect] d/fx trace",
      "<- [effect] fx 1",
      "<- [sample]  1",
      "<- [store] $c 1",
      "<- [on] $c.on(up) 1",
      "<- [event] up ",
      "[effect] d/fx.finally {"status":"done","params":1}",
      "[effect] d/fx.done {"params":1}",
    ]
  `);
});

test('custom names basic support', () => {
  const event = createEvent<number>();
  const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
  const $store = createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);
  sample({
    clock: event,
    target: effect,
  });

  debug({ $customName: $store, name: event, nameFx: effect });
  event(1);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $customName [getState] 0",
      "[event] name 1",
      "[store] $customName 1",
      "[effect] nameFx 1",
    ]
  `);
});

test('custom names with traces support', () => {
  const event = createEvent<number>();
  const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
  const $store = createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);
  sample({
    clock: event,
    target: effect,
  });

  debug({ trace: true }, { $customName: $store, name: event, nameFx: effect });
  event(1);

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $customName [getState] 0",
      "[event] name 1",
      "[event] name trace",
      "<- [event] name 1",
      "[store] $customName 1",
      "[store] $customName trace",
      "<- [store] $customName 1",
      "<- [on] $customName.on(name) 1",
      "<- [event] name 1",
      "[effect] nameFx 1",
      "[effect] nameFx trace",
      "<- [effect] nameFx 1",
      "<- [sample]  1",
      "<- [event] name 1",
    ]
  `);
});
