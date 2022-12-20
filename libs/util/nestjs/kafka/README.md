# util-nestjs-kafka

Library containing nestjs specific utils for Kafka integration.
This library leverage util-kafka funtionality to satisfy nestjs specific use-cases.

## Deserialisation of Kafka Message

In order to use the serializer, import the `KafkaMessageHelperModule` module and add the pipe to the kafka message @Payload like:

```ts
  @EventPattern(EnvironmentVariables.instance.get(Env.DSG_LOG_TOPIC, true))
  async onDsgLog(
    @Payload(ParseKafkaMessagePipe)
    message: DecodedKafkaMessage
  ): Promise<void> {
    ///....
```

## Serialisation of Kafka Message

To serialise a message with key and value, import the `KafkaMessageHelperModule` module and use the serializer:

```ts
    // class MyClass (readonly private serializer: IKafkaMessageSerializer)
    // ...
    // myFunction(){
        const message = await this.serializer.serialize({ key: { id: 'a'}, value: { complexObj : { id: 2}}, headers: {}})
        this.kafkaClient.emit(topic, message);
```