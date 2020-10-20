<p align="center">
  <a href="https://amplication.com" target="_blank">
    <img width="516" height="105" src="https://amplication.com/assets/amplication-logo.svg" alt="amplication  Logo"></a>
</p>

 <p align="center"><b>Developer Oriented, open Source, low-code Platform. <br/>
 Design and deploy your own data services application. Easily create APIs and connect from any server, mobile, or web client instantly.</b></p>

![Node.js CI](https://github.com/amplication/amplication/workflows/Node.js%20CI/badge.svg)
[![Discord](https://img.shields.io/discord/757179260417867879?label=discord)](https://discord.gg/b8MrjU6)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/amplication/amplication?color=purple">

# About amplication project

Amplication is an open source low-code framework designed for professional developers in mind. The platform will empower professional developers in creating efficient, scalable business applications by allowing the developer to custom code every part of the application. Each app developed on Amplication platform can either be deployed on our cloud or can be download. There are two forms of download, one way is as a complete nodejs readable source code, and the second way as a Docker container which can be deployed anywhere else. The derived application has no license which means that you can custom code it yourself and even sell it as closed source if you'd like, you are the owner of the derived app. The platform itself is open source under the Apache 2.0 license which gives freedom as well to customize and run it anywhere else.

The project is only few months old but we were able to go a long way. We just released our very first alpha stable version which include the following:

<ul>
  <li>Easily create data models, and configure role-based access control</li>
  <li>Instantly get a Docker container with your database and node.js application, or download the source code</li>
  <li>Continuously deploy your application to the cloud or your local environment</li>
</ul>

Low code is growing rapidly but still at the beginning. We see a lot of vendors taking it to different directions which we do not agree with. We would like to see how we can empower professional developers and see them use our platform to elevate their skills and not the other way around.

We would like to see the community take active role and be part of our vision and development of the first truly low code open source project. With the wisdom of the crowd, we can all take part and define the future of low code development. We know we won't be able to complete it all ourselves therefore we need your feedback and contribution.

[https://amplication.com](https://amplication.com)

<p align="center">
<img src="https://amplication.com/assets/images/home-page.svg" height="400"/>
</p>

### [Getting started guide](https://docs.amplication.com/guides/getting-started/first-app)

Amplication Low-code platform users can use step by step detailed guide on how to get started and build their first app using our platform. In this guide we show how to create an app, entities, roles, and permissions. The app can be deployed to our cloud or download as nodejs source code. Each app has version control where the user can roll back, deploy to the cloud or download source code per selected version. We even built in version file compare tool similar to GitHub PR.

# <img src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png" style="height:30px;padding-right:10px" /> Installation

### [Amplication Server](./packages/amplication-server/README.md)

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

### [Amplication Client](./packages/amplication-client/README.md)

Amplication Client is the front end of the platform that provides the beautiful UI to build your next low-code application.
The client is built with React, Apollo client, Primer components, React Material Web Components, Formik, and many more.

### [Amplication Data Service Generator](./packages/amplication-data-service-generator/README.md)

Amplication Data Service Generator is the component that generates the server-side code (models, Prisma client, REST API, authentication, and authorization filters) of the application built with amplication.

# <img src="https://github.githubassets.com/images/icons/emoji/unicode/1f4eb.png" style="height:30px;padding-right:10px" /> Support

### Ask a question about Amplication

You can ask questions, and participae in discussions about Amplication-related topics in the `amplication` discord channel.

[**Join our discord server**](https://discord.gg/b8MrjU6)

### Create a bug report

If you see an error message or run into an issue, please make sure to create a bug report!

[**Create bug report**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=)

### Submit a feature request

If you have an idea, or missing a feature, please submit a feature request.<br/>
In case a similar feature request already exists, please make sure to leave a +1 and ideally add a comment with your thoughts and ideas about the feature.

[**Submit feature request**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title=)

## <img src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png" style="height:30px;padding-right:10px" /> Contributing

Amplication low code is a community-driven open source project. We are committed to a fully transparent development process and highly appreciate any contributions. Whether you are helping us fixing bugs, proposing new feature, improving our documentation or spreading the word - we would love to have you as part of the Amplication community.

Please refer to our [contribution guidelines](./CONTRIBUTING.md) and [Code of Conduct](./code_of_conduct.md).

## <img src="https://github.githubassets.com/images/icons/emoji/unicode/26a0.png" style="height:30px;padding-right:10px" /> Alpha version

Please note that amplication is currently in alpha version, any app data hosted on our cloud can get reset at anytime. To use in production, download the app as Docker container and deploy on your own cloud service.
