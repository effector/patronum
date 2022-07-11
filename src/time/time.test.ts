import 'regenerator-runtime/runtime';
import { createEvent, is, sample } from 'effector';
import { time } from './index';

const TIME_0 = 1633813401260;
const TIME_1 = 1633813554125;
const TIME_2 = 1633813628994;

// WARNING: be sure, setTimeout, wait and other wont work
jest.useFakeTimers('modern');

beforeEach(() => {
  jest.setSystemTime(TIME_0);
});

test('initialize store with the current time', () => {
  const $time = time({ clock: createEvent() });
  expect(is.store($time)).toBeTruthy();
  expect($time.getState()).toBe(TIME_0);
});

test('update store on each clock trigger', () => {
  const clock = createEvent();
  const $time = time({ clock });
  expect($time.getState()).toBe(TIME_0);

  jest.setSystemTime(TIME_1);
  clock();
  expect($time.getState()).toBe(TIME_1);

  jest.setSystemTime(TIME_2);
  expect($time.getState()).toBe(TIME_1);
});

test('update store only after clock', async () => {
  const clock = createEvent();
  const $time = time({ clock });
  expect($time.getState()).toBe(TIME_0);

  jest.setSystemTime(TIME_1);
  await tick();
  jest.setSystemTime(TIME_2);
  await tick();

  clock();
  expect($time.getState()).toBe(TIME_2);
});

test('allows to change initial value', async () => {
  const clock = createEvent();
  const $time = time({ clock, initial: TIME_2 });
  expect($time.getState()).toBe(TIME_2);
});

test('after changing initial should comes back to correct', async () => {
  const clock = createEvent();
  const $time = time({ clock, initial: TIME_2 });
  expect($time.getState()).toBe(TIME_2);

  jest.setSystemTime(TIME_1);
  clock();
  expect($time.getState()).toBe(TIME_1);
});

test('allow to change time reading function', () => {
  const clock = createEvent();
  let counter = 0;
  const $time = time({ clock, getNow: () => ++counter });
  expect($time.getState()).toBe(1);

  clock();
  expect($time.getState()).toBe(2);

  clock();
  expect($time.getState()).toBe(3);
});

test('custom time reading function with initial should set correct initial', () => {
  const clock = createEvent();
  let counter = 0;
  const $time = time({ clock, getNow: () => ++counter, initial: 100 });
  expect($time.getState()).toBe(100);

  clock();
  expect($time.getState()).toBe(1);

  clock();
  expect($time.getState()).toBe(2);
});

test('any changes of $time store from outerworld should be overriden on clock', () => {
  const clock = createEvent();
  const force = createEvent();
  let counter = 0;
  const $time = time({ clock, getNow: () => ++counter });
  sample({ clock: force, fn: () => 1000, target: $time });
  expect($time.getState()).toBe(1);

  force();
  expect($time.getState()).toBe(1000);

  clock();
  expect($time.getState()).toBe(2);
});

function tick() {
  return new Promise<void>((resolve) => {
    resolve();
  });
}
