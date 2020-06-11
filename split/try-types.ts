/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { createEvent, createStore, sample, createApi } from 'effector';
import { split } from './index';

describe('split', () => {
  test('{source: store}', () => {
    const $move = createStore('left');
    const moveLeft = createEvent<string>();
    const moveRight = createEvent<string>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: $move,
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    // @ts-ignore
    $move.setState('right');

    expect(moveRightFn).toBeCalledWith('right');
    expect(moveLeftFn).toBeCalledTimes(0);
  });

  test('{source: store, key: string}', () => {
    const $move = createStore({ position: 'left' });
    const moveLeft = createEvent<{ position: string }>();
    const moveRight = createEvent<{ position: string }>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: $move,
      key: 'position',
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    // @ts-ignore
    $move.setState({ position: 'right' });

    expect(moveRightFn).toBeCalledWith({ position: 'right' });
    expect(moveLeftFn).toBeCalledTimes(0);

    // @ts-ignore
    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith({ position: 'left' });
  });

  test('{source: store, key: string, fn}', () => {
    const $move = createStore({ position: '' });
    const moveLeft = createEvent<{ position: string }>();
    const moveRight = createEvent<{ position: string }>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: $move,
      key: 'position',
      fn: ({ position }) => position.length,
      cases: {
        left: moveLeft, // triggered with 4
        right: moveRight, // triggered with 5
      },
    });

    // @ts-ignore
    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith(4);
    expect(moveRightFn).toBeCalledTimes(0);

    // @ts-ignore
    $move.setState({ position: 'right' });

    expect(moveRightFn).toBeCalledWith(5);
  });

  test('{source: event, key: fn, fn}', () => {
    const move = createEvent<{ position: string }>();
    const moveLeft = createEvent<number>();
    const moveRight = createEvent<number>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: move,
      key: (data) => data.position,
      fn: (state) => state.position.length,
      cases: {
        left: moveLeft, // triggered with 4
        right: moveRight, // triggered with 5
      },
    });

    move({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith(4);
    expect(moveRightFn).toBeCalledTimes(0);

    move({ position: 'right' });

    expect(moveRightFn).toBeCalledWith(5);
  });

  test('{source: combine, key: store}', () => {
    const $position = createStore('right');
    const $value = createStore(0);

    const moveLeft = createEvent<number>();
    const moveRight = createEvent<number>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: {
        value: $value,
      },
      key: $position,
      fn: ({ value }) => value + 1,
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    // @ts-ignore
    $value.setState(1);

    expect(moveRightFn).toBeCalledWith(2);
    expect(moveLeftFn).toBeCalledTimes(0);

    // @ts-ignore
    $position.setState('left');

    // @ts-ignore
    $value.setState(2);

    expect(moveLeftFn).toBeCalledWith(3);
  });

  test('{source: combine, key: fn} - default case', () => {
    const $position = createStore('left');
    const $value = createStore(1);

    const move = createEvent<number>();
    const moveLeft = createEvent<{ value; parameter: undefined }>();
    const moveRight = createEvent<{ value; parameter: undefined }>();
    const moveDefault = createEvent<{ value; parameter: undefined }>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();
    const moveDefaultFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);
    moveDefault.watch(moveDefaultFn);

    const movedData = sample({
      source: {
        value: $value,
        position: $position,
      },
      clock: move,
    });

    split({
      source: movedData,
      key: ({ position }) => position,
      fn: ({ value }) => ({ value, parameter: undefined }),
      cases: {
        left: moveLeft,
        right: moveRight,
        __: moveDefault,
      },
    });

    move(5);

    expect(moveLeftFn).toBeCalledWith({ value: 1, parameter: undefined });
    expect(moveRightFn).toBeCalledTimes(0);
    expect(moveDefaultFn).toBeCalledTimes(0);

    // @ts-ignore
    $position.setState('up');

    // @ts-ignore
    $value.setState(3);

    move(10);

    expect(moveDefaultFn).toBeCalledWith({ value: 3, parameter: undefined });
  });

  test('{source: combine, key: store} - no clock', () => {
    const $position = createStore('left');
    const $value = createStore(1);

    const move = createEvent<number>();
    const moveLeft = createEvent<{ value: number; parameter: undefined }>();
    const moveRight = createEvent<{ value: number; parameter: undefined }>();
    const moveDefault = createEvent<{ value: number; parameter: undefined }>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();
    const moveDefaultFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);
    moveDefault.watch(moveDefaultFn);

    split({
      source: {
        value: $value,
        position: $position,
      },
      key: ({ position }) => position,
      // Clock is not supported (clock is for sampling, use sample instead)
      // clock: move,
      fn: ({ value }) => ({ value, parameter: undefined }),
      cases: {
        left: moveLeft,
        right: moveRight,
        __: moveDefault,
      },
    });

    move(5);

    // Nothing happens
    expect(moveLeftFn).toBeCalledTimes(0);
    expect(moveRightFn).toBeCalledTimes(0);
    expect(moveDefaultFn).toBeCalledTimes(0);

    // @ts-ignore
    $position.setState('right');

    // @ts-ignore
    $value.setState(3);

    move(10);

    // No second parameter, because we don't use clock
    expect(moveRightFn).toBeCalledWith({ value: 3, parameter: undefined });
  });

  test('{source: store, key: fn => boolean}', () => {
    const $move = createStore({ position: '' });
    const moveLeft = createEvent<{ position: string }>();
    const moveRight = createEvent<{ position: string }>();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    split({
      source: $move,
      key: (state) => String(state.position === 'left'),
      cases: {
        true: moveLeft,
        false: moveRight,
      },
    });

    // @ts-ignore
    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith({ position: 'left' });
    expect(moveRightFn).toBeCalledTimes(0);
  });

  test('{source: store, cases: api}', () => {
    const $page = createStore('/');
    const nextPage = createEvent<string | void>();

    const pageFn = jest.fn();

    $page.watch(pageFn);

    // Use sample if you need a clock
    split({
      source: sample($page, nextPage),
      cases: createApi<string, any>($page, {
        '/intro': () => '/article',
        '/article': () => '/pricing',
        '/pricing': () => '/signup',
        __: () => '/intro',
      }),
    });

    expect(pageFn).toBeCalledWith('/');
    nextPage();
    expect(pageFn).toBeCalledWith('/intro');
    nextPage();
    expect(pageFn).toBeCalledWith('/article');
    nextPage();
    expect(pageFn).toBeCalledWith('/pricing');
    nextPage();
    expect(pageFn).toBeCalledWith('/signup');
    nextPage();
    expect(pageFn).toBeCalledWith('/intro');
  });

  test('{source: store, key: object}', () => {
    const $data = createStore({ value: 0 });
    const greater = createEvent<{ value: number }>();
    const less = createEvent<{ value: number }>();
    const equal = createEvent<{ value: number }>();

    const greaterFn = jest.fn();
    const lessFn = jest.fn();
    const equalFn = jest.fn();

    greater.watch(greaterFn);
    less.watch(lessFn);
    equal.watch(equalFn);

    split({
      source: $data,
      key: {
        greater: ({ value }) => value > 5,
        less: ({ value }) => value < 5,
        equal: ({ value }) => value === 5,
      },
      cases: {
        greater,
        less,
        equal,
      },
    });

    // @ts-ignore
    $data.setState({ value: 7 });

    expect(greaterFn).toBeCalledWith({ value: 7 });
    expect(lessFn).toBeCalledTimes(0);
    expect(equalFn).toBeCalledTimes(0);
  });
});
