import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";
import { Controller } from "@nestjs/common";

@Controller("kafka-controller")
export class KafkaController {
  @EventPattern("triggergptchatcompletion")
  async onTriggergptchatcompletion(
    @Payload()
    message: // eslint-disable-next-line @typescript-eslint/no-unused-vars
    KafkaMessage
  ): Promise<void> {}
}
