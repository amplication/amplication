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
  <a href="https://discord.gg/Z2CG3rUFnu">
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

<div align="center">
 
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-50-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

  </div>
  
Amplication is an open‑source development tool. It helps professional Node.js developers develop quality Node.js applications without spending time on repetitive coding tasks.

Amplication auto-generates backend apps built with TypeScript and Node.js, and a client built with React

## [Getting Started](https://docs.amplication.com/docs/getting-started)

Try amplication immediately on [app.amplication.com](http://app.amplication.com/)
or [follow the instructions](#development) to run a local instance.

## Features

Build database applications with:

- Manage data models visually or through CLI
- Auto-generated human-editable source code
- Node.js server built with Nest.js and Passport
- REST API and GraphQL for CRUD with relations, sorting, filtering, pagination
- Custom code generated app
- Admin UI built with React-Admin
- Role-based access control
- Docker and docker-compose integration
- Automatic push of the generated code to your GitHub repo

See [Amplication website](http://amplication.com/) or [Amplication docs](http://docs.amplication.com/) for more details.

[Watch this video](https://youtu.be/tKGeLXoPr94) for a quick recap of everything you get with Amplication.

## Development

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, follow these steps:

Execute the following commands in the project root folder:
```
npm install
```
```
npm run setup:dev
```

This will install all the required dependencies, run the necessary scripts and init a Docker-based Postgres server.

You can also use a more manual step-by-step approach to set up Amplication in a local development environment. To do that, you should follow the instructions listed for "Amplication Server" and "Amplication Client" below.

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

<a href="https://discord.gg/Z2CG3rUFnu"><img src="https://amplication.com/assets/images/discord_banner_purple.svg" /></a>

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://amplication.com/"><img src="https://avatars.githubusercontent.com/u/43705455?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yuval Hazaz</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=yuval-hazaz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/belkind27"><img src="https://avatars.githubusercontent.com/u/71218434?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Roy Belkind</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=belkind27" title="Tests">⚠️</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Abelkind27" title="Bug reports">🐛</a> <a href="https://github.com/amplication/amplication/commits?author=belkind27" title="Code">💻</a></td>
    <td align="center"><a href="http://cegla.me"><img src="https://avatars.githubusercontent.com/u/62651890?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gal Cegla</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=GalCegla" title="Tests">⚠️</a> <a href="https://github.com/amplication/amplication/issues?q=author%3AGalCegla" title="Bug reports">🐛</a> <a href="https://github.com/amplication/amplication/commits?author=GalCegla" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alonram"><img src="https://avatars.githubusercontent.com/u/40050499?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alon Ram</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=alonram" title="Code">💻</a> <a href="https://github.com/amplication/amplication/commits?author=alonram" title="Tests">⚠️</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Aalonram" title="Bug reports">🐛</a> <a href="#content-alonram" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/meeroslava"><img src="https://avatars.githubusercontent.com/u/20791516?v=4?s=100" width="100px;" alt=""/><br /><sub><b>meeroslava</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=meeroslava" title="Code">💻</a> <a href="https://github.com/amplication/amplication/commits?author=meeroslava" title="Tests">⚠️</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Ameeroslava" title="Bug reports">🐛</a> <a href="#content-meeroslava" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/udanna"><img src="https://avatars.githubusercontent.com/u/8627181?v=4?s=100" width="100px;" alt=""/><br /><sub><b>danna</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=udanna" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/almogbhl"><img src="https://avatars.githubusercontent.com/u/32982671?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Almog Langleben</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=almogbhl" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/tupe12334"><img src="https://avatars.githubusercontent.com/u/61761153?v=4?s=100" width="100px;" alt=""/><br /><sub><b>tupe12334</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=tupe12334" title="Code">💻</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Atupe12334" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/gabrielmoncea"><img src="https://avatars.githubusercontent.com/u/39256258?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gabriel Moncea</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=gabrielmoncea" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/m3llo96"><img src="https://avatars.githubusercontent.com/u/66171850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>m3llo96</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=m3llo96" title="Documentation">📖</a></td>
    <td align="center"><a href="http://petarvujović"><img src="https://avatars.githubusercontent.com/u/36507050?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Petar Vujović</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=petarvujovic98" title="Code">💻</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Apetarvujovic98" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/yam-golombek"><img src="https://avatars.githubusercontent.com/u/71834570?v=4?s=100" width="100px;" alt=""/><br /><sub><b>yam-golombek</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=yam-golombek" title="Documentation">📖</a></td>
    <td align="center"><a href="http://aniddan.com"><img src="https://avatars.githubusercontent.com/u/12671072?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Iddan Aaronsohn</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=iddan" title="Code">💻</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Aiddan" title="Bug reports">🐛</a> <a href="#content-iddan" title="Content">🖋</a></td>
    <td align="center"><a href="http://Timdurward.github.io"><img src="https://avatars.githubusercontent.com/u/11514270?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Durward</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=TimDurward" title="Code">💻</a> <a href="#infra-TimDurward" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/amplication/amplication/commits?author=TimDurward" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/yonantan"><img src="https://avatars.githubusercontent.com/u/9935021?v=4?s=100" width="100px;" alt=""/><br /><sub><b>yonantan</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=yonantan" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hermanramaniuk"><img src="https://avatars.githubusercontent.com/u/82475478?v=4?s=100" width="100px;" alt=""/><br /><sub><b>hermanramaniuk</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=hermanramaniuk" title="Code">💻</a> <a href="https://github.com/amplication/amplication/commits?author=hermanramaniuk" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/profile/view?id=AAIAABLBfC4BE232yLpsGEF-dPR_QMXNvqrVucM&trk=nav_responsive_tab_profile_pic"><img src="https://avatars.githubusercontent.com/u/8780812?v=4?s=100" width="100px;" alt=""/><br /><sub><b>George Cameron</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=georgewritescode" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Leeyaacov"><img src="https://avatars.githubusercontent.com/u/65485193?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Leeyaacov</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=Leeyaacov" title="Documentation">📖</a> <a href="#design-Leeyaacov" title="Design">🎨</a> <a href="#content-Leeyaacov" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/noctifer20"><img src="https://avatars.githubusercontent.com/u/18212378?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mikayel Ohanjanyan </b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=noctifer20" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lalit8347"><img src="https://avatars.githubusercontent.com/u/74647848?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lalit C.</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=lalit8347" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dabelh"><img src="https://avatars.githubusercontent.com/u/67220861?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dabelh</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=dabelh" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/liyachun01"><img src="https://avatars.githubusercontent.com/u/7907204?v=4?s=100" width="100px;" alt=""/><br /><sub><b>liyachun</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=liyachun01" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/isabr85"><img src="https://avatars.githubusercontent.com/u/11903954?v=4?s=100" width="100px;" alt=""/><br /><sub><b>isabr85</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=isabr85" title="Documentation">📖</a></td>
    <td align="center"><a href="http://kapustakrzysztof.pl"><img src="https://avatars.githubusercontent.com/u/53126011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Krzysztof Kapusta</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=kpk-pl" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/erichodges"><img src="https://avatars.githubusercontent.com/u/14981329?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eric Hodges</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=erichodges" title="Documentation">📖</a></td>
    <td align="center"><a href="http://0xflotus.github.io"><img src="https://avatars.githubusercontent.com/u/26602940?v=4?s=100" width="100px;" alt=""/><br /><sub><b>0xflotus</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=0xflotus" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/MatanForU"><img src="https://avatars.githubusercontent.com/u/8940907?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MatanForU</b></sub></a><br /><a href="#design-MatanForU" title="Design">🎨</a></td>
    <td align="center"><a href="https://www.enotriacoe.com"><img src="https://avatars.githubusercontent.com/u/56024126?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Richard Weaver</b></sub></a><br /><a href="#ideas-richardweaver" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/NullF0rest"><img src="https://avatars.githubusercontent.com/u/40210694?v=4?s=100" width="100px;" alt=""/><br /><sub><b>NullF0rest</b></sub></a><br /><a href="#ideas-NullF0rest" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/sandbox-apps"><img src="https://avatars.githubusercontent.com/u/86398599?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sandbox-apps</b></sub></a><br /><a href="#ideas-sandbox-apps" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/vimota"><img src="https://avatars.githubusercontent.com/u/865701?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Victor Mota</b></sub></a><br /><a href="#example-vimota" title="Examples">💡</a> <a href="#ideas-vimota" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Kelz29"><img src="https://avatars.githubusercontent.com/u/25604678?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kelello</b></sub></a><br /><a href="#example-Kelz29" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/MatthiasWanner"><img src="https://avatars.githubusercontent.com/u/79398461?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MatthiasWanner</b></sub></a><br /><a href="#ideas-MatthiasWanner" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/regicsolutions"><img src="https://avatars.githubusercontent.com/u/6157895?v=4?s=100" width="100px;" alt=""/><br /><sub><b>regicsolutions</b></sub></a><br /><a href="#ideas-regicsolutions" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://sten.pw"><img src="https://avatars.githubusercontent.com/u/2134238?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sten Feldman</b></sub></a><br /><a href="#ideas-exsilium" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://knsblog.com"><img src="https://avatars.githubusercontent.com/u/51660321?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Thuc Pham</b></sub></a><br /><a href="#example-thucpn" title="Examples">💡</a></td>
    <td align="center"><a href="http://codylacey.com"><img src="https://avatars.githubusercontent.com/u/29167666?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cody Lacey</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=CodyLacey" title="Code">💻</a></td>
    <td align="center"><a href="http://amplication.com"><img src="https://avatars.githubusercontent.com/u/91742238?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matan Shidlov</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=mshidlov" title="Code">💻</a> <a href="#content-mshidlov" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/michizhou"><img src="https://avatars.githubusercontent.com/u/33012425?v=4?s=100" width="100px;" alt=""/><br /><sub><b>michizhou</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=michizhou" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/g-traub"><img src="https://avatars.githubusercontent.com/u/33841027?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guillaume Traub</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=g-traub" title="Code">💻</a></td>
    <td align="center"><a href="https://leetcode.com/purpl3/"><img src="https://avatars.githubusercontent.com/u/82395440?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Asian Cat</b></sub></a><br /><a href="#blog-AsianCat54x" title="Blogposts">📝</a></td>
    <td align="center"><a href="http://www.noyagasi.com"><img src="https://avatars.githubusercontent.com/u/25197581?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Noy Agasi</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=noyagasi" title="Code">💻</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Anoyagasi" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Rutam21"><img src="https://avatars.githubusercontent.com/u/47860497?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rutam Prita Mishra</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=Rutam21" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/alexbass86"><img src="https://avatars.githubusercontent.com/u/96179897?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Bass</b></sub></a><br /><a href="#design-alexbass86" title="Design">🎨</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Aalexbass86" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://linkedin.com/in/mike-nußbaumer"><img src="https://avatars.githubusercontent.com/u/43721860?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Nußbaumer</b></sub></a><br /><a href="#ideas-mikenussbaumer" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Amikenussbaumer" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/amitbarletz/"><img src="https://avatars.githubusercontent.com/u/39680385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Amit Barletz</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=abrl91" title="Code">💻</a> <a href="https://github.com/amplication/amplication/commits?author=abrl91" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.amplication.com "><img src="https://avatars.githubusercontent.com/u/96979533?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Moshe Forman</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=MoFoGo" title="Documentation">📖</a></td>
    <td align="center"><a href="https://m-agboola.web.app"><img src="https://avatars.githubusercontent.com/u/20028628?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mohammed Agboola®️</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=molaycule" title="Code">💻</a> <a href="https://github.com/amplication/amplication/issues?q=author%3Amolaycule" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/morhag90"><img src="https://avatars.githubusercontent.com/u/97830649?v=4?s=100" width="100px;" alt=""/><br /><sub><b>morhag90</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=morhag90" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/kwinyyyc"><img src="https://avatars.githubusercontent.com/u/8462684?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kwinten Li</b></sub></a><br /><a href="https://github.com/amplication/amplication/commits?author=kwinyyyc" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
