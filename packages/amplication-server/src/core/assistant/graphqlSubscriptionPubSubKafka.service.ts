import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, KafkaConfig } from "kafkajs";
import { KafkaPubSub } from "graphql-kafkajs-subscriptions";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { KAFKA_TOPICS } from "@amplication/schema-registry";

@Injectable()
export class GraphqlSubscriptionPubSubKafkaService implements OnModuleInit {
  private pubsub: KafkaPubSub;

  async onModuleInit() {
    const config = createNestjsKafkaConfig().options;

    const kafka = new Kafka(config.client as KafkaConfig);

    this.pubsub = await KafkaPubSub.create({
      kafka,
      topic: KAFKA_TOPICS.SHARED_GRAPHQL_SUBSCRIPTION_PUBSUB_TOPIC,
      groupIdPrefix: config.consumer.groupId + "-gql-subscription",
    });
  }

  getPubSub(): KafkaPubSub {
    if (!this.pubsub) {
      throw new Error("PubSub is not initialized");
    }
    return this.pubsub;
  }
}
