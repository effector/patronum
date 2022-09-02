/* eslint-disable import/extensions */
const {
  createCommonJsIndex,
  createTypingsIndex,
  createFactoriesJson,
} = require('./libraries');

test('commonjs index with multiple words', () => {
  expect(createCommonJsIndex(['first', 'second-item', 'another-text-demo']))
    .toMatchInlineSnapshot(`
    "module.exports.anotherTextDemo = require('./another-text-demo/index.cjs').anotherTextDemo;
    module.exports.first = require('./first/index.cjs').first;
    module.exports.secondItem = require('./second-item/index.cjs').secondItem;
    "
  `);
});

test('typings index with multiple words', () => {
  expect(createTypingsIndex(['first', 'second-item', 'another-text-demo']))
    .toMatchInlineSnapshot(`
    "export { anotherTextDemo } from './another-text-demo';
    export { first } from './first';
    export { secondItem } from './second-item';
    "
  `);
});

test('factories json with multiple words', () => {
  expect(
    createFactoriesJson('patronum', ['first', 'second-item', 'another-text-demo']),
  ).toMatchInlineSnapshot(`
    {
      "factories": [
        "patronum",
        "patronum/another-text-demo",
        "patronum/first",
        "patronum/second-item",
      ],
      "mapping": {
        "anotherTextDemo": "another-text-demo",
        "first": "first",
        "secondItem": "second-item",
      },
    }
  `);
});

test('factories json with scoped name', () => {
  expect(
    createFactoriesJson('@effector/patronum', [
      'first',
      'second-item',
      'another-text-demo',
    ]),
  ).toMatchInlineSnapshot(`
    {
      "factories": [
        "@effector/patronum",
        "@effector/patronum/another-text-demo",
        "@effector/patronum/first",
        "@effector/patronum/second-item",
      ],
      "mapping": {
        "anotherTextDemo": "another-text-demo",
        "first": "first",
        "secondItem": "second-item",
      },
    }
  `);
});
