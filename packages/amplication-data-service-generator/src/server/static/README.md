# Getting started with your app

## Available Scripts

In the `server` subdirectory, you can run:

### `npm start`

Runs the app in development mode.
By default, it is accessible at http://localhost:3000

### `npm test`

Runs tests.

### `npm run build`

Builds the app for production in the `dist` folder.

Your app is ready to be deployed!

## Environment Variables:

| Environment          | Description                              | Value                                                       |
| -------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| DEBUG_MODE           | Debug level                              | 1                                                           |
| POSTGRESQL_URL       | Local database connection URL            | postgresql://admin:admin@localhost:5432/\${SERVICE_DB_NAME} |
| POSTGRESQL_PORT      | Local database port                      | 5432                                                        |
| POSTGRESQL_USER      | Local database username                  | admin                                                       |
| POSTGRESQL_PASSWORD  | Local database password                  | admin                                                       |
| COMPOSE_PROJECT_NAME | Docker Compose project name              | amp\_{applicationId}                                        |
| SERVER_PORT          | The port that the server is listening to | 3000                                                        |
| JWT_SECRET_KEY       | JWT secret                               | Change_ME!!!                                                |
| JWT_EXPIRATION       | JWT expiration in days                   | 2d                                                          |

## Getting Started - Local Development

### Prerequisites

Make sure you have Node.js 16.x, npm, and Docker installed.

### Install dependencies

In the `server` subdirectory, run:

```console
cd server
npm install
```

### Generate Prisma client

```console
npm run prisma:generate
```

### Start database using Docker

```console
npm run docker:db
```

### Initialize the database

```console
npm run db:init
```

### Start the server

```console
npm start
```

## Getting Started - Docker Compose

In the `server` subdirectory, run:

```console
npm run compose:up
```

## Learn more

You can learn more in the [Amplication documentation](https://docs.amplication.com/guides/getting-started).
