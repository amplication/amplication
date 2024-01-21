import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService, Prisma, EnumEntityAction } from "../../prisma";
import { camelCase } from "camel-case";
import { pick, omit } from "lodash";
import {
  createEntityNamesWhereInput,
  EntityPendingChange,
  EntityService,
  NAME_VALIDATION_ERROR_MESSAGE,
  NUMBER_WITH_INVALID_MINIMUM_VALUE,
} from "./entity.service";
import {
  Entity,
  EntityVersion,
  EntityField,
  User,
  Commit,
  Resource,
  Account,
} from "../../models";
import { EnumDataType } from "../../enums/EnumDataType";
import { FindManyEntityArgs } from "./dto";
import { CURRENT_VERSION_NUMBER, DEFAULT_PERMISSIONS } from "./constants";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { DiffModule } from "../../services/diff.module";
import { prepareDeletedItemName } from "../../util/softDelete";
import {
  EnumPendingChangeAction,
  EnumPendingChangeOriginType,
} from "../resource/dto";
import { DiffService } from "../../services/diff.service";
import { isReservedName } from "./reservedNames";
import { ReservedNameError } from "../resource/ReservedNameError";
import { EnumResourceType } from "@amplication/code-gen-types/models";
import { Build } from "../build/dto/Build";
import { Environment } from "../environment/dto";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { PrismaSchemaParserService } from "../prismaSchemaParser/prismaSchemaParser.service";
import { BillingService } from "../billing/billing.service";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ModuleService } from "../module/module.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { MeteredEntitlement } from "@stigg/node-server-sdk";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_DESCRIPTION = "exampleDescription";
const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_ENVIRONMENT_ID = "exampleEnvironmentId";
const EXAMPLE_ADDRESS = "exampleAddress";
const EXAMPLE_PROJECT_ID = "exampleProjectId";
const EXAMPLE_ENTITY_ID = "exampleEntityId";
const EXAMPLE_CURRENT_ENTITY_VERSION_ID = "currentEntityVersionId";
const EXAMPLE_LAST_ENTITY_VERSION_ID = "lastEntityVersionId";
const EXAMPLE_LAST_ENTITY_VERSION_NUMBER = 4;
const EXAMPLE_ACTION = EnumEntityAction.View;
const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_MESSAGE = "exampleMessage";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleFieldName";
const EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME = "nonExistingFieldName";

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
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

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS,
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "exampleResource",
  name: "exampleEntity",
  displayName: "example entity",
  pluralDisplayName: "exampleEntities",
  customAttributes: "customAttributes",
  description: "example entity",
  lockedByUserId: undefined,
  lockedAt: null,
};

const EXAMPLE_LOCKED_ENTITY: Entity = {
  ...EXAMPLE_ENTITY,
  lockedByUserId: EXAMPLE_USER_ID,
  lockedAt: new Date(),
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: "exampleEntityField",
  permanentId: "exampleEntityFieldPermanentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  entityVersionId: "exampleEntityVersion",
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "example field",
  dataType: EnumDataType.SingleLineText,
  properties: null,
  required: true,
  unique: false,
  searchable: true,
  description: "example field",
  customAttributes: "ExampleCustomAttributes",
};

const EXAMPLE_CURRENT_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: "exampleEntity",
  versionNumber: CURRENT_VERSION_NUMBER,
  commitId: null,
  name: "exampleEntity",
  displayName: "example entity",
  pluralDisplayName: "exampleEntities",
  customAttributes: "customAttributes",
  description: "example entity",
};

const EXAMPLE_DELETED_ENTITY = {
  ...EXAMPLE_ENTITY,
  versions: [EXAMPLE_CURRENT_ENTITY_VERSION],
  deletedAt: new Date(),
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
  project: {
    id: EXAMPLE_PROJECT_ID,
    workspaceId: "exampleWorkspaceId",
    name: "exampleProjectName",
    createdAt: new Date(),
    updatedAt: new Date(),
    useDemoRepo: false,
    licensed: true,
  },
};

const EXAMPLE_ENTITY_PENDING_CHANGE_DELETE: EntityPendingChange = {
  originId: EXAMPLE_ENTITY.id,
  action: EnumPendingChangeAction.Delete,
  originType: EnumPendingChangeOriginType.Entity,
  versionNumber: 1,
  origin: EXAMPLE_DELETED_ENTITY,
  resource: EXAMPLE_RESOURCE,
};
const EXAMPLE_ENTITY_PENDING_CHANGE_UPDATE: EntityPendingChange = {
  originId: EXAMPLE_ENTITY.id,
  action: EnumPendingChangeAction.Update,
  originType: EnumPendingChangeOriginType.Entity,
  versionNumber: 1,
  origin: EXAMPLE_ENTITY,
  resource: EXAMPLE_RESOURCE,
};
const EXAMPLE_ENTITY_PENDING_CHANGE_CREATE: EntityPendingChange = {
  originId: EXAMPLE_ENTITY.id,
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Entity,
  versionNumber: 1,
  origin: EXAMPLE_ENTITY,
  resource: EXAMPLE_RESOURCE,
};

const EXAMPLE_LAST_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_LAST_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: "exampleEntity",
  versionNumber: EXAMPLE_LAST_ENTITY_VERSION_NUMBER,
  commitId: EXAMPLE_COMMIT_ID,
  name: "exampleEntity",
  displayName: "example entity",
  pluralDisplayName: "exampleEntities",
  customAttributes: "customAttributes",
  description: "example entity",
  fields: [
    {
      ...EXAMPLE_ENTITY_FIELD,
      entityVersionId: EXAMPLE_LAST_ENTITY_VERSION_ID,
    },
  ],
};

const EXAMPLE_ENTITY_FIELD_DATA = {
  name: "exampleEntityFieldName",
  displayName: "Example Entity Field Display Name",
  required: false,
  unique: false,
  searchable: false,
  description: "",
  customAttributes: "ExampleCustomAttributes",
  dataType: EnumDataType.SingleLineText,
  properties: {
    maxLength: 42,
  },
  entityVersion: {
    connect: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      entityId_versionNumber: {
        entityId: EXAMPLE_ENTITY_ID,
        versionNumber: CURRENT_VERSION_NUMBER,
      },
    },
  },
};

const EXAMPLE_ENTITY_FIELD_DATA_WITH_INVALID_MINIMUM_VALUE = {
  name: "exampleEntityFieldNameWithInvalidMinimumValue",
  displayName: "Example Entity Field Display Name With Invalid Minimum Value",
  dataType: EnumDataType.WholeNumber,
  properties: { maximumValue: 10, minimumValue: 10 },
  required: false,
  unique: false,
  searchable: true,
  description: "",
  customAttributes: "ExampleCustomAttributes",
};
const EXAMPLE_ENTITY_FIELD_DATA_WITH_VALID_MINIMUM_VALUE = {
  name: "exampleEntityFieldNameWithInvalidMinimumValue",
  displayName: "Example Entity Field Display Name With Invalid Minimum Value",
  dataType: EnumDataType.WholeNumber,
  properties: { maximumValue: 10, minimumValue: 1 },
  required: false,
  unique: false,
  searchable: true,
  description: "",
  customAttributes: "ExampleCustomAttributes",
};
const EXAMPLE_ENTITY_FIELD_WHOLE_NUMBER: EntityField = {
  createdAt: new Date(),
  dataType: "SingleLineText",
  description: "example field",
  displayName: "example field",
  entityVersionId: "exampleEntityVersion",
  id: "exampleEntityField",
  name: "exampleFieldName",
  permanentId: "exampleEntityFieldPermanentId",
  properties: null,
  required: true,
  searchable: true,
  unique: false,
  updatedAt: new Date(),
  customAttributes: "ExampleCustomAttributes",
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
  isOwner: true,
  account: EXAMPLE_ACCOUNT,
};

const RESERVED_NAME = "class";
const UNRESERVED_NAME = "person";

const EXAMPLE_ENTITY_WHERE_PARENT_ID = { connect: { id: "EXAMPLE_ID" } };

const prismaResourceFindUniqueMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});

const prismaEntityFindFirstMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityFindUniqueMock = jest.fn(() => {
  return {
    ...EXAMPLE_ENTITY,
    resource: EXAMPLE_RESOURCE,
  };
});

const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});

const prismaEntityCreateMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityDeleteMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityUpdateMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityVersionFindOneMock = jest.fn(
  (args: Prisma.EntityVersionFindUniqueArgs) => {
    const entityVersionList = [
      EXAMPLE_CURRENT_ENTITY_VERSION,
      EXAMPLE_LAST_ENTITY_VERSION,
    ];

    const version = entityVersionList.find((item) => item.id == args.where.id);

    if (args.include?.fields) {
      version.fields = [
        {
          ...EXAMPLE_ENTITY_FIELD,
          entityVersionId: version.id,
        },
      ];
    }

    if (args.include?.permissions) {
      version.permissions = [];
    }

    return {
      then: (resolve) => resolve(version),
      commit: () => EXAMPLE_COMMIT,
    };
  }
);

const prismaEntityVersionFindManyMock = jest.fn(
  (args: Prisma.EntityVersionFindUniqueArgs) => {
    if (args.include?.entity) {
      return [
        { ...EXAMPLE_CURRENT_ENTITY_VERSION, entity: EXAMPLE_LOCKED_ENTITY },
        { ...EXAMPLE_LAST_ENTITY_VERSION, entity: EXAMPLE_LOCKED_ENTITY },
      ];
    } else {
      return [EXAMPLE_CURRENT_ENTITY_VERSION, EXAMPLE_LAST_ENTITY_VERSION];
    }
  }
);

const prismaEntityVersionCreateMock = jest.fn(
  (args: Prisma.EntityVersionCreateArgs) => {
    return {
      ...EXAMPLE_LAST_ENTITY_VERSION,
      versionNumber: args.data.versionNumber,
    };
  }
);
const prismaEntityVersionUpdateMock = jest.fn(() => {
  return EXAMPLE_CURRENT_ENTITY_VERSION;
});

const prismaEntityFieldFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY_FIELD];
});
const prismaEntityFieldDeleteMock = jest.fn(() => {
  return Promise.resolve(EXAMPLE_ENTITY_FIELD);
});

const prismaEntityFieldFindFirstMock = jest.fn(
  (args: Prisma.EntityFieldFindUniqueArgs) => {
    if (args?.include?.entityVersion) {
      return {
        ...EXAMPLE_ENTITY_FIELD,
        entityVersion: EXAMPLE_CURRENT_ENTITY_VERSION,
      };
    }
    return EXAMPLE_ENTITY_FIELD;
  }
);
const prismaEntityFieldCreateMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const prismaEntityFieldUpdateMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);

const prismaEntityPermissionFindManyMock = jest.fn(() => []);
const prismaEntityPermissionFieldDeleteManyMock = jest.fn(() => null);
const prismaEntityPermissionFieldFindManyMock = jest.fn(() => null);
const prismaEntityPermissionRoleDeleteManyMock = jest.fn(() => null);

const areDifferentMock = jest.fn(() => true);

/** methods mock */
const billingServiceIsBillingEnabledMock = jest.fn();

const billingServiceMock = {
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
    } as unknown as MeteredEntitlement;
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

describe("EntityService", () => {
  let service: EntityService;

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaEntityFindManyMock.mockImplementation(() => [EXAMPLE_ENTITY]);

    const module: TestingModule = await Test.createTestingModule({
      imports: [JsonSchemaValidationModule, DiffModule],
      providers: [
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            track: jest.fn(() => {
              return;
            }),
          })),
        },
        {
          provide: BillingService,
          useValue: billingServiceMock,
        },
        {
          provide: ServiceSettingsService,
          useClass: jest.fn(() => ({
            getServiceSettingsValues: jest.fn(() => {
              return {};
            }),
          })),
        },
        {
          provide: ModuleService,
          useClass: jest.fn(() => ({
            createDefaultModuleForEntity: jest.fn(() => {
              return {};
            }),
            deleteDefaultModuleForEntity: jest.fn(() => {
              return {};
            }),
            updateDefaultModuleForEntity: jest.fn(() => {
              return {};
            }),
            getDefaultModuleIdForEntity: jest.fn(() => {
              return "exampleModuleId";
            }),
          })),
        },
        {
          provide: ModuleActionService,
          useClass: jest.fn(() => ({
            createDefaultActionsForRelationField: jest.fn(() => {
              return [];
            }),
            deleteDefaultActionsForRelationField: jest.fn(() => {
              return [];
            }),
          })),
        },
        {
          provide: PrismaSchemaParserService,
          useClass: jest.fn(() => ({
            prepareEntities: jest.fn(() => {
              return;
            }),
            validateSchemaProcessing: jest.fn(() => {
              return;
            }),
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            resource: {
              findUnique: prismaResourceFindUniqueMock,
            },
            entity: {
              findFirst: prismaEntityFindFirstMock,
              findUnique: prismaEntityFindUniqueMock,
              findMany: prismaEntityFindManyMock,
              create: prismaEntityCreateMock,
              delete: prismaEntityDeleteMock,
              update: prismaEntityUpdateMock,
            },
            entityVersion: {
              findMany: prismaEntityVersionFindManyMock,
              create: prismaEntityVersionCreateMock,
              update: prismaEntityVersionUpdateMock,
              findUnique: prismaEntityVersionFindOneMock,
            },
            entityField: {
              findFirst: prismaEntityFieldFindFirstMock,
              create: prismaEntityFieldCreateMock,
              update: prismaEntityFieldUpdateMock,
              findMany: prismaEntityFieldFindManyMock,
              delete: prismaEntityFieldDeleteMock,
            },
            entityPermission: {
              findMany: prismaEntityPermissionFindManyMock,
            },
            entityPermissionField: {
              deleteMany: prismaEntityPermissionFieldDeleteManyMock,
              findMany: prismaEntityPermissionFieldFindManyMock,
            },
            entityPermissionRole: {
              deleteMany: prismaEntityPermissionRoleDeleteManyMock,
            },
          })),
        },
        EntityService,
        MockedAmplicationLoggerProvider,
      ],
    })
      .overrideProvider(DiffService)
      .useValue({ areDifferent: areDifferentMock })
      .compile();

    service = module.get<EntityService>(EntityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  test.each([
    [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME, [EXAMPLE_ENTITY_FIELD_NAME], []],
    [
      EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME,
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
    ],
    [
      EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME,
      [EXAMPLE_ENTITY_FIELD_NAME, EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
    ],
  ])(
    ".validateAllFieldsExist(%v, %v)",
    async (entityId, fieldNames, expected) => {
      expect(
        await service.validateAllFieldsExist(entityId, fieldNames)
      ).toEqual(new Set(expected));
    }
  );

  it("should find one entity", async () => {
    const args = {
      where: {
        id: EXAMPLE_ENTITY_ID,
      },
      version: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber,
    };
    expect(await service.entity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityFindFirstMock).toBeCalledTimes(1);
    expect(prismaEntityFindFirstMock).toBeCalledWith({
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    });
  });

  it("should find many entities", async () => {
    const args: FindManyEntityArgs = {};
    expect(await service.entities(args)).toEqual([EXAMPLE_ENTITY]);
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should create one entity", async () => {
    const createArgs = {
      args: {
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          description: EXAMPLE_ENTITY.description,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          customAttributes: EXAMPLE_ENTITY.customAttributes,
          resource: { connect: { id: EXAMPLE_ENTITY.resourceId } },
        },
      },
      user: EXAMPLE_USER,
    };
    const newEntityArgs = {
      data: {
        ...createArgs.args.data,
        lockedAt: expect.any(Date),
        lockedByUser: {
          connect: {
            id: createArgs.user.id,
          },
        },
        versions: {
          create: {
            commit: undefined,
            versionNumber: CURRENT_VERSION_NUMBER,
            name: createArgs.args.data.name,
            displayName: createArgs.args.data.displayName,
            pluralDisplayName: createArgs.args.data.pluralDisplayName,
            customAttributes: createArgs.args.data.customAttributes,
            description: createArgs.args.data.description,
            permissions: {
              create: DEFAULT_PERMISSIONS,
            },
          },
        },
      },
    };

    expect(
      await service.createOneEntity(createArgs.args, createArgs.user)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityCreateMock).toBeCalledTimes(1);
    expect(prismaEntityCreateMock).toBeCalledWith(newEntityArgs);
    expect(prismaEntityFieldCreateMock).toBeCalledTimes(3);
  });

  describe("service license", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe("when billing is not enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(false);
      });

      it("should not throw billing limitation error even when the project or the service is not licensed", async () => {
        const resource = {
          ...EXAMPLE_RESOURCE,
          licensed: false,
          project: { ...EXAMPLE_RESOURCE.project, licensed: false },
        };
        await expect(
          service.checkServiceLicense(resource)
        ).resolves.not.toThrow(BillingLimitationError);
      });
    });

    describe("when billing is enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(true);
      });

      it("should not throw billing limitation error when the project and the service within the project is under license", async () => {
        await expect(
          service.checkServiceLicense(EXAMPLE_RESOURCE) // in the example resource the project and the service are licensed
        ).resolves.not.toThrow(BillingLimitationError);
      });

      it("should throw billing limitation error when project license is false and the service license is true", async () => {
        const resource = {
          ...EXAMPLE_RESOURCE,
          licensed: true,
          project: { ...EXAMPLE_RESOURCE.project, licensed: false },
        };
        await expect(service.checkServiceLicense(resource)).rejects.toThrow(
          new BillingLimitationError(
            "Your workspace reached its service limitation.",
            BillingFeature.Services
          )
        );
      });

      it("should throw billing limitation error when project license is true and the service license is false", async () => {
        const resource = {
          ...EXAMPLE_RESOURCE,
          licensed: false,
          project: { ...EXAMPLE_RESOURCE.project, licensed: true },
        };
        await expect(service.checkServiceLicense(resource)).rejects.toThrow(
          new BillingLimitationError(
            "Your workspace reached its service limitation.",
            BillingFeature.Services
          )
        );
      });
    });
  });

  it("should not create an entity when the service in not under license", async () => {
    const createArgs = {
      args: {
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          description: EXAMPLE_ENTITY.description,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          customAttributes: EXAMPLE_ENTITY.customAttributes,
          resource: { connect: { id: EXAMPLE_ENTITY.resourceId } },
        },
      },
      user: EXAMPLE_USER,
    };

    prismaResourceFindUniqueMock.mockImplementation(() => {
      return {
        ...EXAMPLE_RESOURCE,
        licensed: false,
      };
    });

    await expect(
      service.createOneEntity(createArgs.args, createArgs.user)
    ).rejects.toThrow(
      new BillingLimitationError(
        "Your workspace reached its service limitation.",
        BillingFeature.Services
      )
    );
    expect(prismaEntityCreateMock).toBeCalledTimes(0);
    expect(prismaEntityFieldCreateMock).toBeCalledTimes(0);
  });

  it("should delete one entity", async () => {
    const deleteArgs = {
      args: {
        where: { id: EXAMPLE_ENTITY_ID },
      },
      user: EXAMPLE_USER,
    };

    const updateArgs = {
      where: deleteArgs.args.where,
      data: {
        name: prepareDeletedItemName(EXAMPLE_ENTITY.name, EXAMPLE_ENTITY.id),
        displayName: prepareDeletedItemName(
          EXAMPLE_ENTITY.displayName,
          EXAMPLE_ENTITY.id
        ),
        pluralDisplayName: prepareDeletedItemName(
          EXAMPLE_ENTITY.pluralDisplayName,
          EXAMPLE_ENTITY.id
        ),
        deletedAt: expect.any(Date),
        versions: {
          update: {
            where: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: deleteArgs.args.where.id,
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
            data: {
              deleted: true,
            },
          },
        },
      },
    };
    expect(
      await service.deleteOneEntity(deleteArgs.args, deleteArgs.user)
    ).toEqual(EXAMPLE_ENTITY);

    expect(prismaEntityFindFirstMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ENTITY_ID,
        deletedAt: null,
      },
    });

    expect(prismaEntityUpdateMock).toBeCalledWith(updateArgs);
  });

  it("should update one entity", async () => {
    const updateArgs = {
      args: {
        where: { id: EXAMPLE_ENTITY_ID },
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          customAttributes: EXAMPLE_ENTITY.customAttributes,
          description: EXAMPLE_ENTITY.description,
        },
      },
      user: EXAMPLE_USER,
    };

    expect(
      await service.updateOneEntity(updateArgs.args, updateArgs.user)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(2);
    expect(prismaEntityUpdateMock).toBeCalledWith({
      where: { ...updateArgs.args.where },
      data: {
        ...updateArgs.args.data,
        versions: {
          update: {
            where: {
              // eslint-disable-next-line  @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: updateArgs.args.where.id,
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
            data: {
              name: updateArgs.args.data.name,
              displayName: updateArgs.args.data.displayName,
              pluralDisplayName: updateArgs.args.data.pluralDisplayName,
              customAttributes: updateArgs.args.data.customAttributes,
              description: updateArgs.args.data.description,
            },
          },
        },
      },
    });
  });

  it("should get entity fields", async () => {
    const entity = {
      entityId: EXAMPLE_ENTITY_ID,
      versionNumber: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber,
      args: { where: {} },
    };
    const returnArgs = {
      ...entity.args,
      where: {
        ...entity.args.where,
        entityVersion: {
          entityId: entity.entityId,
          versionNumber: entity.versionNumber,
        },
      },
    };
    expect(await service.getFields(entity.entityId, entity.args)).toEqual([
      EXAMPLE_ENTITY_FIELD,
    ]);
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(returnArgs);
  });

  it("should create a new version", async () => {
    const args = {
      data: {
        commit: { connect: { id: EXAMPLE_LAST_ENTITY_VERSION.commitId } },
        entity: { connect: { id: EXAMPLE_ENTITY_ID } },
      },
    };
    const entityVersionFindManyArgs = {
      where: {
        entity: { id: EXAMPLE_ENTITY_ID },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
    };

    const nextVersionNumber = EXAMPLE_LAST_ENTITY_VERSION.versionNumber + 1;
    const entityVersionCreateArgs = {
      data: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        customAttributes: EXAMPLE_ENTITY.customAttributes,
        description: EXAMPLE_ENTITY.description,
        commit: {
          connect: {
            id: args.data.commit.connect.id,
          },
        },
        versionNumber: nextVersionNumber,
        entity: {
          connect: {
            id: args.data.entity.connect.id,
          },
        },
      },
    };

    const names = pick(EXAMPLE_LAST_ENTITY_VERSION, [
      "name",
      "displayName",
      "pluralDisplayName",
      "customAttributes",
      "description",
    ]);

    const entityVersionFindSourceArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true,
              },
            },
          },
        },
      },
    };
    const entityVersionFindTargetArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID,
      },
    };

    const updateEntityVersionWithFieldsArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID,
      },
      data: {
        entity: {
          update: {
            ...names,
            deletedAt: null,
          },
        },
        ...names,
        fields: {
          create: [omit(EXAMPLE_ENTITY_FIELD, ["id", "entityVersionId"])],
        },
      },
    };

    const updateEntityVersionWithPermissionsArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID,
      },
      data: {
        permissions: {
          create: [],
        },
      },
    };
    expect(await service.createVersion(args)).toEqual(
      EXAMPLE_CURRENT_ENTITY_VERSION
    );
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(
      entityVersionFindManyArgs
    );

    expect(prismaEntityVersionCreateMock).toBeCalledTimes(1);
    expect(prismaEntityVersionCreateMock).toBeCalledWith(
      entityVersionCreateArgs
    );

    expect(prismaEntityVersionFindOneMock).toBeCalledTimes(2);
    expect(prismaEntityVersionFindOneMock.mock.calls).toEqual([
      [entityVersionFindSourceArgs],
      [entityVersionFindTargetArgs],
    ]);

    expect(prismaEntityVersionUpdateMock).toBeCalledTimes(2);
    expect(prismaEntityVersionUpdateMock.mock.calls).toEqual([
      [updateEntityVersionWithFieldsArgs],
      [updateEntityVersionWithPermissionsArgs],
    ]);
  });

  it("should discard pending changes", async () => {
    const entityVersionFindManyArgs = {
      where: {
        entity: { id: EXAMPLE_ENTITY_ID },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
      include: {
        entity: true,
      },
    };

    const names = pick(EXAMPLE_LAST_ENTITY_VERSION, [
      "name",
      "displayName",
      "pluralDisplayName",
      "customAttributes",
      "description",
    ]);

    const entityVersionFindSourceArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID,
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true,
              },
            },
          },
        },
      },
    };
    const entityVersionFindTargetArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
      },
    };

    const updateEntityVersionWithFieldsArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
      },
      data: {
        entity: {
          update: {
            ...names,
            deletedAt: null,
          },
        },
        ...names,
        fields: {
          create: [omit(EXAMPLE_ENTITY_FIELD, ["id", "entityVersionId"])],
        },
      },
    };

    const updateEntityVersionWithPermissionsArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
      },
      data: {
        permissions: {
          create: [],
        },
      },
    };
    expect(
      await service.discardPendingChanges(
        EXAMPLE_ENTITY_PENDING_CHANGE_UPDATE,
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(
      entityVersionFindManyArgs
    );

    expect(prismaEntityVersionFindOneMock).toBeCalledTimes(2);
    expect(prismaEntityVersionFindOneMock.mock.calls).toEqual([
      [entityVersionFindSourceArgs],
      [entityVersionFindTargetArgs],
    ]);

    expect(prismaEntityVersionUpdateMock).toBeCalledTimes(3);
    expect(prismaEntityVersionUpdateMock.mock.calls).toEqual([
      [
        {
          where: {
            id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
          },
          data: {
            fields: {
              deleteMany: {
                entityVersionId: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
              },
            },
            permissions: {
              deleteMany: {
                entityVersionId: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
              },
            },
          },
        },
      ],
      [updateEntityVersionWithFieldsArgs],
      [updateEntityVersionWithPermissionsArgs],
    ]);
  });

  it("should get many versions", async () => {
    const args = {};
    expect(await service.getVersions(args)).toEqual([
      EXAMPLE_CURRENT_ENTITY_VERSION,
      EXAMPLE_LAST_ENTITY_VERSION,
    ]);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(args);
  });

  it("should validate that entity ID exists in the current resource and is persistent", async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      resourceId: EXAMPLE_ENTITY.resourceId,
    };
    const findManyArgs = {
      where: {
        id: args.entityId,
        resource: { id: args.resourceId },
        deletedAt: null,
      },
    };
    expect(
      await service.isEntityInSameResource(args.entityId, args.resourceId)
    ).toEqual(true);
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(findManyArgs);
  });

  it("should validate that all listed field names exist in entity and return a set of non-matching field names", async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      fieldNames: [EXAMPLE_ENTITY_FIELD_NAME],
    };
    const uniqueNames = new Set(args.fieldNames);
    const findManyArgs = {
      where: {
        name: {
          in: Array.from(uniqueNames),
        },
        entityVersion: {
          entityId: args.entityId,
          versionNumber: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber,
        },
      },
      select: { name: true },
    };
    expect(
      await service.validateAllFieldsExist(args.entityId, args.fieldNames)
    ).toEqual(new Set());
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(findManyArgs);
  });

  it("should get a version commit", async () => {
    const entityVersionId = EXAMPLE_LAST_ENTITY_VERSION.id;
    const returnArgs = { where: { id: entityVersionId } };
    expect(await service.getVersionCommit(entityVersionId)).toEqual(
      EXAMPLE_COMMIT
    );
    expect(prismaEntityVersionFindOneMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindOneMock).toBeCalledWith(returnArgs);
  });

  it("should acquire a lock", async () => {
    const lockArgs = {
      args: { where: { id: EXAMPLE_ENTITY_ID } },
      user: EXAMPLE_USER,
    };
    const entityId = lockArgs.args.where.id;
    expect(await service.acquireLock(lockArgs.args, lockArgs.user)).toEqual(
      EXAMPLE_ENTITY
    );
    expect(prismaEntityFindFirstMock).toBeCalledTimes(1);
    expect(prismaEntityFindFirstMock).toBeCalledWith({
      where: {
        id: entityId,
        deletedAt: null,
      },
    });
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith({
      where: {
        id: entityId,
      },
      data: {
        lockedByUser: {
          connect: {
            id: lockArgs.user.id,
          },
        },
        lockedAt: expect.any(Date),
      },
    });
  });

  it("should release a lock", async () => {
    const entityId = EXAMPLE_ENTITY_ID;
    const updateArgs = {
      where: {
        id: entityId,
      },
      data: {
        lockedByUser: {
          disconnect: true,
        },
        lockedAt: null,
      },
    };
    expect(await service.releaseLock(entityId)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith(updateArgs);
  });

  it("should still call updateLock when an error occurs", async () => {
    jest.spyOn(service, "updateLock");
    jest.spyOn(service, "validateFieldMutationArgs").mockImplementation(() => {
      throw new Error();
    });

    const args = {
      where: { id: EXAMPLE_ENTITY_FIELD.id },
      data: EXAMPLE_ENTITY_FIELD_DATA,
    };
    await expect(
      service.updateField(args, EXAMPLE_USER)
    ).rejects.toThrowError();
    expect(service.updateLock).toBeCalled();
  });

  it("should not create an entity field when the service in not under license", async () => {
    prismaEntityFindUniqueMock.mockImplementationOnce(() => {
      return {
        ...EXAMPLE_ENTITY,
        resource: {
          ...EXAMPLE_RESOURCE,
          licensed: false,
        },
      };
    });

    await expect(
      service.createField(
        {
          data: {
            ...EXAMPLE_ENTITY_FIELD_DATA,
            entity: { connect: { id: EXAMPLE_ENTITY_ID } },
          },
        },
        EXAMPLE_USER
      )
    ).rejects.toThrow(
      new BillingLimitationError(
        "Your workspace reached its service limitation.",
        BillingFeature.Services
      )
    );
  });

  it("should create entity field", async () => {
    expect(
      await service.createField(
        {
          data: {
            ...EXAMPLE_ENTITY_FIELD_DATA,
            entity: { connect: { id: EXAMPLE_ENTITY_ID } },
          },
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_ENTITY_FIELD);
    expect(prismaEntityFieldCreateMock).toBeCalledTimes(1);
    expect(prismaEntityFieldCreateMock).toBeCalledWith({
      data: {
        ...EXAMPLE_ENTITY_FIELD_DATA,
        permanentId: expect.any(String),
      },
    });
  });
  it("should fail to create entity field with bad name", async () => {
    await expect(
      service.createField(
        {
          data: {
            ...EXAMPLE_ENTITY_FIELD_DATA,
            name: "Foo Bar",
            entity: { connect: { id: EXAMPLE_ENTITY_ID } },
          },
        },
        EXAMPLE_USER
      )
    ).rejects.toThrow(NAME_VALIDATION_ERROR_MESSAGE);
  });

  it("should update Minimum value of a field", async () => {
    const args = {
      data: EXAMPLE_ENTITY_FIELD_DATA_WITH_VALID_MINIMUM_VALUE,
      where: { id: "exampleEntityField" },
    };
    expect(await service.updateField(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_ENTITY_FIELD_WHOLE_NUMBER
    );
  });

  it('should throw "Minimum value can not be greater than or equal to, the Maximum value', async () => {
    const args = {
      data: EXAMPLE_ENTITY_FIELD_DATA_WITH_INVALID_MINIMUM_VALUE,
      where: { id: "exampleEntityField" },
    };
    await expect(service.updateField(args, EXAMPLE_USER)).rejects.toThrow(
      NUMBER_WITH_INVALID_MINIMUM_VALUE
    );
  });

  it("should update entity field", async () => {
    const args = {
      where: { id: EXAMPLE_ENTITY_FIELD.id },
      data: EXAMPLE_ENTITY_FIELD_DATA,
    };
    expect(await service.updateField(args, EXAMPLE_USER)).toEqual(
      EXAMPLE_ENTITY_FIELD
    );
    expect(prismaEntityFieldUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityFieldUpdateMock).toBeCalledWith(args);
  });

  it('should throw a "Record not found" error', async () => {
    const args = {
      where: {
        entityId: EXAMPLE_ENTITY_ID,
        action: EXAMPLE_ACTION,
        fieldPermanentId: EXAMPLE_ENTITY_FIELD.permanentId,
      },
    };
    const user = EXAMPLE_USER;
    await expect(
      service.deleteEntityPermissionField(args, user)
    ).rejects.toThrowError("Record not found");
    expect(prismaEntityFindFirstMock).toBeCalledTimes(1);
    expect(prismaEntityFindFirstMock).toBeCalledWith({
      where: {
        id: args.where.entityId,
        deletedAt: null,
      },
    });
    expect(prismaEntityPermissionFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityPermissionFieldFindManyMock).toBeCalledWith({
      where: {
        permission: {
          entityVersion: {
            entityId: args.where.entityId,
            versionNumber: CURRENT_VERSION_NUMBER,
          },
          action: args.where.action,
        },
        fieldPermanentId: args.where.fieldPermanentId,
      },
    });
  });

  it("create field by display name", async () => {
    expect(
      await service.createFieldByDisplayName(
        {
          data: {
            displayName: "EXAMPLE_DISPLAY_NAME",
            entity: { connect: { id: "EXAMPLE_ID" } },
          },
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_ENTITY_FIELD);
  });

  it("create field of date", async () => {
    const EXAMPLE_DATE_DISPLAY_NAME = "EXAMPLE_DISPLAY_NAME" + " date";

    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: EXAMPLE_DATE_DISPLAY_NAME,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.DateTime,
      name: camelCase(EXAMPLE_DATE_DISPLAY_NAME),
      properties: {
        timeZone: "localTime",
        dateOnly: false,
      },
    });
  });
  it("create field of description", async () => {
    const EXAMPLE_DESCRIPTION_DISPLAY_NAME =
      "EXAMPLE_DISPLAY_NAME" + " description";
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: EXAMPLE_DESCRIPTION_DISPLAY_NAME,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.MultiLineText,
      name: camelCase(EXAMPLE_DESCRIPTION_DISPLAY_NAME),
      properties: {
        maxLength: 1000,
      },
    });
  });
  it("create field of email", async () => {
    const EXAMPLE_EMAIL_DISPLAY_NAME = "EXAMPLE_DISPLAY_NAME" + " email";
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: EXAMPLE_EMAIL_DISPLAY_NAME,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.Email,
      name: camelCase(EXAMPLE_EMAIL_DISPLAY_NAME),
      properties: {},
    });
  });
  it("create field of status", async () => {
    const EXAMPLE_STATUS_DISPLAY_NAME = "EXAMPLE_DISPLAY_NAME" + " status";
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: EXAMPLE_STATUS_DISPLAY_NAME,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.OptionSet,
      name: camelCase(EXAMPLE_STATUS_DISPLAY_NAME),
      properties: { options: [{ label: "Option 1", value: "Option1" }] },
    });
  });
  it("create field of boolean", async () => {
    const EXAMPLE_BOOLEAN_DISPLAY_NAME = "is" + "EXAMPLE_DISPLAY_NAME";
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: EXAMPLE_BOOLEAN_DISPLAY_NAME,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.Boolean,
      name: camelCase(EXAMPLE_BOOLEAN_DISPLAY_NAME),
      properties: {},
    });
  });
  it("create single field of lookup", async () => {
    prismaEntityFieldFindManyMock.mockImplementationOnce(() => []);
    const [relatedEntity] = prismaEntityFindManyMock();
    prismaEntityFindManyMock.mockClear();
    const query = relatedEntity.displayName.toLowerCase();
    const name = camelCase(query);
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: query,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: relatedEntity.id,
        allowMultipleSelection: false,
      },
      name: camelCase(relatedEntity.displayName),
    });
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith({
      where: {
        ...createEntityNamesWhereInput(name, EXAMPLE_ENTITY.resourceId),
        deletedAt: null,
      },
      take: 1,
    });
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith({
      where: {
        name,
        entityVersion: {
          entityId: EXAMPLE_ENTITY_ID,
          versionNumber: CURRENT_VERSION_NUMBER,
        },
      },
    });
  });
  it("create field of plural lookup", async () => {
    prismaEntityFieldFindManyMock.mockImplementationOnce(() => []);
    const [relatedEntity] = prismaEntityFindManyMock();
    prismaEntityFindManyMock.mockClear();
    const query = relatedEntity.pluralDisplayName.toLowerCase();
    expect(
      await service.createFieldCreateInputByDisplayName(
        {
          data: {
            displayName: query,
            entity: EXAMPLE_ENTITY_WHERE_PARENT_ID,
          },
        },
        EXAMPLE_ENTITY
      )
    ).toEqual({
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: relatedEntity.id,
        allowMultipleSelection: true,
      },
      name: camelCase(query),
    });
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
  });
  it.skip('pending changed entities "create"', async () => {
    prismaEntityFindManyMock.mockImplementationOnce(() => [
      {
        ...EXAMPLE_ENTITY,
        resource: EXAMPLE_RESOURCE,
        versions: [EXAMPLE_CURRENT_ENTITY_VERSION],
      },
    ]);
    expect(
      await service.getChangedEntities(EXAMPLE_PROJECT_ID, EXAMPLE_USER_ID)
    ).toEqual([EXAMPLE_ENTITY_PENDING_CHANGE_CREATE]);
  });
  it.skip('pending changed entities "update"', async () => {
    prismaEntityFindManyMock.mockImplementationOnce(() => [
      {
        ...EXAMPLE_ENTITY,
        versions: [
          EXAMPLE_CURRENT_ENTITY_VERSION,
          EXAMPLE_CURRENT_ENTITY_VERSION,
        ],
        resource: EXAMPLE_RESOURCE,
      },
    ]);
    expect(
      await service.getChangedEntities(EXAMPLE_PROJECT_ID, EXAMPLE_USER_ID)
    ).toEqual([EXAMPLE_ENTITY_PENDING_CHANGE_UPDATE]);
  });
  it.skip('pending changed entities "delete"', async () => {
    prismaEntityFindManyMock.mockImplementationOnce(() => [
      { ...EXAMPLE_DELETED_ENTITY, resource: EXAMPLE_RESOURCE },
    ]);
    expect(
      await service.getChangedEntities(EXAMPLE_PROJECT_ID, EXAMPLE_USER_ID)
    ).toEqual([EXAMPLE_ENTITY_PENDING_CHANGE_DELETE]);
  });
  it("should have no pending changes when the current and last entity versions are the same", async () => {
    const LAST_ENTITY_VERSION = {
      ...EXAMPLE_CURRENT_ENTITY_VERSION,
      versionNumber: 2,
    };

    prismaEntityVersionFindManyMock.mockImplementationOnce(() => [
      EXAMPLE_CURRENT_ENTITY_VERSION,
      { ...EXAMPLE_CURRENT_ENTITY_VERSION, versionNumber: 1 },
      LAST_ENTITY_VERSION,
    ]);
    areDifferentMock.mockImplementationOnce(() => false);

    expect(await service.hasPendingChanges(EXAMPLE_ENTITY.id)).toBe(false);
    expect(areDifferentMock).toBeCalledWith(
      EXAMPLE_CURRENT_ENTITY_VERSION,
      LAST_ENTITY_VERSION,
      expect.anything()
    );
  });
  it("should have pending changes when the current and last entity versions are different", async () => {
    const CURRENT_ENTITY_VERSION_WITH_CHANGES = {
      ...EXAMPLE_LAST_ENTITY_VERSION,
      displayName: "new entity name",
    };

    prismaEntityVersionFindManyMock.mockImplementationOnce(() => [
      CURRENT_ENTITY_VERSION_WITH_CHANGES,
      EXAMPLE_LAST_ENTITY_VERSION,
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_ENTITY.id)).toBe(true);
    expect(areDifferentMock).toBeCalledWith(
      CURRENT_ENTITY_VERSION_WITH_CHANGES,
      EXAMPLE_LAST_ENTITY_VERSION,
      expect.anything()
    );
  });
  it("should have pending changes when there is only one entity version", async () => {
    prismaEntityVersionFindManyMock.mockImplementationOnce(() => [
      EXAMPLE_CURRENT_ENTITY_VERSION,
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_ENTITY.id)).toBe(true);
    expect(areDifferentMock).toBeCalledWith(
      EXAMPLE_CURRENT_ENTITY_VERSION,
      undefined,
      expect.anything()
    );
  });
  it("should have no pending changes when there is only one entity version and it was deleted", async () => {
    prismaEntityVersionFindManyMock.mockImplementationOnce(() => [
      {
        ...EXAMPLE_CURRENT_ENTITY_VERSION,
        deleted: true,
      },
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_ENTITY.id)).toBe(false);
    expect(areDifferentMock).not.toBeCalled();
  });
  it("should fail to create one entity with a reserved name", async () => {
    const createArgs = {
      args: {
        data: {
          name: RESERVED_NAME,
          displayName: EXAMPLE_ENTITY.displayName,
          description: EXAMPLE_ENTITY.description,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          customAttributes: EXAMPLE_ENTITY.customAttributes,
          resource: { connect: { id: EXAMPLE_ENTITY.resourceId } },
        },
      },
      user: EXAMPLE_USER,
    };

    prismaResourceFindUniqueMock.mockImplementation(() => {
      return {
        ...EXAMPLE_RESOURCE,
        licensed: true,
      };
    });

    await expect(
      service.createOneEntity(createArgs.args, createArgs.user)
    ).rejects.toThrow(new ReservedNameError(RESERVED_NAME));
  });
  it("should send unreserved name to a function that checks if its a reserved name", async () => {
    expect(isReservedName(UNRESERVED_NAME)).toBe(false);
  });
  it("should send a reserved name to a function that checks if its a reserved name", async () => {
    expect(isReservedName(RESERVED_NAME)).toBe(true);
  });
});
