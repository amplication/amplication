# Amplication git pull request service

## Environment Variables
| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| BASE_BUILDS_FOLDER | path to a folder where your builds will be saved | 
| GITHUB_APP_APP_ID| ID of the istalled github app  |[github-app-app-id]|
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata  | ["localhost:9092"] |
| GENERATE_PULL_REQUEST_TOPIC | Kafka topics are the categories used to organize messages. Each topic has a name that is unique across the entire Kafka cluster | "git.pr.generate.message" |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | git-pull-request |
| KAFKA_GROUP_ID |  prevent collisions between Nest microservice client and server components  | "amplication-git-pull-request-service" |
| GENERATE_PULL_REQUEST_TOPIC | Kafka topics are the categories used to organize messages. Each topic has a name that is unique across the entire Kafka cluster  | "git.pr.generate.message" |
