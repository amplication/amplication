# util-code-gen-utils

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build util-code-gen-utils` to build the library.

## Running unit tests

Run `nx test util-code-gen-utils` to execute the unit tests via [Jest](https://jestjs.io).

## Publish to npm

In order to publish to npm `@amplication/code-gen-utils` run the following:

```sh
# From the monorepo root folder
npm i

npx nx build util-code-gen-utils

cd ./dist/libs/util/code-gen-utils

npm publish --access public ....
```