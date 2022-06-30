import { KafkaOptions, Transport } from "@nestjs/microservices";
import { ConsumerConfig } from "@nestjs/microservices/external/kafka.interface";
import { KafkaEnvironmentVariables } from "./";

export function createNestjsKafkaConfig(envSuffix: string = ""): KafkaOptions {
  const kafkaEnv = new KafkaEnvironmentVariables(envSuffix);
  const groupId = kafkaEnv.getGroupId();
  let consumer: ConsumerConfig | undefined;
  if (groupId) {
    consumer = { groupId };
  }
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaEnv.getBrokers(),
        clientId: kafkaEnv.getClientId(),
      },
      consumer,
    },
  };
}
