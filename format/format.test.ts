import { createStore, createEvent } from 'effector';
import { argumentHistory } from '../test-library';
import { format } from './index';

test('using same type of storage', () => {
  const fn = jest.fn();

  const changeName = createEvent();
  const $name = createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith('My name is Mike');

  changeName();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "My name is Mike",
      "My name is Bob",
    ]
  `);
});

test('using different types of storage', () => {
  const fn = jest.fn();
  const changeName = createEvent();
  const changeAge = createEvent();

  const $name = createStore('Mike').on(changeName, () => 'Bob');
  const $age = createStore(28).on(changeAge, () => 30);

  const $result = format`That ${$name} is a ${$age}`;

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith('That Mike is a 28');

  changeName();
  changeAge();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "That Mike is a 28",
      "That Bob is a 28",
      "That Bob is a 30",
    ]
  `);
});
