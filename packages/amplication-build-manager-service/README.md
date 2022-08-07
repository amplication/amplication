# Amplication Build Manager

Amplication Build Manager is a service which is responsible for managing code generation process. It uses Kafka as a message bus in order to communicate with other services, manages CodeBuild.

If you need help or have a question, go to our [Discord channel](https://discord.gg/Z2CG3rUFnu), we are here to help.

## Development

:bulb: Before you begin, make sure you have all the below installed:

- [Node.js v14 or above](https://nodejs.org/en/download/)
- [npm v7 or above](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/)
- [Docker](https://docs.docker.com/desktop/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

#### Automatic one-time setup

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, you should follow the instruction on the [README.md](../../README.md) file in the project root folder.

You can also use a more manual step-by-step approach to set up Amplication Build Manager - to do that, follow the instructions below.

## Environment Variables:

| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata  | `["localhost:9092"]` |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | `server-queue-client` |
| KAFKA_GROUP_ID |  prevent collisions between Nest microservice client and server components  | `main-server-group` |
| GENERATE_RESOURCE_TOPIC | From this topic the service obtains requests for code build process.  | `build.internal.generate-resource.event.0` |
| BUILD_STATUS_TOPIC | Topic for code build statuses. The service issue init or failed status. | `build.internal.build-status.event.0` |
| BUILD_CONTEXT_FS_LOCATION | Provides location of build contexts in file system. | `/home/build-manager/build-contexts` |
| BUILD_ARTIFACT_FS_LOCATION | Path to build artifacts in file system. | `/home/build-manager/build-artifacts` |
| BUILD_CONTEXT_S3_BUCKET | S3 bucket that stores build contexts required by CodeBuild. | `amplication-dsg-dev` |
| BUILD_CONTEXT_S3_LOCATION | Base location of build contexts in the bucket. | `build-contexts` |
| BUILD_ARTIFACT_S3_BUCKET | S3 bucket that stores artifacts that produced by CodeBuild. | `amplication-dsg-dev` |
| BUILD_ARTIFACT_S3_LOCATION | Base location of artifacts in the bucket. | `build-artifacts` |
| CODE_BUILD_PROJECT_NAME | CodeBuild Project Name that the service uses for code build process. | `code-generator-dev` |
| BUILD_STATE_TOPIC | Topic that stores build status messages from CodeBuild. | `build.external.build-state.event.0` |
| BUILD_STATE_TOPIC | Topic that stores build phase messages from CodeBuild. | `build.external.build-phase.event.0` |
| BUILD_IMAGE_NAME | Code generator base image name. | `amplication-data-service-generator` |
| BUILD_IMAGE_VERSION | Code generator base image version. | `0.0.5` |
| GET_BUILD_BY_RUN_ID_TOPIC | Topic for receiving build from server to build manager. | `build.internal.get-build-by-run-id.message.0` | 

#### Manual one-time set up

- Install dependencies of the monorepo (execute in root directory):

  ```
  npm install
  npm run bootstrap
  ```

- Start the development server and watch for changes (execute in server directory "packages/amplication-server")
  ```
  npm run start:watch
  ```
