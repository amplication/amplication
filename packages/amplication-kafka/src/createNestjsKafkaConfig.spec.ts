import { createNestjsKafkaConfig } from ".";
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
} from "./utils/constants";

const VALID_BROKERS_ENV = `["localhost:9092","localhost:3000"]`;
const VALID_CLIENT_ID_ENV = "client";
const VALID_GROUP_ID_ENV = "main";

const VALID_CONFIG_OBJECT = {
  options: {
    client: {
      brokers: JSON.parse(VALID_BROKERS_ENV),
      clientId: VALID_CLIENT_ID_ENV,
    },
    consumer: {
      groupId: VALID_GROUP_ID_ENV,
    },
  },
};

describe("Testing the createNestjsKafkaConfig function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  it("should get the right env", () => {
    process.env[`${KAFKA_CLIENT_ID}`] = VALID_CLIENT_ID_ENV;
    process.env[`${KAFKA_BROKERS}`] = VALID_BROKERS_ENV;
    process.env[`${KAFKA_GROUP_ID}`] = VALID_GROUP_ID_ENV;

    const configObject = createNestjsKafkaConfig();

    expect(configObject).toMatchObject(VALID_CONFIG_OBJECT);
  });
  it("should add the suffix to get the right env", () => {
    process.env[`${KAFKA_CLIENT_ID}_TEST`] = VALID_CLIENT_ID_ENV;
    process.env[`${KAFKA_BROKERS}_TEST`] = VALID_BROKERS_ENV;
    process.env[`${KAFKA_GROUP_ID}_TEST`] = VALID_GROUP_ID_ENV;

    const configObject = createNestjsKafkaConfig("TEST");

    expect(configObject).toMatchObject(VALID_CONFIG_OBJECT);
  });
});
