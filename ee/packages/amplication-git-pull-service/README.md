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

## Development:

- Run Kafka in a docker image:

```
docker compose up -d
```

---

- In a separate terminal, run the microservice

```bash
cd ee/packages/amplication-git-pull-service
npm run start:debug
```

Link to the issue: ["Git Pull Service: sync changes from remote repositories"]("https://github.com/amplication/amplication/issues/2437)
