# GitHub Actions

## Continuous Integration

The `continuous integration` workflow is responsible for linting, testing, building and evaluating the projects that are affected by a change.

It is triggered in the following way:

1. on push to `master` and `next` (no need to keep a pull request `next->master` open)
2. on commits on a branch with an open PR
3. manually (it supports Nx all, to force ci steps for all projects, and Nx skip cache options now)

## Release

The `release` workflow is in charge of building and pushing new docker images and forcing the deployment in the new clusters by leveraging the new deployment.template.yml

It is triggered in the following way:

1. on a successfully completed Continuous Integration workflow for master and next branches

## Development

To be able to locally develop a workflow the following tools are required: [docker](https://docs.docker.com/get-docker/) and [act](https://github.com/nektos/act#installation). In our setup we use templates in combination with the `workflow_call` option, this can however not supported by `act` at the moment of writing.

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
