import { ArgumentsHost, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { Prisma } from "../prisma";
import { ApolloError } from "apollo-server-express";
import { AmplicationError } from "../errors/AmplicationError";
import {
  createRequestData,
  GqlResolverExceptionsFilter,
  InternalServerError,
  PRISMA_CODE_UNIQUE_KEY_VIOLATION,
  RequestData,
  UniqueKeyException,
} from "./GqlResolverExceptions.filter";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

const errorMock = jest.fn();
const infoMock = jest.fn();
const configServiceGetMock = jest.fn(() => "production");
const prepareRequestDataMock = jest.fn(() => null);

const EXAMPLE_ERROR_MESSAGE = "Example Error Message";
const EXAMPLE_FIELDS = ["exampleField", "exampleOtherField"];
const EXAMPLE_PRISMA_UNKNOWN_ERROR = new Prisma.PrismaClientKnownRequestError(
  "Example Prisma unknown error message",
  { code: "UNKNOWN_CODE", clientVersion: Prisma.prismaVersion.client }
);
const EXAMPLE_ERROR = new Error(EXAMPLE_ERROR_MESSAGE);
const EXAMPLE_QUERY = "EXAMPLE_QUERY";
const EXAMPLE_HOSTNAME = "EXAMPLE_HOSTNAME";
const EXAMPLE_IP = "EXAMPLE_IP";
const EXAMPLE_USER_ID = "EXAMPLE_USER_ID";
const EXAMPLE_REQUEST = {
  hostname: EXAMPLE_HOSTNAME,
  ip: EXAMPLE_IP,
};
const EXAMPLE_BODY = {
  query: EXAMPLE_QUERY,
};
const EXAMPLE_USER = {
  id: EXAMPLE_USER_ID,
};

describe("GqlResolverExceptionsFilter", () => {
  let filter: GqlResolverExceptionsFilter;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock,
          },
        },
        {
          provide: AmplicationLogger,
          useValue: {
            error: errorMock,
            info: infoMock,
          },
        },
        GqlResolverExceptionsFilter,
      ],
      imports: null,
    }).compile();

    filter = module.get<GqlResolverExceptionsFilter>(
      GqlResolverExceptionsFilter
    );
    // Override prepareRequestData to avoid passing a valid ArgumentHost
    filter.prepareRequestData = prepareRequestDataMock;

    jest.clearAllMocks();
  });
  const cases: Array<
    [
      string,
      Error,
      Error,
      [string, { requestData: RequestData | null }] | [string, Error] | null,
      [string, { requestData: RequestData | null }] | null
    ]
  > = [
    [
      "PrismaClientKnownRequestError unique key",
      new Prisma.PrismaClientKnownRequestError(EXAMPLE_ERROR_MESSAGE, {
        code: PRISMA_CODE_UNIQUE_KEY_VIOLATION,
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          target: EXAMPLE_FIELDS,
        },
      }),
      new UniqueKeyException(EXAMPLE_FIELDS),
      null,
      [new UniqueKeyException(EXAMPLE_FIELDS).message, { requestData: null }],
    ],
    [
      "PrismaClientKnownRequestError unknown",
      EXAMPLE_PRISMA_UNKNOWN_ERROR,
      new InternalServerError(),
      [EXAMPLE_PRISMA_UNKNOWN_ERROR.message, EXAMPLE_PRISMA_UNKNOWN_ERROR],
      null,
    ],
    [
      "AmplicationError",
      new AmplicationError(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE),
      null,
      [EXAMPLE_ERROR_MESSAGE, { requestData: null }],
    ],
    [
      "HttpException",
      new NotFoundException(EXAMPLE_ERROR_MESSAGE),
      new ApolloError(EXAMPLE_ERROR_MESSAGE),
      null,
      [EXAMPLE_ERROR_MESSAGE, { requestData: null }],
    ],
    [
      "Error",
      EXAMPLE_ERROR,
      new InternalServerError(),
      [EXAMPLE_ERROR.message, EXAMPLE_ERROR],
      null,
    ],
  ];
  test.each(cases)("%s", (name, exception, expected, errorArgs, infoArgs) => {
    const host = {} as ArgumentsHost;
    expect(filter.catch(exception, host)).toEqual(expected);
    if (errorArgs) {
      expect(errorMock).toBeCalledTimes(1);
      expect(errorMock).toBeCalledWith(...errorArgs);
    }
    if (infoArgs) {
      expect(infoMock).toBeCalledTimes(1);
      expect(infoMock).toBeCalledWith(...infoArgs);
    }
  });
});

describe("createRequestData", () => {
  const cases: Array<[string, any, RequestData]> = [
    [
      "with user and body",
      { ...EXAMPLE_REQUEST, body: EXAMPLE_BODY, user: EXAMPLE_USER },
      {
        query: EXAMPLE_QUERY,
        hostname: EXAMPLE_HOSTNAME,
        ip: EXAMPLE_IP,
        userId: EXAMPLE_USER_ID,
      },
    ],
    [
      "without body",
      { ...EXAMPLE_REQUEST, user: EXAMPLE_USER },
      {
        query: undefined,
        hostname: EXAMPLE_HOSTNAME,
        ip: EXAMPLE_IP,
        userId: EXAMPLE_USER_ID,
      },
    ],
    [
      "without user",
      { ...EXAMPLE_REQUEST, body: EXAMPLE_BODY },
      {
        query: EXAMPLE_QUERY,
        hostname: EXAMPLE_HOSTNAME,
        ip: EXAMPLE_IP,
        userId: undefined,
      },
    ],
    [
      "without user any body",
      EXAMPLE_REQUEST,
      {
        hostname: EXAMPLE_HOSTNAME,
        ip: EXAMPLE_IP,
        query: undefined,
        userId: undefined,
      },
    ],
  ];
  test.each(cases)("%s", (name, req, expected) => {
    expect(createRequestData(req)).toEqual(expected);
  });
});
