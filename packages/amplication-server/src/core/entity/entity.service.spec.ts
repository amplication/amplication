import { Test, TestingModule } from '@nestjs/testing';
import { Entity, EntityVersion, EntityField, OrderByArg } from '@prisma/client';
import { EntityService } from './entity.service';
import { PrismaService } from 'src/services/prisma.service';
/** @todo: should we use the model and the prisma object */
// import { Entity as EntityModel } from 'src/models';
import { FindManyEntityArgs } from './dto';
import omit from 'lodash.omit';

const NEW_VERSION_LABEL = 'Current Version';

const EXAMPLE_ENTITY_ID = 'exampleEntityId';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: 'exampleApp',
  name: 'exampleEntity',
  displayName: 'example entity',
  pluralDisplayName: 'exampleEntities',
  description: 'example entity',
  isPersistent: true,
  allowFeedback: false,
  primaryField: 'primaryKey'
  //todo: add fields
};

//Falsy entity version because versionNumber===0
const EXAMPLE_ENTITY_VERSION: EntityVersion = {
  id: 'exampleEntityVersion',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: 0,
  label: 'example version'
};

//Truthy entity version because versionNumber===1
const EXAMPLE_TRUTHY_ENTITY_VERSION: EntityVersion = {
  id: 'exampleTruthyEntityVersion',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: 1,
  label: 'example version'
};

const EXAMPLE_ENTITY_FIELD_NAME = 'exampleFieldName';
const EXAMPLE_NON_EXISTING_ENTITY_FIELD_NAME = 'nonExistingFieldName';

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: 'exampleEntityField',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityVersionId: 'exampleEntityVersion',
  fieldPermanentId: 'fieldPermanentId',
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: 'example field',
  dataType: 'singleLineText',
  properties: null,
  required: true,
  searchable: true,
  description: 'example field'
};

const prismaEntityFindOneMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_ENTITY];
});

const prismaEntityCreateMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityDeleteMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityUpdateMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityVersionFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_ENTITY_VERSION];
});

const prismaEntityVersionCreateMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY_VERSION;
});

const prismaEntityFieldFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_ENTITY_FIELD];
});

describe('EntityService', () => {
  let service: EntityService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            entity: {
              findOne: prismaEntityFindOneMock,
              findMany: prismaEntityFindManyMock,
              create: prismaEntityCreateMock,
              delete: prismaEntityDeleteMock,
              update: prismaEntityUpdateMock
            },
            entityVersion: {
              findMany: prismaEntityVersionFindManyMock,
              create: prismaEntityVersionCreateMock
            },
            entityField: {
              findMany: prismaEntityFieldFindManyMock
            }
          }))
        },
        EntityService
      ],
      imports: []
    }).compile();

    service = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('get entity with correct data', async () => {
  //   const result = await service.entity({
  //     where:{
  //       id:"" //todo: what to send? should i use an object
  //     },
  //     version:0
  //   });
  //   expect(result).toBe({ //todo: how to compare to the new object

  //   });

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
      where: { id: EXAMPLE_ENTITY_ID },
      version: EXAMPLE_ENTITY_VERSION.versionNumber
    };
    const returnArgs = {
      where: {
        id: args.where.id
      }
    };
    expect(await service.entity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityFindOneMock).toBeCalledTimes(1);
    expect(prismaEntityFindOneMock).toBeCalledWith(returnArgs);
  });

  it('should find many entities', async () => {
    const args: FindManyEntityArgs = {};
    expect(await service.entities(args)).toEqual([EXAMPLE_ENTITY]);
    expect(prismaEntityFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFindManyMock).toBeCalledWith(args);
  });

  it('should create one entity', async () => {
    const args = {
      data: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        isPersistent: EXAMPLE_ENTITY.isPersistent,
        allowFeedback: EXAMPLE_ENTITY.allowFeedback,
        app: { connect: { id: EXAMPLE_ENTITY.appId } }
      }
    };
    const returnArgs = {
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: 0,
        entity: {
          connect: {
            id: EXAMPLE_ENTITY.id
          }
        }
      }
    };
    expect(await service.createOneEntity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityCreateMock).toBeCalledTimes(1);
    expect(prismaEntityCreateMock).toBeCalledWith(args);
    expect(prismaEntityVersionCreateMock).toBeCalledTimes(1);
    expect(prismaEntityVersionCreateMock).toBeCalledWith(returnArgs);
  });

  it('should delete one entity', async () => {
    const args = { where: { id: EXAMPLE_ENTITY_ID } };
    expect(await service.deleteOneEntity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityDeleteMock).toBeCalledTimes(1);
    expect(prismaEntityDeleteMock).toBeCalledWith(args);
  });

  it('should update one entity', async () => {
    const args = {
      data: {},
      where: { id: EXAMPLE_ENTITY_ID }
    };
    expect(await service.updateOneEntity(args)).toEqual(EXAMPLE_ENTITY);
    expect(prismaEntityUpdateMock).toBeCalledTimes(1);
    expect(prismaEntityUpdateMock).toBeCalledWith(args);
  });

  it('should get entity fields', async () => {
    const entity = EXAMPLE_ENTITY;
    const returnArgs = {
      where: {
        entityVersion: { id: EXAMPLE_ENTITY_VERSION.id }
      },
      orderBy: { createdAt: OrderByArg.asc }
    };
    expect(await service.getEntityFields(entity)).toEqual([
      EXAMPLE_ENTITY_FIELD
    ]);
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(returnArgs);
  });

  it('should get an entity version with a version number', async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      versionNumber: EXAMPLE_TRUTHY_ENTITY_VERSION.versionNumber
    };
    const returnArgs = {
      where: {
        entity: { id: args.entityId },
        versionNumber: args.versionNumber
      }
    };
    expect(
      await service.getEntityVersion(args.entityId, args.versionNumber)
    ).toEqual(EXAMPLE_ENTITY_VERSION);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(returnArgs);
  });

  it('should get an entity version without/with a falsy version number', async () => {
    const args = {
      entityId: EXAMPLE_ENTITY_ID,
      versionNumber: EXAMPLE_ENTITY_VERSION.versionNumber
    };
    const returnArgs = {
      where: {
        entity: { id: args.entityId }
      },
      orderBy: { versionNumber: OrderByArg.asc }
    };
    expect(
      await service.getEntityVersion(args.entityId, args.versionNumber)
    ).toEqual(EXAMPLE_ENTITY_VERSION);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(returnArgs);
  });
  it('should create a new version', async () => {
    const args = {
      data: {
        label: EXAMPLE_ENTITY_VERSION.label,
        entity: { connect: { id: EXAMPLE_ENTITY_ID } }
      }
    };
    const entityVersionFindManyArgs = {
      where: {
        entity: { id: EXAMPLE_ENTITY_ID }
      }
    };
    const entityFieldFindManyArgs = {
      where: {
        entityVersion: { id: EXAMPLE_ENTITY_VERSION.id }
      }
    };
    const nextVersionNumber = EXAMPLE_ENTITY_VERSION.versionNumber + 1;
    const entityVersionCreateArgs = {
      data: {
        label: args.data.label,
        versionNumber: nextVersionNumber,
        entity: {
          connect: {
            id: args.data.entity.connect.id
          }
        },
        entityFields: {
          create: [omit(EXAMPLE_ENTITY_FIELD, ['entityVersionId', 'id'])]
        }
      }
    };
    expect(await service.createVersion(args)).toEqual(EXAMPLE_ENTITY_VERSION);
    expect(prismaEntityVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityVersionFindManyMock).toBeCalledWith(
      entityVersionFindManyArgs
    );
    expect(prismaEntityFieldFindManyMock).toBeCalledTimes(1);
    expect(prismaEntityFieldFindManyMock).toBeCalledWith(
      entityFieldFindManyArgs
    );
    expect(prismaEntityVersionCreateMock).toBeCalledTimes(1);
    expect(prismaEntityVersionCreateMock).toBeCalledWith(
      entityVersionCreateArgs
    );
  });

  it('should get many versions', async () => {
    const args = {};
    expect(await service.getVersions(args)).toEqual([EXAMPLE_ENTITY_VERSION]);
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
        isPersistent: true
      }
    };
    expect(
      await service.isPersistentEntityInSameApp(args.entityId, args.appId)
    ).toEqual(true);
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
          versionNumber: EXAMPLE_ENTITY_VERSION.versionNumber
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
});
