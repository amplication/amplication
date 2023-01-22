import { DecodedKafkaMessage } from "@amplication/util/kafka";
import { DecodedKafkaContext } from "./DecodedKafkaContext";

describe("DecodedKafkaContext", () => {
  const args = [
    "test",
    { test: true },
    undefined,
    { test: "consumer" },
    () => {
      //
    },
    { test: "producer" },
  ];
  let context: DecodedKafkaContext;

  beforeEach(() => {
    context = new DecodedKafkaContext(
      args as [DecodedKafkaMessage, number, string]
    );
  });
  describe("getTopic", () => {
    it("should return topic", () => {
      expect(context.getTopic()).toEqual(args[2]);
    });
  });
  describe("getPartition", () => {
    it("should return partition", () => {
      expect(context.getPartition()).toEqual(args[1]);
    });
  });
  describe("getMessage", () => {
    it("should return original message", () => {
      expect(context.getMessage()).toEqual(args[0]);
    });
  });
});
