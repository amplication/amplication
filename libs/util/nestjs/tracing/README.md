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

Or async:
```ts
// app.module.ts
import { TracingModule } from '@amplication/util/nestjs/logging';
@Module({
  imports: [
    //...
    TracingModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        serviceName: SERVICE_NAME,
      }),
    })
    //...
  ],
})
export class AppModule implements // ....
```


### Trace a service / provider

To enable the tracing for a provider, it needs to be decorated with `@Traceable()` as mention in the library [@amplication/opentelemetry-nestjs @Traceable](https://github.com/overbit/opentelemetry-nestjs#traceable) on which this lib is based.

i.e.
```ts
import {
  Traceable,
} from "@amplication/opentelemetry-nestjs";

@Traceable()  // <---------- MAGIC WORD!
@Injectable()
export class PullRequestService {
  gitProvidersConfiguration: GitProvidersConfiguration;
```

Alternatively, it is possible to trace just some methods of the injectable class by decorating them with `@Span()`

```ts
import {
  Span,
} from "@amplication/opentelemetry-nestjs";

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
the `TraceWrapper.trace()` methods as mentioned here [@amplication/opentelemetry-nestjs Trace Not @Injectable() classes](https://github.com/overbit/opentelemetry-nestjs#trace-not-injectable-classes) 

```ts
import { TraceWrapper } from '@amplication/opentelemetry-nestjs';

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

## Run in production

In order to send the collected tracing data, the application will need to pass the OTEL collector exporter URL i.e. `http://localhost:4318`
As this library rely on the official OTEL SDK library, the exporter URL configuration can be defined as `OTEL_EXPORTER_OTLP_ENDPOINT` enviroment variable as described here
https://opentelemetry.io/docs/concepts/sdk-configuration/otlp-exporter-configuration/


## Running unit tests

Run `nx test util-nestjs-tracing` to execute the unit tests via [Jest](https://jestjs.io).