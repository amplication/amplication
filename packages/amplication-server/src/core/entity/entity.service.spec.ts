import { Test, TestingModule } from '@nestjs/testing';
import {
  Entity,
  EntityVersion,
  EntityField,
  EnumDataType
} from '@prisma/client';
import { EntityService } from './entity.service';
import { PrismaService } from 'src/services/prisma.service';
/** @todo: should we use the model and the prisma object */
// import { Entity as EntityModel } from 'src/models';

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
  primaryField: 'primaryKey',
  lockedByUserId: undefined,
  lockedAt: null

  //todo: add fields
};

const EXAMPLE_ENTITY_VERSION: EntityVersion = {
  id: 'exampleEntityVersion',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: 0,
  commitId: undefined
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
  dataType: EnumDataType.SingleLineText,
  properties: null,
  required: true,
  searchable: true,
  description: 'example field'
};

const prismaEntityFindOneMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_ENTITY;
});

const prismaEntityVersionFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_ENTITY_VERSION];
});

const prismaEntityFieldFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_ENTITY_FIELD];
});

describe('EntityService', () => {
  let service: EntityService;

  beforeEach(async () => {
    prismaEntityFindOneMock.mockClear();
    prismaEntityVersionFindManyMock.mockClear();
    prismaEntityFieldFindManyMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            entity: {
              findOne: prismaEntityFindOneMock
            },
            entityVersion: {
              findMany: prismaEntityVersionFindManyMock
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
});
