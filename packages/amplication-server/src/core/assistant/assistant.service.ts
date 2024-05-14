import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { cloneDeep } from "lodash";
import OpenAI from "openai";
import { AssistantStream } from "openai/lib/AssistantStream";
import { Env } from "../../env";
import { AmplicationError } from "../../errors/AmplicationError";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { BillingService } from "../billing/billing.service";
import { AssistantFunctionsService } from "./assistantFunctions.service";
import { AssistantContext } from "./dto/AssistantContext";
import { AssistantMessageDelta } from "./dto/AssistantMessageDelta";
import { AssistantThread } from "./dto/AssistantThread";
import { EnumAssistantFunctions } from "./dto/EnumAssistantFunctions";
import { GraphqlSubscriptionPubSubKafkaService } from "./graphqlSubscriptionPubSubKafka.service";

export const MESSAGE_UPDATED_EVENT = "assistantMessageUpdated";

export const PLUGIN_LATEST_VERSION_TAG = "latest";

const STREAM_ERROR_MESSAGE =
  "It looks like we're experiencing a high demand right now, which might be affecting our connection to the AI model. Please give it a little time and try again later. We appreciate your patience and understanding as we work to resolve this. Thank you! 🙏";

export type MessageLoggerContext = {
  messageContext: {
    workspaceId: string;
    projectId: string;
    serviceId: string;
  };
  threadId: string;
  userId: string;
  role: string;
  functionName?: string;
  params?: string;
};

@Injectable()
export class AssistantService {
  private assistantId: string;
  private assistantFeatureEnabled: boolean;
  private openai: OpenAI;
  private clientHost: string;

  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly graphqlSubscriptionKafkaService: GraphqlSubscriptionPubSubKafkaService,
    private readonly billingService: BillingService,
    private readonly assistantFunctionsService: AssistantFunctionsService,

    configService: ConfigService
  ) {
    this.logger.info("starting assistant service");

    this.openai = new OpenAI({
      apiKey: configService.get<string>(Env.CHAT_OPENAI_KEY),
    });

    (this.clientHost = configService.get<string>(Env.CLIENT_HOST)),
      (this.assistantId = configService.get<string>(Env.CHAT_ASSISTANT_ID));

    this.assistantFeatureEnabled = Boolean(
      configService.get<string>(Env.FEATURE_AI_ASSISTANT_ENABLED) === "true"
    );
  }

  subscribeToAssistantMessageUpdated() {
    if (!this.assistantFeatureEnabled)
      throw new AmplicationError("The assistant AI feature is disabled");
    return this.graphqlSubscriptionKafkaService
      .getPubSub()
      .asyncIterator(MESSAGE_UPDATED_EVENT);
  }

  onMessageUpdated = async (
    threadId: string,
    messageId: string,
    textDelta: string,
    snapshot: string,
    completed: boolean,
    functionName?: string
  ) => {
    let functionExecuted: EnumAssistantFunctions | undefined;

    if (functionName) {
      //get the enum value based on the function name and the enum value
      functionExecuted =
        EnumAssistantFunctions[
          Object.keys(EnumAssistantFunctions).find(
            (key) => EnumAssistantFunctions[key] === functionName
          )
        ];
    }

    const message: AssistantMessageDelta = {
      id: "messageId",
      threadId,
      text: textDelta,
      snapshot: snapshot,
      completed,
      functionExecuted: functionExecuted,
    };
    await this.graphqlSubscriptionKafkaService
      .getPubSub()
      .publish(MESSAGE_UPDATED_EVENT, JSON.stringify(message));
  };

  //do not expose the entire context as it may include sensitive information
  getShortMessageContext(context: AssistantContext) {
    return {
      workspaceId: context.workspaceId,
      projectId: context.projectId,
      serviceId: context.resourceId, //@TODO: check type? //we use service id implicitly to help the assistant differentiate between different resources
    };
  }

  async validateAndReportUsage(context: AssistantContext) {
    if (!this.assistantFeatureEnabled)
      throw new AmplicationError("The assistant AI feature is disabled");

    if (context.user.workspace.allowLLMFeatures === false) {
      throw new AmplicationError(
        "AI-powered features are disabled for this workspace"
      );
    }

    if (this.billingService.isBillingEnabled) {
      const usage = await this.billingService.getMeteredEntitlement(
        context.user.workspace.id,
        BillingFeature.JovuRequests
      );

      if (usage && !usage?.hasAccess) {
        throw new BillingLimitationError(
          "This workspace has exceeded the number of allowed requests. Please upgrade your plan to continue using this feature.",
          BillingFeature.JovuRequests
        );
      }

      await this.billingService.reportUsage(
        context.user.workspace.id,
        BillingFeature.JovuRequests
      );
    }
  }

  async processMessageWithStream(
    messageText: string,
    threadId: string,
    context: AssistantContext
  ): Promise<AssistantThread> {
    await this.validateAndReportUsage(context);

    const openai = this.openai;

    const preparedThread = await this.prepareThread(
      messageText,
      threadId,
      context
    );

    const runStream = openai.beta.threads.runs.stream(preparedThread.threadId, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      assistant_id: this.assistantId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      additional_instructions: `The following context is available: 
        ${JSON.stringify(preparedThread.shortContext)}`,
    });

    await this.handleRunStream(
      runStream,
      preparedThread.threadId,
      context,
      preparedThread.loggerContext
    );

    return {
      id: preparedThread.threadId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async handleRunStream(
    stream: AssistantStream,
    threadId: string,
    context: AssistantContext,
    loggerContext: MessageLoggerContext
  ) {
    const openai = this.openai;

    stream
      .on("error", async (error) => {
        this.logger.error(
          `Chat: Stream error: ${error.message}. Error: ${JSON.stringify(
            error
          )}`,
          null,
          loggerContext
        );

        await this.onMessageUpdated(
          threadId,
          "",
          "",
          STREAM_ERROR_MESSAGE,
          true
        );
      })
      .on("event", async (event) => {
        if (event.event === "thread.run.requires_action") {
          const requiredActions =
            event.data.required_action.submit_tool_outputs.tool_calls;

          const functionCalls = await Promise.all(
            requiredActions.map(async (action) => {
              const functionName = action.function.name;
              const params = action.function.arguments;

              const functionResults =
                await this.assistantFunctionsService.executeFunction(
                  action.id,
                  functionName,
                  params,
                  context,
                  cloneDeep(loggerContext)
                );

              await this.onMessageUpdated(
                loggerContext.threadId,
                action.id,
                "",
                "",
                false,
                functionName
              );

              return functionResults;
            })
          );

          const submitToolStream =
            openai.beta.threads.runs.submitToolOutputsStream(
              threadId,
              event.data.id,
              {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                tool_outputs: functionCalls.map((call) => ({
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  tool_call_id: call.callId,
                  output: call.results,
                })),
              }
            );

          await this.handleRunStream(
            submitToolStream,
            threadId,
            context,
            loggerContext
          );
        }
      })
      .on("textCreated", async (text) => {
        await this.onMessageUpdated(
          threadId,
          "",
          text.value,
          text.value,
          false
        );
      })
      .on("textDelta", async (textDelta, snapshot) => {
        await this.onMessageUpdated(
          threadId,
          "",
          textDelta.value,
          snapshot.value,
          false
        );
      })
      .on("textDone", async (text) => {
        await this.onMessageUpdated(threadId, "", text.value, text.value, true);
        loggerContext.role = "assistant";
        this.logger.info(`Chat: ${text.value}`, loggerContext);
      });
  }

  async prepareThread(
    messageText: string,
    threadId: string,
    context: AssistantContext
  ) {
    const openai = this.openai;

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    const shortContext = this.getShortMessageContext(context);
    const loggerContext: MessageLoggerContext = {
      messageContext: shortContext,
      threadId,
      userId: context.user.id,
      role: "user",
    };

    this.logger.info(`Chat: ${messageText}`, loggerContext);

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageText,
    });

    return {
      threadId,
      shortContext,
      loggerContext,
    };
  }
}
