import { allSettled, createEvent, createStore, fork } from 'effector';
import { not } from './index';

it('correctly updates when value changes', async () => {
  const changeToFalse = createEvent();
  const $exists = createStore(true).on(changeToFalse, () => false);
  const $absent = not($exists);

  const scope = fork();
  expect(scope.getState($absent)).toBe(false);

  await allSettled(changeToFalse, { scope });
  expect(scope.getState($absent)).toBe(true);
});
