import { createEffect, createEvent, createStore, restore } from 'effector';
import { reset } from './index';
import { watch } from '../../test-library';

describe('single target', () => {
  test('should reset single store from single event', () => {
    const setValue = createEvent<number>();
    const $source = restore(setValue, 0);
    const clock = createEvent();
    reset({ clock, target: $source });

    setValue(100);
    expect($source.getState()).toEqual(100);

    clock();
    expect($source.getState()).toEqual(0);
  });

  test('should reset store by store change', () => {
    const setSourceValue = createEvent<number>();
    const $source = restore(setSourceValue, 0);
    const setClockValue = createEvent<number>();
    const $clock = restore(setClockValue, 0);
    reset({ clock: $clock, target: $source });

    setSourceValue(100);
    expect($source.getState()).toEqual(100);

    setClockValue(1);
    expect($source.getState()).toEqual(0);
  });

  test('should reset store by effect', () => {
    const fx = createEffect(() => {});
    const setSourceValue = createEvent<number>();
    const $source = restore(setSourceValue, 0);
    reset({ clock: fx, target: $source });

    setSourceValue(100);
    expect($source.getState()).toEqual(100);

    fx();
    expect($source.getState()).toEqual(0);
  });
});

describe('multiple targets', () => {
  test('should reset single store from single event', () => {
    const setValue = createEvent<number>();
    const $sourceA = restore(setValue, 0);
    const $sourceB = restore(setValue.map(String), '0');
    const clock = createEvent();
    reset({ clock, target: [$sourceA, $sourceB] });

    setValue(100);
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([100, '100']);

    clock();
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([0, '0']);
  });

  test('should reset store by store change', () => {
    const setSourceValue = createEvent<number>();
    const $sourceA = restore(setSourceValue, 0);
    const $sourceB = restore(setSourceValue.map(String), '0');
    const setClockValue = createEvent<number>();
    const $clock = restore(setClockValue, 0);
    reset({ clock: $clock, target: [$sourceA, $sourceB] });

    setSourceValue(100);
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([100, '100']);

    setClockValue(1);
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([0, '0']);
  });

  test('should reset store by effect', () => {
    const fx = createEffect(() => {});
    const setSourceValue = createEvent<number>();
    const $sourceA = restore(setSourceValue, 0);
    const $sourceB = restore(setSourceValue.map(String), '0');
    reset({ clock: fx, target: [$sourceA, $sourceB] });

    setSourceValue(100);
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([100, '100']);

    fx();
    expect([$sourceA.getState(), $sourceB.getState()]).toEqual([0, '0']);
  });
});
