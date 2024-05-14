import { KafkaMessage } from "../../../types";
import { createKafkaMessage } from "../../../../test/kafkaMessageUtil";
import { KafkaMessageJsonSerializer } from "./KafkaMessageJsonSerializer";

jest.mock("console");

describe("jsonMessageSerialiser", () => {
  let serialiser: KafkaMessageJsonSerializer;

  beforeEach(() => {
    jest.clearAllMocks();

    serialiser = new KafkaMessageJsonSerializer();
  });

  it("is instantiable", () => {
    expect(serialiser).toBeInstanceOf(KafkaMessageJsonSerializer);
  });

  describe("when serializing plain text messages", () => {
    describe("and the messages contain a key and a value", () => {
      const message = { key: "key1", value: "value1" };

      it("the KafkaMessage is correctly serialised", async () => {
        const expectedMessage: KafkaMessage = {
          key: Buffer.from([0x6b, 0x65, 0x79, 0x31]),
          value: Buffer.from([0x76, 0x61, 0x6c, 0x75, 0x65, 0x31]),
        };

        const result = await serialiser.serialize(message);
        expect(result).toEqual(expectedMessage);
      });
    });

    describe("and the messages contain only values", () => {
      const message = { key: null, value: "value1" };

      it("the KafkaMessage is correctly serialised", async () => {
        const expectedMessage: KafkaMessage = {
          key: null,
          value: Buffer.from([0x76, 0x61, 0x6c, 0x75, 0x65, 0x31]),
        };

        const result = await serialiser.serialize(message);
        expect(result).toEqual(expectedMessage);
      });
    });
  });

  describe("when serializing message with json objects", () => {
    describe("and the messages contain a key and a value", () => {
      const message = { key: { key: "key1" }, value: { a: "hello", b: 2 } };

      it("the KafkaMessage is correctly serialised", async () => {
        const expectedMessage: KafkaMessage = {
          key: Buffer.from([
            0x7b, 0x22, 0x6b, 0x65, 0x79, 0x22, 0x3a, 0x22, 0x6b, 0x65, 0x79,
            0x31, 0x22, 0x7d,
          ]),
          value: Buffer.from([
            0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
            0x22, 0x2c, 0x22, 0x62, 0x22, 0x3a, 0x32, 0x7d,
          ]),
        };

        const result = await serialiser.serialize(message);
        expect(result).toEqual(expectedMessage);
      });
    });

    describe("and the messages contain only values", () => {
      const message = { key: null, value: { a: "hello", b: 2 } };

      it("the KafkaMessage is correctly serialised", async () => {
        const expectedMessage: KafkaMessage = {
          key: null,
          value: Buffer.from([
            0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
            0x22, 0x2c, 0x22, 0x62, 0x22, 0x3a, 0x32, 0x7d,
          ]),
        };

        const result = await serialiser.serialize(message);
        expect(result).toEqual(expectedMessage);
      });
    });
  });

  describe("when deserializing a kafka message", () => {
    it("the KafkaMessage is correctly deserialised", async () => {
      const message = createKafkaMessage("repo-id", "value");

      const result = await serialiser.deserialize(message);

      expect(result.key).toEqual("repo-id");
      expect(result.value).toEqual("value");
    });
  });
});
