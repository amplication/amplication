import { Key } from "./key";
import { Value, UserActionType } from "./value";
import { DecodedKafkaMessage } from "@amplication/util/kafka";

interface KafkaEvent extends DecodedKafkaMessage {
  key: Key;
  value: Value;
}

export { Key, Value, KafkaEvent, UserActionType };
