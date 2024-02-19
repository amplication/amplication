import { PrismaService } from "../../prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "./project.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import {
  Account,
  Block,
  BlockVersion,
  Commit,
  Entity,
  EntityVersion,
  Project,
  Resource,
  User,
  Workspace,
} from "../../models";
import { Environment } from "../environment/dto";
import { Build } from "../build/dto/Build";
import {
  EnumResourceType,
  EnumPendingChangeAction,
  EnumPendingChangeOriginType,
} from "@amplication/code-gen-types/models";
import { PendingChange } from "../resource/dto/PendingChange";
import { ResourceService } from "../resource/resource.service";
import { BuildService } from "../build/build.service";
import { EntityService } from "../entity/entity.service";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { CURRENT_VERSION_NUMBER } from "../entity/constants";
import { BlockService } from "../block/block.service";
import { ConfigService } from "@nestjs/config";
import { BillingService } from "../billing/billing.service";
import { prepareDeletedItemName } from "../../util/softDelete";
import { GitProviderService } from "../git/git.provider.service";
import { BooleanEntitlement, MeteredEntitlement } from "@stigg/node-server-sdk";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { BillingFeature } from "@amplication/util-billing-types";
import { SubscriptionService } from "../subscription/subscription.service";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

/** values mock */
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_MESSAGE = "exampleMessage";
const EXAMPLE_PROJECT_ID = "exampleProjectId";
const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_ENTITY_ID = "exampleEntityId";
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_DESCRIPTION = "exampleDescription";
const EXAMPLE_DISPLAY_NAME = "exampleDisplayName";
const EXAMPLE_PLURAL_DISPLAY_NAME = "examplePluralDisplayName";
const EXAMPLE_CUSTOM_ATTRIBUTES = "exampleCustomAttributes";
const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_ENVIRONMENT_ID = "exampleEnvironmentId";
const EXAMPLE_ADDRESS = "exampleAddress";
const EXAMPLE_BLOCK_ID = "exampleBlockId";
const EXAMPLE_BLOCK_DISPLAY_NAME = "Example Entity Name";
const EXAMPLE_ENTITY_VERSION_ID = "exampleEntityVersionId";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_DISPLAY_NAME = "Example Entity Name";
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = "Example Entity Names";
const EXAMPLE_BLOCK_VERSION_ID = "exampleBlockVersionId";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_PROJECT_NAME = "exampleProjectName";
/** models mock */
const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
};

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
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS,
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID,
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME,
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

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  description: EXAMPLE_DESCRIPTION,
  entities: [EXAMPLE_ENTITY],
  builds: [EXAMPLE_BUILD],
  environments: [EXAMPLE_ENVIRONMENT],
  gitRepositoryOverride: false,
  licensed: true,
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

const EXAMPLE_PROJECT_2: Project = {
  id: EXAMPLE_PROJECT_ID,
  name: EXAMPLE_PROJECT_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  useDemoRepo: false,
  demoRepoName: undefined,
  licensed: true,
};

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  projects: [EXAMPLE_PROJECT_2],
};

const EXAMPLE_PROJECT: Project = {
  id: EXAMPLE_PROJECT_ID,
  name: EXAMPLE_PROJECT_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
  resources: [EXAMPLE_RESOURCE],
  useDemoRepo: false,
  demoRepoName: undefined,
  licensed: true,
};

const EXAMPLE_PROJECT_CONFIGURATION = {};

/** methods mock */
const billingServiceIsBillingEnabledMock = jest.fn();

const billingServiceMock = {
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
    } as unknown as MeteredEntitlement;
  }),
  getBooleanEntitlement: jest.fn(() => {
    return {};
  }),
  getNumericEntitlement: jest.fn(() => {
    return {};
  }),
  reportUsage: jest.fn(() => {
    return {};
  }),
};
// This is important to mock the getter!!!
Object.defineProperty(billingServiceMock, "isBillingEnabled", {
  get: billingServiceIsBillingEnabledMock,
});

const prismaUserFindUniqueMock = jest.fn(() => ({
  then: (resolve) => resolve(EXAMPLE_USER),
  workspace: () => EXAMPLE_WORKSPACE,
}));
const prismaProjectUpdateMock = jest.fn(() => {
  return EXAMPLE_PROJECT;
});
const prismaProjectFindFirstMock = jest.fn(() => {
  return EXAMPLE_PROJECT;
});
const prismaProjectCreateMock = jest.fn(() => {
  return EXAMPLE_PROJECT;
});
const prismaProjectFindManyMock = jest.fn(() => {
  return [EXAMPLE_PROJECT];
});
const prismaResourceCreateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceFindManyMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE];
});
const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const prismaCommitCreateMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});
const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);
const entityServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_ENTITY_VERSION
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
const createProjectConfigurationMock = jest.fn(() => {
  return EXAMPLE_PROJECT_CONFIGURATION;
});
const blockServiceReleaseLockMock = jest.fn(async () => EXAMPLE_BLOCK);
const mockedUpdateProjectLicensed = jest.fn();
const mockedUpdateServiceLicensed = jest.fn();

describe("ProjectService", () => {
  let service: ProjectService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ConfigService,
          useValue: { get: () => "" },
        },
        {
          provide: BillingService,
          useValue: billingServiceMock,
        },
        {
          provide: SubscriptionService,
          useClass: jest.fn(() => ({
            updateProjectLicensed: mockedUpdateProjectLicensed,
            updateServiceLicensed: mockedUpdateServiceLicensed,
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            user: {
              findUnique: prismaUserFindUniqueMock,
            },
            resource: {
              create: prismaResourceCreateMock,
              findMany: prismaResourceFindManyMock,
            },
            entity: {
              findMany: prismaEntityFindManyMock,
            },
            commit: {
              create: prismaCommitCreateMock,
            },
            project: {
              create: prismaProjectCreateMock,
              findMany: prismaProjectFindManyMock,
              findFirst: prismaProjectFindFirstMock,
              update: prismaProjectUpdateMock,
            },
          })),
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock,
          })),
        },
        {
          provide: EntityService,
          useClass: jest.fn().mockImplementation(() => ({
            createVersion: entityServiceCreateVersionMock,
            getChangedEntities: entityServiceGetChangedEntitiesMock,
            releaseLock: entityServiceReleaseLockMock,
          })),
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
          provide: ResourceService,
          useClass: jest.fn(() => ({
            createProjectConfiguration: createProjectConfigurationMock,
            archiveProjectResources: jest.fn(() => Promise.resolve([])),
          })),
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            track: jest.fn(() => {
              return;
            }),
          })),
        },
        {
          provide: GitProviderService,
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  describe("when billing is enable", () => {
    beforeEach(() => {
      billingServiceIsBillingEnabledMock.mockReturnValue(true);
    });

    it("should not create a project when the workspace exceeded the project limitation", async () => {
      // arrange
      const args = {
        data: {
          name: EXAMPLE_NAME,
          workspace: {
            connect: {
              id: EXAMPLE_WORKSPACE_ID,
            },
          },
        },
      };

      billingServiceMock.getMeteredEntitlement.mockReturnValueOnce({
        usageLimit: 1,
        hasAccess: false,
      } as unknown as MeteredEntitlement);

      // act
      await expect(
        service.createProject(args, EXAMPLE_USER_ID)
      ).rejects.toThrow(
        new BillingLimitationError(
          "Your workspace exceeds its project limitation.",
          BillingFeature.Projects
        )
      );

      // assert
      expect(prismaProjectCreateMock).toBeCalledTimes(0);
    });

    it("should throw a billing limitation error on commit when the block build is true", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: true,
      } as unknown as BooleanEntitlement);
      const args = {
        data: {
          message: EXAMPLE_MESSAGE,
          project: { connect: { id: EXAMPLE_PROJECT_ID } },
          user: { connect: { id: EXAMPLE_USER_ID } },
        },
      };

      await expect(service.commit(args, EXAMPLE_USER)).rejects.toThrow(
        new BillingLimitationError(
          "Your current plan does not allow code generation.",
          BillingFeature.BlockBuild
        )
      );
      expect(prismaResourceFindManyMock).toBeCalledTimes(0);

      expect(prismaCommitCreateMock).toBeCalledTimes(0);
      expect(entityServiceCreateVersionMock).toBeCalledTimes(0);
      expect(blockServiceCreateVersionMock).toBeCalledTimes(0);
      expect(entityServiceReleaseLockMock).toBeCalledTimes(0);
      expect(blockServiceReleaseLockMock).toBeCalledTimes(0);

      expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(0);
      expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(0);
      expect(buildServiceCreateMock).toBeCalledTimes(0);
    });
  });
  describe("when billing is disable", () => {
    beforeEach(() => {
      billingServiceIsBillingEnabledMock.mockReturnValue(false);
    });
    it("should be defined", () => {
      expect(service).toBeDefined();
    });
    it("should commit even when the block build is true", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: true,
      } as unknown as BooleanEntitlement);
      const args = {
        data: {
          message: EXAMPLE_MESSAGE,
          project: { connect: { id: EXAMPLE_PROJECT_ID } },
          user: { connect: { id: EXAMPLE_USER_ID } },
        },
      };
      const findManyArgs = {
        where: {
          deletedAt: null,
          archived: {
            not: true,
          },
          projectId: EXAMPLE_PROJECT_ID,
          project: {
            workspace: {
              users: {
                some: {
                  id: EXAMPLE_USER_ID,
                },
              },
            },
          },
        },
      };

      const createVersionArgs = {
        data: {
          commit: {
            connect: {
              id: EXAMPLE_COMMIT_ID,
            },
          },
          entity: {
            connect: {
              id: EXAMPLE_ENTITY_ID,
            },
          },
        },
      };
      const blockCreateVersionArgs = {
        data: {
          commit: {
            connect: {
              id: EXAMPLE_COMMIT_ID,
            },
          },
          block: {
            connect: {
              id: EXAMPLE_BLOCK_ID,
            },
          },
        },
      };
      const changesArgs = {
        projectId: EXAMPLE_PROJECT_ID,
        userId: EXAMPLE_USER_ID,
      };
      const buildCreateArgs = {
        data: {
          resource: {
            connect: {
              id: EXAMPLE_RESOURCE_ID,
            },
          },
          commit: {
            connect: {
              id: EXAMPLE_COMMIT_ID,
            },
          },
          createdBy: {
            connect: {
              id: EXAMPLE_USER_ID,
            },
          },
          message: args.data.message,
        },
      };
      expect(await service.commit(args, EXAMPLE_USER)).toEqual(EXAMPLE_COMMIT);
      expect(prismaResourceFindManyMock).toBeCalledTimes(1);
      expect(prismaResourceFindManyMock).toBeCalledWith(findManyArgs);

      expect(prismaCommitCreateMock).toBeCalledTimes(1);
      expect(prismaCommitCreateMock).toBeCalledWith(args);
      expect(entityServiceCreateVersionMock).toBeCalledTimes(1);
      expect(entityServiceCreateVersionMock).toBeCalledWith(createVersionArgs);
      expect(blockServiceCreateVersionMock).toBeCalledTimes(1);
      expect(blockServiceCreateVersionMock).toBeCalledWith(
        blockCreateVersionArgs
      );
      expect(entityServiceReleaseLockMock).toBeCalledTimes(1);
      expect(entityServiceReleaseLockMock).toBeCalledWith(EXAMPLE_ENTITY_ID);

      expect(blockServiceReleaseLockMock).toBeCalledTimes(1);
      expect(blockServiceReleaseLockMock).toBeCalledWith(EXAMPLE_BLOCK_ID);

      expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(1);
      expect(entityServiceGetChangedEntitiesMock).toBeCalledWith(
        changesArgs.projectId,
        changesArgs.userId
      );
      expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(1);
      expect(blockServiceGetChangedBlocksMock).toBeCalledWith(
        changesArgs.projectId,
        changesArgs.userId
      );
      expect(buildServiceCreateMock).toBeCalledTimes(1);
      expect(buildServiceCreateMock).toBeCalledWith(buildCreateArgs);
    });

    it("should create a project", async () => {
      // arrange
      const args = {
        data: {
          name: EXAMPLE_NAME,
          workspace: {
            connect: {
              id: EXAMPLE_WORKSPACE_ID,
            },
          },
        },
      };

      billingServiceMock.getMeteredEntitlement.mockReturnValueOnce({
        usageLimit: undefined,
        hasAccess: true,
      } as unknown as MeteredEntitlement);

      // act
      const newProject = await service.createProject(args, EXAMPLE_USER_ID);

      // assert
      expect(newProject).toEqual(EXAMPLE_PROJECT);
      expect(prismaProjectCreateMock).toBeCalledTimes(1);
      expect(prismaProjectCreateMock).toBeCalledWith(args);
    });

    it("should delete a project", async () => {
      const args = { where: { id: EXAMPLE_PROJECT_ID } };
      const dateSpy = jest.spyOn(global, "Date");
      expect(await service.deleteProject(args)).toEqual(EXAMPLE_PROJECT);

      expect(mockedUpdateProjectLicensed).toBeCalledTimes(1);
      expect(mockedUpdateProjectLicensed).toHaveBeenCalledWith(
        EXAMPLE_WORKSPACE_ID
      );
      expect(mockedUpdateServiceLicensed).toBeCalledTimes(1);
      expect(mockedUpdateServiceLicensed).toBeCalledWith(EXAMPLE_WORKSPACE_ID);

      expect(prismaProjectUpdateMock).toBeCalledTimes(1);
      expect(prismaProjectUpdateMock).toBeCalledWith({
        ...args,
        data: {
          deletedAt: dateSpy.mock.instances[0],
          name: prepareDeletedItemName(
            EXAMPLE_PROJECT.name,
            EXAMPLE_PROJECT.id
          ),
        },
      });
    });
  });
});
