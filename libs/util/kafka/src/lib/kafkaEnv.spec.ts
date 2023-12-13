import { KafkaEnvironmentVariables } from "./kafkaEnv";
import { EnvironmentVariables } from "./environmentVariables";
let spyOnEnvironmentVariableGet: jest.SpyInstance;

describe("KafkaEnvironmentVariables", () => {
  let kafkaEnvVars: KafkaEnvironmentVariables;

  beforeEach(() => {
    jest.clearAllMocks();
    spyOnEnvironmentVariableGet = jest.spyOn(
      EnvironmentVariables.prototype,
      "get"
    );

    kafkaEnvVars = new KafkaEnvironmentVariables();
  });

  describe("getBrokers", () => {
    it("should return an array of brokers", () => {
      spyOnEnvironmentVariableGet.mockReturnValue("broker1:9092,broker2:9092");
      expect(kafkaEnvVars.getBrokers()).toEqual([
        "broker1:9092",
        "broker2:9092",
      ]);
    });
  });

  describe("getGroupId", () => {
    it("should return the Kafka group ID", () => {
      spyOnEnvironmentVariableGet.mockReturnValue("test-group");
      expect(kafkaEnvVars.getGroupId()).toEqual("test-group");
    });

    it("should return undefined when the environment variable is not set", () => {
      spyOnEnvironmentVariableGet.mockReturnValue(undefined);
      expect(kafkaEnvVars.getGroupId()).toBeUndefined();
    });
  });

  describe("getClientId", () => {
    it("should return the Kafka client ID", () => {
      spyOnEnvironmentVariableGet.mockReturnValue("test-client");
      expect(kafkaEnvVars.getClientId()).toEqual("test-client");
    });
  });

  describe("getClientSslConfig", () => {
    it('should return true when the SSL environment variable is set to "true"', () => {
      spyOnEnvironmentVariableGet.mockReturnValue("true");
      expect(kafkaEnvVars.getClientSslConfig()).toEqual(true);
    });

    it('should return false when the SSL environment variable is set to "false"', () => {
      spyOnEnvironmentVariableGet.mockReturnValue("false");
      expect(kafkaEnvVars.getClientSslConfig()).toEqual(false);
    });

    it("should return false when the SSL environment variable is not set", () => {
      spyOnEnvironmentVariableGet.mockReturnValue(undefined);
      expect(kafkaEnvVars.getClientSslConfig()).toEqual(false);
    });
  });
});
