import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../../env";
import { BlockService } from "../block/block.service";
import { ResourceService } from "../resource/resource.service";
import { PrivatePluginService } from "./privatePlugin.service";
import { BillingService } from "../billing/billing.service";
import { Account, User } from "../../models";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";
import { PrivatePlugin } from "./dto/PrivatePlugin";
import { PrivatePluginVersion } from "./dto/PrivatePluginVersion";
import { EnumBlockType } from "@amplication/code-gen-types";
import { CreatePrivatePluginArgs } from "./dto/CreatePrivatePluginArgs";
import { AmplicationError } from "../../errors/AmplicationError";
import { ProjectService } from "../project/project.service";
import { GitProviderService } from "../git/git.provider.service";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { BooleanEntitlement } from "@stigg/node-server-sdk";

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";
const EXAMPLE_USER_ID = "exampleUserId";

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
  isOwner: true,
  account: EXAMPLE_ACCOUNT,
};

const EXAMPLE_PRIVATE_PLUGIN_ID = "examplePrivatePluginId";
const EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID = "@plugin/example";

const EXAMPLE_PRIVATE_PLUGIN_VERSION: PrivatePluginVersion = {
  version: "0.0.1",
  enabled: true,
  deprecated: false,
  settings: null,
  configurations: null,
};

const EXAMPLE_PRIVATE_PLUGIN: PrivatePlugin = {
  id: EXAMPLE_PRIVATE_PLUGIN_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  enabled: true,
  versions: [EXAMPLE_PRIVATE_PLUGIN_VERSION],
  pluginId: EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID,
  parentBlock: undefined,
  displayName: "",
  description: "",
  blockType: EnumBlockType.PrivatePlugin,
  versionNumber: 0,
  inputParameters: [],
  outputParameters: [],
  codeGenerator: "DotNet",
};

export const EXAMPLE_BOOLEAN_ENTITLEMENT: BooleanEntitlement = {
  hasAccess: true,
  isFallback: false,
};

export const billingServiceGetBooleanEntitlementMock = jest.fn(() => {
  return EXAMPLE_BOOLEAN_ENTITLEMENT;
});

const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_PRIVATE_PLUGIN;
});

const blockServiceFindManyMock = jest.fn(() => {
  return [];
});

const blockServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_PRIVATE_PLUGIN;
});

const blockServiceCreateMock = jest.fn(
  (args: CreatePrivatePluginArgs): PrivatePlugin => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resource, parentBlock, ...data } = args.data;

    return {
      ...data,
      id: EXAMPLE_PRIVATE_PLUGIN_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      pluginId: EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID,
      blockType: EnumBlockType.ModuleDto,
      enabled: true,
      versionNumber: 0,
      parentBlock: null,
      description: data.description,
      inputParameters: null,
      outputParameters: null,
      versions: [],
    };
  }
);

const blockServiceUpdateMock = jest.fn(() => {
  return EXAMPLE_PRIVATE_PLUGIN;
});

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => {
  return [EXAMPLE_PRIVATE_PLUGIN];
});

describe("PrivatePluginService", () => {
  let service: PrivatePluginService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            findOne: blockServiceFindOneMock,
            create: blockServiceCreateMock,
            delete: blockServiceDeleteMock,
            update: blockServiceUpdateMock,
            findManyByBlockType: blockServiceFindManyMock,
            findManyByBlockTypeAndSettings:
              blockServiceFindManyByBlockTypeAndSettingsMock,
          })),
        },
        {
          provide: ResourceService,
          useValue: {},
        },
        {
          provide: BillingService,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: {
            findProjects: jest.fn(() => []),
          },
        },
        {
          provide: BillingService,
          useClass: jest.fn(() => ({
            getBooleanEntitlement: billingServiceGetBooleanEntitlementMock,
          })),
        },
        {
          provide: GitProviderService,
          useClass: jest.fn(() => ({})),
        },

        MockedAmplicationLoggerProvider,

        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.FEATURE_CUSTOM_ACTIONS_ENABLED:
                  return "true";
                default:
                  return "";
              }
            },
          },
        },
        PrivatePluginService,
      ],
    }).compile();

    service = module.get<PrivatePluginService>(PrivatePluginService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create private plugin", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    const args: CreatePrivatePluginArgs = {
      data: {
        pluginId: EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID,
        displayName: "Example Plugin",
        description: "Example Description",
        enabled: true,
        codeGenerator: EnumCodeGenerator.Blueprint,
        settings: null,
        resource: {
          connect: {
            id: "exampleResourceId",
          },
        },
      },
    };

    await service.create(args, EXAMPLE_USER);

    expect(blockServiceCreateMock).toHaveBeenCalledTimes(1);
    expect(blockServiceCreateMock).toHaveBeenCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.PrivatePlugin,
        },
      },
      EXAMPLE_USER.id
    );

    expect(
      blockServiceFindManyByBlockTypeAndSettingsMock
    ).toHaveBeenCalledTimes(1);
    expect(blockServiceFindManyByBlockTypeAndSettingsMock).toHaveBeenCalledWith(
      {
        where: {
          resource: {
            project: {
              workspace: {
                id: undefined,
              },
            },
          },
        },
      },
      EnumBlockType.PrivatePlugin,
      {
        equals: EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID,
        path: ["pluginId"],
      },
      undefined,
      undefined
    );
  });

  it("should throw an error when pluginId is already taken", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([
      EXAMPLE_PRIVATE_PLUGIN,
    ]);

    const args: CreatePrivatePluginArgs = {
      data: {
        pluginId: EXAMPLE_PRIVATE_PLUGIN_PLUGIN_ID,
        displayName: "Example Plugin",
        description: "Example Description",
        enabled: true,
        codeGenerator: EnumCodeGenerator.Blueprint,
        settings: null,
        resource: {
          connect: {
            id: "exampleResourceId",
          },
        },
      },
    };

    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      "A plugin with the same ID already exists in the workspace. Plugin IDs must be unique across all projects in the workspace."
    );
  });

  it("should create version", async () => {
    await service.createVersion(
      {
        data: {
          privatePlugin: {
            connect: {
              id: EXAMPLE_PRIVATE_PLUGIN_ID,
            },
          },
          version: "newVersion",
        },
      },
      EXAMPLE_USER
    );

    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("createVersion should throw an exception when private plugin not found", async () => {
    blockServiceFindOneMock.mockReturnValueOnce(null);

    await expect(
      service.createVersion(
        {
          data: {
            privatePlugin: {
              connect: {
                id: EXAMPLE_PRIVATE_PLUGIN_ID,
              },
            },
            version: "0.0.1",
          },
        },
        EXAMPLE_USER
      )
    ).rejects.toThrow(
      new AmplicationError(
        `Private Plugin not found, ID: ${EXAMPLE_PRIVATE_PLUGIN_ID}`
      )
    );
  });

  it("createVersion should throw an exception when version already being used", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_PRIVATE_PLUGIN,
      versions: [
        {
          ...EXAMPLE_PRIVATE_PLUGIN_VERSION,
          version: "existingVersion",
        },
      ],
    });

    const args = {
      data: {
        privatePlugin: {
          connect: {
            id: EXAMPLE_PRIVATE_PLUGIN_ID,
          },
        },
        version: "existingVersion",
      },
    };

    await expect(service.createVersion(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Version already exists, version: ${args.data.version}, Private Plugin ID: ${args.data.privatePlugin.connect.id}`
      )
    );
  });

  it("should update version", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_PRIVATE_PLUGIN,
      versions: [
        {
          ...EXAMPLE_PRIVATE_PLUGIN_VERSION,
          version: "versionToUpdate",
        },
      ],
    });

    await service.updateVersion(
      {
        where: {
          privatePlugin: {
            id: EXAMPLE_PRIVATE_PLUGIN_ID,
          },
          version: "versionToUpdate",
        },
        data: {
          enabled: true,
          deprecated: false,
          settings: null,
          configurations: null,
        },
      },
      EXAMPLE_USER
    );

    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should throw an error when updating a missing version", async () => {
    const args = {
      where: {
        privatePlugin: {
          id: EXAMPLE_PRIVATE_PLUGIN_ID,
        },
        version: "missingVersion",
      },
      data: {
        enabled: true,
        deprecated: false,
        settings: null,
        configurations: null,
      },
    };

    await expect(service.updateVersion(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Private Plugin Version not found, version: ${args.where.version}, Private Plugin ID: ${args.where.privatePlugin.id}`
      )
    );
  });
});
