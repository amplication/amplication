import { Test, TestingModule } from "@nestjs/testing";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { AmplicationError } from "../../errors/AmplicationError";
import { Account, User } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { BlockService } from "../block/block.service";
import { EntityService } from "../entity/entity.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { CreateModuleArgs } from "./dto/CreateModuleArgs";
import { Module } from "./dto/Module";
import { UpdateModuleArgs } from "./dto/UpdateModuleArgs";
import { ModuleService } from "./module.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingService } from "../billing/billing.service";
import { billingServiceGetBooleanEntitlementMock } from "../block/blockType.service.spec";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { Subscription } from "../subscription/dto/Subscription";

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";
const EXAMPLE_USER_ID = "exampleUserId";

export const EXAMPLE_SUBSCRIPTION: Subscription = {
  id: "exampleSubscriptionId",
  createdAt: new Date(),
  updatedAt: new Date(),
  workspaceId: "exampleWorkspaceId",
  subscriptionPlan: "Free",
  status: "Active",
};

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

const EXAMPLE_MODULE_NAME = "exampleModule";
const EXAMPLE_MODULE_DISPLAY_NAME = "Example Module";
const EXAMPLE_MODULE_DESCRIPTION = "Example Module Description";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_MODULE_ID = "exampleModuleId";
const EXAMPLE_INVALID_MODULE_NAME = "example invalid name";
const EXAMPLE_RESERVED_MODULE_NAME = "auth";
const EXAMPLE_ENTITY_ID = "exampleEntityId";

const EXAMPLE_MODULE: Module = {
  id: EXAMPLE_MODULE_ID,
  name: EXAMPLE_MODULE_NAME,
  displayName: EXAMPLE_MODULE_NAME, //should always return the name as the display name
  description: EXAMPLE_MODULE_DESCRIPTION,
  enabled: true,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.Module,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
  resourceId: EXAMPLE_RESOURCE_ID,
};

export const subscriptionServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_SUBSCRIPTION;
});
const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_MODULE;
});

const blockServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_MODULE;
});

const blockServiceCreateMock = jest.fn((args: CreateModuleArgs): Module => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { resource, parentBlock, ...data } = args.data;

  return {
    ...data,
    id: EXAMPLE_MODULE_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockType: EnumBlockType.Module,
    enabled: true,
    versionNumber: 0,
    parentBlock: null,
    description: data.description,
    inputParameters: null,
    outputParameters: null,
    resourceId: EXAMPLE_RESOURCE_ID,
  };
});

const blockServiceUpdateMock = jest.fn(() => {
  return EXAMPLE_MODULE;
});

const blockServiceFindManyByBlockTypeMock = jest.fn(() => {
  return [
    {
      ...EXAMPLE_MODULE,
      name: "ExampleUniqueName",
    },
  ];
});

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => {
  return [
    {
      ...EXAMPLE_MODULE,
    },
  ];
});

describe("ModuleService", () => {
  let service: ModuleService;

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
            findManyByBlockType: blockServiceFindManyByBlockTypeMock,
            findManyByBlockTypeAndSettings:
              blockServiceFindManyByBlockTypeAndSettingsMock,
          })),
        },
        {
          provide: BillingService,
          useClass: jest.fn(() => ({
            getBooleanEntitlement: billingServiceGetBooleanEntitlementMock,
            getSubscription: subscriptionServiceFindOneMock,
          })),
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            trackWithContext: jest.fn(() => {
              return null;
            }),
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(() => {
              return null;
            }),
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: EntityService,
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
        ModuleService,
      ],
    }).compile();

    service = module.get<ModuleService>(ModuleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create one module", async () => {
    const args: CreateModuleArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_MODULE_DESCRIPTION,
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_MODULE_NAME,
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(EXAMPLE_MODULE);
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          displayName: args.data.name,
          blockType: EnumBlockType.Module,
          enabled: true,
        },
      },
      EXAMPLE_USER_ID
    );
  });

  it("should throw an error when creating a module with invalid name", async () => {
    const args: CreateModuleArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_INVALID_MODULE_NAME,
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Invalid module name: ${EXAMPLE_INVALID_MODULE_NAME}`
      )
    );
  });

  it("should throw an error when creating a module with reserved name", async () => {
    const args: CreateModuleArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_RESERVED_MODULE_NAME,
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Module name ${EXAMPLE_RESERVED_MODULE_NAME} is reserved and cannot be used.`
      )
    );
  });

  it("should get one module", async () => {
    const args: FindOneArgs = {
      where: {
        id: EXAMPLE_MODULE_ID,
      },
    };

    const result = await service.findOne(args);
    expect(result).toEqual(EXAMPLE_MODULE);
    expect(blockServiceFindOneMock).toBeCalledTimes(1);
    expect(blockServiceFindOneMock).toBeCalledWith(args);
  });

  it("should update one module", async () => {
    const args: UpdateModuleArgs = {
      where: {
        id: EXAMPLE_MODULE_ID,
      },
      data: {
        displayName: EXAMPLE_MODULE_NAME,
        name: EXAMPLE_MODULE_NAME,
        enabled: true,
      },
    };
    expect(await service.update(args, EXAMPLE_USER)).toEqual(EXAMPLE_MODULE);
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      undefined
    );
  });

  it("should throw an error when updating a module with invalid name", async () => {
    const args: UpdateModuleArgs = {
      where: {
        id: EXAMPLE_MODULE_ID,
      },
      data: {
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_INVALID_MODULE_NAME,
        enabled: true,
      },
    };
    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Invalid module name: ${EXAMPLE_INVALID_MODULE_NAME}`
      )
    );
  });

  it("should throw an error when updating the name of a default module", async () => {
    //return a default module
    blockServiceFindOneMock.mockReturnValue({
      ...EXAMPLE_MODULE,
      entityId: EXAMPLE_ENTITY_ID,
    });

    const args: UpdateModuleArgs = {
      where: {
        id: EXAMPLE_MODULE_ID,
      },
      data: {
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: "newName",
        enabled: false,
      },
    };

    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        "Cannot update the name of a default Module for entity."
      )
    );
  });

  it("should find all modules by name case insensitive", async () => {
    const nameToFind = "NameToFind";

    const toBeFound1 = {
      ...EXAMPLE_MODULE,
      name: nameToFind,
    };

    const toBeFound2 = {
      ...EXAMPLE_MODULE,
      name: nameToFind.toUpperCase(),
    };

    const notToBeFound = {
      ...EXAMPLE_MODULE,
      name: "NotToBeFound",
    };

    blockServiceFindManyByBlockTypeMock.mockReturnValue([
      toBeFound1,
      toBeFound2,
      notToBeFound,
    ]);

    const results = await service.findModuleByName(
      nameToFind,
      EXAMPLE_RESOURCE_ID
    );

    expect(results).toEqual([toBeFound1, toBeFound2]);
  });

  it("should throw an error when creating a module with a name that is already used", async () => {
    blockServiceFindManyByBlockTypeMock.mockReturnValue([
      {
        ...EXAMPLE_MODULE,
        name: EXAMPLE_MODULE_NAME,
      },
    ]);

    const args: CreateModuleArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_MODULE_NAME,
      },
    };

    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Module with name ${args.data.name} already exists in resource ${args.data.resource.connect.id}`
      )
    );
  });

  it("should throw an error when updating a module with a name that is already used", async () => {
    blockServiceFindManyByBlockTypeMock.mockReturnValue([
      {
        ...EXAMPLE_MODULE,
        id: "anotherModuleId",
        name: EXAMPLE_MODULE_NAME,
      },
    ]);

    const args: UpdateModuleArgs = {
      where: {
        id: EXAMPLE_MODULE_ID,
      },
      data: {
        displayName: EXAMPLE_MODULE_DISPLAY_NAME,
        name: EXAMPLE_MODULE_NAME,
        enabled: true,
      },
    };

    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Module with name ${args.data.name} already exists in resource ${EXAMPLE_RESOURCE_ID}`
      )
    );
  });
});
