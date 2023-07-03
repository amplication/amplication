# Amplication git pull service

Amplication git pull service is a microservice that listen to a Kafka queue.
This Kafka queue consists of git-push-events that `amplication-git-push-webhooks-service` microservice pushes to the queue.

Then, the service's job is to perform a clone/pull to the repository that has just been pushed and save the repository's files to storage (disk).

## Technologies:

- TypeScript
- NestJS microservices
- Kafka

## Providers:

- gitClient: perform git CLIs commands (clone/pull)
- gitProvider: integration with git provider. For now we use GitHub, but in the feature we will use other git provider (GitLab for example)
- storage: responsible for writing to the disk. Save the cloned/pushed files to the storage

## Example

An example from:
`ee/packages/amplication-git-pull-service/src/core/gitPullEvent/gitPullEvent.controller.ts`

`GitPullEventController` is the client that consume messages form the Kafka queue.
`@MessagePattern()` form Nest microsrvices get the Kafka topic name. This is the same topic that `amplication-git-push-webhooks-service` pushes git-web-hooks-push events to.

`processRepositoryPushEvent()` get the event message as a `@Payload()` and call to `gitPullEventService.handlePushEvent()` with that message.

```ts
@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern(EnvironmentVariables.getStrict(KAFKA_TOPIC_NAME_KEY))
  async processRepositoryPushEvent(@Payload() message: any) {
    await this.gitPullEventService.handlePushEvent(message.value);
  }
}
```

The properties that this microservice is expecting to get in the event message:

```ts
provider:GitProviderEnum,
repositoryOwner: string,
repositoryName: string,
branch: string,
commit: string,
status: EnumGitPullEventStatus,
pushedAt: Date,
installationId: string
```

## Environment Variables:
| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| DEBUG_MODE  | debug level         | 1           |
| NODE_ENV    | environment mode    | development |
| POSTGRESQL_URL | connection url to the database | postgresql://admin:admin@localhost:5432/\${SERVICE_DB_NAME} |
| POSTGRESQL_USER | username for the local database | admin |
| POSTGRESQL_PASSWORD | password for the local database | admin |
| SERVICE_DB_NAME | database name | amplication-git-pull-service |
| COMPOSE_PROJECT_NAME | name of the docker image  | amplication-git-pull-service |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata  | ["localhost:9092"] |
| KAFKA_CONSUMER_GROUP | consumer group | git-pull-event |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | repository-pull |
| STORAGE_PATH | max storage snapshot | Absolute path to a folder where your builds will be saved for development purposes, leave this variable empty to use `.amplication/storage` relative to the execution folder.  |
| MAX_SNAPSHOTS | a number represents the size of the storage | [place-your-max-snapshot-here] |
| GIT_DEFAULT_ORIGIN_NAME | git remote name | origin |
| GITHUB_APP_APP_ID| ID of the istalled github app  |[github-app-app-id]|
| GITHUB_APP_PRIVATE_KEY|  pivate key of the installed github app  |[github-app-private-key] |

## Development:

```bash
cd ee/packages/amplication-git-pull-service
npm run start:debug
```

Link to the issue: ["Git Pull Service: sync changes from remote repositories"]("https://github.com/amplication/amplication/issues/2437)
