# Amplication Server

Amplication Server is the main component that provides critical back-end functionality to support the operation of the platform.

The server exposes a GraphQL API for all operations. The server is built with the following awesome open source technologies: Node.js, NestJS, Prisma, PostgreSQL, GraphQL, and many more.

## Setup

Amplication is using a mono-repo with multiple packages. To initialize all the packages on a local development environment, follow the [Getting Started With Local Development](/README.md#getting-started-with-local-development) section to do that in a few quick steps.

## Useful Targets

Targets can be run using Nx Workspaces. You can read more about targets in the [Nx Documentation](https://nx.dev/reference/project-configuration).

You can find a full list of targets in the [project.json](/Users/arielweinberger/Development/amplication/amplication/packages/amplication-server/project.json) file.

### `serve`

Runs the app in development mode.

```
npx nx serve amplication-server
```

### `test`

Executes tests.

```
npx nx test amplication-server
```

### `lint`

Performs a linting check using ESLint.

```
npx nx lint amplication-server
```

### `build`

Builds the app for production. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
npx nx build amplication-server
```

## Environment Variables

| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| DEBUG_MODE  | debug level         | 1           |
| NODE_ENV    | environment mode    | development |
| POSTGRESQL_URL | connection url to the database | postgresql://admin:admin@localhost:5432/amplication |
| POSTGRESQL_USER | username for the local database | admin |
| POSTGRESQL_PASSWORD | password for the local database | admin |
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
LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFvUmh5d1dnK3h2UmhKN2lFMDJlaQpJMGVNL1lqVnFpTHpFbEwzYUR2MTQ5cUxYZk9FeUR0NzV0emk4RlpraHh5TjJOV0R0REpKdGJETmlKVklISmVlCnR5cWl5WUF6VCtZOUM5SlpQdE9DOTBwaVg0YmxIRG1KQVltZGs2b1VjTU5BbjNwaW5rWWFnVW5mV3piS0p3NnkKdmdYR2JUS2VKejVNcEVrRUY0UXQwM2JOVlk2VHZBZVNqS0d1bEhsbHZqMnRlTFp0Ui9IbjRtYmhVdUZwenh1VAo3LzgwZEVVUWx5Mk9hMSsxSUZ0OVhBTTBvdjhUWUFQMnpjV0dlWWs3K2RIRndKMThlVkp5cGUyMkxSbEVONXdrClNkUXJvcmVBV1FjUjcvKzZBRGJyR1VNVU1BM3p1SVg5U292UkMwOWdEdUR6TGxncC9ieitWRVlaa0Z4dmRneHAKKzZVY0VsNnhPUXJoMW0wVW9BWlEreTRQb0svazY1bHBHeUhnWW92WHlQRzdoTWJRNmhQQjl3Wmx4TjNFeHBkUQpLWTg2T3gwajlWSVB6bTZxVDNZenJmZ0FhTXpSRDRxOHhUQURPVTEvY1hEOVFPY2grYmkrcHR2eFAvY1ZhWWZBCkcvdjF4Wkxzem9rTWFYUFJCa2NuUWRMdVY1TzREUDIreFBScitPYXZtWVBOVUIvRHNGZGRraFlJMFNQQ2d2cmUKRERCWXJWYTRCZ0FMR294TTJGYkJoZ3dWN2FRNEFXYXFLTVdWUy9nT1pYRUgxZlV6aGVqay9yeGh0NXN2eFBIUApsRWpsdEFvRzY2bEsyandsYjRab09INnl6Yjg0b0pVeDRjZE4vQmJEMWpDaERaZEJoN0M0YVFCaUFKRmtkc0lRCjdMWmVJOVJmRFlKVms5SnRzWTNzZjlrQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ== |
| GITHUB_APP_CLIENT_SECRET |  secret of your github app  |[use-secret-manager] |
| GITHUB_APP_CLIENT_ID|  installed github app client ID  |[github-app-client-id] |
| GITHUB_APP_APP_ID | ID of the installed github app  |[github-app-app-id]|
| GITHUB_APP_PRIVATE_KEY|  private key of the installed github app  |[github-app-private-key] |
| GITHUB_APP_INSTALLATION_URL| the url of your github app  |[github-app-installation-url] |

## Optional: Google Cloud Platform

If you use the Google Cloud Platform integration make sure to execute:

```bash
gcloud auth login
gcloud auth application-default login
```