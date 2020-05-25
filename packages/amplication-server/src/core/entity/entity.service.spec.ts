import { Test, TestingModule } from '@nestjs/testing';
import { Entity, EntityVersion,EntityField } from '@prisma/client';
import { EntityService } from './entity.service';
import { PrismaService } from '../../services/prisma.service';
import { Entity as EntityModel} from '../../models'; //todo: should we use the model and the prisma object

import { Role } from '../../enums/Role';


const EXAMPLE_ENTITY: Entity = {
  id: 'exampleEntity',
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

const EXAMPLE_ENTITY_VERSION: EntityVersion = {
  id: 'exampleEntityVersion',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: 'exampleEntity',
  versionNumber: 0,
  label: 'example version'
};


const EXAMPLE_ENTITY_Field: EntityField = {
  id: 'exampleEntityField',
  createdAt: new Date(),
  updatedAt: new Date(),
  entityVersionId: 'exampleEntityVersion',
  fieldPermanentId: 'fieldPermanentId',
  name: 'exampleField',
  displayName: 'example field',
  dataType: "singleLineText",
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
  return [EXAMPLE_ENTITY_Field];
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
              findMany : prismaEntityVersionFindManyMock
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
});
