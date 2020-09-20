<p align="center">
  <a href="https://amplicaiton.com" target="_blank">
    <img width="172" height="35" src="https://amplication.com/assets/amplication-logo.svg" alt="amplication  Logo"></a>
</p>

 <p align="center"><b>Developer Oriented, open Source, low-code Platform. <br/>
 Design and deploy your own data services application. Easily create APIs and connect from any server, mobile, or web client instantly.</b></p>

![Node.js CI](https://github.com/amplication/amplication/workflows/Node.js%20CI/badge.svg)
[![Discord](https://img.shields.io/discord/757179260417867879?label=discord)](https://discord.gg/b8MrjU6)

## Description

Amplication is a low-code framework for building efficient, scalable business applications.
Our vision is to create a low-code platform which will empower professional developers creating business applications, and expend platform capabilities with the power of the open-source community, collaboration & transparency.

[https://amplication.com](https://amplication.com)
<p align="center">
<img src="https://amplication.com/assets/images/home-page.svg" height="400"/>
</p>

## [Amplication Server](./packages/amplication-server/README.md)

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

## [Amplication Client](./packages/amplication-client/README.md)

Amplication Client is the front end of the platform that provides the beautiful UI to build your next low-code application.
The client is built with React, Apollo client, Primer components, React Material Web Components, Formik, and many more.

## [Amplication Data Service Generator](./packages/amplication-data-service-generator/README.md)

Amplication Data Service Generator is the component that generates the server-side code (models, Prisma client, REST API, authentication, and authorization filters) of the application built with amplication.

## GitHub Actions

### Development

- [Get Docker](https://docs.docker.com/get-docker/)
- [Install `act`](https://github.com/nektos/act#installation)

- Run act:

  ```
  act
  ```
