import { EnumModuleDtoType } from "./dto/EnumModuleDtoType";
import { Test, TestingModule } from "@nestjs/testing";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumDataType } from "../../enums/EnumDataType";
import { AmplicationError } from "../../errors/AmplicationError";
import { Account, Entity, EntityField, User } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";
import { BlockService } from "../block/block.service";
import { EntityService } from "../entity/entity.service";
import { Module } from "../module/dto/Module";
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { ModuleDtoService } from "./moduleDto.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";

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

const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_DTO;
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
      dtoType: EnumModuleDtoType.Custom,
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
            findManyByBlockTypeAndSettings:
              blockServiceFindManyByBlockTypeAndSettingsMock,
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
    expect(await service.createEnum(args, EXAMPLE_USER)).toEqual(EXAMPLE_DTO);
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.ModuleDto,
          enabled: true,
          dtoType: EnumModuleDtoType.CustomEnum,
          properties: [],
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

  it("should throw an error when updating the name of a default dto", async () => {
    //return a default dto
    blockServiceFindOneMock.mockReturnValue({
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
        EXAMPLE_MODULE,
        EXAMPLE_USER
      )
    ).toEqual([
      {
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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
        dtoType: "Custom",
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

  it("should update default dtos for entity", async () => {
    await service.updateDefaultDtosForEntityModule(
      EXAMPLE_ENTITY,
      EXAMPLE_MODULE,
      EXAMPLE_USER
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should update default dtos for relation field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValue([
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
});
