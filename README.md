<p align="center">
  <a href="https://amplication.com" target="_blank">
    <img width="344" height="70" src="https://amplication.com/assets/amplication-logo.svg" alt="amplication  Logo"></a>
</p>

 <p align="center"><b>Developer Oriented, open Source, low-code Platform. <br/>
 Design and deploy your own data services application. Easily create APIs and connect from any server, mobile, or web client instantly.</b></p>

![Node.js CI](https://github.com/amplication/amplication/workflows/Node.js%20CI/badge.svg)
[![Discord](https://img.shields.io/discord/757179260417867879?label=discord)](https://discord.gg/b8MrjU6)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/amplication/amplication?color=purple">

# About the Amplication project

Amplication is an open-source low-code framework designed for professional developers. The platform empowers developers by enabling them to create efficient, scalable business applications without losing the ability to custom code any part of the application. Each app developed on the Amplication platform can either be deployed on our cloud, or can be downloaded and deployed elsewhere. There are two download options: one is as complete Node.js readable source code, and the other is as a Docker container that can be deployed anywhere. The derived application has no license, which means that you can customize it and if you want sell it as closed source, since you are the owner of the derived app. The platform itself is open source under the Apache 2.0 license, which again, gives you the freedom to customize and run it anywhere else.

The project is quite fresh and we've just released our first alpha stable version, which includes the following functional features:

<ul>
  <li>Create data models, and configure role-based access control</li>
  <li>Get a Docker container with your database and Node.js application, or download the source code</li>
  <li>Continuously deploy your application to the cloud or your local environment</li>
</ul>

Low code is growing rapidly, but is still at the beginning. We see vendors that are steering it to proprietary directions, which we are not happy with. We'd like to empower professional developers and see them use our platform to elevate their skills and not the other way around.

We'll be thrilled to see the community take an active role and be part of our vision of developing the first truly low code open source project. Harnessing collective wisdom, we can all take part and define the future of low code development.

[https://amplication.com](https://amplication.com)

<p align="center">
<img src="https://amplication.com/assets/images/amplication build mockup.png" height="400"/>
</p>

### [Getting started guide](https://docs.amplication.com/guides/getting-started/first-app)

In this guide we show how to create an app, entities, roles, and permissions. The app can be deployed to our cloud or downloaded as Node.js source code. Each app includes version control, so you can roll back, deploy to the cloud, or download source code per the selected target version. We even included a built-in compare tool similar to GitHub PR.

If you have any question in any step along the way, don't hesitate to contact us at our [Discord channel](https://discord.gg/b8MrjU6), We are always happy to help.

# Installation

## Main packages

Amplication is constructed of multiple packages. To start working on Amplication follow the installation instructions on "Amplication Server" and "Amplication Client".

### [Amplication Server](./packages/amplication-server/README.md)

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

### [Amplication Client](./packages/amplication-client/README.md)

Amplication Client is the front end of the platform that provides you with an easy to drive UI for building your next low-code application.
The client is based on React, Apollo client, Primer components, React Material Web Components, Formik, and more.

## Other packages

### [Amplication Data Service Generator](./packages/amplication-data-service-generator/README.md)

Amplication Data Service Generator is the component that generates the server-side code (models, Prisma client, REST API, authentication, and authorization filters) of the application built with Amplication. This package is used internally by Amplication server.

To use this package as a library or as a CLI with other projects, follow the instructions on the package page.

## Alpha version

Please note that Amplication is currently in alpha version. <b>This means that any app data hosted on our cloud can get reset at any time.</b> At this point if you want tTo use your app in a production environment, you'll need to download the app as a Docker container and deploy on your own cloud service.

# Support

### Ask a question about Amplication

You can ask questions, and participate in discussions about Amplication-related topics in the `Amplication` discord channel.

<a href="https://discord.gg/b8MrjU6"><img src="https://amplication.com/assets/images/discord_banner.png" /></a>

### Create a bug report

If you see an error message or run into an issue, please create a bug report, it's really important for making this platform the best it can be!

[**Create bug report**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=)

### Submit a feature request

If you have an idea, or you're missing a capability that would make development easier and more robust, please submit a feature request.<br/>
In case a similar feature request already exists, don't forget to leave a "+1". Adding some more info such as thoughts and your vision about the feature will be embraced warmly :)

[**Submit feature request**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title=)

# Contributing

Amplication is an open source project. We are committed to a fully transparent development process and highly appreciate any contributions. Whether you are helping us fixing bugs, proposing new feature, improving our documentation or spreading the word - we would love to have you as part of the Amplication community.

Please refer to our [contribution guidelines](./CONTRIBUTING.md) and [Code of Conduct](./code_of_conduct.md).
