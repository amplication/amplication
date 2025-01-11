import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { Env } from "../../env";
import { AmplicationError } from "../../errors/AmplicationError";
import { Account, User } from "../../models";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { BlockService } from "../block/block.service";
import { ResourceService } from "../resource/resource.service";
import { CreatePluginInstallationArgs } from "./dto/CreatePluginInstallationArgs";
import { PluginInstallation } from "./dto/PluginInstallation";
import { UpdatePluginInstallationArgs } from "./dto/UpdatePluginInstallationArgs";
import {
  PluginInstallationService,
  REQUIRES_AUTHENTICATION_ENTITY,
} from "./pluginInstallation.service";
import { PluginOrderService } from "./pluginOrder.service";

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
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
  account: EXAMPLE_ACCOUNT,
};

const EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME = "Create Customer";
const EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION = "Create One Customer";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_PLUGIN_INSTALLATION_ID = "examplePluginInstallationId";

const EXAMPLE_PLUGIN_ID = "examplePluginId";

const EXAMPLE_PLUGIN_INSTALLATION: PluginInstallation = {
  id: EXAMPLE_PLUGIN_INSTALLATION_ID,
  displayName: EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME,
  description: EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION,
  enabled: true,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.PluginInstallation,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
  pluginId: EXAMPLE_PLUGIN_ID,
  npm: "ExampleNpm",
  version: "1.0.0",
  isPrivate: false,
};

const resourceServiceGetAuthEntityNameMock = jest.fn(() => "User");

const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_PLUGIN_INSTALLATION;
});

const blockServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_PLUGIN_INSTALLATION;
});

const blockServiceCreateMock = jest.fn(
  (args: CreatePluginInstallationArgs): PluginInstallation => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resource, parentBlock, ...data } = args.data;

    return {
      ...data,
      id: EXAMPLE_PLUGIN_INSTALLATION_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      blockType: EnumBlockType.PluginInstallation,
      enabled: true,
      versionNumber: 0,
      parentBlock: null,
      description: data.description,
      inputParameters: null,
      outputParameters: null,
      pluginId: EXAMPLE_PLUGIN_ID,
      npm: "ExampleNpm",
      version: "1.0.0",
    };
  }
);

const blockServiceUpdateMock = jest.fn(() => {
  return EXAMPLE_PLUGIN_INSTALLATION;
});

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => {
  return [
    {
      ...EXAMPLE_PLUGIN_INSTALLATION,
    },
  ];
});

describe("PluginInstallationService", () => {
  let service: PluginInstallationService;

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
            findManyByBlockTypeAndSettings:
              blockServiceFindManyByBlockTypeAndSettingsMock,
          })),
        },
        {
          provide: ResourceService,
          useValue: {
            getAuthEntityName: resourceServiceGetAuthEntityNameMock,
          },
        },
        {
          provide: PluginOrderService,
          useValue: {
            findMany: jest.fn(() => []),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            trackWithContext: jest.fn(() => {
              return null;
            }),
          })),
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
        PluginInstallationService,
      ],
    }).compile();

    service = module.get<PluginInstallationService>(PluginInstallationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create one plugin installation", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    const args: CreatePluginInstallationArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION,
        displayName: EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME,
        pluginId: EXAMPLE_PLUGIN_ID,
        npm: "ExampleNpm",
        version: "1.0.0",
        enabled: true,
        isPrivate: false,
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_PLUGIN_INSTALLATION
    );
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.PluginInstallation,
          pluginId: EXAMPLE_PLUGIN_ID,
          npm: "ExampleNpm",
          version: "1.0.0",
          enabled: true,
        },
      },
      EXAMPLE_USER_ID
    );
  });

  it("should throw an error when installing a plugin that is already installed", async () => {
    const args: CreatePluginInstallationArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION,
        displayName: EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME,
        pluginId: EXAMPLE_PLUGIN_ID,
        npm: "ExampleNpm",
        version: "1.0.0",
        enabled: true,
        isPrivate: false,
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `The Plugin ${args.data.pluginId} already installed in resource ${EXAMPLE_RESOURCE_ID}`
      )
    );
  });
  it("should get one plugin installation", async () => {
    const args: FindOneArgs = {
      where: {
        id: EXAMPLE_PLUGIN_INSTALLATION_ID,
      },
    };

    const result = await service.findOne(args);
    expect(result).toEqual(EXAMPLE_PLUGIN_INSTALLATION);
    expect(blockServiceFindOneMock).toBeCalledTimes(1);
    expect(blockServiceFindOneMock).toBeCalledWith(args);
  });

  it("should update one plugin installation", async () => {
    const args: UpdatePluginInstallationArgs = {
      where: {
        id: EXAMPLE_PLUGIN_INSTALLATION_ID,
      },
      data: {
        enabled: true,
        version: "2.0.0",
        pluginId: EXAMPLE_PLUGIN_ID,
        npm: "ExampleNpm",
      },
    };
    expect(await service.update(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_PLUGIN_INSTALLATION
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(args, EXAMPLE_USER, [
      "settings",
    ]);
  });

  it("should install an auth plugin when auth entity is available", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    const args: CreatePluginInstallationArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION,
        displayName: EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME,
        pluginId: EXAMPLE_PLUGIN_ID,
        npm: "ExampleNpm",
        version: "1.0.0",
        enabled: true,
        isPrivate: false,
        configurations: {
          [REQUIRES_AUTHENTICATION_ENTITY]: "true",
        },
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual({
      ...EXAMPLE_PLUGIN_INSTALLATION,
      configurations: {
        [REQUIRES_AUTHENTICATION_ENTITY]: "true",
      },
    });
  });
  it("should throw an error when installing a plugin and auth entity is missing", async () => {
    resourceServiceGetAuthEntityNameMock.mockImplementationOnce(() => {
      return null;
    });

    const args: CreatePluginInstallationArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_PLUGIN_INSTALLATION_DESCRIPTION,
        displayName: EXAMPLE_PLUGIN_INSTALLATION_DISPLAY_NAME,
        pluginId: EXAMPLE_PLUGIN_ID,
        npm: "ExampleNpm",
        version: "1.0.0",
        enabled: true,
        isPrivate: false,
        configurations: {
          [REQUIRES_AUTHENTICATION_ENTITY]: "true",
        },
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        "The plugin requires an authentication entity. Please select the authentication entity in the service settings."
      )
    );
  });
});
