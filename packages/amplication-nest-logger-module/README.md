# Amplication nestjs logger module

Amplication NestJs logger module is a standards wrapper for nest-Winston that it is a wrapper for Winston logger.
We need this library to ensure that all relevant metadata is included in every log.

## How to consomme

We did an example in pr [#3285](https://github.com/amplication/amplication/pull/3285) with all the details.
In short, to consomme this package, you need to add it to the [package.json](https://github.com/amplication/amplication/blob/master/packages/amplication-git-pull-request-service/package.json#L23) and the package have three main exports

|  Name | Description  |
| ------------ | ------------ |
| AmplicationLoggerModule  |  The Amplication logger module that wraps the logic and insatiate the nest-Winston module |
| AMPLICATION_LOGGER_PROVIDER  |  The NestJs provider key to consomme the inject the instance |
| AmplicationLogger  |  An interface that wraps the logger interface from the Winston package |
