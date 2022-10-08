<p align="center">
<img width="300" src="https://raw.githubusercontent.com/amplication/amplication/master/light.svg#gh-light-mode-only">
<img width="300" src="https://raw.githubusercontent.com/amplication/amplication/master/dark.svg#gh-dark-mode-only">
</p>

<p align="center">
  <img src="https://github.com/amplication/amplication/workflows/Node.js%20CI/badge.svg" alt="Node.js CI">
  <a href="https://amplication.com/discord">
    <img src="https://img.shields.io/discord/757179260417867879?label=discord" alt="Discord">
  </a>
  <a href="CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/amplication/amplication?color=purple"/>
</p>

<div align="center">
 
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-80-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

  </div>
 

![1  Amplication main](https://user-images.githubusercontent.com/53312820/190913686-02c7deb1-da2f-41b8-aa31-065e00f6155c.png)

[Amplication](https://amplication.com/) is an open‑source development platform. It helps professional Node.js developers build quality Node.js applications without spending time on repetitive coding tasks.

Amplication auto-generates backend apps built with TypeScript and Node.js, and a client built with React.

# Features

Amplication provides the following features:

- Production-ready APIs
- Data Model
- Role Based Access Control
- Microservice Support
- Continuous GitHub Sync
- TypeScript and Node.js Source Code
- Plugin System
- Monorepo or Polyrepo
- Custom Code
- Ready-to-deploy-app
- Admin UI
- Amplication console & CLI

# Getting Started

You can get started with Amplication immediately on the Amplication Cloud. 

Alternatively you can set up a local development environment.



See [Amplication website](http://amplication.com/) or [Amplication docs](http://docs.amplication.com/) for more details.

## Tutorials 

- Todo Application using Amplication and Angular. [Click here to access](https://docs.amplication.com/docs/tutorials/angular-todos/)
- Todo Application using Amplication and React. [Click here to access](https://docs.amplication.com/docs/tutorials/react-todos/)

## Amplication Cloud (SaaS)

Launch Amplication from [app.amplication.com](http://app.amplication.com/)

## Development Environment (Local)

### System Requirements

:bulb: Before you begin, make sure you have all the below installed:

- [Node.js v16 or above](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)


### Initializing all the packages

Amplication is using a monorepo with multiple packages. To initialize all the packages on a local development environment, including running a docker image for the DB and seeding the DB.

1. Execute the following commands in the project root folder:

```jsx
npm install
npm run setup:dev
```
This will install all the required dependencies, run the necessary scripts and init a Docker-based Postgres server.

2. Go to `.../packages/amplication-server` and execute the following command:

```jsx
npm run start
```

3. Go to `.../packages/amplication-client` and execute the following command:

```jsx
npm run start
```




### Setting Up Amplication Manually

You can use a manual step-by-step approach to set up Amplication in a local development environment. To do that, you should follow the following instructions for **Setting Up Amplication Server**, and **Setting Up Amplication Client**.

#### Setting up [Amplication Server](https://github.com/amplication/amplication/blob/master/packages/amplication-server/README.md)

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open-source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

#### Setting Up [Amplication Client](https://github.com/amplication/amplication/blob/master/packages/amplication-client/README.md)

Amplication Client is the front end of the platform that provides you with an easy-to-drive UI for building your next low-code application.
The client is based on React, Apollo client, Primer components, React Material Web Components, Formik, and more.

# Version 1

Amplication is currently in its version 1.  This is the first major release of Amplication with enterprise-grade production readiness & scale. In this version, we have introduced multiple new features and enhanced the existing ones. The feature set is listed above in the [Features](#features) section.

## Support

Ask your questions and participate in discussions on Amplication-related and web-dev topics at Amplication Discord channel. 

<a href="https://discord.gg/Z2CG3rUFnu"><img src="https://amplication.com/images/discord_banner_purple.svg" /></a>

## Create a bug report

If you see an error message or run into an issue, please [create bug report](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A+bug&template=bug.yaml&title=%F0%9F%90%9B+Bug+Report%3A+). This effort is valued and it will help all Amplication users.


## Submit a feature request

If you have an idea, or you're missing a capability that would make development easier and more robust, please [Submit feature request](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A+feature+request&template=feature.yml).

If a similar feature request already exists, don't forget to leave a "+1".
If you add some more information such as your thoughts and vision about the feature, your comments will be embraced warmly :)


# Contributing

Amplication is an open-source project. We are committed to a fully transparent development process and appreciate highly any contributions. Whether you are helping us fix bugs, proposing new features, improving our documentation or spreading the word - we would love to have you as part of the Amplication community.

# Useful Links

- [Docs](https://docs.amplication.com/docs/)
- [Blog](https://amplication.com/blog)
- [Twitter](https://twitter.com/amplication)
- [Discord](https://amplication.com/discord)
- [Youtube](https://www.youtube.com/c/Amplicationcom)

Please refer to our [Contribution Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

# Contributors ✨

Thanks goes to these wonderful people ([:hugs:](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<a href="https://github.com/amplication/amplication/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=amplication/amplication" />
</a>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
