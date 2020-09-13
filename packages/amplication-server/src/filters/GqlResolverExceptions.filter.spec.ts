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
  UniqueKeyException
} from './GqlResolverExceptions.filter';

const winstonErrorMock = jest.fn();
const configServiceGetMock = jest.fn(() => 'production');

const EXAMPLE_ERROR_MESSAGE = 'Example Error Message';
const EXAMPLE_FIELDS = ['exampleField', 'exampleOtherField'];
const EXAMPLE_PRISMA_UNKNOWN_ERROR = new PrismaClientKnownRequestError(
  EXAMPLE_ERROR_MESSAGE,
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
            error: winstonErrorMock
          }
        },
        GqlResolverExceptionsFilter
      ],
      imports: []
    }).compile();

    filter = module.get<GqlResolverExceptionsFilter>(
      GqlResolverExceptionsFilter
    );
    // Override prepareRequestData to avoid passing a valid ArgumentHost
    filter.prepareRequestData = () => null;
  });
  const cases: Array<[string, Error, Error]> = [
    [
      'PrismaClientKnownRequestError unique key',
      new PrismaClientKnownRequestError(
        EXAMPLE_ERROR_MESSAGE,
        PRISMA_CODE_UNIQUE_KEY_VIOLATION,
        { target: EXAMPLE_FIELDS }
      ),
      new UniqueKeyException(EXAMPLE_FIELDS)
    ],
    [
      'PrismaClientKnownRequestError unknown',
      EXAMPLE_PRISMA_UNKNOWN_ERROR,
      new InternalServerError()
    ],
    [
      'AmplicationError',
      new AmplicationError(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE)
    ],
    [
      'HttpException',
      new NotFoundException(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE)
    ],
    ['Error', new Error(EXAMPLE_ERROR_MESSAGE), new InternalServerError()]
  ];
  test.each(cases)('%s', (name, exception, expected) => {
    const host = {} as ArgumentsHost;
    expect(filter.catch(exception, host)).toEqual(expected);
  });
});
