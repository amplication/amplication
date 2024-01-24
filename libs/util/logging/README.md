# util-logging

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build util-logging` to build the library.

## Running unit tests

Run `nx test util-logging` to execute the unit tests via [Jest](https://jestjs.io).


## Getting started

### Logging in libraries

Libraries should always log without relying on a logger framework. 
In order to do so, libraries should rely on the ILogger interface and any service/application will pass the proper logger class. 

```ts
// library.class.ts
import { ILogger } from "@amplication/util/logging";

export class CakeFactory {
    constructor(private readonly logger: ILogger){}

    printInLog(message: string){
        this.logger.info(message)
        this.logger.error(message, new Error())
    }
}
```

### Logging in services / applications

In your microservices, import the logger module and consume it in your root module.

```ts
// module.ts

import { Logger } from '@amplication/util/logging';

const logger = new Logger ({
  isProduction: true,
  component: "component-name",
  logLevel: LogLevel.Warn
})

const logMe = () => {
    logger.info("An info log message", { other: { value: 1 }})
    // ....
}
```

The minimum log level can be configured also with the `LOG_LEVEL` environment variable, instead of the `logLevel: LogLevel.Warn`, to one of the following values:
- `debug`
- `info`
- `warn`
- `error`


## Testing utilsutils

A mocked provider can be used in unit tests. 
The following example explain how to use it

```ts
/// myservice.spec.ts

import { MockedLogger } from "@amplication/util/logging/test-utils";

//...
it('', () => {
    const target = new Service(MockedLogger);
})
//...
```