import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import {
  AssistantService,
  EnumAssistantFunctions,
  MESSAGE_UPDATED_EVENT,
  MessageLoggerContext,
} from "./assistant.service";
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
import { BillingFeature } from "@amplication/util-billing-types";
import { Entity } from "../../models";

const EXAMPLE_CHAT_OPENAI_KEY = "EXAMPLE_CHAT_OPENAI_KEY";
const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";
const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_RESOURCE_ID = "EXAMPLE_RESOURCE_ID";
const EXAMPLE_THREAD_ID = "EXAMPLE_THREAD_ID";
const EXAMPLE_USER_ID = "EXAMPLE_USER_ID";

const EXAMPLE_ENTITY: Entity = {
  id: "exampleEntityId",
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "exampleResourceId",
  name: "exampleName",
  displayName: "exampleDisplayName",
  pluralDisplayName: "examplePluralDisplayName",
  customAttributes: "exampleCustomAttributes",
  lockedByUserId: EXAMPLE_USER_ID,
};

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

const entityServiceCreateOneEntityMock = jest.fn(() => EXAMPLE_ENTITY);
const entityServiceCreateFieldByDisplayNameMock = jest.fn();
const projectServiceCreateProjectMock = jest.fn();
const resourceServiceCreateServiceWithDefaultSettingsMock = jest.fn();
const moduleServiceCreateMock = jest.fn();
const pluginInstallationServiceCreateMock = jest.fn(() => ({
  id: "examplePluginId",
}));
const pluginCatalogServiceGetPluginWithLatestVersionMock = jest.fn(() => ({
  id: "examplePluginId",
  pluginId: "examplePluginId",
  name: "exampleName",
  description: "exampleDescription",
  repo: "exampleRepo",
  npm: "exampleNpm",
  icon: "exampleIcon",
  github: "exampleGithub",
  website: "exampleWebsite",
  categories: ["exampleCategory1", "exampleCategory2"],
  type: "exampleType",
  taggedVersions: {},
  versions: [
    {
      id: "exampleVersionId",
      pluginId: "examplePluginId",
      deprecated: false,
      isLatest: true,
      version: "exampleVersion",
      settings: {},
      configurations: {},
    },
  ],
}));

const resourceServiceResourcesMock = jest.fn();
const moduleServiceFindManyMock = jest.fn();
const moduleDtoServiceCreateMock = jest.fn();
const moduleDtoServiceCreateEnumMock = jest.fn();
const moduleDtoServiceFindManyMock = jest.fn();

const moduleActionServiceCreateMock = jest.fn();
const projectServiceCommitMock = jest.fn();
const projectServiceGetPendingChangesMock = jest.fn();
const pluginCatalogServiceGetPluginsMock = jest.fn();
const moduleActionServiceFindManyMock = jest.fn();
const entityServiceEntitiesMock = jest.fn();
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
          useValue: {
            createOneEntity: entityServiceCreateOneEntityMock,
            createFieldByDisplayName: entityServiceCreateFieldByDisplayNameMock,
            entities: entityServiceEntitiesMock,
          },
        },
        {
          provide: ResourceService,
          useValue: {
            resources: resourceServiceResourcesMock,
            createServiceWithDefaultSettings:
              resourceServiceCreateServiceWithDefaultSettingsMock,
          },
        },
        {
          provide: ModuleService,
          useValue: {
            create: moduleServiceCreateMock,
            findMany: moduleServiceFindManyMock,
          },
        },
        {
          provide: ProjectService,
          useValue: {
            createProject: projectServiceCreateProjectMock,
            commit: projectServiceCommitMock,
            getPendingChanges: projectServiceGetPendingChangesMock,
          },
        },
        {
          provide: PluginCatalogService,
          useValue: {
            getPluginWithLatestVersion:
              pluginCatalogServiceGetPluginWithLatestVersionMock,
            getPlugins: pluginCatalogServiceGetPluginsMock,
          },
        },
        {
          provide: ModuleActionService,
          useValue: {
            create: moduleActionServiceCreateMock,
            findMany: moduleActionServiceFindManyMock,
          },
        },
        {
          provide: ModuleDtoService,
          useValue: {
            create: moduleDtoServiceCreateMock,
            createEnum: moduleDtoServiceCreateEnumMock,
            findMany: moduleDtoServiceFindManyMock,
          },
        },
        {
          provide: GraphqlSubscriptionPubSubKafkaService,
          useValue: mockGraphqlSubscriptionKafkaService,
        },
        {
          provide: PluginInstallationService,
          useValue: {
            create: pluginInstallationServiceCreateMock,
          },
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
        id: "messageId",
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

  const cases: Array<
    [
      EnumAssistantFunctions,
      { [key: string]: any },
      Array<{ mock: jest.Mock; times: number }>
    ]
  > = [
    [
      EnumAssistantFunctions.CreateEntity,
      {
        name: "value1",
        serviceId: "value2",
        fields: ["value3", "value4"],
      },
      [
        {
          mock: entityServiceCreateOneEntityMock,
          times: 1,
        },
        {
          mock: entityServiceCreateFieldByDisplayNameMock,
          times: 2,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateProject,
      { projectName: "New Project" },
      [
        {
          mock: projectServiceCreateProjectMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateService,
      {
        serviceName: "New Service",
        projectId: "proj123",
        adminUIPath: "/admin-ui",
        serverPath: "/server",
      },
      [
        {
          mock: resourceServiceCreateServiceWithDefaultSettingsMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModule,
      {
        moduleName: "New Module",
        moduleDescription: "Module Description",
        serviceId: "service123",
      },
      [
        {
          mock: moduleServiceCreateMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.InstallPlugins,
      {
        pluginIds: ["plugin1", "plugin2"],
        serviceId: "service123",
      },
      [
        {
          mock: pluginCatalogServiceGetPluginWithLatestVersionMock,
          times: 2,
        },
        {
          mock: pluginInstallationServiceCreateMock,
          times: 2,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetProjectServices,
      { projectId: "proj123" },
      [
        {
          mock: resourceServiceResourcesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetServiceEntities,
      { serviceId: "service123" },
      [
        {
          mock: entityServiceEntitiesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CommitProjectPendingChanges,
      { projectId: "proj123", commitMessage: "Initial commit" },
      [
        {
          mock: projectServiceCommitMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetProjectPendingChanges,
      { projectId: "proj123" },
      [
        {
          mock: projectServiceGetPendingChangesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetPlugins,
      {},
      [
        {
          mock: pluginCatalogServiceGetPluginsMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetServiceModules,
      { serviceId: "service123" },
      [
        {
          mock: moduleServiceFindManyMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleDto,
      {
        moduleId: "module123",
        serviceId: "service123",
        dtoName: "NewDTO",
        dtoDescription: "DTO Description",
        properties: [],
      },
      [
        {
          mock: moduleDtoServiceCreateMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleEnum,
      {
        moduleId: "module123",
        serviceId: "service123",
        enumName: "NewEnum",
        enumDescription: "Enum Description",
        members: [],
      },
      [
        {
          mock: moduleDtoServiceCreateEnumMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetModuleActions,
      {
        moduleId: "module123",
        serviceId: "service123",
      },
      [
        {
          mock: moduleActionServiceFindManyMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleAction,
      {
        moduleId: "module123",
        serviceId: "service123",
        actionName: "NewAction",
        actionDescription: "Action Description",
        gqlOperation: "QUERY",
        restVerb: "GET",
        path: "/new-action",
        inputType: {},
        outputType: {},
        restInputSource: "BODY",
        restInputParamsPropertyName: "params",
        restInputBodyPropertyName: "body",
        restInputQueryPropertyName: "query",
      },
      [
        {
          mock: moduleActionServiceCreateMock,
          times: 1,
        },
      ],
    ],
  ];

  it.each(cases)(
    "should execute function %s correctly",
    async (functionName, params, mocks) => {
      const loggerContext: MessageLoggerContext = {
        messageContext: {
          workspaceId: EXAMPLE_WORKSPACE_ID,
          projectId: EXAMPLE_PROJECT_ID,
          serviceId: EXAMPLE_RESOURCE_ID,
        },
        threadId: EXAMPLE_THREAD_ID,
        userId: EXAMPLE_USER_ID,
        role: "user",
      };

      await service.executeFunction(
        "callId",
        functionName,
        JSON.stringify(params),
        EXAMPLE_ASSISTANT_CONTEXT,
        loggerContext
      );

      mocks.forEach((mock) => {
        expect(mock.mock).toHaveBeenCalledTimes(mock.times);
      });
    }
  );
});
