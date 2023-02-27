# Amplication NestJS Logger Module

The `@amplication/util/nestjs/logging` is our official logger module. This library leverage, under the hood, the framework-agnostic amplication logging library `@amplication/util/logging`.

All nestjs services at Amplication must use this library to ensure consistent logging. This will enable us to trace and observe our systems reliably.

## Getting started

### Consume the module

In your microservices, import the logger module and consume it in your root module.

```ts
// app.module.ts

import { AmplicationLoggerModule } from '@amplication/util/nestjs/logging';

@Module({
  imports: [
    //...
    AmplicationLoggerModule.forRoot({
      serviceName: SERVICE_NAME,
    }),
    //...
  ],
})
export class AppModule implements // ....
```

### Usage

You can import the logger via dependency injection.

```ts
// example.service.ts

import {
  AmplicationLogger,
} from "@amplication/util/nestjs/logging";

@Injectable()
export class ExampleService {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  someMethod() {
    this.logger.debug("This is a debug log", { some: "context" });
    this.logger.info("This is a info log", { some: "context" });
    this.logger.warn("This is a warn log", { some: "context" });
    this.logger.error("This is a error log", { some: "context" });
  }
}
```