import { $pending } from './demo';

test('should have sid', () => {
  expect($pending.sid).toBeDefined();
  expect($pending.sid).not.toBeNull();
  expect($pending.sid).toMatchInlineSnapshot(`"-y29r2v|a4upb3"`);
});
