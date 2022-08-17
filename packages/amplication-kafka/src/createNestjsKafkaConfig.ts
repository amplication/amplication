import { KafkaOptions, Transport } from "@nestjs/microservices";
import { KafkaEnvironmentVariables } from "./";

export function createNestjsKafkaConfig(envSuffix: string = ""): KafkaOptions {
  const kafkaEnv = new KafkaEnvironmentVariables(envSuffix);
  const groupId = kafkaEnv.getGroupId() as string;

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaEnv.getBrokers(),
        clientId: kafkaEnv.getClientId(),
      },
      consumer: {
        groupId,
        rebalanceTimeout: 3000,
      },
      producer: {
        metadataMaxAge: 3000,
      },
    },
  };
}
