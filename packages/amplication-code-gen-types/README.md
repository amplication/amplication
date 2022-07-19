# Amplication Code gen types

Amplication Code gen types is the component that defines the shared data structures used by the amplication packages.

## Usage

### Get properties schema for entity field data type

```typescript
import { getSchemaForDataType } from "@amplication/code-gen-types";

getSchemaForDataType(EnumDataType.SingleLineText);
```

### Get type of data type properties

```typescript
import { types } from "@amplication/code-gen-types";

const lookupProperties: types.Lookup = {
  relatedEntityId: "exampleId",
  allowMultipleSelection: false,
};
```

## Technologies

- [TypeScript](https://www.typescriptlang.org/): the data code is strictly typed with TypeScript.
- [JSON Schema](https://json-schema.org/): the data schemas in the package are defined using JSON Schema.
- [Jest](https://jestjs.io/): is used for testing.

## Development

:bulb: Before you begin, make sure you have all the below installed:

- [Node.js v14 or above](https://nodejs.org/en/download/)
  ```
  node -v
  ```
  Should be: `v14.0.0` or newer
- [npm v7 or above](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/)
  ```
  npm -v
  ```
  Should be: `7.0.0` or newer
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)
  ```
  git version
  ```
  Should start with: `git version`

### One time set up

After cloning the repository open its root directory and run the following commands:

- Install dependencies of the monorepo (execute in root directory):
  ```
  npm install
  npm run bootstrap
  ```
- Build the Data package:
  ```
  npm run build -- --scope @amplication/code-gen-types
  ```

### Workflow

Make sure you are in the data directory (`packages/amplication-data`).
Once you are done making changes, run the following commands:

- Format files (editors like VSCode can do it for you automatically)
  ```
  npm run format
  ```
- Lint files (editors like VSCode come with integration to display those continuously)
  ```
  npm run lint
  ```
- Run unit tests

  ```
  npm test
  ```

- Rebuild the package
  ```
  npm run build
  ```
