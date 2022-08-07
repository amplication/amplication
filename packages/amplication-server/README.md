# Amplication Server

Amplication Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

If you need help or have a question, go to our [Discord channel](https://discord.gg/Z2CG3rUFnu), we are here to help.

## Development

:bulb: Before you begin, make sure you have all the below installed:

- [Node.js v14 or above](https://nodejs.org/en/download/)
- [npm v7 or above](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/)
- [Docker](https://docs.docker.com/desktop/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

#### Automatic one-time setup

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, you should follow the instruction on the [README.md](../../README.md) file in the project root folder.

You can also use a more manual step-by-step approach to set up Amplication server - to do that, follow the instructions below.

## Environment Variables:

| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| DEBUG_MODE  | debug level         | 1           |
| NODE_ENV    | environment mode    | development |
| POSTGRESQL_URL | connection url to the database | postgresql://admin:admin@localhost:5432/\${SERVICE_DB_NAME} |
| POSTGRESQL_USER | username for the local database | admin |
| POSTGRESQL_PASSWORD | password for the local database | admin |
| SERVICE_DB_NAME | database name | amplication-server |
| CORS_ENABLE | enable CORS | 1 |
| PORT | the post that the server is running on | 3000 |
| HOST | localhost | http://localhost:3000 |
| GRAPHQL_DEBUG | GraphQL debug | 1 |
| PLAYGROUND_ENABLE | enable GraphQL playground | 1 |
| JWT_SECRET | JWT secret | XAFzBpM3es |
| BCRYPT_SALT_OR_ROUNDS | salt for bcrypt | 10 |
| SERVICE_JWT_SECRET |  JWT secret | /QN%^4uefRUR%]Ar |
| DEFAULT_DISK | default storage disk | local |
| LOCAL_DISK_ROOT | local storage disk root | ./artifacts |
| BASE_BUILDS_FOLDER | path to a folder where your builds will be saved | Absolute path to a folder where your builds will be saved for development purposes, leave this variable empty to use `.amplication/storage` relative to the execution folder. |
| CONTAINER_BUILDER_DEFAULT | where to build containers by default | docker |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata  | `["localhost:9092"]` |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | `server-queue-client` |
| KAFKA_GROUP_ID |  prevent collisions between Nest microservice client and server components  | "main-server-group" |
| GENERATE_PULL_REQUEST_TOPIC | Kafka topics are the categories used to organize messages. Each topic has a name that is unique across the entire Kafka cluster  | "git.pr.generate.message" |
| CHECK_USER_ACCESS_TOPIC | kafka topic for user access  | "auth.user.access" |
| COMPOSE_PROJECT_NAME | name of the docker image  | amplication-server |
| PADDLE_BASE_64_PUBLIC_KEY | public key in base64 format  | LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFvUmh5d1dnK3h2UmhKN2lFMDJlaQpJMGVNL1lqVnFpTHpFbEwzYUR2MTQ5cUxYZk9FeUR0NzV0emk4RlpraHh5TjJOV0R0REpKdGJETmlKVklISmVlCnR5cWl5WUF6VCtZOUM5SlpQdE9DOTBwaVg0YmxIRG1KQVltZGs2b1VjTU5BbjNwaW5rWWFnVW5mV3piS0p3NnkKdmdYR2JUS2VKejVNcEVrRUY0UXQwM2JOVlk2VHZBZVNqS0d1bEhsbHZqMnRlTFp0Ui9IbjRtYmhVdUZwenh1VAo3LzgwZEVVUWx5Mk9hMSsxSUZ0OVhBTTBvdjhUWUFQMnpjV0dlWWs3K2RIRndKMThlVkp5cGUyMkxSbEVONXdrClNkUXJvcmVBV1FjUjcvKzZBRGJyR1VNVU1BM3p1SVg5U292UkMwOWdEdUR6TGxncC9ieitWRVlaa0Z4dmRneHAKKzZVY0VsNnhPUXJoMW0wVW9BWlEreTRQb0svazY1bHBHeUhnWW92WHlQRzdoTWJRNmhQQjl3Wmx4TjNFeHBkUQpLWTg2T3gwajlWSVB6bTZxVDNZenJmZ0FhTXpSRDRxOHhUQURPVTEvY1hEOVFPY2grYmkrcHR2eFAvY1ZhWWZBCkcvdjF4Wkxzem9rTWFYUFJCa2NuUWRMdVY1TzREUDIreFBScitPYXZtWVBOVUIvRHNGZGRraFlJMFNQQ2d2cmUKRERCWXJWYTRCZ0FMR294TTJGYkJoZ3dWN2FRNEFXYXFLTVdWUy9nT1pYRUgxZlV6aGVqay9yeGh0NXN2eFBIUApsRWpsdEFvRzY2bEsyandsYjRab09INnl6Yjg0b0pVeDRjZE4vQmJEMWpDaERaZEJoN0M0YVFCaUFKRmtkc0lRCjdMWmVJOVJmRFlKVms5SnRzWTNzZjlrQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ== |
| GITHUB_APP_CLIENT_SECRET |  secret of your github app  |[use-secret-manager] |
| GITHUB_APP_CLIENT_ID|  installed github app client ID  |[github-app-client-id] |
| GITHUB_APP_APP_ID | ID of the installed github app  |[github-app-app-id]|
| GITHUB_APP_PRIVATE_KEY|  private key of the installed github app  |[github-app-private-key] |
| GITHUB_APP_INSTALLATION_URL| the url of your github app  |[github-app-installation-url] |

#### Manual one-time set up

- Install dependencies of the monorepo (execute in root directory):

  ```
  npm install
  npm run bootstrap
  ```

- Update code generated by Prisma
  ```
  npm run prisma:generate
  ```
- Build dependencies of the server:
  ```
  npm run build -- --scope @amplication/server --include-dependencies
  ```
- Update other generated code
  ```
  npm run generate
  ```
- Make sure Docker is running
- Move to server directory
  ```
  cd packages/amplication-server
  ```
- Get external services up (execute in server directory "packages/amplication-server")
  ```
  npm run docker
  ```
- Update application database (execute in server directory "packages/amplication-prisma-db")

  ```
  npm run start:db
  ```

- Start the development server and watch for changes (execute in server directory "packages/amplication-server")
  ```
  npm run start:watch
  ```

##### Optional: Google Cloud Platform

If you use the Google Cloud Platform integration make sure to execute:

```bash
gcloud auth login
gcloud auth application-default login
```

#### Workflow

- Get external services up, if they're not already running
  ```
  npm run docker
  ```
- Start the development server and watch for changes, if it's not already running
  ```
  npm run start:watch
  ```
- Format files (editors like VSCode can do it for you automatically)
  ```
  npm run format
  ```
- Lint files (editors like VSCode come with integration to display those continuously)
  ```
  npm run lint
  ```
- Run tests and watch for changes
  ```
  npm run test:watch
  ```
- When needed, update Prisma Schema
  ```
  npm run migrate:save
  npm run migrate:up
  npm run prisma:generate
  ```
