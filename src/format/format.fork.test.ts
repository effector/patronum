import 'regenerator-runtime/runtime';
import {
  fork,
  serialize,
  allSettled,
  createDomain,
  createEvent,
  createStore,
} from 'effector';
import { format } from './index';

test('format works in forked scope', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork();

  await allSettled(changeName, { scope });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "c710t": "Bob",
    }
  `);

  expect(scope.getState($result)).toBe('My name is Bob');
});

test('format works without domain', async () => {
  const changeName = createEvent();
  const $name = createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork();

  await allSettled(changeName, { scope });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "t7xz2o": "Bob",
    }
  `);

  expect(scope.getState($result)).toBe('My name is Bob');
});

test('format do not affect another forks', async () => {
  const app = createDomain();

  const changeName = app.createEvent<string>();
  const changeAge = app.createEvent<number>();
  const $name = app.createStore('Mike').on(changeName, (_, name) => name);
  const $age = app.createStore(28).on(changeAge, (_, age) => age);

  const $result = format`That ${$name} is a ${$age}`;

  const firstScope = fork();
  const secondScope = fork();

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
    {
      "-bia9o0": "Bob",
      "-lsyf4s": 30,
    }
  `);
  expect(serialize(secondScope)).toMatchInlineSnapshot(`
    {
      "-bia9o0": "Kate",
      "-lsyf4s": 18,
    }
  `);

  expect(firstScope.getState($result)).toBe('That Bob is a 30');
  expect(secondScope.getState($result)).toBe('That Kate is a 18');
});

test('format do not affect original store value', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork();

  await allSettled(changeName, { scope });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    {
      "-1mgzy9": "Bob",
    }
  `);

  expect($result.getState()).toBe('My name is Mike');
});
