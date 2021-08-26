const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser', // A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.
  parserOptions: {
    project: 'tsconfig.json', // This option allows you to provide a path to your project's tsconfig.json. This setting is required if you want to use rules which require type information. Relative paths are interpreted relative to the current working directory if tsconfigRootDir is not set.
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import' // linting of ES2015+ (ES6+) import/export syntax
  ],
  extends: [
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // https://github.com/import-js/eslint-plugin-import#installation
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
  rules: {
    // '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off', // Require explicit return types on functions and class methods
    '@typescript-eslint/no-explicit-any': 'off', // Disallow usage of the any type
    '@typescript-eslint/ban-ts-comment': 'off', // Bans @ts-<directive> comments from being used or requires descriptions after directive
    'import/no-cycle': 'error', // Forbid a module from importing a module with a dependency path back to itself
    // '@typescript-eslint/camelcase': 'off', // This rule has been deprecated in favour of the naming-convention rule.
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      { selector: 'enumMember', format: ['PascalCase'] },
      {
        selector: "interface", "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      }
    ], // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }], // Disallow unused variables
    '@typescript-eslint/no-floating-promises': 'error', // Requires Promise-like values to be handled appropriately
  },
};