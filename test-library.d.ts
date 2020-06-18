import { Unit } from 'effector';

export function waitFor<T>(unit: Unit<T>): Promise<T>;

type Mock = ReturnType<typeof jest.fn>;

export function argumentHistory(ƒ: Mock): Array<string>;

export function wait(ms: number): Promise<void>;
