import { KafkaOptions, Transport } from "@nestjs/microservices";

export const generateKafkaClientOptions = (): KafkaOptions => {
  if (!process.env.KAFKA_BROKERS) {
    throw new Error("KAFKA_BROKERS environment variable must be defined");
  }

  if (!process.env.KAFKA_ENABLE_SSL) {
    throw new Error("KAFKA_ENABLE_SSL environment variable must be defined");
  }

  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID environment variable must be defined");
  }

  if (!process.env.KAFKA_GROUP_ID) {
    throw new Error("KAFKA_GROUP_ID environment variable must be defined");
  }

  const kafkaBrokersString = process.env.KAFKA_BROKERS;
  const kafkaEnableSSL = process.env.KAFKA_ENABLE_SSL === "true";
  const kafkaClientId = process.env.KAFKA_CLIENT_ID;
  const kafkaGroupId = process.env.KAFKA_GROUP_ID;

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaClientId,
        brokers: [...kafkaBrokersString.split(",")],
        ssl: kafkaEnableSSL,
      },
      producer: {
        metadataMaxAge: 3000,
      },
      consumer: {
        rebalanceTimeout: 3000,
        groupId: kafkaGroupId,
      },
    },
  };
};
