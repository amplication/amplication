import { DecodedKafkaMessage } from "@amplication/util/kafka";
import { Key } from "./key";
import { Value, UserActionType } from "./value";

interface KafkaEvent extends DecodedKafkaMessage {
  key: Key;
  value: Value;
}

export { Key, Value, KafkaEvent, UserActionType };
