# util-nestjs-tracing

This library contains the common tracing configuration for amplication services.

## Getting started

### Consume the module

In your microservices, import the logger module and consume it in your root module.
By importing the `TracingModule` the controllers and any provider decorated with the `@Traceable()` decorator will be instrumented. 

```ts
// app.module.ts

import { TracingModule } from '@amplication/util/nestjs/logging';

@Module({
  imports: [
    //...
    TracingModule.forRoot({
      serviceName: Env.SERVICE_NAME,
    }),
    //...
  ],
})
export class AppModule implements // ....
```

### Trace a service / provider

To enable the tracing for a provider, it needs to be decorated with `@Traceable()` as mention in the library [@overbit/opentelemetry-nestjs @Traceable](https://github.com/overbit/opentelemetry-nestjs#traceable) on which this lib is based.

i.e.
```ts
import {
  Traceable,
} from "@overbit/opentelemetry-nestjs";

@Traceable()  // <---------- MAGIC WORD!
@Injectable()
export class PullRequestService {
  gitProvidersConfiguration: GitProvidersConfiguration;
```

Alternatively, it is possible to trace just some methods of the injectable class by decorating them with `@Span()`

```ts
import {
  Span,
} from "@overbit/opentelemetry-nestjs";

@Injectable()
export class PullRequestService {

    async method1(args:unknown){
        // ....
    } 

    @Span()
    async method2(args:unknown){
        // ....
    } 
}
```

### Trace a class that is not part of Nestjs DI (not decorated with @Injectable())

To enable the tracing for an instance of a class that is not part of NestJS DI (module container), the instance needs to be wrapped with 
the `TraceWrapper.trace()` methods as mentioned here [@overbit/opentelemetry-nestjs Trace Not @Injectable() classes](https://github.com/overbit/opentelemetry-nestjs#trace-not-injectable-classes) 

```ts
import { TraceWrapper } from '@overbit/opentelemetry-nestjs';

class MyClass {
  hello() {
    console.log('Hi');
  }

  async bye() {
    await new Promise(() => console.log('bye bye'));
  }
}

// ....
const instance = new MyClass();
const tracedInstance = TraceWrapper.trace(instance);

// ....
```

## Running unit tests

Run `nx test util-nestjs-tracing` to execute the unit tests via [Jest](https://jestjs.io).