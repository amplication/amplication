# Amplication git push webhook service

## Environment Variables
| Environment | Description | Value       |
| ----------- | ----------- | ----------- |
| PORT | the port that the service is running on | 4567 |
| POSTGRESQL_URL | connection url to the database | postgresql://admin:admin@localhost:5432/\${SERVICE_DB_NAME} |
| POSTGRESQL_USER | username for the local database | admin |
| POSTGRESQL_PASSWORD | password for the local database | admin |
| SERVICE_DB_NAME | database name | amplication |
| KAFKA_BROKERS | kafka client must be configured with at least one broker. The brokers on the list are considered seed brokers and are only used to bootstrap the client and load initial metadata | ["localhost:9092"] |
| WEBHOOKS_SECRET_KEY | secret key for webhook | [your webhooks secret key] |
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

