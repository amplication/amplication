import { Test, TestingModule } from '@nestjs/testing';
import {
  FindOneEntityFieldArgs,
  SortOrder,
  FindOneEntityVersionArgs,
  EntityVersionCreateArgs,
  EnumEntityAction
} from '@prisma/client';
import { pick, omit } from 'lodash';
import { EntityService, NAME_VALIDATION_ERROR_MESSAGE } from './entity.service';
import { PrismaService } from 'nestjs-prisma';
import { Entity, EntityVersion, EntityField, User, Commit } from 'src/models';
import { EnumDataType } from 'src/enums/EnumDataType';
import { FindManyEntityArgs } from './dto';
import { CURRENT_VERSION_NUMBER, DEFAULT_PERMISSIONS } from './constants';
import { JsonSchemaValidationModule } from 'src/services/jsonSchemaValidation.module';
import { prepareDeletedItemName } from 'src/util/softDelete';

const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_CURRENT_ENTITY_VERSION_ID = 'currentEntityVersionId';
const EXAMPLE_LAST_ENTITY_VERSION_ID = 'lastEntityVersionId';
const EXAMPLE_LAST_ENTITY_VERSION_NUMBER = 4;

const EXAMPLE_ACTION = EnumEntityAction.View;

const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_ENTITY_FIELD_NAME = 'exampleFieldName';
const EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME = 'nonExistingFieldName';

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: 'exampleApp',
  name: 'exampleEntity',
  displayName: 'example entity',
  pluralDisplayName: 'exampleEntities',
  description: 'example entity',
  lockedByUserId: undefined,
  lockedAt: null
};

const EXAMPLE_LOCKED_ENTITY: Entity = {
  ...EXAMPLE_ENTITY,
  lockedByUserId: EXAMPLE_USER_ID,
  lockedAt: new Date()
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: 'exampleEntityField',
  permanentId: 'exampleEntityFieldPermanentId',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityVersionId: 'exampleEntityVersion',
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: 'example field',
  dataType: EnumDataType.SingleLineText,
  properties: null,
  required: true,
  searchable: true,
  description: 'example field'
};

const EXAMPLE_CURRENT_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_CURRENT_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: CURRENT_VERSION_NUMBER,
  commitId: null,
  name: 'exampleEntity',
  displayName: 'example entity',
  pluralDisplayName: 'exampleEntities',
  description: 'example entity'
};

const EXAMPLE_LAST_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_LAST_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: EXAMPLE_LAST_ENTITY_VERSION_NUMBER,
  commitId: EXAMPLE_COMMIT_ID,
  name: 'exampleEntity',
  displayName: 'example entity',
  pluralDisplayName: 'exampleEntities',
  description: 'example entity',
  fields: [
    {
      ...EXAMPLE_ENTITY_FIELD,
      entityVersionId: EXAMPLE_LAST_ENTITY_VERSION_ID
    }
  ]
};

const EXAMPLE_ENTITY_FIELD_DATA = {
  name: 'exampleEntityFieldName',
  displayName: 'Example Entity Field Display Name',
  required: false,
  searchable: false,
  description: '',
  dataType: EnumDataType.SingleLineText,
  properties: {
    maxLength: 42
  },
  entityVersion: { connect: { id: EXAMPLE_CURRENT_ENTITY_VERSION.id } }
};

const prismaEntityFindOneMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
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
  (args: FindOneEntityVersionArgs) => {
    const entityVersionList = [
      EXAMPLE_CURRENT_ENTITY_VERSION,
      EXAMPLE_LAST_ENTITY_VERSION
    ];

    const version = entityVersionList.find(item => item.id == args.where.id);

    if (args.include?.fields) {
      version.fields = [
        {
          ...EXAMPLE_ENTITY_FIELD,
          entityVersionId: version.id
        }
      ];
    }

    if (args.include?.permissions) {
      version.permissions = [];
    }

    return {
      then: resolve => resolve(version),
      commit: () => EXAMPLE_COMMIT
    };
  }
);

const prismaEntityVersionFindManyMock = jest.fn(
  (args: FindOneEntityVersionArgs) => {
    if (args.include?.entity) {
      return [
        { ...EXAMPLE_CURRENT_ENTITY_VERSION, entity: EXAMPLE_LOCKED_ENTITY },
        { ...EXAMPLE_LAST_ENTITY_VERSION, entity: EXAMPLE_LOCKED_ENTITY }
      ];
    } else {
      return [EXAMPLE_CURRENT_ENTITY_VERSION, EXAMPLE_LAST_ENTITY_VERSION];
    }
  }
);

const prismaEntityVersionCreateMock = jest.fn(
  (args: EntityVersionCreateArgs) => {
    return {
      ...EXAMPLE_LAST_ENTITY_VERSION,
      versionNumber: args.data.versionNumber
    };
  }
);
const prismaEntityVersionUpdateMock = jest.fn(() => {
  return EXAMPLE_CURRENT_ENTITY_VERSION;
});

const prismaEntityFieldFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY_FIELD];
});

const prismaEntityFieldFindOneMock = jest.fn((args: FindOneEntityFieldArgs) => {
  if (args?.include?.entityVersion) {
    return {
      ...EXAMPLE_ENTITY_FIELD,
      entityVersion: EXAMPLE_CURRENT_ENTITY_VERSION
    };
  }
  return EXAMPLE_ENTITY_FIELD;
});
const prismaEntityFieldCreateMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const prismaEntityFieldUpdateMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);

const prismaEntityPermissionFindManyMock = jest.fn(() => []);
const prismaEntityPermissionFieldDeleteManyMock = jest.fn(() => null);
const prismaEntityPermissionFieldFindManyMock = jest.fn(() => null);
const prismaEntityPermissionRoleDeleteManyMock = jest.fn(() => null);

describe('EntityService', () => {
  let service: EntityService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [JsonSchemaValidationModule],
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            entity: {
              findOne: prismaEntityFindOneMock,
              findMany: prismaEntityFindManyMock,
              create: prismaEntityCreateMock,
              delete: prismaEntityDeleteMock,
              update: prismaEntityUpdateMock
            },
            entityVersion: {
              findMany: prismaEntityVersionFindManyMock,
              create: prismaEntityVersionCreateMock,
              update: prismaEntityVersionUpdateMock,
              findOne: prismaEntityVersionFindOneMock
            },
            entityField: {
              findOne: prismaEntityFieldFindOneMock,
              create: prismaEntityFieldCreateMock,
              update: prismaEntityFieldUpdateMock,
              findMany: prismaEntityFieldFindManyMock
            },
            entityPermission: {
              findMany: prismaEntityPermissionFindManyMock
            },
            entityPermissionField: {
              deleteMany: prismaEntityPermissionFieldDeleteManyMock,
              findMany: prismaEntityPermissionFieldFindManyMock
            },
            entityPermissionRole: {
              deleteMany: prismaEntityPermissionRoleDeleteManyMock
            }
          }))
        },
        EntityService
      ]
    }).compile();

    service = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test.each([
    [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME, [EXAMPLE_ENTITY_FIELD_NAME], []],
    [
      EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME,
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME]
    ],
    [
      EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME,
      [EXAMPLE_ENTITY_FIELD_NAME, EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME],
      [EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME]
    ]
  ])(
    '.validateAllFieldsExist(%v, %v)',
    async (entityId, fieldNames, expected) => {
      expect(
        await service.validateAllFieldsExist(entityId, fieldNames)
      ).toEqual(new Set(expected));
    }
  );

  it('should find one entity', async () => {
    const args = {
      where: {
        id: EXAMPLE_ENTITY_ID
      },
      version: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber
    };
    const returnArgs = {
      where: {
        id: args.where.id,
        deletedAt: null
      },
      take: 1
    };
    expect(await service.entity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(returnArgs);
  });

  it('should find many entities', async () => {
    const args: FindManyEntityArgs = {};
    expect(await service.entities(args)).toEqual([EXAMPLE_ENTITY]);
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  });

  it('should create one entity', async () => {
    const createArgs = {
      args: {
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          description: EXAMPLE_ENTITY.description,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          app: { connect: { id: EXAMPLE_ENTITY.appId } }
        }
      },
      user: new User()
    };
    const newEntityArgs = {
      data: {
        ...createArgs.args.data,
        lockedAt: expect.any(Date),
        lockedByUser: {
          connect: {
            id: createArgs.user.id
          }
        },
        versions: {
          create: {
            commit: undefined,
            versionNumber: CURRENT_VERSION_NUMBER,
            name: createArgs.args.data.name,
            displayName: createArgs.args.data.displayName,
            pluralDisplayName: createArgs.args.data.pluralDisplayName,
            description: createArgs.args.data.description,
            permissions: {
              create: DEFAULT_PERMISSIONS
            }
          }
        }
      }
    };

    expect(
      await service.createOneEntity(createArgs.args, createArgs.user)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityCreateMock).toBeCalledTimes(1);
    expect(prismaEntityCreateMock).toBeCalledWith(newEntityArgs);
    expect(prismaEntityFieldCreateMock).toBeCalledTimes(3);
  });

  it('should delete one entity', async () => {
    const deleteArgs = {
      args: {
        where: { id: EXAMPLE_ENTITY_ID }
      },
      user: new User()
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
                versionNumber: CURRENT_VERSION_NUMBER
              }
            },
            data: {
              deleted: true
            }
          }
        }
      }
    };
    expect(
      await service.deleteOneEntity(deleteArgs.args, deleteArgs.user)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith(updateArgs);
  });

  it('should update one entity', async () => {
    const updateArgs = {
      args: {
        where: { id: EXAMPLE_ENTITY_ID },
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          description: EXAMPLE_ENTITY.description
        }
      },
      user: new User()
    };

    expect(
      await service.updateOneEntity(updateArgs.args, updateArgs.user)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith({
      where: { ...updateArgs.args.where },
      data: {
        ...updateArgs.args.data,
        versions: {
          update: {
            where: {
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: updateArgs.args.where.id,
                versionNumber: CURRENT_VERSION_NUMBER
              }
            },
            data: {
              name: updateArgs.args.data.name,
              displayName: updateArgs.args.data.displayName,
              pluralDisplayName: updateArgs.args.data.pluralDisplayName,
              description: updateArgs.args.data.description
            }
          }
        }
      }
    });
  });

  it('should get entity fields', async () => {
    const entity = {
      entityId: EXAMPLE_ENTITY_ID,
      versionNumber: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber,
      args: { where: {} }
    };
    const returnArgs = {
      ...entity.args,
      where: {
        ...entity.args.where,
        entityVersion: {
          entityId: entity.entityId,
          versionNumber: entity.versionNumber
        }
      }
    };
    expect(
      await service.getEntityFields(
        entity.entityId,
        entity.versionNumber,
        entity.args
      )
    ).toEqual([EXAMPLE_ENTITY_FIELD]);
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(returnArgs);
  });

  it('should create a new version', async () => {
    const args = {
      data: {
        commit: { connect: { id: EXAMPLE_LAST_ENTITY_VERSION.commitId } },
        entity: { connect: { id: EXAMPLE_ENTITY_ID } }
      }
    };
    const entityVersionFindManyArgs = {
      where: {
        entity: { id: EXAMPLE_ENTITY_ID }
      },
      orderBy: {
        versionNumber: SortOrder.asc
      }
    };

    const nextVersionNumber = EXAMPLE_LAST_ENTITY_VERSION.versionNumber + 1;
    const entityVersionCreateArgs = {
      data: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        description: EXAMPLE_ENTITY.description,
        commit: {
          connect: {
            id: args.data.commit.connect.id
          }
        },
        versionNumber: nextVersionNumber,
        entity: {
          connect: {
            id: args.data.entity.connect.id
          }
        }
      }
    };

    const names = pick(EXAMPLE_LAST_ENTITY_VERSION, [
      'name',
      'displayName',
      'pluralDisplayName',
      'description'
    ]);

    const entityVersionFindSourceArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true
              }
            }
          }
        }
      }
    };
    const entityVersionFindTargetArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID
      }
    };

    const updateEntityVersionWithFieldsArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID
      },
      data: {
        entity: {
          update: {
            ...names,
            deletedAt: null
          }
        },
        ...names,
        fields: {
          create: [omit(EXAMPLE_ENTITY_FIELD, ['id', 'entityVersionId'])]
        }
      }
    };

    const updateEntityVersionWithPermissionsArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID
      },
      data: {
        permissions: {
          create: []
        }
      }
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
      [entityVersionFindTargetArgs]
    ]);

    expect(prismaEntityVersionUpdateMock).toBeCalledTimes(2);
    expect(prismaEntityVersionUpdateMock.mock.calls).toEqual([
      [updateEntityVersionWithFieldsArgs],
      [updateEntityVersionWithPermissionsArgs]
    ]);
  });

  it('should discard pending changes', async () => {
    const entityVersionFindManyArgs = {
      where: {
        entity: { id: EXAMPLE_ENTITY_ID }
      },
      orderBy: {
        versionNumber: SortOrder.asc
      },
      include: {
        entity: true
      }
    };

    const names = pick(EXAMPLE_LAST_ENTITY_VERSION, [
      'name',
      'displayName',
      'pluralDisplayName',
      'description'
    ]);

    const entityVersionFindSourceArgs = {
      where: {
        id: EXAMPLE_LAST_ENTITY_VERSION_ID
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true
              }
            }
          }
        }
      }
    };
    const entityVersionFindTargetArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID
      }
    };

    const updateEntityVersionWithFieldsArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID
      },
      data: {
        entity: {
          update: {
            ...names,
            deletedAt: null
          }
        },
        ...names,
        fields: {
          create: [omit(EXAMPLE_ENTITY_FIELD, ['id', 'entityVersionId'])]
        }
      }
    };

    const updateEntityVersionWithPermissionsArgs = {
      where: {
        id: EXAMPLE_CURRENT_ENTITY_VERSION_ID
      },
      data: {
        permissions: {
          create: []
        }
      }
    };
    expect(
      await service.discardPendingChanges(EXAMPLE_ENTITY_ID, EXAMPLE_USER_ID)
    ).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(
      entityVersionFindManyArgs
    );

    expect(prismaEntityVersionFindOneMock).toBeCalledTimes(2);
    expect(prismaEntityVersionFindOneMock.mock.calls).toEqual([
      [entityVersionFindSourceArgs],
      [entityVersionFindTargetArgs]
    ]);

    expect(prismaEntityVersionUpdateMock).toBeCalledTimes(3);
    expect(prismaEntityVersionUpdateMock.mock.calls).toEqual([
      [
        {
          where: {
            id: EXAMPLE_CURRENT_ENTITY_VERSION_ID
          },
          data: {
            fields: {
              deleteMany: {
                entityVersionId: EXAMPLE_CURRENT_ENTITY_VERSION_ID
              }
            },
            permissions: {
              deleteMany: {
                entityVersionId: EXAMPLE_CURRENT_ENTITY_VERSION_ID
              }
            }
          }
        }
      ],
      [updateEntityVersionWithFieldsArgs],
      [updateEntityVersionWithPermissionsArgs]
    ]);
  });

  it('should get many versions', async () => {
    const args = {};
    expect(await service.getVersions(args)).toEqual([
      EXAMPLE_CURRENT_ENTITY_VERSION,
      EXAMPLE_LAST_ENTITY_VERSION
    ]);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(args);
  });

  it('should validate that entity ID exists in the current app and is persistent', async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      appId: EXAMPLE_ENTITY.appId
    };
    const findManyArgs = {
      where: {
        id: args.entityId,
        app: { id: args.appId },
        deletedAt: null
      }
    };
    expect(await service.isEntityInSameApp(args.entityId, args.appId)).toEqual(
      true
    );
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(findManyArgs);
  });

  it('should validate that all listed field names exist in entity and return a set of non-matching field names', async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      fieldNames: [EXAMPLE_ENTITY_FIELD_NAME]
    };
    const uniqueNames = new Set(args.fieldNames);
    const findManyArgs = {
      where: {
        name: {
          in: Array.from(uniqueNames)
        },
        entityVersion: {
          entityId: args.entityId,
          versionNumber: EXAMPLE_CURRENT_ENTITY_VERSION.versionNumber
        }
      },
      select: { name: true }
    };
    expect(
      await service.validateAllFieldsExist(args.entityId, args.fieldNames)
    ).toEqual(new Set());
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(findManyArgs);
  });

  it('should get a version commit', async () => {
    const entityVersionId = EXAMPLE_LAST_ENTITY_VERSION.id;
    const returnArgs = { where: { id: entityVersionId } };
    expect(await service.getVersionCommit(entityVersionId)).toEqual(
      EXAMPLE_COMMIT
    );
    expect(prismaEntityVersionFindOneMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindOneMock).toBeCalledWith(returnArgs);
  });

  it('should acquire a lock', async () => {
    const lockArgs = {
      args: { where: { id: EXAMPLE_ENTITY_ID } },
      user: new User()
    };
    const entityId = lockArgs.args.where.id;
    const entityArgs = {
      where: {
        id: entityId,
        deletedAt: null
      },
      take: 1
    };
    //   const updateArgs = {
    // 	  where: {
    // 		  id: entityId
    // 	  },
    // 	  data: {
    // 		  lockedByUser : {
    // 			  connect: {
    // 				  id: lockArgs.user.id
    // 			  }
    // 		  },
    // 		  lockedAt: new Date()
    // 	  }
    //   }
    expect(await service.acquireLock(lockArgs.args, lockArgs.user)).toEqual(
      EXAMPLE_ENTITY
    );
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(entityArgs);
    //expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    //expect(prismaEntityUpdateMock).toBeCalledWith(updateArgs);
  });

  it('should release a lock', async () => {
    const entityId = EXAMPLE_ENTITY_ID;
    const updateArgs = {
      where: {
        id: entityId
      },
      data: {
        lockedByUser: {
          disconnect: true
        },
        lockedAt: null
      }
    };
    expect(await service.releaseLock(entityId)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith(updateArgs);
  });

  it('should create entity field', async () => {
    expect(
      await service.createField(
        {
          data: {
            ...EXAMPLE_ENTITY_FIELD_DATA,
            entity: { connect: { id: EXAMPLE_ENTITY_ID } }
          }
        },
        new User()
      )
    ).toEqual(EXAMPLE_ENTITY_FIELD);
    expect(prismaEntityFieldCreateMock).toBeCalledTimes(1);
    expect(prismaEntityFieldCreateMock).toBeCalledWith({
      data: EXAMPLE_ENTITY_FIELD_DATA
    });
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith({
      where: {
        entity: { id: EXAMPLE_ENTITY.id }
      },
      orderBy: { versionNumber: SortOrder.asc },
      take: 1,
      select: { id: true }
    });
  });
  it('should fail to create entity field with bad name', async () => {
    await expect(
      service.createField(
        {
          data: {
            ...EXAMPLE_ENTITY_FIELD_DATA,
            name: 'Foo Bar',
            entity: { connect: { id: EXAMPLE_ENTITY_ID } }
          }
        },
        new User()
      )
    ).rejects.toThrow(NAME_VALIDATION_ERROR_MESSAGE);
  });
  it('should update entity field', async () => {
    const args = {
      where: { id: EXAMPLE_ENTITY_FIELD.id },
      data: EXAMPLE_ENTITY_FIELD_DATA
    };
    expect(await service.updateField(args, new User())).toEqual(
      EXAMPLE_ENTITY_FIELD
    );
    expect(prismaEntityFieldUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityFieldUpdateMock).toBeCalledWith(args);
  });

  it('should throw an error Record not Found', async () => {
    const args = {
      where: {
        entityId: EXAMPLE_ENTITY_ID,
        action: EXAMPLE_ACTION,
        fieldPermanentId: EXAMPLE_ENTITY_FIELD.permanentId
      }
    };
    const user = new User();
    const findManyArgs = {
      where: {
        id: args.where.entityId,
        deletedAt: null
      },
      take: 1
    };
    const permissionFieldArgs = {
      where: {
        permission: {
          entityVersion: {
            entityId: args.where.entityId,
            versionNumber: CURRENT_VERSION_NUMBER
          },
          action: args.where.action
        },
        fieldPermanentId: args.where.fieldPermanentId
      }
    };
    await expect(
      service.deleteEntityPermissionField(args, user)
    ).rejects.toThrowError('Record not found');
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(findManyArgs);
    expect(prismaEntityPermissionFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityPermissionFieldFindManyMock).toBeCalledWith(
      permissionFieldArgs
    );
  });
});
