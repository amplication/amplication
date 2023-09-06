import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";
import { Controller } from "@nestjs/common";

@Controller("kafka-controller")
export class KafkaController {
  @EventPattern("triggergptchatcompletion")
  async onTriggergptchatcompletion(
    @Payload()
    message: KafkaMessage
  ): Promise<void> {
    console.log(message);
  }
}
