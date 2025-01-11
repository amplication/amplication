import { EnumModuleDtoType } from "./dto/EnumModuleDtoType";
import { Test, TestingModule } from "@nestjs/testing";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumDataType } from "../../enums/EnumDataType";
import { AmplicationError } from "../../errors/AmplicationError";
import { Account, Entity, EntityField, User } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { BlockService } from "../block/block.service";
import { EntityService } from "../entity/entity.service";
import { Module } from "../module/dto/Module";
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { ModuleDtoService } from "./moduleDto.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { BillingService } from "../billing/billing.service";
import { billingServiceGetBooleanEntitlementMock } from "../block/blockType.service.spec";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { subscriptionServiceFindOneMock } from "../module/module.service.spec";

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

const EXAMPLE_DTO_NAME = "createCustomer";
const EXAMPLE_INVALID_DTO_NAME = "create Customer Input";
const EXAMPLE_DTO_DISPLAY_NAME = "Create Customer";
const EXAMPLE_DTO_DESCRIPTION = "Create One Customer";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_DTO_ID = "exampleDtoId";

const EXAMPLE_DTO: ModuleDto = {
  id: EXAMPLE_DTO_ID,
  dtoType: EnumModuleDtoType.Custom,
  name: EXAMPLE_DTO_NAME,
  displayName: EXAMPLE_DTO_DISPLAY_NAME,
  description: EXAMPLE_DTO_DESCRIPTION,
  enabled: true,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.ModuleDto,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
  properties: [],
};

const EXAMPLE_ENTITY: Entity = {
  id: "exampleEntityId",
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "exampleResource",
  name: "ExampleEntity",
  displayName: "Example entity",
  pluralDisplayName: "exampleEntities",
  customAttributes: "customAttributes",
  description: "Example entity",
  lockedByUserId: undefined,
  lockedAt: null,
};

const EXAMPLE_MODULE: Module = {
  id: "exampleModuleId",
  name: "exampleModule",
  displayName: "example module",
  description: "example module",
  enabled: true,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.Module,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: "exampleEntityFieldId",
  permanentId: "examplePermanentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleEntityFieldName",
  displayName: "exampleEntityFieldDisplayName",
  dataType: EnumDataType.Lookup,
  required: false,
  unique: false,
  searchable: true,
  description: "exampleDescription",
  customAttributes: "ExampleCustomAttributes",
  properties: {
    relatedEntityId: "exampleRelatedEntityId",
    allowMultipleSelection: true,
    relatedFieldId: "relatedFieldId",
  },
};

const EXAMPLE_ENTITY_ENUM_FIELD: EntityField = {
  id: "exampleEntityFieldId",
  permanentId: "examplePermanentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleEntityFieldName",
  displayName: "exampleEntityFieldDisplayName",
  dataType: EnumDataType.OptionSet,
  required: false,
  unique: false,
  searchable: true,
  description: "exampleDescription",
  customAttributes: "ExampleCustomAttributes",
  properties: {
    options: [
      {
        value: "option1",
        label: "Option 1",
      },
      {
        value: "option2",
        label: "Option 2",
      },
    ],
  },
};

const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_DTO;
});

const blockServiceFindManyMock = jest.fn(() => {
  return [];
});

const blockServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_DTO;
});

const blockServiceCreateMock = jest.fn(
  (args: CreateModuleDtoArgs): ModuleDto => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resource, parentBlock, ...data } = args.data;

    return {
      ...data,
      id: EXAMPLE_DTO_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      blockType: EnumBlockType.ModuleDto,
      enabled: true,
      dtoType: args.data.dtoType as EnumModuleDtoType,
      versionNumber: 0,
      parentBlock: null,
      description: data.description,
      inputParameters: null,
      outputParameters: null,
      properties: [],
    };
  }
);

const blockServiceUpdateMock = jest.fn(() => {
  return EXAMPLE_DTO;
});

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => {
  return [
    {
      ...EXAMPLE_DTO,
      dtoType: EnumModuleDtoType.CreateArgs,
    },
  ];
});

describe("ModuleDtoService", () => {
  let service: ModuleDtoService;

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
        ModuleDtoService,
      ],
    }).compile();

    service = module.get<ModuleDtoService>(ModuleDtoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create one dto", async () => {
    const args: CreateModuleDtoArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_DTO_DESCRIPTION,
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_DTO_NAME,
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(EXAMPLE_DTO);
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.ModuleDto,
          enabled: true,
          dtoType: EnumModuleDtoType.Custom,
          properties: [],
        },
      },
      EXAMPLE_USER_ID
    );
  });

  it("should create one Enum Dto", async () => {
    const args: CreateModuleDtoArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_DTO_DESCRIPTION,
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_DTO_NAME,
      },
    };
    expect(await service.createEnum(args, EXAMPLE_USER)).toEqual({
      ...EXAMPLE_DTO,
      dtoType: EnumModuleDtoType.CustomEnum,
      members: [],
    });
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.ModuleDto,
          enabled: true,
          dtoType: EnumModuleDtoType.CustomEnum,
          members: [],
        },
      },
      EXAMPLE_USER_ID
    );
  });

  it("should throw an error when creating a dto with invalid name", async () => {
    const args: CreateModuleDtoArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_INVALID_DTO_NAME,
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Invalid moduleDto name")
    );
  });

  it("should throw an error when creating an enum with invalid name", async () => {
    const args: CreateModuleDtoArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_INVALID_DTO_NAME,
      },
    };
    await expect(service.createEnum(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Invalid moduleDto name")
    );
  });

  it("should get one dto", async () => {
    const args: FindOneArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
    };

    const result = await service.findOne(args);
    expect(result).toEqual(EXAMPLE_DTO);
    expect(blockServiceFindOneMock).toBeCalledTimes(1);
    expect(blockServiceFindOneMock).toBeCalledWith(args);
  });

  it("should update one dto", async () => {
    const args: UpdateModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
      data: {
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_DTO_NAME,
        enabled: true,
      },
    };
    expect(await service.update(args, EXAMPLE_USER)).toEqual(EXAMPLE_DTO);
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      undefined
    );
  });

  it("should throw an error when updating missing DTO", async () => {
    blockServiceFindOneMock.mockReturnValueOnce(null);

    const args: UpdateModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
      data: {
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_DTO_NAME,
        enabled: true,
      },
    };
    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(`Module DTO not found, ID: ${args.where.id}`)
    );
  });

  it("should delete custom dto", async () => {
    const args: DeleteModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
    };
    expect(await service.delete(args, EXAMPLE_USER)).toEqual(EXAMPLE_DTO);
    expect(blockServiceDeleteMock).toBeCalledTimes(1);
    expect(blockServiceDeleteMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      false,
      true
    );
  });

  it("should throw an error when updating a dto with invalid name", async () => {
    const args: UpdateModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
      data: {
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_INVALID_DTO_NAME,
        enabled: true,
      },
    };
    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Invalid moduleDto name")
    );
  });

  it("should throw an error when deleting a default dto", async () => {
    //return a default dto
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      dtoType: EnumModuleDtoType.CreateInput,
    });

    const args: DeleteModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
    };

    await expect(service.delete(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        "Cannot delete a default DTO. To delete it, you must delete the entity"
      )
    );
  });

  it("should throw an error when updating the name of a default dto", async () => {
    //return a default dto
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      dtoType: EnumModuleDtoType.CreateInput,
    });

    const args: UpdateModuleDtoArgs = {
      where: {
        id: EXAMPLE_DTO_ID,
      },
      data: {
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: "newName",
        enabled: false,
      },
    };

    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Cannot update the name of a default DTO")
    );
  });

  it("should create default dtos for entity", async () => {
    expect(
      await service.createDefaultDtosForEntityModule(
        EXAMPLE_ENTITY,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([
      {
        dtoType: EnumModuleDtoType.Entity,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "the Example entity model",
        displayName: "ExampleEntity",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntity",
        outputParameters: null,
        parentBlock: null,
        versionNumber: 0,
        properties: [],
      },
      {
        dtoType: EnumModuleDtoType.CountArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity count",
        displayName: "ExampleEntityCountArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityCountArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.CreateArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity creation",
        displayName: "CreateExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "CreateExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.CreateInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity creation",
        displayName: "ExampleEntityCreateInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityCreateInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.DeleteArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity deletion",
        displayName: "DeleteExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "DeleteExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.FindManyArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity search",
        displayName: "ExampleEntityFindManyArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityFindManyArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.FindOneArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity retrieval",
        displayName: "ExampleEntityFindUniqueArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityFindUniqueArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.ListRelationFilter,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity relation filter",
        displayName: "ExampleEntityListRelationFilter",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityListRelationFilter",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.OrderByInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity sorting",
        displayName: "ExampleEntityOrderByInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityOrderByInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.UpdateArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity update",
        displayName: "UpdateExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "UpdateExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.UpdateInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity update",
        displayName: "ExampleEntityUpdateInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityUpdateInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.WhereInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity search",
        displayName: "ExampleEntityWhereInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityWhereInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.WhereUniqueInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity retrieval",
        displayName: "ExampleEntityWhereUniqueInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityWhereUniqueInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
    ]);
    expect(blockServiceCreateMock).toBeCalledTimes(13);
  });

  it("should create default dtos for entity only if not already created", async () => {
    const mockServiceFindMany = jest.spyOn(service, "findMany");

    const expectedExistingModuleDto: ModuleDto = {
      dtoType: EnumModuleDtoType.Entity,
      blockType: "ModuleDto",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      description: "the Example entity model",
      displayName: "ExampleEntity",
      enabled: true,
      id: "exampleDtoId",
      inputParameters: null,
      name: "ExampleEntity",
      outputParameters: null,
      parentBlock: null,
      versionNumber: 0,
      properties: [],
    };
    mockServiceFindMany.mockResolvedValue([expectedExistingModuleDto]);

    expect(
      await service.createDefaultDtosForEntityModule(
        EXAMPLE_ENTITY,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([
      {
        dtoType: EnumModuleDtoType.CountArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity count",
        displayName: "ExampleEntityCountArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityCountArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.CreateArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity creation",
        displayName: "CreateExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "CreateExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.CreateInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity creation",
        displayName: "ExampleEntityCreateInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityCreateInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.DeleteArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity deletion",
        displayName: "DeleteExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "DeleteExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.FindManyArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity search",
        displayName: "ExampleEntityFindManyArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityFindManyArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.FindOneArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity retrieval",
        displayName: "ExampleEntityFindUniqueArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityFindUniqueArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.ListRelationFilter,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity relation filter",
        displayName: "ExampleEntityListRelationFilter",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityListRelationFilter",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.OrderByInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity sorting",
        displayName: "ExampleEntityOrderByInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityOrderByInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.UpdateArgs,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Args type for Example entity update",
        displayName: "UpdateExampleEntityArgs",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "UpdateExampleEntityArgs",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.UpdateInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity update",
        displayName: "ExampleEntityUpdateInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityUpdateInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.WhereInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity search",
        displayName: "ExampleEntityWhereInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityWhereInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
      {
        dtoType: EnumModuleDtoType.WhereUniqueInput,
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Input type for Example entity retrieval",
        displayName: "ExampleEntityWhereUniqueInput",
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityWhereUniqueInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        versionNumber: 0,
      },
    ]);
    expect(mockServiceFindMany).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledTimes(12);
  });

  it("should update default dtos for entity", async () => {
    await service.updateDefaultDtosForEntityModule(
      EXAMPLE_ENTITY,
      EXAMPLE_MODULE,
      EXAMPLE_USER
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should update default dtos for relation field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([
      {
        ...EXAMPLE_DTO,
        id: "shouldBeUpdated",
        name: "shouldBeUpdated",
        dtoType: EnumModuleDtoType.CreateNestedManyInput,
      },
    ]);

    await service.updateDefaultDtosForRelatedEntity(
      EXAMPLE_ENTITY,
      EXAMPLE_ENTITY_FIELD,
      { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
      EXAMPLE_MODULE.id,
      EXAMPLE_USER
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(
      {
        where: {
          id: "shouldBeUpdated",
        },
        data: {
          description:
            "Input type for Example entity creation with related ExampleEntity",
          displayName:
            "ExampleEntityCreateNestedManyWithoutExampleEntitiesInput",
          enabled: true,
          dtoType: "CreateNestedManyInput",
          name: "ExampleEntityCreateNestedManyWithoutExampleEntitiesInput",
          properties: [],
        },
      },
      EXAMPLE_USER,
      undefined
    );
  });

  it("should create default dtos for relation field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    expect(
      await service.createDefaultDtosForRelatedEntity(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_FIELD,
        { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([
      {
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        description:
          "Input type for Example entity creation with related ExampleEntity",
        displayName: "ExampleEntityCreateNestedManyWithoutExampleEntitiesInput",
        dtoType: EnumModuleDtoType.CreateNestedManyInput,
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityCreateNestedManyWithoutExampleEntitiesInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        updatedAt: expect.any(Date),
        versionNumber: 0,
        relatedEntityId: "relatedEntityId",
      },
      {
        blockType: "ModuleDto",
        createdAt: expect.any(Date),
        description: "Input type for Example entity retrieval",
        displayName: "ExampleEntityUpdateManyWithoutExampleEntitiesInput",
        dtoType: EnumModuleDtoType.UpdateNestedManyInput,
        enabled: true,
        id: "exampleDtoId",
        inputParameters: null,
        name: "ExampleEntityUpdateManyWithoutExampleEntitiesInput",
        outputParameters: null,
        parentBlock: null,
        properties: [],
        updatedAt: expect.any(Date),
        versionNumber: 0,
        relatedEntityId: "relatedEntityId",
      },
    ]);

    expect(blockServiceCreateMock).toBeCalledTimes(2);
  });

  it("should not create default dtos for relation field when it is not one-to-many ", async () => {
    const entityField: EntityField = {
      ...EXAMPLE_ENTITY_FIELD,
      properties: {
        relatedEntityId: "exampleRelatedEntityId",
        allowMultipleSelection: false,
        relatedFieldId: "relatedFieldId",
      },
    };

    expect(
      await service.createDefaultDtosForRelatedEntity(
        EXAMPLE_ENTITY,
        entityField,
        { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([]);
  });

  it("should not update default dtos for relation field when it is not one-to-many ", async () => {
    const entityField: EntityField = {
      ...EXAMPLE_ENTITY_FIELD,
      properties: {
        relatedEntityId: "exampleRelatedEntityId",
        allowMultipleSelection: false,
        relatedFieldId: "relatedFieldId",
      },
    };

    expect(
      await service.updateDefaultDtosForRelatedEntity(
        EXAMPLE_ENTITY,
        entityField,
        { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual(null);
  });

  it("should create the dtos for related entity when trying to update the field but the DTOs are missing ", async () => {
    //we set the mock twice to make sure it will return an empty array in the update and create functions
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    await service.updateDefaultDtosForRelatedEntity(
      EXAMPLE_ENTITY,
      EXAMPLE_ENTITY_FIELD,
      { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
      EXAMPLE_MODULE.id,
      EXAMPLE_USER
    );

    expect(blockServiceCreateMock).toBeCalledTimes(2);
  });

  it("should delete default dtos for relation field", async () => {
    const dtoToBeDeleted = {
      ...EXAMPLE_DTO,
      id: "shouldBeDeleted",
      name: "shouldBeDeleted",
      dtoType: EnumModuleDtoType.CreateNestedManyInput,
    };

    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([
      dtoToBeDeleted,
    ]);

    const args: DeleteModuleDtoArgs = {
      where: {
        id: "shouldBeDeleted",
      },
    };
    await service.deleteDefaultDtosForRelatedEntity(
      EXAMPLE_ENTITY_FIELD,
      { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
      EXAMPLE_MODULE.id,
      EXAMPLE_USER
    );
    expect(blockServiceDeleteMock).toBeCalledTimes(1);
    expect(blockServiceDeleteMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      true,
      true
    );
  });

  it("should create dto property", async () => {
    await service.createDtoProperty(
      {
        data: {
          moduleDto: {
            connect: {
              id: EXAMPLE_DTO_ID,
            },
          },
          name: "propertyName",
        },
      },
      EXAMPLE_USER
    );

    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("createDtoProperty should throw an exception when dto not found", async () => {
    blockServiceFindOneMock.mockReturnValueOnce(null);

    await expect(
      service.createDtoProperty(
        {
          data: {
            moduleDto: {
              connect: {
                id: EXAMPLE_DTO_ID,
              },
            },
            name: "propertyName",
          },
        },
        EXAMPLE_USER
      )
    ).rejects.toThrow(
      new AmplicationError(`Module DTO not found, ID: ${EXAMPLE_DTO_ID}`)
    );
  });

  it("createDtoProperty should throw an exception when property name already being used", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      properties: [
        {
          name: "existingPropertyName",
          propertyTypes: [],
          isOptional: false,
          isArray: false,
        },
      ],
    });

    const args = {
      data: {
        moduleDto: {
          connect: {
            id: EXAMPLE_DTO_ID,
          },
        },
        name: "existingPropertyName",
      },
    };

    await expect(service.createDtoProperty(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Property already exists, name: ${args.data.name}, DTO ID: ${args.data.moduleDto.connect.id}`
      )
    );
  });

  it("should throw an error when adding a property on default DTOs", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      dtoType: EnumModuleDtoType.CreateArgs,
    });
    await expect(
      service.createDtoProperty(
        {
          data: {
            moduleDto: {
              connect: {
                id: EXAMPLE_DTO_ID,
              },
            },
            name: "propertyName",
          },
        },
        EXAMPLE_USER
      )
    ).rejects.toThrow(
      new AmplicationError("Cannot add properties on default DTOs")
    );
  });

  it("should update dto property", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      properties: [
        {
          name: "propertyName",
          propertyTypes: [],
          isOptional: false,
          isArray: false,
        },
      ],
    });

    await service.updateDtoProperty(
      {
        where: {
          moduleDto: {
            id: EXAMPLE_DTO_ID,
          },
          propertyName: "propertyName",
        },
        data: {
          name: "propertyName",
          propertyTypes: [],
          isOptional: false,
          isArray: false,
        },
      },
      EXAMPLE_USER
    );

    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should throw an error when updating a missing property", async () => {
    const args = {
      where: {
        moduleDto: {
          id: EXAMPLE_DTO_ID,
        },
        propertyName: "propertyName",
      },
      data: {
        name: "propertyName",
        propertyTypes: [],
        isOptional: false,
        isArray: false,
      },
    };

    await expect(service.updateDtoProperty(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        `Property not found, name: ${args.where.propertyName}, DTO ID: ${args.where.moduleDto.id}`
      )
    );
  });

  it("should delete dto property", async () => {
    blockServiceFindOneMock.mockReturnValueOnce({
      ...EXAMPLE_DTO,
      properties: [
        {
          name: "propertyName",
          propertyTypes: [],
          isOptional: false,
          isArray: false,
        },
      ],
    });

    await service.deleteDtoProperty(
      {
        where: {
          moduleDto: {
            id: EXAMPLE_DTO_ID,
          },
          propertyName: "propertyName",
        },
      },
      EXAMPLE_USER
    );

    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should create default dto for enum field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

    expect(
      await service.createDefaultDtoForEnumField(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_ENUM_FIELD,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual({
      blockType: "ModuleDto",
      createdAt: expect.any(Date),
      description:
        "Enum type for field exampleEntityFieldName of Example entity model",
      displayName: "EnumExampleEntityExampleEntityFieldName",
      dtoType: EnumModuleDtoType.Enum,
      enabled: true,
      id: "exampleDtoId",
      inputParameters: null,
      name: "EnumExampleEntityExampleEntityFieldName",
      outputParameters: null,
      parentBlock: null,
      properties: [],
      updatedAt: expect.any(Date),
      versionNumber: 0,
      relatedFieldId: "examplePermanentId",
    });

    expect(blockServiceCreateMock).toBeCalledTimes(1);
  });

  it("should update default dto for enum field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([
      {
        ...EXAMPLE_DTO,
        id: "shouldBeUpdated",
        name: "shouldBeUpdated",
        dtoType: EnumModuleDtoType.CreateNestedManyInput,
      },
    ]);

    await service.updateDefaultDtoForEnumField(
      EXAMPLE_ENTITY,
      EXAMPLE_ENTITY_ENUM_FIELD,
      EXAMPLE_MODULE.id,
      EXAMPLE_USER
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(
      {
        where: {
          id: "shouldBeUpdated",
        },
        data: {
          description:
            "Enum type for field exampleEntityFieldName of Example entity model",
          displayName: "EnumExampleEntityExampleEntityFieldName",
          enabled: true,
          dtoType: "Enum",
          name: "EnumExampleEntityExampleEntityFieldName",
          properties: [],
          members: [],
        },
      },
      EXAMPLE_USER,
      undefined
    );
  });

  it("should delete default dto for enum field", async () => {
    const dtoToBeDeleted = {
      ...EXAMPLE_DTO,
      id: "shouldBeDeleted",
      name: "shouldBeDeleted",
      dtoType: EnumModuleDtoType.CreateNestedManyInput,
    };

    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([
      dtoToBeDeleted,
    ]);

    const args: DeleteModuleDtoArgs = {
      where: {
        id: "shouldBeDeleted",
      },
    };
    await service.deleteDefaultDtoForEnumField(
      EXAMPLE_ENTITY_ENUM_FIELD,
      EXAMPLE_MODULE.id,
      EXAMPLE_USER
    );
    expect(blockServiceDeleteMock).toBeCalledTimes(1);
    expect(blockServiceDeleteMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      true,
      true
    );
  });

  it("should not allow manipulating custom actions the feature is disabled", async () => {
    service.customActionsEnabled = false;

    const args: CreateModuleDtoArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_DTO_DESCRIPTION,
        displayName: EXAMPLE_DTO_DISPLAY_NAME,
        name: EXAMPLE_DTO_NAME,
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(null);
    expect(
      await service.createDefaultDtosForEntityModule(
        EXAMPLE_ENTITY,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([]);
    expect(
      await service.updateDefaultDtosForEntityModule(
        EXAMPLE_ENTITY,
        EXAMPLE_MODULE,
        EXAMPLE_USER
      )
    ).toEqual([]);
    expect(
      await service.createDefaultDtosForRelatedEntity(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_FIELD,
        { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([]);
    expect(
      await service.updateDefaultDtosForRelatedEntity(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_FIELD,
        { ...EXAMPLE_ENTITY, id: "relatedEntityId" },
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual([]);
    expect(
      await service.createDefaultDtoForEnumField(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_ENUM_FIELD,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual(null);
    expect(
      await service.updateDefaultDtoForEnumField(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_ENUM_FIELD,
        EXAMPLE_MODULE.id,
        EXAMPLE_USER
      )
    ).toEqual(null);
    expect(await service.createEnum(args, EXAMPLE_USER)).toEqual(null);
  });
});
