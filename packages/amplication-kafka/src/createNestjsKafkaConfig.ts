import { KafkaOptions, Transport } from "@nestjs/microservices";
import { KafkaEnvironmentVariables } from "./";

export function createNestjsKafkaConfig(envSuffix: string = ""): KafkaOptions {
  const kafkaEnv = new KafkaEnvironmentVariables();
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaEnv.getBrokers(),
        clientId: kafkaEnv.getClientId(),
      },
      consumer: {
        groupId: kafkaEnv.getGroupId(),
      },
    },
  };
}
