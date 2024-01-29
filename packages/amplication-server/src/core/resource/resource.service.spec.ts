import { Test, TestingModule } from "@nestjs/testing";
import cuid from "cuid";
import {
  INVALID_RESOURCE_ID,
  INVALID_DELETE_PROJECT_CONFIGURATION,
  ResourceService,
} from "./resource.service";
import { PrismaService, EnumResourceType, Prisma } from "../../prisma";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumDataType } from "../../enums/EnumDataType";
import { QueryMode } from "../../enums/QueryMode";
import {
  Account,
  BlockVersion,
  Commit,
  EntityVersion,
  Project,
  GitRepository,
  GitOrganization,
} from "../../models";
import { Block } from "../../models/Block";
import { Entity } from "../../models/Entity";
import { EntityField } from "../../models/EntityField";
import { Resource } from "../../models/Resource";
import { User } from "../../models/User";
import { prepareDeletedItemName } from "../../util/softDelete";
import { BlockService } from "../block/block.service";
import { BuildService } from "../build/build.service";
import { Build } from "../build/dto/Build";
import { CURRENT_VERSION_NUMBER, USER_ENTITY_NAME } from "../entity/constants";
import { EntityService } from "../entity/entity.service";
import { Environment } from "../environment/dto/Environment";
import {
  DEFAULT_ENVIRONMENT_NAME,
  EnvironmentService,
} from "../environment/environment.service";
import {
  EnumPendingChangeAction,
  EnumPendingChangeOriginType,
  ResourceCreateInput,
  ResourceCreateWithEntitiesResult,
} from "./dto";
import { PendingChange } from "./dto/PendingChange";
import { ReservedEntityNameError } from "./ReservedEntityNameError";
import { ServiceSettings } from "../serviceSettings/dto";
import { EnumAuthProviderType } from "../serviceSettings/dto/EnumAuthenticationProviderType";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { DEFAULT_RESOURCE_COLORS } from "./constants";
import { ProjectConfigurationSettingsService } from "../projectConfigurationSettings/projectConfigurationSettings.service";
import { ProjectService } from "../project/project.service";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { TopicService } from "../topic/topic.service";
import { Topic } from "../topic/dto/Topic";
import { ConfigService } from "@nestjs/config";
import { BillingService } from "../billing/billing.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ServiceTopics } from "../serviceTopics/dto/ServiceTopics";
import { DeleteTopicArgs } from "../topic/dto/DeleteTopicArgs";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ServiceSettingsUpdateInput } from "../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ConnectGitRepositoryInput } from "../git/dto/inputs/ConnectGitRepositoryInput";
import { MeteredEntitlement } from "@stigg/node-server-sdk";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { BillingFeature } from "@amplication/util-billing-types";
import { SubscriptionService } from "../subscription/subscription.service";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

const EXAMPLE_MESSAGE = "exampleMessage";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_PROJECT_CONFIGURATION_RESOURCE_ID =
  "exampleProjectConfigurationResourceId";
const EXAMPLE_PROJECT_ID = "exampleProjectId";
const EXAMPLE_PROJECT_NAME = "exampleProjectName";
const EXAMPLE_RESOURCE_NAME = "exampleResourceName";
const EXAMPLE_RESOURCE_DESCRIPTION = "exampleResourceName";

const EXAMPLE_CUID = "EXAMPLE_CUID";

const EXAMPLE_BUILD_ID = "ExampleBuildId";
const EXAMPLE_WORKSPACE_ID = "ExampleWorkspaceId";

const EXAMPLE_GIT_REPOSITORY_INPUT: ConnectGitRepositoryInput = {
  name: "exampleGitRepositoryInput",
  resourceId: "",
  gitOrganizationId: "ExampleGitOrganizationId",
};

const EXAMPLE_SERVICE_SETTINGS: ServiceSettingsUpdateInput = {
  authProvider: EnumAuthProviderType.Jwt,
  adminUISettings: { generateAdminUI: true, adminUIPath: "" },
  serverSettings: {
    generateGraphQL: true,
    generateRestApi: true,
    serverPath: "",
  },
};

const EXAMPLE_GIT_ORGANISATION: GitOrganization = {
  id: "",
  provider: "Github",
  name: "",
  installationId: "",
  createdAt: undefined,
  updatedAt: undefined,
  type: "User",
  useGroupingForRepositories: false,
  providerProperties: "",
};
const EXAMPLE_GIT_REPOSITORY: GitRepository = {
  id: "exampleGitRepositoryId",
  name: "repositoryTest",
  gitOrganizationId: "exampleGitOrganizationId",
  createdAt: new Date(),
  updatedAt: new Date(),
  gitOrganization: EXAMPLE_GIT_ORGANISATION,
  groupName: "",
};

const SAMPLE_SERVICE_DATA: ResourceCreateInput = {
  description: "Sample Service for task management",
  name: "My sample service",
  resourceType: EnumResourceType.Service,
  project: { connect: { id: EXAMPLE_PROJECT_ID } },
  serviceSettings: EXAMPLE_SERVICE_SETTINGS,
  gitRepository: EXAMPLE_GIT_REPOSITORY_INPUT,
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_RESOURCE_NAME,
  description: EXAMPLE_RESOURCE_DESCRIPTION,
  deletedAt: null,
  licensed: true,
  gitRepositoryOverride: false,
  project: {
    workspaceId: EXAMPLE_WORKSPACE_ID,
  } as unknown as Project,
  builds: [
    {
      id: EXAMPLE_BUILD_ID,
      createdAt: new Date(),
      userId: "exampleUserId",
      resourceId: EXAMPLE_RESOURCE_ID,
      version: "1.0.0",
      message: "new build",
      actionId: "ExampleActionId",
      commitId: "exampleCommitId",
    },
  ],
  gitRepository: EXAMPLE_GIT_REPOSITORY,
};

const EXAMPLE_RESOURCE_MESSAGE_BROKER: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.MessageBroker,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_RESOURCE_NAME,
  description: EXAMPLE_RESOURCE_DESCRIPTION,
  deletedAt: null,
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_PROJECT_CONFIGURATION_RESOURCE: Resource = {
  id: EXAMPLE_PROJECT_CONFIGURATION_RESOURCE_ID,
  resourceType: EnumResourceType.ProjectConfiguration,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_RESOURCE_NAME,
  description: EXAMPLE_RESOURCE_DESCRIPTION,
  deletedAt: null,
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_PROJECT: Project = {
  id: EXAMPLE_PROJECT_ID,
  name: EXAMPLE_PROJECT_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspaceId: EXAMPLE_WORKSPACE_ID,
  useDemoRepo: false,
  demoRepoName: undefined,
  licensed: true,
};

const EXAMPLE_USER_ID = "exampleUserId";

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  previewAccountType: EnumPreviewAccountType.None,
  previewAccountEmail: null,
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "example_workspace_name",
  },
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const EXAMPLE_ENTITY_ID = "exampleEntityId";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_DISPLAY_NAME = "Example Entity Name";
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = "Example Entity Names";
const EXAMPLE_CUSTOM_ATTRIBUTES = "ExampleCustomAttributes";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";

const EXAMPLE_BLOCK_ID = "exampleBlockId";
const EXAMPLE_BLOCK_DISPLAY_NAME = "Example Entity Name";

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME,
  customAttributes: EXAMPLE_CUSTOM_ATTRIBUTES,
};

const EXAMPLE_BLOCK: Block = {
  id: EXAMPLE_BLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  displayName: EXAMPLE_BLOCK_DISPLAY_NAME,
  blockType: EnumBlockType.ServiceSettings,
  parentBlock: null,
  versionNumber: CURRENT_VERSION_NUMBER,
  description: "example block description",
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  description: "SampleEntityDescription",
  displayName: "SampleEntityFieldDisplayName",
  permanentId: "SampleFieldPermanentId",
  properties: {},
  required: false,
  unique: false,
  searchable: false,
  customAttributes: "ExampleCustomAttributes",
};

const EXAMPLE_CHANGED_ENTITY: PendingChange = {
  originId: EXAMPLE_ENTITY_ID,
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Entity,
  versionNumber: 1,
  origin: EXAMPLE_ENTITY,
  resource: EXAMPLE_RESOURCE,
};

const EXAMPLE_CHANGED_BLOCK: PendingChange = {
  originId: EXAMPLE_BLOCK_ID,
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Block,
  versionNumber: 1,
  origin: EXAMPLE_BLOCK,
  resource: EXAMPLE_RESOURCE,
};

const EXAMPLE_ENTITY_VERSION_ID = "exampleEntityVersionId";
const EXAMPLE_BLOCK_VERSION_ID = "exampleBlockVersionId";
const EXAMPLE_VERSION_NUMBER = 0;

const EXAMPLE_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: EXAMPLE_ENTITY_ID,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME,
  customAttributes: EXAMPLE_CUSTOM_ATTRIBUTES,
};

const EXAMPLE_BLOCK_VERSION: BlockVersion = {
  id: EXAMPLE_BLOCK_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  versionNumber: EXAMPLE_VERSION_NUMBER,
  displayName: EXAMPLE_BLOCK_DISPLAY_NAME,
};

const EXAMPLE_COMMIT_ID = "exampleCommitId";

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: "ExampleEnvironmentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  address: "ExampleEnvironmentAddress",
  name: DEFAULT_ENVIRONMENT_NAME,
  resourceId: EXAMPLE_RESOURCE_ID,
  description: "ExampleEnvironmentDescription",
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: "1.0.0",
  message: "new build",
  actionId: "ExampleActionId",
  commitId: EXAMPLE_COMMIT_ID,
};

const EXAMPLE_APP_SETTINGS: ServiceSettings = {
  resourceId: EXAMPLE_RESOURCE_ID,
  authProvider: EnumAuthProviderType.Http,
  adminUISettings: undefined,
  serverSettings: undefined,
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  parentBlock: new Block(),
  displayName: "exampleDisplayName",
  description: "exampleDescription",
  blockType: EnumBlockType.ServiceSettings,
  versionNumber: 0,
  inputParameters: [],
  outputParameters: [],
  authEntityName: USER_ENTITY_NAME,
};

const EXAMPLE_CREATE_RESOURCE_RESULTS: ResourceCreateWithEntitiesResult = {
  resource: EXAMPLE_RESOURCE,
  build: EXAMPLE_BUILD,
};

const EXAMPLE_TOPIC: Topic = {
  displayName: "exampleTopicDisplayName",
  name: "exampleTopicName",
  description: "exampleTopicDescription",
  id: "",
  createdAt: undefined,
  updatedAt: undefined,
  parentBlock: new Block(),
  blockType: EnumBlockType.Topic,
  versionNumber: 0,
  inputParameters: [],
  outputParameters: [],
};

const serviceSettingsCreateMock = jest.fn(() => {
  return EXAMPLE_APP_SETTINGS;
});

const defaultTopicCreateMock = jest.fn(() => {
  return EXAMPLE_TOPIC;
});

const topicFindManyMock = jest.fn(() => {
  return [EXAMPLE_TOPIC];
});

const topicDeleteMock = jest.fn();

const serviceTopicsDeleteServiceTopicMock = jest.fn();

const prismaResourceCreateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});

const prismaResourceFindOneMock = jest.fn(
  (args: Prisma.ResourceFindUniqueArgs) => {
    if (args.where.id === EXAMPLE_PROJECT_CONFIGURATION_RESOURCE_ID) {
      return EXAMPLE_PROJECT_CONFIGURATION_RESOURCE;
    } else {
      return EXAMPLE_RESOURCE;
    }
  }
);

const billingServiceGetMeteredEntitlementMock = jest.fn(() => {
  return {
    usageLimit: undefined,
    hasAccess: true,
  } as unknown as MeteredEntitlement;
});
const billingServiceIsBillingEnabledMock = jest.fn();
const prismaResourceFindManyMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE];
});
const prismaResourceDeleteMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceUpdateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});

const prismaCommitCreateMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});
const prismaResourceRoleCreateMock = jest.fn(() => {
  return null;
});

const prismaGitRepositoryCreateMock = jest.fn(() => {
  return EXAMPLE_GIT_REPOSITORY;
});

const entityServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_ENTITY_VERSION
);

const entityServiceCreateOneEntityMock = jest.fn(async () => {
  return EXAMPLE_ENTITY;
});

const entityServiceCreateFieldByDisplayNameMock = jest.fn(
  async () => EXAMPLE_ENTITY_FIELD
);
const entityServiceReleaseLockMock = jest.fn(async () => EXAMPLE_ENTITY);

const entityServiceGetChangedEntitiesMock = jest.fn(() => {
  return [EXAMPLE_CHANGED_ENTITY];
});

const blockServiceGetChangedBlocksMock = jest.fn(() => {
  return [EXAMPLE_CHANGED_BLOCK];
});
const blockServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_BLOCK_VERSION
);

const blockServiceReleaseLockMock = jest.fn(async () => EXAMPLE_BLOCK);

const USER_ENTITY_MOCK = {
  id: "USER_ENTITY_MOCK_ID",
};

const entityServiceCreateDefaultEntitiesMock = jest.fn();
const entityServiceFindFirstMock = jest.fn(() => USER_ENTITY_MOCK);
const entityServiceBulkCreateEntities = jest.fn();
const entityServiceBulkCreateFields = jest.fn();
const analyticServiceTrack = jest.fn();

const mockedUpdateServiceLicensed = jest.fn();

const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);

const environmentServiceCreateDefaultEnvironmentMock = jest.fn(() => {
  return EXAMPLE_ENVIRONMENT;
});

const projectServiceFindUniqueMock = jest.fn(() => ({
  ...EXAMPLE_PROJECT,
  resources: [EXAMPLE_RESOURCE, EXAMPLE_PROJECT_CONFIGURATION_RESOURCE],
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
  },
}));

const prismaTransactionMock = jest.fn(() => [
  EXAMPLE_RESOURCE,
  EXAMPLE_PROJECT_CONFIGURATION_RESOURCE,
]);

jest.mock("cuid");
// eslint-disable-next-line
// @ts-ignore
cuid.mockImplementation(() => EXAMPLE_CUID);

describe("ResourceService", () => {
  let service: ResourceService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: ConfigService,
          useValue: { get: () => "" },
        },
        {
          provide: PluginInstallationService,
          useValue: { get: () => "" },
          useClass: jest.fn(() => ({
            create: jest.fn(),
          })),
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            track: analyticServiceTrack,
          })),
        },
        {
          provide: SubscriptionService,
          useClass: jest.fn(() => ({
            updateServiceLicensed: mockedUpdateServiceLicensed,
          })),
        },
        {
          provide: BillingService,
          useValue: {
            isBillingEnabled: billingServiceIsBillingEnabledMock,
            getMeteredEntitlement: billingServiceGetMeteredEntitlementMock,
            getNumericEntitlement: jest.fn(() => {
              return {};
            }),
            reportUsage: jest.fn(() => {
              return {};
            }),
          },
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock,
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            resource: {
              create: prismaResourceCreateMock,
              findFirst: prismaResourceFindOneMock,
              findUnique: prismaResourceFindOneMock,
              findMany: prismaResourceFindManyMock,
              delete: prismaResourceDeleteMock,
              update: prismaResourceUpdateMock,
            },
            entity: {
              findMany: prismaEntityFindManyMock,
            },
            commit: {
              create: prismaCommitCreateMock,
            },
            gitRepository: {
              findUnique: prismaGitRepositoryCreateMock,
              delete: prismaGitRepositoryCreateMock,
              create: prismaGitRepositoryCreateMock,
            },
            resourceRole: {
              create: prismaResourceRoleCreateMock,
            },
            $transaction: prismaTransactionMock,
          })),
        },
        {
          provide: EntityService,
          useClass: jest.fn().mockImplementation(() => ({
            createVersion: entityServiceCreateVersionMock,
            createFieldByDisplayName: entityServiceCreateFieldByDisplayNameMock,
            createOneEntity: entityServiceCreateOneEntityMock,
            releaseLock: entityServiceReleaseLockMock,
            createDefaultEntities: entityServiceCreateDefaultEntitiesMock,
            getChangedEntities: entityServiceGetChangedEntitiesMock,
            findFirst: entityServiceFindFirstMock,
            bulkCreateEntities: entityServiceBulkCreateEntities,
            bulkCreateFields: entityServiceBulkCreateFields,
          })),
        },
        {
          provide: "GitHub",
          useValue: {},
        },
        {
          provide: BlockService,
          useValue: {
            getChangedBlocks: blockServiceGetChangedBlocksMock,
            createVersion: blockServiceCreateVersionMock,
            releaseLock: blockServiceReleaseLockMock,
          },
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn().mockImplementation(() => ({
            createDefaultEnvironment:
              environmentServiceCreateDefaultEnvironmentMock,
          })),
        },
        {
          provide: ServiceSettingsService,
          useClass: jest.fn(() => ({
            create: serviceSettingsCreateMock,
            createDefaultServiceSettings: serviceSettingsCreateMock,
            updateServiceSettings: serviceSettingsCreateMock,
          })),
        },
        {
          provide: TopicService,
          useClass: jest.fn(() => ({
            create: defaultTopicCreateMock,
            findMany: topicFindManyMock,
            delete: topicDeleteMock,
          })),
        },
        {
          provide: ServiceTopicsService,
          useClass: jest.fn(() => ({
            deleteTopicFromAllServices: jest.fn(),
            deleteServiceTopic: serviceTopicsDeleteServiceTopicMock,
          })),
        },
        {
          provide: ProjectConfigurationSettingsService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ProjectService,
          useClass: jest.fn(() => ({
            findUnique: projectServiceFindUniqueMock,
            commit: projectServiceFindUniqueMock,
          })),
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a resource", async () => {
    const createResourceArgs = {
      args: {
        data: {
          name: EXAMPLE_RESOURCE_NAME,
          description: EXAMPLE_RESOURCE_DESCRIPTION,
          color: DEFAULT_RESOURCE_COLORS.service,
          resourceType: EnumResourceType.Service,
          wizardType: "create resource",
          project: {
            connect: {
              id: EXAMPLE_PROJECT_ID,
            },
          },
          serviceSettings: EXAMPLE_SERVICE_SETTINGS,
          gitRepository: EXAMPLE_GIT_REPOSITORY_INPUT,
        },
      },
      user: EXAMPLE_USER,
    };
    expect(
      await service.createService(
        createResourceArgs.args,
        createResourceArgs.user,
        null,
        true
      )
    ).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledWith(
      EXAMPLE_RESOURCE_ID,
      EXAMPLE_USER
    );

    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledTimes(1);
    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledWith(
      EXAMPLE_RESOURCE_ID
    );
  });

  describe("createPreviewService", () => {
    it("should create a preview service", async () => {
      const createResourceArgs = {
        args: {
          data: {
            name: EXAMPLE_RESOURCE_NAME,
            description: EXAMPLE_RESOURCE_DESCRIPTION,
            color: DEFAULT_RESOURCE_COLORS.service,
            resourceType: EnumResourceType.Service,
            wizardType: "create resource",
            project: {
              connect: {
                id: EXAMPLE_PROJECT_ID,
              },
            },
            serviceSettings: EXAMPLE_SERVICE_SETTINGS,
            gitRepository: EXAMPLE_GIT_REPOSITORY_INPUT,
          },
        },
        user: EXAMPLE_USER,
      };
      const user = EXAMPLE_USER;
      const nonDefaultPluginsToInstall = [];
      const requireAuthenticationEntity = true;

      const result = await service.createPreviewService({
        args: createResourceArgs.args,
        user,
        nonDefaultPluginsToInstall,
        requireAuthenticationEntity,
      });

      expect(result).toEqual(EXAMPLE_RESOURCE);
      expect(prismaResourceCreateMock).toBeCalledTimes(1);
      expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledTimes(1);
      expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledWith(
        EXAMPLE_RESOURCE_ID
      );
    });
  });

  it("should throw an error while trying to create a service when the user exceeded the limit of services in his project", async () => {
    const createResourceArgs = {
      args: {
        data: {
          name: EXAMPLE_RESOURCE_NAME,
          description: EXAMPLE_RESOURCE_DESCRIPTION,
          color: DEFAULT_RESOURCE_COLORS.service,
          resourceType: EnumResourceType.Service,
          wizardType: "create resource",
          project: {
            connect: {
              id: EXAMPLE_PROJECT_ID,
            },
          },
          serviceSettings: EXAMPLE_SERVICE_SETTINGS,
          gitRepository: EXAMPLE_GIT_REPOSITORY_INPUT,
        },
      },
      user: EXAMPLE_USER,
    };
    billingServiceGetMeteredEntitlementMock.mockReturnValueOnce({
      usageLimit: 1,
      hasAccess: false,
    } as unknown as MeteredEntitlement);
    billingServiceIsBillingEnabledMock.mockReturnValueOnce(true);

    await expect(
      service.createService(
        createResourceArgs.args,
        createResourceArgs.user,
        null,
        true
      )
    ).rejects.toThrow(
      new BillingLimitationError(
        "Your project exceeds its services limitation.",
        BillingFeature.Services
      )
    );
    expect(prismaResourceCreateMock).toBeCalledTimes(0);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledTimes(0);
  });

  it("should fail to create resource with entities with a reserved name", async () => {
    await expect(
      service.createServiceWithEntities(
        {
          resource: SAMPLE_SERVICE_DATA,
          commitMessage: "commitMessage",
          entities: [
            {
              name: USER_ENTITY_NAME,
              fields: [
                {
                  name: EXAMPLE_ENTITY_FIELD_NAME,
                },
              ],
            },
          ],
          wizardType: "onboarding",
          dbType: "postgres",
          repoType: "Mono",
          authType: "Jwt",
          plugins: {
            plugins: [
              {
                id: "clb3p3uxx009bjn01zfbim7p1",
                displayName: "jwtAuth",
                npm: "@amplication/plugin-auth-jwt",
                enabled: true,
                version: "latest",
                pluginId: "auth-jwt",
                settings: {},
                configurations: {},
                resource: { connect: { id: "" } },
              },
            ],
          },
          connectToDemoRepo: false,
        },

        EXAMPLE_USER
      )
    ).rejects.toThrow(new ReservedEntityNameError(USER_ENTITY_NAME));
  });

  it("should create resource with entities", async () => {
    const commitMessage = "CreateWithEntitiesCommitMessage";
    const createOneEntityArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
        name: EXAMPLE_ENTITY_NAME,
        pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME,
      },
    };
    const createFieldByDisplayNameArgs = {
      data: {
        entity: {
          connect: {
            id: EXAMPLE_ENTITY_ID,
          },
        },
        displayName: EXAMPLE_ENTITY_FIELD_NAME,
      },
    };
    await expect(
      service.createServiceWithEntities(
        {
          resource: SAMPLE_SERVICE_DATA,
          commitMessage: commitMessage,
          entities: [
            {
              name: EXAMPLE_ENTITY_DISPLAY_NAME,
              fields: [
                {
                  name: EXAMPLE_ENTITY_FIELD_NAME,
                },
              ],
            },
          ],
          wizardType: "onboarding",
          dbType: "postgres",
          repoType: "Mono",
          authType: "Jwt",
          connectToDemoRepo: false,
        },

        EXAMPLE_USER
      )
    ).resolves.toEqual(EXAMPLE_CREATE_RESOURCE_RESULTS);
    expect(prismaResourceCreateMock).toBeCalledTimes(1);

    expect(prismaResourceFindManyMock).toBeCalledTimes(1);
    expect(prismaResourceFindManyMock.mock.calls).toEqual([
      [
        {
          where: {
            deletedAt: null,
            archived: {
              not: true,
            },
            name: {
              mode: QueryMode.Insensitive,
              startsWith: SAMPLE_SERVICE_DATA.name.toLowerCase(),
            },
            projectId: EXAMPLE_PROJECT_ID,
          },
          select: {
            name: true,
          },
        },
      ],
    ]);

    expect(entityServiceCreateOneEntityMock).toBeCalledTimes(1);
    expect(entityServiceCreateOneEntityMock).toBeCalledWith(
      createOneEntityArgs,
      EXAMPLE_USER
    );

    expect(entityServiceCreateFieldByDisplayNameMock).toBeCalledTimes(1);
    expect(entityServiceCreateFieldByDisplayNameMock).toBeCalledWith(
      createFieldByDisplayNameArgs,
      EXAMPLE_USER
    );
  });

  it("should find a resource", async () => {
    const args = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
        archived: {
          not: true,
        },
      },
    };
    expect(await service.resource(args)).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceFindOneMock).toBeCalledTimes(1);
    expect(prismaResourceFindOneMock).toBeCalledWith(args);
  });

  it("should find many resources", async () => {
    const args = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
        archived: {
          not: true,
        },
      },
    };
    expect(await service.resources(args)).toEqual([EXAMPLE_RESOURCE]);
    expect(prismaResourceFindManyMock).toBeCalledTimes(1);
    expect(prismaResourceFindManyMock).toBeCalledWith(args);
  });

  it("should delete a resource", async () => {
    const args = { where: { id: EXAMPLE_RESOURCE_ID } };
    const dateSpy = jest.spyOn(global, "Date");
    expect(await service.deleteResource(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_RESOURCE
    );
    expect(mockedUpdateServiceLicensed).toBeCalledTimes(1);
    expect(mockedUpdateServiceLicensed).toBeCalledWith(EXAMPLE_WORKSPACE_ID);
    expect(prismaResourceUpdateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(
          EXAMPLE_RESOURCE.name,
          EXAMPLE_RESOURCE.id
        ),
        gitRepository: {
          disconnect: true,
        },
      },
    });
  });

  it("should not delete a resource of Project configuration", async () => {
    const args = { where: { id: EXAMPLE_PROJECT_CONFIGURATION_RESOURCE_ID } };
    await expect(service.deleteResource(args, EXAMPLE_USER)).rejects.toThrow(
      new Error(INVALID_DELETE_PROJECT_CONFIGURATION)
    );
  });

  it("should archive resources of a project", async () => {
    const args = { where: { id: EXAMPLE_PROJECT_ID } };
    expect(await service.archiveProjectResources(args.where.id)).toEqual(
      expect.arrayContaining([
        EXAMPLE_RESOURCE,
        EXAMPLE_PROJECT_CONFIGURATION_RESOURCE,
      ])
    );
    expect(prismaResourceUpdateMock).toBeCalledTimes(2);
    expect(prismaResourceUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE.id },
      data: {
        archived: true,
        name: prepareDeletedItemName(
          EXAMPLE_RESOURCE.name,
          EXAMPLE_RESOURCE.id
        ),
      },
    });
  });

  it("should update a resource", async () => {
    const args = {
      data: { name: EXAMPLE_RESOURCE_NAME },
      where: { id: EXAMPLE_RESOURCE_ID },
    };
    expect(await service.updateResource(args)).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceUpdateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledWith(args);
  });
  describe("when a resource is type of MessageBroker", () => {
    const EXAMPLE_SERVICE_TOPICS: ServiceTopics = {
      displayName: "exampleTopicDisplayName",
      description: "exampleTopicDescription",
      id: "",
      createdAt: undefined,
      updatedAt: undefined,
      parentBlock: new Block(),
      blockType: EnumBlockType.ServiceTopics,
      versionNumber: 0,
      inputParameters: [],
      outputParameters: [],
      messageBrokerId: EXAMPLE_RESOURCE_MESSAGE_BROKER.id,
      enabled: true,
      patterns: [],
    };

    const ANOTHER_TOPIC = {
      id: "another",
    } as Topic;

    beforeEach(() => {
      serviceTopicsDeleteServiceTopicMock.mockImplementation(() => {
        return [EXAMPLE_SERVICE_TOPICS];
      });
      prismaResourceFindOneMock.mockImplementation(
        () => EXAMPLE_RESOURCE_MESSAGE_BROKER
      );

      topicFindManyMock.mockImplementation(() => {
        return [EXAMPLE_TOPIC, ANOTHER_TOPIC];
      });
      topicDeleteMock.mockImplementation((args: DeleteTopicArgs) => {
        switch (args.where.id) {
          case "another":
            return ANOTHER_TOPIC;
          default:
            return EXAMPLE_TOPIC;
        }
      });
    });

    it("should delete the message broker resource and the relative topic and connections from services that use that broker", async () => {
      const args = { where: { id: EXAMPLE_RESOURCE_ID } };
      const dateSpy = jest.spyOn(global, "Date");
      expect(await service.deleteResource(args, EXAMPLE_USER)).toEqual(
        EXAMPLE_RESOURCE_MESSAGE_BROKER
      );
      expect(prismaResourceUpdateMock).toBeCalledTimes(1);
      expect(prismaResourceUpdateMock).toBeCalledWith({
        ...args,
        data: {
          deletedAt: dateSpy.mock.instances[0],
          name: prepareDeletedItemName(
            EXAMPLE_RESOURCE.name,
            EXAMPLE_RESOURCE.id
          ),
          gitRepository: {
            disconnect: true,
          },
        },
      });

      expect(topicFindManyMock).toHaveBeenCalledWith({
        where: {
          resource: {
            id: EXAMPLE_RESOURCE_MESSAGE_BROKER.id,
          },
        },
      });

      expect(topicDeleteMock).toHaveBeenCalledTimes(2);
      expect(topicDeleteMock).toHaveBeenCalledWith(
        {
          where: expect.objectContaining({
            id: EXAMPLE_TOPIC.id || ANOTHER_TOPIC.id,
          }),
        },
        EXAMPLE_USER
      );

      expect(serviceTopicsDeleteServiceTopicMock).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_MESSAGE_BROKER.id,
        EXAMPLE_USER
      );
    });
  });

  describe("deleted resources", () => {
    beforeEach(() => {
      EXAMPLE_RESOURCE.deletedAt = new Date();
      prismaResourceFindOneMock.mockImplementationOnce(() => {
        throw new Error(INVALID_RESOURCE_ID);
      });
    });
    afterEach(() => {
      EXAMPLE_RESOURCE.deletedAt = null;
    });

    it("should fail to fetch a deleted resource", async () => {
      const args = { where: { id: EXAMPLE_RESOURCE_ID } };
      await expect(service.resource(args)).rejects.toThrow(
        new Error(INVALID_RESOURCE_ID)
      );
    });

    it("should fail to update a deleted resource", async () => {
      const args = {
        data: { name: EXAMPLE_RESOURCE_NAME },
        where: { id: EXAMPLE_RESOURCE_ID },
      };
      await expect(service.updateResource(args)).rejects.toThrow(
        new Error(INVALID_RESOURCE_ID)
      );
    });
  });
});
