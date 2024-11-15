import { expectType } from 'tsd';
import { createStore, Store } from 'effector';
import { includes } from '../dist/includes';

/**
 * Should accept a string or array store with a compatible value
 */
{
  expectType<Store<boolean>>(includes(createStore('Hello world!'), 'Hello'));
  expectType<Store<boolean>>(includes(createStore(['a', 'b', 'c']), 'b'));
  expectType<Store<boolean>>(includes(createStore([1, 2, 3]), 2));
}

/**
 * Should accept a compatible value store
 */
{
  const $stringStore = createStore('Hello world!');
  const $searchString = createStore('Hello');
  expectType<Store<boolean>>(includes($stringStore, $searchString));

  const $arrayStore = createStore([1, 2, 3]);
  const $searchNumber = createStore(2);
  expectType<Store<boolean>>(includes($arrayStore, $searchNumber));
}

/**
 * Should reject stores with incompatible types
 */
{
  // @ts-expect-error
  includes(createStore('Hello world!'), 1);
  // @ts-expect-error
  includes(createStore([1, 2, 3]), 'Hello');
  // @ts-expect-error
  includes(createStore(['a', 'b', 'c']), 1);
  // @ts-expect-error
  includes(createStore([1, 2, 3]), createStore('Hello'));
}

// Should reject stores and literals with incompatible types
{
  // @ts-expect-error
  includes(createStore(true), 'Hello');
  // @ts-expect-error
  includes('Hello', createStore(1));
  // @ts-expect-error
  includes(createStore([1, 2, 3]), true);
  // @ts-expect-error
  includes(createStore(['a', 'b', 'c']), 1);
}

// Should allow literal values compatible with the store type
{
  expectType<Store<boolean>>(includes(createStore('Hello world!'), 'Hello'));
  expectType<Store<boolean>>(includes(createStore(['a', 'b', 'c']), 'b'));
  expectType<Store<boolean>>(includes(createStore([1, 2, 3]), 2));
}
