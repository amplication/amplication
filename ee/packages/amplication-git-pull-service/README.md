# Amplication git pull service

This is a microservice built upon the NestJS microservice.

This service is listening to a Kafka queue that consists of webhooks push events from GitHub.

After successful integration with GitHub, `amplication-git-push-webhooks-service` is listening to push events and putting those events on the Kafka queue that `amplication-git-pull-service` (this service) is listening to.

Then, the service's job is to perform a clone/pull to the repository that has just been pushed and save the repository's files to storage (disk).