import { allSettled, createEvent, createStore, fork } from 'effector';
import { includes } from './index';

it('should return true if number is included in array', async () => {
  const $array = createStore([1, 2, 3]);
  const $result = includes($array, 2);

  const scope = fork();
  expect(scope.getState($result)).toBe(true);
});

it('should return false if number is not included in array', async () => {
  const $array = createStore([1, 2, 3]);
  const $result = includes($array, 4);

  const scope = fork();
  expect(scope.getState($result)).toBe(false);
});

it('should return true if store number is included in array', async () => {
  const $array = createStore([1, 2, 3]);
  const $findInArray = createStore(2);
  const $result = includes($array, $findInArray);

  const scope = fork();
  expect(scope.getState($result)).toBe(true);
});

it('should return true if string is included in string store', async () => {
  const $string = createStore('Hello world!');
  const $result = includes($string, 'Hello');

  const scope = fork();
  expect(scope.getState($result)).toBe(true);
});

it('should return false if string is not included in string store', async () => {
  const $string = createStore('Hello world!');
  const $result = includes($string, 'Goodbye');

  const scope = fork();
  expect(scope.getState($result)).toBe(false);
});

it('should return true if store string is included in string store', async () => {
  const $string = createStore('Hello world!');
  const $findInString = createStore('Hello');
  const $result = includes($string, $findInString);

  const scope = fork();
  expect(scope.getState($result)).toBe(true);
});

it('should update result if array store changes', async () => {
  const updateArray = createEvent<number[]>();
  const $array = createStore([1, 2, 3]).on(updateArray, (_, newArray) => newArray);
  const $result = includes($array, 4);

  const scope = fork();
  expect(scope.getState($result)).toBe(false);

  await allSettled(updateArray, { scope, params: [1, 2, 3, 4] });
  expect(scope.getState($result)).toBe(true);
});

it('should update result if string store changes', async () => {
  const changeString = createEvent<string>();
  const $array = createStore('Hello world!');
  const $findInArray = createStore('Goodbye').on(changeString, (_, newString) => newString);
  const $result = includes($array, $findInArray);

  const scope = fork();
  expect(scope.getState($result)).toBe(false);

  await allSettled(changeString, { scope, params: 'world' });
  expect(scope.getState($result)).toBe(true);
});

it('should throw an error if first argument is a number instead of array or string', () => {
  const $number = createStore(5);
  const $findNumber = createStore(5);

  expect(() => includes(($number as any), $findNumber)).toThrowError(
    'first argument should be an unit of array or string'
  );
});
