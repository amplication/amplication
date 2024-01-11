import { Key } from "./key";
import { Value } from "./value";
import { DecodedKafkaMessage } from "@amplication/util/kafka";

interface KafkaEvent extends DecodedKafkaMessage {
  key: Key;
  value: Value;
}

export { Key, Value, KafkaEvent };
