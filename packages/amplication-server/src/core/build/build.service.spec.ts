import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Commit, Resource, User } from "../../models";
import { ActionService } from "../action/action.service";
import {
  ActionStep,
  EnumActionLogLevel,
  EnumActionStepStatus,
} from "../action/dto";
import { CommitService } from "../commit/commit.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { BuildService } from "./build.service";
import { Build } from "./dto/Build";
import { EnumBuildGitStatus } from "./dto/EnumBuildGitStatus";
import { EnumBuildStatus } from "./dto/EnumBuildStatus";
import { EntityService } from "../entity/entity.service";
import { PrismaService } from "../../prisma";
import { ResourceRoleService } from "../resourceRole/resourceRole.service";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { TopicService } from "../topic/topic.service";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { ProjectConfigurationSettingsService } from "../projectConfigurationSettings/projectConfigurationSettings.service";
import { PackageService } from "../package/package.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ModuleService } from "../module/module.service";
import { BillingService } from "../billing/billing.service";
import { GitProviderService } from "../git/git.provider.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { PluginNotifyVersion } from "@amplication/schema-registry";
import { BuildPlugin } from "./dto/BuildPlugin";
import { PrivatePluginService } from "../privatePlugin/privatePlugin.service";
import { PluginInstallation } from "../pluginInstallation/dto/PluginInstallation";
import { EnumBlockType } from "@amplication/code-gen-types";
import { GitConnectionSettings } from "../git/dto/objects/GitConnectionSettings";
import { EnumGitProvider } from "@amplication/util/git";
import { PrivatePlugin } from "../privatePlugin/dto/PrivatePlugin";
import { PrivatePluginVersion } from "../privatePlugin/dto/PrivatePluginVersion";
import { ResourceSettingsService } from "../resourceSettings/resourceSettings.service";

const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_MESSAGE = "exampleMessage";

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
  account: {
    id: "exampleAccountId",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "exampleEmail",
    firstName: "exampleFirstName",
    lastName: "exampleLastName",
    password: "",
    previewAccountType: "None",
    previewAccountEmail: "",
  },
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: "exampleActionStepId",
  createdAt: new Date(),
  name: "exampleName",
  message: "exampleMessage",
  status: EnumActionStepStatus.Running,
};

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  userId: EXAMPLE_USER_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID,
  status: EnumBuildStatus.Completed,
  gitStatus: EnumBuildGitStatus.Completed,
  createdBy: EXAMPLE_USER,
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleName",
  description: "exampleDescription",
  builds: [EXAMPLE_BUILD],
  gitRepositoryOverride: false,
  licensed: true,
  project: {
    id: "exampleProjectId",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "exampleProjectName",
    description: "exampleProjectDescription",
    useDemoRepo: false,
    licensed: true,
    workspace: {
      id: "exampleWorkspaceId",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "exampleWorkspaceName",
      allowLLMFeatures: false,
    },
  },
};

EXAMPLE_BUILD.resource = EXAMPLE_RESOURCE;

const EXAMPLE_BUILD_PLUGIN: BuildPlugin = {
  id: "exampleBuildPluginId",
  createdAt: new Date(),
  buildId: EXAMPLE_BUILD_ID,
  requestedFullPackageName: "exampleRequestedFullPackageName",
  packageName: "examplePackageName",
  packageVersion: "examplePackageVersion",
};

const EXAMPLE_PRIVATE_PLUGIN_ID = "plugin-1";
const EXAMPLE_PRIVATE_PLUGIN_ID_2 = "plugin-2";

const EXAMPLE_PRIVATE_PLUGIN_VERSION: PrivatePluginVersion = {
  version: "0.0.1",
  enabled: true,
  settings: {},
  configurations: {},
  deprecated: false,
};

const EXAMPLE_PRIVATE_PLUGIN: PrivatePlugin = {
  pluginId: EXAMPLE_PRIVATE_PLUGIN_ID,
  enabled: true,
  codeGenerator: "DotNet",
  versions: [
    EXAMPLE_PRIVATE_PLUGIN_VERSION,
    {
      ...EXAMPLE_PRIVATE_PLUGIN_VERSION,
      version: "1.0.0",
    },
    {
      ...EXAMPLE_PRIVATE_PLUGIN_VERSION,
      version: "1.1.0",
    },
  ],
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  parentBlock: undefined,
  displayName: "examplePluginName",
  description: "",
  blockType: EnumBlockType.PrivatePlugin,
  versionNumber: 1,
  inputParameters: [],
  outputParameters: [],
};

const EXAMPLE_PRIVATE_PLUGIN_INSTALLATION: PluginInstallation = {
  id: "examplePluginId",
  createdAt: new Date(),
  pluginId: EXAMPLE_PRIVATE_PLUGIN_ID,
  version: "latest",
  isPrivate: true,
  enabled: false,
  npm: "",
  updatedAt: new Date(),
  parentBlock: undefined,
  displayName: "examplePluginName",
  description: "examplePluginDescription",
  blockType: EnumBlockType.PluginInstallation,
  versionNumber: 1,
  inputParameters: [],
  outputParameters: [],
};

const EXAMPLE_PRIVATE_PLUGIN_2 = {
  ...EXAMPLE_PRIVATE_PLUGIN,
  pluginId: EXAMPLE_PRIVATE_PLUGIN_ID_2,
};
const EXAMPLE_PRIVATE_PLUGIN_INSTALLATION_WITH_SPECIFIC_VERSION: PluginInstallation =
  {
    ...EXAMPLE_PRIVATE_PLUGIN_INSTALLATION,
    pluginId: EXAMPLE_PRIVATE_PLUGIN_ID_2,
    version: "1.0.0",
  };

const EXAMPLE_GIT_SETTINGS: GitConnectionSettings = {
  gitOrganizationName: "gitOrganizationName",
  gitRepositoryName: "gitRepositoryName",
  baseBranchName: "baseBranchName",
  repositoryGroupName: "repositoryGroupName",
  gitProvider: EnumGitProvider.Github,
  gitProviderProperties: undefined,
};

const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);
const commitServiceFindOneMock = jest.fn(() => EXAMPLE_COMMIT);
const resourceServiceFindOneMock = jest.fn(() => EXAMPLE_RESOURCE);
const resourceServiceFindManyMock = jest.fn(() => [EXAMPLE_RESOURCE]);
const entityServiceGetLatestVersionsMock = jest.fn(() => []);

const prismaServiceBuildCreateMock = jest.fn(() => EXAMPLE_BUILD);
const prismaServiceBuildFindManyMock = jest.fn(() => [EXAMPLE_BUILD]);
const prismaServiceBuildFindUniqueMock = jest.fn(() => EXAMPLE_BUILD);
const prismaServiceBuildUpdateMock = jest.fn();

const prismaServiceBuildPluginUpsertMock = jest.fn(() => {
  return EXAMPLE_BUILD_PLUGIN;
});

const prismaServiceActionStepCreateMock = jest.fn(() => EXAMPLE_ACTION_STEP);

const pluginInstallationServiceGetInstalledPrivatePluginsForBuildMock = jest.fn(
  () => {
    return [];
  }
);

const resourceServiceGetPluginRepositoryGitSettingsByResourceMock = jest.fn(
  () => {
    return EXAMPLE_GIT_SETTINGS;
  }
);

const kafkaServiceEmitMessageMock = jest
  .fn()
  .mockImplementation(() => Promise.resolve());

const privatePluginServiceAvailablePrivatePluginsForResourceMock = jest.fn(
  () => [EXAMPLE_PRIVATE_PLUGIN, EXAMPLE_PRIVATE_PLUGIN_2]
);

describe("BuildService", () => {
  let service: BuildService;

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock,
          })),
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            getLatestVersions: entityServiceGetLatestVersionsMock,
            getEntitiesByVersions: jest.fn(() => []),
          })),
        },
        {
          provide: ResourceRoleService,
          useClass: jest.fn(() => ({
            getResourceRoles: jest.fn(() => []),
          })),
        },
        {
          provide: ServiceSettingsService,
          useClass: jest.fn(() => ({
            getServiceSettingsValues: jest.fn(),
          })),
        },
        {
          provide: ResourceSettingsService,
          useClass: jest.fn(() => ({
            getResourceSettingsBlock: jest.fn(),
          })),
        },
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: kafkaServiceEmitMessageMock,
          })),
        },
        {
          provide: TopicService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
          })),
        },
        {
          provide: ServiceTopicsService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
          })),
        },
        {
          provide: PluginInstallationService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
            getInstalledPrivatePluginsForBuild:
              pluginInstallationServiceGetInstalledPrivatePluginsForBuildMock,
            orderInstalledPlugins: jest.fn(() => []),
          })),
        },
        {
          provide: PrivatePluginService,
          useClass: jest.fn(() => ({
            availablePrivatePluginsForResource:
              privatePluginServiceAvailablePrivatePluginsForResourceMock,
            findMany:
              pluginInstallationServiceGetInstalledPrivatePluginsForBuildMock,
          })),
        },
        {
          provide: PackageService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ProjectConfigurationSettingsService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ModuleDtoService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
          })),
        },
        {
          provide: ModuleActionService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
          })),
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            trackManual: jest.fn(),
          })),
        },
        {
          provide: GitProviderService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: BillingService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ModuleService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(() => []),
          })),
        },
        {
          provide: CommitService,
          useClass: jest.fn(() => ({
            findOne: commitServiceFindOneMock,
          })),
        },
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resource: resourceServiceFindOneMock,
            resources: resourceServiceFindManyMock,
            getRelations: jest.fn(() => []),
            getPluginRepositoryGitSettingsByResource:
              resourceServiceGetPluginRepositoryGitSettingsByResourceMock,
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(),
          })),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn().mockReturnValue("VALUE"),
          })),
        },
        {
          provide: AmplicationLogger,
          useValue: {
            child: jest.fn().mockReturnThis(),
            info: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            build: {
              create: prismaServiceBuildCreateMock,
              findMany: prismaServiceBuildFindManyMock,
              findUnique: prismaServiceBuildFindUniqueMock,
              update: prismaServiceBuildUpdateMock,
            },
            buildPlugin: {
              upsert: prismaServiceBuildPluginUpsertMock,
            },
            actionStep: {
              create: prismaServiceActionStepCreateMock,
              update: jest.fn(),
            },
            actionLog: {
              create: jest.fn(),
            },
          })),
        },
        ActionService, //we use the real service here in order to execute actionService.run() with the inner step function
        BuildService,
      ],
    }).compile();

    service = module.get<BuildService>(BuildService);

    const getBuildStepMock = jest.spyOn(service, "getBuildStep");

    getBuildStepMock.mockImplementation(
      (buildId: string, buildStepName: string) => {
        return Promise.resolve(EXAMPLE_ACTION_STEP);
      }
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new build", async () => {
    const commitMessage = "Commit message";
    const createBuildArgs = {
      data: {
        resource: { connect: { id: "resourceId" } },
        createdBy: { connect: { id: "userId" } },
        commit: { connect: { id: "commitId" } },
        message: commitMessage,
      },
    };

    const version = "commitId";

    const actionSteps = {
      message: "Adding task to queue",
      name: "ADD_TO_QUEUE",
      status: EnumActionStepStatus.Success,
      completedAt: new Date(),
      logs: {
        create: [
          {
            level: EnumActionLogLevel.Info,
            message: "Create build generation task",
            meta: {},
          },
          {
            level: EnumActionLogLevel.Info,
            message: `Build version: ${version}`,
            meta: {},
          },
          {
            level: EnumActionLogLevel.Info,
            message: `Build message: ${commitMessage}`,
            meta: {},
          },
        ],
      },
    };

    const result = await service.create(createBuildArgs);

    expect(result).toEqual(EXAMPLE_BUILD);

    expect(userServiceFindUserMock).toHaveBeenCalledWith({
      where: { id: "userId" },
    });

    expect(entityServiceGetLatestVersionsMock).toHaveBeenCalledWith({
      where: { resourceId: "resourceId" },
    });
    expect(prismaServiceBuildCreateMock).toHaveBeenCalled();
    expect(prismaServiceBuildCreateMock).toHaveBeenCalledWith({
      data: {
        ...createBuildArgs.data,
        createdAt: expect.any(Date),
        version: version,
        status: EnumBuildStatus.Running,
        gitStatus: EnumBuildGitStatus.Waiting,
        blockVersions: {
          connect: [],
        },
        entityVersions: {
          connect: [],
        },
        action: {
          create: {
            steps: {
              create: actionSteps,
            },
          },
        },
      },
      include: {
        commit: true,
        resource: true,
      },
    });
  });

  it("should build a service with private plugins", async () => {
    const commitMessage = "Commit message";
    const createBuildArgs = {
      data: {
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        createdBy: { connect: { id: "userId" } },
        commit: { connect: { id: "commitId" } },
        message: commitMessage,
      },
    };

    const privatePluginInstallations: PluginInstallation[] = [
      EXAMPLE_PRIVATE_PLUGIN_INSTALLATION,
      EXAMPLE_PRIVATE_PLUGIN_INSTALLATION_WITH_SPECIFIC_VERSION,
    ];

    const notifyBuildPluginVersionMock = jest.spyOn(
      service,
      "notifyBuildPluginVersion"
    );

    pluginInstallationServiceGetInstalledPrivatePluginsForBuildMock.mockReturnValueOnce(
      privatePluginInstallations
    );

    const result = await service.create(createBuildArgs);

    expect(result).toEqual(EXAMPLE_BUILD);
    expect(prismaServiceBuildCreateMock).toHaveBeenCalled();

    expect(
      pluginInstallationServiceGetInstalledPrivatePluginsForBuildMock
    ).toHaveBeenCalledWith(EXAMPLE_RESOURCE_ID);

    expect(notifyBuildPluginVersionMock).toHaveBeenCalledTimes(2);
    expect(notifyBuildPluginVersionMock.mock.calls).toEqual([
      [
        {
          buildId: EXAMPLE_BUILD_ID,
          packageName: EXAMPLE_PRIVATE_PLUGIN_ID,
          packageVersion: "1.1.0",
          requestedFullPackageName: "plugin-1@latest",
        },
      ],
      [
        {
          buildId: EXAMPLE_BUILD_ID,
          packageName: EXAMPLE_PRIVATE_PLUGIN_ID_2,
          packageVersion: "1.0.0",
          requestedFullPackageName: "plugin-2@1.0.0",
        },
      ],
    ]);

    expect(kafkaServiceEmitMessageMock).toHaveBeenCalledTimes(1);
    expect(kafkaServiceEmitMessageMock.mock.calls).toEqual([
      [
        KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_REQUEST_TOPIC,
        {
          key: {
            resourceId: EXAMPLE_RESOURCE_ID,
          },
          value: {
            ...EXAMPLE_GIT_SETTINGS,
            buildId: EXAMPLE_BUILD_ID,
            resourceId: EXAMPLE_RESOURCE_ID,
            pluginsToDownload: [
              {
                pluginId: EXAMPLE_PRIVATE_PLUGIN_ID,
                pluginVersion: "1.1.0",
              },
              {
                pluginId: EXAMPLE_PRIVATE_PLUGIN_ID_2,
                pluginVersion: "1.0.0",
              },
            ],
          },
        },
      ],
    ]);
  });

  it("should not create build for resources other than service", async () => {
    const commitMessage = "Commit message";
    const createBuildArgs = {
      data: {
        resource: { connect: { id: "resourceId" } },
        createdBy: { connect: { id: "userId" } },
        commit: { connect: { id: "commitId" } },
        message: commitMessage,
      },
    };

    const resource = {
      ...EXAMPLE_RESOURCE,
      resourceType: EnumResourceType.MessageBroker,
    };

    resourceServiceFindOneMock.mockReturnValueOnce(resource);

    const result = await service.create(createBuildArgs);

    expect(result).toBeUndefined();
  });

  it("should update plugin version successfully", async () => {
    const args: PluginNotifyVersion.Value = {
      buildId: EXAMPLE_BUILD_ID,
      packageName: "examplePackageName",
      packageVersion: "1.0.0",
      requestedFullPackageName: "examplePackageName@latest",
    };

    await service.notifyBuildPluginVersion(args);

    expect(prismaServiceBuildPluginUpsertMock).toHaveBeenCalledTimes(1);
    expect(prismaServiceBuildPluginUpsertMock).toHaveBeenCalledWith({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        buildId_packageName: {
          buildId: args.buildId,
          packageName: args.packageName,
        },
      },
      update: {
        packageVersion: args.packageVersion,
      },
      create: {
        build: {
          connect: {
            id: args.buildId,
          },
        },
        packageName: args.packageName,
        packageVersion: args.packageVersion,
        requestedFullPackageName: args.requestedFullPackageName,
      },
    });
  });
});
