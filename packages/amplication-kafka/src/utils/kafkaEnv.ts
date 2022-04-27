import { EnvironmentVariables } from "./";
import { KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_GROUP_ID } from "./constants";

export class KafkaEnvironmentVariables {
  private envSuffix = "";
  constructor(envSuffix?: string) {
    if (envSuffix) {
      this.envSuffix = `_${envSuffix}`;
    }
  }
  getBrokers() {
    return EnvironmentVariables.getJson(
      `${KAFKA_BROKERS}${this.envSuffix}`,
      true
    );
  }
  getGroupId() {
    return EnvironmentVariables.get(
      `${KAFKA_GROUP_ID}${this.envSuffix}`,
      false
    );
  }
  getClientId() {
    return EnvironmentVariables.get(
      `${KAFKA_CLIENT_ID}${this.envSuffix}`,
      true
    );
  }
}
