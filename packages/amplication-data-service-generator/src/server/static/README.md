# Getting started with your app

## Available Scripts

In the project directory you can run:

### `npm start`

Runs the app in the development mode.
By default, it is accessible at http://localhost:3000

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production to the `dist` folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Development

Make sure you have Node.js 14, npm, and Docker installed.

## Environment Variables:

| Environment          | Description                            | Value                                                       |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| DEBUG_MODE           | debug level                            | 1                                                           |
| POSTGRESQL_URL       | connection url to the database         | postgresql://admin:admin@localhost:5432/\${SERVICE_DB_NAME} |
| POSTGRESQL_PORT      | the port that the db is running on     | 5432                                                        |
| COMPOSE_PROJECT_NAME | the project name create in the docker  | amp\_{applicationId}                                        |
| POSTGRESQL_USER      | username for the local database        | admin                                                       |
| POSTGRESQL_PASSWORD  | password for the local database        | admin                                                       |
| SERVER_PORT          | the port that the server is running on | 3000                                                        |
| JWT_SECRET_KEY       | JWT secret                             | XAFzBpM3es                                                  |
| JWT_SECRET_KEY       | JWT secret                             | XAFzBpM3es                                                  |
| JWT_EXPIRATION       | JWT expiration by days                 | 2d                                                          |

- Install dependencies
- Move to server directory

```

  cd server

```

npm install

```

- Generate Prisma client

```

npm run prisma:generate

```

- Start database in Docker

```

npm run docker:db

```

- Or, instead running db only, run docker with server

```

npm run docker

```

- Initiate the database

```

npm run db:init

```

- Start the server

```

npm start

```

## Learn more

You can learn more in the [Amplication documentation](https://docs.amplication.com/guides/getting-started).
```
