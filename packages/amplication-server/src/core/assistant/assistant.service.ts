import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { Env } from "../../env";
import { AssistantThread } from "./dto/AssistantThread";
import { TextContentBlock } from "openai/resources/beta/threads/messages/messages";
import { EnumAssistantMessageRole } from "./dto/EnumAssistantMessageRole";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { AssistantContext } from "./dto/AssistantContext";
import { EntityService } from "../entity/entity.service";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { ResourceService } from "../resource/resource.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { Entity } from "../../models";

enum EnumAssistantFunctions {
  CreateEntity = "createEntity",
  GetProjectServices = "getProjectServices",
  GetServiceEntities = "getServiceEntities",
}

const INSTRUCTIONS = `You are an assistant for users in Amplication.
The user is currently logged in and using Amplication.
The user will be able to ask you questions about the Amplication and the code generated using Amplication.
All questions and answers should be in the context of Amplication or the generated code. 
The user will not be able to upload files.

Your goal is to help the user build production-ready backend services easily and according to industry standards. 
It is essential to tell the user about their ownership and control over the generated code while keeping the ability to get more code changes and updates from Amplication,
and that they should connect to a git repository to get the code and customize it.

You can also help the user with the creation of settings and configuration in Amplication, including:
Services, message brokers, entities, entity fields, roles, actions, DTOs, and more.`;

@Injectable()
export class AssistantService {
  private assistantId: string;
  private openai: OpenAI;

  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly entityService: EntityService,
    private readonly resourceService: ResourceService,

    configService: ConfigService
  ) {
    this.logger.info("starting assistant service");

    this.openai = new OpenAI({
      apiKey: configService.get<string>(Env.CHAT_OPENAI_KEY),
    });

    this.assistantId = configService.get<string>(Env.CHAT_ASSISTANT_ID);
  }

  async processMessage(
    messageText: string,
    threadId: string,
    context: AssistantContext
  ): Promise<AssistantThread> {
    const openai = this.openai;

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageText,
    });

    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      assistant_id: this.assistantId,
      //do not expose the entire context as it may include sensitive information
      instructions: `${INSTRUCTIONS} +
        "the following context is available: " +
        ${JSON.stringify({
          workspaceId: context.workspaceId,
          projectId: context.projectId,
          serviceId: context.resourceId, //@TODO: check type? //we use service id implicitly to help the assistant differentiate between different resources
        })}`,
    });

    return this.handleRunStatus(run, threadId, context);
  }

  async handleRunStatus(
    run: Run,
    threadId: string,
    context: AssistantContext
  ): Promise<AssistantThread> {
    const openai = this.openai;

    const assistantThread = new AssistantThread();
    assistantThread.id = threadId;
    assistantThread.messages = [];

    this.logger.debug(`Run status: ${run.status}`);

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        run_id: run.id,
      });
      for (const message of messages.data.reverse()) {
        const textContentBlock = message.content[0] as TextContentBlock;
        assistantThread.messages.push({
          id: message.id,
          role:
            message.role === "user"
              ? EnumAssistantMessageRole.User
              : EnumAssistantMessageRole.Assistant,
          text: textContentBlock.text.value,
          createdAt: new Date(message.created_at),
        });
      }

      return assistantThread;
    } else if (run.status === "requires_action") {
      const requiredActions =
        run.required_action.submit_tool_outputs.tool_calls;

      const functionCalls = await Promise.all(
        requiredActions.map((action) => {
          const functionName = action.function.name;
          const params = action.function.arguments;

          return this.executeFunction(action.id, functionName, params, context);
        })
      );

      const innerRun = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        threadId,
        run.id,
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          tool_outputs: functionCalls.map((call) => ({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            tool_call_id: call.callId,
            output: call.results,
          })),
        }
      );

      return this.handleRunStatus(innerRun, threadId, context);
    } else {
      //@todo: handle other statuses
      this.logger.error(`Run status: ${run.status}. Error: ${run.last_error}`);

      assistantThread.messages.push({
        id: "none",
        role: EnumAssistantMessageRole.Assistant,
        text: run.last_error.message || "Sorry, I'm having trouble right now.",
        createdAt: new Date(),
      });
      return assistantThread;
    }
  }

  async executeFunction(
    callId: string,
    functionName: string,
    params: string,
    context: AssistantContext
  ): Promise<{
    callId: string;
    results: string;
  }> {
    this.logger.debug(
      `Executing function: ${functionName} with params: ${JSON.stringify(
        params
      )} and context: ${JSON.stringify(context)}`
    );

    const args = JSON.parse(params);

    if (this.assistantFunctions[functionName] !== undefined) {
      try {
        return {
          callId,
          results: JSON.stringify(
            await this.assistantFunctions[functionName].apply(null, [
              args,
              context,
            ])
          ),
        };
      } catch (error) {
        this.logger.error(`Error executing function: ${functionName}`);
        return {
          callId,
          results: JSON.stringify(error.message),
        };
      }
    } else {
      this.logger.error(`Function not found: ${functionName}`);
      return {
        callId,
        results: "Function not found",
      };
    }
  }

  private assistantFunctions: {
    [key in EnumAssistantFunctions]: (
      args: any,
      context: AssistantContext
    ) => any;
  } = {
    createEntity: async (
      args: { name: string; serviceId: string },
      context: AssistantContext
    ): Promise<any> => {
      const entity = await this.entityService.createOneEntity(
        {
          data: {
            displayName: args.name,
            pluralDisplayName: plural(args.name),
            name: camelCase(args.name),
            resource: {
              connect: {
                id: args.serviceId,
              },
            },
          },
        },
        context.user
      );
      return {
        link: `https://app.amplication.com/entities/${entity.id}`,
        result: entity,
      };
    },
    getProjectServices: async (
      args: { projectId: string },
      context: AssistantContext
    ) => {
      return this.resourceService.resources({
        where: {
          project: { id: args.projectId },
          resourceType: { equals: EnumResourceType.Service },
        },
      });
    },
    getServiceEntities: async (
      args: { serviceId: string },
      context: AssistantContext
    ) => {
      return this.entityService.entities({
        where: {
          resource: { id: args.serviceId },
        },
      });
    },
  };
}
