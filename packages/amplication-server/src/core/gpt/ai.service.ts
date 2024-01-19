import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Injectable } from "@nestjs/common";
import { ConversationTypeKey } from "./ai.types";
import {
  AiConversationComplete,
  AiConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { UserAction } from "../userAction/dto";
import { UserActionService } from "../userAction/userAction.service";
import { EnumUserActionType } from "../userAction/types";
import { ResourceBtmService } from "../resource/resourceBtm.service";

@Injectable()
export class AiService {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly resourceBtmService: ResourceBtmService,
    private readonly userActionService: UserActionService
  ) {}

  async startConversation(
    userAction: UserAction,
    conversationTypeKey: ConversationTypeKey,
    params: AiConversationStart.KafkaEvent["value"]["params"]
  ) {
    const kafkaMessage: AiConversationStart.KafkaEvent = {
      key: { requestUniqueId: userAction.id },
      value: {
        userActionId: userAction.id,
        messageTypeKey: conversationTypeKey,
        params,
      },
    };
    await this.kafkaProducerService.emitMessage(
      KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC,
      kafkaMessage
    );
  }

  async onConversationCompleted({
    success,
    userActionId,
    errorMessage,
    result,
  }: AiConversationComplete.Value): Promise<void> {
    const userAction = await this.userActionService.findOne({
      where: {
        id: userActionId,
      },
    });

    if (!userAction) {
      throw new Error(`User action not found: ${userActionId}`);
    }

    switch (userAction.userActionType) {
      case EnumUserActionType.BreakTheMonolith:
        await this.resourceBtmService.onCompleteBreakServiceIntoMicroservices(
          userAction,
          success,
          errorMessage,
          result
        );
        break;
      default:
        throw new Error(
          `Unsupported user action type: ${userAction.userActionType}`
        );
    }
  }
}
