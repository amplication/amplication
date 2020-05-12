# Build Dev Environment

```bash
npm run docker:db
npm run migrate:save
npm run migrate:up

```

# URL

[Graphql playground](http://localhost:3000/graphql)

[Swagger UI](http://localhost:3000/api/#/)

## Schema Development

Read this articel to learn how to update the schema.prisma file [schema.prisma](https://github.com/prisma/prisma2/blob/master/docs/prisma-schema-file.md)

Update the Prisma schema `prisma/schema.prisma` and after that run the following command:

```bash
npm run prisma:generate
# or in watch mode
npm run prisma:generate:watch
```

npm run migrate:save

# or in watch mode

npx prisma2 migrate save --experimental

## Todo

• Complete docker setup as described in https://github.com/fivethree-team/nestjs-prisma-starter#docker

• use class-validator to validate your inputs and arguments.

• Checkout Apollo a popular graphql client which offers several clients for React, Angular, Vue.js, Native iOS, Native Android and more.
