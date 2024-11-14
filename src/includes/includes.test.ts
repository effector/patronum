import { createEvent, createStore } from 'effector';
import { includes } from './index';
import { not } from '../not';

describe('includes', () => {
  it('should return true if number is included in array', () => {
    const $array = createStore([1, 2, 3]);
    const $result = includes($array, 2);

    expect($result.getState()).toBe(true);
  });

  it('should return false if number is not included in array', () => {
    const $array = createStore([1, 2, 3]);
    const $result = includes($array, 4);

    expect($result.getState()).toBe(false);
  });

  it('should return true if store number is included in array', () => {
    const $array = createStore([1, 2, 3]);
    const $findInArray = createStore(2);
    const $result = includes($array, $findInArray);

    expect($result.getState()).toBe(true);
  });

  it('should return true if store number is not included in array', () => {
    const $array = createStore([1, 2, 3]);
    const $findInArray = createStore(4);
    const $result = includes($array, $findInArray);

    expect($result.getState()).toBe(false);
  });

  it('should return true if string is included in string store', () => {
    const $string = createStore('Hello world!');
    const $result = includes($string, 'Hello');

    expect($result.getState()).toBe(true);
  });

  it('should return false if string is not included in string store', () => {
    const $string = createStore('Hello world!');
    const $result = includes($string, 'Goodbye');

    expect($result.getState()).toBe(false);
  });

  it('should return true if store string is included in string store', () => {
    const $string = createStore('Hello world!');
    const $findInString = createStore('Hello');
    const $result = includes($string, $findInString);

    expect($result.getState()).toBe(true);
  });

  it('should return true if store string is not included in string store', () => {
    const $string = createStore('Hello world!');
    const $findInString = createStore('Goodbye');
    const $result = includes($string, $findInString);

    expect($result.getState()).toBe(false);
  });

  it('should composed with other methods in patronum', () => {
    const $string = createStore('Hello world!');
    const $findInString = createStore('Goodbye');
    const $result = not(includes($string, $findInString));

    expect($result.getState()).toBe(true);
  });

  it('should throw an error if first argument is a number instead of array or string', () => {
    const $number = createStore(5);
    const $findNumber = createStore(5);

    expect(() => includes(($number as any), $findNumber)).toThrowError(
      'first argument should be an unit of array or string'
    );
  });
});
