# <img src="logo.svg" title="effector patronum" alt="Effector Patronum logo" width="640px">

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) ![Node.js CI](https://github.com/effector/patronum/workflows/Node.js%20CI/badge.svg) [![Rate on Openbase](https://badges.openbase.com/js/rating/patronum.svg)](https://openbase.com/js/patronum?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)
[![LICENSE](https://badgen.net/github/license/effector/patronum?color=green)](/LICENSE)
[![Stars](https://badgen.net/github/stars/effector/patronum?color=green)](https://github.com/effector/patronum)
[![Downloads](https://badgen.net/npm/dt/patronum)](https://npmjs.com/package/patronum)

☄️ Effector operators library delivering modularity and convenience

- 🎲 Try it online: [StackBlitz][stackblitz] | [Codesandbox][codesandbox] | [Playground][try-patronum-share]
- 📚 Read documentation: [patronum.effector.dev][documentation]
- 📦 Source: [JSdeliver][jsdelivr] | [Unpkg][unpkg] | [NPM][npm] | [GitHub][github]
- 🦉 Say about it: [Twitter][twitter-share]

[stackblitz]: https://stackblitz.com/edit/effector-react
[codesandbox]: https://codesandbox.io/s/effector-patronum-playground-zuqjx
[try-patronum-share]: https://share.effector.dev/Neewtbz3
[jsdelivr]: https://www.jsdelivr.com/package/npm/patronum
[unpkg]: https://unpkg.com/browse/patronum@1.7.0/
[npm]: https://www.npmjs.com/package/patronum
[github]: https://github.com/effector/patronum
[twitter-share]: https://twitter.com/intent/tweet?text=I%20used%20patronum!%0AGoing%20to%20Mars%20with%20%40effectorjs%20-%20data-flow%20powered%20tool%20to%20implement%20business%20logic.%0A%0Ahttps%3A%2F%2Fgithub.com%2Feffector%2Fpatronum%0A
[documentation]: https://patronum.effector.dev

## 💿 Install now

> Please, review documentation for **YOUR** version of patronum not the latest. Find and [open tag/release](https://github.com/effector/patronum/releases) for your version and click on the tag [vA.B.C](https://github.com/effector/patronum/tree/v1.7.0) to view repo and documentation for that version, or use "Switch branches/tags" selector.

```bash
npm install patronum
# or
yarn add patronum
# or
pnpm add patronum
```

Next just import methods from `"patronum"` and use it:

```ts
import { createEffect } from 'effector';
import { status } from 'patronum';

const userLoadFx = createEffect();
const $status = status({ effect: userLoadFx });
```

You can read more at [documentation](https://patronum.effector.dev/docs/installation).

## Migration guide

Patronum had 3 breaking changes: 1) from `0.14` to `0.100`, 2) from `0.100` to `0.110`, 3) from `0.110` to `1.0`

We have [migration guide](https://patronum.effector.dev/docs/migration-guide).

# Development

You can review [CONTRIBUTING.md](./CONTRIBUTING.md)

## Release process

1. Check out the [draft release](https://github.com/effector/patronum/releases).
1. All PRs should have correct labels and useful titles. You can [review available labels here](https://github.com/effector/patronum/blob/master/.github/release-drafter.yml).
1. Update labels for PRs and titles, next [manually run the release drafter action](https://github.com/effector/patronum/actions/workflows/release-drafter.yml) to regenerate the draft release.
1. Review the new version and press "Publish"
1. If required check "Create discussion for this release"
