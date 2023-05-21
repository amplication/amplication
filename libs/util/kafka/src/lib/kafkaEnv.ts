import { EnvironmentVariables } from "./environmentVariables";
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_CONFIG_SSL,
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
}
