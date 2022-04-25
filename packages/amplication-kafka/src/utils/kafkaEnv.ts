import { EnvironmentVariables } from "./";

export class KafkaEnvironmentVariables extends EnvironmentVariables {
  private envSuffix = "";
  constructor(envSuffix?: string) {
    super();
    if (envSuffix) {
      this.envSuffix = `_${envSuffix}`;
    }
  }
  getBrokers() {
    return EnvironmentVariables.getJson(`KAFKA_BROKERS${this.envSuffix}`, true);
  }
  getGroupId() {
    return EnvironmentVariables.get(`KAFKA_GROUP_ID${this.envSuffix}`, false);
  }
  getClientId() {
    return EnvironmentVariables.get(`KAFKA_CLIENT_ID${this.envSuffix}`, true);
  }
}
