import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AssistantService, MESSAGE_UPDATED_EVENT } from "./assistant.service";
import { BillingService } from "../billing/billing.service";

import { PluginCatalogService } from "../pluginCatalog/pluginCatalog.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { ResourceService } from "../resource/resource.service";
import { EntityService } from "../entity/entity.service";
import { ModuleService } from "../module/module.service";
import { ProjectService } from "../project/project.service";
import { GraphqlSubscriptionPubSubKafkaService } from "./graphqlSubscriptionPubSubKafka.service";
import { Env } from "../../env";
import { billingServiceMock } from "../billing/billing.service.mock";
import { AssistantContext } from "./dto/AssistantContext";
import { AmplicationError } from "../../errors/AmplicationError";

const EXAMPLE_CHAT_OPENAI_KEY = "EXAMPLE_CHAT_OPENAI_KEY";

const EXAMPLE_ASSISTANT_CONTEXT: AssistantContext = {
  user: {
    workspace: {
      allowLLMFeatures: true,
      id: "EXAMPLE_WORKSPACE_ID",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "",
    },
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: true,
  },
  workspaceId: "EXAMPLE_WORKSPACE_ID",
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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AssistantService,
        {
          provide: BillingService,
          useValue: billingServiceMock,
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
          provide: EntityService,
          useValue: {},
        },
        {
          provide: ResourceService,
          useValue: {},
        },
        {
          provide: ModuleService,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: {},
        },
        {
          provide: PluginCatalogService,
          useValue: {},
        },
        {
          provide: ModuleActionService,
          useValue: {},
        },
        {
          provide: ModuleDtoService,
          useValue: {},
        },
        {
          provide: GraphqlSubscriptionPubSubKafkaService,
          useValue: mockGraphqlSubscriptionKafkaService,
        },
        {
          provide: PluginInstallationService,
          useValue: {},
        },

        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // Test to validate the error handling when AI features are disabled for a workspace
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

  // Test to ensure that the onMessageUpdated method correctly publishes messages
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
        id: "messageId",
        threadId,
        text: textDelta,
        snapshot,
        completed,
      })
    );
  });
});
