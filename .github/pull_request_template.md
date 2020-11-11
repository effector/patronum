### Description

<!-- Why we should add this method? -->

### Checklist for a new method

- [ ] Create directory for new method in root in `param-case`
- [ ] Place code to `{method-name}/index.js` in CommonJS export in `camelCase` named export
- [ ] Add types to `{method-name}/index.d.ts`
- [ ] Add tests to `{method-name}/{method-name}.test.ts`
- [ ] Add **fork** tests to `{method-name}/{method-name}.fork.test.ts`
- [ ] Add **type** tests to `test-typings/{method-name}.ts`
  - Use `// @ts-expect-error` to mark expected type error
  - `import { expectType } from 'tsd'` to check expected return type
- [ ] Add documentation in `{method-name}/reade.md`
  - Add header `Patronum/MethodName`
  - Add section with overloads, if have
  - Add `Motivation`, `Formulae`, `Arguments` and `Return` sections for each overload
  - Add useful examples in `Example` section for each overload
- [ ] Add section to `README.md` in root
  - Add method to table of contents `- [MethodName](#methodname)`
  - Add section `## [MethodName](/method-name 'Documentation')`
  - With summary and simple example
