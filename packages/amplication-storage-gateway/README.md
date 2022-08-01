# Amplication storage gateway

## Environment Variables:
| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| PORT | the port that the service is running on | 3002 |
| COMPOSE_PROJECT_NAME | docker image name | amplication-storage-gateway |
| JWT_SECRET_KEY | jwt secret key | m&XAFzBpM3es |
| JWT_EXPIRATION | jwt expiration | 2d |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata | ["localhost:9092"] |
| CHECK_USER_ACCESS_TOPIC | Kafka topics are the categories used to organize messages. Each topic has a name that is unique across the entire Kafka cluster | "auth.user.access" |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | "storage-queue-client |
| KAFKA_GROUP_ID |  prevent collisions between Nest microservice client and server components | "storage-server-group |
| BASE_BUILDS_FOLDER | path to a folder where your builds will be saved | Absolute path to a folder where your builds will be saved for development purposes, leave this variable empty to use `.amplication/storage` relative to the execution folder. |
