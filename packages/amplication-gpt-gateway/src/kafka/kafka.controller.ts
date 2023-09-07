import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";
import { Controller } from "@nestjs/common";
import { StartConversationInput } from "../dto/StartConversationInput";
import { ConversationTypeService } from "../conversationType/conversationType.service";

@Controller("kafka-controller")
export class KafkaController {
  constructor(protected readonly conversationType: ConversationTypeService) {}

  @EventPattern("triggergptchatcompletion")
  async onTriggergptchatcompletion(
    @Payload()
    message: KafkaMessage
  ): Promise<void> {
    const messageInput: StartConversationInput = JSON.parse(
      message.value.toString()
    );
    this.conversationType.startConversion(messageInput);
  }
}
