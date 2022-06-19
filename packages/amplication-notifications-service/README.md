# Amplication Notifications Service 🔔

'@amplication/notifications-service' is a microservice that is listening to a kafka queue (consumer).

## Environment Variable:
Please make sure all environment variables have valid values

| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| NODE_ENV | environment mode | development |
| PORT |  port | 3333 |
| COMPOSE_PROJECT_NAME | name of the docker image | amplication-notifications-service |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata  | `["localhost:9092"]` |
| KAFKA_CLIENT_ID | A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application. Example: booking-events-processor | notifications-queue-client |
| KAFKA_CONSUMER_GROUP |  prevent collisions between Nest microservice client and server components  | amplication-notifications-service-group |
| KAFKA_TOPIC | Kafka topics are the categories used to organize messages. Each topic has a name that is unique across the entire Kafka cluster  | notification.internal.in-app-push.event.0 |
| NOVU_API_KEY | API key from Novu's dashboard | [novu-api-key] |

---
## Development

```bash
cd packages/notifications-service
npm run start:debug
```