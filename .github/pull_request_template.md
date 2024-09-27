### Description

<!-- Why we should add this method? -->

### Checklist for a new method

- [ ] Create a directory for the new method in the `src` directory in `param-case`
- [ ] Place the source code to `src/method-name/index.ts` in ESModules export in `camelCase` **named** export
- [ ] Add tests to `src/method-name/method-name.test.ts`
- [ ] Add **fork** tests to `src/method-name/method-name.fork.test.ts`
- [ ] Add **type** tests to `test-typings/method-name.ts`
  - Use `// @ts-expect-error` to mark expected type error
  - `import { expectType } from 'tsd'` to check expected return type
- [ ] Add documentation in `src/method-name/readme.md`
  - Add header `Patronum/MethodName`
  - Add section with overloads, if have
  - Add `Motivation`, `Formulae`, `Arguments` and `Return` sections for each overload
  - Add useful examples in `Example` section for each overload
- [ ] Fill frontmatter in `src/method-name/readme.md`
  - Add `title`. Make sure it uses camelCase syntax just like the method itself
  - Add `slug`. Use param-case to write it. In most cases it will be just like `title`
  - Add `desription` with one short sentence describing what method useful for
  - Add `group`. To categorize method on `/operators` page. Full list of available groups, you can see in [documentation/src/content/config.ts](../documentation/src/content/config.ts)
