# Installation

```shell
yarn add patronum
# or
npm add patronum
# or
pnpm add patronum
```

## Usage

Just import method from the root module:

```js
import { throttle, splitMap } from 'patronum';
```

Or from the personal module:

```js
import { throttle } from 'patronum/throttle';
import { splitMap } from 'patronum/split-map';
```

> Except `patronum/debug`. It is only available by personal module import.

Be careful in the module naming:

- Method export always exports as named export in camelCase
- Module with the operator always named in param-case

## Tests and SSR support

At the moment patronum supports only Babel.

Just add `patronum/babel-preset` to your `.babelrc` or `babel.config.js` at the `"presets"` section:

```json
{
  "presets": ["patronum/babel-preset"]
}
```
