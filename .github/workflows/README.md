# GitHub Actions

## Continuous Integration

The `continuous integration` workflow is responsible for linting, testing, building and evaluating projects that are affected by a change, and in some cases deploying them to an environment.

It is triggered in the following way:

1. on push to `master` and `next` (no need to keep a pull request `next->master` open).
2. on commits on a branch with an open PR.
3. manually (it supports Nx all, to force ci steps for all projects, and Nx skip cache options).

### Release

On a successfully completed `continuous integration` step for `master` and `next` branches the `release` step will ship the built affected application to the environments, leveraging `release.template.yml`.

The `release.template.yml` is in charge of building and pushing new docker images and deploying in the new clusters by leveraging the new `deployment.template.yml` and it is executed only on a successfully completed `continuous integration` step for `master` and `next` branches.

> In order to package a project as a container, the project needs to have `package:container` nx target defined in its `project.json`

> In order to package a project as a static website and push to s3, the project needs to have `deploy:static` nx target defined in its `project.json`

> In order to deploy a project as a container, the project needs to have `deploy:container` nx target defined in its `project.json`

Example
```json
{
"$schema": "../../../node_modules/nx/schemas/project-schema.json",
// ...
"targets": {
// ...
"package:container": {
    "executor": "@nx-tools/nx-package:container",
    "options": {
    "push": false,
    "tags": ["amplication/git-pull-service"]
    }
},
"deploy:container": { "executor": "nx:run-commands" }
// ...
}
```

> ⚠️ Pull requests containing changes to any workflow template needs to target `master` to become effective since the any workflow using of these template will reference the latest `master` version of them 

## Development

To be able to locally develop a workflow the following tools are required: [docker](https://docs.docker.com/get-docker/) and [act](https://github.com/nektos/act#installation). In our setup we use templates workflows in combination with the `workflow_call` option, this is however not supported by `act` at the moment of writing.

### Example commands

```
# Command structure:
act [<event>] [options]

# List all actions for all events:
act -l

# Run the default (`push`) event:
act

# Run a specific event:
act pull_request

# Run a specific job:
act -j test

# Run a job in a specific workflow (useful if you have duplicate job names)
act -j lint -W .github/workflows/checks.yml
```
