import { ConfigService } from "@nestjs/config";
import { KafkaOptions, Transport } from "@nestjs/microservices";

export const generateKafkaClientOptions = (
  configService: ConfigService
): KafkaOptions => {
  const kafkaBrokersString = configService.get("KAFKA_BROKERS");
  const kafkaEnableSSL = configService.get("KAFKA_ENABLE_SSL") === "true";
  const kafkaClientId = configService.get("KAFKA_CLIENT_ID");
  const kafkaGroupId = configService.get("KAFKA_GROUP_ID");

  if (!kafkaBrokersString) {
    throw new Error("KAFKA_BROKERS environment variable must be defined");
  }

  if (!kafkaClientId) {
    throw new Error("KAFKA_CLIENT_ID environment variable must be defined");
  }

  if (!kafkaGroupId) {
    throw new Error("KAFKA_GROUP_ID environment variable must be defined");
  }

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
