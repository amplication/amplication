# Amplication git pull service

Amplication git pull service is a microservice that listen to a Kafka queue.
This Kafka queue consists of git-push-events that `amplication-git-push-webhooks-service` microservice pushes to the queue.

Then, the service's job is to perform a clone/pull to the repository that has just been pushed and save the repository's files to storage (disk).

## Usage

```ts

```

## Providers:

- gitClient: perform git CLIs commands (clone/pull)
- gitProvider: integration with git provider. For now we use GitHub, but in the feature we will use other git provider (GitLab for example)
- storage: responsible for writing to the disk. Save the cloned/pushed files to the storage

## Technologies:

- TypeScript
- NestJS microservices
- Kafka

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
