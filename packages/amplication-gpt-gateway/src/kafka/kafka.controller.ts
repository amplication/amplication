import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";

export class KafkaController {
  @EventPattern("triggergptchatcompletion")
  async onTriggergptchatcompletion(
    @Payload()
    message: KafkaMessage
  ): Promise<void> {}
}
