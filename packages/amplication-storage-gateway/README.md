# Amplication storage gateway

## Environment Variables:
| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| PORT | the port that the service is running on | 3002 |
| COMPOSE_PROJECT_NAME | docker image name | amplication-storage-gateway |
| JWT_SECRET_KEY | jwt secret key | m&XAFzBpM3es |
| JWT_EXPIRATION | jwt expiration | 2d |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata | ["localhost:9092"] |
| CHECK_USER_ACCESS_TOPIC | kafka topic name | "auth.user.access" |
| KAFKA_CLIENT_ID | kafka client id | "storage-queue-client |
| KAFKA_GROUP_ID | kafka group id | "storage-server-group |
| BASE_BUILDS_FOLDER | path to a folder where your builds will be saved | [path-to-local-folder] for example /Users/myusername/temp |
