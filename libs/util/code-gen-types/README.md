# amplication-code-gen-types

This library supplies all the contracts for Amplication Code Generation.
The purpose is to make the contracts available for inclusion in plugins.

## Running unit tests

Run `nx test amplication-code-gen-types` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint amplication-code-gen-types` to execute the lint via [ESLint](https://eslint.org/).

## Publish to npm

In order to publish to npm `@amplication/code-gen-types` run the following:

```sh
# From the monorepo root folder
npm i

npx nx build code-gen-types

cd ./dist/libs/util/code-gen-types

npm publish --access public ....
```
