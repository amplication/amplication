import { ArgumentsHost, NotFoundException, ContextType } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AmplicationError } from '../errors/AmplicationError';
import {
  GqlResolverExceptionsFilter,
  InternalServerError,
  PRISMA_CODE_UNIQUE_KEY_VIOLATION,
  RequestData,
  UniqueKeyException
} from './GqlResolverExceptions.filter';

const winstonErrorMock = jest.fn();
const winstonInfoMock = jest.fn();
const configServiceGetMock = jest.fn(() => 'production');
const prepareRequestDataMock = jest.fn(() => null);

const EXAMPLE_ERROR_MESSAGE = 'Example Error Message';
const EXAMPLE_FIELDS = ['exampleField', 'exampleOtherField'];
const EXAMPLE_PRISMA_UNKNOWN_ERROR = new PrismaClientKnownRequestError(
  'Example Prisma unknown error message',
  'UNKNOWN_CODE'
);

describe('GqlResolverExceptionsFilter', () => {
  let filter: GqlResolverExceptionsFilter;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock
          }
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: winstonErrorMock,
            info: winstonInfoMock
          }
        },
        GqlResolverExceptionsFilter
      ],
      imports: null
    }).compile();

    filter = module.get<GqlResolverExceptionsFilter>(
      GqlResolverExceptionsFilter
    );
    // Override prepareRequestData to avoid passing a valid ArgumentHost
    filter.prepareRequestData = prepareRequestDataMock;

    jest.clearAllMocks();
  });
  const cases: Array<[
    string,
    Error,
    Error,
    [string, { requestData: RequestData | null }] | null,
    [string, { requestData: RequestData | null }] | null
  ]> = [
    [
      'PrismaClientKnownRequestError unique key',
      new PrismaClientKnownRequestError(
        EXAMPLE_ERROR_MESSAGE,
        PRISMA_CODE_UNIQUE_KEY_VIOLATION,
        { target: EXAMPLE_FIELDS }
      ),
      new UniqueKeyException(EXAMPLE_FIELDS),
      null,
      [new UniqueKeyException(EXAMPLE_FIELDS).message, { requestData: null }]
    ],
    [
      'PrismaClientKnownRequestError unknown',
      EXAMPLE_PRISMA_UNKNOWN_ERROR,
      new InternalServerError(),
      [EXAMPLE_PRISMA_UNKNOWN_ERROR.message, { requestData: null }],
      null
    ],
    [
      'AmplicationError',
      new AmplicationError(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE),
      null,
      [EXAMPLE_ERROR_MESSAGE, { requestData: null }]
    ],
    [
      'HttpException',
      new NotFoundException(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE),
      null,
      [EXAMPLE_ERROR_MESSAGE, { requestData: null }]
    ],
    [
      'Error',
      new Error(EXAMPLE_ERROR_MESSAGE),
      new InternalServerError(),
      [EXAMPLE_ERROR_MESSAGE, { requestData: null }],
      null
    ]
  ];
  test.each(cases)('%s', (name, exception, expected, errorArgs, infoArgs) => {
    const host = {} as ArgumentsHost;
    expect(filter.catch(exception, host)).toEqual(expected);
    if (errorArgs) {
      expect(winstonErrorMock).toBeCalledTimes(1);
      expect(winstonErrorMock).toBeCalledWith(...errorArgs);
    }
    if (infoArgs) {
      expect(winstonInfoMock).toBeCalledTimes(1);
      expect(winstonInfoMock).toBeCalledWith(...infoArgs);
    }
  });
});
