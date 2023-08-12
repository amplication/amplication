import { EnvironmentVariables } from "./environmentVariables";
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_CONFIG_SSL,
  KAFKA_CLIENT_CONSUMER_HEARTHBEAT,
  KAFKA_CLIENT_CONSUMER_REBALANCE_TIMEOUT,
  KAFKA_CLIENT_CONSUMER_SESSION_TIMEOUT,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
} from "./constants";

export class KafkaEnvironmentVariables {
  private envSuffix = "";
  constructor(envSuffix?: string) {
    if (envSuffix) {
      this.envSuffix = `_${envSuffix}`;
    }
  }

  getBrokers() {
    const commaSepBrokers = EnvironmentVariables.instance.get(
      `${KAFKA_BROKERS}${this.envSuffix}`,
      true
    );
    const brokers = commaSepBrokers.split(",");
    return brokers;
  }

  getGroupId() {
    return EnvironmentVariables.instance.get(
      `${KAFKA_GROUP_ID}${this.envSuffix}`,
      false
    );
  }

  getClientId() {
    return EnvironmentVariables.instance.get(
      `${KAFKA_CLIENT_ID}${this.envSuffix}`,
      true
    );
  }

  getClientSslConfig(): boolean {
    const ssl = EnvironmentVariables.instance.get(
      `${KAFKA_CLIENT_CONFIG_SSL}${this.envSuffix}`,
      false
    );

    return ssl ? ssl === "true" : false;
  }

  getConsumerSessionTimeout(): number {
    const timeout = EnvironmentVariables.instance.get(
      `${KAFKA_CLIENT_CONSUMER_SESSION_TIMEOUT}${this.envSuffix}`,
      false
    );
    return timeout ? parseInt(timeout) : 30000;
  }

  getConsumerHeartbeat(): number {
    const heartbeat = EnvironmentVariables.instance.get(
      `${KAFKA_CLIENT_CONSUMER_HEARTHBEAT}${this.envSuffix}`,
      false
    );
    return heartbeat ? parseInt(heartbeat) : 10000;
  }

  getConsumerRebalanceTimeout(): number {
    const timeout = EnvironmentVariables.instance.get(
      `${KAFKA_CLIENT_CONSUMER_REBALANCE_TIMEOUT}${this.envSuffix}`,
      false
    );
    return timeout ? parseInt(timeout) : 60000;
  }

  getConsumerMaxBytesPerPartition(): number {
    return 10485760;
  }
}
