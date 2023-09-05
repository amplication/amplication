# Amplication Plugin Api

Amplication Plugin is the component that process the amplication plugin catalog and serve the amplication client with the required information about them.

## Setup

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, follow the [Getting Started With Local Development](/README.md#getting-started-with-local-development) section to do that in a few quick steps.

### How to run locally

In order run the plugin api locally and populate the plugin cache (stored in a SQL db), the following two commands need to be run

```sh
# To initialise the plugin api db
npx nx db:init amplication-plugin-api

# To serve the service
npx nx serve amplication-plugin-api

# To populate the plugin api db from the plugin catalog
npx nx refresh:plugins amplication-plugin-api
```

## Useful Targets

Targets can be run using Nx Workspaces. You can read more about targets in the [Nx Documentation](https://nx.dev/reference/project-configuration).

You can find a full list of targets in the [project.json](/Users/arielweinberger/Development/amplication/amplication/packages/amplication-plugin-api/project.json) file.

### `test`

Executes tests.

```
npx nx test amplication-plugin-api
```

### `lint`

Performs a linting check using ESLint.

```
npx nx lint amplication-plugin-api
```

### `build`

Builds the app for production. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
npx nx build amplication-plugin-api
```

### `serve`

Runs the app in development mode.

```
npx nx serve amplication-plugin-api
```

### `refresh:plugins`

Runs a curl GraphQL request targeting the running `amplication-plugin-api` service to trigger the collection and storage of new plugin from the plugin catalog and new plugin versions from npmjs. 

```
npx nx refresh:plugins amplication-plugin-api
```
