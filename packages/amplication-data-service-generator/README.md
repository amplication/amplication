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

### Testing

#### Run unit and snapshot tests

To run the unit and snapshot tests of the generator execute:

```
npm test
```

To view more options for running tests execute:

```
npm test -- --help
```

#### Generate test data service application

Generate an application according to the test data definitions. Once generated you can install its dependencies and start it with npm and spin a database with Docker.

```
npm run generate-test-data-service
```

#### E2E test data service application creation

The test will generate code according to the test data definitions, run a Docker container with it, run a database docker container, and try to call the API endpoints. Make sure to build the library before executing it.

```
npm run test:e2e
```

### Generated Application Dependency Management

#### Add a dependency

- Change directory to `static`
- Execute:
  ```
  npm install --package-lock-only $DEPENDENCY
  ```
