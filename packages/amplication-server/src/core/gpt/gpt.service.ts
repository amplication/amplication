import {
  GptConversationComplete,
  GptConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Inject, Injectable } from "@nestjs/common";
import { EnumActionStepStatus } from "../action/dto";
import { UserAction } from "../userAction/dto";
import { UserActionService } from "../userAction/userAction.service";
import { ConversationTypeKey } from "./gpt.types";
import { EnumUserActionType } from "../userAction/types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

const START_CONVERSATION_STEP_NAME = "START_CONVERSATION";

const CONVERSATION_INITIAL_STEP = {
  name: START_CONVERSATION_STEP_NAME,
  message: "Emitting event to start conversation with GPT gateway",
  status: EnumActionStepStatus.Waiting,
};

@Injectable()
export class GptService {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly userActionService: UserActionService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  async startConversation(
    conversationTypeKey: ConversationTypeKey,
    params: GptConversationStart.KafkaEvent["value"]["params"],
    userId: string,
    resourceId?: string
  ): Promise<UserAction> {
    const userAction =
      await this.userActionService.createUserActionByTypeWithInitialStep(
        EnumUserActionType.GptConversation,
        {},
        CONVERSATION_INITIAL_STEP,
        userId,
        resourceId
      );

    const kafkaMessage: GptConversationStart.KafkaEvent = {
      key: { requestUniqueId: userAction.id },
      value: {
        requestUniqueId: userAction.id,
        messageTypeKey: conversationTypeKey,
        params,
      },
    };

    await this.kafkaProducerService.emitMessage(
      KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC,
      kafkaMessage
    );
    return userAction;
  }

  async onConversationCompleted({
    success,
    requestUniqueId,
    errorMessage,
    result,
  }: GptConversationComplete.Value): Promise<void> {
    const userActionStatus = success
      ? EnumActionStepStatus.Success
      : EnumActionStepStatus.Failed;

    await this.userActionService.updateUserActionStep(
      requestUniqueId,
      START_CONVERSATION_STEP_NAME,
      userActionStatus
    );

    if (errorMessage) {
      this.logger.warn(errorMessage, null, { requestUniqueId });
      return;
    }

    await this.userActionService.updateUserActionMetadata(
      requestUniqueId,
      JSON.parse(result)
    );
  }
}
