# Amplication Client

Amplication Client is the front end of the platform that provides the beautiful UI to build your next low-code application.
The client is built with React, Apollo client, Primer components, React Material Web Components, Formik, and many more.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

If you need help or have a question, go to our [Discord channel](https://amplication.com/discord), we are here to help.

## Setup

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, follow the [Getting Started With Local Development](/README.md#getting-started-with-local-development) section to do that in a few quick steps.

## Useful Targets

Targets can be run using Nx Workspaces. You can read more about targets in the [Nx Documentation](https://nx.dev/reference/project-configuration).

You can find a full list of targets in the [project.json](/Users/arielweinberger/Development/amplication/amplication/packages/amplication-client/project.json) file.

### `serve`

Runs the app in development mode.

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

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

Builds the app. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
npx nx build amplication-client 
```

To build the app for production pass the optional `--production` paramater

```
npx nx build amplication-client --production
```

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).