# Amplication Data Service Generator

DSG (Data Service Generator) is the component responsible for the generation of source code by Amplication, and allows the integration of plugins into the code generation process.

## Run Data Service Generator locally

After creating new plugin on your local environment and build it locally, you can test it or continue developing it following this few steps:

* run ```npx nx generate-example-input-json data-service-generator``` . This command will create an input-example-json file under .amplication/generated-local-code/input.json
* add to this file under `pluginInstallations` key the details of you local plugin:
  ```
  {
    "id": "clb3p3ov800cplc01a8f6uwje", // uuid
    "npm":"@amplication/my-plugin", // name of npm package
    "enabled": true,
    "version": "0.0.1", // the current version on your package.json
    "pluginId": "my-plugin", // plugin id
    "settings": { "local": true, "destPath": "plugins/plugins/<plugin-name>" } => important !!! local key to true and the path of our dest plugin folder related to amplication folder.
  }
  ```
now your plugin should be part of the generated code flow.

If you want to check the generated code you should run:
`npx nx generate-local-code data-service-generator`
This command will generate the code under .amplication/generate-local-code/generated

If you want to debug the code you should run in debug mode: 
`npm run debug:dsg`
in order to debug your local plugin you should add `debugger` in your code and it will stop the process there. now you can go inside/out your plugin functions. you can also add breakpoints at our code and check it there.


## Testing

### Run data-service-generator based on test data

Generate an application according to the test data definitions. Once generated you can install its dependencies and start it with npm and spin a database with Docker.

```sh
# Generate an example input used by data-service-generator during the generation process
npx nx generate-example-input-json data-service-generator

# Trigger the code generation process based on the example input
npx nx generate-local-code data-service-generator
```

### E2E test data service application creation

The test will generate code according to the test data definitions, run a Docker container with it, run a database docker container, and try to call the API endpoints. Make sure to build the library before executing it.

```
npx nx e2e data-service-generator
```
