# util-nestjs-kafka

Library containing nestjs specific utils for Kafka integration.
This library leverage util-kafka funtionality to satisfy nestjs specific use-cases.

## Serialisation of Kafka Message

To produce messages with serialised key and value, import the `KafkaProducerService` and use that instead of calling the nestjs KafkaClient directly:


```ts
// Nestjs Module.
// ...
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { KafkaModule } from "@amplication/util/nestjs/kafka";

@Module({
  imports: [KafkaModule],
  controllers: [BuildLoggerController],
  providers: [],
})
export class BuildLoggerModule {}
```


```ts
// class BuildLoggerController (readonly private kafkaProducerService: KafkaProducerService)
// ...
// myFunction(){
this.kafkaProducerService.emitMessage("topic-1", {
  key: "id-1",
  value: "my awesome value",
});
```
