# Amplication Client

Amplication Client is the front end of the platform that provides the beautiful UI to build your next low-code application.
The client is built with React, Apollo client, Primer components, React Material Web Components, Formik, and many more.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

If you need help or have a question, go to our [Discord channel](https://discord.gg/Z2CG3rUFnu), we are here to help.

### Installation

:bulb: Before you begin, make sure you have all the below installed:

- [Node.js v14 or above](https://nodejs.org/en/download/)
- [npm v7 or above](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

#### One time server setup

Before starting the client you need to setup the server and database. You can follow the [instructions here](https://github.com/amplication/amplication/blob/master/packages/amplication-server/README.md#one-time-set-up).

After that you have to build dependencies of the client:

```
npm run build -- --scope @amplication/client --include-dependencies

```

## Available Scripts

In the project directory, after you setup the server and client dependencies, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
