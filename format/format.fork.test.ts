import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { format } from '.';

test('format works in forked scope', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const _$result = format`My name is ${$name}`;

  const scope = fork(app);

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "b87jz2": "Bob",
    }
  `);
});

test('format do not affect another forks', async () => {
  const app = createDomain();

  const changeName = app.createEvent<string>();
  const changeAge = app.createEvent<number>();
  const $name = app.createStore('Mike').on(changeName, (_, name) => name);
  const $age = app.createStore(28).on(changeAge, (_, age) => age);

  const _$result = format`That ${$name} is a ${$age}`;

  const firstScope = fork(app);
  const secondScope = fork(app);

  await allSettled(changeName, {
    scope: firstScope,
    params: 'Bob',
  });

  await allSettled(changeName, {
    scope: secondScope,
    params: 'Kate',
  });

  await allSettled(changeAge, {
    scope: firstScope,
    params: 30,
  });

  await allSettled(changeAge, {
    scope: secondScope,
    params: 18,
  });

  expect(serialize(firstScope)).toMatchInlineSnapshot(`
    Object {
      "-t0z2df": "Bob",
      "e0szo1": 30,
    }
  `);
  expect(serialize(secondScope)).toMatchInlineSnapshot(`
    Object {
      "-t0z2df": "Kate",
      "e0szo1": 18,
    }
  `);
});

test('format do not affect original store value', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork(app);

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "wivsvv": "Bob",
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`"My name is Mike"`);
});
