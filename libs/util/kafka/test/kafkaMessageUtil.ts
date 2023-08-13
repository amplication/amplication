import { KafkaMessage } from "../src";

export const createKafkaMessage = (
  key: string,
  message: string
): KafkaMessage => ({
  key: Buffer.from(key, "utf8"),
  value: Buffer.from(message, "utf8"),
  headers: {},
});
