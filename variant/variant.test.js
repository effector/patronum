// @ts-nocheck
const { createEvent, createStore, createApi } = require('effector');
const { variant } = require('./index');

describe('variant', () => {
  test('{source: store}', () => {
    const $move = createStore('left');
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
      source: $move,
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    $move.setState('right');

    expect(moveRightFn).toBeCalledWith('right');
    expect(moveLeftFn).toBeCalledTimes(0);
  });

  test('{source: store, key: string}', () => {
    const $move = createStore({ position: 'left' });
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
      source: $move,
      key: 'position',
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    $move.setState({ position: 'right' });

    expect(moveRightFn).toBeCalledWith({ position: 'right' });
    expect(moveLeftFn).toBeCalledTimes(0);

    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith({ position: 'left' });
  });

  test('{source: store, key: string, fn}', () => {
    const $move = createStore({ position: '' });
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
      source: $move,
      key: 'position',
      fn: ({ position }) => position.length,
      cases: {
        left: moveLeft, // triggered with 4
        right: moveRight, // triggered with 5
      },
    });

    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith(4);
    expect(moveRightFn).toBeCalledTimes(0);

    $move.setState({ position: 'right' });

    expect(moveRightFn).toBeCalledWith(5);
  });

  test('{source: event, key: fn, fn}', () => {
    const move = createEvent();
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
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

  test('{source: combine, key: store, clock}', () => {
    const $position = createStore('right');
    const $value = createStore(1);

    const move = createEvent();
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
      source: {
        value: $value,
      },
      clock: move,
      key: $position,
      fn: ({ value }, parameter) => value + parameter,
      cases: {
        left: moveLeft,
        right: moveRight,
      },
    });

    move(1);

    expect(moveRightFn).toBeCalledWith(2);
    expect(moveLeftFn).toBeCalledTimes(0);

    $position.setState('left');

    move(2);

    expect(moveLeftFn).toBeCalledWith(3);
  });

  test('{source: combine, key: string, clock}', () => {
    const $position = createStore('left');
    const $value = createStore(1);

    const move = createEvent();
    const moveLeft = createEvent();
    const moveRight = createEvent();
    const moveDefault = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();
    const moveDefaultFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);
    moveDefault.watch(moveDefaultFn);

    variant({
      source: {
        value: $value,
        position: $position,
      },
      clock: move,
      key: ({ position }) => position,
      fn: ({ value }, parameter) => value + parameter,
      cases: {
        left: moveLeft,
        right: moveRight,
        __: moveDefault,
      },
    });

    move(1);

    expect(moveLeftFn).toBeCalledWith(2);
    expect(moveRightFn).toBeCalledTimes(0);
    expect(moveDefaultFn).toBeCalledTimes(0);

    $position.setState('up');

    move(2);

    expect(moveDefaultFn).toBeCalledWith(3);
  });

  test('{source: store, key: fn => boolean}', () => {
    const $move = createStore({ position: '' });
    const moveLeft = createEvent();
    const moveRight = createEvent();

    const moveLeftFn = jest.fn();
    const moveRightFn = jest.fn();

    moveLeft.watch(moveLeftFn);
    moveRight.watch(moveRightFn);

    variant({
      source: $move,
      key: (state) => state.position === 'left',
      cases: {
        true: moveLeft,
        false: moveRight,
      },
    });

    $move.setState({ position: 'left' });

    expect(moveLeftFn).toBeCalledWith({ position: 'left' });
    expect(moveRightFn).toBeCalledTimes(0);
  });

  test('{source: store, cases: api}', () => {
    const $page = createStore('/');
    const nextPage = createEvent();

    const pageFn = jest.fn();

    $page.watch(pageFn);

    variant({
      source: $page,
      clock: nextPage,
      cases: createApi($page, {
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
});
