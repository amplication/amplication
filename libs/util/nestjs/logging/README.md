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
      component: SERVICE_NAME,
    }),
    //...
  ],
})
export class AppModule implements // ....
```

The minimum log level can be configured also with the `LOG_LEVEL` environment variable, instead of the `logLevel: LogLevel.Warn`, to one of the following values:
- `debug`
- `info`
- `warn`
- `error`


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


## Testing utils

A mocked provider can be used in unit tests. 
The following example explain how to use it

```ts
/// myservice.spec.ts

import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

//...
 const module: TestingModule = await Test.createTestingModule({
      providers: [
        // ... 
        MockedAmplicationLoggerProvider,
        // ...
      ]
      //...
 }).compile();
//...
```