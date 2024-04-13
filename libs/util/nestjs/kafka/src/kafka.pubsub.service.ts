import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, logLevel } from "kafkajs";
import { KafkaPubSub } from "graphql-kafkajs-subscriptions";
import { KafkaEnvironmentVariables } from "@amplication/util/kafka";
import { randomUUID } from "crypto";

const KAFKA_PUBSUB_TOPIC = "pubsub-topic";
const KAFKA_PUBSUB_GROUP_ID_PREFIX = "pubsub-group-id";

@Injectable()
export class KafkaPubSubService implements OnModuleInit {
  private pubsub: KafkaPubSub;

  async onModuleInit() {
    await this.initializePubSub();
  }

  private async initializePubSub(): Promise<void> {
    const kafkaEnv = new KafkaEnvironmentVariables("");

    const kafka = new Kafka({
      logLevel: logLevel.ERROR,
      clientId: kafkaEnv.getClientId() + `-${randomUUID()}`,
      brokers: kafkaEnv.getBrokers(),
      connectionTimeout: 25000,
      retry: {
        retries: 3,
        maxRetryTime: 3000,
      },
    });

    this.pubsub = await KafkaPubSub.create({
      kafka,
      topic: KAFKA_PUBSUB_TOPIC,
      groupIdPrefix: KAFKA_PUBSUB_GROUP_ID_PREFIX,
    });
  }

  getPubSub(): KafkaPubSub {
    if (!this.pubsub) {
      throw new Error("PubSub is not initialized");
    }
    return this.pubsub;
  }
}
