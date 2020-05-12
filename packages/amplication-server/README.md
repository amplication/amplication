# Instructions

Starter template for 😻 [nest](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

## Features

- GraphQL w/ [playground](https://github.com/prisma/graphql-playground)
- Code-First w/ [type-graphql](https://github.com/19majkel94/type-graphql)
- [Prisma](https://www.prisma.io/) for database modelling, migration and type-safe access (Postgres, MySQL & MongoDB)
- 🔐 JWT authentication w/ [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- REST API docs w/ [Swagger](https://swagger.io/)

## Overview

- [Instructions](#instructions)
  - [Features](#features)
  - [Overview](#overview)
  - [Prisma Setup](#prisma-setup)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Prisma2: Prisma Migrate](#2-prisma2-prisma-migrate)
    - [3. Prisma2: Prisma Client JS](#3-prisma2-client-js)
    - [4. Seed the database data with this script](#4-seed-the-database-data-with-this-script)
    - [5. Install Nestjs](#5-install-nestjs)
  - [Start NestJS Server](#start-nestjs-server)
  - [Playground](#playground)
  - [Rest Api](#rest-api)
  - [Docker](#docker)
  - [Schema Development](#schema-development)
  - [NestJS - Api Schema](#nestjs---api-schema)
    - [Resolver](#resolver)
  - [Graphql Client](#graphql-client)
    - [Angular](#angular)
      - [Setup](#setup)
      - [Queries](#queries)
      - [Mutations](#mutations)
      - [Subscriptions](#subscriptions)
      - [Authentication](#authentication)

## Prisma Setup

### 1. Install Dependencies

Install the dependencies for the nest server:

```bash
npm install
```

### 2. Prisma2: Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database.

Saving the migration of the database:

```bash
npx prisma2 lift save
# or
npm run lift:save
```

Perform the database migration:

```bash
npx prisma2 lift up
# or
npm run lift:up
```

### 3. Prisma2: Prisma Client JS

[Prisma Client JS](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md) is a type-safe database client auto-generated based on the data model.

To generate Prisma Client JS execute, this will alwayse be executed after `npm install`:

```bash
npx prisma2 generate
# or
npm run prisma:generate
```

### 4. Seed the database data with this script

Execute the script with this command:

```sh
npm run seed
```

### 5. Install Nestjs

The [Nestjs CLI](https://docs.nestjs.com/cli/usages) can be used to generate controller, services, resolvers and more.

```
npm i -g @nestjs/cli
```

**[⬆ back to top](#overview)**

## Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

Run Nest Server in Production mode:

```bash
npm run start:prod
```

Playground for the NestJS Server is available here: http://localhost:3000/graphql

**[⬆ back to top](#overview)**

## Playground

Some queries and mutations are secured by an auth guard. You have to accuire a JWT token from `signup` or `login`. Add the the auth token as followed to **HTTP HEADERS** in the playground and replace `YOURTOKEN` here:

```
{
  "Authorization" : "Bearer YOURTOKEN"
}
```

## Rest Api

[RESTful API](http://localhost:3000/api) documentation available with Swagger.

## Docker

Nest serve is a Node.js application and it is easily [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/).

See the [Dockerfile](./Dockerfile) on how to build a Docker image of your Nest server.

There is one thing to be mentioned. A library called bcrypt is used for password hashing in the nest server starter. However, the docker container keeped crashing and the problem was missing tools for compilationof [bcrypt](https://github.com/kelektiv/node.bcrypt.js). The [solution](https://stackoverflow.com/a/41847996) is to install these tools for bcrypt's compilation before `npm install`:

```Dockerfile
# Install necessary tools for bcrypt to run in docker before npm install
RUN apt-get update && apt-get install -y build-essential && apt-get install -y python
```

Now to build a Docker image of your own Nest server simply run:

```bash
# give your docker image a name
docker build -t <your username>/nest-prisma-server .
# for example
docker build -t nest-prisma-server .
```

After Docker build your docker image you are ready to start up a docker container running the nest server:

```bash
docker run -d -t -p 3000:3000 nest-prisma-server
```

Now open up [localhost:3000](http://localhost:3000) to verify that your nest server is running.

If you see an error like `request to http://localhost:4466/ failed, reason: connect ECONNREFUSED 127.0.0.1:4466` this is because Nest tries to access the Prisma server on `http://localhost:4466/`. In the case of a docker container localhost is the container itself.
Therefore, you have to open up [Prisma Service](./src/prisma/prisma.service.ts) `endpoint: 'http://localhost:4466',` and replace localhost with the IP address where the Prisma Server is executed.

## Schema Development

Update the Prisma schema `prisma/schema.prisma` and after that run the following two commands:

```bash
npx prisma2 generate
# or in watch mode
npx prisma2 generate --watch
# or
npm run prisma:generate
npm run prisma:generate:watch
```

**[⬆ back to top](#overview)**

## NestJS - Api Schema

The [schema.graphql](./src/schema.graphql) is generated with [type-graphql](https://typegraphql.ml/). The schema is generated from the [models](./src/models/user.ts), the [resolvers](./src/resolvers/auth/auth.resolver.ts) and the [input](./src/resolvers/auth/dto/login.input.ts) classes.

You can use [class-validator](https://docs.nestjs.com/techniques/validation) to validate your inputs and arguments.

### Resolver

To implement the new query, a new resolver function needs to be added to `users.resolver.ts`.

```
@Query(returns => User)
async getUser(@Args() args): Promise<User> {
  return await this.prisma.client.user(args);
}
```

Restart the NestJS server and this time the Query to fetch a `user` should work.

**[⬆ back to top](#overview)**

## Graphql Client

A graphql client is necessary to consume the graphql api provided by the NestJS Server.

Checkout [Apollo](https://www.apollographql.com/) a popular graphql client which offers several clients for React, Angular, Vue.js, Native iOS, Native Android and more.

### Angular

#### Setup

To start using [Apollo Angular](https://www.apollographql.com/docs/angular/basics/setup.html) simply run in an Angular and Ionic project:

```bash
ng add apollo-angular
```

`HttpLink` from apollo-angular requires the `HttpClient`. Therefore, you need to add the `HttpClientModule` to the `AppModule`:

```typescript
imports: [BrowserModule,
    HttpClientModule,
    ...,
    GraphQLModule],
```

You can also add the `GraphQLModule` in the `AppModule` to make `Apollo` available in your Angular App.

You need to set the URL to the NestJS Graphql Api. Open the file `src/app/graphql.module.ts` and update `uri`:

```typescript
const uri = 'http://localhost:3000/graphql';
```

To use Apollo-Angular you can inject `private apollo: Apollo` into the constructor of a page, component or service.

**[⬆ back to top](#overview)**

#### Queries

To execute a query you can use:

```typescript
this.apollo.query({query: YOUR_QUERY});

# or

this.apollo.watchQuery({
  query: YOUR_QUERY
}).valueChanges;
```

Here is an example how to fetch your profile from the NestJS Graphql Api:

```typescript
const CurrentUserProfile = gql`
  query CurrentUserProfile {
    me {
      id
      email
      name
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({
      query: CurrentUserProfile
    }).valueChanges;
  }
}
```

Use the `AsyncPipe` and [SelectPipe](https://www.apollographql.com/docs/angular/basics/queries.html#select-pipe) to unwrap the data Observable in the template:

```html
<div *ngIf="data | async | select: 'me' as me">
  <p>Me id: {{me.id}}</p>
  <p>Me email: {{me.email}}</p>
  <p>Me name: {{me.name}}</p>
</div>
```

Or unwrap the data using [RxJs](https://www.apollographql.com/docs/angular/basics/queries.html#rxjs).

This will end up in an `GraphQL error` because `Me` is protected by an `@UseGuards(GqlAuthGuard)` and requires an `Bearer TOKEN`.
Please refer to the [Authentication](#authentication) section.

**[⬆ back to top](#overview)**

#### Mutations

To execute a mutation you can use:

```typescript
this.apollo.mutate({
  mutation: YOUR_MUTATION
});
```

Here is an example how to login into your profile using the `login` Mutation:

```typescript
const Login = gql`
  mutation Login {
    login(email: "test@example.com", password: "pizzaHawaii") {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.mutate({
      mutation: Login
    });
  }
}
```

**[⬆ back to top](#overview)**

#### Subscriptions

To execute a subscription you can use:

```typescript
this.apollo.subscribe({
  query: YOUR_SUBSCRIPTION_QUERY
});
```

**[⬆ back to top](#overview)**

#### Authentication

To authenticate your requests you have to add your `TOKEN` you receive on `signup` and `login` [mutation](#mutations) to each request which is protected by the `@UseGuards(GqlAuthGuard)`.

Because the apollo client is using `HttpClient` under the hood you are able to simply use an `Interceptor` to add your token to the requests.

Create the following class:

```typescript
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'YOUR_TOKEN'; // get from local storage
    if (token !== undefined) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
```

Add the Interceptor to the `AppModule` providers like this:

```typescript
providers: [
    ...
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ...
  ]
```

After you configured the Interceptor and retrieved the `TOKEN` from storage your request will succeed on resolvers with `@UseGuards(GqlAuthGuard)`.

**[⬆ back to top](#overview)**
