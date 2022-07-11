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

## Logger and CRA support with [macros](https://github.com/kentcdodds/babel-plugin-macros)

[`babel-plugin-macros`](https://github.com/kentcdodds/babel-plugin-macros) is bundled into CRA, so we can use it due CRA don't support adding babel plugins into `.babelrc` or `babel.config.js`.

Just import from `patronum/macro` and `effector-logger/macro`, and use as early:

```ts
import { createStore, createEffect, sample } from 'effector-logger/macro';
import { status, splitMap, combineEvents } from 'patronum/macro';
```

> - Warning: babel-plugin-macros do not support `import * as name`!
> - Note: Since release of patronum v2.0.0 it is required to use babel-plugin-macros v3.0.0 or higher.
> - Please note, that react-scripts v4.0.3 and older **uses outdated version** of this plugin - you can either use [yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) or use react-scripts v5.0.0 or higher.
