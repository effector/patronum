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
    [
      "[store] app/$store [getState] 0",
      "[event] (scope: unknown_1) app/event 5",
      "[store] (scope: unknown_1) app/$store 5",
    ]
  `);

  allSettled(effect, { scope, params: 'demo' });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] app/$store [getState] 0",
      "[event] (scope: unknown_1) app/event 5",
      "[store] (scope: unknown_1) app/$store 5",
      "[effect] (scope: unknown_1) app/effect demo",
    ]
  `);

  await 1;
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] app/$store [getState] 0",
      "[event] (scope: unknown_1) app/event 5",
      "[store] (scope: unknown_1) app/$store 5",
      "[effect] (scope: unknown_1) app/effect demo",
      "[effect] (scope: unknown_1) app/effect.finally {"status":"done","params":"demo","result":"result demo"}",
      "[effect] (scope: unknown_1) app/effect.done {"params":"demo","result":"result demo"}",
      "[store] (scope: unknown_1) app/$store 500",
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
      "[store] (scope: unknown_1) $form [getState] 0",
    ]
  `);

  const scope = fork();

  await allSettled(inputChanged, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $form [getState] 0",
      "[store] (scope: unknown_1) $form [getState] 0",
      "[store] (scope: unknown_2) $form 1",
      "[store] (scope: unknown_2) $form trace",
      "<- [store] $form 1",
      "<- [on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
    ]
  `);

  await allSettled(buttonClicked, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $form [getState] 0",
      "[store] (scope: unknown_1) $form [getState] 0",
      "[store] (scope: unknown_2) $form 1",
      "[store] (scope: unknown_2) $form trace",
      "<- [store] $form 1",
      "<- [on] $form.on(inputChanged) 1",
      "<- [event] inputChanged ",
      "[effect] (scope: unknown_2) submitFx 1",
      "[effect] (scope: unknown_2) submitFx trace",
      "<- [effect] submitFx 1",
      "<- [sample]  1",
      "<- [event] buttonClicked ",
      "[effect] (scope: unknown_2) submitFx.finally {"status":"done","params":1}",
      "[effect] (scope: unknown_2) submitFx.done {"params":1}",
      "[store] (scope: unknown_2) $form 2",
      "[store] (scope: unknown_2) $form trace",
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
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: unknown_3) fx []",
      "[effect] (scope: unknown_3) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: unknown_3) fx.done {"params":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeB });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: unknown_4) fx []",
      "[effect] (scope: unknown_4) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: unknown_4) fx.done {"params":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeA });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: unknown_3) fx []",
      "[effect] (scope: unknown_3) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: unknown_3) fx.done {"params":[]}",
    ]
  `);
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

  debug.unregisterAllScopes();
  debug.registerScope(scopeA, { name: 'scope_a' });
  debug.registerScope(scopeB, { name: 'scope_b' });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] (scope: scope_a) app/$store [getState] 0",
      "[store] (scope: scope_a) $form [getState] 0",
      "[store] (scope: scope_b) app/$store [getState] 0",
      "[store] (scope: scope_b) $form [getState] 0",
    ]
  `);

  clearConsole();

  await allSettled(up, { scope: scopeA });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: scope_a) fx []",
      "[effect] (scope: scope_a) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: scope_a) fx.done {"params":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeB });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: scope_b) fx []",
      "[effect] (scope: scope_b) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: scope_b) fx.done {"params":[]}",
    ]
  `);
  clearConsole();

  await allSettled(up, { scope: scopeA });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[effect] (scope: scope_a) fx []",
      "[effect] (scope: scope_a) fx.finally {"status":"done","params":[]}",
      "[effect] (scope: scope_a) fx.done {"params":[]}",
    ]
  `);
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
    [
      "[store] (scope: scope_42) app/$store [getState] 0",
      "[store] (scope: scope_42) $form [getState] 0",
      "[store] (scope: scope_1337) app/$store [getState] 0",
      "[store] (scope: scope_1337) $form [getState] 0",
      "[store] $count [getState] 0",
      "[store] (scope: scope_42) $count [getState] 42",
      "[store] (scope: scope_1337) $count [getState] 1337",
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
    [
      "[store] (scope: scope_42) app/$store [getState] 0",
      "[store] (scope: scope_42) $form [getState] 0",
      "[store] (scope: scope_42) $count [getState] 0",
      "[store] (scope: scope_1337) app/$store [getState] 0",
      "[store] (scope: scope_1337) $form [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 0",
      "[store] $count [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 1337",
    ]
  `);
});

test('traces have scope name', async () => {
  const buttonClicked = createEvent();
  const inputChanged = createEvent();
  const $form = createStore(1).on(inputChanged, (s) => s + 1);
  const $formValid = $form.map((s) => s > 0);
  const submitFx = createEffect(() => {});

  $form.on(submitFx.doneData, (s) => s + 1);

  sample({
    source: $form,
    clock: buttonClicked,
    filter: $formValid,
    target: submitFx,
  });

  debug({ trace: true }, submitFx);

  const scope = fork();
  debug.registerScope(scope, { name: 'my_scope' });

  await allSettled(buttonClicked, { scope });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] (scope: my_scope) app/$store [getState] 0",
      "[store] (scope: my_scope) $form [getState] 0",
      "[store] (scope: my_scope) $count [getState] 0",
      "[store] (scope: my_scope) $count [getState] 0",
      "[effect] (scope: my_scope) submitFx 1",
      "[effect] (scope: my_scope) submitFx trace",
      "<- [effect] submitFx 1",
      "<- [sample]  1",
      "<- [event] buttonClicked ",
      "[effect] (scope: my_scope) submitFx.finally {"status":"done","params":1}",
      "[effect] (scope: my_scope) submitFx.done {"params":1}",
    ]
  `);
});

test('logs stores for newly registered scope', async () => {
  const $count = createStore(0);

  const scopeA = fork({
    values: [[$count, 42]],
  });
  const scopeB = fork({
    values: [[$count, 1337]],
  });

  debug($count);

  debug.unregisterAllScopes();
  debug.registerScope(scopeA, { name: 'scope_42' });
  debug.registerScope(scopeB, { name: 'scope_1337' });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[store] $count [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 0",
      "[store] (scope: my_scope) $count [getState] 0",
      "[store] (scope: scope_42) app/$store [getState] 0",
      "[store] (scope: scope_42) $form [getState] 0",
      "[store] (scope: scope_42) $count [getState] 0",
      "[store] (scope: scope_42) $count [getState] 0",
      "[store] (scope: scope_42) $count [getState] 42",
      "[store] (scope: scope_1337) app/$store [getState] 0",
      "[store] (scope: scope_1337) $form [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 0",
      "[store] (scope: scope_1337) $count [getState] 1337",
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
  clearConsole();

  const scope = fork();

  allSettled(event, { scope, params: 1 });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[event] (scope: unknown_5) name 1",
      "[store] (scope: unknown_5) $customName 1",
      "[effect] (scope: unknown_5) nameFx 1",
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
  clearConsole();

  const scope = fork();

  allSettled(event, { scope, params: 1 });

  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    [
      "[event] (scope: unknown_6) name 1",
      "[event] (scope: unknown_6) name trace",
      "<- [event] name 1",
      "[store] (scope: unknown_6) $customName 1",
      "[store] (scope: unknown_6) $customName trace",
      "<- [store] $customName 1",
      "<- [on] $customName.on(name) 1",
      "<- [event] name 1",
      "[effect] (scope: unknown_6) nameFx 1",
      "[effect] (scope: unknown_6) nameFx trace",
      "<- [effect] nameFx 1",
      "<- [sample]  1",
      "<- [event] name 1",
    ]
  `);
});

test('allow custom handlers', async () => {
  const event = createEvent<number>();
  const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
  const $store = createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);
  sample({
    clock: event,
    target: effect,
  });

  const mockLog = jest.fn();

  const scope = fork();
  debug.unregisterAllScopes();
  debug.registerScope(scope, { name: 'my_scope' });

  debug(
    {
      trace: true,
      handler: (context) => {
        expect(typeof context.node).toEqual('object');
        expect(typeof context.scope).toEqual('object');

        mockLog(
          `${context.logType}.${context.scopeName}.${context.kind}.${context.name}.${context.value}`,
        );

        context.trace.forEach((trace) => {
          expect(typeof trace.node).toEqual('object');
          expect(context.scopeName).toEqual('my_scope');
          mockLog(
            `trace.${context.scopeName}.${trace.kind}.${trace.name}.${trace.value}`,
          );
        });
      },
    },
    { $customName: $store, name: event, nameFx: effect },
  );

  allSettled(event, { scope, params: 1 });

  expect(argumentsHistory(mockLog)).toMatchInlineSnapshot(`
    [
      [
        "initial.null.store.$customName.0",
      ],
      [
        "initial.my_scope.store.$customName.0",
      ],
      [
        "update.my_scope.event.name.1",
      ],
      [
        "trace.my_scope.event.name.1",
      ],
      [
        "update.my_scope.store.$customName.1",
      ],
      [
        "trace.my_scope.store.$customName.1",
      ],
      [
        "trace.my_scope.on.$customName.on(name).1",
      ],
      [
        "trace.my_scope.event.name.1",
      ],
      [
        "update.my_scope.effect.nameFx.1",
      ],
      [
        "trace.my_scope.effect.nameFx.1",
      ],
      [
        "trace.my_scope.sample.null.1",
      ],
      [
        "trace.my_scope.event.name.1",
      ],
    ]
  `);
});
