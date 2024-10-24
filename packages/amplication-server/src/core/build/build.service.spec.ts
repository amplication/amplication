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
import { UserActionLog } from "@amplication/schema-registry";
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
};

const EXAMPLE_BUILD_PLUGIN: BuildPlugin = {
  id: "exampleBuildPluginId",
  createdAt: new Date(),
  buildId: EXAMPLE_BUILD_ID,
  requestedFullPackageName: "exampleRequestedFullPackageName",
  packageName: "examplePackageName",
  packageVersion: "examplePackageVersion",
};

const EXAMPLE_PRIVATE_PLUGIN_INSTALLATION: PluginInstallation = {
  id: "examplePluginId",
  createdAt: new Date(),
  pluginId: "examplePluginId",
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

const EXAMPLE_PRIVATE_PLUGIN_INSTALLATION_WITH_SPECIFIC_VERSION: PluginInstallation =
  {
    ...EXAMPLE_PRIVATE_PLUGIN_INSTALLATION,
    id: "examplePluginIdWithSpecificVersion",
    version: "1.0.0",
  };

const EXAMPLE_PRIVATE_PLUGIN_INSTALLATIONS: PluginInstallation[] = [
  EXAMPLE_PRIVATE_PLUGIN_INSTALLATION,
  EXAMPLE_PRIVATE_PLUGIN_INSTALLATION_WITH_SPECIFIC_VERSION,
];

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

describe("BuildService", () => {
  let service: BuildService;

  const mockServiceEmitMessage = jest
    .fn()
    .mockImplementation((topic: string, message: UserActionLog.KafkaEvent) =>
      Promise.resolve()
    );

  beforeEach(async () => {
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
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockServiceEmitMessage,
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
          useClass: jest.fn(() => ({})),
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
