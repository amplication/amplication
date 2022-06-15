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
| SERVICE_DB_NAME | database name | ampication-server |
| COMPOSE_PROJECT_NAME | name of the docker image  | amplication-git-pull-service |
| KAFKA_BROKERS | something | ["localhost:9092"] |
| KAFKA_CONSUMER_GROUP | consumer group | git-pull-event |
| KAFKA_CLIENT_ID | kafka client id | repository-pull |
| KAFKA_REPOSITORY_PUSH_QUEUE | topic name | "git.external.push.event.0" |
| STORAGE_PATH | something | [path-to-local-folder] for example /Users/myusername/temp |
| MAX_SNAPSHOTS | a number represents the size of the storage | [place-your-max-snapshot-here] |
| GIT_DEFAULT_ORIGIN_NAME | git remote name | origin |
| GITHUB_APP_APP_ID | i don't know | [github-app-app-id] |
| GITHUB_APP_PRIVATE_KEY | i don't know | [github-app-private-key] |

## Development:

```bash
cd ee/packages/amplication-git-pull-service
npm run start:debug
```

Link to the issue: ["Git Pull Service: sync changes from remote repositories"]("https://github.com/amplication/amplication/issues/2437)
