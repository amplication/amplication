<p align="right">
  <a href="https://amplication.com" target="_blank">
    <img alt="amplication-logo" height="70" alt="Amplication Logo" src="https://amplication.com/images/amplication-logo-purple.svg"/>
  </a>
</p>

# Introduction

This service was generated with Amplication. It serves as the client-side for the generated server component. The client-side consist of a React application with ready-made forms for creating and editing the different data models of the application. It is pre-conffigured to work with the server and comes with the boilerplate and foundation for the client - i.e., routing, navigation, authentication, premissions, menu, breadcrumbs, error handling and much more. Additional information about the admin component and the architecture around it, can be found on the [documentation](https://docs.amplication.com/guides/getting-started) site. This side of the generated project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) and built with [react-admin](https://marmelab.com/react-admin/).


<p align="center">
  <img src="https://d33wubrfki0l68.cloudfront.net/2615bedd21c48089ab38a099bad9638b28879511/091b4/assets/images/admin-ui-9b6590728393d532ad798e9dc14138ac.png" width="700px">
</p>

# Getting started

## Step 1: Configuration

Configuration for the client component can be provided through the use of environment variables. These can be passed to the application via the use of the `.env` file in the base directory of the generated service. Below a table can be found which show the different variables that can be passed. These values are provided default values after generation, change them to the desired values.

| Variable             | Description                                      | Value                           |
| -------------------- | ------------------------------------------------ |  ------------------------------ |
| PORT                 | the port on which to run the client              | 3001                            |
| REACT_APP_SERVER_URL | the url on which the server component is running | http://localhost:[server-port]  |

> **Note**
> Amplication generates default values and stores them under the .env file. It is advised to use some form of secrets manager/vault solution when using in production. 


## Step 2: Scripts

After configuration of the client the next step would be to run the application. Before running the client side of the component, make sure that the different pre-requisites are met - i.e., npm, docker. Make sure that the server-side of the application is running.

```sh
# installation of the dependencies
$ npm install

# starts the application in development mode - available by default under http://localhost:3001 
$ npm run start

# builds the application in production mode - available under 'build'
$ npm run build

# removes the single build dependency from the project
$ npm run eject
```