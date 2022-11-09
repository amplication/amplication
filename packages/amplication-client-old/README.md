# Amplication Client

Amplication Client is the front end of the platform that provides a beautiful UI to build your application.
The client is built with React, Apollo Client, Primer components, React Material UI, Formik, and more.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Before starting the client, make sure you have the server up and running. Follow the [Getting Started With Local Development](/README.md#getting-started-with-local-development) section to do that in a few quick steps.

Next, you can start developing the client by running the following *in the repository's root directory*:

```
npx nx serve amplication-client
```

## Useful Targets

Targets can be run using Nx Workspaces. You can read more about targets in the [Nx Documentation](https://nx.dev/reference/project-configuration).

You can find a full list of targets in the [project.json](/Users/arielweinberger/Development/amplication/amplication/packages/amplication-client/project.json) file.

### `serve`

Runs the app in development mode.

```
npx nx serve amplication-client
```

### `test`

Executes tests.

```
npx nx test amplication-client
```

### `lint`

Performs a linting check using ESLint.

```
npx nx lint amplication-client
```

### `build`

Builds the app for production. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
npx nx build amplication-client
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).
