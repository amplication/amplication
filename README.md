<p align="center">
  <a href="https://amplication.com" target="_blank">
    <img alt="amplication-logo" height="70" alt="Amplication Logo" src="https://amplication.com/assets/amplication-logo-purple.svg"/>
  </a>
</p>
<p align="center">
    <a href="https://docs.amplication.com/docs/">Docs</a> <a href="https://twitter.com/amplication">Twitter</a>
</p>
<p align="center">
  <img src="https://github.com/amplication/amplication/workflows/Node.js%20CI/badge.svg" alt="Node.js CI">
  <a href="https://discord.gg/KSJCZ24vj2">
    <img src="https://img.shields.io/discord/757179260417867879?label=discord" alt="Discord">
  </a>
  <a href="code_of_conduct.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/amplication/amplication?color=purple">
</p>

Amplication is an open‑source development tool. It helps professional Node.js developers develop quality Node.js applications without spending time on repetitive coding tasks.

Amplication auto-generates backend apps built with TypeScript and Node.js, and a client built with React

## [Getting Started](https://docs.amplication.com/docs/getting-started)

Try amplication immediately on [app.amplication.com](http://app.amplication.com/)
or [follow the instructions](#development) to run a local instance.

## Features

Build business applications with:

- Manage data models visually or through CLI
- Auto-generated human-editable source code
- Node.js server built with Nest.js and Passport with REST API and GraphQL
- Custom code generated app
- Admin UI built with React
- Role-based access control
- Docker and docker-compose integration
- Automatic push of the generated code to your GitHub repo

See [Amplication website](http://amplication.com/) or [Amplication docs](http://docs.amplication.com/) for more details.

[Watch this video](https://youtu.be/tKGeLXoPr94) for a quick recap of everything you get with Amplication.

## Development

Amplication is constructed of multiple packages. To start working on Amplication follow the "Amplication Server" and "Amplication Client" installation instructions.

### [Amplication Server](./packages/amplication-server/README.md)

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open-source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

### [Amplication Client](./packages/amplication-client/README.md)

Amplication Client is the front end of the platform that provides you with an easy to drive UI for building your next low-code application.
The client is based on React, Apollo client, Primer components, React Material Web Components, Formik, and more.

### [Amplication CLI](./packages/amplication-cli/README.md)

Define your data model and generate apps faster using Amplication Command Line Interface (CLI). Execute pre-defined scripts to create your app instantly.

## Other packages

### [Amplication Data Service Generator](./packages/amplication-data-service-generator/README.md)

Amplication Data Service Generator is the component that generates the code of apps built with Amplication. It generates the models, Prisma client, REST API, GraphQL, authentication and authorization filters, and more. This package is used internally by Amplication server.

To use this package as a library or as a CLI with other projects, follow the instructions on the package page.

## Beta version

Amplication is currently in Beta version. It means that we are still working on essential features like production-ready hosting, migrations, and stability to our console.

How does it affect you? Well...., it mostly doesn't.<br />
Every app generated using Amplication platform contains popular, documented, secured, and supported production-ready open source components & packages. Your app is stable, scalable, and production-ready you can deploy and rely on. You can read more about the generated app and its stack here https://docs.amplication.com/docs/getting-started

# Support

### Ask a question about Amplication

You can ask questions, and participate in discussions about Amplication-related topics in the `Amplication` Discord channel.

<a href="https://discord.gg/KSJCZ24vj2"><img src="https://amplication.com/assets/images/discord_banner_purple.svg" /></a>

### Create a bug report

If you see an error message or run into an issue, please create a bug report, this effort is valued and it will help all.

[**Create bug report**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=)

### Submit a feature request

If you have an idea, or you're missing a capability that would make development easier and more robust, please submit a feature request.<br/>
In case a similar feature request already exists, don't forget to leave a "+1". Adding some more information such as thoughts and your vision about the feature will be embraced warmly :)

[**Submit feature request**](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title=)

# Contributing

Amplication is an open source project. We are committed to a fully transparent development process and highly appreciate any contributions. Whether you are helping us fix bugs, proposing new features, improving our documentation or spreading the word - we would love to have you as part of the Amplication community.

Please refer to our [contribution guidelines](./CONTRIBUTING.md) and [Code of Conduct](./code_of_conduct.md).
