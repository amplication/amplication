# Amplication Data Service Generator

Amplication Data Service Generator is the component that generates the server-side code (models, Prisma client, REST API, authentication, and authorization filters) of the application built with Amplication.

Generate a REST API code using data and access control definitions.
The generator can be used as a library or as a CLI.

## Technologies

- [Node.js](https://nodejs.org/): the generated code is human-editable Node.js code.
- [TypeScript](https://www.typescriptlang.org/): the generator code and the generated code are both strictly typed TypeScript code.
- [Nest.js](https://nestjs.com/): is used for defining the API.
- [Express](https://expressjs.com/): is used as the base web framework for Nest.js.
- [Passport](http://www.passportjs.org/): is used for providing Basic authentication.
- [AccessControl](https://github.com/onury/accesscontrol): is used for providing ABAC and RBAC authorization.
- [PostgreSQL](https://www.postgresql.org/): is used for storing the application data.
- [Prisma](https://www.prisma.io/): is used to interact with Postgres and define data migrations.
- [Docker](https://www.docker.com/): the generated code includes a Dockerfile for building containers.
- [Morgan](https://github.com/expressjs/morgan): is used for logging calls to the API.
- [Recast](https://github.com/benjamn/recast): is used for generating the TypeScript code.
- [Jest](https://jestjs.io/): is used for testing the generator code and for testing in the generated code.

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
- [Docker](https://docs.docker.com/desktop/)
  ```
  docker -v
  ```
  Should start with: `Docker version`
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
- Build the Data Service Generator and its dependencies:
  ```
  npm run build -- --scope @amplication/data-service-generator --include-dependencies
  ```
- Open the data service generator directory
  ```
  cd packages/amplication-data-service-generator
  ```
- Generate the test data service app
  ```
  npm run generate-test-data-service
  ```

### Workflow

Make sure you are in the data service generator directory (`packages/amplication-data-service-generator`).
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
- (Optional) Rebuild the package
  ```
  npm run build
  ```

## Testing

### Generate test data service application

Generate an application according to the test data definitions. Once generated you can install its dependencies and start it with npm and spin a database with Docker.

```
npm run generate-test-data-service
```

### E2E test data service application creation

The test will generate code according to the test data definitions, run a Docker container with it, run a database docker container, and try to call the API endpoints. Make sure to build the library before executing it.

```
npm run test:e2e
```

## Generated Application Dependency Management

### Add a dependency to the server template

```
npx lerna add --scope server-template $NAME_OF_DEPENDENCY
```

### Add a dependency to the client template

```
npx lerna add --scope admin-template $NAME_OF_DEPENDENCY
```
