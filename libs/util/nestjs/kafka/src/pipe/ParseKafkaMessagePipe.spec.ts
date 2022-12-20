import { AmplicationLogger } from "@amplication/nest-logger-module";
import {
  DecodedKafkaMessage,
  KafkaMessageJsonSerializer,
} from "@amplication/util/kafka";
import { KafkaContext } from "@nestjs/microservices";
import { KafkaMessage } from "@nestjs/microservices/external/kafka.interface";
import { ParseKafkaMessagePipe } from "./parseKafkaMessagePipe";

const createKafkaContext = (key, value) => {
  if (typeof key !== "string") {
    key = JSON.stringify(key);
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }

  const message: KafkaMessage = {
    key: Buffer.from(key, "utf-8"),
    value: Buffer.from(value, "utf-8"),
    offset: "1",
    size: 10,
    attributes: 1,
    timestamp: "",
  };
  return new KafkaContext([message, 0, "topic"]);
};

describe("ParseKafkaMessagePipe", () => {
  let target: ParseKafkaMessagePipe;

  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as AmplicationLogger;

  describe("transform", () => {
    describe("when a kafka message contain json key and value", () => {
      const jsonSerializer = new KafkaMessageJsonSerializer();

      it("should return a context with decoded message", async () => {
        target = new ParseKafkaMessagePipe(jsonSerializer, logger);

        const expectedMessage: DecodedKafkaMessage = {
          key: { name: "spaghetti", id: 9 },
          value: { cookingTime: "10 minutes", type: "normal" },
          headers: undefined,
        };

        const originalContext = createKafkaContext(
          expectedMessage.key,
          expectedMessage.value
        );

        const result = await target.transform(originalContext);

        expect(result.getMessage()).toStrictEqual(expectedMessage);
        expect(result.getPartition()).toStrictEqual(
          originalContext.getPartition()
        );
        expect(result.getTopic()).toStrictEqual(originalContext.getTopic());
      });
    });

    describe("when a kafka message contain string key and value", () => {
      const jsonSerializer = new KafkaMessageJsonSerializer();

      it("should return a context with decoded message", async () => {
        target = new ParseKafkaMessagePipe(jsonSerializer, logger);

        const expectedMessage: DecodedKafkaMessage = {
          key: "maccheroni",
          value: "200",
          headers: undefined,
        };

        const originalContext = createKafkaContext(
          expectedMessage.key,
          expectedMessage.value
        );

        const result = await target.transform(originalContext);

        expect(result.getMessage()).toStrictEqual(expectedMessage);
        expect(result.getPartition()).toStrictEqual(
          originalContext.getPartition()
        );
        expect(result.getTopic()).toStrictEqual(originalContext.getTopic());
      });
    });
  });
});
