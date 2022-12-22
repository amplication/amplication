# util-nestjs-kafka

Library containing nestjs specific utils for Kafka integration.
This library leverage util-kafka funtionality to satisfy nestjs specific use-cases.

## Deserialisation of Kafka Message

In order to use the serializer, import the `KafkaConsumerModule` module and add the pipe to the kafka message @Payload like:

```ts
  @EventPattern(EnvironmentVariables.instance.get(Env.DSG_LOG_TOPIC, true))
  async onDsgLog(
    @Payload(ParseKafkaMessagePipe)
    message: DecodedKafkaMessage
  ): Promise<void> {
    ///....
```

## Serialisation of Kafka Message

To produce messages with serialised key and value, import the `KafkaProducerService` and use that instead of calling the nestjs KafkaClient directly:

```ts
    // class MyClass (readonly private kafkaProducerService: KafkaProducerService)
    // ...
    // myFunction(){
       this.kafkaProducerService.emitMessage('topic-1', { key: "id-1", value: "my awesome value"});
```
