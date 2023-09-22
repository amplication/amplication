<h1 align="center">
    <a href="https://amplication.com/#gh-light-mode-only">
    <img src="./.github/assets/amplication-logo-light-mode.svg">
    </a>
    <a href="https://amplication.com/#gh-dark-mode-only">
    <img src="./.github/assets/amplication-logo-dark-mode.svg">
    </a>
</h1>

<p align="center">
  <i align="center">Instantly generate production-ready Node.js backend apps 🚀</i>
</p>

<h4 align="center">
  <a href="https://github.com/amplication/amplication/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/amplication/amplication/ci.yml?branch=master&label=pipeline&style=flat-square" alt="continuous integration">
  </a>
  <a href="https://github.com/amplication/amplication/graphs/contributors">
    <img src="https://img.shields.io/github/contributors-anon/amplication/amplication?color=yellow&style=flat-square" alt="contributers">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/apache%202.0-blue.svg?style=flat-square&label=license" alt="license">
  </a>
  <br>
  <a href="https://amplication.com/discord">
    <img src="https://img.shields.io/badge/discord-7289da.svg?style=flat-square" alt="discord">
  </a>
  <a href="https://twitter.com/amplication">
    <img src="https://img.shields.io/badge/twitter-18a1d6.svg?style=flat-square" alt="twitter">
  </a>
  <a href="https://www.youtube.com/c/Amplicationcom">
    <img src="https://img.shields.io/badge/youtube-d95652.svg?style=flat-square&" alt="youtube">
  </a>
</h4>

<p align="center">
    <img src="https://github.com/amplication/amplication/assets/73097785/c7ed2bbc-8954-46a1-a520-91a4711a9320.png" alt="dashboard"/>
</p>

## Introduction

`Amplication` is a robust, open-source development platform crafted to revolutionize the creation of scalable and secure Node.js applications. We eliminate repetitive coding tasks and deliver production-ready infrastructure code, meticulously tailored to your specifications and adhering to industry best practices.

Our user-friendly interface fosters seamless integration of APIs, data models, databases, authentication, and authorization. Built on a flexible, plugin-based architecture, Amplication allows effortless customization of the code and offers a diverse range of integrations.

With a strong focus on collaboration, Amplication streamlines team-oriented development, making it an ideal choice for groups of all sizes, from startups to large enterprises. Our platform enables you to concentrate on your business logic, while we handle the heavy lifting.

Experience the fastest way to develop Node.js applications with Amplication.

<details open>
<summary>
 Features
</summary> <br />

<p align="center">
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/9908a54a-7d49-4dbb-8f5e-3e99b7cadf30.png" alt="apis"/>
&nbsp;
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/ff406403-27f7-42b5-9569-d011432f16e5.png" alt="data-models"/>
</p>

<p align="center">
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/62c8d533-8475-4290-abc8-c433c095e68a.png" alt="plugins"/>
&nbsp;
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/9c67a354-a06f-47d1-a118-ab89b775bf91.png" alt="microservices"/>
</p> 
    
<p align="center">
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/a51e166b-07ec-4c80-99ed-8792a81c4064.png" alt="own-your-code"/>
&nbsp;
    <img width="49%" src="https://github.com/amplication/amplication/assets/73097785/1cca9721-b8d6-425b-a1a9-d10d3cdcc9b8.png" alt="customize-code"/>
</p>
    
</details>

## Usage 

To get started with Amplication, the hosted version of the product can be used. You can get started immediately at [app.amplication.com](https://app.amplication.com). After the login page you will be guided through creating your first service. The [website](https://amplication.com) provides an overview of the application, additional information on the product and guides can be found on the [docs](https://docs.amplication.com).

<details>
<summary>
  Tutorials
</summary> <br />

- [To-do application using Amplication and Angular](https://docs.amplication.com/tutorials/angular-todos)
- [To-do application using Amplication and React](https://docs.amplication.com/tutorials/react-todos)
</details>

## Development

Alternatively to using the hosted version of the product, Amplication can be ran local for code generation purposes or contributions - if so please refer to our [contributing](#contributing_anchor) section.

<details open>
<summary>
Pre-requisites
</summary> <br />
To be able to start development on amplication make sure that you have the following pre-requisites installed:

###

- Node.js
- Docker
- Git
</details>

<details open>
<summary>
Running Amplication
</summary> <br />

> **Note**
> It is also possible to start development with GitHub Codespaces, when navigating to `< > Code`, select `Codespaces` instead of `Local`. Click on either the `+`-sign or the `Create codespace on master`-button.

Amplication is using a monorepo architecture - powered by <a href="https://nx.dev">Nx Workspaces</a> - where multiple application and libraries exist in a single repository. To setup a local development environment the following steps can be followed:

###

1. Clone the repository and install dependencies:
```shell
git clone https://github.com/amplication/amplication.git && cd amplication && npm install
```

2. Run the setup script, which takes care of installing dependencies, building packages and setting up the workspace:
```shell
npm run setup:dev
```

3. Option 1: Running the required infrastructure - view infrastructure component logs


```shell
npm run docker:dev
```
3. Option 2: Running the required infrastructure - run the infrastructure components in background
```shell
npm run docker:dev -- -d
```

4. Apply database migrations
```shell
npm run db:migrate:deploy
```

5. To start developing, run one or more of the applications available under `serve:[application]` scripts of the package.json.

```shell
# running the server component
npm run serve:server

# running the client component
npm run serve:client

# running the data-service-generator component
npm run serve:dsg

# running the git-pull-request-service component
npm run serve:git

# running the plugin-api component
npm run serve:plugins
```

> **Note**
> In order to run the Amplication client properly, both the client and server need to be started by the `npm run serve:[application]` command, aswell as additional component for development on a specific component.

The development environment should now be set up. Additional information on the different application component can be found under packages/`[application]`/README.md file. Happy hacking! 👾
</details>

## Resources

- **[Website](https://amplication.com)** overview of the product.
- **[Docs](https://docs.amplication.com)** for comprehensive documentation.
- **[Blog](https://amplication.com/blog)** for guides and techinical comparisons.
- **[Roadmap](https://amplication.com/#roadmap)** to see what features will be added in the future.
- **[Discord](https://amplication.com/discord)** for support and discussions with the community and the team.
- **[GitHub](https://github.com/amplication/amplication)** for source code, project board, issues, and pull requests.
- **[Twitter](https://twitter.com/amplication)** for the latest updates on the product and published blogs.
- **[YouTube](https://www.youtube.com/c/Amplicationcom)** for guides and technical talks.

<a name="contributing_anchor"></a>
## Contributing

Amplication is an open-source project. We are committed to a fully transparent development process and highly appreciate any contributions. Whether you are helping us fix bugs, proposing new features, improving our documentation or spreading the word - we would love to have you as a part of the Amplication community. Please refer to our [contribution guidelines](./CONTRIBUTING.md) and [code of conduct](./CODE_OF_CONDUCT.md).

- Bug Report: If you see an error message or run into an issue while using Amplication, please create a [bug report](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A+bug&template=bug.yaml&title=%F0%9F%90%9B+Bug+Report%3A+).

- Feature Request: If you have an idea or you're missing a capability that would make development easier and more robust, please submit a [feature request](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A+feature+request&template=feature.yml).

- Documentation Request: If you're reading the Amplication docs and feel like the you're missing something, please submit a [documentation request](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A+docs&template=documentation-request.yaml&title=%F0%9F%93%96+Documentation%3A+).

Not sure where to start? Join our discord and we will help you get started!

<a href="https://amplication.com/discord"><img src="https://amplication.com/images/discord_banner_purple.svg" /></a>

## Contributers

<!---
npx contributer-faces --exclude "*bot*" --limit 70 --repo "https://github.com/amplication/amplication"

change the height and width for each of the contributors from 80 to 50.
--->

[//]: contributor-faces
<a href="https://github.com/yuval-hazaz"><img src="https://avatars.githubusercontent.com/u/43705455?v=4" title="yuval-hazaz" width="50" height="50"></a>
<a href="https://github.com/iddan"><img src="https://avatars.githubusercontent.com/u/12671072?v=4" title="iddan" width="50" height="50"></a>
<a href="https://github.com/tupe12334"><img src="https://avatars.githubusercontent.com/u/61761153?v=4" title="tupe12334" width="50" height="50"></a>
<a href="https://github.com/abrl91"><img src="https://avatars.githubusercontent.com/u/39680385?v=4" title="abrl91" width="50" height="50"></a>
<a href="https://github.com/morhag90"><img src="https://avatars.githubusercontent.com/u/97830649?v=4" title="morhag90" width="50" height="50"></a>
<a href="https://github.com/arielweinberger"><img src="https://avatars.githubusercontent.com/u/4976416?v=4" title="arielweinberger" width="50" height="50"></a>
<a href="https://github.com/EugeneTseitlin"><img src="https://avatars.githubusercontent.com/u/6080188?v=4" title="EugeneTseitlin" width="50" height="50"></a>
<a href="https://github.com/mshidlov"><img src="https://avatars.githubusercontent.com/u/91742238?v=4" title="mshidlov" width="50" height="50"></a>
<a href="https://github.com/barshimi"><img src="https://avatars.githubusercontent.com/u/4712526?v=4" title="barshimi" width="50" height="50"></a>
<a href="https://github.com/overbit"><img src="https://avatars.githubusercontent.com/u/2861984?v=4" title="overbit" width="50" height="50"></a>
<a href="https://github.com/germanilia"><img src="https://avatars.githubusercontent.com/u/34738985?v=4" title="germanilia" width="50" height="50"></a>
<a href="https://github.com/shaharblanksela"><img src="https://avatars.githubusercontent.com/u/91251849?v=4" title="shaharblanksela" width="50" height="50"></a>
<a href="https://github.com/GalCegla"><img src="https://avatars.githubusercontent.com/u/62651890?v=4" title="GalCegla" width="50" height="50"></a>
<a href="https://github.com/belkind27"><img src="https://avatars.githubusercontent.com/u/71218434?v=4" title="belkind27" width="50" height="50"></a>
<a href="https://github.com/levivannoort"><img src="https://avatars.githubusercontent.com/u/73097785?v=4" title="levivannoort" width="50" height="50"></a>
<a href="https://github.com/jainpawan21"><img src="https://avatars.githubusercontent.com/u/39362422?v=4" title="jainpawan21" width="50" height="50"></a>
<a href="https://github.com/g-traub"><img src="https://avatars.githubusercontent.com/u/33841027?v=4" title="g-traub" width="50" height="50"></a>
<a href="https://github.com/lalit8347"><img src="https://avatars.githubusercontent.com/u/74647848?v=4" title="lalit8347" width="50" height="50"></a>
<a href="https://github.com/alonram"><img src="https://avatars.githubusercontent.com/u/40050499?v=4" title="alonram" width="50" height="50"></a>
<a href="https://github.com/muhsinkamil"><img src="https://avatars.githubusercontent.com/u/62111075?v=4" title="muhsinkamil" width="50" height="50"></a>
<a href="https://github.com/lokeswaran-aj"><img src="https://avatars.githubusercontent.com/u/74011196?v=4" title="lokeswaran-aj" width="50" height="50"></a>
<a href="https://github.com/meeroslava"><img src="https://avatars.githubusercontent.com/u/20791516?v=4" title="meeroslava" width="50" height="50"></a>
<a href="https://github.com/udanna"><img src="https://avatars.githubusercontent.com/u/8627181?v=4" title="udanna" width="50" height="50"></a>
<a href="https://github.com/CKanishka"><img src="https://avatars.githubusercontent.com/u/30779692?v=4" title="CKanishka" width="50" height="50"></a>
<a href="https://github.com/gitstart"><img src="https://avatars.githubusercontent.com/u/1501599?v=4" title="gitstart" width="50" height="50"></a>
<a href="https://github.com/almogbhl"><img src="https://avatars.githubusercontent.com/u/32982671?v=4" title="almogbhl" width="50" height="50"></a>
<a href="https://github.com/chaiwattsw"><img src="https://avatars.githubusercontent.com/u/30198386?v=4" title="chaiwattsw" width="50" height="50"></a>
<a href="https://github.com/astitva0011"><img src="https://avatars.githubusercontent.com/u/113434018?v=4" title="astitva0011" width="50" height="50"></a>
<a href="https://github.com/kalmanl"><img src="https://avatars.githubusercontent.com/u/9283404?v=4" title="kalmanl" width="50" height="50"></a>
<a href="https://github.com/akshay-bharadva"><img src="https://avatars.githubusercontent.com/u/52954931?v=4" title="akshay-bharadva" width="50" height="50"></a>
<a href="https://github.com/souravjain540"><img src="https://avatars.githubusercontent.com/u/53312820?v=4" title="souravjain540" width="50" height="50"></a>
<a href="https://github.com/MoFoGo"><img src="https://avatars.githubusercontent.com/u/96979533?v=4" title="MoFoGo" width="50" height="50"></a>
<a href="https://github.com/molaycule"><img src="https://avatars.githubusercontent.com/u/20028628?v=4" title="molaycule" width="50" height="50"></a>
<a href="https://github.com/theamanbhargava"><img src="https://avatars.githubusercontent.com/u/23207069?v=4" title="theamanbhargava" width="50" height="50"></a>
<a href="https://github.com/MichaelSolati"><img src="https://avatars.githubusercontent.com/u/11811422?v=4" title="MichaelSolati" width="50" height="50"></a>
<a href="https://github.com/b4s36t4"><img src="https://avatars.githubusercontent.com/u/59088937?v=4" title="b4s36t4" width="50" height="50"></a>
<a href="https://github.com/gabimoncha"><img src="https://avatars.githubusercontent.com/u/39256258?v=4" title="gabimoncha" width="50" height="50"></a>
<a href="https://github.com/ShabanaNaik"><img src="https://avatars.githubusercontent.com/u/76608039?v=4" title="ShabanaNaik" width="50" height="50"></a>
<a href="https://github.com/Spid3rrr"><img src="https://avatars.githubusercontent.com/u/38404399?v=4" title="Spid3rrr" width="50" height="50"></a>
<a href="https://github.com/mulygottlieb"><img src="https://avatars.githubusercontent.com/u/1912933?v=4" title="mulygottlieb" width="50" height="50"></a>
<a href="https://github.com/TheLearneer"><img src="https://avatars.githubusercontent.com/u/23402178?v=4" title="TheLearneer" width="50" height="50"></a>
<a href="https://github.com/wiseaidev"><img src="https://avatars.githubusercontent.com/u/62179149?v=4" title="wiseaidev" width="50" height="50"></a>
<a href="https://github.com/VoidCupboard"><img src="https://avatars.githubusercontent.com/u/82395440?v=4" title="VoidCupboard" width="50" height="50"></a>
<a href="https://github.com/kabhamo"><img src="https://avatars.githubusercontent.com/u/74118584?v=4" title="kabhamo" width="50" height="50"></a>
<a href="https://github.com/michizhou"><img src="https://avatars.githubusercontent.com/u/33012425?v=4" title="michizhou" width="50" height="50"></a>
<a href="https://github.com/Himanxu1"><img src="https://avatars.githubusercontent.com/u/80101755?v=4" title="Himanxu1" width="50" height="50"></a>
<a href="https://github.com/ahlavorato"><img src="https://avatars.githubusercontent.com/u/114295834?v=4" title="ahlavorato" width="50" height="50"></a>
<a href="https://github.com/munyoudoum"><img src="https://avatars.githubusercontent.com/u/60089135?v=4" title="munyoudoum" width="50" height="50"></a>
<a href="https://github.com/rkshaw20"><img src="https://avatars.githubusercontent.com/u/73245914?v=4" title="rkshaw20" width="50" height="50"></a>
<a href="https://github.com/yonantan"><img src="https://avatars.githubusercontent.com/u/9935021?v=4" title="yonantan" width="50" height="50"></a>
<a href="https://github.com/alexbass86"><img src="https://avatars.githubusercontent.com/u/96179897?v=4" title="alexbass86" width="50" height="50"></a>
<a href="https://github.com/jatinparmar96"><img src="https://avatars.githubusercontent.com/u/15108177?v=4" title="jatinparmar96" width="50" height="50"></a>
<a href="https://github.com/AllMikeNoIke"><img src="https://avatars.githubusercontent.com/u/20914059?v=4" title="AllMikeNoIke" width="50" height="50"></a>
<a href="https://github.com/ilovetensor"><img src="https://avatars.githubusercontent.com/u/96976448?v=4" title="ilovetensor" width="50" height="50"></a>
<a href="https://github.com/asharonbaltazar"><img src="https://avatars.githubusercontent.com/u/58940073?v=4" title="asharonbaltazar" width="50" height="50"></a>
<a href="https://github.com/goingdust"><img src="https://avatars.githubusercontent.com/u/87334449?v=4" title="goingdust" width="50" height="50"></a>

[//]: contributor-faces

## License

A large part of this project is licensed under the [Apache 2.0](./LICENSE) license. The only expection are the components under the `ee` (enterprise edition) directory, these are licensed under the [Amplication Enterprise Edition](./ee/LICENSE) license.
