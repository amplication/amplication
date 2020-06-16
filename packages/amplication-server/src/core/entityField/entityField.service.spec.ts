import { Test, TestingModule } from '@nestjs/testing';
import { EntityService } from 'src/core/entity/entity.service';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import {
  EntityFieldService,
  CURRENT_VERSION_NUMBER,
  NAME_VALIDATION_ERROR_MESSAGE
} from './entityField.service';
import { PrismaService } from 'src/services/prisma.service';
import { EnumDataType } from 'src/enums/EnumDataType';

const EXAMPLE_ENTITY_FIELD_ID = 'Example Entity Field ID';
const EXAMPLE_ENTITY_VERSION_ID = 'Example Entity Version ID';
const EXAMPLE_ENTITY_ID = 'Example Entity ID';
const EXAMPLE_ENTITY_FIELD_DATA = {
  name: 'exampleEntityFieldName',
  displayName: 'Example Entity Field Display Name',
  required: false,
  searchable: false,
  description: '',
  dataType: EnumDataType.singleLineText,
  properties: {
    maxLength: 42
  },
  entityVersion: { connect: { id: EXAMPLE_ENTITY_VERSION_ID } }
};
const EXAMPLE_ENTITY_VERSION = {
  id: EXAMPLE_ENTITY_VERSION_ID,
  versionNumber: CURRENT_VERSION_NUMBER
};
const EXAMPLE_ENTITY_FIELD = {
  ...EXAMPLE_ENTITY_FIELD_DATA,
  id: EXAMPLE_ENTITY_FIELD_ID,
  entityVersion: EXAMPLE_ENTITY_VERSION
};

const findOneMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const createMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const updateMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const getEntityVersionMock = jest.fn(() => EXAMPLE_ENTITY_VERSION);

describe('EntityFieldService', () => {
  let service: EntityFieldService;

  beforeEach(async () => {
    findOneMock.mockClear();
    createMock.mockClear();
    updateMock.mockClear();
    getEntityVersionMock.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            entityField: {
              findOne: findOneMock,
              create: createMock,
              update: updateMock
            }
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            getEntityVersion: getEntityVersionMock
          }))
        },
        JsonSchemaValidationService,
        EntityFieldService
      ]
    }).compile();

    service = module.get<EntityFieldService>(EntityFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get entity field', async () => {
    const args = { where: { id: EXAMPLE_ENTITY_FIELD_ID } };
    expect(await service.entityField(args)).toEqual(EXAMPLE_ENTITY_FIELD);
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
  });

  it('should create entity field', async () => {
    expect(
      await service.createEntityField({
        data: {
          ...EXAMPLE_ENTITY_FIELD_DATA,
          entity: { connect: { id: EXAMPLE_ENTITY_ID } }
        }
      })
    ).toEqual(EXAMPLE_ENTITY_FIELD);
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith({
      data: EXAMPLE_ENTITY_FIELD_DATA
    });
    expect(getEntityVersionMock).toBeCalledTimes(1);
    expect(getEntityVersionMock).toBeCalledWith(
      EXAMPLE_ENTITY_ID,
      CURRENT_VERSION_NUMBER
    );
  });
  it('should fail to create entity field with bad name', async () => {
    expect(
      service.createEntityField({
        data: {
          ...EXAMPLE_ENTITY_FIELD_DATA,
          name: 'Foo Bar',
          entity: { connect: { id: EXAMPLE_ENTITY_ID } }
        }
      })
    ).rejects.toThrow(NAME_VALIDATION_ERROR_MESSAGE);
  });
  it('should update entity field', async () => {
    const args = {
      where: { id: EXAMPLE_ENTITY_FIELD_ID },
      data: EXAMPLE_ENTITY_FIELD_DATA
    };
    expect(await service.updateEntityField(args)).toEqual(EXAMPLE_ENTITY_FIELD);
    expect(updateMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledWith(args);
  });
});
