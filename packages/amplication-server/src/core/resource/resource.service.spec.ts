import { BillingFeature } from "@amplication/util-billing-types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { MeteredEntitlement } from "@stigg/node-server-sdk";
import cuid from "cuid";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumDataType } from "../../enums/EnumDataType";
import { QueryMode } from "../../enums/QueryMode";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import {
  Account,
  BlockVersion,
  Commit,
  EntityVersion,
  GitOrganization,
  GitRepository,
  Project,
} from "../../models";
import { Block } from "../../models/Block";
import { Entity } from "../../models/Entity";
import { EntityField } from "../../models/EntityField";
import { Resource } from "../../models/Resource";
import { User } from "../../models/User";
import { EnumResourceType, Prisma, PrismaService } from "../../prisma";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { prepareDeletedItemName } from "../../util/softDelete";
import { ActionService } from "../action/action.service";
import { BillingService } from "../billing/billing.service";
import { BlockService } from "../block/block.service";
import { BuildService } from "../build/build.service";
import { Build } from "../build/dto/Build";
import { EnumBuildGitStatus } from "../build/dto/EnumBuildGitStatus";
import { EnumBuildStatus } from "../build/dto/EnumBuildStatus";
import { CustomPropertyService } from "../customProperty/customProperty.service";
import { CURRENT_VERSION_NUMBER, USER_ENTITY_NAME } from "../entity/constants";
import { EntityService } from "../entity/entity.service";
import { ConnectGitRepositoryInput } from "../git/dto/inputs/ConnectGitRepositoryInput";
import { GitProviderService } from "../git/git.provider.service";
import { EnumOwnershipType } from "../ownership/dto/Ownership";
import { OwnershipService } from "../ownership/ownership.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { ProjectConfigurationSettingsService } from "../projectConfigurationSettings/projectConfigurationSettings.service";
import { RelationService } from "../relation/relation.service";
import { ServiceSettings } from "../serviceSettings/dto";
import { EnumAuthProviderType } from "../serviceSettings/dto/EnumAuthenticationProviderType";
import { ServiceSettingsUpdateInput } from "../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ServiceTopics } from "../serviceTopics/dto/ServiceTopics";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { TemplateCodeEngineVersionService } from "../templateCodeEngineVersion/templateCodeEngineVersion.service";
import { DeleteTopicArgs } from "../topic/dto/DeleteTopicArgs";
import { Topic } from "../topic/dto/Topic";
import { TopicService } from "../topic/topic.service";
import { UserActionService } from "../userAction/userAction.service";
import { DEFAULT_RESOURCE_COLORS } from "./constants";
import {
  CodeGeneratorVersionStrategy,
  EnumPendingChangeAction,
  EnumPendingChangeOriginType,
  ResourceCreateInput,
  ResourceCreateWithEntitiesResult,
} from "./dto";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { PendingChange } from "./dto/PendingChange";
import { ReservedEntityNameError } from "./ReservedEntityNameError";
import {
  INVALID_DELETE_PROJECT_CONFIGURATION,
  INVALID_RESOURCE_ID,
  ResourceService,
} from "./resource.service";
import { ResourceTemplateVersionService } from "../resourceTemplateVersion/resourceTemplateVersion.service";

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
  codeGenerator: EnumCodeGenerator.NodeJs,
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
      status: EnumBuildStatus.Completed,
      gitStatus: EnumBuildGitStatus.Completed,
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
    allowLLMFeatures: true,
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

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: "1.0.0",
  message: "new build",
  actionId: "ExampleActionId",
  commitId: EXAMPLE_COMMIT_ID,
  status: EnumBuildStatus.Completed,
  gitStatus: EnumBuildGitStatus.Completed,
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
  name: USER_ENTITY_NAME,
};

const entityServiceCreateDefaultUserEntityMock = jest.fn(() => {
  return [USER_ENTITY_MOCK];
});
const entityServiceFindFirstMock = jest.fn(() => USER_ENTITY_MOCK);
const entityServiceBulkCreateEntities = jest.fn();
const entityServiceBulkCreateFields = jest.fn();

const mockedUpdateServiceLicensed = jest.fn();

const pluginInstallationServiceCreateMock = jest.fn();
const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);

const templateCodeEngineVersionServiceUpdateMock = jest.fn();

const projectServiceFindUniqueMock = jest.fn(() => ({
  ...EXAMPLE_PROJECT,
  resources: [EXAMPLE_RESOURCE, EXAMPLE_PROJECT_CONFIGURATION_RESOURCE],
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
  },
}));

const ownershipServiceGetOwnershipMock = jest.fn(() => ({
  id: "exampleOwnershipId",
  owner: EXAMPLE_USER,
  ownershipType: EnumOwnershipType.User,
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
            create: pluginInstallationServiceCreateMock,
          })),
        },
        MockedSegmentAnalyticsProvider(),
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
            getBooleanEntitlement: jest.fn(() => {
              return {
                hasAccess: true,
              };
            }),
            reportUsage: jest.fn(() => {
              return {};
            }),
          },
        },
        {
          provide: ResourceTemplateVersionService,
          useValue: {},
        },
        {
          provide: GitProviderService,
          useValue: {},
        },
        {
          provide: CustomPropertyService,
          useValue: {},
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock,
          })),
        },
        {
          provide: TemplateCodeEngineVersionService,
          useClass: jest.fn(() => ({
            update: templateCodeEngineVersionServiceUpdateMock,
            getCurrent: jest.fn(),
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
            createDefaultUserEntity: entityServiceCreateDefaultUserEntityMock,
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
        {
          provide: ActionService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: RelationService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: UserActionService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: OwnershipService,
          useClass: jest.fn(() => ({
            getOwnership: ownershipServiceGetOwnershipMock,
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
          codeGenerator: EnumCodeGenerator.NodeJs,
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
        false,
        true
      )
    ).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultUserEntityMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultUserEntityMock).toBeCalledWith(
      EXAMPLE_RESOURCE_ID,
      EXAMPLE_USER
    );
  });

  it("should create a repo on the project when creating a service with a repo and there is no repo on the project ", async () => {
    const createResourceArgs = {
      args: {
        data: {
          name: EXAMPLE_RESOURCE_NAME,
          description: EXAMPLE_RESOURCE_DESCRIPTION,
          color: DEFAULT_RESOURCE_COLORS.service,
          resourceType: EnumResourceType.Service,
          wizardType: "create resource",
          codeGenerator: EnumCodeGenerator.NodeJs,
          project: {
            connect: {
              id: EXAMPLE_PROJECT_ID,
            },
          },
          serviceSettings: EXAMPLE_SERVICE_SETTINGS,
          gitRepository: {
            ...EXAMPLE_GIT_REPOSITORY_INPUT,
            isOverrideGitRepository: false, //even if isOverride is false, it should create a repo on the project
          },
        },
      },
      user: EXAMPLE_USER,
    };

    jest.spyOn(service, "projectConfiguration").mockReturnValueOnce(
      Promise.resolve({
        ...EXAMPLE_PROJECT_CONFIGURATION_RESOURCE,

        gitRepository: null,
        gitRepositoryId: null,
      })
    );

    expect(
      await service.createService(
        createResourceArgs.args,
        createResourceArgs.user,
        false,
        true
      )
    ).toEqual(EXAMPLE_RESOURCE);

    expect(prismaGitRepositoryCreateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_PROJECT_CONFIGURATION_RESOURCE_ID },
      data: {
        gitRepository: {
          connect: {
            id: EXAMPLE_GIT_REPOSITORY.id,
          },
        },
      },
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
          codeGenerator: EnumCodeGenerator.NodeJs,
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
        "You have reached the maximum number of services allowed. To continue using additional services, please upgrade your plan.",
        BillingFeature.Services
      )
    );
    expect(prismaResourceCreateMock).toBeCalledTimes(0);
    expect(entityServiceCreateDefaultUserEntityMock).toBeCalledTimes(0);
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
    expect(await service.updateResource(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_RESOURCE
    );
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
      await expect(service.updateResource(args, EXAMPLE_USER)).rejects.toThrow(
        new Error(INVALID_RESOURCE_ID)
      );
    });
  });

  it("should create a service with default settings and install the default DB plugin", async () => {
    await service.createServiceWithDefaultSettings(
      EXAMPLE_RESOURCE_NAME,
      EXAMPLE_RESOURCE_DESCRIPTION,
      EXAMPLE_PROJECT_ID,
      EXAMPLE_USER,
      true
    );

    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(pluginInstallationServiceCreateMock).toBeCalledTimes(1);
  });

  it("should create a service with default settings without installing the default DB plugin", async () => {
    await service.createServiceWithDefaultSettings(
      EXAMPLE_RESOURCE_NAME,
      EXAMPLE_RESOURCE_DESCRIPTION,
      EXAMPLE_PROJECT_ID,
      EXAMPLE_USER,
      false
    );

    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(pluginInstallationServiceCreateMock).toBeCalledTimes(0);
  });

  it("should update the code engine version block when updating the code engine version, when the resource type is template", async () => {
    prismaResourceFindOneMock.mockImplementationOnce(() => {
      return {
        ...EXAMPLE_RESOURCE,
        resourceType: EnumResourceType.ServiceTemplate,
      };
    });

    const version = "1.0.0";
    const strategy: CodeGeneratorVersionStrategy =
      CodeGeneratorVersionStrategy.LatestMinor;

    await service.updateCodeGeneratorVersion(
      {
        where: { id: EXAMPLE_RESOURCE_ID },
        data: {
          codeGeneratorVersionOptions: {
            codeGeneratorVersion: version,
            codeGeneratorStrategy: strategy,
          },
        },
      },
      EXAMPLE_USER
    );

    expect(templateCodeEngineVersionServiceUpdateMock).toHaveBeenCalledTimes(1);
    expect(templateCodeEngineVersionServiceUpdateMock).toHaveBeenCalledWith(
      EXAMPLE_RESOURCE_ID,
      version,
      strategy,
      EXAMPLE_USER
    );
  });
});
