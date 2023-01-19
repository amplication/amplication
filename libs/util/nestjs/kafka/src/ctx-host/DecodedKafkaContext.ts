import { DecodedKafkaMessage } from "@amplication/util/kafka";
import { BaseRpcContext } from "@nestjs/microservices";

// DecodedKafkaContextArgs must reflect nestjs KafkaContextArgs with the exclusion of message being a different type
type DecodedKafkaContextArgs = [
  message: DecodedKafkaMessage,
  partition: number,
  topic: string
];

export class DecodedKafkaContext extends BaseRpcContext<DecodedKafkaContextArgs> {
  constructor(args: DecodedKafkaContextArgs) {
    super(args);
  }

  /**
   * Returns the reference to the original message.
   */
  getMessage(): DecodedKafkaMessage {
    return this.args[0];
  }

  /**
   * Returns the partition.
   */
  getPartition() {
    return this.args[1];
  }

  /**
   * Returns the name of the topic.
   */
  getTopic() {
    return this.args[2];
  }
}
