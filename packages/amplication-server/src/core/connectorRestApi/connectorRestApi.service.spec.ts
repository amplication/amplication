import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from 'src/core/block/block.service';
import { ConnectorRestApiService } from './connectorRestApi.service';
import {
  ConnectorRestApi,
  EnumConnectorRestApiAuthenticationType
} from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_NAME = 'Example Connector REST API';
const EXAMPLE_APP_ID = 'ExampleApp';

const EXAMPLE_CONNECTOR_REST_API_CALL: ConnectorRestApi = {
  id: 'ExampleConnectorRestApi',
  updatedAt: new Date(),
  createdAt: new Date(),
  blockType: EnumBlockType.ConnectorRestApi,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_NAME,
  parentBlock: null,
  versionNumber: 0,
  authenticationType: EnumConnectorRestApiAuthenticationType.None,
  privateKeyAuthenticationSettings: null,
  httpBasicAuthenticationSettings: null
};

const EXAMPLE_CONNECTOR_REST_API_CALLS = [EXAMPLE_CONNECTOR_REST_API_CALL];

const createMock = jest.fn(() => EXAMPLE_CONNECTOR_REST_API_CALL);
const findOneMock = jest.fn(() => EXAMPLE_CONNECTOR_REST_API_CALL);
const findManyByBlockTypeMock = jest.fn(() => EXAMPLE_CONNECTOR_REST_API_CALLS);
const updateMock = jest.fn(() => EXAMPLE_CONNECTOR_REST_API_CALL);

describe('ConnectorRestApiService', () => {
  let service: ConnectorRestApiService;

  beforeEach(async () => {
    createMock.mockClear();
    findOneMock.mockClear();
    findManyByBlockTypeMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            create: createMock,
            findOne: findOneMock,
            findManyByBlockType: findManyByBlockTypeMock,
            update: updateMock
          }))
        },
        ConnectorRestApiService
      ],
      imports: []
    }).compile();

    service = module.get<ConnectorRestApiService>(ConnectorRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    expect(
      await service.findOne({
        where: { id: EXAMPLE_CONNECTOR_REST_API_CALL.id },
        version: EXAMPLE_CONNECTOR_REST_API_CALL.versionNumber
      })
    ).toBe(EXAMPLE_CONNECTOR_REST_API_CALL);
    expect(findOneMock).toBeCalledTimes(1);
  });

  it('should find many', async () => {
    expect(await service.findMany({})).toEqual(
      EXAMPLE_CONNECTOR_REST_API_CALLS
    );
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
  });

  it('should create', async () => {
    expect(
      await service.create({
        data: {
          inputParameters: EXAMPLE_INPUT_PARAMETERS,
          outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
          displayName: EXAMPLE_NAME,
          authenticationType: EnumConnectorRestApiAuthenticationType.None,
          privateKeyAuthenticationSettings: null,
          httpBasicAuthenticationSettings: null,
          app: {
            connect: {
              id: EXAMPLE_APP_ID
            }
          }
        }
      })
    ).toEqual(EXAMPLE_CONNECTOR_REST_API_CALL);
    expect(createMock).toBeCalledTimes(1);
  });

  it('should update', async () => {
    expect(
      await service.update({
        data: {
          displayName: EXAMPLE_NAME
        },
        where: {
          id: EXAMPLE_CONNECTOR_REST_API_CALL.id
        }
      })
    ).toEqual(EXAMPLE_CONNECTOR_REST_API_CALL);
    expect(updateMock).toBeCalledTimes(1);
  });
});
