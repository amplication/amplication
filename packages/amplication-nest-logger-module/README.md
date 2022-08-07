# Amplication NestJS Logger Module

The Amplication NestJS Logger Module is our official logger module. Currently, it is a wrapper around the `nest-winston` package.

All services at Amplication must use this library to ensure consistent logging. This will enable us to trace and observe our systems reliably.

## How to consume

We did an example in pr [#3285](https://github.com/amplication/amplication/pull/3285) with all the details.
In short, to consomme this package, you need to add it to the [package.json](https://github.com/amplication/amplication/blob/master/packages/amplication-git-pull-request-service/package.json#L23) and the package have three main exports

|  Name | Description  |
| ------------ | ------------ |
| AmplicationLoggerModule  |  The Amplication logger module that wraps the logic and insatiate the nest-Winston module |
| AMPLICATION_LOGGER_PROVIDER  |  The NestJs provider key to consomme the inject the instance |
| AmplicationLogger  |  An interface that wraps the logger interface from the Winston package |
