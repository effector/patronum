/** @type {import("prettier").Config} */
export default {
  arrowParens: 'always',
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
