import { EnumModuleActionType } from "@amplication/code-gen-types";
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
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { EnumModuleActionGqlOperation } from "./dto/EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./dto/EnumModuleActionRestVerb";
import { ModuleAction } from "./dto/ModuleAction";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { ModuleActionService } from "./moduleAction.service";
import { kebabCase } from "lodash";
import { EnumModuleDtoPropertyType } from "../moduleDto/dto/propertyTypes/EnumModuleDtoPropertyType";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingService } from "../billing/billing.service";
import { billingServiceGetBooleanEntitlementMock } from "../block/blockType.service.spec";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { subscriptionServiceFindOneMock } from "../module/module.service.spec";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";

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

const EXAMPLE_ACTION_NAME = "createCustomer";
const EXAMPLE_DEFAULT_ACTION_NAME = "defaultActionCreateCustomer";
const EXAMPLE_INVALID_ACTION_NAME = "create Customer";
const EXAMPLE_ACTION_DISPLAY_NAME = "Create Customer";
const EXAMPLE_ACTION_DESCRIPTION = "Create One Customer";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_DEFAULT_ACTION_ID = "exampleDefaultActionId";
const EXAMPLE_DTO_ID = "exampleDtoId";

const EXAMPLE_ACTION: ModuleAction = {
  id: EXAMPLE_ACTION_ID,
  actionType: EnumModuleActionType.Custom,
  name: EXAMPLE_ACTION_NAME,
  displayName: EXAMPLE_ACTION_DISPLAY_NAME,
  description: EXAMPLE_ACTION_DESCRIPTION,
  enabled: true,
  gqlOperation: EnumModuleActionGqlOperation.Query,
  restVerb: EnumModuleActionRestVerb.Get,
  path: `/:id/${kebabCase(EXAMPLE_ACTION_NAME)}`,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.ModuleAction,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
  outputType: {
    type: EnumModuleDtoPropertyType.String,
    dtoId: "",
    isArray: false,
  },
  inputType: {
    type: EnumModuleDtoPropertyType.String,
    dtoId: "",
    isArray: false,
  },
};

const EXAMPLE_DEFAULT_ACTION: ModuleAction = {
  id: EXAMPLE_DEFAULT_ACTION_ID,
  actionType: EnumModuleActionType.Create,
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_DEFAULT_ACTION_NAME,
  displayName: EXAMPLE_ACTION_DISPLAY_NAME,
  description: EXAMPLE_ACTION_DESCRIPTION,
  enabled: false,
  gqlOperation: EnumModuleActionGqlOperation.Query,
  restVerb: EnumModuleActionRestVerb.Get,
  path: `/:id/${kebabCase(EXAMPLE_ACTION_NAME)}`,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.ModuleAction,
  inputParameters: undefined,
  outputParameters: undefined,
  versionNumber: 0,
  outputType: {
    type: EnumModuleDtoPropertyType.String,
    dtoId: "",
    isArray: false,
  },
  inputType: {
    type: EnumModuleDtoPropertyType.String,
    dtoId: "",
    isArray: false,
  },
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

const blockServiceFindOneMock = jest.fn((args: FindOneArgs): ModuleAction => {
  if (args.where.id === EXAMPLE_ACTION_ID) {
    return EXAMPLE_ACTION;
  } else return EXAMPLE_DEFAULT_ACTION;
});

const blockServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_ACTION;
});

const blockServiceCreateMock = jest.fn(
  (args: CreateModuleActionArgs): ModuleAction => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resource, parentBlock, ...data } = args.data;

    return {
      ...data,
      id: EXAMPLE_ACTION_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      blockType: EnumBlockType.ModuleAction,
      enabled: true,
      actionType: EnumModuleActionType.Custom,
      versionNumber: 0,
      parentBlock: null,
      description: data.description,
      inputParameters: null,
      outputParameters: null,
      path: data.path as string,
      gqlOperation:
        data.gqlOperation as keyof typeof EnumModuleActionGqlOperation,
      restVerb: data.restVerb as keyof typeof EnumModuleActionRestVerb,
    };
  }
);

const blockServiceUpdateMock = jest.fn(
  (args: UpdateModuleActionArgs): ModuleAction => {
    if (args.where.id === EXAMPLE_ACTION_ID) {
      return EXAMPLE_ACTION;
    }
    return EXAMPLE_DEFAULT_ACTION;
  }
);

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => {
  return [
    {
      ...EXAMPLE_ACTION,
      actionType: EnumModuleActionType.Create,
    },
  ];
});

describe("ModuleActionService", () => {
  let service: ModuleActionService;

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
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            trackWithContext: jest.fn(() => {
              return null;
            }),
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
          provide: ModuleDtoService,
          useClass: jest.fn(() => ({
            validateTypes: jest.fn(() => {
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
        ModuleActionService,
      ],
    }).compile();

    service = module.get<ModuleActionService>(ModuleActionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create one action", async () => {
    const args: CreateModuleActionArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        description: EXAMPLE_ACTION_DESCRIPTION,
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        name: EXAMPLE_ACTION_NAME,
      },
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(EXAMPLE_ACTION);
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(
      {
        ...args,
        data: {
          ...args.data,
          blockType: EnumBlockType.ModuleAction,
          enabled: true,
          actionType: EnumModuleActionType.Custom,
          gqlOperation: EnumModuleActionGqlOperation.Query,
          restVerb: EnumModuleActionRestVerb.Get,
          path: `/:id/${kebabCase(args.data.name)}`,
          outputType: {
            type: EnumModuleDtoPropertyType.String,
            dtoId: "",
            isArray: false,
          },
          inputType: {
            type: EnumModuleDtoPropertyType.String,
            dtoId: "",
            isArray: false,
          },
        },
      },
      EXAMPLE_USER_ID
    );
  });

  it("should throw an error when creating an action with invalid name", async () => {
    const args: CreateModuleActionArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        name: EXAMPLE_INVALID_ACTION_NAME,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        restVerb: EnumModuleActionRestVerb.Post,
        path: ``,
      },
    };
    await expect(service.create(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Invalid moduleAction name")
    );
  });
  it("should get one action", async () => {
    const args: FindOneArgs = {
      where: {
        id: EXAMPLE_ACTION_ID,
      },
    };

    const result = await service.findOne(args);
    expect(result).toEqual(EXAMPLE_ACTION);
    expect(blockServiceFindOneMock).toBeCalledTimes(1);
    expect(blockServiceFindOneMock).toBeCalledWith(args);
  });

  it("should update one action", async () => {
    const args: UpdateModuleActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID,
      },
      data: {
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        name: EXAMPLE_ACTION_NAME,
        enabled: true,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        restVerb: EnumModuleActionRestVerb.Post,
        path: ``,
        inputType: {
          type: EnumModuleDtoPropertyType.Dto,
          isArray: false,
          dtoId: EXAMPLE_DTO_ID,
        },
        outputType: {
          type: EnumModuleDtoPropertyType.Boolean,
          isArray: false,
        },
      },
    };
    expect(await service.update(args, EXAMPLE_USER)).toEqual(EXAMPLE_ACTION);
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      undefined
    );
  });

  it("should update one default action", async () => {
    const args: UpdateModuleActionArgs = {
      where: {
        id: EXAMPLE_DEFAULT_ACTION_ID,
      },
      data: {
        description: "",
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        enabled: false,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        name: EXAMPLE_DEFAULT_ACTION_NAME,
        restVerb: EnumModuleActionRestVerb.Post,
      },
    };

    expect(await service.update(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_DEFAULT_ACTION
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);

    expect(blockServiceUpdateMock).toBeCalledWith(
      args,
      EXAMPLE_USER,
      undefined
    );
  });

  it("should throw an error when updating an input type of a default action", async () => {
    const args: UpdateModuleActionArgs = {
      where: {
        id: EXAMPLE_DEFAULT_ACTION_ID,
      },
      data: {
        description: "",
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        enabled: false,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        name: EXAMPLE_DEFAULT_ACTION_NAME,
        restVerb: EnumModuleActionRestVerb.Post,
        inputType: {
          type: EnumModuleDtoPropertyType.Dto,
          isArray: false,
          dtoId: EXAMPLE_DTO_ID,
        },
      },
    };

    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        "Cannot update the input type of a default Action for entity."
      )
    );
  });

  it("should throw an error when updating an action with invalid name", async () => {
    const args: UpdateModuleActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID,
      },
      data: {
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        name: EXAMPLE_INVALID_ACTION_NAME,
        enabled: true,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        restVerb: EnumModuleActionRestVerb.Post,
        path: ``,
      },
    };
    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError("Invalid moduleAction name")
    );
  });

  it("should throw an error when updating the name of a default action", async () => {
    //return a default action
    blockServiceFindOneMock.mockReturnValue({
      ...EXAMPLE_ACTION,
      actionType: EnumModuleActionType.Create,
    });

    const args: UpdateModuleActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID,
      },
      data: {
        displayName: EXAMPLE_ACTION_DISPLAY_NAME,
        name: "newName",
        enabled: false,
        gqlOperation: EnumModuleActionGqlOperation.Mutation,
        restVerb: EnumModuleActionRestVerb.Post,
        path: ``,
      },
    };

    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrow(
      new AmplicationError(
        "Cannot update the name of a default Action for entity."
      )
    );
  });

  it("should create default actions for entity", async () => {
    expect(
      await service.createDefaultActionsForEntityModule(
        EXAMPLE_ENTITY,
        EXAMPLE_MODULE,
        EXAMPLE_USER
      )
    ).toEqual([
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Meta data about Example entity records",
        displayName: "exampleEntities Meta",
        enabled: true,
        gqlOperation: "Query",
        id: "exampleActionId",
        inputParameters: null,
        name: "_exampleEntitiesMeta",
        outputParameters: null,
        parentBlock: null,
        path: "/meta",
        restVerb: "Get",
        versionNumber: 0,
      },
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Create one Example entity",
        displayName: "Create Example entity",
        enabled: true,
        gqlOperation: "Mutation",
        id: "exampleActionId",
        inputParameters: null,
        name: "createExampleEntity",
        outputParameters: null,
        parentBlock: null,
        path: "",
        restVerb: "Post",
        versionNumber: 0,
      },
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Get one Example entity",
        displayName: "Get Example entity",
        enabled: true,
        gqlOperation: "Query",
        id: "exampleActionId",
        inputParameters: null,
        name: "exampleEntity",
        outputParameters: null,
        parentBlock: null,
        path: "/:id",
        restVerb: "Get",
        versionNumber: 0,
      },
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Update one Example entity",
        displayName: "Update Example entity",
        enabled: true,
        gqlOperation: "Mutation",
        id: "exampleActionId",
        inputParameters: null,
        name: "updateExampleEntity",
        outputParameters: null,
        parentBlock: null,
        path: "/:id",
        restVerb: "Patch",
        versionNumber: 0,
      },
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Delete one Example entity",
        displayName: "Delete Example entity",
        enabled: true,
        gqlOperation: "Mutation",
        id: "exampleActionId",
        inputParameters: null,
        name: "deleteExampleEntity",
        outputParameters: null,
        parentBlock: null,
        path: "/:id",
        restVerb: "Delete",
        versionNumber: 0,
      },
      {
        actionType: "Custom",
        blockType: "ModuleAction",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        description: "Find many exampleEntities",
        displayName: "Find exampleEntities",
        enabled: true,
        gqlOperation: "Query",
        id: "exampleActionId",
        inputParameters: null,
        name: "exampleEntities",
        outputParameters: null,
        parentBlock: null,
        path: "",
        restVerb: "Get",
        versionNumber: 0,
      },
    ]);
    expect(blockServiceCreateMock).toBeCalledTimes(6);
  });

  it("should update default actions for entity", async () => {
    await service.updateDefaultActionsForEntityModule(
      EXAMPLE_ENTITY,
      EXAMPLE_MODULE,
      EXAMPLE_USER
    );
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
  });

  it("should update default actions for relation field", async () => {
    blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValue([
      {
        ...EXAMPLE_ACTION,
        id: "shouldBeUpdated",
        name: "shouldBeUpdated",
        actionType: EnumModuleActionType.ChildrenFind,
      },
      {
        ...EXAMPLE_ACTION,
        id: "shouldBeDeleted",
        name: "shouldBeDeleted",
        actionType: EnumModuleActionType.ParentGet,
      },
    ]);

    await service.updateDefaultActionsForRelationField(
      EXAMPLE_ENTITY,
      EXAMPLE_ENTITY_FIELD,
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
            "Find multiple exampleEntityFieldDisplayName records for Example entity",
          displayName: "Example entity Find exampleEntityFieldDisplayName",
          enabled: true,
          gqlOperation: "Query",
          name: "findExampleEntityFieldName",
          path: "/:id/example-entity-field-name",
          restVerb: "Get",
        },
      },
      EXAMPLE_USER,
      undefined
    );

    expect(blockServiceDeleteMock).toBeCalledTimes(1);
    expect(blockServiceDeleteMock).toBeCalledWith(
      {
        where: {
          id: "shouldBeDeleted",
        },
      },
      EXAMPLE_USER,
      true,
      true
    );

    expect(blockServiceCreateMock).toBeCalledTimes(3);
  });
});
