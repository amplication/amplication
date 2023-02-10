# Amplication Data Service Generator

DSG (Data Service Generator) is the component responsible for the generation of source code by Amplication, and allows the integration of plugins into the code generation process.

## Testing

### Generate test data service application

Generate an application according to the test data definitions. Once generated you can install its dependencies and start it with npm and spin a database with Docker.

```
npx nx generate-local-code data-service-generator
```

### E2E test data service application creation

The test will generate code according to the test data definitions, run a Docker container with it, run a database docker container, and try to call the API endpoints. Make sure to build the library before executing it.

```
npx nx e2e data-service-generator
```
