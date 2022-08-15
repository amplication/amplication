# Amplication NestJS Logger Module

The `@amplication/nest-logger-module` is our official logger module. Currently, it is a wrapper around the `nest-winston` package.

All services at Amplication must use this library to ensure consistent logging. This will enable us to trace and observe our systems reliably.

## Getting started

### Dependency

Add this logger as a dependency to your service's `package.json` file. For example:

```json
"@amplication/nest-logger-module": "<current-amplication-version>"
```

Then run `lerna bootstrap`.

### Consume the module

In your microservices, import the logger module and consume it in your root module.

```ts
// app.module.ts

import { AmplicationLoggerModule } from '@amplication/nest-logger-module';

@Module({
  imports: [
    AmplicationLoggerModule.register({
      metadata: { service: '<service-name>' },
    }),
  ],
})
export class AppModule implements
```

### Usage

You can import the logger via dependency injection.

```ts
// example.service.ts

import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";

@Injectable()
export class ExampleService {
  constructor(
    @Inject(AMPLICATION_LOGGER_PROVIDER)
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

## Useful information

This module is a wrapper around [`nest-winston`](https://www.npmjs.com/package/nest-winston). For more advanced use cases, please check it out.
