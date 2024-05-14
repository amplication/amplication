import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { BillingService } from "../billing/billing.service";
import { AssistantService, MESSAGE_UPDATED_EVENT } from "./assistant.service";

import { BillingFeature } from "@amplication/util-billing-types";
import { Env } from "../../env";
import { AmplicationError } from "../../errors/AmplicationError";
import { billingServiceMock } from "../billing/billing.service.mock";
import { AssistantContext } from "./dto/AssistantContext";
import { GraphqlSubscriptionPubSubKafkaService } from "./graphqlSubscriptionPubSubKafka.service";
import { AssistantFunctionsService } from "./assistantFunctions.service";

const EXAMPLE_CHAT_OPENAI_KEY = "EXAMPLE_CHAT_OPENAI_KEY";
const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";
const EXAMPLE_USER_ID = "EXAMPLE_USER_ID";

const EXAMPLE_ASSISTANT_CONTEXT: AssistantContext = {
  user: {
    workspace: {
      allowLLMFeatures: true,
      id: EXAMPLE_WORKSPACE_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "",
    },
    id: EXAMPLE_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: true,
  },
  workspaceId: EXAMPLE_WORKSPACE_ID,
};

const pubSubPublishMock = jest.fn();

const mockGraphqlSubscriptionKafkaService = {
  getPubSub: jest.fn(() => ({
    publish: pubSubPublishMock,
    asyncIterator: jest.fn(),
  })),
};

describe("AssistantService", () => {
  let service: AssistantService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AssistantService,
        {
          provide: BillingService,
          useValue: billingServiceMock,
        },
        {
          provide: AssistantFunctionsService,
          useValue: {
            executeFunction: jest.fn(),
          },
        },

        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.CHAT_OPENAI_KEY:
                  return EXAMPLE_CHAT_OPENAI_KEY;
                case Env.FEATURE_AI_ASSISTANT_ENABLED:
                  return "true";
                default:
                  return "";
              }
            },
          },
        },

        {
          provide: GraphqlSubscriptionPubSubKafkaService,
          useValue: mockGraphqlSubscriptionKafkaService,
        },

        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw an AmplicationError if AI-powered features are disabled for the workspace", async () => {
    const context = {
      ...EXAMPLE_ASSISTANT_CONTEXT,
      user: {
        ...EXAMPLE_ASSISTANT_CONTEXT.user,
        workspace: {
          ...EXAMPLE_ASSISTANT_CONTEXT.user.workspace,
          allowLLMFeatures: false,
        },
      },
    };

    await expect(service.validateAndReportUsage(context)).rejects.toThrow(
      new AmplicationError(
        "AI-powered features are disabled for this workspace"
      )
    );
  });

  it("should publish a message when onMessageUpdated is called", async () => {
    const threadId = "testThread123";
    const messageId = "message123";
    const textDelta = "Hello, this is a test message.";
    const snapshot = "Current text snapshot";
    const completed = false;

    await service.onMessageUpdated(
      threadId,
      messageId,
      textDelta,
      snapshot,
      completed
    );

    expect(pubSubPublishMock).toHaveBeenCalledWith(
      MESSAGE_UPDATED_EVENT,
      JSON.stringify({
        id: messageId,
        threadId,
        text: textDelta,
        snapshot,
        completed,
      })
    );
  });

  it("should check billing feature and report usage when AI features are enabled and billing is active", async () => {
    await service.validateAndReportUsage(EXAMPLE_ASSISTANT_CONTEXT);

    expect(billingServiceMock.getMeteredEntitlement).toHaveBeenCalledWith(
      EXAMPLE_ASSISTANT_CONTEXT.user.workspace.id,
      BillingFeature.JovuRequests
    );
    expect(billingServiceMock.reportUsage).toHaveBeenCalledWith(
      EXAMPLE_ASSISTANT_CONTEXT.user.workspace.id,
      BillingFeature.JovuRequests
    );
  });
});
